import Vue from 'vue';

import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from './built-in';
import { clearLocalTheme, getDefaultTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';

/**
 * 主题状态管理对象
 * @type {object}
 */
export const themeStore = Vue.observable({
  device: 'web',
  theme: TDESIGN_WEB_THEME,
  brandColor: getOptionFromLocal('color') || DEFAULT_THEME_META.value,
  refreshId: 0, // 用于强制刷新绑定了 key 的组件 UI

  /**
   * 更新设备类型
   * @param {string} device - 设备类型
   */
  updateDevice(device) {
    this.device = device;
    this.theme = getInitialTheme(device);
  },

  /**
   * 更新主题
   * @param {object} theme - 主题对象
   */
  updateTheme(theme) {
    this.theme = theme;
    initThemeStyleSheet(theme.enName, this.device);
    clearLocalTheme();
    updateLocalOption('theme', theme.enName !== DEFAULT_THEME_META.enName ? theme.enName : null);
    this.updateBrandColor(theme.value);
    this.incrementRefreshId();
  },

  /**
   * 重置主题为默认值
   */
  resetTheme() {
    this.updateTheme(getDefaultTheme(this.device));
  },

  /**
   * 更新品牌色
   * @param {string} color - 颜色值
   */
  updateBrandColor(color) {
    this.brandColor = color;
    document.documentElement.style.setProperty('--brand-main', color);
  },

  /**
   * 增加刷新 ID
   */
  incrementRefreshId() {
    this.refreshId++;
  },
});

/**
 * 获取初始主题
 * @param {string} device - 设备类型
 * @returns {object} 主题对象
 */
function getInitialTheme(device = 'web') {
  const localThemeName = getOptionFromLocal('theme') || DEFAULT_THEME_META.enName;
  const theme = initThemeStyleSheet(localThemeName, device);
  return theme;
}
