/* eslint-env jest */

const mockDefine = jest.fn((definition) => definition);
const mockHtml = jest.fn();
const mockDispatch = jest.fn();
const mockCreatePopper = jest.fn();
const testGlobal = global as any;

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
  dispatch: mockDispatch,
}));

jest.mock('@popperjs/core', () => ({ createPopper: mockCreatePopper }));
jest.mock('@utils', () => ({ parseBoolean: jest.fn((value) => Boolean(value)) }), { virtual: true });
jest.mock('../src/components/td-doc-popup/style.less?inline', () => '', { virtual: true });

const docPopup = require('../src/components/td-doc-popup').default;

describe('td-doc-popup lifecycle', () => {
  let frames: Map<number, (...args: any[]) => void>;
  let portalContainer;

  beforeEach(() => {
    frames = new Map();
    let frameId = 0;
    portalContainer = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };

    testGlobal.requestAnimationFrame = jest.fn((callback) => {
      const id = ++frameId;
      frames.set(id, callback);
      return id;
    });
    testGlobal.cancelAnimationFrame = jest.fn((id) => frames.delete(id));
    testGlobal.window = {
      ResizeObserver: jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() })),
    };
    testGlobal.document = {
      getElementById: jest.fn(() => portalContainer),
      createElement: jest.fn(() => ({ appendChild: jest.fn(), addEventListener: jest.fn() })),
      body: { appendChild: jest.fn() },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    mockCreatePopper.mockReset();
  });

  afterEach(() => {
    delete testGlobal.requestAnimationFrame;
    delete testGlobal.cancelAnimationFrame;
    delete testGlobal.window;
    delete testGlobal.document;
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
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback();
  }

  it('cancels deferred portal setup when disconnected before the first frame', () => {
    const cleanup = docPopup.visible.connect(createHost());

    testGlobal.document.getElementById.mockReturnValue(null);
    cleanup();
    Array.from(frames.values()).forEach((callback) => callback());

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
