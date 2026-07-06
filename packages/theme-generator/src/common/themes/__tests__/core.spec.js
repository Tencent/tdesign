import { describe, it, expect, beforeEach, vi } from 'vitest';

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
  CUSTOM_DARK_ID,
  CUSTOM_THEME_ID,
  CUSTOM_TOKEN_ID,
  normalizeDevice,
  isMobile,
  isMiniProgram,
  isUniApp,
  getDefaultTheme,
  getRecommendThemes,
  findThemeByEnName,
  modifyToken,
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

describe('modifyToken', () => {
  let styleSheet;
  let darkStyleSheet;

  beforeEach(() => {
    styleSheet = document.createElement('style');
    styleSheet.id = CUSTOM_THEME_ID;
    document.head.appendChild(styleSheet);

    darkStyleSheet = document.createElement('style');
    darkStyleSheet.id = CUSTOM_DARK_ID;
    document.head.appendChild(darkStyleSheet);
  });

  it('token 存在时替换为新值并写入 localStorage', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:#aaa;}';
    modifyToken('--td-brand-color-1', '#bbb');
    expect(styleSheet.textContent).toContain('--td-brand-color-1:#bbb;');
    expect(styleSheet.textContent).not.toContain('#aaa');
    const stored = JSON.parse(window.localStorage.getItem(CUSTOM_TOKEN_ID));
    expect(stored['--td-brand-color-1']).toBe('#bbb');
  });

  it('token 不存在时打印 warn 且不修改样式表', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:#aaa;}';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    modifyToken('--td-not-exist', '#fff');
    expect(styleSheet.textContent).toBe(':root{--td-brand-color-1:#aaa;}');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('--td-not-exist');
    warnSpy.mockRestore();
  });

  it('值与当前相同时提前返回，不写 localStorage', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:#aaa;}';
    modifyToken('--td-brand-color-1', '#aaa');
    // 样式表未被改写
    expect(styleSheet.textContent).toBe(':root{--td-brand-color-1:#aaa;}');
    // 未触发 localStorage 写入
    expect(window.localStorage.getItem(CUSTOM_TOKEN_ID)).toBeNull();
  });

  it('容忍冒号后任意空白并保留原始空白格式', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:   #aaa;}';
    modifyToken('--td-brand-color-1', '#ccc');
    // $1 捕获组保留冒号后的原始空白
    expect(styleSheet.textContent).toBe(':root{--td-brand-color-1:   #ccc;}');
  });

  it('同一 stylesheet 内同名 token 全部替换（g 全局替换）', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:#aaa;}.x{--td-brand-color-1:#aaa;}';
    modifyToken('--td-brand-color-1', '#ddd');
    expect(styleSheet.textContent.match(/#ddd/g)).toHaveLength(2);
    expect(styleSheet.textContent).not.toContain('#aaa');
  });

  it('saveToLocal=false 时不写 localStorage', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:#aaa;}';
    modifyToken('--td-brand-color-1', '#eee', false);
    expect(styleSheet.textContent).toContain('#eee');
    expect(window.localStorage.getItem(CUSTOM_TOKEN_ID)).toBeNull();
  });

  it('跨多个样式表（light + dark）同步替换', () => {
    styleSheet.textContent = ':root{--td-brand-color-1:#aaa;}';
    darkStyleSheet.textContent = ':root.dark{--td-brand-color-1:#bbb;}';
    modifyToken('--td-brand-color-1', '#fff');
    expect(styleSheet.textContent).toContain('#fff');
    expect(darkStyleSheet.textContent).toContain('#fff');
    expect(styleSheet.textContent).not.toContain('#aaa');
    expect(darkStyleSheet.textContent).not.toContain('#bbb');
  });
});
