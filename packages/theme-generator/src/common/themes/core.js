import cssbeautify from 'cssbeautify';
import { Color } from 'tvision-color';

import GENERATOR_VARIABLES from '!raw-loader!./built-in/css/vars.css';

import { appendStyleSheet, clearLocalItem, downloadFile, extractRootContent, setUpModeObserver } from '../utils';

import {
  MOBILE_RECOMMEND_THEMES,
  TDESIGN_MOBILE_THEME,
  TDESIGN_WEB_THEME,
  TENCENT_BLUE,
  TENCENT_BLUE_DARK_PALETTE,
  WEB_RECOMMEND_THEMES,
} from './built-in';

const GENERATOR_ID = 'TDESIGN_GENERATOR_SYMBOL';

/* stylesheet 的 ID */
export const CUSTOM_THEME_ID = 'custom-theme';
export const CUSTOM_DARK_ID = `${CUSTOM_THEME_ID}-dark`;
export const CUSTOM_EXTRA_ID = `${CUSTOM_THEME_ID}-extra`;

/* localStorage 的 key */
export const CUSTOM_OPTIONS_ID = `${CUSTOM_THEME_ID}-options`;
export const CUSTOM_TOKEN_ID = `${CUSTOM_THEME_ID}-tokens`;

export const isMiniProgram = (device) => device === 'mini-program';
export const isMobile = (device) => device === 'mobile' || isMiniProgram(device);

export function normalizeDevice(device) {
  return isMobile(device) ? 'mobile' : 'web';
}

/**
 * 初始化给生成器本身使用的变量，避免部分样式在用户调整主题时产生冲突
 */
export function initGeneratorVars() {
  const siteStylesheet = appendStyleSheet(GENERATOR_ID);
  siteStylesheet.textContent = GENERATOR_VARIABLES;
}

export function getDefaultTheme(device) {
  return isMobile(device) ? TDESIGN_MOBILE_THEME : TDESIGN_WEB_THEME;
}

export function getRecommendThemes(device) {
  return isMobile(device) ? MOBILE_RECOMMEND_THEMES : WEB_RECOMMEND_THEMES;
}

/**
 * 同步 site 的 亮暗模式给主题生成器 Web Component
 */
export function syncModeToGenerator() {
  setUpModeObserver((theme) => {
    const generator = document.querySelector('td-theme-generator');
    if (!generator) return;
    generator.setAttribute('theme-mode', theme);
  });
}

export function findThemeByEnName(device, enName) {
  const themes = getRecommendThemes(device);
  for (const category of themes) {
    const theme = category.options.find((t) => t.enName === enName);
    if (theme) return theme;
  }
  return getDefaultTheme(device);
}

/**
 * 初始化当前主题对应的样式表
 */
export function initThemeStyleSheet(themeName, device) {
  const deviceType = normalizeDevice(device);
  const theme = findThemeByEnName(deviceType, themeName);

  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);
  const extraStyleSheet = appendStyleSheet(CUSTOM_EXTRA_ID);

  const { light, dark, extra } = theme.css;

  styleSheet.textContent = light;
  darkStyleSheet.textContent = dark;
  extraStyleSheet.textContent = extra;

  return theme;
}

