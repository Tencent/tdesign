<template>
  <section class="tdesign-homepage">
    <banner :themeMode="themeMode" />

    <section class="main-page">
      <div class="banner-info">
        <div class="banner-info__left">
          <h2 class="name">
            <p class="primary">TDesign</p>
            <div style="display: flex">
              <p class="sub-title">{{ t('home.hero.subtitle') }}</p>
              <t-popconfirm :popup-props="{ trigger: 'hover' }" placement="top-left">
                <t-tag class="tds-intro-button" theme="primary" style="height: 24px; cursor: pointer">{{
                  t('home.hero.alliance.title')
                }}</t-tag>
                <template #content>
                  <div class="tds-intro">
                    <h4>{{ t('home.hero.alliance.title') }}</h4>
                    <p>{{ t('home.hero.alliance.description') }}</p>
                  </div>
                </template>
                <template #icon><div /></template>
                <template #cancelBtn><div /></template>
                <template #confirmBtn>
                  <t-button
                    size="small"
                    style="margin-left: 8px"
                    @click="() => handleIntroClick('https://tds.qq.com/?from=tdesign')"
                    >{{ t('home.hero.alliance.details') }}</t-button
                  >
                </template>
              </t-popconfirm>
            </div>
          </h2>
        </div>
        <t-popup trigger="click" placement="left" overlay-inner-class-name="wechat-qrcode" :z-index="100">
          <div class="banner-booking">
            <img src="./assets/tdesign-profile.png" />
            <div class="banner-booking__info">
              {{ windowWidth > 960 ? t('home.hero.followWechat') : t('home.hero.followWechatCompact') }}
            </div>
          </div>
          <template #content><img width="100" src="https://tdesign.gtimg.com/site/wechat-account.png" /></template>
        </t-popup>
      </div>
      <div class="module-news" v-if="newsList.length > 0">
        <div ref="newsTrackRef" class="module-news__track" @scroll="handleNewsScroll">
          <div
            v-for="(news, index) in newsList"
            :key="index"
            class="module-news__item"
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
        <div v-if="canScrollNewsBack" class="module-news__mask module-news__mask--left" aria-hidden="true"></div>
        <button
          v-if="canScrollNewsBack"
          type="button"
          class="module-news__previous"
          aria-label="Previous news"
          @click="handlePreviousNews"
        >
          <svg aria-hidden="true" viewBox="0 0 36 36">
            <path d="M21.75 9.75L13.5 18L21.75 26.25" />
          </svg>
        </button>
        <div v-if="canScrollNewsForward" class="module-news__mask module-news__mask--right" aria-hidden="true"></div>
        <button
          v-if="canScrollNewsForward"
          type="button"
          class="module-news__next"
          aria-label="Next news"
          @click="handleNextNews"
        >
          <svg aria-hidden="true" viewBox="0 0 36 36">
            <path d="M14.25 26.25L22.5 18L14.25 9.75" />
          </svg>
        </button>
      </div>
      <resource-section />
    </section>

    <!-- swiper content -->
    <div ref="moduleBoardRef" class="module-board" id="moduleBoard">
      <div class="module-board__inner" :style="`transform: translateX(-${tabTransformWidth}px);`">
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
                <li class="code-item" v-for="item in codeList[codeFramework]" :key="item.code">
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
                    <t-menu-item value="detail/advanced">{{ t('home.componentDemo.menu.advancedDetail') }}</t-menu-item>
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
                  <t-radio-group defaultValue="1" variant="default-filled">
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
                <icon class="desc-icon" name="tips" />
                <h3 class="desc-title">{{ t('home.creation.features.scalable.title') }}</h3>
                <p class="desc-text">{{ t('home.creation.features.scalable.description') }}</p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="chart-bubble" />
                <h3 class="desc-title">{{ t('home.creation.features.resources.title') }}</h3>
                <p class="desc-text">{{ t('home.creation.features.resources.description') }}</p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="file-image" />
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
          <community-card />
        </div>
      </div>
    </div>

    <business-cases />

    <industry-cases />
    <div class="module-setup">
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
            href="https://www.figma.com/@tdesign"
            target="_blank"
          >
            <template #icon><img class="module-setup__icon" src="./assets/setup-figma.svg" alt="" /></template>
            {{ t('home.setup.designAction') }}
          </t-button>
        </div>
      </div>
    </div>

    <td-backtop />
    <td-doc-footer :style="footerStyle" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { DesktopIcon, Icon } from 'tdesign-icons-vue-next';
