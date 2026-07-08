import { getThemeMode, parseRootCss, setUpModeObserver } from '../utils';
import { CUSTOM_DARK_ID, CUSTOM_THEME_ID, isMiniProgram, isMobile, isUniApp } from './core';

// 标记小程序外层 iframe 的 contentDocument 是否已建立嵌套 iframe 观察，
// 避免 handleNested 立即调用 + onload 时重复创建 MutationObserver。
const NESTED_OBSERVED_FLAG = '__tdThemeGeneratorNestedObserved';

/* ----- 同步亮暗模式 -----  */
function handleMobileModeChange(iframe, mode) {
  const iframeDom = getIframeDoc(iframe, 'handleMobileModeChange');
  if (!iframeDom) return;
  iframeDom.documentElement.setAttribute('theme-mode', mode);
}

// 跨域 iframe 的 contentDocument 为 null，无法注入样式。
// 仅当同源时（生产环境 tdesign.tencent.com 页面 + iframe 同域）才能同步主题；
// surge.sh 等预览环境页面与 iframe 跨域，主题同步不可用，console 给出警告而非崩溃。
function getIframeDoc(iframe, action) {
  const doc = iframe.contentDocument;
  if (!doc) {
    if (!iframe.dataset.crossOriginWarned) {
      iframe.dataset.crossOriginWarned = 'true';
      console.warn(
        `[td-theme-generator] 跨域 iframe 无法同步主题（${action}）。` +
          `页面与 iframe 必须同源。生产环境（tdesign.tencent.com）不受影响，预览环境（surge.sh）有限制。`,
      );
    }
    return null;
  }
  return doc;
}

// 预览 iframe 的选择器与导出逻辑（core.js 的 `page, .page`）不同：
// 导出的 app.wxss/app.css 运行在真实小程序/uni-app 环境，根节点是 `page` 元素；
// 而文档站的预览 iframe 是 H5 渲染：
//   - 小程序 m2w 预览：内容渲染在 `body` 内，无 `page` 元素
//   - uni-app H5 预览：页面根节点是 `uni-page-body`，不是 `page`
// 若用 `page, .page`，预览 iframe 内匹配不到任何元素，CSS 变量无处定义，主题不生效。
function getMobileSelector(uniapp) {
  return uniapp ? 'uni-page-body' : 'body';
}

function handleMiniProgramModeChange(iframe, mode, uniapp = false) {
  const isDark = mode === 'dark';

  const prevModeId = isDark ? CUSTOM_THEME_ID : CUSTOM_DARK_ID;
  const currentModeId = isDark ? CUSTOM_DARK_ID : CUSTOM_THEME_ID;

  const themeStyle = document.getElementById(isDark ? CUSTOM_DARK_ID : CUSTOM_THEME_ID);

  /* 小程序无法通过 root 上的属性来设置，不同模式需要重新更新样式 */
  const iframeDom = getIframeDoc(iframe, 'handleMiniProgramModeChange');
  if (!iframeDom) return;

  // 添加新的
  const currentStyle = iframeDom.getElementById(currentModeId);
  if (!currentStyle) {
    // 用 iframe 自身的 document 创建节点，保证 ownerDocument 一致；
    // 否则 iframe.contentDocument.getElementById 后续无法命中该节点，
    // 导致 handleMiniProgramTokenChange 更新失败（小程序/uniapp 主题修改无效）。
    const style = iframeDom.createElement('style');
    style.id = currentModeId;

    const { rootContent: cssString } = parseRootCss(themeStyle.textContent);
    const selector = getMobileSelector(uniapp);
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
  const iframeDom = getIframeDoc(iframe, 'handleMobileTokenChange');
  if (!iframeDom) return;

  const updatedCss = styleElement.textContent;
  const iframeStyleElement = iframeDom.getElementById(styleElement.id);

  if (iframeStyleElement) {
    iframeStyleElement.textContent = updatedCss;
  } else {
    const newStyleElement = iframeDom.createElement('style');
    newStyleElement.id = styleElement.id;
    newStyleElement.type = 'text/css';
    newStyleElement.textContent = updatedCss;
    iframeDom.head.appendChild(newStyleElement);
  }
}

function handleMiniProgramTokenChange(iframe, styleElement, uniapp = false) {
  const iframeDom = getIframeDoc(iframe, 'handleMiniProgramTokenChange');
  if (!iframeDom) return;

  const selector = getMobileSelector(uniapp);
  const { rootContent } = parseRootCss(styleElement.textContent);
  const updatedCss = `${selector} {\n${rootContent}\n}`;

  const updatedId = styleElement.id;
  const iframeStyleElement = iframeDom.getElementById(updatedId);

  if (iframeStyleElement) {
    iframeStyleElement.textContent = updatedCss;
  } else {
    if (updatedId === CUSTOM_THEME_ID || updatedId === CUSTOM_DARK_ID) return;

    const newStyleElement = iframeDom.createElement('style');
    newStyleElement.id = styleElement.id;
    newStyleElement.type = 'text/css';
    newStyleElement.textContent = updatedCss;
    iframeDom.head.appendChild(newStyleElement);
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
      handleMiniProgramModeChange(iframe, mode, isUniApp(device));
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
      handleMiniProgramTokenChange(iframe, styleElement, isUniApp(device));
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
    // 先断开旧的 observers 再重新创建，避免泄漏
    [observers.themeMode, observers.themeToken].flat().forEach((o) => o?.disconnect());
    observers.themeMode = watchThemeModeChange(iframe);
    observers.themeToken = watchThemeTokenChange(iframe);
  };

  // 注：iframe 级 observer 在 iframe 重新加载时由 onload 重建；
  // iframe 被移除时其 contentDocument 一并销毁，observer 不会继续触发回调。
  // 顶层 document 级 observer 由 syncThemeToIframe 返回的 cleanup 负责。
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
 *
 * @param {string} device
 * @returns {Function} cleanup 函数，断开内部创建的 document 级 MutationObserver，
 *   供调用方在 Web Component 卸载时调用以避免泄漏
 */
export function syncThemeToIframe(device) {
  if (!isMobile(device)) return () => {};

  const handleDocPhoneIframe = () => {
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
        watchNestedIframes(getIframeDoc(previewIframe, 'watchNestedIframes'), device);
      };
      previewIframe.onload = handleNested;
      // iframe 可能已加载完成（onload 不会再触发），立即检查一次嵌套 iframe。
      // 只检查嵌套 iframe，不重复执行 prevOnload（watchThemeChange 已初始化过）。
      watchNestedIframes(getIframeDoc(previewIframe, 'watchNestedIframes'), device);
    } else {
      beforeWatchThemeChange(previewIframe, device);
    }
  };

  // 立即检查一次：td-doc-phone > iframe 可能已在 DOM 中（SPA 已渲染完成），
  // 此时不会再触发 childList MutationObserver，仅靠 observer 会漏掉。
  handleDocPhoneIframe();

  // 监听后续的 DOM 变化（SPA 路由切换时 td-doc-phone > iframe 重新插入）
  const observer = new MutationObserver(() => {
    handleDocPhoneIframe();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
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
