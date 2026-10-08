import { html, define } from 'hybrids';
import style from './style.less?inline';
import moonIcon from '@images/moon.svg?raw';
import sunIcon from '@images/sun.svg?raw';
import { watchHtmlMode } from '@utils';

// const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const storageChangeEvent = new CustomEvent('storageChange');

type Theme = 'light' | 'dark';

interface BlockStyle {
  width: string;
  left: string;
}

interface ThemeTabsProps {
  theme: Theme;
  blockStyleMap: Partial<Record<Theme, BlockStyle>> | undefined;
  _blockStylePending?: boolean;
}

type ThemeTabsHost = ThemeTabsProps & HTMLElement;

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function toggleTheme(host: ThemeTabsHost, currentTheme: Theme) {
  document.documentElement.removeAttribute('theme-mode');
  Object.assign(host, { theme: currentTheme });
  document.documentElement.setAttribute('theme-mode', currentTheme);
}

function handleTabClick(host: ThemeTabsHost, currentTheme: Theme) {
  const root = document.documentElement;
  const prevTheme = root.getAttribute('theme-mode');
  if (prevTheme === currentTheme) return;

  if (!document.startViewTransition) return toggleTheme(host, currentTheme);
  document.startViewTransition(() => toggleTheme(host, currentTheme));
}

function initBlockStyleMap(host: ThemeTabsHost) {
  if (host._blockStylePending) return;
  host._blockStylePending = true;
  requestAnimationFrame(() => {
    host._blockStylePending = false;
    const { shadowRoot } = host;
    if (!shadowRoot) return;
    const items = shadowRoot.querySelectorAll<HTMLElement>('.item');
    let styleMap: Partial<Record<Theme, BlockStyle>> | undefined = {};
    items.forEach((item) => {
      if (!item.offsetWidth) {
        styleMap = undefined;
      } else {
        const { theme } = item.dataset;
        const itemTheme = theme || null;
        if (!styleMap || !isTheme(itemTheme)) return;
        styleMap[itemTheme] = {
          width: `${item.offsetWidth}px`,
          left: `${item.offsetLeft}px`,
        };
      }
    });
    Object.assign(host, { blockStyleMap: styleMap });
  });
}

export default define<ThemeTabsProps>({
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
      const storedTheme = localStorage.getItem('--tdesign-theme');
      const lastTheme = isTheme(storedTheme) ? storedTheme : undefined;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const themeToApply = lastTheme || systemTheme;

      document.documentElement.setAttribute('theme-mode', themeToApply);
      Object.assign(host, { [key]: themeToApply });
      invalidate();

      const observer = watchHtmlMode((themeMode) => {
        if (isTheme(themeMode)) Object.assign(host, { [key]: themeMode });
      });

      return () => observer.disconnect();
    },
  },
  blockStyleMap: {
    value: (_host, v) => v || undefined,
  },
  _blockStylePending: false,
  render: (host) => {
    const { theme, blockStyleMap } = host;

    if (!blockStyleMap) initBlockStyleMap(host);
    const blockStyle = blockStyleMap?.[theme] || {};

    return html`
      <div class="TDesign-theme-tabs">
        <div class="TDesign-theme-tabs__block" style=${blockStyle || {}}></div>
        <div
          onclick=${(host: ThemeTabsHost) => handleTabClick(host, 'light')}
          data-theme="light"
          class="item sun ${theme === 'light' ? 'active' : ''}"
          innerHTML=${sunIcon}
        ></div>
        <div
          onclick=${(host: ThemeTabsHost) => handleTabClick(host, 'dark')}
          data-theme="dark"
          class="item moon ${theme === 'dark' ? 'active' : ''}"
          innerHTML=${moonIcon}
        ></div>
      </div>
    `.css`${style}`;
  },
});
