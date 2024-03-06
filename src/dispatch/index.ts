import type { Dispatched, FirstArgumentType, OptionalProperties } from "../types";

type Slots = Record<string, any>;

export const makeDispatchable = <T extends Record<string, any>>(o: T) => Object.fromEntries(
  Object.entries(o).map(([key, value]) => ([key, typeof value === 'function' ? value : () => value]))
) as Dispatched<T>;

export const dispatch =
  <T extends Slots>(defaults: OptionalProperties<T>, slots: T) => {
    const dispatchableDefaults = makeDispatchable(defaults);
    const dispatchableSlots = makeDispatchable(slots)
    return <K extends keyof T>(
      slot: K,
      ...args: T[K] extends (...args: infer P) => any ? P : []
    ): ReturnType<Dispatched<Required<T>>[K]> => {
      const d = (dispatchableDefaults as Partial<T>)[slot];
      const s = dispatchableSlots[slot];
      if (typeof s === 'function') {
        return s(...args);
      } else if (typeof d === 'function') {
        return d(...args);
      }
      throw new Error(`Unknown slot: ${slot.toString()}`);
    };
  };

export const indexedDispatch = <T extends Slots>(defaults: FirstArgumentType<typeof dispatch<T>>, objects: T[]) => {
  if (objects.length === 0) {
    throw new Error('indexedDispatch must have objects to index');
  }
  const dispatchers = objects.map((o) =>
    dispatch(defaults, o),
  );
  return <K extends keyof T>(slot: K, index: number, ...args: Parameters<Dispatched<T>[K]>) => {
    const d = dispatchers[index];
    if (d === undefined) {
      throw new Error(`inalid dispatch index ${index}`);
    }
    return d(slot, ...args as any);
  };
};
