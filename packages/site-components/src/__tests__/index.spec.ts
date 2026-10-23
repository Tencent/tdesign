import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { canAccessWoa, debounce, throttle } from '../utils';
import { canAccessWoa as canAccessWoaFromHome } from '../../../../site/src/pages/home/api';

describe('utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounce is defined', () => {
    expect(debounce).toBeTruthy();
  });

  it('throttle passes invocation arguments (not factory arguments)', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a', 1);
    expect(fn).toHaveBeenCalledWith('a', 1);

    throttled('b', 2);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    throttled('c', 3);
    expect(fn).toHaveBeenLastCalledWith('c', 3);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throttle preserves this context', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    const context = { id: 1 };

    throttled.call(context, 'x');
    expect(fn.mock.instances[0]).toBe(context);
  });
});

describe.each([
  ['site-components', canAccessWoa],
  ['home', canAccessWoaFromHome],
])('%s canAccessWoa', (_name, probe) => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('location', new URL('https://tdesign.tencent.com'));
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('accepts a successful image response without redirects or cached responses', async () => {
    fetchMock.mockResolvedValue(new Response(null, { headers: { 'content-type': 'image/gif' } }));

    await expect(probe()).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/dayu\.woa\.com\/avatars\/tdesign\/profile\.jpg\?t=\d+$/),
      {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'error',
        signal: expect.any(AbortSignal),
      },
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([
    [404, 'image/jpeg', false],
    [503, 'image/jpeg', false],
    [200, 'text/html', false],
    [200, 'text/plain', false],
    [200, null, false],
    [200, 'image/jpeg', true],
  ])('rejects status=%s content-type=%s redirected=%s', async (status, contentType, redirected) => {
    const response = new Response(null, {
      status,
      headers: contentType ? { 'content-type': contentType } : {},
    });
    Object.defineProperty(response, 'redirected', { value: redirected });
    fetchMock.mockResolvedValue(response);

    await expect(probe()).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not treat an opaque response as proof of reachability', async () => {
    const response = Response.error();
    Object.defineProperty(response, 'type', { value: 'opaque' });
    fetchMock.mockResolvedValue(response);

    await expect(probe()).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns false on network, CORS or redirect errors', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(probe()).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['woa.com', 'tdesign.woa.com', 'tdesign.oa.com', 'notwoa.com', 'woa.com.example.com'])(
    'still probes when the page hostname is %s',
    async (hostname) => {
      vi.stubGlobal('location', new URL(`https://${hostname}`));
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(probe()).resolves.toBe(false);
      expect(fetchMock).toHaveBeenCalledOnce();
    },
  );

  it.each([1500, 50])('aborts a pending request after %s ms', async (timeout) => {
    fetchMock.mockImplementation(
      (_input, options) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
            once: true,
          });
        }),
    );

    const result = timeout === 1500 ? probe() : probe(timeout);
    const signal = fetchMock.mock.calls[0][1]?.signal;
    await vi.advanceTimersByTimeAsync(timeout - 1);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    await expect(result).resolves.toBe(false);
    expect(signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('probes again after a previous success when the network changes', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { headers: { 'content-type': 'image/jpeg' } }))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(probe()).resolves.toBe(true);
    await expect(probe()).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });
});
