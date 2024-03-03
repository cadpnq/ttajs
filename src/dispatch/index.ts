import type { ExtractedReturnTypes, OptionalValues } from "../types";

export const dispatch =
  <T extends Record<string, (...args: any[]) => any>>(methods: T) =>
  <K extends keyof T>(
    method: K,
    ...args: Parameters<T[K]>
  ): ReturnType<T[K]> => {
    if (methods[method] !== undefined) {
      return methods[method](...args) as ReturnType<T[K]>;
    }
    throw new Error(`Method '${method.toString()}' not found`);
  };

export const indexedDispatch = <T extends Record<string, any>>(
  defaults: ExtractedReturnTypes<OptionalValues<T>>,
  objects: T[]
) => {
  if (objects.length === 0) throw new Error("must have objects to index");
  return <K extends keyof T>(
    method: K,
    index: number,
    ...args: NonNullable<T[K]> extends Function ? Parameters<T[K]> : never[]
  ): NonNullable<T[K]> extends (...args: any[]) => infer R ? R : T[K] => {
    if (objects[index]?.[method] === undefined) {
      return (defaults as Partial<T>)[method] as T[K];
    }
    if (typeof objects[index]?.[method] === "function") {
      return objects[index][method](...args) as ReturnType<T[K]>;
    }
    return objects[index]?.[method];
  };
};
