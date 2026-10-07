/* eslint-disable prefer-rest-params */
/**
 * @function debounce 防抖
 * @param func, delay
 */
export function debounce<TThis, TArgs extends unknown[]>(
  func: (this: TThis, ...args: TArgs) => void,
  delay = 300,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function (this: TThis, ...args: TArgs) {
    func.apply(this, args);
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * @function throttle 节流
 * @param func, delay
 */
export function throttle(this: unknown, func: (...args: unknown[]) => void, delay = 300) {
  let last = 0;
  const context = this;
  const invocationArgs = Array.from(arguments);
  return () => {
    const curr = +new Date();
    if (curr - last > delay) {
      func.apply(context, invocationArgs);
      last = curr;
    }
  };
}

interface SearchableHost extends HTMLElement {
  patchDom?: boolean;
}

// render shadow dom into light dom
export function patchShadowDomIntoDom(host?: SearchableHost) {
  if (!host) return;
  // 将shadow dom patch 到组件中方便搜索, 前提是组件不能有 default slot
  function patchNode() {
    requestAnimationFrame(() => {
      if (!host || !host.shadowRoot || host.patchDom) return;
      const slotElement = document.createElement('div');
      slotElement.setAttribute('slot', '__render_content__');
      slotElement.innerHTML = host.shadowRoot.innerHTML;
      host.appendChild(slotElement);
    });
  }

  window.addEventListener('load', patchNode);

  return () => window.removeEventListener('load', patchNode);
}

export function isComponentPage() {
  return /\/components\//.test(location.pathname);
}

export function isGlobalConfigPage() {
  return /\/global-configuration/.test(location.pathname);
}

// 手机定位特殊处理
export const mobileBodyStyle = {
  value: (_host: MobileBodyStyleHost, value?: MobileBodyStyle) => value || {},
  connect: (host: MobileBodyStyleHost) => {
    // 响应手机定位
    const handleResize = () => {
      const mobileBodyStyle: { paddingRight?: string } = {};
      if (host.platform === 'mobile') {
        const isMobileResponse = window.innerWidth < 960;
        if (isMobileResponse) {
          mobileBodyStyle.paddingRight = '0px';
        } else {
          mobileBodyStyle.paddingRight = isComponentPage() ? '400px' : '';
        }
      }
      host.mobileBodyStyle = mobileBodyStyle;
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },
};

// 判断是否内网
export function isIntranet() {
  return location.host.includes('oa.com');
}

// 监听暗黑模式
export function watchHtmlMode(callback: (themeMode: string) => void = () => {}) {
  const targetNode = document.documentElement;
  const config = { attributes: true };

  const observerCallback: MutationCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'theme-mode' && mutation.target instanceof Element) {
        const themeMode = mutation.target.getAttribute('theme-mode') || 'light';
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

export function isEn() {
  return getLang() === 'en';
}

export function parseBoolean(value: unknown, defaultValue = true) {
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return Boolean(value);
}

export const convert2PascalCase = (name: string) =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

interface MobileBodyStyle {
  paddingRight?: string;
}

interface MobileBodyStyleHost extends HTMLElement {
  platform?: string;
  mobileBodyStyle: MobileBodyStyle;
}
