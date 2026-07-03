import { getThemeMode, parseRootCss, setUpModeObserver } from '../utils';
import { CUSTOM_DARK_ID, CUSTOM_THEME_ID, isMiniProgram, isMobile, isUniApp } from './core';

// 标记小程序外层 iframe 的 contentDocument 是否已建立嵌套 iframe 观察，
// 避免 handleNested 立即调用 + onload 时重复创建 MutationObserver。
const NESTED_OBSERVED_FLAG = '__tdThemeGeneratorNestedObserved';

/* ----- 同步亮暗模式 -----  */
function handleMobileModeChange(iframe, mode) {
  iframe.contentDocument.documentElement.setAttribute('theme-mode', mode);
}

// 选择器必须与 exportCustomStyleSheet 导出逻辑一致（core.js）：
// 小程序 / uni-app 的页面根节点是 `page` 元素或 `.page` 类，不是 `body`。
// 之前用 `body`（小程序）/ `uni-page-body`（uni-app），CSS 变量定义在 body 上，
// 会被 iframe 内 app.wxss 中定义在 `page` 上的同名变量覆盖（更近的祖先优先），
// 导致主题色不生效。统一对齐导出逻辑用 `page, .page`。
function getMobileSelector() {
  return 'page, .page';
}

function handleMiniProgramModeChange(iframe, mode) {
  const isDark = mode === 'dark';

  const prevModeId = isDark ? CUSTOM_THEME_ID : CUSTOM_DARK_ID;
  const currentModeId = isDark ? CUSTOM_DARK_ID : CUSTOM_THEME_ID;

  const themeStyle = document.getElementById(isDark ? CUSTOM_DARK_ID : CUSTOM_THEME_ID);

  /* 小程序无法通过 root 上的属性来设置，不同模式需要重新更新样式 */
  const iframeDom = iframe.contentDocument;

  // 添加新的
  const currentStyle = iframeDom.getElementById(currentModeId);
  if (!currentStyle) {
    // 用 iframe 自身的 document 创建节点，保证 ownerDocument 一致；
    // 否则 iframe.contentDocument.getElementById 后续无法命中该节点，
    // 导致 handleMiniProgramTokenChange 更新失败（小程序/uniapp 主题修改无效）。
    const style = iframeDom.createElement('style');
    style.id = currentModeId;

    const { rootContent: cssString } = parseRootCss(themeStyle.innerText);
    const selector = getMobileSelector();
    style.textContent = `${selector} {\n${cssString}\n}`;

    iframeDom.head.appendChild(style);
  }

  // 移除旧的
  const preStyle = iframeDom.getElementById(prevModeId);
  if (preStyle) {
    preStyle.remove();
  }
}
/* ------------------- */

/* ----- 同步 Token -----  */
function handleMobileTokenChange(iframe, styleElement) {
  const updatedCss = styleElement.innerText;
  const iframeStyleElement = iframe.contentDocument.getElementById(styleElement.id);

  if (iframeStyleElement) {
    iframeStyleElement.textContent = updatedCss;
  } else {
    const newStyleElement = iframe.contentDocument.createElement('style');
    newStyleElement.id = styleElement.id;
    newStyleElement.type = 'text/css';
    newStyleElement.textContent = updatedCss;
    iframe.contentDocument.head.appendChild(newStyleElement);
  }
}

function handleMiniProgramTokenChange(iframe, styleElement) {
  const selector = getMobileSelector();
  const { rootContent } = parseRootCss(styleElement.innerText);
  const updatedCss = `${selector} {\n${rootContent}\n}`;

  const updatedId = styleElement.id;
  const iframeStyleElement = iframe.contentDocument.getElementById(updatedId);

  if (iframeStyleElement) {
    iframeStyleElement.textContent = updatedCss;
  } else {
    if (updatedId === CUSTOM_THEME_ID || updatedId === CUSTOM_DARK_ID) return;

    const newStyleElement = iframe.contentDocument.createElement('style');
    newStyleElement.id = styleElement.id;
    newStyleElement.type = 'text/css';
    newStyleElement.textContent = updatedCss;
    iframe.contentDocument.head.appendChild(newStyleElement);
  }
}
/* ------------------- */

/**
 * 监听亮暗模式变化
 * - e.g. `<html theme-mode="dark">`
 */
function watchThemeModeChange(iframe) {
  if (!iframe?.contentDocument) return null;

  const device = iframe.getAttribute('device');
  const handleModeChange = (mode) => {
    if (isMiniProgram(device) || isUniApp(device)) {
      handleMiniProgramModeChange(iframe, mode);
    } else {
      handleMobileModeChange(iframe, mode);
    }
  };

  // 初始化
  handleModeChange(getThemeMode());

  const observer = setUpModeObserver((newMode) => {
    handleModeChange(newMode);
  });
  return observer;
}

