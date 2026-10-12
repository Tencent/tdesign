<template>
  <section
    ref="resourceSectionRef"
    class="resource-section"
    data-screenshot-root
    :style="{
      '--mobile-layout-scale': mobileLayoutScale,
      '--mobile-section-height': mobileSectionHeight,
      '--tablet-layout-scale': tabletLayoutScale,
      '--tablet-section-height': tabletSectionHeight,
    }"
  >
    <div ref="resourceLayoutRef" class="resource-section__layout">
      <header class="resource-section__heading">
        <h2>{{ t('home.resources.title') }}</h2>
        <p>{{ t('home.resources.description') }}</p>
      </header>

      <div class="resource-grid">
        <article
          v-for="card in resourceCards"
          :key="card.title"
          :class="['resource-card', `resource-card--${card.type}`]"
        >
          <!-- SVG content is generated locally from the trusted Figma export. -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="resource-card__illustration" aria-hidden="true" v-html="card.illustration"></div>

          <div class="resource-card__content">
            <span class="resource-card__label">{{ card.label }}</span>
            <div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </div>

          <div class="resource-card__items">
            <a
              v-for="item in card.items"
              :key="item.name"
              class="resource-item"
              :href="item.href"
              referrerpolicy="no-referrer"
            >
              <img :src="item.logo" :alt="t('home.resources.logoAlt', { name: item.name })" />
              <span class="resource-item__name">{{ item.name }}</span>
              <span v-if="releaseDates[item.releaseKey]" class="resource-item__updated">
                {{ formatUpdatedAt(releaseDates[item.releaseKey]) }}
              </span>
              <span v-else class="resource-item__updated" aria-hidden="true"></span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import figmaLogo from '@/assets/figma-logo.svg';
import flutterLogo from '@/assets/flutter-logo.svg';
import miniprogramLogo from '@/assets/miniprogram-logo.svg';
import reactLogo from '@/assets/react-logo.svg';
import uniappLogo from '@/assets/uniapp-logo.png';
import vueLogo from '@/assets/vue-logo.svg';
import homeMessages from '@/locales/pages/home';
import iconLibrary from './assets/icon-library.svg';
import resourceAigc from './assets/resource-aigc.svg?raw';
import resourceIcons from './assets/resource-icons.svg?raw';
import resourceMobile from './assets/resource-mobile.svg?raw';
import resourceWeb from './assets/resource-web.svg?raw';

interface ResourceItem {
  name: string;
  logo: string;
  href: string;
  releaseKey: string;
}

interface ResourceCard {
  type: 'web' | 'mobile' | 'aigc' | 'icons';
  label: string;
  title: string;
  description: string;
  illustration: string;
  items: ResourceItem[];
}

interface Release {
  publishedAt: string;
  body: string;
}

const releaseApi = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/release';
const releaseMatchers: Record<string, string> = {
  'vue-next': 'tdesign-vue-next@',
  'react-web': 'tdesign-react@',
  vue2: 'Vue2 for Web 发布',
  miniprogram: 'tdesign-miniprogram@',
  'vue-mobile': 'Vue3 for Mobile 发布',
  'react-mobile': 'React for Mobile 发布',
  'uniapp-mobile': '@tdesign/uniapp@',
  flutter: 'Flutter for Mobile 发布',
  'vue-chat': '@tdesign-vue-next/chat@',
  'react-chat': '@tdesign-react/chat@',
  'miniprogram-chat': '@tdesign-miniprogram/chat@',
};

const { t, locale } = useI18n({ messages: homeMessages });
const resourceSectionRef = ref<HTMLElement>();
const resourceLayoutRef = ref<HTMLElement>();
const releaseDates = ref<Record<string, string>>({});
const mobileLayoutScale = ref('1');
const mobileSectionHeight = ref('auto');
const tabletLayoutScale = ref('1');
const tabletSectionHeight = ref('auto');
let layoutObserver: ResizeObserver | undefined;

function parseReleases(value: unknown): Release[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const release = item as Record<string, unknown>;
    // eslint-disable-next-line camelcase
    const publishedAt = release.published_at;
    if (typeof publishedAt !== 'string' || typeof release.body !== 'string') return [];
    return [{ publishedAt, body: release.body }];
  });
}

function parseReleaseDates(value: unknown): Record<string, string> {
  const dates: Record<string, string> = {};
  parseReleases(value).forEach((release) => {
    Object.entries(releaseMatchers).forEach(([key, marker]) => {
      if (release.body.includes(marker) && (!dates[key] || Date.parse(release.publishedAt) > Date.parse(dates[key]))) {
        dates[key] = release.publishedAt;
      }
    });
  });
  return dates;
}

