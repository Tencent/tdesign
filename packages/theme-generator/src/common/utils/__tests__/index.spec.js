import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getThemeMode, setUpModeObserver, getTokenValue } from '../index';

// happy-dom 的 MutationObserver 回调走 microtask 队列，用一个空 setTimeout 刷新到下一个宏任务以稳定等待
const flushObserver = () => new Promise((resolve) => setTimeout(resolve));

describe('getThemeMode', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('theme-mode');
    document.documentElement.classList.remove('dark');
  });

  it('无 theme-mode 属性且无 .dark class 时返回 light', () => {
    expect(getThemeMode()).toBe('light');
  });

  it('theme-mode="dark" 时返回 dark', () => {
    document.documentElement.setAttribute('theme-mode', 'dark');
    expect(getThemeMode()).toBe('dark');
  });

  it('theme-mode="light" 时返回 light', () => {
    document.documentElement.setAttribute('theme-mode', 'light');
    expect(getThemeMode()).toBe('light');
  });

  it('仅有 .dark class（无 theme-mode 属性）时返回 dark', () => {
    document.documentElement.classList.add('dark');
    expect(getThemeMode()).toBe('dark');
  });

  it('theme-mode="dark" 与 .dark class 同时存在时返回 dark', () => {
    document.documentElement.setAttribute('theme-mode', 'dark');
    document.documentElement.classList.add('dark');
    expect(getThemeMode()).toBe('dark');
  });
});

describe('setUpModeObserver', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('theme-mode');
    document.documentElement.classList.remove('dark');
  });

  it('theme-mode 属性变化时触发回调', async () => {
    const handler = vi.fn();
    const observer = setUpModeObserver(handler);
    document.documentElement.setAttribute('theme-mode', 'dark');
    await flushObserver();
    expect(handler).toHaveBeenCalledWith('dark');
    observer.disconnect();
  });

  it('.dark class 变化时也触发回调', async () => {
    const handler = vi.fn();
    const observer = setUpModeObserver(handler);
    document.documentElement.classList.add('dark');
    await flushObserver();
    expect(handler).toHaveBeenCalledWith('dark');
    observer.disconnect();
  });

  it('class 变化但模式不变时不触发回调', async () => {
    const handler = vi.fn();
    const observer = setUpModeObserver(handler);
    // 加一个无关 class，模式仍为 light，不应触发
    document.documentElement.classList.add('active');
    await flushObserver();
    expect(handler).not.toHaveBeenCalled();
    observer.disconnect();
  });
});

describe('getTokenValue', () => {
  // setup.js 的 beforeEach 会清空 documentElement 的 inline style 与属性，
  // 用例间互不干扰。

  it('从 documentElement 读取 CSS 变量，返回 toLowerCase + trim 后的值', () => {
    document.documentElement.style.setProperty('--td-test-color', '  #FF0000  ');
    expect(getTokenValue('--td-test-color')).toBe('#ff0000');
  });

  it('亮模式与暗模式都从 documentElement 读取（不再切换到 [theme-mode=dark] 元素）', () => {
    // 行为变更点：旧实现暗模式下改读 document.querySelector('[theme-mode="dark"]')，
    // 新实现统一读 documentElement，避免命中 td-theme-generator host 等子元素的浅色继承值。
    document.documentElement.style.setProperty('--td-test-token', 'LightVal');
    expect(getTokenValue('--td-test-token')).toBe('lightval');

    // 页面上存在另一个带 theme-mode="dark" 的元素，值不同
    const darkEl = document.createElement('div');
    darkEl.setAttribute('theme-mode', 'dark');
    darkEl.style.setProperty('--td-test-token', 'DarkVal');
    document.body.appendChild(darkEl);

    // 切到 dark 模式：仍应从 documentElement 读取，不会改读 darkEl
    document.documentElement.setAttribute('theme-mode', 'dark');
    expect(getTokenValue('--td-test-token')).toBe('lightval');

    darkEl.remove();
  });

  it('变量不存在时返回空字符串', () => {
    expect(getTokenValue('--td-not-exist')).toBe('');
  });
});