/**
 * 监听样式 Token 变化，即相关样式表的更新
 * - e.g. `<style id="custom-theme" type="text/css">`
 */
function watchThemeTokenChange(iframe) {
  if (!iframe?.contentDocument) return null;

  const allCustomStyles = document.querySelectorAll(`[id^="${CUSTOM_THEME_ID}"]`);
  if (!allCustomStyles.length) return null;

  const device = iframe.getAttribute('device');
  const handleTokenChange = (styleElement) => {
    if (isMiniProgram(device) || isUniApp(device)) {
      handleMiniProgramTokenChange(iframe, styleElement);
    } else {
      handleMobileTokenChange(iframe, styleElement);
    }
  };

  // 初始化
  allCustomStyles.forEach((styleElement) => {
    handleTokenChange(styleElement);
  });

  const observers = [];
  allCustomStyles.forEach((styleElement) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          handleTokenChange(styleElement);
        }
      }
    });

    observer.observe(styleElement, {
      childList: true,
    });

    observers.push(observer);
  });

  return observers;
}

/**
 * 集中处理主题变化（亮暗模式与样式 Token）
 */
function watchThemeChange(iframe) {
  // 同一个 iframe 只监听一次
  if (iframe.dataset.observed === 'true') return;
  iframe.dataset.observed = 'true';

  const observers = {};

  observers.themeMode = watchThemeModeChange(iframe);
  observers.themeToken = watchThemeTokenChange(iframe);

  iframe.onload = () => {
    observers.themeMode = watchThemeModeChange(iframe);
    observers.themeToken = watchThemeTokenChange(iframe);
  };

  iframe.unload = () => {
    Object.values(observers)
      .flat()
      .forEach((observer) => {
        observer.disconnect();
      });
  };
}

/**
 * 监听前统一设置标识符
 */
function beforeWatchThemeChange(iframe, device) {
  iframe.setAttribute('device', device);
  watchThemeChange(iframe);
}

/**
 * 同步站点的主题到移动端的 iframe
 */
export function syncThemeToIframe(device) {
  if (!isMobile(device)) return;

  // 监听 iframe 的加载变化
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const docPhone = document.querySelector('td-doc-phone');
        const previewIframe = docPhone?.querySelector('iframe');
        if (!previewIframe) return;

        if (isMiniProgram(device)) {
          // 小程序预览有两种渲染模式：
          // 1. m2w web 预览：直接在 previewIframe 内渲染（无嵌套 iframe），
          //    需要直接同步主题到 previewIframe 本身。
          // 2. 开发者工具模拟器：在嵌套的 webview iframe 中渲染，
          //    需要同步到嵌套 iframe。
          // 两种情况都覆盖：先给 previewIframe 设置主题同步，
          // 再查找嵌套 webview iframe。
          beforeWatchThemeChange(previewIframe, device);

          // watchThemeChange 已设置 previewIframe.onload 用于 iframe 加载后重新初始化观察者；
          // 这里链式包装，在原有 onload 之后再处理嵌套 iframe，避免覆盖。
          const prevOnload = previewIframe.onload;
          const handleNested = () => {
            if (typeof prevOnload === 'function') prevOnload();
            watchNestedIframes(previewIframe.contentDocument, device);
          };
          previewIframe.onload = handleNested;
          // iframe 可能已加载完成（onload 不会再触发），立即检查一次嵌套 iframe。
          // 只检查嵌套 iframe，不重复执行 prevOnload（watchThemeChange 已初始化过）。
          watchNestedIframes(previewIframe.contentDocument, device);
        } else {
          beforeWatchThemeChange(previewIframe, device);
        }
      }
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/**
 * 处理微信小程序预览 iframe 不止一个的情况
 */
function watchNestedIframes(iframeDocument, device) {
  if (!iframeDocument) return;
  // 同一个 iframe document 只观察一次：handleNested 会立即调用 + onload 时再调用，
  // 不加守卫会重复创建 MutationObserver。iframe 重新加载后 contentDocument 是新对象，标记自然失效。
  if (iframeDocument[NESTED_OBSERVED_FLAG]) return;
  iframeDocument[NESTED_OBSERVED_FLAG] = true;

  const handleWatch = () => {
    const nestedIframes = iframeDocument.querySelectorAll('iframe');
    nestedIframes.forEach((iframe) => {
      if (!iframe.id?.startsWith('webview')) return;
      beforeWatchThemeChange(iframe, device);
    });
  };

  handleWatch();

  const observer = new MutationObserver(() => {
    handleWatch();
  });

  observer.observe(iframeDocument, {
    childList: true,
    subtree: true,
  });
}
