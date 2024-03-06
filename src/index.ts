import {
  ALU,
  DebugIOUnit,
  ImmediateUnit,
  MemoryUnit,
  PCUnit,
  RegisterUnit,
  StackUnit,
} from "./FunctionalUnits";
import { AssemblyInstruction } from "./types";
import { VM } from "./vm";

const load = (val: number): AssemblyInstruction[] => {
  return [
    ["IMM_LOW", (val & 0x0000ffff).toString(16)],
    ...((val & 0xffff0000
      ? [["IMM_HIGH", (val & 0xffff0000).toString(16)]]
      : []) as AssemblyInstruction[]),
  ];
};

const c = VM(
  PCUnit(),
  ImmediateUnit(),
  RegisterUnit(32),
  StackUnit(),
  ALU(),
  MemoryUnit(),
  DebugIOUnit()
);

console.log(c("registers"));

c("loadInstructions", [
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

console.time("all");
for (let j = 0; j < 100; j++) {
  console.time("cycle");
  for (let i = 0; i < 4000; i++) {
    c("cycle");
  }
  c("reset");
  console.timeEnd("cycle");
}
console.timeEnd("all");
