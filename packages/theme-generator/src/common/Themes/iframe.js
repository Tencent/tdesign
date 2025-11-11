import { extractRootContent } from '../utils';
import { CUSTOM_DARK_ID, CUSTOM_THEME_ID, isMiniProgram, isUniApp, isMobile } from './';

/* ----- 同步亮暗模式 -----  */
function handleMobileModeChange(iframe, mode) {
  iframe.contentDocument.documentElement.setAttribute('theme-mode', mode);
}

function handleMiniProgramModeChange(iframe, mode, uniapp = false) {
  const isDark = mode === 'dark';

  const prevModeId = isDark ? CUSTOM_THEME_ID : CUSTOM_DARK_ID;
  const currentModeId = isDark ? CUSTOM_DARK_ID : CUSTOM_THEME_ID;

  const themeStyle = document.getElementById(isDark ? CUSTOM_DARK_ID : CUSTOM_THEME_ID);

  /* 小程序无法通过 root 上的属性来设置，不同模式需要重新更新样式 */
  const iframeDom = iframe.contentDocument;

  // 添加新的
  const currentStyle = iframeDom.getElementById(currentModeId);
  if (!currentStyle) {
    const style = document.createElement('style');
    style.id = currentModeId;

    const cssString = extractRootContent(themeStyle.innerText);
    const selector = uniapp ? 'uni-page-body' : 'body';
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

function handleMiniProgramTokenChange(iframe, styleElement, uniapp = false) {
  const selector = uniapp ? 'uni-page-body' : 'body';
  const updatedCss = `${selector} {\n${extractRootContent(styleElement.innerText)}\n}`;

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
      handleMiniProgramModeChange(iframe, mode, isUniApp(device));
    } else {
      handleMobileModeChange(iframe, mode);
    }
  };

  // 初始化
  const mode = document.documentElement.getAttribute('theme-mode');
  handleModeChange(mode);

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'theme-mode') {
        const newMode = document.documentElement.getAttribute('theme-mode');
        handleModeChange(newMode);
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
          // 小程序实际的 iframe 嵌套在里面
          previewIframe.onload = () => {
            watchNestedIframes(previewIframe.contentDocument, device);
          };
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
