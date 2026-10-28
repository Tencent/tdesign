import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import backtop from '../components/td-backtop';

const { mockDefine } = vi.hoisted(() => ({
  mockDefine: vi.fn((definition: unknown) => definition),
}));

vi.mock('hybrids', () => ({
  define: mockDefine,
  html: vi.fn(),
}));

const backtopShow = backtop.backtopShow as unknown as {
  connect: (host: { backtopShow: boolean }, key: string, invalidate: () => void) => () => void;
};

describe('td-backtop visibility', () => {
  let originalScrollTop: number;
  const cleanups: Array<() => void> = [];

  beforeEach(() => {
    originalScrollTop = document.documentElement.scrollTop;
  });

  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
    document.documentElement.scrollTop = originalScrollTop;
  });

  function connect(host: { backtopShow: boolean }) {
    const cleanup = backtopShow.connect(host, 'backtopShow', vi.fn());
    cleanups.push(cleanup);
    return cleanup;
  }

  it('is visible immediately when mounted on a scrolled page', () => {
    document.documentElement.scrollTop = 400;
    const host = { backtopShow: false };

    connect(host);

    expect(host.backtopShow).toBe(true);
  });

  it('starts hidden at the top and follows later scroll events', () => {
    document.documentElement.scrollTop = 0;
    const host = { backtopShow: true };

    connect(host);
    expect(host.backtopShow).toBe(false);

    document.documentElement.scrollTop = 1;
    document.dispatchEvent(new Event('scroll'));
    expect(host.backtopShow).toBe(true);

    document.documentElement.scrollTop = 0;
    document.dispatchEvent(new Event('scroll'));
    expect(host.backtopShow).toBe(false);
  });

  it('stops responding after cleanup and synchronizes on reconnect', () => {
    document.documentElement.scrollTop = 0;
    const host = { backtopShow: false };
    const cleanup = connect(host);

    cleanup();
    document.documentElement.scrollTop = 400;
    document.dispatchEvent(new Event('scroll'));
    expect(host.backtopShow).toBe(false);

    connect(host);
    expect(host.backtopShow).toBe(true);
  });
});
