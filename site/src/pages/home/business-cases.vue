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
              <t-tag size="medium" shape="round" :theme="item.theme" :variant="item.variant">
                {{ userTypeLabels[item.userType] }}
              </t-tag>
            </footer>
          </div>
          <p class="business-case__prompt">› {{ item.scene }}</p>
        </article>

        <article ref="usageCardRef" class="usage-card">
          <div class="usage-card__data">
            <div>
              <p>{{ t('home.businessCases.downloads') }}</p>
              <div class="usage-card__total">
                <strong>{{ animatedDownloadPerMonth }}</strong>
                <span>{{ animatedDownloadUnit }}</span>
              </div>
            </div>
            <div class="usage-card__metrics">
              <div>
                <span>{{ t('home.businessCases.designReferences') }}</span>
                <strong>
                  {{ animatedFigmaReferenceCount }}<small>{{ t('home.businessCases.tenThousand') }}</small>
                </strong>
              </div>
              <div>
                <span>{{ t('home.businessCases.projects') }}</span>
                <strong> {{ animatedProjectsCount }}<small>+</small> </strong>
              </div>
            </div>
          </div>
          <div
            class="usage-card__chart"
            :style="{ '--hover-x': `${chartHoverX}px`, '--hover-y': `${chartHoverY}px` }"
            @pointermove="handleChartPointerMove"
          >
            <div class="usage-card__tooltip">
              <strong>{{ t('home.businessCases.downloadTrend') }}</strong>
              <span>
                {{ hoveredDownloadMonth }}，{{ t('home.businessCases.downloadCount', { count: hoveredDownloadCount }) }}
              </span>
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
                <linearGradient id="business-cases-edge-fade">
                  <stop offset="0" stop-color="white" stop-opacity="0" />
                  <stop offset=".12" stop-color="white" />
                  <stop offset=".88" stop-color="white" />
                  <stop offset="1" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="business-cases-line-edge-fade">
                  <stop offset="0" stop-color="white" stop-opacity=".06" />
                  <stop offset=".14" stop-color="white" />
                  <stop offset=".86" stop-color="white" />
                  <stop offset="1" stop-color="white" stop-opacity=".06" />
                </linearGradient>
                <linearGradient id="business-cases-line-middle-fade">
                  <stop offset="0" stop-color="white" stop-opacity="0" />
                  <stop offset=".05" stop-color="white" stop-opacity="0" />
                  <stop offset=".25" stop-color="white" />
                  <stop offset=".75" stop-color="white" />
                  <stop offset=".95" stop-color="white" stop-opacity="0" />
                  <stop offset="1" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="business-cases-line-main-fade">
                  <stop offset="0" stop-color="white" stop-opacity="0" />
                  <stop offset=".14" stop-color="white" stop-opacity="0" />
                  <stop offset=".35" stop-color="white" />
                  <stop offset=".65" stop-color="white" />
                  <stop offset=".86" stop-color="white" stop-opacity="0" />
                  <stop offset="1" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <mask id="business-cases-chart-mask">
                  <rect width="308" height="212" fill="url(#business-cases-edge-fade)" />
                </mask>
                <mask id="business-cases-line-edge-mask">
                  <rect width="308" height="212" fill="url(#business-cases-line-edge-fade)" />
                </mask>
                <mask id="business-cases-line-middle-mask">
                  <rect width="308" height="212" fill="url(#business-cases-line-middle-fade)" />
                </mask>
                <mask id="business-cases-line-main-mask">
                  <rect width="308" height="212" fill="url(#business-cases-line-main-fade)" />
                </mask>
              </defs>
              <g mask="url(#business-cases-chart-mask)">
                <path v-if="chartAreaPath" class="usage-card__area" :d="chartAreaPath" />
              </g>
              <path
                v-if="chartLinePath"
                class="usage-card__line usage-card__line--edge"
                :d="chartLinePath"
                mask="url(#business-cases-line-edge-mask)"
              />
              <path
                v-if="chartLinePath"
                class="usage-card__line usage-card__line--middle"
                :d="chartLinePath"
                mask="url(#business-cases-line-middle-mask)"
              />
              <path
                v-if="chartLinePath"
                class="usage-card__line usage-card__line--main"
                :d="chartLinePath"
                mask="url(#business-cases-line-main-mask)"
              />
            </svg>
            <span v-if="chartLinePath" class="usage-card__marker" aria-hidden="true"></span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { TdTagProps } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';

