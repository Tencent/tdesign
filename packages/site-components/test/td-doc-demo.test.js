/* eslint-env jest */

const mockDefine = jest.fn((definition) => definition);
const mockHtml = jest.fn();
const mockDispatch = jest.fn();

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
  let listeners;

  beforeEach(() => {
    listeners = new Map();
    global.window = {
      addEventListener: jest.fn((type, listener) => listeners.set(type, listener)),
      removeEventListener: jest.fn((type, listener) => {
        if (listeners.get(type) === listener) listeners.delete(type);
      }),
    };
    global.localStorage = {
      getItem: jest.fn(() => 'dark'),
    };
  });

  afterEach(() => {
    delete global.window;
    delete global.localStorage;
  });

  it('updates the code block theme when td-theme-tabs changes the site theme', () => {
    const host = {};
    const invalidate = jest.fn();
    const cleanup = docDemo.theme.connect(host, 'theme', invalidate);
    const listener = listeners.get('storageChange');

    expect(listener).toEqual(expect.any(Function));

    listener();

    expect(host.theme).toBe('dark');
    expect(invalidate).toHaveBeenCalledTimes(1);

    cleanup();

    expect(window.removeEventListener).toHaveBeenCalledWith('storageChange', listener);
  });
});
