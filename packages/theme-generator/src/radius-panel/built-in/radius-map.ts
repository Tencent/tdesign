import { RADIUS_TOKENS } from '@/common/themes/presets';

export { RADIUS_STEP_ARRAY } from '@/common/themes/presets';

export interface RadiusTokenItem {
  token: string;
  enDesc: string;
  desc: string;
  value?: string | number;
}

export const RADIUS_TOKEN_LIST: RadiusTokenItem[] = [
  {
    token: RADIUS_TOKENS[0],
    enDesc: 'internal scenes of basic components.',
    desc: '适用于基础组件内部场景',
  },
  {
    token: RADIUS_TOKENS[1],
    enDesc: 'basic components',
    desc: '适用于所有基础组件',
  },
  {
    token: RADIUS_TOKENS[2],
    enDesc: 'popup and card-type components',
    desc: '适用于弹出类型和卡片类型组件',
  },
  {
    token: RADIUS_TOKENS[3],
    enDesc: 'dialog-type components',
    desc: '适用于对话框类型组件',
  },
  {
    token: RADIUS_TOKENS[4],
    enDesc: 'extra-large display-type components',
    desc: '适用于超大型展示型组件',
  },
  {
    token: RADIUS_TOKENS[5],
    enDesc: 'circular components',
    desc: '适用于圆形组件',
  },
];

export interface RadiusOption {
  label: string;
  enLabel: string;
  value: number;
  disabled?: boolean;
}

export const RADIUS_OPTIONS: RadiusOption[] = [
  { label: '全直角', enLabel: 'mini', value: 1 },
  { label: '小圆角', enLabel: 'small', value: 2 },
  { label: '默认', enLabel: 'default', value: 3 },
  { label: '大圆角', enLabel: 'large', value: 4 },
  { label: '超大', enLabel: 'max', value: 5 },
  { label: '自定义', enLabel: 'customized', value: 6, disabled: true },
];

export const RADIUS_LABELS: Record<number, string> = Object.fromEntries(
  RADIUS_OPTIONS.map((item, index) => [index + 1, item.label]),
);
