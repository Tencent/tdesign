import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import docContent from '../components/td-doc-content';

const { mockDefine, mockHtml } = vi.hoisted(() => ({
  mockDefine: vi.fn((definition: unknown) => definition),
  mockHtml: vi.fn(),
}));

interface ContentTestGlobals {
  location: { href: string };
  window: {
    addEventListener: Mock<(type: string, listener: EventListenerOrEventListenerObject) => void>;
    removeEventListener: Mock;
    scrollY: number;
    scrollTo: Mock<(options: ScrollToOptions) => void>;
  };
  document: {
    readyState: DocumentReadyState;
    documentElement: { scrollTop: number };
    querySelector: Mock;
    querySelectorAll: Mock;
    getElementById: Mock;
    addEventListener: Mock;
    removeEventListener: Mock;
    body: Record<string, never>;
  };
  MutationObserver: Mock;
}

const testGlobal = globalThis as unknown as ContentTestGlobals;

const fixedAnchor = docContent.fixedAnchor as unknown as { connect: () => () => void };

vi.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
}));

vi.mock('@utils', () => ({ mobileBodyStyle: {} }));
vi.mock('../components/td-doc-content/style.less?inline', () => ({ default: '' }));

describe('td-doc-content anchor scroll', () => {
  let loadHandler: (() => void) | null;

  beforeEach(() => {
    loadHandler = null;
    vi.stubGlobal('location', { href: 'https://tdesign.tencent.com/vue-next/components/button#api' });
    vi.stubGlobal('window', {
      addEventListener: vi.fn<(type: string, listener: EventListenerOrEventListenerObject) => void>(
        (type, listener) => {
          if (type !== 'load') return;
          loadHandler = () => {
            const event = new Event('load');
            if (typeof listener === 'function') listener(event);
            else listener.handleEvent(event);
          };
        },
      ),
      removeEventListener: vi.fn(),
      scrollY: 0,
      scrollTo: vi.fn(),
    });
    vi.stubGlobal('document', {
      readyState: 'loading',
      documentElement: { scrollTop: 0 },
      querySelector: vi.fn((selector: string) => (selector === 'div[name="DEMO"]' ? {} : null)),
      querySelectorAll: vi.fn(() => []),
      getElementById: vi.fn(() => ({ getBoundingClientRect: () => ({ top: 240 }) })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      body: {},
    });
    vi.stubGlobal(
      'MutationObserver',
      vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('offsets a hash target that already exists when the page loads', () => {
    const cleanup = fixedAnchor.connect();

    loadHandler?.();

    expect(testGlobal.window.scrollTo).toHaveBeenCalledWith({ top: 120, left: 0 });
    cleanup();
  });

  it('offsets a hash target when connected after the load event', () => {
    testGlobal.document.readyState = 'complete';

    const cleanup = fixedAnchor.connect();

    expect(testGlobal.window.scrollTo).toHaveBeenCalledWith({ top: 120, left: 0 });
    cleanup();
  });
});
