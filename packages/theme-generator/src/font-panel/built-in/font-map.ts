export { FONT_SIZE_STEPS } from '@/common/themes/presets';
export type { FontSizeStep } from '@/common/themes/presets';

export interface FontSizeToken {
  label: string;
  isBold?: boolean;
  value?: string;
}

export const FONT_SIZE_TOKEN_LIST: FontSizeToken[] = [
  { label: '--td-font-size-link-small' },
  { label: '--td-font-size-link-medium' },
  { label: '--td-font-size-link-large' },
  { label: '--td-font-size-mark-small', isBold: true },
  { label: '--td-font-size-mark-medium', isBold: true },
  { label: '--td-font-size-body-small' },
  { label: '--td-font-size-body-medium' },
  { label: '--td-font-size-body-large' },
  { label: '--td-font-size-title-small', isBold: true },
  { label: '--td-font-size-title-medium', isBold: true },
  { label: '--td-font-size-title-large', isBold: true },
  { label: '--td-font-size-headline-small', isBold: true },
  { label: '--td-font-size-headline-medium', isBold: true },
  { label: '--td-font-size-headline-large', isBold: true },
  { label: '--td-font-size-display-medium', isBold: true },
  { label: '--td-font-size-display-large', isBold: true },
];

export interface FontSizeOption {
  label: string;
  enLabel: string;
  value: number;
  disabled?: boolean;
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { label: '超小号', enLabel: 'mini', value: 1 },
  { label: '小号', enLabel: 'small', value: 2 },
  { label: '默认', enLabel: 'default', value: 3 },
  { label: '大号', enLabel: 'large', value: 4 },
  { label: '特大号', enLabel: 'max', value: 5 },
  { label: '自定义', enLabel: 'customized', value: 6, disabled: true },
];

export const FONT_SIZE_LABELS: Record<number, string> = Object.fromEntries(
  FONT_SIZE_OPTIONS.map((item, index) => [index + 1, item.label]),
);

export interface FontColorToken {
  name: string;
  from?: string;
  value?: string;
}

export const FONT_COLOR_TOKEN_MAP: FontColorToken[] = [
  { name: '--td-text-color-primary', from: '--td-font-gray-1' },
  { name: '--td-text-color-secondary', from: '--td-font-gray-2' },
  { name: '--td-text-color-placeholder', from: '--td-font-gray-3' },
  { name: '--td-text-color-disabled', from: '--td-font-gray-4' },
  { name: '--td-text-color-anti', value: '#fff' },
  { name: '--td-text-color-brand', from: '--td-brand-color' },
  { name: '--td-text-color-link', from: '--td-brand-color' },
];