import homeMessages from '@/locales/pages/home';

import { HOME_API_ENDPOINTS } from './api';
import { fallbackUsageData, getUsageData } from './usage-data';

const { locale, t } = useI18n({ messages: homeMessages });

type DeveloperUserType = 'contributor' | 'community' | 'enterprise';

interface DeveloperStory {
  content: string;
  nickname: string;
  position: string;
  avatar: string;
  scene: string;
  userType: DeveloperUserType;
}

interface BusinessCase extends DeveloperStory {
  theme: TdTagProps['theme'];
  variant: TdTagProps['variant'];
  spreadX: number;
  spreadY: number;
  rotation: number;
}

type BusinessCaseLayout = Pick<BusinessCase, 'theme' | 'variant' | 'spreadX' | 'spreadY' | 'rotation'>;

const userTypeLabels: Record<DeveloperUserType, string> = {
  contributor: '贡献者',
  community: '社区用户',
  enterprise: '企业用户',
};

const caseLayouts: BusinessCaseLayout[] = [
  {
    theme: 'default',
    variant: 'light-outline',
    spreadX: 488,
    spreadY: 141,
    rotation: -7,
  },
  {
    theme: 'primary',
    variant: 'light',
    spreadX: 527,
    spreadY: -172,
    rotation: -5,
  },
  {
    theme: 'warning',
    variant: 'light',
    spreadX: -505,
    spreadY: -151,
    rotation: 6,
  },
  {
    theme: 'primary',
    variant: 'light',
    spreadX: -486,
    spreadY: 137,
    rotation: 6,
  },
  {
    theme: 'default',
    variant: 'light-outline',
    spreadX: 21,
    spreadY: -319,
    rotation: -4,
  },
];

const cases = ref<BusinessCase[]>([]);
const businessCasesRef = ref<HTMLElement | null>(null);
const usageCardRef = ref<HTMLElement | null>(null);
const spreadProgress = ref(0);
const usageAnimationProgress = ref(0);
const canvasScale = ref('1');
const compactCanvasScale = ref('1');
const compactCanvasTop = ref('276px');
const compactCanvasHeight = ref('635px');
const compactSectionHeight = ref('971px');
const mobileLayoutScale = ref('1');
const mobileSectionHeight = ref('0px');
const chartHoverX = ref(226);
const chartHoverY = ref(65);
const usageData = ref(fallbackUsageData);
let animationFrame: number | null = null;
let usageAnimationFrame: number | null = null;
let usageObserver: IntersectionObserver | null = null;
let hasAnimatedUsage = false;
let spreadAnimationStartedAt: number | null = null;
let spreadAnimationFrom = 0;
let spreadAnimationTarget = 0;
let spreadLastViewportChangeAt = 0;
const SPREAD_SETTLE_DELAY = 180;
const SPREAD_ANIMATION_DURATION = 700;
const USAGE_ANIMATION_DURATION = 1200;
const CHART_WIDTH = 308;
const CHART_EDGE_INSET = 5;
const CHART_AXIS_START_X = 34;
const CHART_AXIS_END_X = 274;
const CHART_AXIS_TICK_COUNT = 6;
const CHART_AXIS_TICK_GAP = (CHART_AXIS_END_X - CHART_AXIS_START_X) / (CHART_AXIS_TICK_COUNT - 1);

interface ChartPoint {
  x: number;
  y: number;
}

