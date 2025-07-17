export * from 'tdesign-vue/es/_common/js/color-picker';

import GENERATOR_VARIABLES from '!raw-loader!./vars.css';
const GENERATOR_ID = 'TDESIGN_GENERATOR_SYMBOL';

/**
 * 初始化给生成器本身使用的样式变量，避免和 TDesign 冲突
 */
export function initGeneratorVars() {
  const siteStylesheet = appendStyleSheet(GENERATOR_ID);
  siteStylesheet.textContent = GENERATOR_VARIABLES;
}

/**
 * 同步亮暗模式给 Web Component
 */
export function syncThemeToGenerator() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'theme-mode') {
        const generator = document.querySelector('td-theme-generator');
        if (!generator) return;
        const themeMode = document.documentElement.getAttribute('theme-mode');
        generator.setAttribute('theme-mode', themeMode);
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['theme-mode'],
  });
}

/**
 * 按照指定的 Id 生成样式表
 * - 如果存在，则返回已存在的样式表
 * - 如果不存在，则创建一个新的样式表
 */
export function appendStyleSheet(styleId) {
  let styleSheet;
  const existSheet = document.getElementById(styleId);

  if (!existSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);
  } else {
    styleSheet = existSheet;
  }
  return styleSheet;
}

/**
 * 解决 `Popup` 组件脱离 Shadow DOM 的问题
 */
export function handleAttach() {
  return document.querySelector('td-theme-generator')?.shadowRoot?.querySelector?.('.theme-generator') || document.body;
}

/**
 * 将指定内容导出为文件
 * - e.g. `new Blob(['Hello, world!'], { type: 'text/plain' })`
 */
export function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = fileName;
  a.target = '_blank';
  a.href = url;
  a.click();
}

/**
 * 从 CSS 文本中移除指定的 Token 字符串 / 数组
 * - e.g. `"--td-xxx-1"` or `["--td-xxx-2", "--td-xxx-3"]`
 */
export function removeCssProperties(cssText, properties) {
  if (!Array.isArray(properties)) {
    properties = [properties];
  }

  properties.forEach((property) => {
    const reg = new RegExp(`${property}:\\s*.*?;`, 'g');
    cssText = cssText.replace(reg, '');
  });

  return cssText;
}

/**
 * 从 CSS 文本中提取 `:root` 中的内容
 */
export function extractRootContent(cssText) {
  // 匹配 {} 内的内容
  const match = cssText.match(/{([^}]*)}/);
  return match ? match[1].trim() : '';
}

/**
 * 删除 localStorage 中指定对象的指定属性
 */
export function clearLocalItem(storageKey, itemKey) {
  const storedData = localStorage.getItem(storageKey);
  if (!storedData) return;

  const dataObj = JSON.parse(storedData);
  delete dataObj[itemKey];

  if (Object.keys(dataObj).length === 0) {
    // 如果删除后对象为空，则移除整个项
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(dataObj));
  }
}
