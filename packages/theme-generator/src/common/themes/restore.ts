import { getTokenValue } from '../utils';

import { applyTokenToStyle, getOptionFromLocal, getTokenFromLocal, updateLineHeightTokens } from './core';
import { parseLineHeightOption } from './line-height';
import {
  FONT_SIZE_STEPS,
  RADIUS_STEP_ARRAY,
  RADIUS_TOKENS,
  ShadowSelectDetail,
  ShadowSelectType,
  SHADOW_TOKENS,
} from './presets';

function restoreToken(name: string, value: string): void {
  // Different devices expose different token sets; never add unsupported tokens.
  if (getTokenValue(name)) applyTokenToStyle(name, value);
}

/** Recalculate saved line height after font edits, keeping explicit overrides. */
export function restoreLineHeightOption(): void {
  const lineHeight = parseLineHeightOption(getOptionFromLocal('line-height'));
  if (lineHeight) updateLineHeightTokens(lineHeight.value, lineHeight.type, restoreToken);
  Object.entries(getTokenFromLocal() ?? {}).forEach(([name, value]) => {
    if (name.startsWith('--td-line-height-')) restoreToken(name, value);
  });
}

/** Restore saved presets and individual overrides without modifying localStorage. */
export function restoreThemeOptions(): void {
  const tokens = getTokenFromLocal() ?? {};
  const font = Number(getOptionFromLocal('font'));
  if (Number.isInteger(font) && font >= 1 && font <= 5) {
    FONT_SIZE_STEPS[font].forEach(({ name, value }) => restoreToken(name, value));
  }

  // Line height depends on the final font size, including individual overrides.
  Object.entries(tokens).forEach(([name, value]) => {
    if (name.startsWith('--td-font-size-')) restoreToken(name, value);
  });

  const radius = Number(getOptionFromLocal('radius'));
  if (Number.isInteger(radius) && radius >= 1 && radius <= RADIUS_STEP_ARRAY.length) {
    RADIUS_STEP_ARRAY[radius - 1].forEach((value, index) => {
      restoreToken(RADIUS_TOKENS[index], typeof value === 'number' ? `${value}px` : value);
    });
  }

  const savedShadow = getOptionFromLocal('shadow');
  const shadow = Number(savedShadow);
  if (savedShadow !== undefined && Number.isInteger(shadow) && shadow >= 0 && shadow < ShadowSelectType.Self_Defined) {
    ShadowSelectDetail[shadow].forEach((value, index) => restoreToken(SHADOW_TOKENS[index], value));
  }

  restoreLineHeightOption();

  // Individual token edits always win over presets and derived values.
  Object.entries(tokens).forEach(([name, value]) => restoreToken(name, value));
}
