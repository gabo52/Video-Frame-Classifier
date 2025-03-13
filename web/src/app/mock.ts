import { RangeLabeled } from "../../types";

const rangeNormal: RangeLabeled = {
  label: "normal",
  rangesClip: [],
};

const rangeAbnormal: RangeLabeled = {
  label: "abnormal",
  rangesClip: [],
};

const rangeNa: RangeLabeled = {
  label: "NA",
  rangesClip: [],
};

export const rangesLabeledDefault = [rangeNormal, rangeAbnormal, rangeNa];
