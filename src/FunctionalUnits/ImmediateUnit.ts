import { functionalUnit } from "./FunctionalUnit";


export const ImmediateUnit = (subname?: string) => {
  let value = 0;
  return functionalUnit({
    basename: "IMM",
    subname,
    reset: () => {
      value = 0;
    },
    ports: [
      {
        name: () => "HIGH",
        write: (val) => {
          value &= 0x0000ffff;
          value |= (val & 0xffff0000) << 16;
        },
        inhibitRead: () => true,
      },
      {
        name: () => "LOW",
        write: (val) => {
          value &= 0xffff0000;
          value |= val & 0x0000ffff;
        },
        inhibitRead: () => true,
      },
      { name: () => "VALUE", read: () => value },
    ],
  });
};