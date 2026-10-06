import { modifyToken } from '@/common/themes';
import { getTokenValue } from '@/common/utils';

export const LINE_HEIGHT_STEPS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
};

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

const LINE_HEIGHT_TOKENS = [
  'link-small',
  'link-medium',
  'link-large',
  'mark-small',
  'mark-medium',
  'body-small',
  'body-medium',
  'body-large',
  'title-small',
  'title-medium',
  'title-large',
  'headline-small',
  'headline-medium',
  'headline-large',
  'display-medium',
  'display-large',
];

export function parseLineHeightOption(
  option: string | undefined,
): { type: 'plus' | 'time'; value: number } | undefined {
  if (typeof option !== 'string') return undefined;
  const match = /^(plus|time)_(\d+(?:\.\d+)?)$/.exec(option);
  if (!match) return undefined;
  const value = Number(match[2]);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return { type: match[1] as 'plus' | 'time', value };
}

export function updateLineHeightTokens(
  commonVal: string | number,
  type: 'plus' | 'time' = 'plus',
  writeToken: typeof modifyToken = modifyToken,
): void {
  LINE_HEIGHT_TOKENS.forEach((size) => {
    const fontSizeToken = `--td-font-size-${size}`;
    const lineHeightToken = `--td-line-height-${size}`;
    const fontSize = getTokenValue(fontSizeToken);
    const fontSizeNum = parseFloat(fontSize);
    const commonValNum = parseFloat(String(commonVal));

    if (!fontSize || isNaN(commonValNum)) return;

    let result = fontSizeNum;
    if (type === 'plus') {
      result = fontSizeNum + commonValNum;
    } else if (type === 'time') {
      result = fontSizeNum * commonValNum;
    }

    writeToken(lineHeightToken, result + 'px', false);
  });
}
