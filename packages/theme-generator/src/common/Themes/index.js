export * from './iframe';
export * from './preset';
export * from './token';

import cssbeautify from 'cssbeautify';
import { Color } from 'tvision-color';

import { appendStyleSheet, clearLocalItem, downloadFile, extractRootContent, removeCssProperties } from '../utils';
import { BUILT_IN_THEMES, DEFAULT_THEME, RECOMMEND_THEMES } from './preset';
import { DARK_FUNCTION_COLOR, LIGHT_FUNCTION_COLOR, MOBILE_MISSING_TOKENS } from './token';

/* stylesheet 的 ID */
export const CUSTOM_THEME_ID = 'custom-theme';
export const CUSTOM_DARK_ID = `${CUSTOM_THEME_ID}-dark`;
export const CUSTOM_EXTRA_ID = `${CUSTOM_THEME_ID}-extra`;
export const CUSTOM_COMMON_ID_PREFIX = `${CUSTOM_THEME_ID}-common`;
/* localStorage 的 key */
export const CUSTOM_OPTIONS_ID = `${CUSTOM_THEME_ID}-options`;
export const CUSTOM_TOKEN_ID = `${CUSTOM_THEME_ID}-tokens`;

export const isMiniProgram = (device) => device === 'mini-program';
export const isMobile = (device) => device === 'mobile' || isMiniProgram(device);

export function normalizeDeviceType(device) {
  return isMobile(device) ? 'mobile' : 'web';
}

export function getBuiltInThemes(device = 'web', hex = undefined) {
  const themeCopy = JSON.parse(JSON.stringify(RECOMMEND_THEMES));

  const filtered = themeCopy
    .map((group) => {
      group.options = group.options.filter((theme) => {
        const deviceType = normalizeDeviceType(device);
        const availableCss = BUILT_IN_THEMES[deviceType]?.[theme.enName];

        /* 这里的 && 不能简写为 hex.?，有时初始化不需要传入 hex，但是需要继续执行
           可选链生成 `undefined !== theme.value.toLocaleLowerCase()` 为 true，会直接返回 */
        if (hex && hex.toLocaleLowerCase() !== theme.value.toLocaleLowerCase()) return false;

        if (availableCss) {
          theme.css = {
            light: availableCss.light,
            dark: availableCss.dark,
            ...(availableCss.extra && { extra: availableCss.extra }),
          };
          return true;
        }
        return false;
      });

      return group;
    })
    .filter((group) => group.options.length > 0);

  return filtered;
}

export function generateNewTheme(hex, remainInput = true, device = 'web') {
  updateLocalOption('color', hex, hex !== DEFAULT_THEME.value);

  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);

  const { brandColorIdx, colorPalette, styleSheetString } = generateTokenList(hex, false, 10, remainInput);

  const builtInTheme = getBuiltInThemes(device, hex);
  const hasBuiltInTheme = builtInTheme.length > 0;

  generateCommonTheme(device, hasBuiltInTheme);
  if (hasBuiltInTheme) {
    // 内置主题
    const theme = builtInTheme[0].options[0]; // 条件筛选后只有一个
    const { light, dark, extra } = theme.css;

    styleSheet.textContent = light;
    darkStyleSheet.textContent = dark;

    if (extra) {
      const extraStyleSheet = appendStyleSheet(CUSTOM_EXTRA_ID);
      extraStyleSheet.textContent = extra;
      // 有自己一套特有样式的，不应用 Common Token
      document.querySelectorAll(`[id^="${CUSTOM_COMMON_ID_PREFIX}-"]`).forEach((sheet) => {
        sheet.remove();
      });
    } else {
      document.getElementById(CUSTOM_EXTRA_ID)?.remove();
    }
  } else {
    document.getElementById(CUSTOM_EXTRA_ID)?.remove();

    // 动态生成
    const darkCssTokenString = generateTokenList(hex, true).styleSheetString;
    styleSheet.textContent = styleSheetString;
    darkStyleSheet.textContent = darkCssTokenString;
  }

  document.documentElement.setAttribute('theme-color', CUSTOM_THEME_ID);
  document.documentElement.style.setProperty('--brand-main', hex);
  return { brandColorIdx, colorPalette };
}

