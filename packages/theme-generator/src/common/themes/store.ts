import { reactive } from 'vue';

import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from './built-in';
import { clearLocalTheme, getDefaultTheme, getOptionFromLocal, initThemeStyleSheet, updateLocalOption } from './core';

import type { Device, Theme } from '@/common/types';

export interface ThemeStore {
  device: Device | string;
  theme: Theme;
  brandColor: string;
  refreshId: number;
  colorRefreshId: number;
  sizeRefreshId: number;
  sizeRefreshType: string | null;
  updateDevice(device: Device | string): void;
  updateTheme(theme: Theme): void;
  resetTheme(): void;
  updateBrandColor(color: string): void;
  incrementRefreshId(): void;
  incrementColorRefresh(): void;
  incrementSizeRefresh(type?: string | null): void;
}

export const themeStore = reactive<ThemeStore>({
  device: 'web',
  theme: TDESIGN_WEB_THEME,
  brandColor: getOptionFromLocal('color') || DEFAULT_THEME_META.value,
  refreshId: 0, // 用于强制刷新绑定了 key 的组件 UI
  colorRefreshId: 0, // 颜色 token 变更后，通知消费方面板重新计算
  sizeRefreshId: 0, // 尺寸 token 变更后，通知消费方面板重新计算
  sizeRefreshType: null, // 最近一次触发尺寸刷新的类型（由 SizeAdjust 发出）
  updateDevice(device: Device | string) {
    this.device = device;
    this.theme = getInitialTheme(device);
    // 若用户未自定义过主题色，brandColor 跟随当前主题
    if (!getOptionFromLocal('color')) {
      this.brandColor = this.theme.value;
    }
  },
  updateTheme(theme: Theme) {
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
  updateBrandColor(color: string) {
    this.brandColor = color;
    // 生成器样式位于 Shadow DOM，品牌色别名需要设置在 host 上才能被内部 UI 继承。
    document.querySelector<HTMLElement>('td-theme-generator')?.style.setProperty('--brand-main', color);
    // Site components consume this alias, so keep it linked to the mode-aware brand token.
    document.documentElement.style.setProperty('--brand-main', 'var(--td-brand-color)');
  },
  incrementRefreshId() {
    this.refreshId++;
  },
  incrementColorRefresh() {
    this.colorRefreshId++;
  },
  incrementSizeRefresh(type: string | null = null) {
    this.sizeRefreshType = type;
    this.sizeRefreshId++;
  },
});

function getInitialTheme(device: Device | string = 'web'): Theme {
  const localThemeName = getOptionFromLocal('theme') || DEFAULT_THEME_META.enName;
  const theme = initThemeStyleSheet(localThemeName, device);
  return theme;
}
