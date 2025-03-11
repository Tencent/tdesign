import { html, define } from 'hybrids';
import style from './style.less';
import moonIcon from '@images/moon.svg?raw';
import sunIcon from '@images/sun.svg?raw';
import { watchHtmlMode } from '@utils';

// const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const storageChangeEvent = new CustomEvent('storageChange');

function toggleTheme(host, currentTheme) {
  document.documentElement.removeAttribute('theme-mode');
  Object.assign(host, { theme: currentTheme });
  document.documentElement.setAttribute('theme-mode', currentTheme);
}

function handleTabClick(host, event, currentTheme) {
  const root = document.documentElement;
  const prevTheme = root.getAttribute('theme-mode');
  if (prevTheme === currentTheme) return;

  if (!document.startViewTransition) return toggleTheme(host, currentTheme);
  document.startViewTransition(() => toggleTheme(host, currentTheme));
}

function initBlockStyleMap(host) {
  requestAnimationFrame(() => {
    const { shadowRoot } = host;
    const items = shadowRoot.querySelectorAll('.item');
    let styleMap = {};
    items.forEach((item) => {
      if (!item.offsetWidth) {
        styleMap = null;
      } else {
        const { theme } = item.dataset;
        styleMap[theme] = {
          width: `${item.offsetWidth}px`,
          left: `${item.offsetLeft}px`,
        };
      }
    });
    Object.assign(host, { blockStyleMap: styleMap });
  });
}

export default define({
  tag: 'td-theme-tabs',
  theme: {
    get: (_host, lastValue) => lastValue || 'light',
    set: (_host, value) => {
      if (value) {
        localStorage.setItem('--tdesign-theme', value);
        window.dispatchEvent(storageChangeEvent);
      }

      return value;
    },
    connect: (host, key, invalidate) => {
      const lastTheme = localStorage.getItem('--tdesign-theme');

      if (lastTheme) {
        document.documentElement.removeAttribute('theme-mode');

        Object.assign(host, { [key]: lastTheme });
        document.documentElement.setAttribute('theme-mode', lastTheme);
        invalidate();
      }

      const observer = watchHtmlMode((themeMode) => Object.assign(host, { [key]: themeMode }));

      return () => observer.disconnect();
    },
  },
  blockStyleMap: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
  },
  render: (host) => {
    const { theme, blockStyleMap } = host;

    if (!blockStyleMap) initBlockStyleMap(host);
    const blockStyle = blockStyleMap ? blockStyleMap[theme] : {};

    return html`
      <div class="TDesign-theme-tabs">
        <div class="TDesign-theme-tabs__block" style=${blockStyle || {}}></div>
        <div
          onclick=${(host, e) => handleTabClick(host, e, 'light')}
          data-theme="light"
          class="item sun ${theme === 'light' ? 'active' : ''}"
          innerHTML=${sunIcon}
        ></div>
        <div
          onclick=${(host, e) => handleTabClick(host, e, 'dark')}
          data-theme="dark"
          class="item moon ${theme === 'dark' ? 'active' : ''}"
          innerHTML=${moonIcon}
        ></div>
      </div>
    `.css`${style}`;
  },
});
