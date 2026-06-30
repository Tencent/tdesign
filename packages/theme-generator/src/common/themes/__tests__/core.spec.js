import { describe, it, expect, vi } from 'vitest';

// core.js 顶部导入 tvision-color，后者依赖 @material/material-color-utilities，
// 存在无扩展名 ESM 互导入，Node 原生 loader 无法解析。本测试不覆盖 color 工具函数，
// mock 掉以切断加载链。
vi.mock('tvision-color', () => ({
  Color: {
    colorTransform: () => [],
    getColorGradations: () => [{ colors: [], primary: 0 }],
    getNeutralColor: () => [],
  },
}));

import {
  normalizeDevice,
  isMobile,
  isMiniProgram,
  isUniApp,
  getDefaultTheme,
  getRecommendThemes,
  findThemeByEnName,
} from '../core';
import { parseRootCss } from '../../utils';
import { TDESIGN_WEB_THEME, TDESIGN_MOBILE_THEME, WEB_RECOMMEND_THEMES, MOBILE_RECOMMEND_THEMES } from '../built-in';

describe('normalizeDevice / isMobile / isMiniProgram / isUniApp', () => {
  it('web 设备归一化为 web', () => {
    expect(normalizeDevice('web')).toBe('web');
  });
  it('mobile/mini-program/uni-app 归一化为 mobile', () => {
    expect(normalizeDevice('mobile')).toBe('mobile');
    expect(normalizeDevice('mini-program')).toBe('mobile');
    expect(normalizeDevice('uni-app')).toBe('mobile');
  });
  it('isMobile 识别三类移动端设备', () => {
    expect(isMobile('mobile')).toBe(true);
    expect(isMobile('mini-program')).toBe(true);
    expect(isMobile('uni-app')).toBe(true);
    expect(isMobile('web')).toBe(false);
  });
  it('isMiniProgram / isUniApp 精确匹配', () => {
    expect(isMiniProgram('mini-program')).toBe(true);
    expect(isUniApp('uni-app')).toBe(true);
    expect(isMiniProgram('web')).toBe(false);
    expect(isUniApp('mobile')).toBe(false);
  });
});

describe('getDefaultTheme / getRecommendThemes', () => {
  it('web 默认主题为 TDESIGN_WEB_THEME', () => {
    expect(getDefaultTheme('web')).toBe(TDESIGN_WEB_THEME);
  });
  it('mobile 默认主题为 TDESIGN_MOBILE_THEME', () => {
    expect(getDefaultTheme('mobile')).toBe(TDESIGN_MOBILE_THEME);
  });
  it('web 推荐主题列表等于 WEB_RECOMMEND_THEMES', () => {
    expect(getRecommendThemes('web')).toBe(WEB_RECOMMEND_THEMES);
  });
  it('mobile 推荐主题列表等于 MOBILE_RECOMMEND_THEMES', () => {
    expect(getRecommendThemes('mobile')).toBe(MOBILE_RECOMMEND_THEMES);
  });
});

describe('findThemeByEnName', () => {
  it('能根据 enName 找到对应主题', () => {
    const theme = findThemeByEnName('web', TDESIGN_WEB_THEME.enName);
    expect(theme).toBe(TDESIGN_WEB_THEME);
  });
  it('找不到时回退到默认主题', () => {
    const theme = findThemeByEnName('web', 'NotExisting');
    expect(theme).toBe(TDESIGN_WEB_THEME);
  });
});

describe('parseRootCss', () => {
  it('空输入返回空内容', () => {
    expect(parseRootCss('')).toEqual({ rootContent: '', restContent: '' });
    expect(parseRootCss(null)).toEqual({ rootContent: '', restContent: '' });
  });

  it('从 :root 块中拆出变量声明，保留其余选择器', () => {
    const css = `:root{--td-brand-color:#0052D9;}.t-button{color:red;}`;
    const { rootContent, restContent } = parseRootCss(css);
    expect(rootContent).toContain('--td-brand-color:#0052D9');
    expect(restContent).toContain('.t-button');
    expect(restContent).not.toContain('--td-brand-color');
  });

  it('无 :root 块时整体作为 restContent 返回', () => {
    const css = `.a{color:red;}.b{color:blue;}`;
    const { rootContent, restContent } = parseRootCss(css);
    expect(rootContent).toBe('');
    expect(restContent).toBe(css.trim());
  });
});
