import { Color } from 'tvision-color';

import { appendStyleSheet } from '../utils';

import { DEFAULT_THEME } from './preset';
import { CUSTOM_DARK_ID, CUSTOM_THEME_ID } from './stylesheet';

/**
 * 默认主题的 `--td-brand-color-x` 系列 Token 对应的数值
 * - 浅色版直接交给算法生成
 * - 但深色版需要手动调整
 */
const DEFAULT_DARK_BRAND_PALETTE = [
  '#1b2f51',
  '#173463',
  '#143975',
  '#103d88',
  '#0d429a',
  '#054bbe',
  '#2667d4',
  '#4582e6',
  '#699ef5',
  '#96bbf8',
];

export function covert2Hex(color, format) {
  return `(${Color.colorTransform(color, 'hex', format).join(',')})`;
}

export function generateBrandPalette(hex, remainInput = false) {
  const lowCaseHex = hex.toLocaleLowerCase();

  const [{ colors, primary }] = Color.getColorGradations({
    colors: [lowCaseHex],
    step: 10,
    remainInput,
  });

  const isDefaultTheme = lowCaseHex === DEFAULT_THEME.value.toLocaleLowerCase();

  const lightBrandIdx = isDefaultTheme ? 7 : primary + 1;
  const lightPalette = [...colors];

  const darkPalette = isDefaultTheme ? DEFAULT_DARK_BRAND_PALETTE : [...colors].reverse();
  const darkBrandIdx = isDefaultTheme ? 8 : 6;

  return { lightPalette, lightBrandIdx, darkPalette, darkBrandIdx };
}

export function generateFunctionalPalette(hex, step = 10) {
  const lowCaseHex = hex.toLocaleLowerCase();
  const [{ colors }] = Color.getColorGradations({
    colors: [lowCaseHex],
    step,
  });

  const lightPalette = [...colors];
  const darkPalette = [...colors].reverse();

  return { lightPalette, darkPalette };
}

export function generateNeutralPalette(hex, isRelatedTheme) {
  if (isRelatedTheme) {
    return Color.getNeutralColor(hex);
  } else {
    return generateFunctionalPalette(hex, 14).lightPalette;
  }
}

export function updateStyleSheetColor(type, lightPalette, darkPalette) {
  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);
  const updateColorTokens = (styleSheet, palette) => {
    palette.forEach((color, index) => {
      const tokenName = `--td-${type}-color-${index + 1}`;
      const regExp = new RegExp(`${tokenName}:.*?;`, 'g');
      const replacement = `${tokenName}: ${color};`;
      styleSheet.innerHTML = styleSheet.innerHTML.replace(regExp, replacement);
    });
  };

  updateColorTokens(styleSheet, lightPalette);
  updateColorTokens(darkStyleSheet, darkPalette);
}

export function syncColorTokensToStyle(lightTokenMap, darkTokenMap) {
  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);
  const updateColorTokens = (styleSheet, tokenMap) => {
    tokenMap.forEach(({ name, idx }) => {
      const regExp = new RegExp(`${name}:.*?;`, 'g');
      const replacement = `${name}: var(--td-brand-color-${idx});`;
      styleSheet.innerHTML = styleSheet.innerHTML.replace(regExp, replacement);
    });
  };

  updateColorTokens(styleSheet, lightTokenMap);
  updateColorTokens(darkStyleSheet, darkTokenMap);
}
