export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type OptionalValues<T> = Required<{
  [K in OptionalKeys<T>]: NonNullable<T[K]>;
}>;

export type ExtractedReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : T[K];
};

export interface Port {
  name: string;
  read?: () => number;
  write?: (val: number) => void;
  inhibitRead?: boolean;
}

export type Instruction = [string, string];
