import { functionalUnit } from "./FunctionalUnit";

export const DebugIOUnit = (subname?: string) => {
  return functionalUnit({
    basename: "DEBUG",
    subname,
    reset: () => {},
    ports: [{ name: "LOG", write: (val) => 0
    //console.log(val) 
    }],
  });
};