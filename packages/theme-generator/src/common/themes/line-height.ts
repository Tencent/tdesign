export const LINE_HEIGHT_STEPS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
};

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

/** Calculate line-height tokens from font sizes without reading DOM or storage. */
export function calculateLineHeightTokens(
  fontSizes: Record<string, string>,
  commonVal: string | number,
  type: 'plus' | 'time' = 'plus',
): Record<string, string> {
  const commonValNum = parseFloat(String(commonVal));
  if (isNaN(commonValNum)) return {};

  const tokens: Record<string, string> = {};
  Object.entries(fontSizes).forEach(([name, fontSize]) => {
    if (!fontSize) return;
    const fontSizeNum = parseFloat(fontSize);
    const value = type === 'plus' ? fontSizeNum + commonValNum : fontSizeNum * commonValNum;
    tokens[name.replace('--td-font-size-', '--td-line-height-')] = `${value}px`;
  });
  return tokens;
}