const chartDownloads = computed(() => usageData.value.downloadsPerMonth.slice(-24));
const formatWithThousandsSeparator = (value: string | number) => {
  const normalizedValue = String(value).replace(/,/g, '');
  const match = normalizedValue.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return String(value);

  const [, sign, integer, fraction = ''] = match;
  return `${sign}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${fraction}`;
};
const downloadPerMonthTarget = computed(() => {
  const latestDownloads = chartDownloads.value.at(-1)?.totalDownloads;
  if (typeof latestDownloads === 'number') return latestDownloads;

  const fallbackValue = Number(usageData.value.downloadPerMonth.replace(/[,+]/g, ''));
  return fallbackValue * 10_000;
});
const figmaReferenceCountTarget = computed(() => {
  const value = Number(usageData.value.figmaReferenceCount.replace(/[,+]/g, ''));
  return locale.value.startsWith('en') ? value / 100 : value;
});
const projectsCountTarget = computed(() => Number(usageData.value.projectsCount.replace(/[,+]/g, '')));
const animatedDownloadCount = computed(() => downloadPerMonthTarget.value * usageAnimationProgress.value);
const animatedDownloadUnit = computed(() => {
  if (!locale.value.startsWith('en')) return t('home.businessCases.tenThousandPlus');
  return animatedDownloadCount.value >= 1_000_000 ? 'M' : 'K';
});
const animatedDownloadPerMonth = computed(() => {
  const count = animatedDownloadCount.value;
  if (locale.value.startsWith('en')) {
    const useMillions = count >= 1_000_000;
    return formatWithThousandsSeparator((count / (useMillions ? 1_000_000 : 1_000)).toFixed(useMillions ? 1 : 0));
  }
  return formatWithThousandsSeparator((count / 10_000).toFixed(chartDownloads.value.length > 0 ? 1 : 0));
});
const animatedFigmaReferenceCount = computed(() =>
  formatWithThousandsSeparator(
    (figmaReferenceCountTarget.value * usageAnimationProgress.value).toFixed(
      Number.isInteger(figmaReferenceCountTarget.value) ? 0 : 1,
    ),
  ),
);
const animatedProjectsCount = computed(() =>
  formatWithThousandsSeparator(Math.round(projectsCountTarget.value * usageAnimationProgress.value)),
);
const chartLabelIndices = computed(() => {
  const downloads = chartDownloads.value;
  if (downloads.length === 0) return [];

  const lastLabelIndex = Math.max(0, downloads.length - 3);
  const firstLabelIndex = Math.min(2, lastLabelIndex);
  const labelCount = Math.min(CHART_AXIS_TICK_COUNT, lastLabelIndex - firstLabelIndex + 1);

  return Array.from({ length: labelCount }, (_, index) =>
    labelCount === 1
      ? firstLabelIndex
      : Math.round(firstLabelIndex + (index / (labelCount - 1)) * (lastLabelIndex - firstLabelIndex)),
  );
});
const months = computed(() =>
  chartLabelIndices.value.map((downloadIndex) => chartDownloads.value[downloadIndex].month.replace('-', '.')),
);
const chartPoints = computed<ChartPoint[]>(() => {
  const downloads = chartDownloads.value;
  if (downloads.length < 2) return [];

  const values = downloads.map((item) => item.totalDownloads);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const labelIndices = chartLabelIndices.value;
  const canAlignWithAxis =
    labelIndices.length >= 2 && labelIndices[0] > 0 && labelIndices[labelIndices.length - 1] < values.length - 1;
  const anchorIndices = canAlignWithAxis ? [0, ...labelIndices, values.length - 1] : [];
  const axisAnchorXs = labelIndices.map((_, index) => CHART_AXIS_START_X + index * CHART_AXIS_TICK_GAP);
  const anchorXs = canAlignWithAxis ? [CHART_EDGE_INSET, ...axisAnchorXs, CHART_WIDTH - CHART_EDGE_INSET] : [];

  return values.map((value, index) => {
    let x = CHART_EDGE_INSET + (index / (values.length - 1)) * (CHART_WIDTH - CHART_EDGE_INSET * 2);

    if (canAlignWithAxis) {
      let upperLabelPosition = anchorIndices.findIndex((anchorIndex) => anchorIndex >= index);
      if (upperLabelPosition === -1) upperLabelPosition = anchorIndices.length - 1;
      if (upperLabelPosition < 1) upperLabelPosition = 1;

      const lowerLabelPosition = upperLabelPosition - 1;
      const lowerIndex = anchorIndices[lowerLabelPosition];
      const upperIndex = anchorIndices[upperLabelPosition];
      const segmentProgress = (index - lowerIndex) / (upperIndex - lowerIndex);
      x =
        anchorXs[lowerLabelPosition] + segmentProgress * (anchorXs[upperLabelPosition] - anchorXs[lowerLabelPosition]);
    }

    return {
      x,
      y: 160 - ((value - min) / range) * 140,
    };
  });
});

