export * from './animation';

// 缓存 shadowRoot 引用，避免每次调用都执行 DOM 查询
// 支持多实例：通过 setShadowRootRef / clearShadowRootRef 管理
let _shadowRootRef = null;

/**
 * 设置当前组件实例对应的 shadowRoot 引用
 * 在 Generator.vue onMounted 时调用，支持多实例场景
 */
export function setShadowRootRef(shadowRoot) {
  _shadowRootRef = shadowRoot;
}

/**
 * 清除 shadowRoot 引用
 * 在 Generator.vue onBeforeUnmount 时调用
 */
export function clearShadowRootRef() {
  _shadowRootRef = null;
}

/**
 * 获取 Web Component 的 shadowRoot（如果处于 WC 模式）
 * 优先使用缓存引用，回退到 DOM 查询
 */
export function getShadowRoot() {
  if (_shadowRootRef) return _shadowRootRef;
  // 回退：尝试从 DOM 查找（兼容未调用 setShadowRootRef 的场景）
  const host = document.querySelector('td-theme-generator');
  return host?.shadowRoot || null;
}

/**
 * 获取样式容器：
 * 主题生成器的核心功能是修改外部站点的 CSS 变量，因此主题样式表
 * 必须写入 document.head（:root 选择器需要匹配 document.documentElement）。
 * shadowRoot 仅用于隔离生成器自身的 UI，不用于隔离主题变量。
 */
export function getStyleContainer() {
  return document.head;
}

/**
 * 在正确的容器中按 ID 查找元素
 * 主题样式表（custom-theme 等）位于 document.head，需要在 document 中查找
 */
export function getElementById(id) {
  return document.getElementById(id);
}

/**
 * 在正确的容器中按选择器查找所有元素
 * 主题样式表位于 document，需要在 document 中查找
 */
export function querySelectorAll(selector) {
  return document.querySelectorAll(selector);
}

/**
 * 在正确的容器中按选择器查找首个元素
 * 主题样式表位于 document，需要在 document 中查找
 */
export function querySelector(selector) {
  return document.querySelector(selector);
}

/**
 * 获取用于设置 CSS 变量的根元素
 * 主题 CSS 使用 :root 选择器，对应 document.documentElement
 * 无论 WC 模式与否，CSS 变量都设置在外部 document 上以影响站点
 */
export function getCssRoot() {
  return document.documentElement;
}

/**
 * 同时设置 CSS 变量到 document.documentElement 和 shadowRoot 内的根元素
 * 外部：影响站点组件样式
 * 内部：影响生成器自身 UI 样式
 */
export function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
  // WC 模式下同步到 shadowRoot 内的根元素
  const shadowRoot = getShadowRoot();
  if (shadowRoot) {
    const rootEl = shadowRoot.querySelector('.theme-generator');
    if (rootEl) {
      rootEl.style.setProperty(name, value);
    }
  }
}

/**
 * 获取指定 CSS Token 对应的数值
 * 主题变量设置在 document.documentElement 上，从该元素读取
 */
export function getTokenValue(name) {
  const isDarkMode = document.documentElement.getAttribute('theme-mode') === 'dark';
  const rootElement = isDarkMode ? document.querySelector('[theme-mode="dark"]') : document.documentElement;
  return window.getComputedStyle(rootElement).getPropertyValue(name).toLowerCase().trim();
}

/**
 * 获取当前亮暗模式 (light / dark)
 * 从 document.documentElement 读取
 */
export function getThemeMode() {
  return document.documentElement.getAttribute('theme-mode') || 'light';
}

/**
 * 创建亮暗变化监听器
 * 观察 document.documentElement 的 theme-mode 属性变化
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
 * - 始终写入 document.head，因为主题 CSS 的 :root 选择器需要匹配 document.documentElement
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
 * 将 CSS 文本中的 :root 选择器转换为 :host 选择器，
 * 使动态注入的主题变量在 Shadow DOM 内也能生效。
 */