import Banner from './banner.vue';
import BusinessCases from './business-cases.vue';
import CommunityCard from './community-card.vue';
import IndustryCases from './industry-cases.vue';
import openFrameworksIcon from './assets/open-frameworks.svg';
import openIndustriesIcon from './assets/open-industries.svg';
import openPlatformsIcon from './assets/open-platforms.svg';
import ResourceSection from './resource-section.vue';
// @ts-expect-error prismjs does not publish TypeScript declarations.
import Prismjs from 'prismjs';

import homeMessages from '@/locales/pages/home';
import type { ThemeMode } from '@/pages/types';

const newsUrl = 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com/news';

type CodeFramework = 'vue' | 'vue-next' | 'react' | 'angular' | 'miniprogram' | 'mobile-vue';

interface CodeItem {
  type: string;
  code?: string;
  codeKey?: string;
}

interface NewsItem {
  title: string;
  desc: string;
  date: string;
  url?: string;
  isIntranet?: boolean;
}

interface HomeState {
  currentTab: number;
  newsList: NewsItem[];
  tabTransformWidth: number;
  windowWidth: number;
  themeMode: ThemeMode;
  codeFramework: CodeFramework;
  codeList: Record<CodeFramework, CodeItem[]>;
  componentModel: {
    selectValue: string[];
    menuExpanded: string[];
    sliderValue: number;
    colorList1: string[];
    colorList2: string[];
  };
}

const isIntranet = location.host.includes('woa.com'); // 部分动态或内容只能通过内网访问

const { t } = useI18n({ messages: homeMessages });
const moduleBoardRef = ref<HTMLElement | null>(null);
const newsTrackRef = ref<HTMLElement | null>(null);
const canScrollNewsBack = ref(false);
const canScrollNewsForward = ref(false);

const codeFrameworkOptions: Array<{ label: string; value: CodeFramework }> = [
  { label: 'vue.js', value: 'vue' },
  { label: 'vue-next.js', value: 'vue-next' },
  { label: 'react.js', value: 'react' },
  { label: 'angular.js', value: 'angular' },
  { label: 'mini-program.js', value: 'miniprogram' },
  { label: 'vue-mobile.js', value: 'mobile-vue' },
];

