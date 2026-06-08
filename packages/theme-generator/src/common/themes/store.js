import { reactive } from 'vue';

import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from './built-in';
import { clearLocalTheme, getDefaultTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';
import { getCssRoot } from '../utils';

export const themeStore = reactive({
  device: 'web',
  theme: TDESIGN_WEB_THEME,
  brandColor: getOptionFromLocal('color') || DEFAULT_THEME_META.value,
  refreshId: 0,
  updateDevice(device) {
    this.device = device;
    this.theme = getInitialTheme(device);
    if (!getOptionFromLocal('color')) {
      this.brandColor = this.theme.value;
    }
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
    // WC 模式下设置到 shadowRoot 内的根元素，非 WC 模式下设置到 document.documentElement
    getCssRoot().style.setProperty('--brand-main', color);
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
