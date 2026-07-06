import { describe, it, expect, vi } from 'vitest';

import { colorAnimation } from '../animation';

describe('colorAnimation', () => {
  it('无 canvas 时返回 noop 且不抛错', () => {
    // document 上无 #canvas，也无 td-theme-generator host
    const cancel = colorAnimation();
    expect(typeof cancel).toBe('function');
    expect(() => cancel()).not.toThrow();
  });

  it('有 canvas 时返回取消函数，调用后 cancelAnimationFrame 被调用', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    document.body.appendChild(canvas);

    // happy-dom 的 canvas.getContext 原生返回 null，这里 stub 出 2d 上下文
    const ctxStub = { fillStyle: '', fillRect: vi.fn() };
    canvas.getContext = vi.fn(() => ctxStub);

    // requestAnimationFrame 不真正调度回调，避免递归；返回固定 id 供 cancel 校验
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 42);
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const cancel = colorAnimation();
    expect(typeof cancel).toBe('function');
    // startAnimation 已调度至少一帧
    expect(rafSpy).toHaveBeenCalled();

    cancel();
    expect(cancelSpy).toHaveBeenCalledWith(42);

    cancelSpy.mockRestore();
    rafSpy.mockRestore();
    canvas.remove();
  });

  it('重复调用 cancel 不抛错（幂等）', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    document.body.appendChild(canvas);

    const ctxStub = { fillStyle: '', fillRect: vi.fn() };
    canvas.getContext = vi.fn(() => ctxStub);

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7);
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const cancel = colorAnimation();
    cancel();
    cancel(); // 再次调用不应抛错，也不应重复 cancel 同一 id

    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(cancelSpy).toHaveBeenCalledWith(7);

    cancelSpy.mockRestore();
    rafSpy.mockRestore();
    canvas.remove();
  });
});
