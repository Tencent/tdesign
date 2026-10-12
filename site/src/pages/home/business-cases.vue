<template>
  <section
    ref="businessCasesRef"
    class="business-cases"
    :style="{
      '--canvas-scale': canvasScale,
      '--compact-canvas-scale': compactCanvasScale,
      '--compact-canvas-top': compactCanvasTop,
      '--compact-canvas-height': compactCanvasHeight,
      '--compact-section-height': compactSectionHeight,
      '--mobile-layout-scale': mobileLayoutScale,
      '--mobile-section-height': mobileSectionHeight,
    }"
  >
    <div class="business-cases__layout">
      <header class="business-cases__heading">
        <h2>{{ t('home.businessCases.title') }}</h2>
        <p>{{ t('home.businessCases.description') }}</p>
      </header>

      <div class="business-cases__canvas">
        <article
          v-for="(item, index) in cases"
          :key="item.nickname"
          :class="['business-case', `business-case--${index + 1}`]"
          :style="getCaseStyle(item)"
        >
          <div class="business-case__card">
            <span class="business-case__noise" aria-hidden="true"></span>
            <p class="business-case__quote">{{ item.content }}</p>
            <footer class="business-case__user">
              <div class="business-case__profile">
                <t-avatar size="40px" :image="item.avatar" :alt="item.nickname" />
                <div>
                  <strong>{{ item.nickname }}</strong>
                  <span>{{ item.position }}</span>
                </div>
              </div>
            </footer>
          </div>
          <p class="business-case__prompt">› {{ item.scene }}</p>
        </article>

        <article class="usage-card">
          <div class="usage-card__data">
            <div>
              <p>{{ t('home.businessCases.downloads') }}</p>
              <div class="usage-card__total">
                <strong>{{ usageData.downloadPerMonth }}</strong>
                <span>{{ t('home.businessCases.tenThousandPlus') }}</span>
              </div>
            </div>
            <div class="usage-card__metrics">
              <div>
                <span>{{ t('home.businessCases.designReferences') }}</span>
                <strong>
                  {{ usageData.figmaReferenceCount }}
                  <small>{{ t('home.businessCases.tenThousand') }}</small>
                </strong>
              </div>
              <div>
                <span>{{ t('home.businessCases.projects') }}</span>
                <strong>{{ usageData.projectsCount }}</strong>
              </div>
            </div>
          </div>
          <div
            class="usage-card__chart"
            :style="{ '--hover-x': `${chartHoverX}px`, '--hover-y': `${chartHoverY}px` }"
            @pointermove="handleChartPointerMove"
          >
            <div class="usage-card__tooltip">
              <strong>{{ t('home.businessCases.downloads') }}</strong>
              <span>09:14 GMT，2026.08</span>
            </div>
            <div class="usage-card__grid" aria-hidden="true">
              <span v-for="month in months" :key="month">{{ month }}</span>
            </div>
            <svg viewBox="0 0 308 212" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="business-cases-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="var(--text-primary)" stop-opacity=".12" />
                  <stop offset="1" stop-color="var(--text-primary)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path
                class="usage-card__area"
                d="M0 154 C18 157 20 149 32 158 C43 158 45 137 53 135 C58 136 59 153 65 153 C70 148 76 154 81 150 C86 140 93 141 96 130 L104 105 C108 98 115 119 126 131 C135 139 142 145 148 134 C154 126 163 129 169 122 L179 99 C185 89 191 115 195 113 C199 106 200 90 206 92 C211 94 207 77 221 65 C228 60 226 48 237 44 C248 46 247 36 253 33 C261 31 265 39 270 34 C278 25 282 29 287 7 C291 -8 294 8 299 10 C304 14 307 20 308 21 V212 H0Z"
              />
              <path
                ref="usageLineRef"
                class="usage-card__line"
                d="M0 154 C18 157 20 149 32 158 C43 158 45 137 53 135 C58 136 59 153 65 153 C70 148 76 154 81 150 C86 140 93 141 96 130 L104 105 C108 98 115 119 126 131 C135 139 142 145 148 134 C154 126 163 129 169 122 L179 99 C185 89 191 115 195 113 C199 106 200 90 206 92 C211 94 207 77 221 65 C228 60 226 48 237 44 C248 46 247 36 253 33 C261 31 265 39 270 34 C278 25 282 29 287 7 C291 -8 294 8 299 10 C304 14 307 20 308 21"
              />
            </svg>
            <span class="usage-card__marker" aria-hidden="true"></span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import homeMessages from '@/locales/pages/home';