function createSmoothPath(points: ChartPoint[]): string {
  if (points.length < 2) return '';

  return points.slice(0, -1).reduce((path, point, index) => {
    const previous = points[index - 1] ?? point;
    const next = points[index + 1];
    if (!next) return path;
    const following = points[index + 2] ?? next;
    const control1X = point.x + (next.x - previous.x) / 6;
    const control1Y = point.y + (next.y - previous.y) / 6;
    const control2X = next.x - (following.x - point.x) / 6;
    const control2Y = next.y - (following.y - point.y) / 6;
    return `${path} C${control1X} ${control1Y} ${control2X} ${control2Y} ${next.x} ${next.y}`;
  }, `M${points[0].x} ${points[0].y}`);
}

const chartLinePath = computed(() => createSmoothPath(chartPoints.value));
const chartAreaPath = computed(() => (chartLinePath.value ? `${chartLinePath.value} L308 212 L0 212 Z` : ''));
const hoveredDownloadIndex = ref(0);
const hoveredDownloadMonth = computed(
  () => chartDownloads.value[hoveredDownloadIndex.value]?.month.replace('-', '.') ?? '',
);
const hoveredDownloadCount = computed(() => {
  const count = chartDownloads.value[hoveredDownloadIndex.value]?.totalDownloads;
  return typeof count === 'number' ? String(count) : '';
});

function isDeveloperStory(value: unknown): value is DeveloperStory {
  if (!value || typeof value !== 'object') return false;
  const story = value as Record<string, unknown>;
  const hasRequiredText = ['content', 'nickname', 'position', 'avatar', 'scene'].every(
    (key) => typeof story[key] === 'string',
  );
  return hasRequiredText && ['contributor', 'community', 'enterprise'].includes(story.userType as string);
}

