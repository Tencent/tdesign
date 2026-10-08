<template>
  <section class="industry-cases">
    <div class="industry-cases__content">
      <header class="industry-cases__heading">
        <h2>{{ t('home.service.title') }}</h2>
        <p>{{ t('home.service.description') }}</p>
      </header>

      <div class="logo-marquee">
        <div
          v-for="(row, rowIndex) in logoRows"
          :key="rowIndex"
          :class="['logo-marquee__row', `logo-marquee__row--${rowIndex + 1}`]"
        >
          <div v-for="copyIndex in 2" :key="copyIndex" class="logo-marquee__track">
            <div v-for="logo in row" :key="logo.name" class="logo-marquee__item">
              <img :src="logo.src" :alt="logo.name" :style="{ height: `${logo.height || 36}px` }" loading="lazy" />
            </div>
          </div>
        </div>
        <div class="logo-marquee__fade logo-marquee__fade--left"></div>
        <div class="logo-marquee__fade logo-marquee__fade--right"></div>
      </div>
    </div>

    <div class="industry-cases__stats">
      <div v-for="stat in stats" :key="stat.value" class="industry-cases__stat">
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
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import homeMessages from '@/locales/pages/home';

interface LogoItem {
  name: string;
  src: string;
  height?: number;
}

const { t } = useI18n({ messages: homeMessages });

const BRAND_LIST_URL = 'https://tdesign.gtimg.com/site/info/brand-list.json';
const brandList = ref<LogoItem[]>([]);
const logoRows = computed(() =>
  brandList.value.reduce<LogoItem[][]>(
    (rows, logo, index) => {
      rows[index % rows.length].push(logo);
      return rows;
    },
    [[], [], []],
  ),
);

onMounted(async () => {
  try {
    const response = await fetch(BRAND_LIST_URL);
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

const stats = [
  { value: '8,000', unitKey: 'home.service.stats.projectsUnit', labelKey: 'home.service.stats.projects' },
  { value: '120', unitKey: 'home.service.stats.teamsUnit', labelKey: 'home.service.stats.teams' },
  { value: '5,000', unitKey: 'home.service.stats.downloadsUnit', labelKey: 'home.service.stats.downloads' },
];
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 160px;
    min-height: 388px;
    margin-top: 0;
    background: url('./assets/industry-cases/pattern.png') center / cover no-repeat;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    min-width: 206px;

    > p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      white-space: nowrap;
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
      font-family: 'DIN Alternate', 'Roboto Mono', sans-serif;
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
      top: 0;
      animation: industry-marquee-left 42s linear infinite;
    }

    &--2 {
      top: 104px;
      padding-left: 16px;
      animation: industry-marquee-right 38s linear infinite;
    }

    &--3 {
      top: 208px;
      gap: 12px;
      animation: industry-marquee-left 34s linear infinite;

      .logo-marquee__track {
        gap: 12px;
      }
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
    height: 88px;
    padding: 0 28px;
    overflow: hidden;
    background: #fafafa;
    border-radius: 14px;

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
    padding-top: 80px;

    &__content {
      gap: 48px;
    }

    &__heading {
      h2 {
        font-size: 30px;
        line-height: 40px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }

    &__stats {
      gap: 48px;
      min-height: 320px;
    }

    &__stat {
      min-width: 150px;
    }

    &__value {
      strong {
        font-size: 40px;
      }

      span {
        font-size: 28px;
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .industry-cases {
    &__stats {
      flex-direction: column;
      gap: 32px;
      padding: 48px 24px;
    }
  }

  .logo-marquee {
    transform-origin: top left;

    &__fade {
      width: 24%;
    }
  }
}
</style>
