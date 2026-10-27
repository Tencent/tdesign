<template>
  <section ref="homepageRef" class="tdesign-homepage">
    <banner :themeMode="themeMode" data-board-section="before" />

    <section class="main-page" data-board-section="before">
      <div class="banner-info">
        <div class="banner-info__left">
          <h2 class="name">
            <p class="primary">TDesign</p>
            <div style="display: flex">
              <p class="sub-title">
                {{ t('home.hero.subtitle') }}
              </p>
            </div>
          </h2>
        </div>
        <t-popup trigger="hover" placement="top" overlay-inner-class-name="wechat-qrcode" :z-index="100">
          <div class="banner-booking">
            <button class="banner-booking__button" type="button">
              <span class="banner-booking__logo">
                <img src="./assets/tdesign.svg" alt="" />
              </span>
              <span class="banner-booking__info">
                <span class="banner-booking__eyebrow">{{ t('home.hero.followWechatEyebrow') }}</span>
                <span class="banner-booking__title">{{ t('home.hero.followWechatTitle') }}</span>
              </span>
            </button>
            <span class="banner-booking__shadow" aria-hidden="true"></span>
          </div>
          <template #content><img width="100" src="https://tdesign.gtimg.com/site/wechat-account.png" /></template>
        </t-popup>
      </div>
      <div v-if="newsList.length > 0" class="module-news" @mousemove="stopNewsAutoplay" @mouseleave="startNewsAutoplay">
        <div ref="newsTrackRef" class="module-news__track">
          <div
            v-for="(news, index) in loopedNewsList"
            :key="index"
            class="module-news__item"
            :aria-hidden="index >= newsList.length ? 'true' : undefined"
            @click="() => handleClickNews(news.url)"
          >
            <t-card
              :title="news.title"
              :description="news.desc"
              :bordered="false"
              :style="{ cursor: news.url ? 'pointer' : undefined }"
            >
              <template #footer>{{ news.date }}</template>
            </t-card>
          </div>
        </div>
      </div>
      <resource-section :theme-mode="themeMode" />
    </section>

    <div
      ref="moduleBoardRef"
      class="module-board"
      :class="{ 'module-board--scroll-driven': moduleBoardScrollEnabled }"
      :style="moduleBoardStyle"
      id="moduleBoard"
    >
      <div
        ref="moduleBoardViewportRef"
        class="module-board__viewport"
        :style="moduleBoardViewportStyle"
        :tabindex="moduleBoardScrollEnabled || windowWidth < 500 ? undefined : 0"
        @scroll.passive="scheduleModuleBoardUpdate"
        @focusin="handleModuleBoardFocus"
      >
        <div
          ref="moduleBoardInnerRef"
          class="module-board__inner"
          :style="{ transform: `translate3d(-${tabTransformWidth}px, 0, 0)` }"
        >
          <div
            :class="[
              'module-board__card',
              {
                'module-board__card--active': currentTab === 0,
              },
            ]"
          >
            <div class="module-board__card-desc">
              <h3 class="title">{{ t('home.open.title') }}</h3>
              <p class="desc">{{ t('home.open.description') }}</p>
            </div>
            <div class="module-board__detail module-board__detail--open">
              <div class="code-board">
                <t-radio-group v-model="codeFramework" class="code-tab" variant="default-filled" size="large">
                  <t-radio-button v-for="item in codeFrameworkOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </t-radio-button>
                </t-radio-group>

                <ul class="code-list">
                  <li
                    v-for="item in codeList[codeFramework]"
                    :key="item.code"
                    :class="['code-item', { 'code-item--multiline': item.code?.includes('\n') }]"
                  >
                    <pre><code :class="[`language-${item.type}`]">{{ displayCode(item) }}</code></pre>
                  </li>
                </ul>
              </div>

              <div class="line"></div>

              <ul class="desc-list">
                <li class="desc-item">
                  <img class="desc-icon" :src="openFrameworksIcon" alt="" />
                  <h3 class="desc-title">{{ t('home.open.features.frameworks.title') }}</h3>
                  <p class="desc-text">{{ t('home.open.features.frameworks.description') }}</p>
                </li>
                <li class="desc-item">
                  <img class="desc-icon" :src="openPlatformsIcon" alt="" />
                  <h3 class="desc-title">{{ t('home.open.features.platforms.title') }}</h3>
                  <p class="desc-text">{{ t('home.open.features.platforms.description') }}</p>
                </li>
                <li class="desc-item">
                  <img class="desc-icon" :src="openIndustriesIcon" alt="" />
                  <h3 class="desc-title">{{ t('home.open.features.industries.title') }}</h3>
                  <p class="desc-text">{{ t('home.open.features.industries.description') }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div
            :class="[
              'module-board__card',
              {
                'module-board__card--active': currentTab === 1,
              },
            ]"
          >
            <div class="module-board__card-desc">
              <h3 class="title">{{ t('home.creation.title') }}</h3>
              <p class="desc">{{ t('home.creation.description') }}</p>
            </div>
            <div class="module-board__detail module-board__detail--creation">
              <div class="component-board">
                <div class="component-board-item">
                  <t-input clearable :placeholder="t('home.componentDemo.accountPlaceholder')">
                    <template #prefixIcon><desktop-icon /></template>
                  </t-input>
                  <t-select
                    v-model="componentModel.selectValue"
                    multiple
                    :placeholder="t('home.componentDemo.selectPlaceholder')"
                  >
                    <t-option
                      v-for="item in componentSelectOptions"
                      :value="item.value"
                      :label="item.label"
                      :key="item.value"
                    ></t-option>
                  </t-select>
                  <t-tree :data="componentTreeData" hover checkable expand-all />
                </div>
                <div class="component-board-item">
                  <t-menu
                    :theme="themeMode"
                    defaultValue="dashboard/base"
                    :defaultExpanded="componentModel.menuExpanded"
                    width="256px"
                  >
                    <template #logo>
                      <img
                        class="__light__"
                        width="172"
                        style="margin-left: 24px"
                        src="./assets/tdesign-starter.svg"
                        alt="logo"
                      />
                      <img
                        class="__dark__"
                        width="172"
                        style="margin-left: 24px"
                        src="./assets/tdesign-starter-dark.svg"
                        alt="logo"
                      />
                    </template>
                    <t-submenu :title="t('home.componentDemo.menu.dashboard')" value="dashboard">
                      <template #icon>
                        <icon name="dashboard" />
                      </template>
                      <t-menu-item value="dashboard/base">{{
                        t('home.componentDemo.menu.dashboardOverview')
                      }}</t-menu-item>
                      <t-menu-item value="dashboard/detail">{{ t('home.componentDemo.menu.report') }}</t-menu-item>
                    </t-submenu>
                    <t-submenu :title="t('home.componentDemo.menu.list')" value="list">
                      <template #icon>
                        <icon name="server" />
                      </template>
                      <t-menu-item value="list/base">{{ t('home.componentDemo.menu.baseList') }}</t-menu-item>
                      <t-menu-item value="list/card">{{ t('home.componentDemo.menu.cardList') }}</t-menu-item>
                      <t-menu-item value="list/select">{{ t('home.componentDemo.menu.filterList') }}</t-menu-item>
                      <t-menu-item value="list/tree">{{ t('home.componentDemo.menu.treeList') }}</t-menu-item>
                    </t-submenu>
                    <t-submenu :title="t('home.componentDemo.menu.form')" value="form">
                      <template #icon>
                        <icon name="root-list" />
                      </template>
                      <t-menu-item value="form/base">{{ t('home.componentDemo.menu.baseForm') }}</t-menu-item>
                      <t-menu-item value="form/step">{{ t('home.componentDemo.menu.stepForm') }}</t-menu-item>
                    </t-submenu>
                    <t-submenu :title="t('home.componentDemo.menu.detail')" value="detail">
                      <template #icon>
                        <icon name="control-platform" />
                      </template>
                      <t-menu-item value="detail/base">{{ t('home.componentDemo.menu.baseDetail') }}</t-menu-item>
                      <t-menu-item value="detail/advanced">{{
                        t('home.componentDemo.menu.advancedDetail')
                      }}</t-menu-item>
                      <t-menu-item value="detail/deploy">{{ t('home.componentDemo.menu.deployDetail') }}</t-menu-item>
                      <t-menu-item value="detail/secondary">{{
                        t('home.componentDemo.menu.secondaryDetail')
                      }}</t-menu-item>
                    </t-submenu>
                  </t-menu>
                </div>
                <div class="component-board-item">
                  <div class="component-board-item-row">
                    <t-button>
                      <template #icon><icon name="file" /></template>
                      {{ t('home.componentDemo.primaryButton') }}
                    </t-button>
                    <t-button theme="default">{{ t('home.componentDemo.button') }}</t-button>
                    <t-button theme="default">{{ t('home.componentDemo.button') }}</t-button>
                  </div>
                  <div class="component-board-item-row">
                    <t-slider v-model="componentModel.sliderValue" :inputNumberProps="false" />
                  </div>
                  <div class="component-board-item-row">
                    <t-switch size="large" :defaultValue="true" />
                    <t-switch size="large" />
                    <t-check-tag>{{ t('home.componentDemo.checkableTag') }}</t-check-tag>
                    <t-tag>{{ t('home.componentDemo.defaultTag') }}</t-tag>
                  </div>
                  <div>
                    <t-radio-group class="component-theme-tabs" defaultValue="1" variant="default-filled">
                      <t-radio-button value="1">{{ t('home.componentDemo.light') }}</t-radio-button>
                      <t-radio-button value="2">{{ t('home.componentDemo.dark') }}</t-radio-button>
                      <t-radio-button value="3">{{ t('home.componentDemo.neutral') }}</t-radio-button>
                    </t-radio-group>
                  </div>
                  <div class="color-block-wrapper">
                    <span
                      class="color-block"
                      v-for="color in componentModel.colorList1"
                      :key="color"
                      :style="{ background: color }"
                    ></span>
                  </div>
                  <div class="color-block-wrapper">
                    <span
                      class="color-block"
                      v-for="color in componentModel.colorList2"
                      :key="color"
                      :style="{ background: color }"
                    ></span>
                  </div>
                </div>
              </div>

              <div class="line"></div>

              <ul class="desc-list">
                <li class="desc-item">
                  <img class="desc-icon" :src="paletteIcon" alt="" />
                  <h3 class="desc-title">{{ t('home.creation.features.scalable.title') }}</h3>
                  <p class="desc-text">{{ t('home.creation.features.scalable.description') }}</p>
                </li>
                <li class="desc-item">
                  <img class="desc-icon" :src="figmaIcon" alt="" />
                  <h3 class="desc-title">{{ t('home.creation.features.resources.title') }}</h3>
                  <p class="desc-text">{{ t('home.creation.features.resources.description') }}</p>
                </li>
                <li class="desc-item">
                  <img class="desc-icon" :src="fileIcon" alt="" />
                  <h3 class="desc-title">{{ t('home.creation.features.guidelines.title') }}</h3>
                  <p class="desc-text">{{ t('home.creation.features.guidelines.description') }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div
            :class="[
              'module-board__card',
              'module-contributor',
              {
                'module-board__card--active': currentTab === 2,
              },
            ]"
          >
            <div class="module-board__card-desc">
              <h3 class="title">{{ t('home.contributors.title') }}</h3>
              <p class="desc">{{ t('home.contributors.description') }}</p>
            </div>
            <community-card v-if="shouldLoadCommunity" />
          </div>
        </div>
      </div>
    </div>

    <business-cases data-board-section="after" />

    <industry-cases data-board-section="after" />
    <div class="module-setup" data-board-section="after">
      <div class="module-setup__content">
        <div class="module-setup__heading">
          <h2 class="module-title">{{ t('home.setup.title') }}</h2>
          <p class="module-description">{{ t('home.setup.description') }}</p>
        </div>
        <div class="module-setup__actions">
          <t-button
            class="module-setup__button"
            theme="default"
            shape="round"
            size="large"
            href="https://github.com/Tencent/tdesign"
            target="_blank"
          >
            <template #icon><img class="module-setup__icon" src="./assets/setup-github.svg" alt="" /></template>
            {{ t('home.setup.developmentAction') }}
          </t-button>
          <t-button
            class="module-setup__button module-setup__button--design"
            theme="default"
            shape="round"
            size="large"
            href="https://www.figma.com/@tencent"
            target="_blank"
          >
            <template #icon><img class="module-setup__icon" src="./assets/setup-figma.svg" alt="" /></template>
            {{ t('home.setup.designAction') }}
          </t-button>
        </div>
      </div>
    </div>

    <td-doc-footer mode="site" :style="footerStyle" data-board-section="after" />
    <td-backtop />
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { DesktopIcon, Icon } from 'tdesign-icons-vue-next';
// @ts-expect-error prismjs does not publish TypeScript declarations.
import Prismjs from 'prismjs';
import 'prismjs/components/prism-dart';

