import { describe, it, expect, beforeEach, vi } from 'vitest';

// store.js 经 core.js 间接依赖 tvision-color → @material/material-color-utilities，
// 后者存在无扩展名 ESM 互导入，Node 原生 loader 无法解析。store 测试不需要真实 color 工具，
// 这里 mock 掉以切断加载链。
vi.mock('tvision-color', () => ({
  Color: {
    colorTransform: () => [],
    getColorGradations: () => [{ colors: [], primary: 0 }],
    getNeutralColor: () => [],
  },
}));

import { themeStore } from '../store';
import { DEFAULT_THEME_META, TDESIGN_WEB_THEME } from '../built-in';

describe('themeStore', () => {
  beforeEach(() => {
    // 重置可变状态（保留 device/theme 由各用例自行驱动）
    themeStore.refreshId = 0;
    themeStore.colorRefreshId = 0;
    themeStore.sizeRefreshId = 0;
    themeStore.sizeRefreshType = null;
  });

  it('初始状态：device=web, theme=TDESIGN_WEB_THEME, brandColor 为默认品牌色', () => {
    expect(themeStore.device).toBe('web');
    // reactive() 会把 theme 深层代理化，toBe(Object.is) 不等，用 toStrictEqual 比较内容
    expect(themeStore.theme).toStrictEqual(TDESIGN_WEB_THEME);
    expect(themeStore.brandColor).toBe(DEFAULT_THEME_META.value);
    expect(themeStore.refreshId).toBe(0);
    expect(themeStore.colorRefreshId).toBe(0);
    expect(themeStore.sizeRefreshId).toBe(0);
    expect(themeStore.sizeRefreshType).toBeNull();
  });

  it('updateBrandColor 同步更新 brandColor 与 --brand-main CSS 变量', () => {
    themeStore.updateBrandColor('#123456');
    expect(themeStore.brandColor).toBe('#123456');
    expect(document.documentElement.style.getPropertyValue('--brand-main')).toBe('#123456');
  });

  it('incrementRefreshId 递增 refreshId', () => {
    themeStore.incrementRefreshId();
    themeStore.incrementRefreshId();
    expect(themeStore.refreshId).toBe(2);
  });

  it('incrementColorRefresh 递增 colorRefreshId', () => {
    themeStore.incrementColorRefresh();
    expect(themeStore.colorRefreshId).toBe(1);
  });

  it('incrementSizeRefresh 递增 sizeRefreshId 并记录 type', () => {
    themeStore.incrementSizeRefresh('comp-size');
    expect(themeStore.sizeRefreshId).toBe(1);
    expect(themeStore.sizeRefreshType).toBe('comp-size');
  });

  it('incrementSizeRefresh 默认 type 为 null', () => {
    themeStore.incrementSizeRefresh();
    expect(themeStore.sizeRefreshId).toBe(1);
    expect(themeStore.sizeRefreshType).toBeNull();
  });

  it('updateTheme 触发 brandColor 更新与 refreshId 递增', () => {
    const before = themeStore.refreshId;
    themeStore.updateTheme(TDESIGN_WEB_THEME);
    expect(themeStore.refreshId).toBe(before + 1);
    expect(themeStore.brandColor).toBe(TDESIGN_WEB_THEME.value);
  });

  it('resetTheme 将主题重置为当前 device 的默认主题', () => {
    themeStore.device = 'web';
    themeStore.resetTheme();
    expect(themeStore.theme.enName).toBe(TDESIGN_WEB_THEME.enName);
  });

  it('updateDevice 切换 device 并更新 theme', () => {
    themeStore.updateDevice('mobile');
    expect(themeStore.device).toBe('mobile');
    // mobile 默认主题 enName 仍是 TDesign
    expect(themeStore.theme).toBeTruthy();
    expect(themeStore.theme.css).toBeTruthy();
  });
});
