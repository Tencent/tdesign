<template>
  <section ref="businessCasesRef" class="business-cases">
    <header class="business-cases__heading">
      <h2>{{ t('home.businessCases.title') }}</h2>
      <p>{{ t('home.businessCases.description') }}</p>
    </header>

    <div class="business-cases__canvas">
      <article
        v-for="(item, index) in cases"
        :key="item.prompt"
        :class="['business-case', `business-case--${index + 1}`]"
        :style="getCaseStyle(item)"
      >
        <div class="business-case__card">
          <span class="business-case__noise" aria-hidden="true"></span>
          <p class="business-case__quote">{{ t('home.businessCases.quote') }}</p>
          <footer class="business-case__user">
            <div class="business-case__profile">
              <t-avatar size="40px" :alt="t('home.businessCases.user')">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <rect width="40" height="40" fill="#d9e1ff" />
                  <path fill="#fff" d="M11 7h18v3h3v20h-3v3H11v-3H8V10h3z" />
                  <path fill="#292929" d="M13 8h14v3h3v8H10v-8h3zm-3 8h4v8h-4zm16 0h4v9h-4z" />
                  <path fill="#f1b18b" d="M14 16h12v13H14zm-2 4h4v7h-4zm14 1h3v6h-3z" />
                  <path fill="#292929" d="M15 20h3v3h-3zm8 0h3v3h-3z" />
                  <path fill="#de806b" d="M18 26h6v2h-6z" />
                </svg>
              </t-avatar>
              <div>
                <strong>{{ t('home.businessCases.user') }}</strong>
                <span>{{ t('home.businessCases.role') }}</span>
              </div>
            </div>
            <t-tag size="medium" shape="round" :theme="item.theme" :variant="item.variant"> TEG </t-tag>
          </footer>
        </div>
        <p class="business-case__prompt">› {{ t(item.prompt) }}</p>
      </article>

      <article class="usage-card">
        <div class="usage-card__data">
          <div>
            <p>{{ t('home.businessCases.downloads') }}</p>
            <div class="usage-card__total">
              <strong>12.8</strong><span>{{ t('home.businessCases.tenThousandPlus') }}</span>
            </div>
          </div>
          <div class="usage-card__metrics">
            <div>
              <span>{{ t('home.businessCases.designReferences') }}</span>
              <strong
                >2,456<small>{{ t('home.businessCases.tenThousand') }}</small></strong
              >
            </div>
            <div>
              <span>{{ t('home.businessCases.projects') }}</span>
              <strong>3,826</strong>
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
            <span>09:14 GMT, 2026.08</span>
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
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { TdTagProps } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';

import homeMessages from '@/locales/pages/home';

const { t } = useI18n({ messages: homeMessages });

interface BusinessCase {
  prompt: string;
  theme: TdTagProps['theme'];
  variant: TdTagProps['variant'];
  spreadX: number;
  spreadY: number;
  rotation: number;
}

const cases: BusinessCase[] = [
  {
    prompt: 'home.businessCases.prompts.activity',
    theme: 'default',
    variant: 'light-outline',
    spreadX: 488,
    spreadY: 141,
    rotation: -7,
  },
  {
    prompt: 'home.businessCases.prompts.multiplatform',
    theme: 'primary',
    variant: 'light',
    spreadX: 527,
    spreadY: -172,
    rotation: -5,
  },
  {
    prompt: 'home.businessCases.prompts.enterprise',
    theme: 'warning',
    variant: 'light',
    spreadX: -505,
    spreadY: -151,
    rotation: 6,
  },
  {
    prompt: 'home.businessCases.prompts.d2c',
    theme: 'primary',
    variant: 'light',
    spreadX: -486,
    spreadY: 137,
    rotation: 6,
  },
  {
    prompt: 'home.businessCases.prompts.theme',
    theme: 'default',
    variant: 'light-outline',
    spreadX: 21,
    spreadY: -319,
    rotation: -4,
  },
];

const months = ['2026.04', '2026.05', '2026.06', '2026.07', '2026.08', '2026.09'];
const businessCasesRef = ref<HTMLElement | null>(null);
const usageLineRef = ref<SVGPathElement | null>(null);
const spreadProgress = ref(0);
const chartHoverX = ref(226);
const chartHoverY = ref(65);
let animationFrame: number | null = null;

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
    transform: translateX(-50%);
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
</style>
