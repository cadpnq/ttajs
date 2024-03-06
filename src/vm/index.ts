import { FunctionalUnit } from "../FunctionalUnits";
import { dispatch } from "../dispatch";
import { AssemblyInstruction, Instruction } from "../types";

export const VM = (...functionalUnits: FunctionalUnit[]) => {
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
  let instructions: Instruction[] = [];

  const self = dispatch({}, {
    reset: () => functionalUnits.map((fu) => fu("reset")),
    cycle: () => {
      const pc = ports[0]("read");
      ports[0]("write", pc + 1);
      instructions[pc]();
    },
    registers: () => registers,
    instructions: () => instructions,
    loadInstructions: (assembly: AssemblyInstruction[]) => {
      instructions = assembly.map<Instruction>(([destination, source]: AssemblyInstruction) => {
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
  });
  return self;
};