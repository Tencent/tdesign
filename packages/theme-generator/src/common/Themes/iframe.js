import { extractRootContent } from '../utils';
import { CUSTOM_DARK_ID, CUSTOM_THEME_ID, isMiniProgram, isMobile } from './';

function handleMobileModeChange(iframe, mode) {
  iframe.contentDocument.documentElement.setAttribute('theme-mode', mode);
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
    const style = document.createElement('style');
    style.id = currentModeId;

    const cssString = extractRootContent(themeStyle.innerText);
    style.textContent = `body {\n${cssString}\n}`;

    iframeDom.head.appendChild(style);
  }

  // 移除旧的
  const preStyle = iframeDom.getElementById(prevModeId);
  if (preStyle) {
    preStyle.remove();
  }
}

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
  const updatedCss = `body {\n${extractRootContent(styleElement.innerText)}\n}`;

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

/**
 * <html theme-mode="xxx">
 */
function watchThemeModeChange(iframe) {
  if (!iframe?.contentDocument) return null;

  const device = iframe.getAttribute('device');
  const handleModeChange = (mode) => {
    if (isMiniProgram(device)) {
      handleMiniProgramModeChange(iframe, mode);
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
 * <style id="custom-theme[-xxx]" type="text/css">
 */
function watchThemeTokenChange(iframe) {
  if (!iframe?.contentDocument) return null;

  const allCustomStyles = document.querySelectorAll(`[id^="${CUSTOM_THEME_ID}"]`);
  if (!allCustomStyles.length) return null;

  const device = iframe.getAttribute('device');
  const handleTokenChange = (styleElement) => {
    if (isMiniProgram(device)) {
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

function watchThemeChange(iframe) {
  const observers = {};

  const device = iframe.getAttribute('device');
  if (isMiniProgram(device)) {
    observers.themeMode = watchThemeModeChange(iframe);
    observers.themeToken = watchThemeTokenChange(iframe);
  } else {
    iframe.onload = () => {
      observers.themeMode = watchThemeModeChange(iframe);
      observers.themeToken = watchThemeTokenChange(iframe);
    };

    iframe.unload = () => {
      Object.entries(observers).forEach(([, observer]) => {
        if (Array.isArray(observer)) {
          observer.forEach((obs) => obs.disconnect());
        } else {
          observer.disconnect();
        }
      });
    };
  }
}

export function syncThemeToIframe(device) {
  if (!isMobile(device)) return;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const docPhone = document.querySelector('td-doc-phone');
        const previewIframe = docPhone?.querySelector('iframe');
        if (!previewIframe) return;
        if (isMiniProgram(device)) {
          // 小程序实际的 iframe 嵌套在里面
          previewIframe.addEventListener('load', () => {
            const miniIframe = previewIframe.contentDocument?.querySelector('iframe');
            if (!miniIframe) return;
            miniIframe.setAttribute('device', device);
            watchThemeChange(miniIframe);
          });
        } else {
          previewIframe.setAttribute('device', device);
          watchThemeChange(previewIframe);
        }
      }
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}
