/* eslint-env jest */

const mockDefine = jest.fn((definition) => definition);
const mockHtml = jest.fn();
const testGlobal = global as any;

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

describe('td-doc-header fixed title lifecycle', () => {
  let mediaQuery;

  beforeEach(() => {
    mediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    testGlobal.window = {
      innerWidth: 1440,
      matchMedia: jest.fn(() => mediaQuery),
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
    delete testGlobal.window;
    delete testGlobal.document;
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
