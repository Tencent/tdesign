/* eslint-disable prefer-rest-params */
/**
 * @function debounce 防抖
 * @param func, delay
 */
export function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    func.apply(this, arguments);
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * @function throttle 节流
 * @param func, delay
 */
export function throttle(func, delay = 300) {
  let last = 0;
  return () => {
    const curr = +new Date();
    if (curr - last > delay) {
      func.apply(this, arguments);
      last = curr;
    }
  };
}

// render shadow dom into light dom
export function patchShadowDomIntoDom(host) {
  if (!host) return;
  // 将shadow dom patch 到组件中方便搜索, 前提是组件不能有 default slot
  function patchNode() {
    requestAnimationFrame(() => {
      if (!host || !host.shadowRoot || host.patchDom) return;
      const slotElement = document.createElement("div");
      slotElement.setAttribute("slot", "__render_content__");
      slotElement.innerHTML = host.shadowRoot.innerHTML;
      host.appendChild(slotElement);
    });
  }

  window.addEventListener("load", patchNode);

  return () => window.removeEventListener("load", patchNode);
}

// 手机定位特殊处理
export const mobileBodyStyle = {
  get: (host, lastValue) => lastValue || {},
  set: (host, value) => value,
  connect: (host, key) => {
    // 响应手机定位
    const handleResize = () => {
      const mobileBodyStyle = {};
      if (host.platform === "mobile") {
        const isComponentPage = /\/components\//.test(location.pathname);
        const isMobileResponse = window.innerWidth < 960;
        if (isMobileResponse) {
          mobileBodyStyle.paddingRight = "0px";
        } else {
          mobileBodyStyle.paddingRight = isComponentPage ? "400px" : "";
        }
      }
      host.mobileBodyStyle = mobileBodyStyle;
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  },
};

// 判断是否内网
export function isIntranet() {
  return location.host.includes("oa.com");
}

// 监听暗黑模式
export function watchHtmlMode(callback = () => {}) {
  const targetNode = document.documentElement;
  const config = { attributes: true };

  const observerCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === "theme-mode") {
        const themeMode = mutation.target.getAttribute("theme-mode") || 'light';
        if (themeMode) callback(themeMode);
      }
    }
  };

  const observer = new MutationObserver(observerCallback);
  observer.observe(targetNode, config);

  return observer;
}

export function getLang() {
  const isEn = /-en$/.test(location.pathname);
  return isEn ? 'en' : 'zh';
}
