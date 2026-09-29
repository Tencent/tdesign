import { html, define } from 'hybrids';
import style from './style.less?inline';
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
    value: (_host, v) => {
      if (v) {
        localStorage.setItem('--tdesign-theme', v);
        window.dispatchEvent(storageChangeEvent);
      }

      return v || 'light';
    },
    connect: (host, key, invalidate) => {
      const lastTheme = localStorage.getItem('--tdesign-theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const themeToApply = lastTheme || systemTheme;

      document.documentElement.setAttribute('theme-mode', themeToApply);
      Object.assign(host, { [key]: themeToApply });
      invalidate();

      const observer = watchHtmlMode((themeMode) => Object.assign(host, { [key]: themeMode }));

      return () => observer.disconnect();
    },
  },
  blockStyleMap: {
    value: (_host, v) => v || undefined,
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
