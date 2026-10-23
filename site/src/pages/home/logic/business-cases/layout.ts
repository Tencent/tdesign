import { onBeforeUnmount, onMounted, ref } from 'vue';

import type { BusinessCase } from './data';

const SPREAD_SETTLE_DELAY = 180;
const SPREAD_ANIMATION_DURATION = 700;

export function createBusinessCasesLayout() {
  const businessCasesRef = ref<HTMLElement | null>(null);
  const spreadProgress = ref(0);
  const canvasScale = ref('1');
  const compactCanvasScale = ref('1');
  const compactCanvasTop = ref('276px');
  const compactCanvasHeight = ref('635px');
  const compactSectionHeight = ref('971px');
  const mobileLayoutScale = ref('1');
  const mobileSectionHeight = ref('0px');
  let animationFrame: number | null = null;
  let spreadAnimationStartedAt: number | null = null;
  let spreadAnimationFrom = 0;
  let spreadAnimationTarget = 0;
  let spreadLastViewportChangeAt = 0;

  function updateResponsiveLayout(): void {
    const section = businessCasesRef.value;
    if (!section) return;

    const sectionWidth = section.clientWidth;
    const scale = Math.min(1, Math.max(1200 / 1440, sectionWidth / 1440));
    const compactScale = Math.min(1200 / 1060, Math.max(1, window.innerWidth / 1060));
    const canvasHeight = window.innerWidth >= 882 ? 635 : 813;
    const heading = section.querySelector<HTMLElement>('.business-cases__heading');
    const canvas = section.querySelector<HTMLElement>('.business-cases__canvas');
    const headingCanvasGap = window.innerWidth < 960 ? 24 : 64;
    const canvasTop = heading ? heading.offsetTop + heading.offsetHeight + headingCanvasGap : 212 + headingCanvasGap;
    const canvasLayoutHeight = window.innerWidth < 960 ? (canvas?.offsetHeight ?? canvasHeight) : canvasHeight;

    canvasScale.value = scale.toFixed(4);
    compactCanvasScale.value = compactScale.toFixed(4);
    compactCanvasTop.value = `${canvasTop}px`;
    compactCanvasHeight.value = `${canvasHeight}px`;
    compactSectionHeight.value = `${canvasTop + canvasLayoutHeight * compactScale + 60}px`;

    const mobileScale = Math.min(1, window.innerWidth / 596);
    const mobileLayout = section.querySelector<HTMLElement>('.business-cases__layout');
    mobileLayoutScale.value = mobileScale.toFixed(4);
    mobileSectionHeight.value = `${
      (mobileLayout?.offsetHeight ?? 0) - (canvas?.offsetHeight ?? 0) * (1 - mobileScale)
    }px`;
  }

  function updateSpreadProgress(timestamp = performance.now()): void {
    animationFrame = null;
    updateResponsiveLayout();

    const section = businessCasesRef.value;
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top;
    const nextTarget = sectionTop <= window.innerHeight * 0.28 ? 1 : 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spreadProgress.value = nextTarget;
      spreadAnimationTarget = nextTarget;
      spreadAnimationStartedAt = null;
      return;
    }

    if (
      nextTarget === 1 &&
      spreadAnimationTarget === 0 &&
      timestamp - spreadLastViewportChangeAt < SPREAD_SETTLE_DELAY
    ) {
      animationFrame = window.requestAnimationFrame(updateSpreadProgress);
      return;
    }

    if (nextTarget !== spreadAnimationTarget) {
      spreadAnimationFrom = spreadProgress.value;
      spreadAnimationTarget = nextTarget;
      spreadAnimationStartedAt = timestamp;
    }
    if (spreadAnimationStartedAt === null) return;

    const distance = Math.abs(spreadAnimationTarget - spreadAnimationFrom);
    const duration = Math.max(1, SPREAD_ANIMATION_DURATION * distance);
    const progress = Math.min(1, (timestamp - spreadAnimationStartedAt) / duration);
    const easedProgress = 1 - (1 - progress) ** 3;
    spreadProgress.value = Number(
      (spreadAnimationFrom + (spreadAnimationTarget - spreadAnimationFrom) * easedProgress).toFixed(3),
    );

    if (progress < 1) animationFrame = window.requestAnimationFrame(updateSpreadProgress);
    else {
      spreadProgress.value = spreadAnimationTarget;
      spreadAnimationStartedAt = null;
    }
  }

  function scheduleSpreadUpdate(): void {
    spreadLastViewportChangeAt = performance.now();
    if (animationFrame === null) animationFrame = window.requestAnimationFrame(updateSpreadProgress);
  }

  function getCaseStyle(item: BusinessCase): Record<string, string> {
    const inverseProgress = 1 - spreadProgress.value;
    return {
      '--spread-translate-x': `${Math.round(item.spreadX * inverseProgress)}px`,
      '--spread-translate-y': `${Math.round(item.spreadY * inverseProgress)}px`,
      '--spread-rotation': `${item.rotation}deg`,
      '--spread-opacity': `${0.35 + spreadProgress.value * 0.65}`,
    };
  }

  onMounted(() => {
    scheduleSpreadUpdate();
    window.addEventListener('scroll', scheduleSpreadUpdate, { passive: true });
    window.addEventListener('resize', scheduleSpreadUpdate);
  });

  onBeforeUnmount(() => {
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener('scroll', scheduleSpreadUpdate);
    window.removeEventListener('resize', scheduleSpreadUpdate);
  });

  return {
    businessCasesRef,
    canvasScale,
    compactCanvasScale,
    compactCanvasTop,
    compactCanvasHeight,
    compactSectionHeight,
    mobileLayoutScale,
    mobileSectionHeight,
    getCaseStyle,
  };
}
