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
          @mousemove="updateResourceIllustrationHover(card.type, $event)"
          @mouseleave="leaveResourceCard(card.type)"
        >
          <div class="resource-card__illustration" aria-hidden="true">
            <canvas
              :ref="(element) => setResourceCanvas(card.type, element)"
              class="resource-card__frames"
              width="800"
              height="800"
            ></canvas>
          </div>

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
import aiResourceData from './assets/ai-resource/data.json';
import desktopResourceData from './assets/desktop-resource/data.json';
import iconResourceData from './assets/icon-resource/data.json';
import iconLibrary from './assets/icon-library.svg';
import mobileResourceData from './assets/mobile-resource/data.json';

type ResourceCardType = 'web' | 'mobile' | 'aigc' | 'icons';

interface ResourceItem {
  name: string;
  logo: string;
  href: string;
  releaseKey: string;
}

interface ResourceCard {
  type: ResourceCardType;
  label: string;
  title: string;
  description: string;
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

const loadResourceFrames = (modules: Record<string, string>) =>
  Object.entries(modules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, undefined, { numeric: true }))
    .map(([, url]) => url);

const resourceFrames: Record<ResourceCardType, string[]> = {
  web: loadResourceFrames(
    import.meta.glob<string>('./assets/desktop-resource/images/*.webp', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ),
  mobile: loadResourceFrames(
    import.meta.glob<string>('./assets/mobile-resource/images/*.webp', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ),
  aigc: loadResourceFrames(
    import.meta.glob<string>('./assets/ai-resource/images/*.webp', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ),
  icons: loadResourceFrames(
    import.meta.glob<string>('./assets/icon-resource/images/*.webp', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ),
};
const resourceAnimationData: Record<ResourceCardType, { fr: number; op: number }> = {
  web: desktopResourceData,
  mobile: mobileResourceData,
  aigc: aiResourceData,
  icons: iconResourceData,
};
const resourceTypes = Object.keys(resourceFrames) as ResourceCardType[];
const frameIndexes: Record<ResourceCardType, number> = {
  web: 0,
  mobile: 0,
  aigc: 0,
  icons: 0,
};
const animationTokens: Record<ResourceCardType, number> = {
  web: 0,
  mobile: 0,
  aigc: 0,
  icons: 0,
};
const resourceCanvases = {} as Record<ResourceCardType, HTMLCanvasElement>;
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let hoveredIllustrationType: ResourceCardType | undefined;
let layoutObserver: ResizeObserver | undefined;
let resourcePreloadObserver: IntersectionObserver | undefined;

function loadResourceFrame(type: ResourceCardType, frame: number): Promise<HTMLImageElement> {
  const image = new Image();
  image.decoding = 'async';
  image.src = resourceFrames[type][frame];
  return image.decode().then(() => image);
}

function drawResourceFrame(type: ResourceCardType, image: HTMLImageElement) {
  const canvas = resourceCanvases[type];
  const context = canvas?.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

async function drawInitialResourceFrame(type: ResourceCardType) {
  const initialFrame = frameIndexes[type];
  const canvas = resourceCanvases[type];
  try {
    const image = await loadResourceFrame(type, initialFrame);
    if (resourceCanvases[type] === canvas && frameIndexes[type] === initialFrame) {
      drawResourceFrame(type, image);
    }
  } catch (error) {
    console.error(error);
  }
}

function setResourceCanvas(type: ResourceCardType, element: unknown) {
  if (!(element instanceof HTMLCanvasElement)) return;
  resourceCanvases[type] = element;
  drawInitialResourceFrame(type);
}

function waitForNextFrame(delay: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, Math.max(0, delay)));
}

async function startResourceAnimation(type: ResourceCardType, targetFrame: number) {
  const token = ++animationTokens[type];
  const frameDuration = 1000 / resourceAnimationData[type].fr;
  let nextFrameAt = performance.now();

  while (frameIndexes[type] !== targetFrame && token === animationTokens[type]) {
    const direction = targetFrame > frameIndexes[type] ? 1 : -1;
    const nextFrame = frameIndexes[type] + direction;

    try {
      const image = await loadResourceFrame(type, nextFrame);
      if (token !== animationTokens[type]) return;
      nextFrameAt += frameDuration;
      await waitForNextFrame(nextFrameAt - performance.now());
      if (token !== animationTokens[type]) return;
      drawResourceFrame(type, image);
      frameIndexes[type] = nextFrame;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}

function preloadResourceFrames() {
  Object.values(resourceFrames)
    .flat()
    .forEach((src) => {
      fetch(src, { cache: 'force-cache' }).catch(() => undefined);
    });
}

function playResourceIllustration(type: ResourceCardType) {
  if (!prefersReducedMotion) {
    startResourceAnimation(type, resourceAnimationData[type].op - 1);
  }
}

function reverseResourceIllustration(type: ResourceCardType) {
  if (!prefersReducedMotion) {
    startResourceAnimation(type, 0);
  }
}

function updateResourceIllustrationHover(type: ResourceCardType, event: MouseEvent) {
  const card = event.currentTarget;
  if (!(card instanceof HTMLElement)) return;

  const illustration = card.querySelector<HTMLElement>('.resource-card__illustration');
  if (!illustration) return;

  const rect = illustration.getBoundingClientRect();
  const isInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (isInside && hoveredIllustrationType !== type) {
    hoveredIllustrationType = type;
    playResourceIllustration(type);
  } else if (!isInside && hoveredIllustrationType === type) {
    hoveredIllustrationType = undefined;
    reverseResourceIllustration(type);
  }
}

function leaveResourceCard(type: ResourceCardType) {
  if (hoveredIllustrationType !== type) return;
  hoveredIllustrationType = undefined;
  reverseResourceIllustration(type);
}

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
  if (resourceSectionRef.value) {
    resourcePreloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadResourceFrames();
        resourcePreloadObserver?.disconnect();
      },
      { rootMargin: '400px 0px' },
    );
    resourcePreloadObserver.observe(resourceSectionRef.value);
  }
  nextTick(updateScaledLayout);
  window.addEventListener('resize', updateScaledLayout);
  layoutObserver = new ResizeObserver(updateScaledLayout);
  if (resourceLayoutRef.value) layoutObserver.observe(resourceLayoutRef.value);
});

onBeforeUnmount(() => {
  resourceTypes.forEach((type) => {
    animationTokens[type] += 1;
  });
  window.removeEventListener('resize', updateScaledLayout);
  layoutObserver?.disconnect();
  resourcePreloadObserver?.disconnect();
});

const resourceCards = computed<ResourceCard[]>(() => [
  {
    type: 'web',
    label: 'Web Components',
    title: t('home.resources.cards.web.title'),
    description: t('home.resources.cards.web.description'),
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

  &::before {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    content: '';
    pointer-events: none;
    filter: blur(100px);
  }

  &--mobile::before {
    top: -260px;
    left: 348px;
    width: 440px;
    height: 440px;
    background: linear-gradient(246deg, #b5fff5 44.26%, #4794ff 63.43%, #3700ff 89.4%);
    opacity: 0.12;
  }

  &--aigc::before {
    top: 32px;
    left: 44px;
    width: 430px;
    height: 430px;
    background: linear-gradient(221deg, #b5c7ff 50%, #c574ff 62.12%, #ff47d4 74.43%, #ff0004 90.66%);
    opacity: 0.1;
  }

  &--icons::before {
    top: 120px;
    left: 120px;
    width: 430px;
    height: 430px;
    background: linear-gradient(221deg, #ffb5b5 50%, #ffd874 62.12%, #ceff47 74.43%, #6fff00 90.66%);
    opacity: 0.1;
  }

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
    pointer-events: auto;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .resource-card__frames {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }

  &--mobile &__illustration {
    top: 0;
    right: 28px;
  }

  &--mobile {
    width: 736px;
  }

  &--aigc &__illustration {
    top: -20px;
    right: 8px;
    left: auto;
  }

  &--icons &__illustration {
    top: 20px;
    right: 32px;
    left: auto;
    width: 268px;
    height: 268px;

    img,
    .resource-card__frames {
      width: 268px;
      height: 268px;
      object-fit: contain;
      transform: none;
    }
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

    &--icons {
      width: 574px;
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

  .resource-card__illustration {
    display: none;
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
    height: auto;
    min-height: 224px;
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

    &--mobile &__illustration {
      top: -24px;
      right: -8px;
      width: 280px;
      height: 280px;
    }

    &--mobile &__items {
      width: 620px;
    }

    &--aigc &__illustration {
      top: -36px;
      right: -20px;
      left: auto;
      width: 300px;
      height: 300px;
    }

    &--icons &__illustration {
      top: -28px;
      right: -28px;
      left: auto;
      width: 340px;
      height: 340px;

      img,
      .resource-card__frames {
        width: 100%;
        height: 100%;
        transform: none;
      }
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