export function exportCustomStyleSheet(device) {
  const styleSheet = document.getElementById(CUSTOM_THEME_ID);
  const darkStyleSheet = document.getElementById(CUSTOM_DARK_ID);
  const extraStyleSheet = document.getElementById(CUSTOM_EXTRA_ID);

  const cssString = extractRootContent(styleSheet?.textContent);
  const darkCssString = extractRootContent(darkStyleSheet?.textContent);
  const extraCssString = extraStyleSheet?.textContent || '';

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
      ${extraCssString}
    `;
  } else {
    finalCssString = `
      :root, :root[theme-mode="light"] {
        ${cssString}
      }
      :root.dark, :root[theme-mode="dark"] {
        ${darkCssString}
      }
      ${extraCssString}
    `;
  }

  const beautifyCssString = cssbeautify(finalCssString.trim());
  const blob = new Blob([beautifyCssString], { type: 'text' });
  const fileSuffix = isMiniProgram(device) ? 'wxss' : 'css';
  downloadFile(blob, `theme.${fileSuffix}`);
}

export function modifyToken(tokenName, newVal, saveToLocal = true) {
  // 获取所有可能包含 token 的样式表
  const styleSheets = document.querySelectorAll(`#${CUSTOM_THEME_ID}, #${CUSTOM_DARK_ID}, #${CUSTOM_EXTRA_ID}`);

  let tokenFound = false;
  styleSheets.forEach((styleSheet) => {
    const reg = new RegExp(`${tokenName}:\\s*(.*?);`);
    const match = styleSheet.textContent.match(reg);

    if (!match) return;
    if (match[1] === newVal) {
      tokenFound = true;
      return;
    }

    const currentVal = match[1];
    styleSheet.textContent = styleSheet.textContent.replace(`${tokenName}: ${currentVal}`, `${tokenName}: ${newVal}`);
    tokenFound = true;

    updateLocalToken(tokenName, saveToLocal ? newVal : null);

    // 如果修改的是尺寸相关的 token（Web Components 使用的），为 Web Components 容器创建隔离样式
    if (isWebComponentsSizeToken(tokenName)) {
      createWebComponentsStyleOverride(tokenName, currentVal);
    }
  });

  if (!tokenFound) {
    console.warn(`CSS variable: ${tokenName} is not exist`);
  }
}

// 检查是否是 Web Components 使用的尺寸变量
function isWebComponentsSizeToken(tokenName) {
  return tokenName.startsWith('--td-size-') || tokenName.startsWith('--td-comp-size-');
}

// 为 Web Components 容器创建或更新隔离样式表
function createWebComponentsStyleOverride(tokenName, originalVal) {
  let styleEl = document.getElementById('__web-components-size-lock__');

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = '__web-components-size-lock__';
    document.head.appendChild(styleEl);
  }

  // 获取当前的 CSS 规则
  let cssText = styleEl.textContent;

  // 检查是否已经有这个变量的规则
  const varRegex = new RegExp(`${tokenName}:\\s*[^;]*;`, 'g');

  if (varRegex.test(cssText)) {
    // 更新现有的变量定义，保持原值
    cssText = cssText.replace(varRegex, `${tokenName}: ${originalVal} !important;`);
  } else {
    // 添加新的变量定义
    // 如果没有 .theme-generator 选择器，需要创建
    if (!cssText.includes('.theme-generator {')) {
      cssText += `\n.theme-generator { ${tokenName}: ${originalVal} !important; }`;
    } else {
      // 在现有的 .theme-generator 规则中添加
      cssText = cssText.replace(/\.theme-generator\s*{/, `.theme-generator { ${tokenName}: ${originalVal} !important;`);
    }
  }

  styleEl.textContent = cssText;
}

export function getOptionFromLocal(optionName) {
  const options = localStorage.getItem(CUSTOM_OPTIONS_ID);
  if (!options) return;
  const optionObj = JSON.parse(options);
  return optionObj[optionName];
}

/**
 * 如果不传入 `tokenName`，则返回所有的 `token` 对象
 */
export function getTokenFromLocal(tokenName) {
  const tokens = localStorage.getItem(CUSTOM_TOKEN_ID);
  if (!tokens) return;
  const tokenObj = JSON.parse(tokens);
  if (!tokenName) return tokenObj;
  return tokenObj[tokenName];
}

/**
 * @param {*} value 传入 `null` 或 `undefined`，则表示清除掉之前的存储
 */
export function updateLocalOption(optionName, value) {
  if (value) {
    const options = localStorage.getItem(CUSTOM_OPTIONS_ID) || '{}';
    const optionObj = JSON.parse(options);
    optionObj[optionName] = value;
    localStorage.setItem(CUSTOM_OPTIONS_ID, JSON.stringify(optionObj));
  } else {
    clearLocalItem(CUSTOM_OPTIONS_ID, optionName);
  }
}

/**
 * @param {*} value 传入 `null` 或 `undefined`，则表示清除掉之前的存储
 */
