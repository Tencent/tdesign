<template>
  <section class="tdesign-homepage">
    <banner :themeMode="themeMode" />

    <section class="main-page">
      <div class="banner-info">
        <div class="banner-info__left">
          <h2 class="name">
            <p class="primary">TDesign</p>
            <div style="display: flex">
              <p :class="['sub-title', { 'sub-title--en': locale === 'en-US' }]">
                {{ t('home.hero.subtitle') }}
              </p>
            </div>
          </h2>
        </div>
        <t-popup trigger="hover" placement="top" overlay-inner-class-name="wechat-qrcode" :z-index="100">
          <div class="banner-booking" data-screenshot-root>
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
            :key="`${index >= newsList.length ? 'clone' : 'original'}-${index % newsList.length}`"
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
        :tabindex="moduleBoardScrollEnabled ? undefined : 0"
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
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { DesktopIcon, Icon } from 'tdesign-icons-vue-next';
import Banner from './banner.vue';
import BusinessCases from './business-cases.vue';
import IndustryCases from './industry-cases.vue';
import figmaIcon from './assets/figma.svg';
import fileIcon from './assets/file.svg';
import openFrameworksIcon from './assets/open-frameworks.svg';
import openIndustriesIcon from './assets/open-industries.svg';
import openPlatformsIcon from './assets/open-platforms.svg';
import paletteIcon from './assets/palette.svg';
import ResourceSection from './resource-section.vue';
import { canAccessWoa, HOME_API_ENDPOINTS } from './api';
// @ts-expect-error prismjs does not publish TypeScript declarations.
import Prismjs from 'prismjs';
import 'prismjs/components/prism-dart';

import homeMessages from '@/locales/pages/home';
import type { ThemeMode } from '@/pages/types';

const CommunityCard = defineAsyncComponent(() => import('./community-card.vue'));
const newsItemStride = 342 + 16;

type CodeFramework = 'vue-next' | 'react' | 'flutter' | 'miniprogram' | 'uniapp';

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

const { locale, t } = useI18n({ messages: homeMessages });
const moduleBoardRef = ref<HTMLElement | null>(null);
const moduleBoardViewportRef = ref<HTMLElement | null>(null);
const moduleBoardInnerRef = ref<HTMLElement | null>(null);
const moduleBoardScrollEnabled = ref(false);
const moduleBoardStyle = ref<Record<string, string>>({});
const moduleBoardViewportStyle = ref<Record<string, string>>({});
const newsTrackRef = ref<HTMLElement | null>(null);
const shouldLoadCommunity = ref(false);
const isIntranet = ref(false); // 部分动态或内容只能通过内网访问

const codeFrameworkOptions: Array<{ label: string; value: CodeFramework }> = [
  { label: 'vue-next.ts', value: 'vue-next' },
  { label: 'react.tsx', value: 'react' },
  { label: 'flutter.dart', value: 'flutter' },
  { label: 'mini-program.js', value: 'miniprogram' },
  { label: 'uniapp.js', value: 'uniapp' },
];

