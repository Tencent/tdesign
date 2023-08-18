const Radius_MAP = [
  { label: "全直角", enLabel:'mini', value: 1 },
  { label: "小圆角", enLabel:'small', value: 2 },
  { label: "默认", enLabel:'default', value: 3 },
  { label: "大圆角", enLabel:'large', value: 4 },
  { label: "超大", enLabel:'max', value: 5 },
  { label: "自定义", enLabel:'customized', value: 6, disabled: true },
];

const RadiusLabels = {
  1: "全直角",
  2: "小圆角",
  3: "默认",
  4: "大圆角",
  5: "超大",
};

const RadiusSteps = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
};

const RadiusStepArray = [
  [0, 0, 0, 0, 0, "50%"],
  [1, 2, 4, 6, 8, "50%"],
  [2, 3, 6, 9, 12, "50%"],
  [3, 4, 8, 12, 16, "50%"],
  [4, 6, 12, 18, 24, "50%"],
];
export { Radius_MAP, RadiusLabels, RadiusSteps, RadiusStepArray };