export const generateCommonTheme = (() => {
  let previousDevice = 'web'; // 闭包保存

  return function (device = 'web', forceRefresh = false) {
    const deviceType = normalizeDeviceType(device);
    const commonThemes = BUILT_IN_THEMES[deviceType]?.common;
    if (!commonThemes) return;

    // device 变化时，清除之前的样式
    if (previousDevice !== deviceType) {
      const existingStyles = Array.from(document.querySelectorAll(`[id^="${CUSTOM_COMMON_ID_PREFIX}-"]`));
      existingStyles.forEach((style) => {
        style.parentNode.removeChild(style);
      });
    }

    Object.entries(commonThemes).forEach(([key, theme]) => {
      const commonId = `${CUSTOM_COMMON_ID_PREFIX}-${key}`;
      if (document.getElementById(commonId) && !forceRefresh) return; // 不覆盖之前的内容
      const commonStyleSheet = appendStyleSheet(commonId);
      commonStyleSheet.textContent = theme;
    });

    previousDevice = deviceType;
  };
})();

export function generateTokenList(hex, isDark = false, step = 10, remainInput = true) {
  const lowCaseHex = hex.toLocaleLowerCase();
  const root = isDark ? `:root[theme-mode="dark"]` : `:root,:root[theme-mode="light"]`;

  let colorPalette;
  let brandColorIdx;

  const [{ colors, primary }] = Color.getColorGradations({
    colors: [lowCaseHex],
    step: step,
    remainInput,
  });

  colorPalette = colors;
  brandColorIdx = primary;

  if (lowCaseHex === DEFAULT_THEME.value.toLocaleLowerCase()) {
    brandColorIdx = 8;
  }
  if (isDark) {
    if (lowCaseHex === DEFAULT_THEME.value.toLocaleLowerCase()) {
      colorPalette = [
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
      brandColorIdx = 8;
    } else {
      colorPalette.reverse().map((color) => {
        const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl');
        return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex');
      });
      brandColorIdx = 5;
    }

    colorPalette[0] = `${colorPalette[brandColorIdx]}20`;
  }

  // TODO: 功能色、中性色未通过t-vision生成 先固定住
  const styleSheetString = `${root}{
    --td-brand-color-1: ${colorPalette[0]};
    --td-brand-color-2: ${colorPalette[1]};
    --td-brand-color-3: ${colorPalette[2]};
    --td-brand-color-4: ${colorPalette[3]};
    --td-brand-color-5: ${colorPalette[4]};
    --td-brand-color-6: ${colorPalette[5]};
    --td-brand-color-7: ${colorPalette[6]};
    --td-brand-color-8: ${colorPalette[7]};
    --td-brand-color-9: ${colorPalette[8]}; 
    --td-brand-color-10: ${colorPalette[9]};
    --td-brand-color-light: var(--td-brand-color-1);
    --td-brand-color-focus: var(--td-brand-color-2);
    --td-brand-color-disabled: var(--td-brand-color-3);
    --td-brand-color-hover: var(--td-brand-color-${brandColorIdx > 0 ? brandColorIdx : brandColorIdx + 1});
    --td-brand-color: var(--td-brand-color-${brandColorIdx + 1});
    --td-brand-color-active:var(--td-brand-color-${brandColorIdx > 8 ? brandColorIdx + 1 : brandColorIdx + 2});
    ${isDark ? DARK_FUNCTION_COLOR : LIGHT_FUNCTION_COLOR}
    }`;

  return { styleSheetString, brandColorIdx, colorPalette };
}

export function exportCustomTheme(device = 'web') {
  const styleSheet = document.getElementById(CUSTOM_THEME_ID);
  const darkStyleSheet = document.getElementById(CUSTOM_DARK_ID);
  const extraStyleSheet = document.getElementById(CUSTOM_EXTRA_ID);
  const commonStyleSheet = document.querySelectorAll(`[id^="${CUSTOM_COMMON_ID_PREFIX}-"]`);

  const cssString = extractRootContent(styleSheet?.innerText);
  const darkCssString = extractRootContent(darkStyleSheet?.innerText);
  const commonCssString = Array.from(commonStyleSheet)
    .map((sheet) => extractRootContent(sheet.innerText))
    .join('\n');
  const extraCssString = extraStyleSheet?.innerText || '';

  let finalCssString;
  if (isMiniProgram(device)) {
    finalCssString = `
      @media (prefers-color-scheme: light) {
        page, .page {
          ${cssString}
        }
      }
      @media (prefers-color-scheme: dark) {
        page, .page {
          ${darkCssString}
        }
      }
      ${commonCssString ? `page {\n${commonCssString}\n}` : ''}
      ${extraCssString}
    `;
  } else {
    finalCssString = `
      :root, :root[theme-mode="light"] {
        ${cssString}
      }
      :root[theme-mode="dark"] {
        ${darkCssString}
      }
      ${commonCssString ? `:root {\n${commonCssString}\n}` : ''}
      ${extraCssString}
    `;
  }

  if (isMobile(device)) {
    finalCssString = removeCssProperties(finalCssString, MOBILE_MISSING_TOKENS);
  }

  const beautifyCssString = cssbeautify(finalCssString.trim());
  const blob = new Blob([beautifyCssString], { type: 'text' });
  const fileSuffix = isMiniProgram(device) ? 'wxss' : 'css';
  downloadFile(blob, `theme.${fileSuffix}`);
}

export function modifyToken(tokenName, newVal, saveToLocal = true) {
  // 获取所有可能包含 token 的样式表
  const styleSheets = document.querySelectorAll(
    `#${CUSTOM_THEME_ID}, #${CUSTOM_DARK_ID}, #${CUSTOM_EXTRA_ID}, [id^="${CUSTOM_COMMON_ID_PREFIX}-"]`,
  );

  let tokenFound = false;

  styleSheets.forEach((styleSheet) => {
    const reg = new RegExp(`${tokenName}:\\s*(.*?);`);
    const match = styleSheet.innerText.match(reg);

    if (!match) return;
    if (match[1] === newVal) {
      tokenFound = true;
      return;
    }

    const currentVal = match[1];
    styleSheet.innerText = styleSheet.innerText.replace(`${tokenName}: ${currentVal}`, `${tokenName}: ${newVal}`);
    tokenFound = true;

    if (saveToLocal) {
      storeTokenToLocal(tokenName, newVal);
    } else {
      // 确保没有遗留的 Token
      clearLocalItem(CUSTOM_TOKEN_ID, tokenName);
    }
  });

  if (!tokenFound) {
    console.warn(`CSS variable: ${tokenName} is not exist`);
  }
}

export function applyMainColorFromLocal(device) {
  const options = localStorage.getItem(CUSTOM_OPTIONS_ID);
  if (!options) return;
  const typeObj = JSON.parse(options);
  const hex = typeObj.color;
  if (!hex) return;
  generateNewTheme(hex, false, device);
}

export function updateLocalOption(optionName, value, storeToLocal = true) {
  if (storeToLocal) {
    const options = localStorage.getItem(CUSTOM_OPTIONS_ID) || '{}';
    const optionObj = JSON.parse(options);
    optionObj[optionName] = value;
    localStorage.setItem(CUSTOM_OPTIONS_ID, JSON.stringify(optionObj));
  } else {
    // 一般如果选择了默认选项，则清除掉之前的存储
    clearLocalItem(CUSTOM_OPTIONS_ID, optionName);
  }
}

export function getOptionFromLocal(optionName) {
  const options = localStorage.getItem(CUSTOM_OPTIONS_ID);
  if (!options) return;
  const optionObj = JSON.parse(options);
  return optionObj[optionName];
}

export function storeTokenToLocal(tokenName, newVal) {
  const tokens = localStorage.getItem(CUSTOM_TOKEN_ID) || '{}';
  const tokenObj = JSON.parse(tokens);
  tokenObj[tokenName] = newVal;
  localStorage.setItem(CUSTOM_TOKEN_ID, JSON.stringify(tokenObj));
}

export function applyTokenFromLocal() {
  const token = localStorage.getItem(CUSTOM_TOKEN_ID);
  if (!token) return;

  const tokenObj = JSON.parse(token);
  Object.entries(tokenObj).forEach(([key, value]) => {
    modifyToken(key, value, false);
  });
}

export function applyThemeFromLocal(device) {
  // 先应用颜色
  applyMainColorFromLocal(device);
  // 再应用 token -> 避免修改过的颜色被覆盖掉
  applyTokenFromLocal();
}

export function clearLocalTheme() {
  localStorage.removeItem(CUSTOM_OPTIONS_ID);
  localStorage.removeItem(CUSTOM_TOKEN_ID);
}