const state = reactive<HomeState>({
  currentTab: 0,
  newsList: [],
  tabTransformWidth: 0,
  windowWidth: window.innerWidth,
  themeMode: 'light',
  codeFramework: 'vue',
  codeList: {
    vue: [
      { type: 'bash', code: 'npm i tdesign-vue' },
      { type: 'javascript', code: "import Vue from 'vue';" },
      { type: 'javascript', code: "import TDesign from 'tdesign-vue';" },
      { type: 'javascript', code: 'Vue.use(TDesign);' },
    ],
    'vue-next': [
      { type: 'bash', code: 'npm i tdesign-vue-next' },
      { type: 'javascript', code: "import { createApp } from 'vue';" },
      { type: 'javascript', code: "import TDesign from 'tdesign-vue-next';" },
      { type: 'javascript', code: 'createApp(App).use(TDesign);' },
    ],
    react: [
      { type: 'bash', code: 'npm i tdesign-react' },
      { type: 'javascript', code: "import React from 'react';" },
      { type: 'javascript', code: "import { Button } from 'tdesign-react';" },
      { type: 'javascript', code: 'export default () => <Button>TDesign</Button>;' },
    ],
    angular: [
      { type: 'bash', code: 'npm i tdesign-angular' },
      { type: 'javascript', code: "import { TDesignModule } from 'tdesign-angular';" },
      { type: 'javascript', code: '@NgModule({ imports: [TDesignModule] })' },
      { type: 'javascript', code: 'export class AppModule {}' },
    ],
    miniprogram: [
      { type: 'bash', code: 'npm i tdesign-miniprogram' },
      { type: 'javascript', code: '{ "usingComponents": { "t-tag": "tdesign-miniprogram/tag/tag" } }' },
      { type: 'javascript', codeKey: 'home.code.importantTag' },
      { type: 'javascript', code: 'Page({})' },
    ],
    'mobile-vue': [
      { type: 'bash', code: 'npm i tdesign-mobile-vue' },
      { type: 'javascript', code: "import { createApp } from 'vue';" },
      { type: 'javascript', code: "import TDesign from 'tdesign-mobile-vue';" },
      { type: 'javascript', code: 'createApp(App).use(TDesign);' },
    ],
  },
  componentModel: {
    selectValue: ['1'],
    menuExpanded: ['dashboard'],
    sliderValue: 60,
    colorList1: [
      '#ecf2fe',
      '#d4e3fc',
      '#bbd3fb',
      '#96bbf8',
      '#699ef5',
      '#4787f0',
      '#266fe8',
      '#0052d9',
      '#0034b5',
      '#001f97',
    ],
    colorList2: [
      '#ebedf1',
      '#e3e6eB',
      '#d6dbe3',
      '#bcc4d0',
      '#97a3b7',
      '#7787a2',
      '#5f7292',
      '#4b5b76',
      '#3c485c',
      '#2c3645',
    ],
  },
});

const { currentTab, newsList, tabTransformWidth, windowWidth, themeMode, codeFramework, codeList, componentModel } =
  toRefs(state);
const componentSelectOptions = computed(() => [
  { label: t('home.componentDemo.departments.marketing'), value: '1' },
  { label: t('home.componentDemo.departments.finance'), value: '2' },
  { label: t('home.componentDemo.departments.development'), value: '3' },
]);
const componentTreeData = computed(() => [
  {
    value: '1',
    label: t('home.componentDemo.regions.headquarters'),
  },
  {
    value: '2',
    label: t('home.componentDemo.regions.eastChina'),
    children: [
      {
        value: '2.1',
        label: t('home.componentDemo.departments.marketing'),
      },
      {
        value: '2.2',
        label: t('home.componentDemo.departments.finance'),
      },
    ],
  },
  {
    value: '3',
    label: t('home.componentDemo.regions.southChina'),
    children: [
      {
        value: '3.1',
        label: t('home.componentDemo.departments.marketing'),
      },
      {
        value: '3.2',
        label: t('home.componentDemo.departments.finance'),
      },
    ],
  },
]);
const footerStyle = computed(() => ({
  '--content-padding-right': '0',
  '--content-max-width': '1440px',
  '--content-padding-left-right': '48px',
  '--footer-inner-position': 'relative',
  '--footer-logo-position': 'unset',
}));
let observer: MutationObserver | null = null;
let wheelLocked = false;
let wheelUnlockTimer: number | null = null;

function displayCode(item: CodeItem): string {
  return item.codeKey ? String(t(item.codeKey)) : item.code ?? '';
}

function scheduleWheelUnlock(): void {
  if (wheelUnlockTimer !== null) clearTimeout(wheelUnlockTimer);
  wheelUnlockTimer = window.setTimeout(() => {
    wheelLocked = false;
    wheelUnlockTimer = null;
  }, 180);
}

function handleModuleWheel(event: WheelEvent): void {
  if (event.deltaY === 0) return;
  if (wheelLocked) {
    event.preventDefault();
    event.stopPropagation();
    scheduleWheelUnlock();
    return;
  }

  const direction = event.deltaY > 0 ? 1 : -1;
  const nextTab = state.currentTab + direction;
  if (nextTab < 0 || nextTab > 2) return;

  event.preventDefault();
  event.stopPropagation();
  state.currentTab = nextTab;
  wheelLocked = true;
  scheduleWheelUnlock();
}

