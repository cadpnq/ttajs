import type { FirstArgumentType, OptionalProperties, StrictReturnType } from "../types";

export type Slots = Record<string, any>;

export const dispatch =
  <T extends Slots>(defaults: OptionalProperties<T>, slots: T) =>
  <K extends keyof T>(
    slot: K,
    ...args: Parameters<T[K]>
  ): StrictReturnType<T[K]> => {
    const d = (defaults as Partial<T>)[slot];
    const s = slots[slot];
    if (typeof s === "function") {
      return s(...args);
    } else if (typeof d === "function") {
      return d(...args);
    }
    throw new Error(`Unknown slot: ${slot.toString()}`);
  };

export const indexedDispatch = <T extends Slots>(
  defaults: FirstArgumentType<typeof dispatch<T>>,
  objects: T[]
) => {
  if (objects.length === 0) {
    throw new Error("must have objects to index");
  }
  const dispatchers = objects.map((o) => dispatch(defaults, o));
  return <K extends keyof T>(
    slot: K,
    index: number,
    ...args: Parameters<T[K]>
  ) => {
    const d = dispatchers[index];
    if (d === undefined) {
      throw new Error("inalid dispatch index");
    }
    return d(slot, ...args);
  };
};
