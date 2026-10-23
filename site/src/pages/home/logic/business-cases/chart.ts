import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

import { getUsageData, type UsageData } from '../../services/usage-data';

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

interface BusinessCasesChartOptions {
  locale: Ref<string>;
  translate: (key: 'home.businessCases.tenThousandPlus') => string;
}

function formatWithThousandsSeparator(value: string | number): string {
  const normalizedValue = String(value).replace(/,/g, '');
  const match = normalizedValue.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return String(value);

  const [, sign, integer, fraction = ''] = match;
  return `${sign}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${fraction}`;
}

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

export function createBusinessCasesChart({ locale, translate }: BusinessCasesChartOptions) {
  const usageCardRef = ref<HTMLElement | null>(null);
  const usageData = ref<UsageData>();
  const usageAnimationProgress = ref(0);
  const chartHoverX = ref(226);
  const chartHoverY = ref(65);
  const hoveredDownloadIndex = ref(0);
  let usageAnimationFrame: number | null = null;
  let usageObserver: IntersectionObserver | null = null;
  let hasAnimatedUsage = false;
  let isActive = true;

  const chartDownloads = computed(() => usageData.value?.downloadsPerMonth.slice(-24) ?? []);
  const downloadPerMonthTarget = computed(() => {
    const latestDownloads = chartDownloads.value.at(-1)?.totalDownloads;
    if (typeof latestDownloads === 'number') return latestDownloads;
    return Number(usageData.value?.downloadPerMonth.replace(/[,+]/g, '') ?? 0) * 10_000;
  });
  const figmaReferenceCountTarget = computed(() => {
    const value = Number(usageData.value?.figmaReferenceCount.replace(/[,+]/g, '') ?? 0);
    return locale.value.startsWith('en') ? value / 100 : value;
  });
  const projectsCountTarget = computed(() => Number(usageData.value?.projectsCount.replace(/[,+]/g, '') ?? 0));
  const animatedDownloadCount = computed(() => downloadPerMonthTarget.value * usageAnimationProgress.value);
  const animatedDownloadUnit = computed(() => {
    if (!locale.value.startsWith('en')) return translate('home.businessCases.tenThousandPlus');
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
    const range = Math.max(...values) - min || 1;
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
          anchorXs[lowerLabelPosition] +
          segmentProgress * (anchorXs[upperLabelPosition] - anchorXs[lowerLabelPosition]);
      }
      return { x, y: 160 - ((value - min) / range) * 140 };
    });
  });
  const chartLinePath = computed(() => createSmoothPath(chartPoints.value));
  const chartAreaPath = computed(() => (chartLinePath.value ? `${chartLinePath.value} L308 212 L0 212 Z` : ''));
  const hoveredDownloadMonth = computed(
    () => chartDownloads.value[hoveredDownloadIndex.value]?.month.replace('-', '.') ?? '',
  );
  const hoveredDownloadCount = computed(() => {
    const count = chartDownloads.value[hoveredDownloadIndex.value]?.totalDownloads;
    return typeof count === 'number' ? String(count) : '';
  });

  function setDefaultChartHover(): void {
    const defaultIndex = Math.max(0, chartDownloads.value.length - 2);
    const defaultPoint = chartPoints.value[defaultIndex];
    hoveredDownloadIndex.value = defaultIndex;
    if (defaultPoint) {
      chartHoverX.value = defaultPoint.x;
      chartHoverY.value = defaultPoint.y;
    }
  }

  function handleChartPointerMove(event: PointerEvent): void {
    const points = chartPoints.value;
    if (points.length === 0) return;

    const chartRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const localX = ((event.clientX - chartRect.left) / chartRect.width) * CHART_WIDTH;
    const targetX = Math.min(CHART_WIDTH, Math.max(0, localX));
    const targetIndex = points.reduce(
      (closestIndex, point, index) =>
        Math.abs(point.x - targetX) < Math.abs(points[closestIndex].x - targetX) ? index : closestIndex,
      0,
    );
    hoveredDownloadIndex.value = targetIndex;
    chartHoverX.value = points[targetIndex].x;
    chartHoverY.value = points[targetIndex].y;
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
      if (progress < 1) usageAnimationFrame = window.requestAnimationFrame(update);
      else {
        usageAnimationProgress.value = 1;
        usageAnimationFrame = null;
      }
    };
    usageAnimationFrame = window.requestAnimationFrame(update);
  }

  onMounted(() => {
    getUsageData()
      .then((data) => {
        if (!isActive) return;
        usageData.value = data;
        setDefaultChartHover();
      })
      .catch(() => {
        if (isActive) usageData.value = undefined;
      });
    usageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startUsageAnimation();
      },
      { rootMargin: '-20% 0px -20% 0px' },
    );
    if (usageCardRef.value) usageObserver.observe(usageCardRef.value);
  });

  onBeforeUnmount(() => {
    isActive = false;
    usageObserver?.disconnect();
    if (usageAnimationFrame !== null) window.cancelAnimationFrame(usageAnimationFrame);
  });

  return {
    usageCardRef,
    animatedDownloadPerMonth,
    animatedDownloadUnit,
    animatedFigmaReferenceCount,
    animatedProjectsCount,
    months,
    chartLinePath,
    chartAreaPath,
    chartHoverX,
    chartHoverY,
    hoveredDownloadMonth,
    hoveredDownloadCount,
    handleChartPointerMove,
  };
}
