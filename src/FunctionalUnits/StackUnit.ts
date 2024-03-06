import { functionalUnit } from "./FunctionalUnit";

export const StackUnit = (subname?: string) => {
  let stack: number[] = [];
  return functionalUnit({
    basename: "STACK",
    subname,
    reset: () => (stack = []),
    ports: [
      { name: "PUSH", write: (val) => stack.push(val) },
      { name: "POP", read: () => stack.pop() ?? 0 },
    ],
  });
};