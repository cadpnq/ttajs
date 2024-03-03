import { functionalUnit } from "./FunctionalUnit";


export const PCUnit = (subname?: string) => {
  let pc = 0;
  let branchTarget = 0;
  return functionalUnit({
    basename: "ADDR",
    subname,
    reset: () => {
      pc = 0;
      branchTarget = 0;
    },
    ports: [
      { name: () => "PC", write: (val) => (pc = val), read: () => pc },
      {
        name: () => "TARGET",
        write: (val) => (branchTarget = val),
        read: () => branchTarget,
      },
      {
        name: () => "BRANCH",
        write: (val) => {
          if (val & 0x1) {
            pc = branchTarget;
          }
        },
      },
    ],
  });
};