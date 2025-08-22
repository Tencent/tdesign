import Vue from 'vue';

import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from './built-in';
import { clearLocalTheme, getDefaultTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';

export const themeStore = Vue.observable({
  device: 'web',
  theme: TDESIGN_WEB_THEME,
  brandColor: getOptionFromLocal('color') || DEFAULT_THEME_META.value,
  refreshId: 0, // 用于强制刷新绑定了 key 的组件 UI
  updateDevice(device) {
    this.device = device;
    this.theme = getInitialTheme(device);
  },
  updateTheme(theme) {
    this.theme = theme;
    initThemeStyleSheet(theme.enName, this.device);
    clearLocalTheme();
    updateLocalOption('theme', theme.enName !== DEFAULT_THEME_META.enName ? theme.enName : null);
    this.updateBrandColor(theme.value);
    this.incrementRefreshId();
  },
  resetTheme() {
    this.updateTheme(getDefaultTheme(this.device));
  },
  updateBrandColor(color) {
    this.brandColor = color;
    document.documentElement.style.setProperty('--brand-main', color);
  },
  incrementRefreshId() {
    this.refreshId++;
  },
});

function getInitialTheme(device = 'web') {
  const localThemeName = getOptionFromLocal('theme') || DEFAULT_THEME_META.enName;
  const theme = initThemeStyleSheet(localThemeName, device);
  return theme;
}