import homeMessages from '@/locales/pages/home';

import figmaIcon from './assets/figma.svg';
import fileIcon from './assets/file.svg';
import openFrameworksIcon from './assets/open-frameworks.svg';
import openIndustriesIcon from './assets/open-industries.svg';
import openPlatformsIcon from './assets/open-platforms.svg';
import paletteIcon from './assets/palette.svg';
import Banner from './banner.vue';
import BusinessCases from './business-cases.vue';
import IndustryCases from './industry-cases.vue';
import ResourceSection from './resource-section.vue';
import { createHomeDemoModel } from './logic/demo-model';
import { createModuleBoard } from './logic/module-board';
import { createHomeNews } from './logic/news';
import { createHomeTheme } from './logic/theme';

const CommunityCard = defineAsyncComponent(() => import('./community-card.vue'));
const { t } = useI18n({ messages: homeMessages });
const homepageRef = ref<HTMLElement | null>(null);
const {
  currentTab,
  handleModuleBoardFocus,
  moduleBoardInnerRef,
  moduleBoardRef,
  moduleBoardScrollEnabled,
  moduleBoardStyle,
  moduleBoardViewportRef,
  moduleBoardViewportStyle,
  scheduleModuleBoardUpdate,
  tabTransformWidth,
  windowWidth,
} = createModuleBoard(homepageRef);
const { handleClickNews, loopedNewsList, newsList, newsTrackRef, startNewsAutoplay, stopNewsAutoplay } =
  createHomeNews(windowWidth);