async function getDeveloperStories(): Promise<void> {
  try {
    const response = await fetch(HOME_API_ENDPOINTS.developerStories);
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
  const points = chartPoints.value;
  if (points.length === 0) return;

  const chartRect = chart.getBoundingClientRect();
  const localX = ((event.clientX - chartRect.left) / chartRect.width) * CHART_WIDTH;
  const targetX = Math.min(CHART_WIDTH, Math.max(0, localX));
  const targetIndex = points.reduce(
    (closestIndex, point, index) =>
      Math.abs(point.x - targetX) < Math.abs(points[closestIndex].x - targetX) ? index : closestIndex,
    0,
  );
  const point = points[targetIndex];

  hoveredDownloadIndex.value = targetIndex;
  chartHoverX.value = point.x;
  chartHoverY.value = point.y;
}

function setDefaultChartHover(): void {
  const defaultIndex = Math.max(0, chartDownloads.value.length - 2);
  const defaultPoint = chartPoints.value[defaultIndex];

  hoveredDownloadIndex.value = defaultIndex;
  if (defaultPoint) {
    chartHoverX.value = defaultPoint.x;
    chartHoverY.value = defaultPoint.y;
  }
}

function startUsageAnimation(): void {
  if (hasAnimatedUsage) return;
  hasAnimatedUsage = true;
  usageObserver?.disconnect();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    usageAnimationProgress.value = 1;
    return;
  }

  const startedAt = performance.now();
  const update = (timestamp: number) => {
    const progress = Math.min(1, (timestamp - startedAt) / USAGE_ANIMATION_DURATION);
    usageAnimationProgress.value = 1 - (1 - progress) ** 3;

    if (progress < 1) {
      usageAnimationFrame = window.requestAnimationFrame(update);
    } else {
      usageAnimationProgress.value = 1;
      usageAnimationFrame = null;
    }
  };

  usageAnimationFrame = window.requestAnimationFrame(update);
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

function updateSpreadProgress(timestamp = performance.now()): void {
  animationFrame = null;

  if (businessCasesRef.value) {
    const sectionWidth = businessCasesRef.value.clientWidth;
    const scale = Math.min(1, Math.max(1200 / 1440, sectionWidth / 1440));
    const compactScale = Math.min(1200 / 1060, Math.max(1, window.innerWidth / 1060));
    const canvasHeight = window.innerWidth >= 882 ? 635 : 813;
    const heading = businessCasesRef.value.querySelector<HTMLElement>('.business-cases__heading');
    const canvas = businessCasesRef.value.querySelector<HTMLElement>('.business-cases__canvas');
    const headingCanvasGap = window.innerWidth < 960 ? 24 : 64;
    const canvasTop = heading ? heading.offsetTop + heading.offsetHeight + headingCanvasGap : 212 + headingCanvasGap;
    const canvasLayoutHeight = window.innerWidth < 960 ? canvas?.offsetHeight ?? canvasHeight : canvasHeight;

    canvasScale.value = scale.toFixed(4);
    compactCanvasScale.value = compactScale.toFixed(4);
    compactCanvasTop.value = `${canvasTop}px`;
    compactCanvasHeight.value = `${canvasHeight}px`;
    const compactBottomSpacing = 60;
    compactSectionHeight.value = `${canvasTop + canvasLayoutHeight * compactScale + compactBottomSpacing}px`;

    const mobileScale = Math.min(1, window.innerWidth / 596);
    const mobileLayout = businessCasesRef.value.querySelector<HTMLElement>('.business-cases__layout');
    mobileLayoutScale.value = mobileScale.toFixed(4);
    mobileSectionHeight.value = `${
      (mobileLayout?.offsetHeight ?? 0) - (canvas?.offsetHeight ?? 0) * (1 - mobileScale)
    }px`;
  }

  if (!businessCasesRef.value) return;

  const sectionTop = businessCasesRef.value.getBoundingClientRect().top;
  const animationTrigger = window.innerHeight * 0.28;
  const nextTarget = sectionTop <= animationTrigger ? 1 : 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    spreadProgress.value = nextTarget;
    spreadAnimationTarget = nextTarget;
    spreadAnimationStartedAt = null;
    return;
  }

  if (nextTarget === 1 && spreadAnimationTarget === 0 && timestamp - spreadLastViewportChangeAt < SPREAD_SETTLE_DELAY) {
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

  if (progress < 1) {
    animationFrame = window.requestAnimationFrame(updateSpreadProgress);
  } else {
    spreadProgress.value = spreadAnimationTarget;
    spreadAnimationStartedAt = null;
  }
}

function scheduleSpreadUpdate(): void {
  spreadLastViewportChangeAt = performance.now();
  if (animationFrame === null) {
    animationFrame = window.requestAnimationFrame(updateSpreadProgress);
  }
}

onMounted(() => {
  getDeveloperStories();
  getUsageData().then((data) => {
    usageData.value = data;
    setDefaultChartHover();
  });
  usageObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) startUsageAnimation();
    },
    { rootMargin: '-20% 0px -20% 0px' },
  );
  if (usageCardRef.value) usageObserver.observe(usageCardRef.value);
  scheduleSpreadUpdate();
  window.addEventListener('scroll', scheduleSpreadUpdate, { passive: true });
  window.addEventListener('resize', scheduleSpreadUpdate);
});

