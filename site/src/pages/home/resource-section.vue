<template>
  <section class="resource-section" data-screenshot-root>
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
          <t-tag theme="primary" variant="light" size="medium">{{ card.label }}</t-tag>
          <div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>

        <div class="resource-card__items">
          <a v-for="item in card.items" :key="item.name" class="resource-item" :href="item.href">
            <img :src="item.logo" :alt="t('home.resources.logoAlt', { name: item.name })" />
            <span class="resource-item__name">{{ item.name }}</span>
            <span class="resource-item__updated">{{ t('home.resources.updated') }}</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
}

interface ResourceCard {
  type: 'web' | 'mobile' | 'aigc' | 'icons';
  label: string;
  title: string;
  description: string;
  illustration: string;
  items: ResourceItem[];
}

const { t } = useI18n({ messages: homeMessages });

const resourceCards = computed<ResourceCard[]>(() => [
  {
    type: 'web',
    label: 'Web Components',
    title: t('home.resources.cards.web.title'),
    description: t('home.resources.cards.web.description'),
    illustration: resourceWeb,
    items: [
      { name: 'Vue', logo: vueLogo, href: '/vue/' },
      { name: 'React', logo: reactLogo, href: '/react/' },
      { name: 'Vue Next', logo: vueLogo, href: '/vue-next/' },
      { name: t('home.resources.items.designResources'), logo: figmaLogo, href: 'https://www.figma.com/@tdesign' },
    ],
  },
  {
    type: 'mobile',
    label: 'Mobile Components',
    title: t('home.resources.cards.mobile.title'),
    description: t('home.resources.cards.mobile.description'),
    illustration: resourceMobile,
    items: [
      { name: 'React', logo: reactLogo, href: '/mobile-react/' },
      { name: t('home.resources.items.miniprogram'), logo: miniprogramLogo, href: '/miniprogram/' },
      { name: 'Vue Next', logo: vueLogo, href: '/mobile-vue/' },
      { name: 'Flutter', logo: flutterLogo, href: '/flutter/' },
      { name: 'Uniapp', logo: uniappLogo, href: '/uniapp/' },
      { name: t('home.resources.items.designResources'), logo: figmaLogo, href: 'https://www.figma.com/@tdesign' },
    ],
  },
  {
    type: 'aigc',
    label: 'AIGC Components',
    title: t('home.resources.cards.aigc.title'),
    description: t('home.resources.cards.aigc.description'),
    illustration: resourceAigc,
    items: [
      { name: 'React', logo: reactLogo, href: '/react/' },
      { name: t('home.resources.items.miniprogram'), logo: miniprogramLogo, href: '/miniprogram/' },
      { name: 'Vue Next', logo: vueLogo, href: '/vue-next/' },
      { name: t('home.resources.items.designResources'), logo: figmaLogo, href: 'https://www.figma.com/@tdesign' },
    ],
  },
  {
    type: 'icons',
    label: 'Icon Library',
    title: t('home.resources.cards.icons.title'),
    description: t('home.resources.cards.icons.description'),
    illustration: resourceIcons,
    items: [
      { name: t('home.resources.items.iconLibrary'), logo: iconLibrary, href: '/icons/' },
      { name: t('home.resources.items.designResources'), logo: figmaLogo, href: 'https://www.figma.com/@tdesign' },
    ],
  },
]);
</script>

<style lang="less" scoped>
.resource-section {
  position: relative;
  left: 50%;
  width: min(1512px, 100vw);
  padding: 80px 116px 60px;
  box-sizing: border-box;
  color: var(--text-primary);
  transform: translateX(-50%);

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
  grid-template-columns: 528px 1fr;
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

@media screen and (max-width: 1200px) {
  .resource-section {
    padding-right: 48px;
    padding-left: 48px;
  }

  .resource-grid {
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

@media screen and (max-width: 750px) {
  .resource-section {
    padding: 56px 24px 40px;

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
</style>