export function transformRootToHost(cssText) {
  let result = cssText;
  // :root.dark,:root[theme-mode=dark]{ 或 :root.dark,:root[theme-mode="dark"]{
  result = result.replace(/:root\.dark,?:root\[theme-mode="?dark"?\]\{/g, ':host.dark,:host([theme-mode="dark"]){');
  // :root[theme-mode=dark]{ 或 :root[theme-mode="dark"]{
  result = result.replace(/:root\[theme-mode="?dark"?\]\{/g, ':host([theme-mode="dark"]){');
  // :root,:root[theme-mode=light]{ 或 :root,:root[theme-mode="light"]{
  result = result.replace(/:root,?:root\[theme-mode="?light"?\]\{/g, ':host,:host([theme-mode="light"]){');
  // :root{ → :host{
  result = result.replace(/:root\{/g, ':host{');
  return result;
}

/**
 * 在 shadowRoot 中创建/更新带 ID 的 <style> 元素，
 * CSS 内容经 transformRootToHost() 转换，确保 :host 选择器在 Shadow DOM 内生效。
 */
export function appendShadowStyleSheet(shadowRoot, styleId, cssText) {
  if (!shadowRoot) return null;
  const hostCss = transformRootToHost(cssText);
  let styleSheet = shadowRoot.getElementById(styleId);
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.type = 'text/css';
    shadowRoot.appendChild(styleSheet);
  }
  styleSheet.textContent = hostCss;
  return styleSheet;
}

/**
 * 解决 `Popup` 组件脱离 Shadow DOM 的问题
 */
export function handleAttach() {
  return getShadowRoot()?.querySelector?.('.theme-generator') || document.body;
}

/**
 * 修复 TDesign Popup 在 Shadow DOM 下的 click-outside 关闭行为。
 *
 * TDesign Popup 在 document 上以 capture 模式监听 mousedown (onDocumentMouseDown)，
 * 通过 popperEl.contains(ev.target) 和 triggerEl.contains(ev.target) 判断点击是否在
 * popup 内。但 Shadow DOM 会将 ev.target 重定向为 shadow host (<td-theme-generator>)，
 * 导致 contains() 均为 false，popup 被误关闭。
 *
 * 修复：在 document 上注册更早的 capture listener，对来自 shadow DOM 内部且在
 * Popup overlay (data-td-popup / data-td-popup-parent) 内的 mousedown，
 * 用 stopImmediatePropagation() 阻止 TDesign 的 onDocumentMouseDown 执行。
 *
 * 对 shadow DOM 内但不在 popup overlay 内的点击，不拦截，让 Popup 正常关闭。
 * 对 shadow DOM 外部的点击，不影响原有行为。
 *
 * @param {ShadowRoot} shadowRoot - WC 的 shadowRoot 引用
 * @returns {Function} cleanup 函数，移除 document listener
 */
export function patchShadowDomPopupClose(shadowRoot) {
  if (!shadowRoot?.host) return null;

  function onShadowDomMousedown(ev) {
    // 只处理 mousedown 事件起源于 shadow DOM 内部的情况
    // composedPath()[0] 是事件的原始 target（不受 shadow DOM retargeting 影响）
    const path = ev.composedPath();
    if (path.length === 0) return;

    // 检查原始 target 是否在 shadow DOM 内
    // path 包含 shadow root 时说明事件起源于 shadow DOM 内部
    if (!path.includes(shadowRoot)) return;

    // 检查点击是否在 Popup overlay 或嵌套 popup 内
    const isInPopup = path.some((el) => {
      if (!(el instanceof HTMLElement)) return false;
      return el.hasAttribute('data-td-popup') || el.hasAttribute('data-td-popup-parent');
    });

    if (isInPopup) {
      // 点击在 popup overlay 内，阻止 TDesign 的 document capture handler 执行
      // 防止 popup 被误关闭
      ev.stopImmediatePropagation();
    }
    // 如果不在 popup overlay 内，不拦截，让 TDesign 的 handler 正常关闭 popup
  }

  // 在 document 上注册 capture 阶段的 listener
  // 此 listener 必须比 TDesign Popup 的 onDocumentMouseDown 更早注册，
  // 这样在同一个 capture 阶段中会先执行
  document.addEventListener('mousedown', onShadowDomMousedown, true);

  // 返回 cleanup 函数
  return () => {
    document.removeEventListener('mousedown', onShadowDomMousedown, true);
  };
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
