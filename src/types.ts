export type LabelClass = "lg";

export type Key = {
  code: string;
  label?: string[];
  str?: string;
  cn?: LabelClass;
};

export type KeyFunc = (...l: string[]) => Key;

export type Config = {
  layers: {
    [key: string]: {
      typing: Key[][];
      fn: Key[][];
    };
  };
  lens: number[];
  wids: number[][];
};
