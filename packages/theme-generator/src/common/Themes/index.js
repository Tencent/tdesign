export * from './color';
export * from './iframe';
export * from './preset';
export * from './token';

import cssbeautify from 'cssbeautify';

import { appendStyleSheet, clearLocalItem, downloadFile, extractRootContent, removeCssProperties } from '../utils';
import { BUILT_IN_THEMES, RECOMMEND_THEMES } from './preset';
import { MOBILE_MISSING_TOKENS } from './token';

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

export function getCurrentDevice() {
  const generatorEl = document.querySelector('tdesign-theme-generator');
  const device = generatorEl?.getAttribute('device') || 'web';
  return isMobile(device) ? 'mobile' : 'web';
}

/**
 * 不传入 Hex 时，返回当前 device 的全部主题
 */
export function getBuiltInThemes(hex) {
  const themeCopy = JSON.parse(JSON.stringify(RECOMMEND_THEMES));

  const filtered = themeCopy.map((group) => {
    group.options = group.options.filter((theme) => {
      const device = getCurrentDevice();

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
  });

  return filtered;
}

export function initThemeStyleSheet(themeName) {
  const device = getCurrentDevice();
  const themeStyleSheet = BUILT_IN_THEMES[device][themeName] || BUILT_IN_THEMES[device][0];

  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);
  const extraStyleSheet = appendStyleSheet(CUSTOM_EXTRA_ID);

  const { light, dark, extra } = themeStyleSheet;

  styleSheet.textContent = light;
  darkStyleSheet.textContent = dark;

  if (extra) {
    extraStyleSheet.textContent = extra;
  } else {
    extraStyleSheet.remove();
    initCommonStyleSheet();
  }
}

function initCommonStyleSheet() {
  const deviceType = getCurrentDevice();
  const commonThemes = BUILT_IN_THEMES[deviceType]?.common;
  if (!commonThemes) return;

  Object.entries(commonThemes).forEach(([key, theme]) => {
    const commonId = `${CUSTOM_COMMON_ID_PREFIX}-${key}`;
    const commonStyleSheet = appendStyleSheet(commonId);
    commonStyleSheet.textContent = theme;
  });
}

export function updateThemeStyleSheet(css) {
  const { light, dark, extra } = css;
  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);
  styleSheet.textContent = light;
  darkStyleSheet.textContent = dark;

  const extraStyleSheet = appendStyleSheet(CUSTOM_EXTRA_ID);
  if (extra) {
    extraStyleSheet.textContent = extra;
  } else {
    extraStyleSheet.remove();
  }

  console.log(light, styleSheet.textContent);
}

export function exportCustomStyleSheet(device = 'web') {
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

export function clearLocalTheme() {
  localStorage.removeItem(CUSTOM_OPTIONS_ID);
  localStorage.removeItem(CUSTOM_TOKEN_ID);
}
