/* eslint-env jest */

const mockDefine = jest.fn((definition) => definition);
const mockHtml = jest.fn();

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
}));

jest.mock('@utils', () => ({ mobileBodyStyle: {} }), { virtual: true });
jest.mock('../src/components/td-doc-content/style.less?inline', () => '', { virtual: true });

const docContent = require('../src/components/td-doc-content').default;

describe('td-doc-content anchor scroll', () => {
  let loadHandler;

  beforeEach(() => {
    loadHandler = null;
    global.location = { href: 'https://tdesign.tencent.com/vue-next/components/button#api' };
    global.window = {
      addEventListener: jest.fn((type, listener) => {
        if (type === 'load') loadHandler = listener;
      }),
      removeEventListener: jest.fn(),
      scrollY: 0,
      scrollTo: jest.fn(),
    };
    global.document = {
      readyState: 'loading',
      documentElement: { scrollTop: 0 },
      querySelector: jest.fn((selector) => (selector === 'div[name="DEMO"]' ? {} : null)),
      querySelectorAll: jest.fn(() => []),
      getElementById: jest.fn(() => ({ getBoundingClientRect: () => ({ top: 240 }) })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      body: {},
    };
    global.MutationObserver = jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
  });

  afterEach(() => {
    delete global.location;
    delete global.window;
    delete global.document;
    delete global.MutationObserver;
  });

  it('offsets a hash target that already exists when the page loads', () => {
    const cleanup = docContent.fixedAnchor.connect();

    loadHandler();

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 120, left: 0 });
    cleanup();
  });

  it('offsets a hash target when connected after the load event', () => {
    document.readyState = 'complete';

    const cleanup = docContent.fixedAnchor.connect();

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 120, left: 0 });
    cleanup();
  });
});
