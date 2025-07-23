import Vue from 'vue';

import { DEFAULT_THEME, RECOMMEND_THEMES } from './built-in';
import { clearLocalTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';

export const themeStore = Vue.observable({
  theme: getInitialTheme(),
  brandColor: getInitialBrandColor(),
  refreshId: 0, // 用于强制刷新绑定了 key 的组件 UI
  setThemeState(theme) {
    this.theme = theme;
    initThemeStyleSheet(theme.enName);
    clearLocalTheme();
    updateLocalOption('theme', theme.enName, theme.enName !== DEFAULT_THEME.enName);
    this.setBrandColorState(theme.value);
    this.incrementRefreshId();
  },
  resetTheme() {
    this.setThemeState(DEFAULT_THEME);
  },
  setBrandColorState(color) {
    this.brandColor = color;
    updateLocalOption('color', color, color !== this.theme.value);
    document.documentElement.style.setProperty('--brand-main', color);
  },
  incrementRefreshId() {
    this.refreshId++;
  },
});

export default themeStore;

function findLocalTheme() {
  const localThemeName = getOptionFromLocal('theme');
  const localTheme = findThemeByName(localThemeName) || DEFAULT_THEME;
  return localTheme;
}

function getInitialTheme() {
  const localTheme = findLocalTheme();
  initThemeStyleSheet(localTheme.enName);
  return localTheme;
}

function getInitialBrandColor() {
  let localColor = getOptionFromLocal('color') || findLocalTheme().value;
  document.documentElement.style.setProperty('--brand-main', localColor);
  return localColor;
}

function findThemeByName(name) {
  for (const category of RECOMMEND_THEMES) {
    const theme = category.options.find((t) => t.enName === name);
    if (theme) return theme;
  }
  return null;
}
