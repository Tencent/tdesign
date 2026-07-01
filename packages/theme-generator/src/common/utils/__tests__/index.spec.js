import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getThemeMode, setUpModeObserver } from '../index';

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
