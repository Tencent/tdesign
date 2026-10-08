import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import docDemo from '../components/td-doc-demo';

const themeProp = docDemo.theme as unknown as {
  connect: (host: { theme?: string }, key: string, invalidate: () => void) => () => void;
};

const { mockDefine, mockHtml, mockDispatch } = vi.hoisted(() => ({
  mockDefine: vi.fn((definition: unknown) => definition),
  mockHtml: vi.fn(),
  mockDispatch: vi.fn(),
}));

interface DemoTestGlobals {
  window: {
    addEventListener: Mock<(type: string, listener: EventListener) => void>;
    removeEventListener: Mock<(type: string, listener: EventListener) => void>;
  };
  localStorage: {
    getItem: Mock<(key: string) => string>;
  };
}

const testGlobal = globalThis as unknown as DemoTestGlobals;

vi.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
  dispatch: mockDispatch,
}));

vi.mock('../components/td-doc-demo/style.less?inline', () => ({ default: '' }));
vi.mock('@images/code.svg?raw', () => ({ default: '' }));
vi.mock('prismjs', () => ({ highlight: vi.fn(), languages: {} }));
vi.mock('prismjs/components/prism-markup.js', () => ({}));
vi.mock('prismjs/components/prism-css.js', () => ({}));
vi.mock('prismjs/components/prism-jsx.js', () => ({}));
vi.mock('prismjs/components/prism-javascript.js', () => ({}));
vi.mock('prismjs/components/prism-typescript', () => ({}));

describe('td-doc-demo theme synchronization', () => {
  let listeners: Map<string, EventListener>;

  beforeEach(() => {
    listeners = new Map();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('updates the code block theme when td-theme-tabs changes the site theme', () => {
    vi.stubGlobal('window', {
      addEventListener: vi.fn<(type: string, listener: EventListener) => void>((type, listener) => {
        listeners.set(type, listener);
      }),
      removeEventListener: vi.fn<(type: string, listener: EventListener) => void>((type, listener) => {
        if (listeners.get(type) === listener) listeners.delete(type);
      }),
    });
    vi.stubGlobal('localStorage', {
      getItem: vi.fn<(key: string) => string>(() => 'dark'),
    });

    const host: { theme?: string } = {};
    const invalidate = vi.fn();
    const cleanup = themeProp.connect(host, 'theme', invalidate);
    const listener = listeners.get('storageChange');

    expect(listener).toEqual(expect.any(Function));
    if (!listener) throw new Error('Expected the storageChange listener to be registered');

    listener(new Event('storageChange'));

    expect(host.theme).toBe('dark');
    expect(invalidate).toHaveBeenCalledTimes(1);

    cleanup();

    expect(testGlobal.window.removeEventListener).toHaveBeenCalledWith('storageChange', listener);
  });

  it('receives the theme change when storageChange is dispatched on window', () => {
    localStorage.setItem('--tdesign-theme', 'dark');

    const host: { theme?: string } = {};
    const invalidate = vi.fn();
    const cleanup = themeProp.connect(host, 'theme', invalidate);

    window.dispatchEvent(new CustomEvent('storageChange'));

    expect(host.theme).toBe('dark');
    expect(invalidate).toHaveBeenCalledTimes(1);

    cleanup();

    window.dispatchEvent(new CustomEvent('storageChange'));

    expect(invalidate).toHaveBeenCalledTimes(1);
  });
});
