import { Port } from "../types";
import { functionalUnit } from "./FunctionalUnit";

export const RegisterUnit = (count: number, subname?: string) => {
  let registers: number[] = [];
  const ports: Port[] = Array(count)
    .fill({})
    .map((_, index) => ({
      name: index.toString(),
      read: () => registers[index] ?? 0,
      write: (val) => (registers[index] = val),
    }));
  return functionalUnit({
    basename: "REG",
    subname,
    reset: () => (registers = []),
    ports,
  });
};
