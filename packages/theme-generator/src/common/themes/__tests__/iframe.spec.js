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

import { syncThemeToIframe, modifyToken, CUSTOM_THEME_ID, CUSTOM_DARK_ID, CUSTOM_EXTRA_ID } from '../index';

// 用真实 mobile 主题 CSS 形态构造父样式表（绕开 ?raw 在 vitest 中的空字符串问题），
// 只覆盖 iframe 同步逻辑，不依赖具体主题内容。
const SAMPLE_LIGHT = `:root,
:root[theme-mode="light"] {
  --td-brand-color-1: #f2f3ff;
  --td-brand-color-7: #0052d9;
  --td-brand-color-10: #001a57;
}`;
const SAMPLE_DARK = `:root.dark,
:root[theme-mode="dark"] {
  --td-brand-color-1: #1b2f51;
  --td-brand-color-7: #2667d4;
  --td-brand-color-10: #96bbf8;
}`;
const SAMPLE_EXTRA = `:root {
  --td-font-size: 14px;
}
.t-button {
  color: red;
}`;

function setupParentStyles() {
  const light = document.createElement('style');
  light.id = CUSTOM_THEME_ID;
  light.textContent = SAMPLE_LIGHT;
  document.head.appendChild(light);

  const dark = document.createElement('style');
  dark.id = CUSTOM_DARK_ID;
  dark.textContent = SAMPLE_DARK;
  document.head.appendChild(dark);

  const extra = document.createElement('style');
  extra.id = CUSTOM_EXTRA_ID;
  extra.textContent = SAMPLE_EXTRA;
  document.head.appendChild(extra);
}

// 构造一个带 mock contentDocument 的 iframe（happy-dom 原生 iframe.contentDocument 不可写）。
function createMockIframe(id) {
  const iframe = document.createElement('iframe');
  iframe.id = id;
  const iframeDoc = document.implementation.createHTMLDocument();
  Object.defineProperty(iframe, 'contentDocument', {
    value: iframeDoc,
    writable: false,
  });
  return iframe;
}

