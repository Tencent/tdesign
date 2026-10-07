/* eslint-env jest */

const mockDefine = jest.fn((definition: unknown) => definition);
const mockHtml = jest.fn();
const mockDispatch = jest.fn();

interface DemoTestGlobals {
  window: {
    addEventListener: jest.Mock<void, [string, EventListener]>;
    removeEventListener: jest.Mock<void, [string, EventListener]>;
  };
  localStorage: {
    getItem: jest.Mock<string, [string]>;
  };
}

const testGlobal = globalThis as unknown as DemoTestGlobals;

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
  dispatch: mockDispatch,
}));

jest.mock('../src/components/td-doc-demo/style.less?inline', () => '', { virtual: true });
jest.mock('@images/code.svg?raw', () => '', { virtual: true });
jest.mock('prismjs', () => ({ highlight: jest.fn(), languages: {} }));
jest.mock('prismjs/components/prism-markup.js', () => ({}));
jest.mock('prismjs/components/prism-css.js', () => ({}));
jest.mock('prismjs/components/prism-jsx.js', () => ({}));
jest.mock('prismjs/components/prism-javascript.js', () => ({}));
jest.mock('prismjs/components/prism-typescript', () => ({}));

const docDemo = require('../src/components/td-doc-demo').default;

describe('td-doc-demo theme synchronization', () => {
  let listeners: Map<string, EventListener>;

  beforeEach(() => {
    listeners = new Map();
    testGlobal.window = {
      addEventListener: jest.fn<void, [string, EventListener]>((type, listener) => {
        listeners.set(type, listener);
      }),
      removeEventListener: jest.fn<void, [string, EventListener]>((type, listener) => {
        if (listeners.get(type) === listener) listeners.delete(type);
      }),
    };
    testGlobal.localStorage = {
      getItem: jest.fn<string, [string]>(() => 'dark'),
    };
  });

  afterEach(() => {
    Reflect.deleteProperty(testGlobal, 'window');
    Reflect.deleteProperty(testGlobal, 'localStorage');
  });

  it('updates the code block theme when td-theme-tabs changes the site theme', () => {
    const host: { theme?: string } = {};
    const invalidate = jest.fn();
    const cleanup = docDemo.theme.connect(host, 'theme', invalidate);
    const listener = listeners.get('storageChange');

    expect(listener).toEqual(expect.any(Function));
    if (!listener) throw new Error('Expected the storageChange listener to be registered');

    listener(new Event('storageChange'));

    expect(host.theme).toBe('dark');
    expect(invalidate).toHaveBeenCalledTimes(1);

    cleanup();

    expect(testGlobal.window.removeEventListener).toHaveBeenCalledWith('storageChange', listener);
  });
});
