import { indexedDispatch, dispatch } from "../dispatch";
import { Port } from "../types";

export type FunctionalUnit = ReturnType<typeof functionalUnit>;
export const functionalUnit = ({
  basename,
  subname = "",
  reset,
  ports,
}: {
  basename: string;
  subname?: string;
  reset: () => void;
  ports: Port[];
}) => {
  const portDispatcher = indexedDispatch<Port>(
    { read: () => 0, write: (val) => undefined, inhibitRead: false },
    ports,
  );
  return dispatch({},{
    read: (i: number) => portDispatcher("read", i),
    write: (i: number, val: number) => portDispatcher("write", i, val),
    inhibitRead: (i: number) => portDispatcher("inhibitRead", i),
    size: () => ports.length,
    names: () => ports.map(({ name }) => `${basename}${subname}_${name}`),
    reset,
  });
};