import { fallbackUsageData, getUsageData } from './usage-data';

const { t } = useI18n({ messages: homeMessages });
const developerStoriesUrl = 'https://tdesign.gtimg.com/site/info/developer-stories.json';

interface DeveloperStory {
  content: string;
  nickname: string;
  position: string;
  avatar: string;
  scene: string;
}

interface BusinessCase extends DeveloperStory {
  spreadX: number;
  spreadY: number;
  rotation: number;
}

type BusinessCaseLayout = Pick<BusinessCase, 'spreadX' | 'spreadY' | 'rotation'>;

const caseLayouts: BusinessCaseLayout[] = [
  {
    spreadX: 488,
    spreadY: 141,
    rotation: -7,
  },
  {
    spreadX: 527,
    spreadY: -172,
    rotation: -5,
  },
  {
    spreadX: -505,
    spreadY: -151,
    rotation: 6,
  },
  {
    spreadX: -486,
    spreadY: 137,
    rotation: 6,
  },
  {
    spreadX: 21,
    spreadY: -319,
    rotation: -4,
  },
];

const cases = ref<BusinessCase[]>([]);
const months = ['2026.04', '2026.05', '2026.06', '2026.07', '2026.08', '2026.09'];
const businessCasesRef = ref<HTMLElement | null>(null);
const usageLineRef = ref<SVGPathElement | null>(null);
const spreadProgress = ref(0);
const canvasScale = ref('1');
const compactCanvasScale = ref('1');
const compactCanvasTop = ref('276px');
const compactCanvasHeight = ref('623px');
const compactSectionHeight = ref('959px');
const mobileLayoutScale = ref('1');
const mobileSectionHeight = ref('0px');
const chartHoverX = ref(226);
const chartHoverY = ref(65);
const usageData = ref(fallbackUsageData);
let animationFrame: number | null = null;

function isDeveloperStory(value: unknown): value is DeveloperStory {
  if (!value || typeof value !== 'object') return false;
  const story = value as Record<string, unknown>;
  return ['content', 'nickname', 'position', 'avatar', 'scene'].every((key) => typeof story[key] === 'string');
}

async function getDeveloperStories(): Promise<void> {
  try {
    const response = await fetch(developerStoriesUrl);
    if (!response.ok) return;

    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !Array.isArray((result as { data?: unknown }).data)) return;

    cases.value = (result as { data: unknown[] }).data
      .filter(isDeveloperStory)
      .slice(0, caseLayouts.length)
      .map((story, index) => ({ ...story, ...caseLayouts[index] }));
  } catch {
    cases.value = [];
  }
}

function handleChartPointerMove(event: PointerEvent): void {
  const chart = event.currentTarget as HTMLElement;
  const path = usageLineRef.value;
  if (!path) return;

  const chartRect = chart.getBoundingClientRect();
  const localX = ((event.clientX - chartRect.left) / chartRect.width) * chart.clientWidth;
  const targetX = Math.min(308, Math.max(0, localX));
  const pathLength = path.getTotalLength();
  let start = 0;
  let end = pathLength;

  for (let index = 0; index < 16; index += 1) {
    const middle = (start + end) / 2;
    if (path.getPointAtLength(middle).x < targetX) start = middle;
    else end = middle;
  }

  const point = path.getPointAtLength((start + end) / 2);
  chartHoverX.value = targetX;
  chartHoverY.value = point.y;
}

function getCaseStyle(item: BusinessCase): Record<string, string> {
  const inverseProgress = 1 - spreadProgress.value;

  return {
    '--spread-translate-x': `${item.spreadX * inverseProgress}px`,
    '--spread-translate-y': `${item.spreadY * inverseProgress}px`,
    '--spread-rotation': `${item.rotation * spreadProgress.value}deg`,
    '--spread-scale': `${0.9 + spreadProgress.value * 0.1}`,
    '--spread-opacity': `${0.35 + spreadProgress.value * 0.65}`,
  };
}

