import {
  ALU,
  DebugIOUnit,
  FunctionalUnit,
  ImmediateUnit,
  MemoryUnit,
  PCUnit,
  RegisterUnit,
  StackUnit,
} from "./FunctionalUnits";
import { dispatch } from "./dispatch";
import { Instruction } from "./types";

const computer = (...functionalUnits: FunctionalUnit[]) => {
  const registers = functionalUnits.map((fu) => fu("names")).flat();
  type DispatchedPort = (method: string, ...args: any[]) => any;
  const ports: DispatchedPort[] = functionalUnits
    .map((fu) => Array(fu("size")).fill(fu))
    .map((fu) =>
      fu.map(
        (f, index) =>
          (method: string, ...args: any[]) =>
            f(method, index, ...args)
      )
    )
    .flat();

  let microcode: (() => void)[] = [];
  return dispatch(
    {},
    {
      reset: () => functionalUnits.map((fu) => fu("reset")),
      cycle: () => {
        const pc = ports[0]("read");
        ports[0]("write", pc + 1);
        microcode[pc]();
      },
      registers: () => registers,
      microcode: () => microcode,
      load: (instructions: Instruction[]) => {
        microcode = instructions.map(([destination, source]: Instruction) => {
          const sourceIndex = registers.indexOf(source);
          const destinationIndex = registers.indexOf(destination);
          console.log(
            `sourceIndex: ${sourceIndex}, destinationIndex: ${destinationIndex}`
          );
          return ports[destinationIndex]("inhibitRead")
            ? () =>
                ports[destinationIndex]("write", Number.parseInt(source, 16))
            : () =>
                ports[destinationIndex]("write", ports[sourceIndex]("read"));
        });
      },
    }
  );
};

const load = (val: number): Instruction[] => {
  return [
    ["IMM_LOW", (val & 0x0000ffff).toString(16)],
    ...((val & 0xffff0000
      ? [["IMM_HIGH", (val & 0xffff0000).toString(16)]]
      : []) as Instruction[]),
  ];
};

const c = computer(
  PCUnit(),
  ImmediateUnit(),
  RegisterUnit(32000),
  StackUnit(),
  ALU(),
  MemoryUnit(),
  DebugIOUnit()
);

console.log(c("registers"));

c("load", [
  ...load(6),
  ["ADDR_TARGET", "IMM_VALUE"],
  ...load(1),
  ["REG_0", "IMM_VALUE"],
  ["DEBUG_LOG", "REG_1"],
  ["DEBUG_LOG", "REG_0"],

  ["ALU_A", "REG_0"],
  ["ALU_B", "REG_1"],
  ["DEBUG_LOG", "ALU_PLUS"],
  ["REG_1", "REG_0"],
  ["REG_0", "ALU_PLUS"],

  ["ADDR_BRANCH", "IMM_VALUE"],
]);

console.time("cycle");
for (let i = 0; i < 400; i++) {
  c("cycle");
}
console.timeEnd("cycle");
