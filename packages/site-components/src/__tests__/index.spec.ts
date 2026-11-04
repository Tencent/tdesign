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

  it('debounce calls nothing until the delay has elapsed', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    debounced('b');
    debounced('c');

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('debounce restarts the window on every call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    vi.advanceTimersByTime(200);
    debounced('b');
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('debounce fires once per quiet period', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced(1);
    vi.advanceTimersByTime(300);
    debounced(2);
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn.mock.calls).toEqual([[1], [2]]);
  });

  it('debounce preserves this context', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    const context = { id: 1 };

    debounced.call(context, 'x');
    vi.advanceTimersByTime(100);

    expect(fn.mock.instances[0]).toBe(context);
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
