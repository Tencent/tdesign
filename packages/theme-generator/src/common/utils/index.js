export * from './animation';

/**
 * 获取指定 CSS Token 对应的数值
 * - 在 Web Component 模式下，从 shadowRoot 内部获取
 */
export function getTokenValue(name) {
  // 优先从 shadowRoot 内部获取 CSS 变量
  const wcHost = document.querySelector('td-theme-generator');
  const shadowRoot = wcHost?.shadowRoot;
  const isDarkMode = (shadowRoot?.host?.getAttribute('theme-mode') || document.documentElement.getAttribute('theme-mode')) === 'dark';

  let rootElement;
  if (shadowRoot) {
    rootElement = isDarkMode
      ? shadowRoot.querySelector('[theme-mode="dark"]') || shadowRoot.querySelector('.theme-generator')
      : shadowRoot.querySelector('.theme-generator');
  }
  if (!rootElement) {
    rootElement = isDarkMode ? document.querySelector('[theme-mode="dark"]') : document.documentElement;
  }
  return window.getComputedStyle(rootElement).getPropertyValue(name).toLowerCase().trim();
}

/**
 * 获取当前亮暗模式 (light / dark)
 * - 优先从 Web Component 宿主元素读取
 */
export function getThemeMode() {
  const wcHost = document.querySelector('td-theme-generator');
  return wcHost?.getAttribute('theme-mode') || document.documentElement.getAttribute('theme-mode') || 'light';
}

/**
 * 创建亮暗变化监听器
 * - 同时观察 document.documentElement 和 td-theme-generator 宿主元素
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

  // 观察 document.documentElement（非 WC 模式）
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['theme-mode'],
  });

  // 观察 td-theme-generator 宿主元素（WC 模式）
  const wcHost = document.querySelector('td-theme-generator');
  if (wcHost) {
    observer.observe(wcHost, {
      attributes: true,
      attributeFilter: ['theme-mode'],
    });
  }

  return observer;
}

/**
 * 按照指定的 Id 生成样式表
 * - 如果存在，则返回已存在的样式表
 * - 如果不存在，则创建一个新的样式表
 * - 在 Web Component 模式下，向 shadowRoot 注入而非 document.head
 */
export function appendStyleSheet(styleId) {
  let styleSheet;
  const existSheet = document.getElementById(styleId);

  if (!existSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.type = 'text/css';

    // Web Component 模式：将样式表注入到 shadowRoot 内
    const wcHost = document.querySelector('td-theme-generator');
    if (wcHost?.shadowRoot) {
      wcHost.shadowRoot.appendChild(styleSheet);
    } else {
      document.head.appendChild(styleSheet);
    }
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