const state = reactive<HomeState>({
  currentTab: 0,
  newsList: [],
  tabTransformWidth: 0,
  windowWidth: window.innerWidth,
  themeMode: 'light',
  codeFramework: 'vue-next',
  codeList: {
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
    flutter: [
      {
        type: 'dart',
        code: `import 'package:tdesign_flutter/tdesign_flutter.dart';

void main() => runApp(
  const MaterialApp(
    home: TButton(child: Text('按钮')),
  ),
);`,
      },
    ],
    miniprogram: [
      { type: 'bash', code: 'npm i tdesign-miniprogram' },
      { type: 'javascript', code: '{ "usingComponents": { "t-tag": "tdesign-miniprogram/tag/tag" } }' },
      { type: 'javascript', codeKey: 'home.code.importantTag' },
      { type: 'javascript', code: 'Page({})' },
    ],
    uniapp: [
      { type: 'bash', code: 'npm i @tdesign/uniapp' },
      { type: 'javascript', code: "import TButton from '@tdesign/uniapp/button/button.vue';" },
      { type: 'markup', code: '<t-button size="large"> 按钮 </t-button>' },
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
const loopedNewsList = computed(() => {
  if (newsList.value.length <= 1) return newsList.value;

  const cycleWidth = newsList.value.length * newsItemStride;
  const copyCount = Math.ceil(windowWidth.value / cycleWidth) + 2;
  return Array.from({ length: copyCount }, () => newsList.value).flat();
});
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
let communityPreloadObserver: IntersectionObserver | null = null;
let moduleBoardResizeObserver: ResizeObserver | null = null;
let moduleBoardMotionQuery: MediaQueryList | null = null;
let moduleBoardAnimationFrame: number | null = null;
let moduleBoardSnapTimer: ReturnType<typeof setTimeout> | null = null;
let moduleBoardSnapAnimationFrame: number | null = null;
let moduleBoardScrollDirection: -1 | 0 | 1 = 0;
let moduleBoardLastScrollY: number | null = null;
let moduleBoardNeedsMeasure = true;
let moduleBoardStops: number[] = [];
let moduleBoardPinTop = 0;
let moduleBoardScrollDistance = 0;
const moduleBoardDwellDistance = 320;
const moduleBoardMoveDistance = 900;
const moduleBoardSnapDelay = 120;
let newsAnimationFrame: number | null = null;
let newsLastTimestamp = 0;

function displayCode(item: CodeItem): string {
  return item.codeKey ? String(t(item.codeKey)) : item.code ?? '';
}

function measureModuleBoard(): void {
  const board = moduleBoardRef.value;
  const viewport = moduleBoardViewportRef.value;
  const inner = moduleBoardInnerRef.value;
  if (!board || !viewport || !inner) return;

  const cards = Array.from(inner.querySelectorAll<HTMLElement>('.module-board__card'));
  const height = inner.offsetHeight;
  const enabled = !moduleBoardMotionQuery?.matches;
  const wasEnabled = moduleBoardScrollEnabled.value;

  moduleBoardStops = cards.map((card) => Math.max(0, card.offsetLeft + card.offsetWidth / 2 - board.clientWidth / 2));
  moduleBoardPinTop = (window.innerHeight - height) / 2;
  moduleBoardScrollDistance = enabled
    ? cards.length * moduleBoardDwellDistance + Math.max(0, cards.length - 1) * moduleBoardMoveDistance
    : 0;
  moduleBoardScrollEnabled.value = enabled;
  moduleBoardStyle.value = enabled ? { height: `${height + moduleBoardScrollDistance}px` } : {};

  if (enabled) {
    viewport.scrollLeft = 0;
  } else {
    moduleBoardViewportStyle.value = {};
    state.tabTransformWidth = 0;
    if (wasEnabled) {
      const left = moduleBoardStops[state.currentTab] ?? 0;
      nextTick(() => viewport.scrollTo({ left, behavior: 'instant' }));
    }
  }
}

function updateModuleBoard(): void {
  moduleBoardAnimationFrame = null;
  if (moduleBoardNeedsMeasure) {
    moduleBoardNeedsMeasure = false;
    measureModuleBoard();
  }

  const board = moduleBoardRef.value;
  const viewport = moduleBoardViewportRef.value;
  if (!board || !viewport || moduleBoardStops.length === 0) return;

  let offset = viewport.scrollLeft;
  if (moduleBoardScrollEnabled.value) {
    const boardRect = board.getBoundingClientRect();
    const progress = Math.max(0, Math.min(moduleBoardScrollDistance, moduleBoardPinTop - boardRect.top));
    if (progress > 0 && progress < moduleBoardScrollDistance) {
      moduleBoardViewportStyle.value = {
        position: 'fixed',
        top: `${moduleBoardPinTop}px`,
        left: `${boardRect.left}px`,
        width: `${boardRect.width}px`,
      };
    } else {
      moduleBoardViewportStyle.value = { position: 'absolute', top: `${progress}px`, left: '0', width: '100%' };
    }
    offset = moduleBoardStops[moduleBoardStops.length - 1];
    for (let index = 0; index < moduleBoardStops.length - 1; index++) {
      const moveStart = moduleBoardDwellDistance + index * (moduleBoardDwellDistance + moduleBoardMoveDistance);
      if (progress <= moveStart) {
        offset = moduleBoardStops[index];
        break;
      }
      if (progress < moveStart + moduleBoardMoveDistance) {
        const fraction = (progress - moveStart) / moduleBoardMoveDistance;
        const eased = fraction * fraction * (3 - 2 * fraction);
        offset = moduleBoardStops[index] + (moduleBoardStops[index + 1] - moduleBoardStops[index]) * eased;
        break;
      }
    }
    state.tabTransformWidth = offset;
  }

  state.currentTab = moduleBoardStops.reduce(
    (nearest, stop, index) =>
      Math.abs(stop - offset) < Math.abs(moduleBoardStops[nearest] - offset) ? index : nearest,
    0,
  );
}

function scheduleModuleBoardUpdate(): void {
  if (moduleBoardAnimationFrame === null) moduleBoardAnimationFrame = requestAnimationFrame(updateModuleBoard);
}

function cancelModuleBoardSnapAnimation(): void {
  if (moduleBoardSnapAnimationFrame === null) return;
  cancelAnimationFrame(moduleBoardSnapAnimationFrame);
  moduleBoardSnapAnimationFrame = null;
  moduleBoardLastScrollY = window.scrollY;
}

function animateModuleBoardScroll(targetScrollY: number): void {
  cancelModuleBoardSnapAnimation();
  const startScrollY = window.scrollY;
  const distance = targetScrollY - startScrollY;
  const duration = Math.min(650, Math.max(360, Math.abs(distance) * 0.65));
  const startedAt = performance.now();

  const animate = (timestamp: number): void => {
    const progress = Math.min(1, (timestamp - startedAt) / duration);
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo({ top: startScrollY + distance * eased });

    if (progress < 1) {
      moduleBoardSnapAnimationFrame = requestAnimationFrame(animate);
    } else {
      moduleBoardSnapAnimationFrame = null;
      moduleBoardLastScrollY = window.scrollY;
    }
  };

  moduleBoardSnapAnimationFrame = requestAnimationFrame(animate);
}

function snapModuleBoardByDirection(): void {
  moduleBoardSnapTimer = null;
  const board = moduleBoardRef.value;
  if (!board || !moduleBoardScrollEnabled.value) return;

  const boardRect = board.getBoundingClientRect();
  const progress = moduleBoardPinTop - boardRect.top;
  if (progress <= 0 || progress >= moduleBoardScrollDistance) return;

  for (let index = 0; index < moduleBoardStops.length - 1; index++) {
    const moveStart = moduleBoardDwellDistance + index * (moduleBoardDwellDistance + moduleBoardMoveDistance);
    const moveEnd = moveStart + moduleBoardMoveDistance;
    if (progress <= moveStart || progress >= moveEnd) continue;

    const targetProgress =
      moduleBoardScrollDirection === 0
        ? progress - moveStart < moduleBoardMoveDistance / 2
          ? moveStart
          : moveEnd
        : moduleBoardScrollDirection > 0
        ? moveEnd
        : moveStart;
    animateModuleBoardScroll(window.scrollY + boardRect.top - moduleBoardPinTop + targetProgress);
    return;
  }
}

function handleModuleBoardScroll(): void {
  scheduleModuleBoardUpdate();
  if (moduleBoardSnapAnimationFrame !== null) return;

  const scrollY = window.scrollY;
  if (moduleBoardLastScrollY !== null && scrollY !== moduleBoardLastScrollY) {
    moduleBoardScrollDirection = scrollY > moduleBoardLastScrollY ? 1 : -1;
  }
  moduleBoardLastScrollY = scrollY;
  if (!moduleBoardScrollEnabled.value) return;

  if (moduleBoardSnapTimer !== null) clearTimeout(moduleBoardSnapTimer);
  moduleBoardSnapTimer = setTimeout(snapModuleBoardByDirection, moduleBoardSnapDelay);
}

function refreshModuleBoard(): void {
  moduleBoardNeedsMeasure = true;
  scheduleModuleBoardUpdate();
}

function handleModuleBoardFocus(event: FocusEvent): void {
  if (!moduleBoardScrollEnabled.value || !(event.target instanceof HTMLElement)) return;
  const card = event.target.closest<HTMLElement>('.module-board__card');
  const cards = moduleBoardInnerRef.value?.querySelectorAll<HTMLElement>('.module-board__card');
  const board = moduleBoardRef.value;
  if (!board || !card || !cards) return;

  const index = Array.from(cards).indexOf(card);
  if (index < 0 || index === state.currentTab) return;
  moduleBoardViewportRef.value?.scrollTo({ left: 0, behavior: 'instant' });
  window.scrollTo({
    top:
      window.scrollY +
      board.getBoundingClientRect().top -
      moduleBoardPinTop +
      index * (moduleBoardDwellDistance + moduleBoardMoveDistance),
    behavior: 'instant',
  });
  scheduleModuleBoardUpdate();
}

function handleClickNews(url?: string): void {
  if (url) window.open(url, '_blank');
}

function animateNews(timestamp: number): void {
  const track = newsTrackRef.value;
  const items = track?.querySelectorAll<HTMLElement>('.module-news__item');
  if (!track || !items || newsList.value.length < 2) {
    newsAnimationFrame = null;
    return;
  }

  if (newsLastTimestamp > 0) {
    const elapsed = Math.min(timestamp - newsLastTimestamp, 50);
    track.scrollLeft += (elapsed / 1000) * 48;

    const cycleWidth = items[newsList.value.length].offsetLeft - items[0].offsetLeft;
    if (cycleWidth > 0 && track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
  }

  newsLastTimestamp = timestamp;
  newsAnimationFrame = requestAnimationFrame(animateNews);
}

function startNewsAutoplay(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || newsAnimationFrame !== null) return;
  newsLastTimestamp = 0;
  newsAnimationFrame = requestAnimationFrame(animateNews);
}

function stopNewsAutoplay(): void {
  if (newsAnimationFrame === null) return;
  cancelAnimationFrame(newsAnimationFrame);
  newsAnimationFrame = null;
  newsLastTimestamp = 0;
}

function resetAndStartNewsAutoplay(): void {
  const track = newsTrackRef.value;
  if (track) track.scrollLeft = 0;
  startNewsAutoplay();
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

async function getNews(): Promise<void> {
  const [response, intranetAccessible] = await Promise.all([fetch(HOME_API_ENDPOINTS.news), canAccessWoa()]);
  const value: unknown = await response.json();
  const list = parseNews(value);

  isIntranet.value = intranetAccessible;
  state.newsList = isIntranet.value ? list : list.filter((item) => !item.isIntranet);
  nextTick(resetAndStartNewsAutoplay);
}

function handleResize(): void {
  state.windowWidth = window.innerWidth;
  refreshModuleBoard();
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
  watchHtmlMode();
  getNews();
  if (moduleBoardRef.value) {
    communityPreloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadCommunity();
      },
      { rootMargin: '100% 0px' },
    );
    communityPreloadObserver.observe(moduleBoardRef.value);
  }
  moduleBoardMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  moduleBoardMotionQuery.addEventListener('change', refreshModuleBoard);
  moduleBoardResizeObserver = new ResizeObserver(refreshModuleBoard);
  if (moduleBoardInnerRef.value) moduleBoardResizeObserver.observe(moduleBoardInnerRef.value);
  const mainPage = moduleBoardRef.value?.previousElementSibling;
  if (mainPage) moduleBoardResizeObserver.observe(mainPage);
  refreshModuleBoard();
  moduleBoardLastScrollY = window.scrollY;
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleModuleBoardScroll, { passive: true });
  window.addEventListener('wheel', cancelModuleBoardSnapAnimation, { passive: true });
  window.addEventListener('touchstart', cancelModuleBoardSnapAnimation, { passive: true });
});

onBeforeUnmount(() => {
  if (moduleBoardAnimationFrame !== null) cancelAnimationFrame(moduleBoardAnimationFrame);
  if (moduleBoardSnapTimer !== null) clearTimeout(moduleBoardSnapTimer);
  cancelModuleBoardSnapAnimation();
  stopNewsAutoplay();
  observer?.disconnect();
  communityPreloadObserver?.disconnect();
  moduleBoardResizeObserver?.disconnect();
  moduleBoardMotionQuery?.removeEventListener('change', refreshModuleBoard);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleModuleBoardScroll);
  window.removeEventListener('wheel', cancelModuleBoardSnapAnimation);
  window.removeEventListener('touchstart', cancelModuleBoardSnapAnimation);
});
</script>
