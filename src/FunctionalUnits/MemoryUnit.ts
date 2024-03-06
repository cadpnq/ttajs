import { functionalUnit } from "./FunctionalUnit";

export const MemoryUnit = (subname?: string) => {
  let memory: number[] = [];
  let address = 0;
  return functionalUnit({
    basename: "MEM",
    subname,
    reset: () => (memory = []),
    ports: [
      { name: "ADDRESS", write: (val) => (address = val) },
      {
        name: "DATA",
        write: (val) => (memory[address] = val),
        read: () => memory[address] ?? 0,
      },
    ],
  });
};