onBeforeUnmount(() => {
  usageObserver?.disconnect();
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
  if (usageAnimationFrame !== null) window.cancelAnimationFrame(usageAnimationFrame);
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
  --case-tint: #dcdcdc;
  --case-text: rgba(0, 0, 0, 0.6);
  --case-title: rgba(0, 0, 0, 0.9);
  --case-meta: rgba(0, 0, 0, 0.4);
  --case-noise-color: #fff;
  opacity: var(--spread-opacity);
  transform: rotate(var(--spread-rotation));
  transform-origin: center;

  &__card {
    height: 180px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    padding: 23.75px;
    overflow: hidden;
    isolation: isolate;
    box-sizing: border-box;
    border: 0.25px solid var(--component-border);
    border-radius: 16px;
    background: var(--bg-color-card);
    color: var(--case-title);
    backdrop-filter: blur(2px);
  }

  &__noise {
    position: absolute;
    z-index: 0;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(ellipse 121% 121% at 50% -21%, transparent 0%, var(--case-tint) 85%);
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--case-noise-color);
      opacity: var(--case-noise-opacity, 1);
      mask-image: url("data:image/svg+xml,%3Csvg width='180' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0' width='100%25' height='100%25' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='.25 .5'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      mask-size: 180px 180px;
      mask-repeat: repeat;
      mask-mode: alpha;
    }
  }

  &__quote {
    z-index: 1;
    margin: 0;
    color: var(--case-text);
    font-size: 14px;
    line-height: 22px;
  }

  &__user {
    z-index: 1;
    display: flex;
    flex-shrink: 0;
    align-items: flex-end;
    justify-content: space-between;
    overflow: hidden;
  }

  &__profile {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;

    :deep(.t-avatar) {
      flex: none;
    }

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
      color: var(--case-title);
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
    }

    span {
      color: var(--case-meta);
      font-size: 12px;
      line-height: 20px;
    }
  }

  :deep(.t-tag) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 0;
    border-radius: 999px;
    padding-top: 0;
    padding-bottom: 0;
    background: var(--bg-color-container);
    font-weight: 400;
    line-height: 1;
  }

  :deep(.t-tag > span) {
    height: 100%;
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }

  &__prompt {
    width: fit-content;
    min-width: 84%;
    position: relative;
    z-index: 2;
    margin: -8px auto 0;
    padding: 6px 10px;
    box-sizing: border-box;
    border: 0.25px solid var(--component-border);
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

  &--2,
  &--3,
  &--4 {
    .business-case__noise {
      background: radial-gradient(ellipse 122% 123% at 50% -22%, rgba(255, 255, 255, 0) 0%, var(--case-tint) 85%);
    }
  }

  &--2 {
    top: 342px;
    left: 59px;
    --case-rotation: -5deg;
    --case-tint: #d9e1ff;
  }

  &--3 {
    top: 321px;
    left: 1091px;
    --case-rotation: 6deg;
    --case-tint: #ffd9c2;
  }

  &--4 {
    top: 33px;
    left: 1072px;
    --case-rotation: 6deg;
    --case-tint: #d9e1ff;
  }

  &--5 {
    top: 489px;
    left: 565px;
    --case-rotation: -4deg;
  }
}

:global(:root[theme-mode='dark'] .business-case) {
  --case-tint: rgba(255, 255, 255, 0.14);
  --case-text: rgba(255, 255, 255, 0.7);
  --case-title: rgba(255, 255, 255, 0.9);
  --case-meta: rgba(255, 255, 255, 0.5);
  --case-noise-color: #000;
  --case-noise-opacity: 0.12;
}

:global(:root[theme-mode='dark'] .business-case--2),
:global(:root[theme-mode='dark'] .business-case--4) {
  --case-tint: rgba(69, 130, 230, 0.24);
}

