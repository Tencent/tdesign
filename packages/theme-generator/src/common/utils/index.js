export * from './animation';

/**
 * 获取指定 CSS Token 对应的数值
 */
export function getTokenValue(name) {
  const isDarkMode = document.documentElement.getAttribute('theme-mode') === 'dark';
  const rootElement = isDarkMode ? document.querySelector('[theme-mode="dark"]') : document.documentElement;
  return window.getComputedStyle(rootElement).getPropertyValue(name).toLowerCase().trim();
}

/**
 * 获取当前亮暗模式 (light / dark)
 */
export function getThemeMode() {
  return document.documentElement.getAttribute('theme-mode') || 'light';
}

/**
 * 创建亮暗变化监听器
 */
export function setUpModeObserver(handler) {
  let mode = getThemeMode();

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        const newMode = getThemeMode();
        if (newMode !== mode) {
          mode = newMode;
          handler(mode);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['theme-mode'],
  });

  return observer;
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
 * 解析 CSS 文本，拆分出 `:root` 中的变量内容与其余的选择器规则
 */
export function parseRootCss(cssText) {
  if (!cssText) return { rootContent: '', restContent: '' };

  // 匹配以 :root 开头的选择器组（允许逗号分隔的多个选择器，且包含 :root），后接 { ... } 块
  const rootBlockReg = /(?:^|[\s;}])((?:[^{};]*?:root[^{};]*)\s*\{([^}]*)\})/g;

  const rootContents = [];
  let restContent = cssText;
  let match;
  while ((match = rootBlockReg.exec(cssText)) !== null) {
    rootContents.push(match[2].trim());
    restContent = restContent.replace(match[1], '');
  }

  if (rootContents.length === 0) {
    return { rootContent: '', restContent: cssText.trim() };
  }

  return {
    rootContent: rootContents.join('\n').trim(),
    restContent: restContent.trim(),
  };
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
