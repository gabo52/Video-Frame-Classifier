export type RangeClip = {
  id: string;
  rStart: number;
  rEnd: number;
};

export type RangeLabeled = {
  rangesClip: RangeClip[];
  label: string;
};
