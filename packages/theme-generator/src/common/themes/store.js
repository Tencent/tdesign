import { reactive } from 'vue';

import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from './built-in';
import { clearLocalTheme, getDefaultTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';
import { setCssVar } from '../utils';

export const themeStore = reactive({
  device: 'web',
  theme: TDESIGN_WEB_THEME,
  brandColor: getOptionFromLocal('color') || DEFAULT_THEME_META.value,
  refreshId: 0, // 用于强制刷新绑定了 key 的组件 UI
  updateDevice(device) {
    this.device = device;
    this.theme = getInitialTheme(device);
    // 若用户未自定义过主题色，brandColor 跟随当前主题
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
    // 同时设置到 document.documentElement（影响外部站点）和 shadowRoot 内（影响生成器自身 UI）
    setCssVar('--brand-main', color);
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
