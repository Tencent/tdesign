export const SIZE_TOKENS = Array.from({ length: 16 }, (_, i) => `--td-size-${i + 1}`);

// 基础尺寸默认值
export const SIZE_DEFAULT_VALUES = {
  '--td-size-1': '2px',
  '--td-size-2': '4px',
  '--td-size-3': '6px',
  '--td-size-4': '8px',
  '--td-size-5': '12px',
  '--td-size-6': '16px',
  '--td-size-7': '20px',
  '--td-size-8': '24px',
  '--td-size-9': '28px',
  '--td-size-10': '32px',
  '--td-size-11': '36px',
  '--td-size-12': '40px',
  '--td-size-13': '48px',
  '--td-size-14': '56px',
  '--td-size-15': '64px',
  '--td-size-16': '72px',
};

// 组件尺寸默认值
export const COMP_SIZE_DEFAULT_VALUES = {
  '--td-comp-size-xxxs': '16px',
  '--td-comp-size-xxs': '20px',
  '--td-comp-size-xs': '24px',
  '--td-comp-size-s': '28px',
  '--td-comp-size-m': '32px',
  '--td-comp-size-l': '36px',
  '--td-comp-size-xl': '40px',
  '--td-comp-size-xxl': '48px',
  '--td-comp-size-xxxl': '56px',
  '--td-comp-size-xxxxl': '64px',
  '--td-comp-size-xxxxxl': '72px',
};

// 组件大小列表
export const COMP_SIZE_MAP = [
  {
    name: 'comp-size-xxxs',
    from: 'size-6',
  },
  {
    name: 'comp-size-xxs',
    from: 'size-7',
  },
  {
    name: 'comp-size-xs',
    from: 'size-8',
  },
  {
    name: 'comp-size-s',
    from: 'size-9',
  },
  {
    name: 'comp-size-m',
    from: 'size-10',
  },
  {
    name: 'comp-size-l',
    from: 'size-11',
  },
  {
    name: 'comp-size-xl',
    from: 'size-12',
  },
  {
    name: 'comp-size-xxl',
    from: 'size-13',
  },
  {
    name: 'comp-size-xxxl',
    from: 'size-14',
  },
  {
    name: 'comp-size-xxxxl',
    from: 'size-15',
  },
  {
    name: 'comp-size-xxxxxl',
    from: 'size-16',
  },
];

// 组件左右边距列表
export const COMP_PADDING_LR_MAP = [
  {
    name: 'comp-paddingLR-xxs',
    from: 'size-1',
  },
  {
    name: 'comp-paddingLR-xs',
    from: 'size-2',
  },
  {
    name: 'comp-paddingLR-s',
    from: 'size-4',
  },
  {
    name: 'comp-paddingLR-m',
    from: 'size-5',
  },
  {
    name: 'comp-paddingLR-l',
    from: 'size-6',
  },
  {
    name: 'comp-paddingLR-xl',
    from: 'size-8',
  },
  {
    name: 'comp-paddingLR-xxl',
    from: 'size-10',
  },
];

// 组件上下边距列表
export const COMP_PADDING_TB_MAP = [
  {
    name: 'comp-paddingTB-xxs',
    from: 'size-1',
  },
  {
    name: 'comp-paddingTB-xs',
    from: 'size-2',
  },
  {
    name: 'comp-paddingTB-s',
    from: 'size-4',
  },
  {
    name: 'comp-paddingTB-m',
    from: 'size-5',
  },
  {
    name: 'comp-paddingTB-l',
    from: 'size-6',
  },
  {
    name: 'comp-paddingTB-xl',
    from: 'size-8',
  },
  {
    name: 'comp-paddingTB-xxl',
    from: 'size-10',
  },
];

// 组件弹出层边距列表
export const COMP_POPUP_PADDING_MAP = [
  {
    name: 'pop-padding-s',
    from: 'size-2',
  },
  {
    name: 'pop-padding-m',
    from: 'size-3',
  },
  {
    name: 'pop-padding-l',
    from: 'size-4',
  },
  {
    name: 'pop-padding-xl',
    from: 'size-5',
  },
  {
    name: 'pop-padding-xxl',
    from: 'size-6',
  },
];

// 组件间距列表
export const COMP_MARGIN_MAP = [
  {
    name: 'comp-margin-xxs',
    from: 'size-1',
  },
  {
    name: 'comp-margin-xs',
    from: 'size-2',
  },
  {
    name: 'comp-margin-s',
    from: 'size-4',
  },
  {
    name: 'comp-margin-m',
    from: 'size-5',
  },
  {
    name: 'comp-margin-l',
    from: 'size-6',
  },
  {
    name: 'comp-margin-xl',
    from: 'size-7',
  },
  {
    name: 'comp-margin-xxl',
    from: 'size-8',
  },
  {
    name: 'comp-margin-xxxl',
    from: 'size-10',
  },
  {
    name: 'comp-margin-xxxxl',
    from: 'size-12',
  },
];
