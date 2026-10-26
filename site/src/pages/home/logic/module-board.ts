import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

const DWELL_DISTANCE = 320;
const MOVE_DISTANCE = 900;
const SNAP_DELAY = 120;
const WHEEL_IDLE_DELAY = 240;
const WHEEL_MOMENTUM_DELAY = 1000;

interface WheelGesture {
  direction: -1 | 1;
  targetProgress: number;
  lastEventAt: number;
  lastDelta: number;
  impulseDelta: number;
  limited: boolean;
}

export function createModuleBoard(homepageRef: Ref<HTMLElement | null>) {
  const moduleBoardRef = ref<HTMLElement | null>(null);
  const moduleBoardViewportRef = ref<HTMLElement | null>(null);
  const moduleBoardInnerRef = ref<HTMLElement | null>(null);
  const moduleBoardScrollEnabled = ref(false);
  const moduleBoardStyle = ref<Record<string, string>>({});
  const moduleBoardViewportStyle = ref<Record<string, string>>({});
  const currentTab = ref(0);
  const tabTransformWidth = ref(0);
  const windowWidth = ref(window.innerWidth);

  let resizeObserver: ResizeObserver | null = null;
  let motionQuery: MediaQueryList | null = null;
  let animationFrame: number | null = null;
  let snapTimer: ReturnType<typeof setTimeout> | null = null;
  let snapAnimationFrame: number | null = null;
  let snapScrollY: number | null = null;
  let scrollDirection: -1 | 0 | 1 = 0;
  let lastScrollY: number | null = null;
  let pendingWheelDelta = 0;
  let wheelGesture: WheelGesture | null = null;
  let needsMeasure = true;
  let stops: number[] = [];
  let pinTop = 0;
  let scrollDistance = 0;
  let businessCasesProgress: number | null = null;
  let beforeHeight = 0;

  function measure(): void {
    const home = homepageRef.value;
    const board = moduleBoardRef.value;
    const viewport = moduleBoardViewportRef.value;
    const inner = moduleBoardInnerRef.value;
    if (!home || !board || !viewport || !inner) return;

    const previousLayout = home.dataset.boardLayout;
    delete home.dataset.boardLayout;
    const homeRect = home.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    beforeHeight = boardRect.top - homeRect.top;
    home.style.setProperty('--board-before-height', `${beforeHeight}px`);
    home.style.setProperty('--board-after-height', `${homeRect.bottom - boardRect.bottom}px`);
    home.querySelectorAll<HTMLElement>(':scope > [data-board-section]').forEach((section) => {
      const origin = section.dataset.boardSection === 'before' ? homeRect.top : boardRect.bottom;
      section.style.setProperty('--board-section-top', `${section.getBoundingClientRect().top - origin}px`);
    });

    const cards = Array.from(inner.querySelectorAll<HTMLElement>('.module-board__card'));
    const height = inner.offsetHeight;
    const enabled = window.innerWidth >= 500 && !motionQuery?.matches;
    const wasEnabled = moduleBoardScrollEnabled.value;

    stops = cards.map((card) => Math.max(0, card.offsetLeft + card.offsetWidth / 2 - board.clientWidth / 2));
    pinTop = (window.innerHeight - height) / 2;
    scrollDistance = enabled ? cards.length * DWELL_DISTANCE + Math.max(0, cards.length - 1) * MOVE_DISTANCE : 0;
    const businessCases = home.querySelector<HTMLElement>(':scope > .business-cases');
    businessCasesProgress =
      enabled && businessCases
        ? scrollDistance + height + pinTop + businessCases.getBoundingClientRect().top - boardRect.bottom
        : null;
    moduleBoardScrollEnabled.value = enabled;
    moduleBoardStyle.value = enabled ? { height: `${height + scrollDistance}px` } : {};

    if (enabled) {
      home.dataset.boardLayout = previousLayout ?? 'flow';
      viewport.scrollLeft = 0;
    } else {
      resetModuleBoardGesture();
      moduleBoardViewportStyle.value = {};
      tabTransformWidth.value = 0;
      if (wasEnabled) {
        const left = stops[currentTab.value] ?? 0;
        nextTick(() => viewport.scrollTo({ left, behavior: 'instant' }));
      }
    }
  }

  function update(): void {
    animationFrame = null;
    if (needsMeasure) {
      needsMeasure = false;
      measure();
    }

    const home = homepageRef.value;
    const board = moduleBoardRef.value;
    const viewport = moduleBoardViewportRef.value;
    if (!home || !board || !viewport || stops.length === 0) return;

    let offset = viewport.scrollLeft;
    if (moduleBoardScrollEnabled.value) {
      constrainScroll();
      const boardRect = board.getBoundingClientRect();
      const progress = Math.max(0, Math.min(scrollDistance, pinTop - boardRect.top));
      if (progress > 0 && progress < scrollDistance) {
        const fixedStyle = {
          position: 'fixed',
          left: `${boardRect.left}px`,
          width: `${boardRect.width}px`,
        };
        moduleBoardViewportStyle.value = { ...fixedStyle, top: `${pinTop}px` };
        home.dataset.boardLayout = 'pinned';
        home.style.setProperty('--board-before-top', `${pinTop - beforeHeight}px`);
        home.style.setProperty('--board-after-top', `${window.innerHeight - pinTop}px`);
      } else {
        const absoluteStyle = { position: 'absolute', left: '0', width: '100%' };
        moduleBoardViewportStyle.value = { ...absoluteStyle, top: `${progress}px` };
        home.dataset.boardLayout = 'flow';
        home.style.setProperty('--board-before-top', `${progress}px`);
        home.style.setProperty('--board-after-top', `${beforeHeight + window.innerHeight - 2 * pinTop + progress}px`);
      }
      offset = stops[stops.length - 1];
      for (let index = 0; index < stops.length - 1; index++) {
        const moveStart = DWELL_DISTANCE + index * (DWELL_DISTANCE + MOVE_DISTANCE);
        if (progress <= moveStart) {
          offset = stops[index];
          break;
        }
        if (progress < moveStart + MOVE_DISTANCE) {
          const fraction = (progress - moveStart) / MOVE_DISTANCE;
          const eased = fraction * fraction * (3 - 2 * fraction);
          offset = stops[index] + (stops[index + 1] - stops[index]) * eased;
          break;
        }
      }
      tabTransformWidth.value = offset;
    }

    currentTab.value = stops.reduce(
      (nearest, stop, index) => (Math.abs(stop - offset) < Math.abs(stops[nearest] - offset) ? index : nearest),
      0,
    );
  }

  function scheduleModuleBoardUpdate(): void {
    if (animationFrame === null) animationFrame = requestAnimationFrame(update);
  }

  function cancelSnapAnimation(): void {
    pendingWheelDelta = 0;
    if (snapAnimationFrame === null) return;
    cancelAnimationFrame(snapAnimationFrame);
    snapAnimationFrame = null;
    snapScrollY = null;
    lastScrollY = window.scrollY;
  }

  function resetModuleBoardGesture(): void {
    wheelGesture = null;
    cancelSnapAnimation();
    if (snapTimer !== null) {
      clearTimeout(snapTimer);
      snapTimer = null;
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
      resetModuleBoardGesture();
    }
  }

  function animateScroll(targetScrollY: number): void {
    cancelSnapAnimation();
    const startScrollY = window.scrollY;
    const distance = targetScrollY - startScrollY;
    const duration = Math.min(650, Math.max(360, Math.abs(distance) * 0.65));
    const startedAt = performance.now();
    snapScrollY = startScrollY;

    const animate = (timestamp: number): void => {
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      snapScrollY = startScrollY + distance * eased;
      window.scrollTo({ top: snapScrollY, behavior: 'instant' });

      if (progress < 1) {
        snapAnimationFrame = requestAnimationFrame(animate);
      } else {
        snapAnimationFrame = null;
        snapScrollY = null;
        lastScrollY = window.scrollY;
        const pendingDelta = pendingWheelDelta;
        pendingWheelDelta = 0;
        if (pendingDelta !== 0) {
          wheelGesture = null;
          if (!scrollByWheel(pendingDelta, true)) {
            window.scrollBy({ top: pendingDelta, behavior: 'instant' });
          }
        }
      }
    };

    snapAnimationFrame = requestAnimationFrame(animate);
  }

  function snapByDirection(): void {
    snapTimer = null;
    const board = moduleBoardRef.value;
    if (!board || !moduleBoardScrollEnabled.value) return;

    const boardRect = board.getBoundingClientRect();
    const progress = pinTop - boardRect.top;
    if (progress <= 0 || progress >= scrollDistance) return;

    for (let index = 0; index < stops.length - 1; index++) {
      const moveStart = DWELL_DISTANCE + index * (DWELL_DISTANCE + MOVE_DISTANCE);
      const moveEnd = moveStart + MOVE_DISTANCE;
      if (progress <= moveStart || progress >= moveEnd) continue;

      const snapForward = scrollDirection > 0 || (scrollDirection === 0 && progress - moveStart >= MOVE_DISTANCE / 2);
      const targetProgress = snapForward ? moveEnd : moveStart;
      animateScroll(window.scrollY + boardRect.top - pinTop + targetProgress);
      return;
    }
  }

  function handleWheel(event: WheelEvent): void {
    const board = moduleBoardRef.value;
    if (
      !board ||
      !moduleBoardScrollEnabled.value ||
      stops.length < 2 ||
      event.defaultPrevented ||
      event.ctrlKey ||
      event.deltaY === 0
    ) {
      return;
    }

    const now = performance.now();
    const deltaUnit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const delta = event.deltaY * deltaUnit;
    const direction = delta > 0 ? 1 : -1;
    if (wheelGesture) {
      const elapsed = now - wheelGesture.lastEventAt;
      const directionChanged = direction !== wheelGesture.direction;
      const increase = Math.abs(delta) - wheelGesture.lastDelta;
      wheelGesture.impulseDelta = increase > 0 ? wheelGesture.impulseDelta + increase : 0;
      const newImpulse =
        wheelGesture.limited &&
        (Math.abs(delta) > Math.max(8, wheelGesture.lastDelta * 2) || wheelGesture.impulseDelta >= 4);
      if (
        snapAnimationFrame !== null &&
        wheelGesture.limited &&
        (pendingWheelDelta !== 0 || elapsed > WHEEL_IDLE_DELAY)
      ) {
        pendingWheelDelta += delta;
        wheelGesture.lastEventAt = now;
        wheelGesture.lastDelta = Math.abs(delta);
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (
        (snapAnimationFrame === null && (elapsed > WHEEL_IDLE_DELAY || directionChanged || newImpulse)) ||
        (!wheelGesture.limited && directionChanged)
      ) {
        wheelGesture = null;
      }
    }

    if (scrollByWheel(delta, event.cancelable) && event.cancelable) event.preventDefault();
  }

  function scrollByWheel(delta: number, applyDelta: boolean): boolean {
    const board = moduleBoardRef.value;
    if (!board || !moduleBoardScrollEnabled.value) return false;
    const now = performance.now();
    const direction = delta > 0 ? 1 : -1;
    const progress = pinTop - board.getBoundingClientRect().top;
    let nextProgress = progress + delta;
    if (!wheelGesture) {
      cancelSnapAnimation();
      const scrollLimit = direction > 0 ? (businessCasesProgress ?? scrollDistance) : scrollDistance;
      if (Math.max(progress, nextProgress) < 0 || Math.min(progress, nextProgress) > scrollLimit) {
        return false;
      }
      const step = DWELL_DISTANCE + MOVE_DISTANCE;
      const lastIndex = stops.length - 1;
      const currentIndex = Math.max(0, Math.min(lastIndex, Math.round((progress - DWELL_DISTANCE / 2) / step)));
      const targetIndex = currentIndex + direction;
      const snapToBusinessCases =
        targetIndex > lastIndex && businessCasesProgress !== null && progress < businessCasesProgress - 1;
      if (targetIndex < 0 || (targetIndex > lastIndex && !snapToBusinessCases)) return false;
      const dwellStart = currentIndex * step;
      if (
        currentIndex > 0 &&
        currentIndex < lastIndex &&
        progress >= dwellStart &&
        progress <= dwellStart + DWELL_DISTANCE
      ) {
        nextProgress = dwellStart + (direction > 0 ? DWELL_DISTANCE : 0) + delta;
      }
      const targetProgress =
        snapToBusinessCases && businessCasesProgress !== null
          ? businessCasesProgress
          : targetIndex * step + (direction < 0 ? DWELL_DISTANCE : 0);
      if (snapToBusinessCases) nextProgress = targetProgress;
      wheelGesture = {
        direction,
        targetProgress,
        lastEventAt: now,
        lastDelta: Math.abs(delta),
        impulseDelta: 0,
        limited: false,
      };
    }

    const gesture = wheelGesture;
    gesture.lastEventAt = now;
    gesture.lastDelta = Math.abs(delta);
    if (gesture.limited) return true;

    if ((nextProgress - gesture.targetProgress) * gesture.direction >= 0) {
      gesture.limited = true;
      if (snapTimer !== null) {
        clearTimeout(snapTimer);
        snapTimer = null;
      }
      animateScroll(window.scrollY + gesture.targetProgress - progress);
      return true;
    }

    cancelSnapAnimation();
    if (applyDelta) window.scrollBy({ top: nextProgress - progress, behavior: 'instant' });
    return true;
  }

  function constrainScroll(): void {
    if (!moduleBoardScrollEnabled.value) return;
    if (snapAnimationFrame !== null && snapScrollY !== null) {
      if (Math.abs(window.scrollY - snapScrollY) > 1) {
        window.scrollTo({ top: snapScrollY, behavior: 'instant' });
      }
      return;
    }

    const gesture = wheelGesture;
    const board = moduleBoardRef.value;
    if (!gesture || !board) return;
    if (performance.now() - gesture.lastEventAt >= WHEEL_MOMENTUM_DELAY) {
      wheelGesture = null;
      return;
    }
    const progress = pinTop - board.getBoundingClientRect().top;
    if ((progress - gesture.targetProgress) * gesture.direction > 1) {
      gesture.limited = true;
      window.scrollTo({ top: window.scrollY + gesture.targetProgress - progress, behavior: 'instant' });
    }
  }

  function handleScroll(): void {
    constrainScroll();
    scheduleModuleBoardUpdate();
    if (snapAnimationFrame !== null) return;

    const scrollY = window.scrollY;
    if (lastScrollY !== null && scrollY !== lastScrollY) {
      scrollDirection = scrollY > lastScrollY ? 1 : -1;
    }
    lastScrollY = scrollY;
    if (!moduleBoardScrollEnabled.value) return;

    if (snapTimer !== null) clearTimeout(snapTimer);
    snapTimer = setTimeout(snapByDirection, SNAP_DELAY);
  }

  function refresh(): void {
    needsMeasure = true;
    scheduleModuleBoardUpdate();
  }

  function handleModuleBoardFocus(event: FocusEvent): void {
    if (!moduleBoardScrollEnabled.value || !(event.target instanceof HTMLElement)) return;
    const card = event.target.closest<HTMLElement>('.module-board__card');
    const cards = moduleBoardInnerRef.value?.querySelectorAll<HTMLElement>('.module-board__card');
    const board = moduleBoardRef.value;
    if (!board || !card || !cards) return;

    const index = Array.from(cards).indexOf(card);
    if (index < 0 || index === currentTab.value) return;
    resetModuleBoardGesture();
    moduleBoardViewportRef.value?.scrollTo({ left: 0, behavior: 'instant' });
    window.scrollTo({
      top: window.scrollY + board.getBoundingClientRect().top - pinTop + index * (DWELL_DISTANCE + MOVE_DISTANCE),
      behavior: 'instant',
    });
    scheduleModuleBoardUpdate();
  }

  function handleResize(): void {
    windowWidth.value = window.innerWidth;
    refresh();
  }

  onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', refresh);
    resizeObserver = new ResizeObserver(refresh);
    if (moduleBoardInnerRef.value) resizeObserver.observe(moduleBoardInnerRef.value);
    homepageRef.value?.querySelectorAll<HTMLElement>(':scope > [data-board-section]').forEach((section) => {
      resizeObserver?.observe(section, { box: 'border-box' });
    });
    refresh();
    lastScrollY = window.scrollY;
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('pointerdown', resetModuleBoardGesture, { passive: true });
    window.addEventListener('keydown', handleKeydown);
  });

  onBeforeUnmount(() => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    if (snapTimer !== null) clearTimeout(snapTimer);
    cancelSnapAnimation();
    resizeObserver?.disconnect();
    motionQuery?.removeEventListener('change', refresh);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel, true);
    window.removeEventListener('pointerdown', resetModuleBoardGesture);
    window.removeEventListener('keydown', handleKeydown);
  });

  return {
    currentTab,
    handleModuleBoardFocus,
    moduleBoardInnerRef,
    moduleBoardRef,
    moduleBoardScrollEnabled,
    moduleBoardStyle,
    moduleBoardViewportRef,
    moduleBoardViewportStyle,
    scheduleModuleBoardUpdate,
    tabTransformWidth,
    windowWidth,
  };
}