const { themeMode } = createHomeTheme();
const {
  codeFramework,
  codeFrameworkOptions,
  codeList,
  componentModel,
  componentSelectOptions,
  componentTreeData,
  displayCode,
} = createHomeDemoModel(t);

const shouldLoadCommunity = ref(false);
let communityPreloadObserver: IntersectionObserver | null = null;
const footerStyle = computed(() => ({
  '--content-padding-right': '0',
  '--content-max-width': '1440px',
  '--content-padding-left-right': '48px',
  '--footer-inner-position': 'relative',
  '--footer-logo-position': 'unset',
}));

function loadCommunity(): void {
  if (shouldLoadCommunity.value) return;
  shouldLoadCommunity.value = true;
  communityPreloadObserver?.disconnect();
  communityPreloadObserver = null;
}

watch(currentTab, (tab) => {
  if (tab >= 1) loadCommunity();
});

watch(
  codeFramework,
  () => {
    requestAnimationFrame(() => Prismjs.highlightAll());
  },
  { immediate: true },
);

onMounted(() => {
  if (!moduleBoardRef.value) return;
  communityPreloadObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) loadCommunity();
    },
    { rootMargin: '100% 0px' },
  );
  communityPreloadObserver.observe(moduleBoardRef.value);
});

onBeforeUnmount(() => {
  communityPreloadObserver?.disconnect();
});
</script>
