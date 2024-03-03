import { functionalUnit } from "./FunctionalUnit";

export const ALU = (subname?: string) => {
  let a = 0;
  let b = 0;
  return functionalUnit({
    basename: "ALU",
    subname,
    reset: () => {
      a = 0;
      b = 0;
    },
    ports: [
      { name: "A", write: (val) => (a = val) },
      { name: "B", write: (val) => (b = val) },
      { name: "PLUS", read: () => a + b },
      { name: "SUB", read: () => a - b },
      { name: "AND", read: () => a & b },
      { name: "OR", read: () => a | b },
      { name: "NOT", read: () => ~a },
      { name: "GT", read: () => (a > b ? 1 : 0) },
      { name: "LT", read: () => (a < b ? 1 : 0) },
      { name: "GTE", read: () => (a >= b ? 1 : 0) },
      { name: "LTE", read: () => (a <= b ? 1 : 0) },
    ],
  });
};