function updateSpreadProgress(): void {
  animationFrame = null;

  if (businessCasesRef.value) {
    const sectionWidth = businessCasesRef.value.clientWidth;
    const scale = Math.min(1, Math.max(1200 / 1440, sectionWidth / 1440));
    const compactScale = Math.min(1200 / 1060, Math.max(1, window.innerWidth / 1060));
    const canvasHeight = window.innerWidth >= 882 ? 623 : 801;
    const heading = businessCasesRef.value.querySelector<HTMLElement>('.business-cases__heading');
    const canvasTop = heading ? heading.offsetTop + heading.offsetHeight + 64 : 276;

    canvasScale.value = scale.toFixed(4);
    compactCanvasScale.value = compactScale.toFixed(4);
    compactCanvasTop.value = `${canvasTop}px`;
    compactCanvasHeight.value = `${canvasHeight}px`;
    compactSectionHeight.value = `${canvasTop + canvasHeight * compactScale + 60}px`;

    const mobileScale = Math.min(1, window.innerWidth / 596);
    const mobileLayout = businessCasesRef.value.querySelector<HTMLElement>('.business-cases__layout');
    mobileLayoutScale.value = mobileScale.toFixed(4);
    mobileSectionHeight.value = `${(mobileLayout?.offsetHeight ?? 0) * mobileScale}px`;
  }

  if (!businessCasesRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    spreadProgress.value = 1;
    return;
  }

  const sectionTop = businessCasesRef.value.getBoundingClientRect().top;
  const animationStart = window.innerHeight * 0.55;
  const animationEnd = window.innerHeight * 0.08;
  const progress = Math.min(1, Math.max(0, (animationStart - sectionTop) / (animationStart - animationEnd)));

  spreadProgress.value = Number(progress.toFixed(3));
}

function scheduleSpreadUpdate(): void {
  if (animationFrame === null) {
    animationFrame = window.requestAnimationFrame(updateSpreadProgress);
  }
}

onMounted(() => {
  getDeveloperStories();
  getUsageData().then((data) => {
    usageData.value = data;
  });
  updateSpreadProgress();
  window.addEventListener('scroll', scheduleSpreadUpdate, { passive: true });
  window.addEventListener('resize', scheduleSpreadUpdate);
});

onBeforeUnmount(() => {
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
  window.removeEventListener('scroll', scheduleSpreadUpdate);
  window.removeEventListener('resize', scheduleSpreadUpdate);
});
</script>

<style lang="less" scoped>
.business-cases {
  height: 1000px;
  position: relative;
  overflow: hidden;
  color: var(--text-primary);
  background: var(--td-bg-color-container);

  &__layout {
    display: contents;
  }

  &__heading {
    width: min(888px, calc(100% - 48px));
    position: absolute;
    z-index: 2;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    h2 {
      margin: 0;
      font-size: 36px;
      font-weight: 600;
      line-height: 44px;
    }

    p {
      margin: 20px 0 0;
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 300;
      line-height: 28px;
    }
  }

  &__canvas {
    width: 1512px;
    height: 760px;
    position: absolute;
    top: 240px;
    left: 50%;
    transform: translateX(-50%) scale(var(--canvas-scale));
    transform-origin: top center;
  }
}

.business-case {
  width: 340px;
  position: absolute;
  z-index: 1;
  opacity: var(--spread-opacity);
  transform: translate(var(--spread-translate-x), var(--spread-translate-y)) rotate(var(--spread-rotation))
    scale(var(--spread-scale));
  transform-origin: center;
  will-change: transform, opacity;

  &__card {
    height: 180px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    padding: 24px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid var(--component-border);
    border-radius: 16px;
    background: var(--bg-color-card);
    color: var(--text-primary);
    backdrop-filter: blur(2px);
  }

  &__noise {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 121% 121% at 50% -21%,
      transparent 0%,
      var(--case-tint, var(--bg-color-card-user)) 85%
    );
    pointer-events: none;
  }

  &__quote {
    z-index: 1;
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 22px;
  }

  &__user {
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
      width: 40px;
      height: 40px;
      display: block;
    }

    div {
      display: flex;
      flex-direction: column;
    }

    strong {
      font-size: 14px;
      line-height: 22px;
    }

    span {
      color: var(--text-placeholder);
      font-size: 12px;
      line-height: 20px;
    }
  }

  &__prompt {
    width: fit-content;
    min-width: 84%;
    margin: 0 auto;
    padding: 6px 10px;
    box-sizing: border-box;
    border: 1px solid var(--component-border);
    border-radius: 8px;
    background: var(--bg-color-card);
    color: var(--text-placeholder);
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    white-space: nowrap;
  }

  &--1 {
    top: 29px;
    left: 98px;
    --case-rotation: -7deg;
  }

  &--2 {
    top: 342px;
    left: 59px;
    --case-rotation: -5deg;
    --case-tint: var(--brand-main-light-hover);
  }

  &--3 {
    top: 321px;
    left: 1091px;
    --case-rotation: 6deg;
    --case-tint: var(--warning-main-light-hover);
  }

  &--4 {
    top: 33px;
    left: 1072px;
    --case-rotation: 6deg;
    --case-tint: var(--brand-main-light-hover);
  }

  &--5 {
    top: 489px;
    left: 565px;
    --case-rotation: -4deg;
  }
}

