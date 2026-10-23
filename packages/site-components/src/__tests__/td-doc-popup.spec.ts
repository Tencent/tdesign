import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import docPopup from '../components/td-doc-popup';

interface PopupHost {
  reference: { offsetWidth: number };
  placement: string;
  portalClass: string;
  portalStyle: string;
  querySelector: Mock;
}

const visibleProp = docPopup.visible as unknown as {
  connect: (host: PopupHost) => () => void;
};

const { mockDefine, mockHtml, mockDispatch, mockCreatePopper } = vi.hoisted(() => ({
  mockDefine: vi.fn((definition: unknown) => definition),
  mockHtml: vi.fn(),
  mockDispatch: vi.fn(),
  mockCreatePopper: vi.fn(),
}));

vi.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
  dispatch: mockDispatch,
}));

vi.mock('@popperjs/core', () => ({ createPopper: mockCreatePopper }));
vi.mock('@utils', () => ({ parseBoolean: vi.fn((value: unknown) => Boolean(value)) }));
vi.mock('../components/td-doc-popup/style.less?inline', () => ({ default: '' }));

interface PortalContainerMock {
  appendChild: Mock<(node: unknown) => unknown>;
  removeChild: Mock<(node: unknown) => unknown>;
}

interface MockDocument {
  getElementById: Mock<(id: string) => PortalContainerMock | null>;
  createElement: Mock;
  body: { appendChild: Mock };
  addEventListener: Mock;
  removeEventListener: Mock;
}

describe('td-doc-popup lifecycle', () => {
  let frames: Map<number, FrameRequestCallback>;
  let portalContainer: PortalContainerMock;
  let mockDocument: MockDocument;

  beforeEach(() => {
    frames = new Map();
    let frameId = 0;
    portalContainer = {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn<(callback: FrameRequestCallback) => number>((callback) => {
        const id = ++frameId;
        frames.set(id, callback);
        return id;
      }),
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn<(id: number) => boolean>((id) => frames.delete(id)),
    );
    vi.stubGlobal('window', {
      ResizeObserver: class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    });
    mockDocument = {
      getElementById: vi.fn<(id: string) => PortalContainerMock | null>(() => portalContainer),
      createElement: vi.fn(() => ({ appendChild: vi.fn(), addEventListener: vi.fn() })),
      body: { appendChild: vi.fn() },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal('document', mockDocument);
    mockCreatePopper.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function createHost() {
    return {
      reference: { offsetWidth: 240 },
      placement: 'bottom-start',
      portalClass: '',
      portalStyle: '',
      querySelector: vi.fn(() => ({})),
    };
  }

  function flushNextFrame() {
    const frame = frames.entries().next().value;
    if (!frame) throw new Error('Expected a queued animation frame');
    const [id, callback] = frame;
    frames.delete(id);
    callback(performance.now());
  }

  it('resolves the reference from the rendered root', () => {
    const reference = {};
    const querySelector = vi.fn(() => reference);
    const render = vi.fn(() => ({ querySelector }));

    expect((docPopup.reference as (host: { render: () => { querySelector: unknown } }) => unknown)({ render })).toBe(
      reference,
    );
    expect(render).toHaveBeenCalledTimes(1);
    expect(querySelector).toHaveBeenCalledWith('.TDesign-doc-popup');
  });

  it('cancels deferred portal setup when disconnected before the first frame', () => {
    const cleanup = visibleProp.connect(createHost());

    mockDocument.getElementById.mockReturnValue(null);
    cleanup();
    Array.from(frames.values()).forEach((callback) => callback(performance.now()));

    expect(mockDocument.body.appendChild).not.toHaveBeenCalled();
  });

  it('destroys the Popper instance during cleanup', () => {
    const popper = {
      state: { styles: { popper: {} } },
      update: vi.fn(),
      destroy: vi.fn(),
    };
    mockCreatePopper.mockReturnValue(popper);

    const cleanup = visibleProp.connect(createHost());
    flushNextFrame();
    flushNextFrame();

    cleanup();

    expect(popper.destroy).toHaveBeenCalledTimes(1);
  });
});
