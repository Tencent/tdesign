import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import docHeader from '../components/td-doc-header';

const fixedTitle = docHeader.fixedTitle as unknown as {
  connect: (host: { shadowRoot: null }) => () => void;
};

const { mockDefine, mockHtml } = vi.hoisted(() => ({
  mockDefine: vi.fn((definition: unknown) => definition),
  mockHtml: vi.fn(),
}));

vi.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
}));

vi.mock('@config/locale', () => ({ getLocale: vi.fn(() => ({})) }));
vi.mock('@images/history.svg?raw', () => ({ default: '' }));
vi.mock('@utils', () => ({
  isComponentPage: vi.fn(),
  isGlobalConfigPage: vi.fn(),
  mobileBodyStyle: {},
  parseBoolean: vi.fn(),
}));
vi.mock('../components/td-doc-header/style.less?inline', () => ({ default: '' }));

interface MediaQueryMock {
  matches: boolean;
  addEventListener: Mock<(type: string, listener: (event: MediaQueryListEvent) => void) => void>;
  removeEventListener: Mock<(type: string, listener: (event: MediaQueryListEvent) => void) => void>;
}

describe('td-doc-header fixed title lifecycle', () => {
  let mediaQuery: MediaQueryMock;
  let mockWindow: {
    innerWidth: number;
    matchMedia: Mock<(query: string) => MediaQueryMock>;
    addEventListener: Mock<(type: string, listener: EventListenerOrEventListenerObject) => void>;
    removeEventListener: Mock<(type: string, listener: EventListenerOrEventListenerObject) => void>;
  };

  beforeEach(() => {
    mediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    mockWindow = {
      innerWidth: 1440,
      matchMedia: vi.fn<(query: string) => MediaQueryMock>(() => mediaQuery),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal('window', mockWindow);
    vi.stubGlobal('document', {
      documentElement: { scrollTop: 0 },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      querySelector: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('removes the same media and resize listeners that it registers', () => {
    const cleanup = fixedTitle.connect({ shadowRoot: null });
    const mediaListener = mediaQuery.addEventListener.mock.calls[0][1];
    const resizeListener = mockWindow.addEventListener.mock.calls[0][1];

    cleanup();

    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', mediaListener);
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith('resize', resizeListener);
  });
});
