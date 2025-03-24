export * from 'tdesign-vue/es/_common/js/color-picker';

import cssbeautify from 'cssbeautify';
import { Color } from 'tvision-color';

import GENERATOR_VARIABLES from '!raw-loader!./vars.css';
export const GENERATOR_ID = 'TDESIGN_GENERATOR_SYMBOL';

import { DARK_FUNCTION_COLOR, LIGHT_FUNCTION_COLOR } from '../../color-panel/utils/const';
import { BUILT_IN_THEMES } from '../built-in/theme-map';
import { DEFAULT_THEME, RECOMMEND_THEMES } from '../Themes/const';

export const CUSTOM_THEME_ID = 'custom-theme';
export const CUSTOM_DARK_ID = 'custom-theme-dark';
export const CUSTOM_EXTRA_ID = 'custom-theme-extra';
export const CUSTOM_COMMON_ID_PREFIX = 'custom-theme-common';

export function initVariables() {
  let styleSheet;
  let themeStylesheet = document.getElementById(GENERATOR_ID);

  if (!themeStylesheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = GENERATOR_ID;
    styleSheet.innerText = GENERATOR_VARIABLES;
    document.head.appendChild(styleSheet);
  }
}

export function appendStyleSheet(themeId) {
  let styleSheet;
  const existSheet = document.getElementById(themeId);

  if (!existSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = themeId;
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);
  } else {
    styleSheet = existSheet;
  }
  return styleSheet;
}

