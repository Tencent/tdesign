/* eslint-env jest */

const mockDefine = jest.fn((definition: unknown) => definition);
const mockHtml = jest.fn();

interface ContentTestGlobals {
  location: { href: string };
  window: {
    addEventListener: jest.Mock<void, [string, EventListenerOrEventListenerObject]>;
    removeEventListener: jest.Mock;
    scrollY: number;
    scrollTo: jest.Mock<void, [ScrollToOptions]>;
  };
  document: {
    readyState: DocumentReadyState;
    documentElement: { scrollTop: number };
    querySelector: jest.Mock;
    querySelectorAll: jest.Mock;
    getElementById: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    body: Record<string, never>;
  };
  MutationObserver: jest.Mock;
}

const testGlobal = globalThis as unknown as ContentTestGlobals;

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
}));

jest.mock('@utils', () => ({ mobileBodyStyle: {} }), { virtual: true });
jest.mock('../src/components/td-doc-content/style.less?inline', () => '', { virtual: true });

const docContent = require('../src/components/td-doc-content').default;

describe('td-doc-content anchor scroll', () => {
  let loadHandler: (() => void) | null;

  beforeEach(() => {
    loadHandler = null;
    testGlobal.location = { href: 'https://tdesign.tencent.com/vue-next/components/button#api' };
    testGlobal.window = {
      addEventListener: jest.fn<void, [string, EventListenerOrEventListenerObject]>((type, listener) => {
        if (type !== 'load') return;
        loadHandler = () => {
          const event = new Event('load');
          if (typeof listener === 'function') listener(event);
          else listener.handleEvent(event);
        };
      }),
      removeEventListener: jest.fn(),
      scrollY: 0,
      scrollTo: jest.fn(),
    };
    testGlobal.document = {
      readyState: 'loading',
      documentElement: { scrollTop: 0 },
      querySelector: jest.fn((selector: string) => (selector === 'div[name="DEMO"]' ? {} : null)),
      querySelectorAll: jest.fn(() => []),
      getElementById: jest.fn(() => ({ getBoundingClientRect: () => ({ top: 240 }) })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      body: {},
    };
    testGlobal.MutationObserver = jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
  });

  afterEach(() => {
    Reflect.deleteProperty(testGlobal, 'location');
    Reflect.deleteProperty(testGlobal, 'window');
    Reflect.deleteProperty(testGlobal, 'document');
    Reflect.deleteProperty(testGlobal, 'MutationObserver');
  });

  it('offsets a hash target that already exists when the page loads', () => {
    const cleanup = docContent.fixedAnchor.connect();

    loadHandler?.();

    expect(testGlobal.window.scrollTo).toHaveBeenCalledWith({ top: 120, left: 0 });
    cleanup();
  });

  it('offsets a hash target when connected after the load event', () => {
    testGlobal.document.readyState = 'complete';

    const cleanup = docContent.fixedAnchor.connect();

    expect(testGlobal.window.scrollTo).toHaveBeenCalledWith({ top: 120, left: 0 });
    cleanup();
  });
});
