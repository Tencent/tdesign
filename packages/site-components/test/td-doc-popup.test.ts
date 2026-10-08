/* eslint-env jest */

const mockDefine = jest.fn((definition: unknown) => definition);
const mockHtml = jest.fn();
const mockDispatch = jest.fn();
const mockCreatePopper = jest.fn();

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
  dispatch: mockDispatch,
}));

jest.mock('@popperjs/core', () => ({ createPopper: mockCreatePopper }));
jest.mock('@utils', () => ({ parseBoolean: jest.fn((value: unknown) => Boolean(value)) }), { virtual: true });
jest.mock('../src/components/td-doc-popup/style.less?inline', () => '', { virtual: true });

const docPopup = require('../src/components/td-doc-popup').default;

interface PortalContainerMock {
  appendChild: jest.Mock<unknown, [unknown]>;
  removeChild: jest.Mock<unknown, [unknown]>;
}

interface PopupTestGlobals {
  requestAnimationFrame: jest.Mock<number, [FrameRequestCallback]>;
  cancelAnimationFrame: jest.Mock<boolean, [number]>;
  window: {
    ResizeObserver: jest.Mock;
  };
  document: {
    getElementById: jest.Mock<PortalContainerMock | null, [string]>;
    createElement: jest.Mock;
    body: { appendChild: jest.Mock };
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };
}

const testGlobal = globalThis as unknown as PopupTestGlobals;

describe('td-doc-popup lifecycle', () => {
  let frames: Map<number, FrameRequestCallback>;
  let portalContainer: PortalContainerMock;

  beforeEach(() => {
    frames = new Map();
    let frameId = 0;
    portalContainer = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };

    testGlobal.requestAnimationFrame = jest.fn<number, [FrameRequestCallback]>((callback) => {
      const id = ++frameId;
      frames.set(id, callback);
      return id;
    });
    testGlobal.cancelAnimationFrame = jest.fn<boolean, [number]>((id) => frames.delete(id));
    testGlobal.window = {
      ResizeObserver: jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() })),
    };
    testGlobal.document = {
      getElementById: jest.fn<PortalContainerMock | null, [string]>(() => portalContainer),
      createElement: jest.fn(() => ({ appendChild: jest.fn(), addEventListener: jest.fn() })),
      body: { appendChild: jest.fn() },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    mockCreatePopper.mockReset();
  });

  afterEach(() => {
    Reflect.deleteProperty(testGlobal, 'requestAnimationFrame');
    Reflect.deleteProperty(testGlobal, 'cancelAnimationFrame');
    Reflect.deleteProperty(testGlobal, 'window');
    Reflect.deleteProperty(testGlobal, 'document');
  });

  function createHost() {
    return {
      reference: { offsetWidth: 240 },
      placement: 'bottom-start',
      portalClass: '',
      portalStyle: '',
      querySelector: jest.fn(() => ({})),
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
    const querySelector = jest.fn(() => reference);
    const render = jest.fn(() => ({ querySelector }));

    expect(docPopup.reference({ render })).toBe(reference);
    expect(render).toHaveBeenCalledTimes(1);
    expect(querySelector).toHaveBeenCalledWith('.TDesign-doc-popup');
  });

  it('cancels deferred portal setup when disconnected before the first frame', () => {
    const cleanup = docPopup.visible.connect(createHost());

    testGlobal.document.getElementById.mockReturnValue(null);
    cleanup();
    Array.from(frames.values()).forEach((callback) => callback(performance.now()));

    expect(testGlobal.document.body.appendChild).not.toHaveBeenCalled();
  });

  it('destroys the Popper instance during cleanup', () => {
    const popper = {
      state: { styles: { popper: {} } },
      update: jest.fn(),
      destroy: jest.fn(),
    };
    mockCreatePopper.mockReturnValue(popper);

    const cleanup = docPopup.visible.connect(createHost());
    flushNextFrame();
    flushNextFrame();

    cleanup();

    expect(popper.destroy).toHaveBeenCalledTimes(1);
  });
});
