<template>
  <section class="industry-cases">
    <div class="industry-cases__content">
      <header class="industry-cases__heading">
        <h2>{{ t('home.service.title') }}</h2>
        <p>{{ t('home.service.description') }}</p>
      </header>

      <div class="logo-marquee" :style="{ height: `${logoMarqueeHeight}px` }">
        <div
          v-for="(row, rowIndex) in logoRows"
          :key="rowIndex"
          :class="['logo-marquee__row', `logo-marquee__row--${rowIndex + 1}`]"
          :style="{ top: `${rowIndex * logoRowStep}px` }"
        >
          <div v-for="copyIndex in 2" :key="copyIndex" class="logo-marquee__track">
            <div
              v-for="logo in row"
              :key="logo.name"
              class="logo-marquee__item"
              :style="{
                height: `${logoItemHeight}px`,
                padding: `0 ${logoItemPadding}px`,
                borderRadius: `${logoItemRadius}px`,
              }"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                :style="{ height: `${(logo.height || 36) * logoScale}px` }"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div class="logo-marquee__fade logo-marquee__fade--left"></div>
        <div class="logo-marquee__fade logo-marquee__fade--right"></div>
      </div>
    </div>

    <div class="industry-cases__stats">
      <div v-for="stat in stats" :key="stat.labelKey" class="industry-cases__stat">
        <div class="industry-cases__value">
          <strong>{{ stat.value }}</strong>
          <span>{{ t(stat.unitKey) }}</span>
        </div>
        <p>{{ t(stat.labelKey) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import homeMessages from '@/locales/pages/home';

import { HOME_API_ENDPOINTS } from './api';
import { fallbackUsageData, getUsageData } from './usage-data';

interface LogoItem {
  name: string;
  src: string;
  height?: number;
}

const { locale, t } = useI18n({ messages: homeMessages });

const MOBILE_BREAKPOINT = 494;
const COMPACT_BREAKPOINT = 700;
const TABLET_BREAKPOINT = 960;
const DESKTOP_BREAKPOINT = 1200;
const DESKTOP_LOGO_HEIGHT = 88;
const TABLET_LOGO_HEIGHT = 70;
const MOBILE_LOGO_HEIGHT = 36;
const LOGO_ROW_GAP = 16;

const brandList = ref<LogoItem[]>([]);
const usageData = ref(fallbackUsageData);
const viewportWidth = ref(typeof window === 'undefined' ? TABLET_BREAKPOINT : window.innerWidth);
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

function handleResize(): void {
  viewportWidth.value = window.innerWidth;
}

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  usageData.value = await getUsageData();

  try {
    const response = await fetch(HOME_API_ENDPOINTS.brandList);
    if (!response.ok) return;

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return;

    brandList.value = data.filter(
      (item): item is LogoItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as LogoItem).src === 'string' &&
        typeof (item as LogoItem).name === 'string',
    );
  } catch {
    brandList.value = [];
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

function formatDownloads(value: string): string {
  if (!locale.value.startsWith('en')) return value;

  const numericValue = Number(value.replace(/,/g, ''));
  if (!Number.isFinite(numericValue)) return value;

  return new Intl.NumberFormat(locale.value, { maximumFractionDigits: 1 }).format(numericValue / 100);
}

const stats = computed(() => [
  {
    value: usageData.value.projectsCount,
    unitKey: 'home.service.stats.projectsUnit',
    labelKey: 'home.service.stats.projects',
  },
  {
    value: usageData.value.enterpriseCustomersCount,
    unitKey: 'home.service.stats.teamsUnit',
    labelKey: 'home.service.stats.teams',
  },
  {
    value: formatDownloads(usageData.value.downloadPerMonth),
    unitKey: 'home.service.stats.downloadsUnit',
    labelKey: 'home.service.stats.downloads',
  },
]);
</script>

<style scoped lang="less">
@keyframes industry-marquee-left {
  to {
    transform: translateX(-50%);
  }
}

@keyframes industry-marquee-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

.industry-cases {
  width: 100%;
  padding-top: 120px;
  overflow: hidden;
  color: var(--text-primary);
  background: var(--bg-color-demo);

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 72px;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: min(888px, calc(100% - 48px));
    text-align: center;

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 36px;
      font-weight: 600;
      line-height: 44px;
    }

    p {
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 300;
      line-height: 28px;
    }
  }

  &__stats {
    --industry-grid-color: rgba(0, 0, 0, 0.06);

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 160px;
    min-height: 388px;
    margin-top: 0;

    &::before {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(to right, var(--industry-grid-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--industry-grid-color) 1px, transparent 1px);
      background-position: center;
      background-size: 80px 80px;
      mask-image: linear-gradient(to right, transparent, #000 24%, #000 76%, transparent),
        linear-gradient(to bottom, transparent, #000 24%, #000 48%, transparent);
      mask-composite: intersect;
      pointer-events: none;
      content: '';
    }
  }

  &__stat {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    > p {
      width: 100%;
      margin: 0;
      overflow: hidden;
      color: var(--text-secondary);
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      text-overflow: clip;
      white-space: nowrap;
      text-align: center;
    }
  }

  &__value {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    height: 56px;
    white-space: nowrap;

    strong {
      font-family: TCloudNumberDigits, 'DIN Alternate', 'Roboto Mono', sans-serif;
      font-size: 52px;
      font-weight: 400;
      line-height: 56px;
    }

    span {
      font-size: 40px;
      font-weight: 300;
      line-height: 52px;
    }
  }
}

.logo-marquee {
  position: relative;
  width: 100%;
  height: 296px;
  overflow: hidden;

  &__row {
    position: absolute;
    left: 0;
    display: flex;
    gap: 16px;
    width: max-content;
    will-change: transform;

    &:hover {
      animation-play-state: paused;
    }

    &--1 {
      animation: industry-marquee-left 42s linear infinite;
    }

    &--2 {
      padding-left: 16px;
      animation: industry-marquee-right 38s linear infinite;
    }

    &--3 {
      gap: 12px;
      animation: industry-marquee-left 34s linear infinite;

      .logo-marquee__track {
        gap: 12px;
      }
    }

    &--4 {
      padding-left: 6.55px;
      animation: industry-marquee-right 40s linear infinite;
    }
  }

  &__track {
    display: flex;
    gap: 16px;
  }

  &__item {
    position: relative;
    display: flex;
    flex: none;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: #fafafa;

    img {
      display: block;
      flex: none;
      width: auto;
      max-width: 312px;
      object-fit: contain;
    }
  }

  &__fade {
    position: absolute;
    z-index: 2;
    top: 0;
    width: 15%;
    height: 100%;
    pointer-events: none;

    &--left {
      left: 0;
      background: linear-gradient(90deg, var(--bg-color-demo) 0%, var(--bg-color-demo-linear) 100%);
    }

    &--right {
      right: 0;
      background: linear-gradient(270deg, var(--bg-color-demo) 0%, var(--bg-color-demo-linear) 100%);
    }
  }
}

@media screen and (max-width: 960px) {
  .industry-cases {
    padding: 60px 0;

    &__content {
      gap: clamp(40px, calc(31.52px + 1.77vw), 48px);
    }

    &__heading {
      width: 100%;
      padding: 0 24px;
      box-sizing: border-box;

      h2 {
        font-size: clamp(28px, calc(25.88px + 0.44vw), 30px);
        line-height: clamp(39px, calc(37.94px + 0.22vw), 40px);
      }

      p {
        font-size: clamp(12px, calc(7.76px + 0.88vw), 16px);
        line-height: clamp(17px, calc(9.58px + 1.55vw), 24px);
      }
    }

    &__stats {
      gap: clamp(0px, calc(-50.88px + 10.6vw), 48px);
      min-height: clamp(132px, calc(-67.46px + 41.6vw), 320px);
      padding: 48px 0;
    }

    &__stat {
      flex: 0 1 150px;
      min-width: 0;
      gap: clamp(4px, calc(-4.48px + 1.77vw), 12px);

      > p {
        font-size: clamp(12px, calc(7.76px + 0.88vw), 16px);
        line-height: clamp(17px, calc(9.58px + 1.55vw), 24px);
      }
    }

    &__value {
      gap: clamp(4px, calc(-0.24px + 0.88vw), 8px);
      height: clamp(34px, calc(10.68px + 4.86vw), 56px);

      strong {
        font-size: clamp(28px, calc(15.28px + 2.65vw), 40px);
        line-height: clamp(34px, calc(10.68px + 4.86vw), 56px);
      }

      span {
        font-size: clamp(20px, calc(11.52px + 1.77vw), 28px);
        line-height: clamp(28px, calc(2.56px + 5.3vw), 52px);
      }
    }
  }
}

@media screen and (max-width: 494px) {
  .industry-cases {
    &__content {
      gap: 40px;
    }

    &__heading {
      h2 {
        font-size: 28px;
        line-height: 39px;
      }

      p {
        font-size: 12px;
        line-height: 17px;
      }
    }

    &__stats {
      gap: 0;
      min-height: 132px;
      padding: 24px 8px;
    }

    &__stat {
      flex: 1 1 0;
      gap: 4px;

      > p {
        font-size: 12px;
        line-height: 17px;
      }
    }

    &__value {
      gap: 4px;
      height: 34px;

      strong {
        font-size: 28px;
        line-height: 34px;
      }

      span {
        font-size: 20px;
        line-height: 28px;
      }
    }
  }

  .logo-marquee {
    &__row,
    &__track {
      gap: 6.55px;
    }

    &__row--3 .logo-marquee__track {
      gap: 6.55px;
    }

    &__fade {
      width: 50px;
    }
  }
}

@media screen and (max-width: 959px) {
  .industry-cases__heading {
    h2 {
      font-size: 28px;
      line-height: 36px;
    }

    p {
      font-size: 12px;
      line-height: 20px;
    }
  }
}

@media screen and (max-width: 960px) {
  .industry-cases__stats {
    height: 84px;
    min-height: 84px;
  }
}

@media screen and (max-width: 360px) {
  .industry-cases__heading {
    gap: 12px;
  }

  .industry-cases__stat > p {
    font-size: 10px;
    line-height: 18px;
  }
}
</style>
