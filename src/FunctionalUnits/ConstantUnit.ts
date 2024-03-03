import { Port } from "../types";
import { functionalUnit } from "./FunctionalUnit";

export const ConstantUnit = (values: number[], subname?: string) => {
  const ports: Port[] = Array(values.length)
    .fill({})
    .map((_, index) => ({
      name: () => values[index].toString(),
      read: () => values[index] ?? 0,
    }));
  return functionalUnit({
    basename: "REG",
    subname,
    reset: () => {},
    ports,
  });
};