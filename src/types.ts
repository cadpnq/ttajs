export interface Port {
  name: string;
  read?: () => number;
  write?: (val: number) => void;
  inhibitRead?: boolean;
}

export type AssemblyInstruction = [string, string];
export type Instruction = () => void;

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type OptionalValues<T> = Required<{
  [K in OptionalKeys<T>]: NonNullable<T[K]>;
}>;

export type OptionalProperties<T> = {
  [K in OptionalKeys<T>]: OptionalValues<T>[K];
};

export type FirstArgumentType<T extends (...args: any[]) => any> =
  T extends (arg1: infer U, ...args: any[]) => any ? U : never;

export type Dispatched<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Function ? T[K] : () => T[K];
};