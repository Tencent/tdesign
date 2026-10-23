import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle } from '../utils';

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