function handleClickNews(url?: string): void {
  if (url) window.open(url, '_blank');
}

function updateNewsControls(): void {
  const track = newsTrackRef.value;
  if (!track) return;
  canScrollNewsBack.value = track.scrollLeft > 1;
  canScrollNewsForward.value = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
}

function handleNewsScroll(): void {
  updateNewsControls();
}

function handlePreviousNews(): void {
  const track = newsTrackRef.value;
  if (!track) return;
  const firstCardOffset = track.querySelector<HTMLElement>('.module-news__item')?.offsetLeft ?? 0;
  const left = track.scrollLeft <= 358 + firstCardOffset ? 0 : track.scrollLeft - 358;
  track.scrollTo({ left, behavior: 'smooth' });
}

function handleNextNews(): void {
  const track = newsTrackRef.value;
  if (!track) return;
  const firstCardOffset = track.querySelector<HTMLElement>('.module-news__item')?.offsetLeft ?? 0;
  const distance = track.scrollLeft <= 1 ? 358 + firstCardOffset : 358;
  track.scrollBy({ left: distance, behavior: 'smooth' });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseNews(value: unknown): NewsItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.title !== 'string' ||
      typeof item.desc !== 'string' ||
      typeof item.date !== 'string'
    ) {
      return [];
    }
    return [
      {
        title: item.title,
        desc: item.desc,
        date: item.date,
        url: typeof item.url === 'string' ? item.url : undefined,
        isIntranet: item.isIntranet === true,
      },
    ];
  });
}

function getNews(): void {
  fetch(newsUrl).then((data) => {
    data.json().then((value: unknown) => {
      const list = parseNews(value);
      state.newsList = isIntranet ? list : list.filter((value) => !value.isIntranet);
      requestAnimationFrame(updateNewsControls);
    });
  });
}

function handleIntroClick(url: string): void {
  window.open(url, '_blank');
}

function handleResize(): void {
  state.windowWidth = window.innerWidth;
  state.currentTab = 0;
  requestAnimationFrame(updateNewsControls);
}

function watchHtmlMode(): void {
  state.themeMode = document.documentElement.getAttribute('theme-mode') === 'dark' ? 'dark' : 'light';
  const targetNode = document.documentElement;
  const callback = (mutationsList: MutationRecord[]): void => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'theme-mode') {
        state.themeMode = (mutation.target as Element).getAttribute('theme-mode') === 'dark' ? 'dark' : 'light';
      }
    }
  };

  observer = new MutationObserver(callback);
  observer.observe(targetNode, { attributes: true });
}

watch(currentTab, (tab) => {
  if (state.windowWidth >= 888) {
    if (tab === 0) state.tabTransformWidth = 0;
    else if (tab === 1) state.tabTransformWidth = 1048;
    else state.tabTransformWidth = 2016;
  } else {
    if (tab === 0) state.tabTransformWidth = 0;
    else if (tab === 1) state.tabTransformWidth = state.windowWidth - 20;
    else state.tabTransformWidth = state.windowWidth * 2;
  }
});

watch(
  codeFramework,
  () => {
    requestAnimationFrame(() => Prismjs.highlightAll());
  },
  { immediate: true },
);

onMounted(() => {
  watchHtmlMode();
  getNews();
  window.addEventListener('resize', handleResize);
  moduleBoardRef.value?.addEventListener('wheel', handleModuleWheel, { passive: false });
});

onBeforeUnmount(() => {
  if (wheelUnlockTimer !== null) clearTimeout(wheelUnlockTimer);
  observer?.disconnect();
  window.removeEventListener('resize', handleResize);
  moduleBoardRef.value?.removeEventListener('wheel', handleModuleWheel);
});
</script>