:global(:root[theme-mode='dark'] .business-case--3) {
  --case-tint: rgba(207, 110, 45, 0.24);
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
  border: 0.5px solid var(--component-border);
  border-radius: 16px;
  box-sizing: border-box;
  background: var(--bg-color-card);
  color: var(--text-primary);
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.04);

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
      font-weight: 300;
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
    border-top: 0.5px solid var(--bg-color-data);

    > div {
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
      font-weight: 300;
      line-height: 20px;
      white-space: nowrap;
    }

    small {
      display: inline-block;
      margin-left: 4px;
      font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      vertical-align: bottom;
    }
  }

  &__chart {
    width: 308px;
    position: relative;
    overflow: hidden;

    &::after {
      width: 2px;
      height: 193px;
      position: absolute;
      z-index: 2;
      top: 24px;
      left: var(--hover-x);
      transform: translateX(-50%);
      background: var(--text-primary);
      content: '';
      opacity: 1;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    > svg {
      width: 308px;
      height: 212px;
      position: absolute;
      z-index: 1;
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
      font-family: 'TCloudNumberLight', sans-serif;
      font-size: 10px;
      font-weight: 300;
      line-height: 16px;
    }
  }

  &__grid {
    position: absolute;
    z-index: 0;
    top: 24px;
    left: 24px;
    display: flex;
    gap: 28px;

    span {
      width: 20px;
      height: 212px;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      box-sizing: border-box;
      color: var(--text-placeholder);
      font-family: 'TCloudNumberLight', sans-serif;
      font-size: 8px;
      line-height: 11px;
      writing-mode: horizontal-tb;

      &::before {
        position: absolute;
        top: 0;
        bottom: 19px;
        left: 50%;
        width: 1px;
        background: repeating-linear-gradient(to bottom, var(--component-border) 0 3px, transparent 3px 8px);
        content: '';
        transform: translateX(-50%) scaleX(0.5);
        transform-origin: center;
      }
    }
  }

  &__area {
    fill: url(#business-cases-area);
  }

  &__line {
    fill: none;
    stroke: var(--text-primary);
    stroke-linecap: round;
    stroke-linejoin: round;

    &--edge {
      stroke-width: 0.3;
    }

    &--middle {
      stroke-width: 0.75;
    }

    &--main {
      stroke-width: 1.5;
    }
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
    opacity: 1;
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

@media screen and (min-width: 1201px) {
  .business-case {
    margin-top: var(--spread-translate-y);
    margin-left: var(--spread-translate-x);
  }
}

@media (prefers-reduced-motion: reduce) {
  .business-case {
    margin: 0;
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

@media screen and (max-width: 1200px) {
  .business-case__prompt {
    display: none;
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
      padding-top: 296px;
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
      line-height: 1;
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
      width: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 60px 24px;
      box-sizing: border-box;
      transform: translateX(-50%);
    }

    &__heading {
      width: min(540px, 100%);
      position: relative;
      top: auto;
      left: auto;
      transform: none;

      h2 {
        font-size: 36px;
        line-height: 44px;
      }

      p {
        margin: 12px 0 24px;
        font-size: 20px;
        line-height: 28px;
      }
    }

    &__canvas {
      width: 508px;
      height: auto;
      flex: none;
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
      transform: scale(var(--mobile-layout-scale));
      transform-origin: top center;
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
    margin-bottom: 12px;
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

      > div {
        gap: 7.42px;
      }

      span {
        font-size: 12px;
        line-height: 20px;
      }

      strong {
        font-size: 18.54px;
        line-height: 18.54px;
      }

      small {
        margin-left: 3.71px;
        font-size: 12px;
        line-height: 18px;
      }
    }

    &__chart {
      width: 285.52px;
      height: 241.02px;

      &::after {
        height: 178.33px;
        top: 22.25px;
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

        &::before {
          bottom: 18.2px;
        }
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
      line-height: 1;
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

@media screen and (max-width: 959px) {
  .business-cases__canvas {
    height: auto;
  }

  .business-cases__heading {
    h2 {
      font-size: 28px;
      line-height: 36px;
    }

    p {
      margin-top: 12px;
      font-size: 12px;
      line-height: 20px;
    }
  }
}

@media screen and (min-width: 596px) and (max-width: 959px) {
  .business-cases__heading {
    top: 60px;
  }
}
</style>