function formatUpdatedAt(value: string): string {
  const elapsedDays = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000)));
  const elapsedWeeks = Math.floor(elapsedDays / 7);
  const relativeTime = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }).format(-elapsedWeeks, 'week');
  return locale.value.startsWith('zh') ? `${relativeTime}更新` : `Updated ${relativeTime}`;
}

async function fetchReleaseDates(): Promise<void> {
  try {
    const response = await fetch(releaseApi);
    if (!response.ok) return;

    const data: unknown = await response.json();
    releaseDates.value = parseReleaseDates(data);
  } catch (error) {
    console.error(error);
  }
}

const updateScaledLayout = () => {
  if (!resourceLayoutRef.value) return;

  if (window.innerWidth <= 596) {
    const scale = window.innerWidth / 360;
    mobileLayoutScale.value = scale.toFixed(4);
    mobileSectionHeight.value = `${resourceLayoutRef.value.offsetHeight * scale}px`;
  } else {
    mobileSectionHeight.value = 'auto';
  }

  if (window.innerWidth >= 960 && window.innerWidth < 1200) {
    const scale = window.innerWidth / 960;
    tabletLayoutScale.value = scale.toFixed(4);
    tabletSectionHeight.value = `${resourceLayoutRef.value.offsetHeight * scale}px`;
  } else {
    tabletSectionHeight.value = 'auto';
  }
};

onMounted(() => {
  fetchReleaseDates();
  nextTick(updateScaledLayout);
  window.addEventListener('resize', updateScaledLayout);
  layoutObserver = new ResizeObserver(updateScaledLayout);
  if (resourceLayoutRef.value) layoutObserver.observe(resourceLayoutRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScaledLayout);
  layoutObserver?.disconnect();
});

const resourceCards = computed<ResourceCard[]>(() => [
  {
    type: 'web',
    label: 'Web Components',
    title: t('home.resources.cards.web.title'),
    description: t('home.resources.cards.web.description'),
    illustration: resourceWeb,
    items: [
      { name: 'Vue Next', logo: vueLogo, href: 'https://tdesign.tencent.com/vue-next/', releaseKey: 'vue-next' },
      { name: 'React', logo: reactLogo, href: 'https://tdesign.tencent.com/react/', releaseKey: 'react-web' },
      { name: 'Vue', logo: vueLogo, href: 'https://tdesign.tencent.com/vue/', releaseKey: 'vue2' },
      {
        name: t('home.resources.items.designResources'),
        logo: figmaLogo,
        href: 'https://www.figma.com/community/file/1053279236128724321/tdesign-for-web',
        releaseKey: 'design-web',
      },
    ],
  },
  {
    type: 'mobile',
    label: 'Mobile Components',
    title: t('home.resources.cards.mobile.title'),
    description: t('home.resources.cards.mobile.description'),
    illustration: resourceMobile,
    items: [
      {
        name: t('home.resources.items.miniprogram'),
        logo: miniprogramLogo,
        href: 'https://tdesign.tencent.com/miniprogram/',
        releaseKey: 'miniprogram',
      },
      {
        name: 'Vue Next',
        logo: vueLogo,
        href: 'https://tdesign.tencent.com/mobile-vue/',
        releaseKey: 'vue-mobile',
      },
      {
        name: 'React',
        logo: reactLogo,
        href: 'https://tdesign.tencent.com/mobile-react/',
        releaseKey: 'react-mobile',
      },
      { name: 'Uniapp', logo: uniappLogo, href: 'https://tdesign.tencent.com/uniapp/', releaseKey: 'uniapp-mobile' },
      { name: 'Flutter', logo: flutterLogo, href: 'https://tdesign.tencent.com/flutter/', releaseKey: 'flutter' },
      {
        name: t('home.resources.items.designResources'),
        logo: figmaLogo,
        href: 'https://www.figma.com/community/file/1053279585699097956/tdesign-for-mobile',
        releaseKey: 'design-mobile',
      },
    ],
  },
  {
    type: 'aigc',
    label: 'AIGC Components',
    title: t('home.resources.cards.aigc.title'),
    description: t('home.resources.cards.aigc.description'),
    illustration: resourceAigc,
    items: [
      {
        name: 'Vue Next',
        logo: vueLogo,
        href: 'https://tdesign.tencent.com/vue-next-chat/',
        releaseKey: 'vue-chat',
      },
      {
        name: 'React',
        logo: reactLogo,
        href: 'https://tdesign.tencent.com/react-chat/',
        releaseKey: 'react-chat',
      },
      {
        name: t('home.resources.items.miniprogram'),
        logo: miniprogramLogo,
        href: 'https://tdesign.tencent.com/miniprogram-chat/',
        releaseKey: 'miniprogram-chat',
      },
      {
        name: t('home.resources.items.designResources'),
        logo: figmaLogo,
        href: 'https://www.figma.com/community/file/1053279236128724321/tdesign-for-web',
        releaseKey: 'design-aigc',
      },
    ],
  },
  {
    type: 'icons',
    label: 'Icon Library',
    title: t('home.resources.cards.icons.title'),
    description: t('home.resources.cards.icons.description'),
    illustration: resourceIcons,
    items: [
      {
        name: t('home.resources.items.iconLibrary'),
        logo: iconLibrary,
        href: 'https://tdesign.tencent.com/icons/',
        releaseKey: 'icons',
      },
      {
        name: t('home.resources.items.designResources'),
        logo: figmaLogo,
        href: 'https://www.figma.com/community/file/1543189085651776104/tdesign-icon-svg-file',
        releaseKey: 'design-icons',
      },
    ],
  },
]);
</script>