export function updateLocalToken(tokenName, value) {
  if (value) {
    const tokens = localStorage.getItem(CUSTOM_TOKEN_ID) || '{}';
    const tokenObj = JSON.parse(tokens);
    tokenObj[tokenName] = value;
    localStorage.setItem(CUSTOM_TOKEN_ID, JSON.stringify(tokenObj));
  } else {
    clearLocalItem(CUSTOM_TOKEN_ID, tokenName);
  }
}

export function applyTokenFromLocal() {
  const token = localStorage.getItem(CUSTOM_TOKEN_ID);
  if (!token) return;

  const tokenObj = JSON.parse(token);
  Object.entries(tokenObj).forEach(([key, value]) => {
    modifyToken(key, value);
  });
}

export function clearLocalTheme() {
  localStorage.removeItem(CUSTOM_OPTIONS_ID);
  localStorage.removeItem(CUSTOM_TOKEN_ID);
}

export function convertFromHex(color, format) {
  return `(${Color.colorTransform(color, 'hex', format).join(',')})`;
}

export function generateBrandPalette(hex, remainInput = false) {
  const lowCaseHex = hex.toLowerCase();

  const [{ colors, primary }] = Color.getColorGradations({
    colors: [lowCaseHex],
    step: 10,
    remainInput,
  });

  const isTencentBlue = lowCaseHex === TENCENT_BLUE.toLowerCase();
  const validPrimary = typeof primary === 'number' && !isNaN(primary) ? primary : 6;

  const lightBrandIdx = isTencentBlue ? 7 : validPrimary + 1;
  const lightPalette = [...colors];

  const darkPalette = isTencentBlue ? TENCENT_BLUE_DARK_PALETTE : [...colors].reverse();
  const darkBrandIdx = isTencentBlue ? 8 : 6;

  return { lightPalette, lightBrandIdx, darkPalette, darkBrandIdx };
}

export function generateFunctionalPalette(hex, step = 10) {
  const lowCaseHex = hex.toLowerCase();
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

/**
 * @param {'init' | 'update'} trigger - 触发类型
 */
export function updateStyleSheetColor(type, lightPalette, darkPalette, trigger) {
  const styleSheet = appendStyleSheet(CUSTOM_THEME_ID);
  const darkStyleSheet = appendStyleSheet(CUSTOM_DARK_ID);
  const updateColorTokens = (styleSheet, palette) => {
    palette.forEach((color, index) => {
      const tokenName = `--td-${type}-color-${index + 1}`;
      const regExp = new RegExp(`${tokenName}:.*?;`, 'g');
      let replacement = `${tokenName}: ${color};`;
      if (trigger === 'init') {
        // 确保不覆盖用户本地自定义的值
        replacement = `${tokenName}: ${getTokenFromLocal(tokenName) || color};`;
      }
      if (trigger === 'update') {
        updateLocalToken(tokenName, null); // 清除本地存储的颜色 Token
      }
      styleSheet.textContent = styleSheet.textContent.replace(regExp, replacement);
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
      styleSheet.textContent = styleSheet.textContent.replace(regExp, replacement);
    });
  };

  updateColorTokens(styleSheet, lightTokenMap);
  updateColorTokens(darkStyleSheet, darkTokenMap);
}

/**
 * 根据 token 名称获取对应的索引
 * 例如 `--td-brand-focus` ->  2
 */
export function collectTokenIndexes(tokenArr) {
  const isDarkMode = document.documentElement.getAttribute('theme-mode') === 'dark';
  const targetCss = document.querySelector(isDarkMode ? `#${CUSTOM_DARK_ID}` : `#${CUSTOM_THEME_ID}`);

  return tokenArr
    .map((token) => {
      const reg = new RegExp(`${token}:\\s*var\\((--td-[\\w-]+)\\)`, 'i');
      const match = targetCss?.textContent.match(reg);
      if (match) {
        return {
          name: token,
          idx: parseInt(match[1].match(/(\d+)$/)?.[1], 10),
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.idx - b.idx);
}
