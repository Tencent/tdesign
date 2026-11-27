export { LINE_HEIGHT_STEPS, parseLineHeightOption } from '@/common/themes/line-height';
export { updateLineHeightTokens } from '@/common/themes/core';

export interface LineHeightOption {
  label: string;
  enLabel: string;
  value: number;
  disabled?: boolean;
}

export const LINE_HEIGHT_OPTIONS: LineHeightOption[] = [
  { label: '超小', enLabel: 'mini', value: 1 },
  { label: '小', enLabel: 'small', value: 2 },
  { label: '默认', enLabel: 'default', value: 3 },
  { label: '大', enLabel: 'large', value: 4 },
  { label: '特大', enLabel: 'max', value: 5 },
  { label: '自定义', enLabel: 'customized', value: 6, disabled: true },
];
