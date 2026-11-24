import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

import { HOME_API_ENDPOINTS } from '../services/api';
import { getUsageData, type UsageData } from '../services/usage-data';

export interface LogoItem {
  name: string;
  src: string;
  height?: number;
}

const MOBILE_BREAKPOINT = 494;
const COMPACT_BREAKPOINT = 700;
const TABLET_BREAKPOINT = 960;
const DESKTOP_BREAKPOINT = 1200;
const DESKTOP_LOGO_HEIGHT = 88;
const TABLET_LOGO_HEIGHT = 70;
const MOBILE_LOGO_HEIGHT = 36;
const LOGO_ROW_GAP = 16;
const STATS_ANIMATION_DURATION = 1200;

function isLogoItem(item: unknown): item is LogoItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as LogoItem).src === 'string' &&
    typeof (item as LogoItem).name === 'string'
  );
}

async function getBrandList(): Promise<LogoItem[]> {
  const response = await fetch(HOME_API_ENDPOINTS.brandList);
  if (!response.ok) return [];

  const data: unknown = await response.json();
  return Array.isArray(data) ? data.filter(isLogoItem) : [];
}

function parseStatValue(value: string): number {
  const numericValue = Number(value.replace(/,/g, ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function formatStatValue(value: number, target: number): string {
  const fractionDigits = Number.isInteger(target) ? 0 : 1;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function createIndustryCasesModel(locale: Readonly<Ref<string>>) {
  const brandList = ref<LogoItem[]>([]);
  const usageData = ref<UsageData>();
  const statsRef = ref<HTMLElement | null>(null);
  const animatedStatValues = ref([0, 0, 0]);
  const viewportWidth = ref(typeof window === 'undefined' ? TABLET_BREAKPOINT : window.innerWidth);

  let statsObserver: IntersectionObserver | null = null;
  let statsAnimationFrame: number | null = null;
  let hasAnimatedStats = false;
  let isMounted = false;

  const logoScale = computed(() => {
    const tabletScale = TABLET_LOGO_HEIGHT / DESKTOP_LOGO_HEIGHT;
    const mobileScale = MOBILE_LOGO_HEIGHT / DESKTOP_LOGO_HEIGHT;

    if (viewportWidth.value >= DESKTOP_BREAKPOINT) return 1;
    if (viewportWidth.value >= TABLET_BREAKPOINT) {
      const progress = (viewportWidth.value - TABLET_BREAKPOINT) / (DESKTOP_BREAKPOINT - TABLET_BREAKPOINT);
      return tabletScale + progress * (1 - tabletScale);
    }
    if (viewportWidth.value >= COMPACT_BREAKPOINT) return tabletScale;
    if (viewportWidth.value <= MOBILE_BREAKPOINT) return mobileScale;

    const progress = (viewportWidth.value - MOBILE_BREAKPOINT) / (COMPACT_BREAKPOINT - MOBILE_BREAKPOINT);
    return mobileScale + progress * (tabletScale - mobileScale);
  });
  const logoRowCount = computed(() => (viewportWidth.value <= MOBILE_BREAKPOINT ? 4 : 3));
  const logoRows = computed(() =>
    brandList.value.reduce<LogoItem[][]>(
      (rows, logo, index) => {
        rows[index % rows.length].push(logo);
        return rows;
      },
      Array.from({ length: logoRowCount.value }, () => []),
    ),
  );
  const logoItemHeight = computed(() => DESKTOP_LOGO_HEIGHT * logoScale.value);
  const logoItemPadding = computed(() => 40 * logoScale.value);
  const logoItemRadius = computed(() => 14 * logoScale.value);
  const logoRowStep = computed(() => logoItemHeight.value + LOGO_ROW_GAP);
  const logoMarqueeHeight = computed(
    () => logoItemHeight.value * logoRowCount.value + LOGO_ROW_GAP * (logoRowCount.value - 1),
  );

  const stats = computed(() => [
    {
      target: parseStatValue(usageData.value?.projectsCount ?? '0'),
      unitKey: 'home.service.stats.projectsUnit',
      labelKey: 'home.service.stats.projects',
    },
    {
      target: parseStatValue(usageData.value?.enterpriseCustomersCount ?? '0'),
      unitKey: 'home.service.stats.teamsUnit',
      labelKey: 'home.service.stats.teams',
    },
    {
      target: parseStatValue(usageData.value?.downloadPerMonth ?? '0') / (locale.value.startsWith('en') ? 100 : 1),
      unitKey: 'home.service.stats.downloadsUnit',
      labelKey: 'home.service.stats.downloads',
    },
  ]);

  function handleResize(): void {
    viewportWidth.value = window.innerWidth;
  }

  function startStatsAnimation(): void {
    if (hasAnimatedStats) return;
    hasAnimatedStats = true;
    statsObserver?.disconnect();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatedStatValues.value = stats.value.map((stat) => stat.target);
      return;
    }

    const startedAt = performance.now();
    const update = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startedAt) / STATS_ANIMATION_DURATION);
      const easedProgress = 1 - (1 - progress) ** 3;
      const targets = stats.value.map((stat) => stat.target);
      animatedStatValues.value = targets.map((target) => target * easedProgress);

      if (progress < 1) {
        statsAnimationFrame = window.requestAnimationFrame(update);
      } else {
        animatedStatValues.value = targets;
        statsAnimationFrame = null;
      }
    };

    statsAnimationFrame = window.requestAnimationFrame(update);
  }

  onMounted(async () => {
    isMounted = true;
    window.addEventListener('resize', handleResize);
    statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startStatsAnimation();
      },
      { rootMargin: '-20% 0px -20% 0px' },
    );
    if (statsRef.value) statsObserver.observe(statsRef.value);

    try {
      const data = await getUsageData();
      if (!isMounted) return;

      usageData.value = data;
      if (hasAnimatedStats && statsAnimationFrame === null) {
        animatedStatValues.value = stats.value.map((stat) => stat.target);
      }
    } catch {
      if (isMounted) usageData.value = undefined;
    }

    if (!isMounted) return;

    try {
      const logos = await getBrandList();
      if (isMounted) brandList.value = logos;
    } catch {
      if (isMounted) brandList.value = [];
    }
  });

  onBeforeUnmount(() => {
    isMounted = false;
    statsObserver?.disconnect();
    if (statsAnimationFrame !== null) window.cancelAnimationFrame(statsAnimationFrame);
    window.removeEventListener('resize', handleResize);
  });

  return {
    animatedStatValues,
    formatStatValue,
    logoItemHeight,
    logoItemPadding,
    logoItemRadius,
    logoMarqueeHeight,
    logoRows,
    logoRowStep,
    logoScale,
    stats,
    statsRef,
  };
}