<style lang="less" scoped>
.resource-section {
  position: relative;
  left: 50%;
  width: 1512px;
  padding: 80px 116px 60px;
  box-sizing: border-box;
  color: var(--text-primary);
  transform: translateX(-50%);

  &__layout {
    display: contents;
  }

  &__heading {
    margin-bottom: 64px;

    h2 {
      margin: 0 0 20px;
      font-size: 36px;
      font-weight: 600;
      line-height: 44px;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 300;
      line-height: 28px;
    }
  }
}

.resource-grid {
  display: grid;
  width: 1280px;
  grid-template-columns: 528px 736px;
  gap: 16px;
}

.resource-card {
  position: relative;
  display: flex;
  min-width: 0;
  height: 308px;
  padding: 32px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 12px;
  background: var(--bg-color-card);

  &:nth-child(3) {
    grid-column: 1;
    width: 600px;
  }

  &:nth-child(4) {
    grid-column: 2;
    margin-left: 72px;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 3px;
    background: var(--brand-main-light);
    color: var(--brand-main);
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
  }

  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    padding: 0 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    h3 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
    }
  }

  &__items {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__illustration {
    position: absolute;
    z-index: 1;
    top: -20px;
    right: 12px;
    width: 180px;
    height: 180px;
    pointer-events: none;

    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }

    :deep(.illustration-glow),
    :deep(.illustration-subject) {
      transform-box: fill-box;
      transform-origin: center;
    }
  }

  &--mobile &__illustration {
    top: 0;
    right: 0;
    width: 588px;
    height: 308px;
  }

  &--mobile {
    width: 736px;
  }

  &--aigc &__illustration {
    top: -20px;
    right: auto;
    left: 0;
    width: 600px;
    height: 328px;
  }

  &--icons &__illustration {
    top: 0;
    right: auto;
    left: 0;
    width: 664px;
    height: 308px;
  }

  &--icons {
    width: 664px;
  }
}

.resource-item {
  display: flex;
  width: 100px;
  height: 100px;
  padding: 8px 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 12px;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-color-card-hover);
  }

  img {
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 16px;
    line-height: 24px;
  }

  &__updated {
    min-height: 20px;
    color: var(--text-placeholder);
    font-size: 12px;
    font-weight: 300;
    line-height: 20px;
  }
}

.resource-card--icons .resource-card__items {
  justify-content: flex-start;
  gap: 16px;
}

@media screen and (min-width: 1200px) and (max-width: 1279px) {
  .resource-section {
    width: 100vw;
    padding-right: 48px;
    padding-left: 48px;
  }

  .resource-grid {
    width: 100%;
    grid-template-columns: 448px 640px;
  }

  .resource-card {
    &--web,
    &--mobile {
      padding-right: 24px;
      padding-left: 24px;
    }

    &:nth-child(3) {
      width: 514px;
    }

    &:nth-child(4) {
      width: 574px;
      margin-left: 66px;
    }

    &--mobile {
      width: 640px;
    }

    &--aigc &__illustration :deep(.illustration-subject) {
      transform: translateX(-86px);
    }

    &--icons {
      width: 574px;
    }

    &--icons &__illustration :deep(.illustration-subject) {
      transform: translateX(-44px) scale(0.7);
    }
  }
}

