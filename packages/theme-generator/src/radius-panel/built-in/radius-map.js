export const RADIUS_TOKEN_LIST = [
  {
    token: '--td-radius-small',
    enDesc: 'internal scenes of basic components.',
    desc: '适用于基础组件内部场景',
  },
  {
    token: '--td-radius-default',
    enDesc: 'basic components',
    desc: '适用于所有基础组件',
  },
  {
    token: '--td-radius-medium',
    enDesc: 'popup and card-type components',
    desc: '适用于弹出类型和卡片类型组件',
  },
  {
    token: '--td-radius-large',
    enDesc: 'dialog-type components',
    desc: '适用于对话框类型组件',
  },
  {
    token: '--td-radius-extraLarge',
    enDesc: 'extra-large display-type components',
    desc: '适用于超大型展示型组件',
  },
  {
    token: '--td-radius-circle',
    enDesc: 'circular components',
    desc: '适用于圆形组件',
  },
];

export const RADIUS_OPTIONS = [
  { label: '全直角', enLabel: 'mini', value: 1 },
  { label: '小圆角', enLabel: 'small', value: 2 },
  { label: '默认', enLabel: 'default', value: 3 },
  { label: '大圆角', enLabel: 'large', value: 4 },
  { label: '超大', enLabel: 'max', value: 5 },
  { label: '自定义', enLabel: 'customized', value: 6, disabled: true },
];

export const RADIUS_LABELS = Object.fromEntries(RADIUS_OPTIONS.map((item, index) => [index + 1, item.label]));

export const RADIUS_STEP_ARRAY = [
  [0, 0, 0, 0, 0, '50%'],
  [1, 2, 4, 6, 8, '50%'],
  [2, 3, 6, 9, 12, '50%'],
  [3, 4, 8, 12, 16, '50%'],
  [4, 6, 12, 18, 24, '50%'],
];
