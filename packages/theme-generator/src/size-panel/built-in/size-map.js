const sizeSteps = {
  3: [
    { name: "size-1", value: "2px" },
    { name: "size-2", value: "4px" },
    { name: "size-3", value: "6px" },
    { name: "size-4", value: "8px" },
    { name: "size-5", value: "12px" },
    { name: "size-6", value: "16px" },
    { name: "size-7", value: "20px" },
    { name: "size-8", value: "24px" },
    { name: "size-9", value: "28px" },
    { name: "size-10", value: "32px" },
    { name: "size-11", value: "36px" },
    { name: "size-12", value: "40px" },
    { name: "size-13", value: "48px" },
    { name: "size-14", value: "56px" },
    { name: "size-15", value: "64px" },
    { name: "size-16", value: "72px" },
  ],
};

const sizeLabels = {
  3: "默认",
};

const sizeArr = [
  { token:'--td-size-1',name: "size-1", value: "2px" },
  { token:'--td-size-2',name: "size-2", value: "4px" },
  { token:'--td-size-3',name: "size-3", value: "6px" },
  { token:'--td-size-4',name: "size-4", value: "8px" },
  { token:'--td-size-5',name: "size-5", value: "12px" },
  { token:'--td-size-6',name: "size-6", value: "16px" },
  { token:'--td-size-7',name: "size-7", value: "20px" },
  { token:'--td-size-8',name: "size-8", value: "24px" },
  { token:'--td-size-9',name: "size-9", value: "28px" },
  { token:'--td-size-10',name: "size-10", value: "32px" },
  { token:'--td-size-11',name: "size-11", value: "36px" },
  { token:'--td-size-12',name: "size-12", value: "40px" },
  { token:'--td-size-13',name: "size-13", value: "48px" },
  { token:'--td-size-14',name: "size-14", value: "56px" },
  { token:'--td-size-15',name: "size-15", value: "64px" },
  { token:'--td-size-16',name: "size-16", value: "72px" },
];

// 组件大小列表
const compSizeArr = [
  {
    label: "comp-size-xxxs",
    value: null,
    remark: "size-6",
  },
  {
    label: "comp-size-xxs",
    remark: "size-7",
    value: null,
  },
  {
    label: "comp-size-xs",
    remark: "size-8",
    value: null,
  },
  {
    remark: "size-9",
    value: null,
    label: "comp-size-s",
  },
  {
    remark: "size-10",
    value: null,
    label: "comp-size-m",
  },
  {
    remark: "size-11",
    value: null,
    label: "comp-size-l",
  },
  {
    remark: "size-12",
    value: null,
    label: "comp-size-xl",
  },
  {
    remark: "size-13",
    value: null,
    label: "comp-size-xxl",
  },
  {
    remark: "size-14",
    value: null,
    label: "comp-size-xxxl",
  },
  {
    remark: "size-15",
    value: null,
    label: "comp-size-xxxxl",
  },
  {
    remark: "size-16",
    value: null,
    label: "comp-size-xxxxxl",
  },
];

// 组件左右边距列表
const compPaddingLRArr = [
  {
    label: "comp-paddingLR-xxs",
    remark: "size-1",
    value: null,
  },
  {
    label: "comp-paddingLR-xs",
    remark: "size-2",
    value: null,
  },
  {
    label: "comp-paddingLR-s",
    remark: "size-4",
    value: null,
  },
  {
    label: "comp-paddingLR-m",
    remark: "size-5",
    value: null,
  },
  {
    label: "comp-paddingLR-l",
    remark: "size-6",
    value: null,
  },
  {
    label: "comp-paddingLR-xl",
    remark: "size-8",
    value: null,
  },
  {
    label: "comp-paddingLR-xxl",
    remark: "size-10",
    value: null,
  },
];

// 组件上下边距列表
const compPaddingTBArr = [
  {
    label: "comp-paddingTB-xxs",
    remark: "size-1",
    value: null,
  },
  {
    label: "comp-paddingTB-xs",
    remark: "size-2",
    value: null,
  },
  {
    label: "comp-paddingTB-s",
    remark: "size-4",
    value: null,
  },
  {
    label: "comp-paddingTB-m",
    remark: "size-5",
    value: null,
  },
  {
    label: "comp-paddingTB-l",
    remark: "size-6",
    value: null,
  },
  {
    label: "comp-paddingTB-xl",
    remark: "size-8",
    value: null,
  },
  {
    label: "comp-paddingTB-xxl",
    remark: "size-10",
    value: null,
  },
];

// 组件弹出层边距列表
const compPopupPaddingArr = [
  {
    label: "pop-padding-s",
    remark: "size-2",
    value: null,
  },
  {
    label: "pop-padding-m",
    remark: "size-3",
    value: null,
  },
  {
    label: "pop-padding-l",
    remark: "size-4",
    value: null,
  },
  {
    label: "pop-padding-xl",
    remark: "size-5",
    value: null,
  },
  {
    label: "pop-padding-xxl",
    remark: "size-6",
    value: null,
  },
];

// 组件间距列表
const compMarginArr = [
  {
    label: "comp-margin-xxs",
    remark: "size-1",
    value: null,
  },
  {
    label: "comp-margin-xs",
    remark: "size-2",
    value: null,
  },
  {
    label: "comp-margin-s",
    remark: "size-4",
    value: null,
  },
  {
    label: "comp-margin-m",
    remark: "size-5",
    value: null,
  },
  {
    label: "comp-margin-l",
    remark: "size-6",
    value: null,
  },
  {
    label: "comp-margin-xl",
    remark: "size-7",
    value: null,
  },
  {
    label: "comp-margin-xxl",
    remark: "size-8",
    value: null,
  },
  {
    label: "comp-margin-xxxl",
    remark: "size-10",
    value: null,
  },
  {
    label: "comp-margin-xxxxl",
    remark: "size-12",
    value: null,
  },
];

export {
  sizeLabels,
  sizeSteps,
  sizeArr,
  compSizeArr,
  compPaddingLRArr,
  compPaddingTBArr,
  compPopupPaddingArr,
  compMarginArr,
};
