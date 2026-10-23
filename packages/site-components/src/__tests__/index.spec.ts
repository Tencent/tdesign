import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isIntranet, debounce, throttle } from '../utils';
import { fetchEcosystemConfig } from '../utils/ecosystem';
import { ecosystemConfigCdn, ecosystemConfigWoaCdn } from '../../config';
import { isWoaDomain } from '../../../../site/src/pages/home/api';

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
  ['site-components', isIntranet],
  ['home', isWoaDomain],
])('%s WOA domain detection', (_name, isWoa) => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['https://woa.com', true],
    ['https://tdesign.woa.com', true],
    ['https://preview.tdesign.woa.com:8443', true],
    ['https://TDESIGN.WOA.COM', true],
    ['https://tdesign.tencent.com', false],
    ['https://preview-tdesign-site-pr-940-tdesign.surge.sh', false],
    ['http://localhost:5173', false],
    ['https://tdesign.oa.com', false],
    ['https://notwoa.com', false],
    ['https://woa.com.example.com', false],
    ['https://example.com/woa.com?host=tdesign.woa.com', false],
  ])('classifies %s as %s without a network request', (url, expected) => {
    const fetchMock = vi.fn();
    const imageMock = vi.fn();
    vi.stubGlobal('location', new URL(url));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('Image', imageMock);

    expect(isWoa()).toBe(expected);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(imageMock).not.toHaveBeenCalled();
  });
});

describe('ecosystem configuration by domain', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['https://woa.com', ecosystemConfigWoaCdn],
    ['https://tdesign.woa.com', ecosystemConfigWoaCdn],
    ['https://tdesign.tencent.com', ecosystemConfigCdn],
    ['https://preview-tdesign-site-pr-940-tdesign.surge.sh', ecosystemConfigCdn],
    ['https://notwoa.com', ecosystemConfigCdn],
  ])('only fetches the selected configuration for %s', async (url, endpoint) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('[]'));
    vi.stubGlobal('location', new URL(url));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchEcosystemConfig()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(endpoint);
  });
});