export function getBuiltInThemes(device = 'web', hex) {
  const themeCopy = JSON.parse(JSON.stringify(RECOMMEND_THEMES));

  const filtered = themeCopy
    .map((group) => {
      group.options = group.options.filter((theme) => {
        const availableCss = BUILT_IN_THEMES[device]?.[theme.enName];

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

// generator new theme variables and insert into document
export function generateNewTheme(hex, remainInput = true, device = 'web') {
  generateCommonTheme(device);

  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);

  const { brandColorIdx, colorPalette, styleSheetString } = generateTokenList(hex, false, 10, remainInput);

  const builtInTheme = getBuiltInThemes(device, hex);

  if (builtInTheme.length > 0) {
    // 内置主题
    const theme = builtInTheme[0].options[0]; // 条件筛选后只有一个
    const { light, dark, extra } = theme.css;

    styleSheet.textContent = light;
    darkStyleSheet.textContent = dark;

    if (extra) {
      const extraStyleSheet = appendStyleSheet(CUSTOM_EXTRA_ID);
      extraStyleSheet.textContent = extra;
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
  updateBrandMain(hex);
  return { brandColorIdx, colorPalette };
}

export function generateCommonTheme(device = 'web') {
  const commonThemes = BUILT_IN_THEMES[device]?.common;
  if (!commonThemes) return;

  Object.entries(commonThemes).forEach(([key, theme]) => {
    const commonId = `${CUSTOM_COMMON_ID_PREFIX}-${key}`;
    if (document.getElementById(commonId)) return;
    const commonStyleSheet = appendStyleSheet(commonId);
    commonStyleSheet.textContent = theme;
  });
}

// update `--brand-main` variable when update theme
export function updateBrandMain(hex) {
  const root = document.documentElement;
  root.style.setProperty('--brand-main', hex);
}

// generate token column
export function generateTokenList(hex, isDark = false, step = 10, remainInput = true) {
  const lowCaseHex = hex.toLocaleLowerCase();
  const root = isDark
    ? `:root[theme-color="${CUSTOM_THEME_ID}"][theme-mode="dark"]`
    : `:root[theme-color="${CUSTOM_THEME_ID}"],:root[theme-color="${CUSTOM_THEME_ID}"][theme-mode="light"]`;

  let colorPalette;
  let brandColorIdx;

  const [{ colors, primary }] = Color.getColorGradations({
    colors: [lowCaseHex],
    step: step,
    remainInput,
  });

  colorPalette = colors;
  brandColorIdx = primary;

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
      // eslint-disable-next-line no-use-before-define
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
    --brand-main: var(--td-brand-color-${brandColorIdx + 1});
    --td-brand-color-light: var(--td-brand-color-1);
    --td-brand-color-focus: var(--td-brand-color-2);
    --td-brand-color-disabled: var(--td-brand-color-3);
    --td-brand-color-hover: var(--td-brand-color-${brandColorIdx > 0 ? brandColorIdx : brandColorIdx + 1});
    --td-brand-color: var(--td-brand-color-${brandColorIdx + 1});
    --td-brand-color-active:var(--td-brand-color-${brandColorIdx > 8 ? brandColorIdx + 1 : brandColorIdx + 2});
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
    ${isDark ? DARK_FUNCTION_COLOR : LIGHT_FUNCTION_COLOR}
    }`;

  return { styleSheetString, brandColorIdx, colorPalette };
}

// handle export and download theme
export function exportCustomTheme(device = 'web') {
  const styleSheet = document.getElementById(CUSTOM_THEME_ID);
  const darkStyleSheet = document.getElementById(CUSTOM_DARK_ID);
  const extraStyleSheet = document.getElementById(CUSTOM_EXTRA_ID);
  const commonStyleSheet = document.querySelectorAll(`[id^="${CUSTOM_COMMON_ID_PREFIX}-"]`);

  const extractRootContent = (css) => {
    // 匹配 {} 内的内容
    const match = css.match(/{([^}]*)}/);
    return match ? match[1].trim() : '';
  };

  const cssString = extractRootContent(styleSheet?.innerText);
  const darkCssString = extractRootContent(darkStyleSheet?.innerText);
  const commonCssString = Array.from(commonStyleSheet)
    .map((sheet) => extractRootContent(sheet.innerText))
    .join('\n');
  const extraCssString = extraStyleSheet?.innerText || '';

  const isMobile = device === 'mobile';

  let finalCssString;
  if (isMobile) {
    finalCssString = `
      @media (prefers-color-scheme: light) {
        page {
          ${cssString}
        }
      }
      @media (prefers-color-scheme: dark) {
        page {
          ${darkCssString}
        }
      }
      page {
        ${commonCssString}
      }
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
      :root {
        ${commonCssString}
      }
      ${extraCssString}
    `;
  }

  const beautifyCssString = cssbeautify(finalCssString.trim());
  const blob = new Blob([beautifyCssString], { type: 'text' });
  const fileSuffix = isMobile ? 'wxss' : 'css';
  downloadFile(blob, `theme.${fileSuffix}`);
}

// set attach node, to resolve web component shadow root dom issue
export function handleAttach() {
  return document.querySelector('td-theme-generator')?.shadowRoot?.querySelector?.('.theme-generator') || document.body;
}

// modify custom-theme token/variable value
export function modifyToken(tokenIdxName, newVal) {
  // 获取所有可能包含 token 的样式表
  const styleSheets = document.querySelectorAll(
    `#${CUSTOM_THEME_ID}, #${CUSTOM_DARK_ID}, [id^="${CUSTOM_COMMON_ID_PREFIX}-"]`,
  );

  let tokenFound = false;

  styleSheets.forEach((styleSheet) => {
    const reg = new RegExp(`${tokenIdxName}:\\s*(.*?);`);
    const match = styleSheet.innerText.match(reg);

    if (match) {
      const currentVal = match[1];
      styleSheet.innerText = styleSheet.innerText.replace(
        `${tokenIdxName}: ${currentVal}`,
        `${tokenIdxName}: ${newVal}`,
      );
      tokenFound = true;
    }
  });

  if (!tokenFound) {
    console.warn(`CSS variable: ${tokenIdxName} is not exist`);
  }
}

// get current stylesheet
export function getCustomThemeSheet() {
  const styleSheet = document.getElementById(CUSTOM_THEME_ID);
  return styleSheet;
}

// transform percentage string to float string
export function replacePercentages(str) {
  return str.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
    return `${parseFloat(number) / 100}`;
  });
}

export function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = fileName;
  a.target = '_blank';
  a.href = url;
  a.click();
}
