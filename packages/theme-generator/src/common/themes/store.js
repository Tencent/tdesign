import { reactive } from 'vue';

import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from './built-in';
import { clearLocalTheme, getDefaultTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';

export const themeStore = reactive({
  device: 'web',
  theme: TDESIGN_WEB_THEME,
  brandColor: getOptionFromLocal('color') || DEFAULT_THEME_META.value,
  refreshId: 0, // 用于强制刷新绑定了 key 的组件 UI
  colorRefreshId: 0, // 颜色 token 变更后，通知消费方面板重新计算
  sizeRefreshId: 0, // 尺寸 token 变更后，通知消费方面板重新计算
  sizeRefreshType: null, // 最近一次触发尺寸刷新的类型（由 SizeAdjust 发出）
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
    document.documentElement.style.setProperty('--brand-main', color);
  },
  incrementRefreshId() {
    this.refreshId++;
  },
  incrementColorRefresh() {
    this.colorRefreshId++;
  },
  incrementSizeRefresh(type = null) {
    this.sizeRefreshType = type;
    this.sizeRefreshId++;
  },
});

function getInitialTheme(device = 'web') {
  const localThemeName = getOptionFromLocal('theme') || DEFAULT_THEME_META.enName;
  const theme = initThemeStyleSheet(localThemeName, device);
  return theme;
}