function flushObservers(ms = 200) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('iframe 同步: 小程序 / uniapp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.querySelectorAll('style').forEach((el) => el.remove());
    window.localStorage.clear();
    setupParentStyles();
  });

  it('uniapp: 初始同步在 iframe 内创建 custom-theme 与 custom-theme-extra', async () => {
    const iframe = createMockIframe('preview-uniapp');
    syncThemeToIframe('uni-app');

    const docPhone = document.createElement('td-doc-phone');
    docPhone.appendChild(iframe);
    document.body.appendChild(docPhone);

    await flushObservers();

    // 关键回归点：custom-theme 必须能被 iframe.contentDocument.getElementById 命中
    // 之前用 document.createElement 创建再 append 到 iframe，ownerDocument 不一致，
    // getElementById 找不到，后续 modifyToken 更新会落到 else 早返回分支，主题修改无效。
    const light = iframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(light).toBeTruthy();
    // 选择器必须与导出逻辑（page, .page）一致，否则 CSS 变量会被 iframe 内
    // app.wxss 中定义在 page 上的同名变量覆盖，主题色不生效。
    expect(light.textContent).toContain('page, .page');
    expect(light.textContent).toContain('--td-brand-color-7');

    const extra = iframe.contentDocument.getElementById(CUSTOM_EXTRA_ID);
    expect(extra).toBeTruthy();
    expect(extra.textContent).toContain('--td-font-size');

    // dark 在 light 模式下不应被创建（小程序/uniapp 靠切换 style 而非 root 属性）
    expect(iframe.contentDocument.getElementById(CUSTOM_DARK_ID)).toBeNull();
  });

  it('uniapp: 修改 token 后 iframe 内 custom-theme 同步更新', async () => {
    const iframe = createMockIframe('preview-uniapp');
    syncThemeToIframe('uni-app');

    const docPhone = document.createElement('td-doc-phone');
    docPhone.appendChild(iframe);
    document.body.appendChild(docPhone);

    await flushObservers();

    modifyToken('--td-brand-color-7', '#ff0000');
    await flushObservers();

    const updated = iframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(updated).toBeTruthy();
    expect(updated.textContent).toContain('#ff0000');
    // 旧值应被替换掉
    expect(updated.textContent).not.toContain('#0052d9');
  });

  it('miniprogram: 外层 iframe 已加载完成时，仍能监听到嵌套 webview iframe', async () => {
    const outerIframe = createMockIframe('preview-mini');
    syncThemeToIframe('mini-program');

    const docPhone = document.createElement('td-doc-phone');
    docPhone.appendChild(outerIframe);
    document.body.appendChild(docPhone);

    // 外层 iframe 模拟"已加载完成"：直接往 contentDocument 里塞 webview iframe，
    // 不依赖 onload 触发（onload 在 iframe 已加载时不会再 fire）。
    const webviewIframe = createMockIframe('webview-1');
    outerIframe.contentDocument.body.appendChild(webviewIframe);

    await flushObservers();

    // 关键回归点：webview iframe 必须被观察并注入 custom-theme
    // 之前仅靠 previewIframe.onload，若外层 iframe 已加载则永不触发，主题修改无效。
    expect(webviewIframe.dataset.observed).toBe('true');
    expect(webviewIframe.getAttribute('device')).toBe('mini-program');

    const webviewLight = webviewIframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(webviewLight).toBeTruthy();
    expect(webviewLight.textContent).toContain('page, .page');
    expect(webviewLight.textContent).toContain('--td-brand-color-7');

    // m2w web 预览（无嵌套 webview）路径：previewIframe 本身也应被注入主题
    const outerLight = outerIframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(outerLight).toBeTruthy();
    expect(outerLight.textContent).toContain('--td-brand-color-7');
  });

  it('miniprogram: m2w web 预览（无嵌套 webview iframe）时主题直接同步到 previewIframe', async () => {
    // 模拟 aa.html 中的真实结构：td-doc-phone > iframe.mobile-iframe（无嵌套）
    const previewIframe = createMockIframe('mobile-iframe');
    previewIframe.setAttribute('class', 'mobile-iframe');
    syncThemeToIframe('mini-program');

    const docPhone = document.createElement('td-doc-phone');
    docPhone.appendChild(previewIframe);
    document.body.appendChild(docPhone);

    await flushObservers();

    // 关键回归点：m2w 预览直接在 previewIframe 内渲染，无嵌套 webview iframe。
    // 之前小程序路径只调用 watchNestedIframes 查找嵌套 iframe，找不到就什么都不做，
    // 主题永远不会被注入 previewIframe。现在应直接同步到 previewIframe。
    expect(previewIframe.dataset.observed).toBe('true');
    expect(previewIframe.getAttribute('device')).toBe('mini-program');

    const light = previewIframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(light).toBeTruthy();
    expect(light.textContent).toContain('page, .page');
    expect(light.textContent).toContain('--td-brand-color-7');
  });

  it('miniprogram: m2w web 预览下修改 token 后 previewIframe 内 custom-theme 同步更新', async () => {
    const previewIframe = createMockIframe('mobile-iframe');
    syncThemeToIframe('mini-program');

    const docPhone = document.createElement('td-doc-phone');
    docPhone.appendChild(previewIframe);
    document.body.appendChild(docPhone);

    await flushObservers();

    modifyToken('--td-brand-color-7', '#ff00ff');
    await flushObservers();

    const updated = previewIframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(updated).toBeTruthy();
    expect(updated.textContent).toContain('#ff00ff');
    expect(updated.textContent).not.toContain('#0052d9');
  });

  it('miniprogram: 修改 token 后嵌套 webview iframe 内 custom-theme 同步更新', async () => {
    const outerIframe = createMockIframe('preview-mini');
    syncThemeToIframe('mini-program');

    const docPhone = document.createElement('td-doc-phone');
    docPhone.appendChild(outerIframe);
    document.body.appendChild(docPhone);

    const webviewIframe = createMockIframe('webview-2');
    outerIframe.contentDocument.body.appendChild(webviewIframe);

    await flushObservers();

    modifyToken('--td-brand-color-7', '#00ff00');
    await flushObservers();

    const updated = webviewIframe.contentDocument.getElementById(CUSTOM_THEME_ID);
    expect(updated).toBeTruthy();
    expect(updated.textContent).toContain('#00ff00');
    expect(updated.textContent).not.toContain('#0052d9');
  });
});