.usage-card {
  width: 548px;
  height: 260px;
  position: absolute;
  z-index: 2;
  top: 140px;
  left: 478px;
  display: flex;
  overflow: hidden;
  border: 1px solid var(--component-border);
  border-radius: 16px;
  box-sizing: border-box;
  background: var(--bg-color-card);
  color: var(--text-primary);
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.04);

  &:hover {
    .usage-card__chart::after,
    .usage-card__marker {
      opacity: 1;
    }
  }

  &__data {
    width: 240px;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    box-sizing: border-box;
    background: linear-gradient(317deg, var(--bg-color-card-user) 29.81%, var(--bg-color-card) 80.29%);

    p {
      margin: 0 0 20px;
      color: var(--text-secondary);
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
    }
  }

  &__total {
    display: flex;
    align-items: flex-end;
    gap: 8px;

    strong {
      font-family: 'TCloudNumber', sans-serif;
      font-size: 56px;
      font-weight: 400;
      letter-spacing: -1.12px;
      line-height: 48px;
    }

    span {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
  }

  &__metrics {
    display: flex;
    gap: 36px;
    padding-top: 12px;
    border-top: 1px solid var(--bg-color-data);

    div {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    span {
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 300;
      line-height: 20px;
      white-space: nowrap;
    }

    strong {
      font-family: 'TCloudNumber', sans-serif;
      font-size: 20px;
      font-weight: 400;
      line-height: 20px;
      white-space: nowrap;
    }

    small {
      margin-left: 4px;
      font-family: inherit;
      font-size: 12px;
    }
  }

  &__chart {
    width: 308px;
    position: relative;
    overflow: hidden;

    &::after {
      width: 2px;
      height: 212px;
      position: absolute;
      z-index: 2;
      top: 28px;
      left: var(--hover-x);
      transform: translateX(-50%);
      background: var(--text-primary);
      content: '';
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    > svg {
      width: 308px;
      height: 212px;
      position: absolute;
      top: 28px;
      left: 0;
    }
  }

  &__tooltip {
    position: absolute;
    z-index: 2;
    top: 24px;
    left: 24px;
    display: flex;
    flex-direction: column;

    strong {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    span {
      color: var(--text-secondary);
      font-size: 8px;
      line-height: 12px;
    }
  }

  &__grid {
    position: absolute;
    z-index: 1;
    top: 24px;
    left: 24px;
    display: flex;
    gap: 28px;

    span {
      width: 20px;
      height: 212px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 2px;
      box-sizing: border-box;
      border-left: 1px dashed var(--component-border);
      color: var(--text-placeholder);
      font-size: 8px;
      line-height: 11px;
      writing-mode: horizontal-tb;
    }
  }

  &__area {
    fill: url(#business-cases-area);
  }

  &__line {
    fill: none;
    stroke: var(--text-primary);
    stroke-width: 1.5;
  }

  &__marker {
    width: 10px;
    height: 10px;
    position: absolute;
    z-index: 3;
    top: calc(28px + var(--hover-y));
    left: var(--hover-x);
    transform: translate(-50%, -50%);
    border: 2px solid var(--text-anti);
    border-radius: 50%;
    box-sizing: border-box;
    background: var(--text-primary);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
}

@media screen and (max-width: 1100px) {
  .business-cases {
    height: 820px;

    &__heading {
      top: 80px;
    }

    &__canvas {
      top: 210px;
      transform: translateX(-50%) scale(0.78);
      transform-origin: top center;
    }
  }
}

@media screen and (max-width: 720px) {
  .business-cases {
    height: auto;
    padding: 72px 24px;
    box-sizing: border-box;

    &__heading {
      width: 100%;
      position: relative;
      top: auto;
      left: auto;
      transform: none;

      h2 {
        font-size: 28px;
        line-height: 40px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }

    &__canvas {
      width: 100%;
      height: auto;
      position: relative;
      top: auto;
      left: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 48px;
      transform: none;
    }
  }

  .usage-card {
    width: 100%;
    height: 260px;
    position: relative;
    top: auto;
    left: auto;

    &__data {
      width: 44%;
      padding: 20px;
    }

    &__chart {
      width: 56%;
    }
  }

  .business-case {
    width: min(340px, 100%);
    position: relative;
    top: auto;
    left: auto;
    margin: 0 auto;
    opacity: 1;
    transform: none;

    &--1,
    &--3,
    &--4 {
      display: none;
    }

    &--2,
    &--5 {
      transform: rotate(-2deg);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .business-case {
    opacity: 1;
    transform: translate(0, 0) rotate(var(--case-rotation)) scale(1);
    will-change: auto;
  }
}

@media screen and (max-width: 480px) {
  .usage-card {
    height: auto;
    flex-direction: column;

    &__data,
    &__chart {
      width: 100%;
    }

    &__data {
      min-height: 236px;
    }

    &__chart {
      height: 240px;
    }
  }
}

@media screen and (min-width: 596px) and (max-width: 1200px) {
  .business-cases {
    height: var(--compact-section-height);
    padding: 0;

    &__heading {
      width: min(960px, 100%);
      position: absolute;
      top: 120px;
      left: 50%;
      transform: translateX(-50%);

      h2 {
        font-size: 36px;
        line-height: 44px;
      }

      p {
        font-size: 20px;
        line-height: 28px;
      }
    }

    &__canvas {
      width: min(834px, calc(100vw - 48px));
      height: var(--compact-canvas-height);
      position: absolute;
      top: var(--compact-canvas-top);
      left: 50%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-content: start;
      justify-content: center;
      gap: 24px;
      padding-top: 284px;
      box-sizing: border-box;
      margin: 0;
      transform: translateX(-50%) scale(var(--compact-canvas-scale));
      transform-origin: top center;
    }
  }

  .usage-card {
    width: 548px;
    height: 260px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    &__data {
      width: 240px;
      padding: 24px;
    }

    &__chart {
      width: 308px;
      height: 260px;
    }
  }

  .business-case {
    width: 262px;
    position: relative;
    display: block;
    margin: 0;
    opacity: 1;
    transform: none;
    will-change: auto;

    &__card {
      height: 139.4px;
      gap: 16.79px;
      padding: 16.6px;
      border-radius: 10.08px;
    }

    &__quote {
      font-size: 11px;
      line-height: 16.79px;
    }

    &__profile {
      gap: 9.3px;

      :deep(.t-avatar),
      svg {
        width: 36.92px;
        height: 36.92px;
      }

      strong {
        font-size: 12px;
        line-height: 20px;
      }

      span {
        font-size: 10px;
        line-height: 18px;
      }
    }

    :deep(.t-tag) {
      height: 22.15px;
      padding: 0 7.38px;
      font-size: 11.07px;
      line-height: 18.45px;
    }

    &__prompt {
      width: 246.44px;
      min-width: 0;
      margin-top: -6.72px;
      padding: 3.36px 8px;
      border-radius: 6.72px;
      font-size: 9.8px;
      line-height: 16px;
    }

    &--1,
    &--2,
    &--3,
    &--4,
    &--5 {
      top: auto;
      left: auto;
    }

    &--1 {
      order: 2;
    }

    &--2 {
      order: 1;
    }

    &--3 {
      order: 3;
    }

    &--4 {
      order: 5;
    }

    &--5 {
      order: 4;
    }
  }
}

@media screen and (min-width: 596px) and (max-width: 959px) {
  .business-cases__heading {
    width: calc(100% - 48px);
  }
}

@media screen and (max-width: 596px) {
  .business-cases {
    height: var(--mobile-section-height);
    padding: 0;

    &__layout {
      width: 596px;
      position: absolute;
      top: 0;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 64px;
      padding: 120px 24px 60px;
      box-sizing: border-box;
      transform: translateX(-50%) scale(var(--mobile-layout-scale));
      transform-origin: top center;
    }

    &__heading {
      width: 540px;
      position: relative;
      top: auto;
      left: auto;
      padding: 0 24px;
      box-sizing: border-box;
      transform: none;

      h2 {
        font-size: 36px;
        line-height: 44px;
      }

      p {
        margin-top: 20px;
        font-size: 20px;
        line-height: 28px;
      }
    }

    &__canvas {
      width: 508px;
      height: auto;
      position: relative;
      top: auto;
      left: auto;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      gap: 24px;
      padding: 0;
      margin: 0;
      transform: none;
    }
  }

  .usage-card {
    width: 508px;
    height: 241.02px;
    position: relative;
    top: auto;
    left: auto;
    order: -1;
    flex-direction: row;
    border-radius: 14.83px;
    transform: none;

    &__data {
      width: 222.48px;
      min-height: 0;
      padding: 22.25px;

      p {
        margin-bottom: 18.54px;
        font-size: 14.83px;
        line-height: 22.25px;
      }
    }

    &__total {
      gap: 7.42px;

      strong {
        font-size: 51.91px;
        letter-spacing: -1.04px;
        line-height: 44.5px;
      }

      span {
        font-size: 14.83px;
        line-height: 22.25px;
      }
    }

    &__metrics {
      gap: 33.37px;
      padding-top: 11.12px;

      div {
        gap: 7.42px;
      }

      span {
        font-size: 11.12px;
        line-height: 18.54px;
      }

      strong {
        font-size: 18.54px;
        line-height: 18.54px;
      }

      small {
        margin-left: 3.71px;
        font-size: 11.12px;
      }
    }

    &__chart {
      width: 285.52px;
      height: 241.02px;

      &::after {
        height: 196.53px;
        top: 25.96px;
      }

      > svg {
        width: 285.52px;
        height: 196.53px;
        top: 25.96px;
      }
    }

    &__tooltip {
      top: 22.25px;
      left: 22.25px;

      strong {
        font-size: 12.98px;
        line-height: 20.39px;
      }

      span {
        font-size: 11.12px;
        line-height: 18.54px;
      }
    }

    &__grid {
      top: 22.25px;
      left: 22.25px;
      gap: 25.96px;

      span {
        width: 18.54px;
        height: 196.53px;
        font-size: 7.42px;
        line-height: 10.2px;
      }
    }

    &__marker {
      width: 9.27px;
      height: 9.27px;
      top: calc(25.96px + var(--hover-y));
    }
  }

  .business-case {
    width: 508px;
    position: relative;
    top: auto;
    left: auto;
    display: block;
    flex: none;
    margin: 0;
    opacity: 1;
    transform: none;

    &__card {
      height: 270.28px;
      justify-content: flex-start;
      gap: 32.56px;
      padding: 32.19px;
      border-radius: 19.54px;
    }

    &__quote {
      font-size: 19.54px;
      line-height: 32.56px;
    }

    &__profile {
      gap: 18.03px;

      :deep(.t-avatar),
      svg {
        width: 60.11px;
        height: 60.11px;
      }

      strong {
        font-size: 19.54px;
        line-height: 32.56px;
      }

      span {
        font-size: 16.28px;
        line-height: 29.3px;
      }
    }

    :deep(.t-tag) {
      height: 36.06px;
      padding: 0 12.02px;
      font-size: 18.03px;
      line-height: 30.05px;
    }

    &__prompt {
      width: 477.84px;
      min-width: 0;
      margin-top: -13.03px;
      padding: 6.51px 39.08px;
      border-radius: 13.03px;
      font-size: 17.91px;
      line-height: 30px;
    }

    &--1 {
      order: 2;
    }

    &--2 {
      order: 1;
    }

    &--3 {
      order: 3;
    }

    &--4 {
      order: 5;
    }

    &--5 {
      order: 4;
    }
  }

  .business-cases__canvas > .usage-card {
    flex-direction: row;
  }

  .business-cases__canvas > .business-case {
    display: block;
  }
}

@media screen and (max-width: 960px) {
  .business-cases__heading {
    top: 60px;
  }
}
</style>
