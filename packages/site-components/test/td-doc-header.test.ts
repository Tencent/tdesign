/* eslint-env jest */

const mockDefine = jest.fn((definition: unknown) => definition);
const mockHtml = jest.fn();

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
}));

jest.mock('@config/locale', () => ({ getLocale: jest.fn(() => ({})) }), { virtual: true });
jest.mock('@config/spline', () => ({}), { virtual: true });
jest.mock('@images/history.svg?raw', () => '', { virtual: true });
jest.mock(
  '@utils',
  () => ({
    isComponentPage: jest.fn(),
    isGlobalConfigPage: jest.fn(),
    mobileBodyStyle: {},
    parseBoolean: jest.fn(),
    watchHtmlMode: jest.fn(),
  }),
  { virtual: true },
);
jest.mock('../src/components/td-doc-header/style.less?inline', () => '', { virtual: true });

const docHeader = require('../src/components/td-doc-header').default;

interface MediaQueryMock {
  matches: boolean;
  addEventListener: jest.Mock<void, [string, (event: MediaQueryListEvent) => void]>;
  removeEventListener: jest.Mock<void, [string, (event: MediaQueryListEvent) => void]>;
}

interface HeaderTestGlobals {
  window: {
    innerWidth: number;
    matchMedia: jest.Mock<MediaQueryMock, [string]>;
    addEventListener: jest.Mock<void, [string, EventListenerOrEventListenerObject]>;
    removeEventListener: jest.Mock<void, [string, EventListenerOrEventListenerObject]>;
  };
  document: {
    documentElement: { scrollTop: number };
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    querySelector: jest.Mock;
  };
}

const testGlobal = globalThis as unknown as HeaderTestGlobals;

describe('td-doc-header fixed title lifecycle', () => {
  let mediaQuery: MediaQueryMock;

  beforeEach(() => {
    mediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    testGlobal.window = {
      innerWidth: 1440,
      matchMedia: jest.fn<MediaQueryMock, [string]>(() => mediaQuery),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    testGlobal.document = {
      documentElement: { scrollTop: 0 },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      querySelector: jest.fn(),
    };
  });

  afterEach(() => {
    Reflect.deleteProperty(testGlobal, 'window');
    Reflect.deleteProperty(testGlobal, 'document');
  });

  it('removes the same media and resize listeners that it registers', () => {
    const cleanup = docHeader.fixedTitle.connect({ shadowRoot: null });
    const mediaListener = mediaQuery.addEventListener.mock.calls[0][1];
    const resizeListener = testGlobal.window.addEventListener.mock.calls[0][1];

    cleanup();

    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', mediaListener);
    expect(testGlobal.window.removeEventListener).toHaveBeenCalledWith('resize', resizeListener);
  });
});
