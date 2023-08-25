/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

// 展开收起动画
export function collapseAnimation() {
  const beforeEnter = (el) => {
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.height = "0";
    el.style.paddingTop = "0";
    el.style.paddingBottom = "0";
  };
  const enter = (el) => {
    el.dataset.oldOverflow = el.style.overflow;
    el.style.height = `${el.scrollHeight}px`;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
    el.style.overflow = "hidden";
  };
  const afterEnter = (el) => {
    el.style.height = "";
    el.style.overflow = el.dataset.oldOverflow;
  };
  const beforeLeave = (el) => {
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  };
  const leave = (el) => {
    if (el.scrollHeight !== 0) {
      el.style.height = "0";
      el.style.paddingTop = "0";
      el.style.paddingBottom = "0";
    }
  };
  const afterLeave = (el) => {
    el.style.height = "";
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
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
export function colorAnimation() {
  const canvas =
    document
      .querySelector("td-theme-generator")
      ?.shadowRoot?.getElementById("canvas") ||
    document.getElementById("canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  let time = 0;

  const color = function (x, y, r, g, b) {
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.fillRect(x, y, 10, 10);
  };
  const R = function (x, y, time) {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + time));
  };

  const G = function (x, y, time) {
    return Math.floor(
      192 +
        64 *
          Math.sin(
            (x * x * Math.cos(time / 4) + y * y * Math.sin(time / 3)) / 300
          )
    );
  };

  const B = function (x, y, time) {
    return Math.floor(
      192 +
        64 *
          Math.sin(
            5 * Math.sin(time / 9) +
              ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
          )
    );
  };

  const startAnimation = function () {
    for (let x = 0; x <= 30; x++) {
      for (let y = 0; y <= 30; y++) {
        color(x, y, R(x, y, time), G(x, y, time), B(x, y, time));
      }
    }
    time = time + 0.01;
    window.requestAnimationFrame(startAnimation);
  };

  startAnimation();
}
