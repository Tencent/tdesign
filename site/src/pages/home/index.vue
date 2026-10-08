<template>
  <section class="tdesign-homepage">
    <banner :theme-mode="themeMode" />

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
      <div v-if="newsList.length > 0" class="module-news">
        <div v-for="(news, index) in newsList" :key="index" @click="() => handleClickNews(news.url)">
          <t-card :title="news.title" :description="news.desc" :style="{ cursor: news.url ? 'pointer' : null }"
            ><template #footer>{{ news.date }}</template>
          </t-card>
        </div>
      </div>
      <div class="module-intro">
        <div class="item web">
          <div class="steps-image" @mouseenter="stepsStart($event, 0)" @mouseleave="stepsEnd($event, 0)"></div>
          <p class="tag">{{ t('home.solution.label') }}</p>
          <h3 class="title">{{ t('home.solution.desktop') }}</h3>
          <div class="mask"></div>

          <div class="module-intro__content">
            <div class="source">
              <div class="content-name">{{ t('home.solution.developmentResources') }}</div>
              <div class="content-list">
                <div
                  v-for="item in sourceList"
                  :key="item.nameKey"
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ t(item.nameKey) }}</span>
                  <span
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ statusText(item.status) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <div class="design">
              <div class="content-name">{{ t('home.solution.designResources') }}</div>
              <div class="content-list">
                <div
                  v-for="item in designList"
                  :key="item.nameKey"
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ t(item.nameKey) }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ statusText(item.status) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="item mobile">
          <div class="steps-image" @mouseenter="stepsStart($event, 1)" @mouseleave="stepsEnd($event, 1)"></div>
          <p class="tag">{{ t('home.solution.label') }}</p>
          <h3 class="title">{{ t('home.solution.mobile') }}</h3>
          <div class="mask"></div>

          <div class="module-intro__content">
            <div class="source">
              <div class="content-name">{{ t('home.solution.developmentResources') }}</div>
              <div class="content-list">
                <div
                  v-for="item in mobileSourceList"
                  :key="item.nameKey"
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ t(item.nameKey) }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ statusText(item.status) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <div class="design">
              <div class="content-name">{{ t('home.solution.designResources') }}</div>
              <div class="content-list">
                <div
                  v-for="item in mobileDesignList"
                  :key="item.nameKey"
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ t(item.nameKey) }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ statusText(item.status) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item miniapp">
          <div class="steps-image" @mouseenter="stepsStart($event, 2)" @mouseleave="stepsEnd($event, 2)"></div>
          <p class="tag">{{ t('home.solution.label') }}</p>
          <h3 class="title">{{ t('home.solution.miniprogram') }}</h3>
          <div class="mask"></div>

          <div class="module-intro__content">
            <div class="source">
              <div class="content-name">{{ t('home.solution.developmentResources') }}</div>
              <div class="content-list">
                <div
                  v-for="item in miniSourceList"
                  :key="item.nameKey"
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ t(item.nameKey) }}</span>
                  <span
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ statusText(item.status) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <div class="design">
              <div class="content-name">{{ t('home.solution.designResources') }}</div>
              <div class="content-list">
                <div
                  v-for="item in mobileDesignList"
                  :key="item.nameKey"
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ t(item.nameKey) }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ statusText(item.status) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- swiper tabs -->
    <div class="module-board module-board__tabs">
      <div class="module-board__content" @click="currentTab = 0">
        <h3 :class="['tencent-title', { 'tencent-title--active': currentTab === 0 }]">
          {{ t('home.tabs.open') }}
        </h3>
        <div v-if="currentTab === 0" class="line"></div>
      </div>
      <div class="module-board__content" @click="currentTab = 1">
        <h3 :class="['tencent-title', { 'tencent-title--active': currentTab === 1 }]">
          {{ t('home.tabs.creation') }}
        </h3>
        <div v-if="currentTab === 1" class="line"></div>
      </div>
      <div class="module-board__content" @click="currentTab = 2">
        <h3 :class="['tencent-title', { 'tencent-title--active': currentTab === 2 }]">
          {{ t('home.tabs.corporation') }}
        </h3>
        <div v-if="currentTab === 2" class="line"></div>
      </div>
    </div>
    <!-- swiper content -->
    <div id="moduleBoard" class="module-board">
      <div class="module-board__inner" :style="`transform: translateX(-${tabTransformWidth}px);`">
        <div
          :class="[
            'module-board__card',
            {
              'module-board__card--active': currentTab === 0,
            },
          ]"
        >
          <div class="module-board__detail">
            <div class="code-board">
              <t-radio-group v-model="codeFramework" class="code-tab" variant="default-filled" size="large">
                <t-radio-button value="vue">vue</t-radio-button>
                <t-radio-button value="vue-next">vue-next</t-radio-button>
                <t-radio-button value="react">react</t-radio-button>
                <t-radio-button value="miniprogram">miniprogram</t-radio-button>
                <t-radio-button value="mobile-vue">mobile-vue</t-radio-button>
                <t-radio-button value="mobile-react">mobile-react</t-radio-button>
                <t-radio-button value="flutter">flutter</t-radio-button>
              </t-radio-group>

              <ul class="code-list">
                <li v-for="item in codeList[codeFramework]" :key="item.code" class="code-item">
                  <pre><code :class="[`language-${item.type}`]">{{ displayCode(item) }}</code></pre>
                </li>
              </ul>
            </div>

            <div class="line"></div>

            <ul class="desc-list">
              <li class="desc-item">
                <icon class="desc-icon" name="fork" />
                <h3 class="desc-title">{{ t('home.open.features.frameworks.title') }}</h3>
                <p class="desc-text">{{ t('home.open.features.frameworks.description') }}</p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="desktop" />
                <h3 class="desc-title">{{ t('home.open.features.platforms.title') }}</h3>
                <p class="desc-text">{{ t('home.open.features.platforms.description') }}</p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="precise-monitor" />
                <h3 class="desc-title">{{ t('home.open.features.industries.title') }}</h3>
                <p class="desc-text">{{ t('home.open.features.industries.description') }}</p>
              </li>
            </ul>
          </div>
          <div v-if="currentTab === 0" class="module-board__card-desc">
            <h3 class="title">{{ t('home.open.title') }}</h3>
            <p class="desc">{{ t('home.open.description') }}</p>
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
          <div class="module-board__detail">
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
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></t-option>
                </t-select>
                <t-tree :data="componentTreeData" hover checkable expand-all />
              </div>
              <div class="component-board-item">
                <t-menu
                  :theme="themeMode"
                  default-value="dashboard/base"
                  :default-expanded="componentModel.menuExpanded"
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
                  <t-slider v-model="componentModel.sliderValue" :input-number-props="false" />
                </div>
                <div class="component-board-item-row">
                  <t-switch size="large" :default-value="true" />
                  <t-switch size="large" />
                  <t-check-tag>{{ t('home.componentDemo.checkableTag') }}</t-check-tag>
                  <t-tag>{{ t('home.componentDemo.defaultTag') }}</t-tag>
                </div>
                <div>
                  <t-radio-group default-value="1" variant="default-filled">
                    <t-radio-button value="1">{{ t('home.componentDemo.light') }}</t-radio-button>
                    <t-radio-button value="2">{{ t('home.componentDemo.dark') }}</t-radio-button>
                    <t-radio-button value="3">{{ t('home.componentDemo.neutral') }}</t-radio-button>
                  </t-radio-group>
                </div>
                <div class="color-block-wrapper">
                  <span
                    v-for="color in componentModel.colorList1"
                    :key="color"
                    class="color-block"
                    :style="{ background: color }"
                  ></span>
                </div>
                <div class="color-block-wrapper">
                  <span
                    v-for="color in componentModel.colorList2"
                    :key="color"
                    class="color-block"
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
          <div v-if="currentTab === 1" class="module-board__card-desc">
            <h3 class="title">{{ t('home.creation.title') }}</h3>
            <p class="desc">{{ t('home.creation.description') }}</p>
          </div>
        </div>
        <div
          v-show="currentTab === 2"
          :class="[
            'module-board__card',
            'module-contributor',
            {
              'module-board__card--active': currentTab === 2,
            },
          ]"
        >
          <div class="module-contributor__top">
            <div class="module-contributor__avatars">
              <avatar
                v-for="(item, index) in topContributors"
                ref="topAvatars"
                :key="index + 'top'"
                :href="githubUrl(item)"
                :src="githubAvatar(item)"
              />
            </div>
          </div>

          <div class="module-contributor__center">
            <component-list :theme-mode="themeMode" />
          </div>

          <div class="module-contributor__bottom">
            <div class="module-contributor__avatars">
              <avatar
                v-for="(item, index) in bottomContributors"
                ref="bottomAvatars"
                :key="index + 'bottom'"
                :href="githubUrl(item)"
                :src="githubAvatar(item)"
              />
            </div>
          </div>
          <div class="module-board__card-desc">
            <h3 class="title">{{ t('home.contributors.title') }}</h3>
            <p class="desc">{{ t('home.contributors.description') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="module-service">
      <div class="module-service__inner">
        <div class="image-rope"></div>

        <div class="content">
          <h3 class="module-top-title">{{ t('home.service.title') }}</h3>
          <h3 class="module-title">
            <p class="tag">
              1580
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.7498 35.0002L21.7502 10.9929L30.0125 19.2552L30.366 19.6088L30.7196 19.2552L32.4873 17.4875L32.8409 17.1339L32.4873 16.7804L20.8841 5.17715L20.5306 5.53071L20.8841 5.17715C20.396 4.689 19.6045 4.689 19.1164 5.17715L19.4674 5.52823L19.1164 5.17715L7.51315 16.7804L7.15959 17.1339L7.51315 17.4875L9.28091 19.2552L9.63447 19.6088L9.98802 19.2552L18.2502 10.9931L18.2498 35.0001L18.2498 35.5001L18.7498 35.5001L21.2498 35.5001L21.7498 35.5002L21.7498 35.0002Z"
                  fill="#0052D9"
                  stroke="#0052D9"
                  style="
                    fill: #0052d9;
                    fill: color(display-p3 0 0.3216 0.851);
                    fill-opacity: 1;
                    stroke: #0052d9;
                    stroke: color(display-p3 0 0.3216 0.851);
                    stroke-opacity: 1;
                  "
                />
              </svg>
            </p>
          </h3>
          <p class="module-sub-title">{{ t('home.service.usage') }}</p>
          <p class="module-description">{{ t('home.service.description') }}</p>
          <div class="module-brand-wall">
            <div class="mask left" />
            <div class="mask middle" />
            <div class="mask right" />

            <t-space break-line :size="14">
              <div
                v-for="({ title, logo, width }, index) in brandList"
                :key="index"
                class="brand-content"
                :style="`width:${width}`"
              >
                <t-popup show-arrow :content="title">
                  <img :src="logo" />
                </t-popup>
              </div>
            </t-space>
          </div>
        </div>
      </div>
    </div>
    <div class="module-setup">
      <img class="__light__ tdesign-flow" src="./assets/tdesign-flow-light.gif" alt="logo" />
      <img class="__dark__ tdesign-flow" src="./assets/tdesign-flow-dark.gif" alt="logo" />
      <p class="module-title">{{ t('home.setup.title') }}</p>
      <p class="module-description">{{ t('home.setup.description') }}</p>
      <t-button href="https://github.com/Tencent/tdesign">{{ t('home.setup.action') }}</t-button>
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
import Avatar from './avatar.vue';
import ComponentList from './component-list.vue';
// @ts-expect-error prismjs does not publish TypeScript declarations.
import Prismjs from 'prismjs';

import vueLogo from '@/assets/vue-logo.svg';
import reactLogo from '@/assets/react-logo.svg';
import figmaLogo from '@/assets/figma-logo.svg';
import axLogo from '@/assets/ax-logo.svg';
import xdLogo from '@/assets/xd-logo.svg';
import flutterLogo from '@/assets/flutter-logo.svg';
import uniappLogo from '@/assets/uniapp-logo.png';
import sketchLogo from '@/assets/sketch-logo.svg';
import miniprogramLogo from '@/assets/miniprogram-logo.svg';
import homeMessages from '@/locales/pages/home';
import type { ThemeMode } from '@/pages/types';

import { figmaWebUrl, figmaMobileUrl, sketchWebUrl, sketchMobileUrl, axWebUrl, xdWebUrl } from '@constants';

const brandUrl = 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com/brand/list';
const newsUrl = 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com/news';
const contributorsUrl = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/list';

type ResourceStatus = 0 | 1 | 2 | 3 | 4;
type CodeFramework = 'vue' | 'vue-next' | 'react' | 'miniprogram' | 'mobile-vue' | 'mobile-react' | 'flutter';

interface ResourceItem {
  logo: string;
  nameKey: string;
  href: string;
  status: ResourceStatus;
}

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

interface BrandItem {
  title: string;
  logo: string;
  width: string | number;
}

interface HomeState {
  contributorCount: number;
  currentTab: number;
  brandList: BrandItem[];
  newsList: NewsItem[];
  tabTransformWidth: number;
  contributors: string[];
  topContributors: string[];
  bottomContributors: string[];
  windowWidth: number;
  themeMode: ThemeMode;
  stepsTimers: (number | undefined)[];
  stepsCounts: number[];
  tabTimer: number | null;
  sourceList: ResourceItem[];
  designList: ResourceItem[];
  mobileSourceList: ResourceItem[];
  mobileDesignList: ResourceItem[];
  miniSourceList: ResourceItem[];
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

interface AvatarInstance {
  $el: HTMLElement;
}

const isIntranet = location.host.includes('woa.com'); // 部分动态或内容只能通过内网访问
let ticking = false;

const { t } = useI18n({ messages: homeMessages });

const state = reactive<HomeState>({
  contributorCount: 8,
  currentTab: 0,
  brandList: [],
  newsList: [],
  tabTransformWidth: 0,
  contributors: [],
  topContributors: [],
  bottomContributors: [],
  windowWidth: window.innerWidth,
  themeMode: 'light',
  stepsTimers: [],
  stepsCounts: [0, 0, 0],
  tabTimer: null,
  // status 1 上线、2 alpha、3 beta、0 待上线
  sourceList: [
    { logo: vueLogo, nameKey: 'home.resourceNames.vue', href: '/vue/', status: 1 },
    { logo: vueLogo, nameKey: 'home.resourceNames.vueNext', href: '/vue-next/', status: 1 },
    { logo: reactLogo, nameKey: 'home.resourceNames.react', href: '/react/', status: 1 },
  ],
  designList: [
    {
      logo: figmaLogo,
      nameKey: 'home.resourceNames.figma',
      href: figmaWebUrl,
      status: 1,
    },
    {
      logo: sketchLogo,
      nameKey: 'home.resourceNames.sketch',
      href: sketchWebUrl,
      status: 1,
    },
    {
      logo: axLogo,
      nameKey: 'home.resourceNames.axure',
      href: axWebUrl,
      status: 1,
    },
    {
      logo: xdLogo,
      nameKey: 'home.resourceNames.adobeXd',
      href: xdWebUrl,
      status: 1,
    },
  ],
  mobileSourceList: [
    { logo: vueLogo, nameKey: 'home.resourceNames.vueNext', href: '/mobile-vue/', status: 1 },
    { logo: reactLogo, nameKey: 'home.resourceNames.react', href: '/mobile-react/', status: 2 },
    { logo: uniappLogo, nameKey: 'home.resourceNames.uniapp', href: '/uniapp/', status: 2 },
    { logo: flutterLogo, nameKey: 'home.resourceNames.flutter', href: '/flutter/', status: 2 },
  ],
  mobileDesignList: [
    { logo: figmaLogo, nameKey: 'home.resourceNames.figma', href: figmaMobileUrl, status: 1 },
    {
      logo: sketchLogo,
      nameKey: 'home.resourceNames.sketch',
      href: sketchMobileUrl,
      status: 1,
    },
  ],
  miniSourceList: [
    {
      logo: miniprogramLogo,
      nameKey: 'home.resourceNames.miniprogram',
      href: '/miniprogram/',
      status: 1,
    },
  ],
  codeFramework: 'vue',
  codeList: {
    vue: [
      { type: 'bash', code: 'npm i tdesign-vue' },
      { type: 'javascript', code: "import Vue from 'vue';" },
      { type: 'javascript', code: "import TDesign from 'tdesign-vue';" },
      { type: 'javascript', code: "import 'tdesign-vue/es/style/index.css';" },
      { type: 'javascript', code: 'Vue.use(TDesign);' },
    ],
    'vue-next': [
      { type: 'bash', code: 'npm i tdesign-vue-next' },
      { type: 'javascript', code: "import { createApp } from 'vue';" },
      { type: 'javascript', code: "import TDesign from 'tdesign-vue-next';" },
      { type: 'javascript', code: "import 'tdesign-vue-next/es/style/index.css';" },
      { type: 'javascript', code: 'createApp(App).use(TDesign);' },
    ],
    react: [
      { type: 'bash', code: 'npm i tdesign-react' },
      { type: 'javascript', code: "import { Button } from 'tdesign-react';" },
      { type: 'javascript', code: "import 'tdesign-react/es/style/index.css';" },
      { type: 'javascript', code: '' },
    ],
    miniprogram: [
      { type: 'bash', code: 'npm i tdesign-miniprogram' },
      { type: 'javascript', code: '{ "usingComponents": { "t-tag": "tdesign-miniprogram/tag/tag" } }' },
      { type: 'javascript', codeKey: 'home.code.importantTag' },
      { type: 'javascript', code: '' },
    ],
    'mobile-vue': [
      { type: 'bash', code: 'npm i tdesign-mobile-vue' },
      { type: 'javascript', code: "import { createApp } from 'vue';" },
      { type: 'javascript', code: "import TDesign from 'tdesign-mobile-vue';" },
      { type: 'javascript', code: "import 'tdesign-mobile-vue/es/style/index.css';" },
      { type: 'javascript', code: 'createApp(App).use(TDesign);' },
    ],
    'mobile-react': [
      { type: 'bash', code: 'npm i tdesign-mobile-react' },
      { type: 'javascript', code: "import { Button } from 'tdesign-mobile-react';" },
      { type: 'javascript', code: "import 'tdesign-mobile-react/es/style/index.css';" },
      { type: 'javascript', code: '' },
    ],
    flutter: [
      { type: 'bash', code: 'flutter pub add tdesign_flutter' },
      { type: 'javascript', code: "import 'package:tdesign_flutter/tdesign_flutter.dart';" },
      {
        type: 'javascript',
        code: "TDTag _buildTag(BuildContext context) { return const TDTag('TDesign'); }",
      },
      { type: 'javascript', code: '' },
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

const {
  contributorCount,
  currentTab,
  brandList,
  newsList,
  tabTransformWidth,
  topContributors,
  bottomContributors,
  windowWidth,
  themeMode,
  sourceList,
  designList,
  mobileSourceList,
  mobileDesignList,
  miniSourceList,
  codeFramework,
  codeList,
  componentModel,
} = toRefs(state);
const topAvatars = ref<AvatarInstance[]>([]);
const bottomAvatars = ref<AvatarInstance[]>([]);
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
let randomTimer: number | undefined;
let avatarTimer: number | undefined;
let observer: MutationObserver | null = null;

function githubAvatar(value: string): string {
  return `https://avatars.githubusercontent.com/${value}`;
}

function githubUrl(value: string): string {
  return `https://github.com/${value}`;
}

function statusText(value: ResourceStatus): string {
  if (value === 0) return t('home.status.pending');
  if (value === 1) return t('home.status.stable');
  if (value === 2) return t('home.status.alpha');
  if (value === 3) return t('home.status.beta');
  if (value === 4) return t('home.status.rc');
  return '';
}

function displayCode(item: CodeItem): string {
  return item.codeKey ? String(t(item.codeKey)) : (item.code ?? '');
}

function handleMousemove(event: MouseEvent): void {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    checkMousePosition(event);
    ticking = false;
  });
}

function checkMousePosition(event: MouseEvent): void {
  const element = document.querySelector<HTMLElement>('#moduleBoard');
  if (!element) return;
  const isOver = event.target instanceof Node && element.contains(event.target);
  if (isOver) {
    if (state.tabTimer !== null) clearInterval(state.tabTimer);
    state.tabTimer = null;
    return;
  }
  if (state.tabTimer) return;
  initTabTimer();
}

function initTabTimer(): void {
  if (state.tabTimer !== null) clearInterval(state.tabTimer);
  state.tabTimer = window.setInterval(() => {
    state.currentTab = state.currentTab === 2 ? 0 : state.currentTab + 1;
  }, 4000);
}

function handleClickNews(url?: string): void {
  if (url) window.open(url, '_blank');
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

function parseBrands(value: unknown): BrandItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.title !== 'string' ||
      typeof item.logo !== 'string' ||
      (typeof item.width !== 'string' && typeof item.width !== 'number')
    ) {
      return [];
    }
    return [{ title: item.title, logo: item.logo, width: item.width }];
  });
}

function getNews(): void {
  fetch(newsUrl).then((data) => {
    data.json().then((value: unknown) => {
      const list = parseNews(value);
      state.newsList = isIntranet ? list : list.filter((value) => !value.isIntranet);
    });
  });
}

function getBrandList(): void {
  fetch(brandUrl).then((data) => {
    data.json().then((value: unknown) => {
      state.brandList = parseBrands(value);
    });
  });
}

function fetchContributors(): void {
  fetch(contributorsUrl)
    .then((res) => res.json())
    .then((data: unknown) => {
      const design = isRecord(data) && isRecord(data.design) ? data.design : {};
      const raw: unknown[] = [
        ...(Array.isArray(design.web) ? design.web : []),
        ...(Array.isArray(design.mobile) ? design.mobile : []),
        ...(Array.isArray(design.chart) ? design.chart : []),
      ];
      const seen = new Set<string>();
      const list: string[] = [];
      raw.forEach((name) => {
        const trimmed = String(name).trim();
        if (!trimmed) return;
        const key = trimmed.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        list.push(trimmed);
      });
      state.contributors = list;
      changeContributors();
    })
    .catch((err) => console.error(err));
}

function handleIntroClick(item: ResourceItem | string): void {
  if (typeof item === 'string') {
    window.open(item, '_blank');
    return;
  }
  if (!item.status) return;
  window.open(item.href, '_blank');
}

function changeContributors(): void {
  const { contributorCount, contributors } = state;
  if (!contributors.length) return;
  state.topContributors = contributors.slice(0, contributorCount);
  state.bottomContributors = contributors.slice(-contributorCount);

  let unshowContributors = contributors.slice(contributorCount, -contributorCount);

  avatarTimer = window.setInterval(() => {
    const r1 = Math.floor(Math.random() * contributorCount);
    const r2 = Math.floor(Math.random() * contributorCount);
    const topAvatar = topAvatars.value[r1];
    const bottomAvatar = bottomAvatars.value[r2];
    if (topAvatar?.$el && bottomAvatar?.$el) {
      topAvatar.$el.classList.toggle('active');
      bottomAvatar.$el.classList.toggle('active');
    }

    setTimeout(() => {
      if (topAvatar?.$el && bottomAvatar?.$el) {
        topAvatar.$el.classList.remove('active');
        bottomAvatar.$el.classList.remove('active');
      }
    }, 5000);
  }, 2500);

  randomTimer = window.setInterval(() => {
    const r1 = Math.floor(Math.random() * contributorCount);
    const r2 = Math.floor(Math.random() * contributorCount);

    let nextShows = unshowContributors.splice(0, 2);
    if (nextShows.length !== 2) {
      unshowContributors = contributors.filter((contributor) => {
        return !state.topContributors.includes(contributor) && !state.bottomContributors.includes(contributor);
      });
      nextShows = unshowContributors.splice(0, 2);
    }

    const topAvatar = topAvatars.value[r1];
    const bottomAvatar = bottomAvatars.value[r2];
    if (topAvatar?.$el && bottomAvatar?.$el) {
      topAvatar.$el.classList.add('change');
      bottomAvatar.$el.classList.add('change');
    }
    setTimeout(() => {
      state.topContributors.splice(r1, 1, nextShows[0]);
      state.bottomContributors.splice(r2, 1, nextShows[1]);
    }, 500);
    setTimeout(() => {
      if (topAvatar?.$el && bottomAvatar?.$el) {
        topAvatar.$el.classList.remove('change');
        bottomAvatar.$el.classList.remove('change');
      }
    }, 1500);
  }, 2500);
}

function handleResize(): void {
  state.windowWidth = window.innerWidth;
  state.currentTab = 0;
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

function stepsStart(_event: MouseEvent, index: number): void {
  clearInterval(state.stepsTimers[index]);
  const el = document.querySelectorAll<HTMLElement>('.steps-image')[index];
  if (!el) return;
  const { height } = el.getBoundingClientRect();
  state.stepsTimers[index] = window.setInterval(() => {
    if (state.stepsCounts[index] >= 24) return;
    state.stepsCounts[index] += 1;
    Object.assign(el.style, { backgroundPositionY: `-${height * state.stepsCounts[index]}px` });
  }, 40);
}

function stepsEnd(_event: MouseEvent, index: number): void {
  clearInterval(state.stepsTimers[index]);
  const el = document.querySelectorAll<HTMLElement>('.steps-image')[index];
  if (!el) return;
  const { height } = el.getBoundingClientRect();
  state.stepsTimers[index] = window.setInterval(() => {
    if (state.stepsCounts[index] <= 0) return;
    state.stepsCounts[index] -= 1;
    Object.assign(el.style, { backgroundPositionY: `-${height * state.stepsCounts[index]}px` });
  }, 40);
}

watch(currentTab, (tab) => {
  if (state.windowWidth >= 888) {
    if (tab === 0) state.tabTransformWidth = 0;
    else if (tab === 1) state.tabTransformWidth = 1048;
    else state.tabTransformWidth = 1048 + 480 + state.windowWidth * 0.5;
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

watch(
  windowWidth,
  (value) => {
    if (value > 750 && value < 960) state.contributorCount = 6;
    else if (value < 750) state.contributorCount = 3;
    else state.contributorCount = 8;
  },
  { immediate: true },
);

watch(contributorCount, () => {
  clearInterval(randomTimer);
  clearInterval(avatarTimer);
  changeContributors();
});

onMounted(() => {
  watchHtmlMode();
  fetchContributors();
  getBrandList();
  getNews();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMousemove);
  initTabTimer();
});

onBeforeUnmount(() => {
  clearInterval(randomTimer);
  clearInterval(avatarTimer);
  if (state.tabTimer !== null) clearInterval(state.tabTimer);
  observer?.disconnect();
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMousemove);
});
</script>