@media screen and (max-width: 1199px) {
  .resource-section {
    width: 100vw;
    padding-right: 48px;
    padding-left: 48px;
  }

  .resource-grid {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .resource-card,
  .resource-card:nth-child(3),
  .resource-card:nth-child(4) {
    grid-column: 1;
    width: 100%;
    margin-left: 0;
  }
}

@media screen and (min-width: 960px) and (max-width: 1199px) {
  .resource-section {
    width: 100vw;
    height: var(--tablet-section-height);
    padding: 0;
    overflow: hidden;

    &__layout {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 960px;
      padding: 80px 24px 60px;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      gap: 64px;
      transform: scale(var(--tablet-layout-scale));
      transform-origin: top left;
    }

    &__heading {
      width: 912px;
      padding: 0 14px;
      box-sizing: border-box;
      margin: 0;

      h2 {
        margin-bottom: 20px;
      }
    }
  }

  .resource-grid {
    width: 912px;
    gap: 16px;
  }

  .resource-card,
  .resource-card:nth-child(3),
  .resource-card:nth-child(4) {
    width: 912px;
    height: 224px;
    padding: 32px;
    margin: 0;
    justify-content: flex-start;
    gap: 24px;
  }

  .resource-card {
    &__items {
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 8px;
    }

    &__illustration {
      top: -8px;
      right: 20px;
      width: 220px;
      height: 220px;
    }

    &--web .resource-item:nth-child(3) {
      background: var(--bg-color-card-hover);
    }

    &--web .resource-item:nth-child(1) {
      order: 3;
    }

    &--web .resource-item:nth-child(2) {
      order: 2;
    }

    &--web .resource-item:nth-child(3) {
      order: 1;
    }

    &--web .resource-item:nth-child(4) {
      order: 4;
    }

    &--mobile {
      height: 328px;
    }

    &--mobile &__illustration {
      top: 20px;
      right: 14px;
      width: 588px;
      height: 308px;
    }

    &--mobile &__items {
      width: 620px;
    }

    &--mobile .resource-item:nth-child(1) {
      order: 2;
    }

    &--mobile .resource-item:nth-child(2) {
      order: 3;
    }

    &--mobile .resource-item:nth-child(3) {
      order: 1;
    }

    &--mobile .resource-item:nth-child(4) {
      order: 5;
    }

    &--mobile .resource-item:nth-child(5) {
      order: 4;
    }

    &--mobile .resource-item:nth-child(6) {
      order: 6;
    }

    &--aigc &__illustration {
      top: 0;
      right: 0;
      left: auto;
      width: 600px;
      height: 328px;
    }

    &--aigc &__illustration :deep(.illustration-glow) {
      transform: translate(-211px, -235px);
    }

    &--aigc &__illustration :deep(.illustration-subject) {
      transform: translate(-6px, 0) scale(1.2222);
    }

    &--aigc .resource-item:nth-child(1) {
      order: 3;
    }

    &--aigc .resource-item:nth-child(2) {
      order: 1;
    }

    &--aigc .resource-item:nth-child(3) {
      order: 2;
    }

    &--aigc .resource-item:nth-child(4) {
      order: 4;
    }

    &--icons &__illustration {
      top: 0;
      right: 0;
      left: auto;
      width: 664px;
      height: 308px;
    }

    &--icons &__illustration :deep(.illustration-glow) {
      transform: translate(-215px, 0);
    }

    &--icons &__illustration :deep(.illustration-subject) {
      transform: translate(56px, 14px) scale(0.72, 0.75);
    }
  }

  .resource-item {
    display: grid;
    width: auto;
    min-width: 132px;
    height: 64px;
    padding: 12px 24px 12px 16px;
    flex: 0 0 auto;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 24px 20px;
    column-gap: 8px;
    row-gap: 0;

    img {
      width: 40px;
      height: 40px;
      margin: 0;
      grid-row: 1 / 3;
    }

    &__name {
      grid-column: 2;
      grid-row: 1;
    }

    &__updated {
      grid-column: 2;
      grid-row: 2;
    }
  }
}

@media screen and (min-width: 597px) and (max-width: 750px) {
  .resource-section {
    padding: 0 24px 40px;

    &__heading {
      margin-bottom: 36px;

      h2 {
        font-size: 28px;
        line-height: 36px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .resource-card {
    height: auto;
    min-height: 308px;
    padding: 24px 16px;

    &__items {
      margin-top: 44px;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 8px;
    }

    &__illustration {
      opacity: 0.65;
    }
  }

  .resource-item {
    width: calc(33.333% - 6px);
  }
}

@media screen and (min-width: 751px) and (max-width: 959px) {
  .resource-section {
    padding-top: 0;
  }
}

@media screen and (max-width: 596px) {
  .resource-section {
    left: 50%;
    width: 100vw;
    height: var(--mobile-section-height);
    padding: 0;
    overflow: hidden;
    transform: translateX(-50%);

    &__layout {
      position: absolute;
      top: 0;
      left: 50%;
      display: flex;
      width: 360px;
      padding: 60px 24px;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      transform: translateX(-50%) scale(var(--mobile-layout-scale));
      transform-origin: top center;
    }

    &__heading {
      width: 360px;
      padding: 0 24px;
      box-sizing: border-box;
      margin: 0;

      h2 {
        margin-bottom: 12px;
        font-size: 28px;
        line-height: 35px;
      }

      p {
        font-size: 12px;
        line-height: 17px;
      }
    }
  }

  .resource-grid {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .resource-card,
  .resource-card:nth-child(3),
  .resource-card:nth-child(4) {
    width: 100%;
    height: auto;
    min-height: 0;
    padding: 24px;
    margin: 0;
    grid-column: 1;
    justify-content: flex-start;
    gap: 16px;

    &::after {
      position: absolute;
      z-index: 0;
      width: 440px;
      height: 440px;
      border-radius: 50%;
      content: '';
      filter: blur(100px);
      pointer-events: none;
    }
  }

  .resource-card {
    &__content {
      padding: 0;
      gap: 16px;

      h3 {
        margin-bottom: 8px;
        font-size: 20px;
        line-height: 30px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }

    &__items {
      margin: 0;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;
    }

    &__illustration {
      display: none;
    }

    &--web::after {
      display: none;
    }

    &--mobile::after {
      top: -370px;
      left: 98px;
      background: linear-gradient(246deg, #b5fff5 44.26%, #4794ff 63.43%, #3700ff 89.4%);
      opacity: 0.12;
    }

    &--aigc::after {
      top: 250px;
      left: 138px;
      background: linear-gradient(221deg, #b5c7ff 50%, #c574ff 62.12%, #ff47d4 74.43%, #ff0004 90.66%);
      opacity: 0.1;
    }

    &--icons::after {
      top: 170px;
      left: 138px;
      background: linear-gradient(221deg, #ffb5b5 50%, #ffd874 62.12%, #ceff47 74.43%, #6fff00 90.66%);
      opacity: 0.1;
    }

    &--icons &__items {
      gap: 4px;
    }

    &--web .resource-item:nth-child(3) {
      width: 280px;
      padding-right: 8px;
      padding-left: 8px;
      margin-left: -8px;
      order: 1;
      background: var(--bg-color-card-hover);
      border-radius: 8px;
    }

    &--web .resource-item:nth-child(2) {
      order: 2;
    }

    &--web .resource-item:nth-child(1) {
      order: 3;
    }

    &--web .resource-item:nth-child(4) {
      order: 4;
    }

    &--mobile .resource-item:nth-child(3) {
      order: 1;
    }

    &--mobile .resource-item:nth-child(1) {
      order: 2;
    }

    &--mobile .resource-item:nth-child(2) {
      order: 3;
    }

    &--mobile .resource-item:nth-child(4) {
      order: 4;
    }

    &--mobile .resource-item:nth-child(5) {
      display: none;
    }

    &--mobile .resource-item:nth-child(6) {
      order: 5;
    }

    &--aigc .resource-item:nth-child(2) {
      order: 1;
    }

    &--aigc .resource-item:nth-child(3) {
      order: 2;
    }

    &--aigc .resource-item:nth-child(1) {
      order: 3;
    }

    &--aigc .resource-item:nth-child(4) {
      order: 4;
    }
  }

  .resource-item {
    z-index: 1;
    width: 192px;
    height: 48px;
    padding: 12px 0;
    flex: 0 0 48px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
    border-radius: 12px;

    img {
      width: 24px;
      height: 24px;
      margin: 0;
    }

    &__name {
      font-size: 16px;
      line-height: 24px;
      white-space: nowrap;
    }

    &__updated {
      font-size: 12px;
      line-height: 20px;
      white-space: nowrap;
    }
  }
}
</style>
