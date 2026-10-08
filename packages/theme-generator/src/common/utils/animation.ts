export interface CollapseAnimationHooks {
  beforeEnter: (el: Element) => void;
  enter: (el: Element) => void;
  afterEnter: (el: Element) => void;
  beforeLeave: (el: Element) => void;
  leave: (el: Element) => void;
  afterLeave: (el: Element) => void;
}

// 展开收起动画
export function collapseAnimation(): CollapseAnimationHooks {
  const beforeEnter = (element: Element) => {
    const el = element as HTMLElement;
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
  };
  const enter = (element: Element) => {
    const el = element as HTMLElement;
    el.dataset.oldOverflow = el.style.overflow;
    el.style.height = `${el.scrollHeight}px`;
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
    el.style.overflow = 'hidden';
  };
  const afterEnter = (element: Element) => {
    const el = element as HTMLElement;
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow ?? '';
  };
  const beforeLeave = (element: Element) => {
    const el = element as HTMLElement;
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
  };
  const leave = (element: Element) => {
    const el = element as HTMLElement;
    if (el.scrollHeight !== 0) {
      el.style.height = '0';
      el.style.paddingTop = '0';
      el.style.paddingBottom = '0';
    }
  };
  const afterLeave = (element: Element) => {
    const el = element as HTMLElement;
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow ?? '';
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
  };

  return {
    beforeEnter,
    enter,
    afterEnter,
    beforeLeave,
    leave,
    afterLeave,
  };
}

// refer to https://dev.to/jordienr/how-to-make-animated-gradients-like-stripe-56nh
export function colorAnimation(): () => void {
  const canvas =
    (document.querySelector('td-theme-generator')?.shadowRoot?.getElementById('canvas') as HTMLCanvasElement | null) ||
    (document.getElementById('canvas') as HTMLCanvasElement | null);
  if (!canvas) return () => {};
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  let time = 0;
  let rafId: number | null = null;

  const color = function color(x: number, y: number, r: number, g: number, b: number) {
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.fillRect(x, y, 10, 10);
  };
  const R = function R(x: number, y: number, t: number) {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
  };

  const G = function G(x: number, y: number, t: number) {
    return Math.floor(192 + 64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300));
  };

  const B = function B(x: number, y: number, t: number) {
    return Math.floor(
      192 + 64 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100),
    );
  };

  const startAnimation = function startAnimation() {
    for (let x = 0; x <= 30; x++) {
      for (let y = 0; y <= 30; y++) {
        color(x, y, R(x, y, time), G(x, y, time), B(x, y, time));
      }
    }
    time = time + 0.01;
    rafId = window.requestAnimationFrame(startAnimation);
  };

  startAnimation();

  // 返回取消函数，供调用方在组件卸载时停止动画，避免内存/CPU 泄漏
  return () => {
    if (rafId != null) window.cancelAnimationFrame(rafId);
    rafId = null;
  };
}
