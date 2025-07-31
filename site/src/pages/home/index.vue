<template>
  <section class="tdesign-homepage">
    <banner :themeMode="themeMode" />

    <section class="main-page">
      <div class="banner-info">
        <div class="banner-info__left">
          <h2 class="name">
            <p class="primary">TDesign</p>
          </h2>
        </div>
        <t-popup trigger="click" placement="left" overlay-inner-class-name="wechat-qrcode" :z-index="100">
          <div class="banner-booking">
            <img src="./assets/tdesign-profile.png" />
            <div class="banner-booking__info">follow TDesign wechat account</div>
          </div>
          <template #content><img width="100" src="https://tdesign.gtimg.com/site/wechat-account.png" /></template>
        </t-popup>
      </div>
      <div class="module-news" v-if="newsList.length > 0">
        <div v-for="(news, index) in newsList" :key="index" @click="() => handleClickNews(news.url)">
          <t-card :title="news.title" :description="news.desc" :style="{ cursor: news.url ? 'pointer' : null }"
            ><template #footer>{{ news.date }}</template>
          </t-card>
        </div>
      </div>
      <div class="module-intro">
        <div class="item web">
          <div class="steps-image" @mouseenter="stepsStart($event, 0)" @mouseleave="stepsEnd($event, 0)"></div>
          <p class="tag">Solution</p>
          <h3 class="title">Desktop</h3>
          <div class="mask"></div>

          <div class="module-intro__content">
            <div class="source">
              <div class="content-name">Development Resources</div>
              <div class="content-list">
                <div
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  v-for="item in sourceList"
                  :key="item.name"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ item.name }}</span>
                  <span
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      stable: item.status === 1,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ item.status | statusText }}</span
                  >
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <div class="design">
              <div class="content-name">Design Resources</div>
              <div class="content-list">
                <div
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  v-for="item in designList"
                  :key="item.name"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      stable: item.status === 1,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ item.status | statusText }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="item mobile">
          <div class="steps-image" @mouseenter="stepsStart($event, 1)" @mouseleave="stepsEnd($event, 1)"></div>
          <p class="tag">Solution</p>
          <h3 class="title">Mobile</h3>
          <div class="mask"></div>

          <div class="module-intro__content">
            <div class="source">
              <div class="content-name">Development Resources</div>
              <div class="content-list">
                <div
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  v-for="item in mobileSourceList"
                  :key="item.name"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      stable: item.status === 1,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ item.status | statusText }}</span
                  >
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <div class="design">
              <div class="content-name">Design Resources</div>
              <div class="content-list">
                <div
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  v-for="item in mobileDesignList"
                  :key="item.name"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      stable: item.status === 1,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ item.status | statusText }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item miniapp">
          <div class="steps-image" @mouseenter="stepsStart($event, 2)" @mouseleave="stepsEnd($event, 2)"></div>
          <p class="tag">Solution</p>
          <h3 class="title">MiniProgram</h3>
          <div class="mask"></div>

          <div class="module-intro__content">
            <div class="source">
              <div class="content-name">Development Resources</div>
              <div class="content-list">
                <div
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  v-for="item in miniSourceList"
                  :key="item.name"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ item.name }}</span>
                  <span
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      stable: item.status === 1,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ item.status | statusText }}</span
                  >
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <div class="design">
              <div class="content-name">Design Resources</div>
              <div class="content-list">
                <div
                  class="content-item"
                  :class="{ disabled: !item.status }"
                  v-for="item in mobileDesignList"
                  :key="item.name"
                  @click="handleIntroClick(item)"
                >
                  <img width="20" :src="item.logo" />
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.status !== 1"
                    :class="{
                      'content-tag': true,
                      disabled: !item.status,
                      stable: item.status === 1,
                      alpha: item.status === 2,
                      beta: item.status === 3,
                      rc: item.status === 4,
                    }"
                    >{{ item.status | statusText }}</span
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
        <h3 :class="['tencent-title', { 'tencent-title--active': currentTab === 0 }]">Open</h3>
        <div class="line" v-if="currentTab === 0"></div>
      </div>
      <div class="module-board__content" @click="currentTab = 1">
        <h3 :class="['tencent-title', { 'tencent-title--active': currentTab === 1 }]">Creation</h3>
        <div class="line" v-if="currentTab === 1"></div>
      </div>
      <div class="module-board__content" @click="currentTab = 2">
        <h3 :class="['tencent-title', { 'tencent-title--active': currentTab === 2 }]">Corporation</h3>
        <div class="line" v-if="currentTab === 2"></div>
      </div>
    </div>
    <!-- swiper content -->
    <div class="module-board" id="moduleBoard">
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
              <t-radio-group class="code-tab" variant="default-filled" v-model="codeFramework">
                <t-radio-button value="vue">vue</t-radio-button>
                <t-radio-button value="vue-next">vue-next</t-radio-button>
                <t-radio-button value="react">react</t-radio-button>
                <t-radio-button value="miniprogram">miniprogram</t-radio-button>
                <t-radio-button value="mobile-vue">mobile-vue</t-radio-button>
                <t-radio-button value="mobile-react">mobile-react</t-radio-button>
              </t-radio-group>

              <ul class="code-list">
                <li class="code-item" v-for="item in codeList[codeFramework]" :key="item.code">
                  <pre><code :class="[`language-${item.type}`]">{{ item.code }}</code></pre>
                </li>
              </ul>
            </div>

            <div class="line"></div>

            <ul class="desc-list">
              <li class="desc-item">
                <icon class="desc-icon" name="fork" />
                <h3 class="desc-title">Multiple-framework versions</h3>
                <p class="desc-text">Support popular tech stacks React/Vue/MiniProgram/Flutter</p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="desktop" />
                <h3 class="desc-title">Multi-platform compatibility</h3>
                <p class="desc-text">Provide two sets of component resources in unified desktop and mobile styles.</p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="precise-monitor" />
                <h3 class="desc-title">Industry-specific component libraries</h3>
                <p class="desc-text">Developed by multiple Tencent business teams based on a unified design system.</p>
              </li>
            </ul>
          </div>
          <div class="module-board__card-desc" v-if="currentTab === 0">
            <h3 class="title">Open Resources, Continuous Iteration</h3>
            <p class="desc">always maintain an open mindset and look forward to building an open source ecosystem</p>
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
                <t-input clearable placeholder="Please enter account">
                  <desktop-icon slot="prefix-icon"></desktop-icon>
                </t-input>
                <t-select v-model="componentModel.selectValue" multiple placeholder="请选择">
                  <t-option
                    v-for="item in componentModel.selectOptions"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value"
                  ></t-option>
                </t-select>
                <t-tree :data="componentModel.treeData" hover checkable expand-all />
              </div>
              <div class="component-board-item">
                <t-menu
                  :theme="themeMode"
                  defaultValue="dashboard/base"
                  :defaultExpanded="componentModel.menuExanded"
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
                  <t-submenu title="Dashboard" value="dashboard">
                    <template #icon>
                      <icon name="dashboard" />
                    </template>
                    <t-menu-item value="dashboard/base">Dashboard</t-menu-item>
                    <t-menu-item value="dashboard/detail">Report</t-menu-item>
                  </t-submenu>
                  <t-submenu title="List" value="list">
                    <template #icon>
                      <icon name="server" />
                    </template>
                    <t-menu-item value="list/base">List Page</t-menu-item>
                    <t-menu-item value="list/card">Card List</t-menu-item>
                    <t-menu-item value="list/select">Filter List</t-menu-item>
                    <t-menu-item value="list/tree">Tree List</t-menu-item>
                  </t-submenu>
                  <t-submenu title="Form" value="form">
                    <template #icon>
                      <icon name="root-list" />
                    </template>
                    <t-menu-item value="form/base">Base Form</t-menu-item>
                    <t-menu-item value="form/step">Step Form</t-menu-item>
                  </t-submenu>
                  <t-submenu title="Detail" value="detail">
                    <template #icon>
                      <icon name="control-platform" />
                    </template>
                    <t-menu-item value="detail/base">Detail</t-menu-item>
                    <t-menu-item value="detail/advanced">Advanced</t-menu-item>
                    <t-menu-item value="detail/deploy">Deploy Page</t-menu-item>
                    <t-menu-item value="detail/secondary">Secondary</t-menu-item>
                  </t-submenu>
                </t-menu>
              </div>
              <div class="component-board-item">
                <div class="component-board-item-row">
                  <t-button>
                    <icon name="file" slot="icon" />
                    Primary Button
                  </t-button>
                  <t-button theme="default">Button</t-button>
                  <t-button theme="default">Button</t-button>
                </div>
                <div class="component-board-item-row">
                  <t-slider v-model="componentModel.sliderValue" :inputNumberProps="false" />
                </div>
                <div class="component-board-item-row">
                  <t-switch size="large" :defaultValue="true" />
                  <t-switch size="large" />
                  <t-check-tag>Checkable Tag</t-check-tag>
                  <t-tag>Default Tag</t-tag>
                </div>
                <div>
                  <t-radio-group defaultValue="1" variant="default-filled">
                    <t-radio-button value="1">Light</t-radio-button>
                    <t-radio-button value="2">Dark</t-radio-button>
                    <t-radio-button value="3">Neutral</t-radio-button>
                  </t-radio-group>
                </div>
                <div class="color-block-wrapper">
                  <span
                    class="color-block"
                    v-for="color in componentModel.colorList1"
                    :key="color"
                    :style="{ background: [color] }"
                  ></span>
                </div>
                <div class="color-block-wrapper">
                  <span
                    class="color-block"
                    v-for="color in componentModel.colorList2"
                    :key="color"
                    :style="{ background: [color] }"
                  ></span>
                </div>
              </div>
            </div>

            <div class="line"></div>

            <ul class="desc-list">
              <li class="desc-item">
                <icon class="desc-icon" name="tips" />
                <h3 class="desc-title">Scalable Design Style</h3>
                <p class="desc-text">
                  Abstracted design styles into Design Tokens to meet the brand customization needs of different
                  products.
                </p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="chart-bubble" />
                <h3 class="desc-title">Variety of Design Resources</h3>
                <p class="desc-text">
                  Provide variety of design resources for desktop and mobile application such as Sketch/Figma
                </p>
              </li>
              <li class="desc-item">
                <icon class="desc-icon" name="file-image" />
                <h3 class="desc-title">Professional Design Guidelines</h3>
                <p class="desc-text">
                  Summarize design experience into guidelines to assist users in properly using components.
                </p>
              </li>
            </ul>
          </div>
          <div class="module-board__card-desc" v-if="currentTab === 1">
            <h3 class="title">Inclusive, flexible, and easy-to-use</h3>
            <p class="desc">Maintain a keen sense of design, seeking commonalities in complex business scenarios</p>
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
                ref="topAvatars"
                v-for="(item, index) in topContributors"
                :key="index + 'top'"
                :href="item | githubUrl"
                :src="item | githubAvatar"
              />
            </div>
          </div>

          <div class="module-contributor__center">
            <component-list :themeMode="themeMode" />
          </div>

          <div class="module-contributor__bottom">
            <div class="module-contributor__avatars">
              <avatar
                ref="bottomAvatars"
                v-for="(item, index) in bottomContributors"
                :key="index + 'bottom'"
                :href="item | githubUrl"
                :src="item | githubAvatar"
              />
            </div>
          </div>
          <div class="module-board__card-desc">
            <h3 class="title">TDesign is a collective effort, with 400+ contributors from 60+ teams</h3>
            <p class="desc">
              TDesign owes its birth and growth to open source. From the outset, TDesign has adhered to the principles
              of equality, transparency, and openness in accordance with open-source collaboration. Through internal
              open-source practices, we have brought together Tencent's best and mature component libraries for
              co-creation and sharing.TDesign owes its birth and growth to open source. From the outset, TDesign has
              adhered to the principles of equality, transparency, and openness in accordance with open-source
              collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="module-service">
      <div class="module-service__inner">
        <div class="image-rope"></div>

        <div class="content">
          <h3 class="module-top-title">Versatile and the top choice for businesses</h3>
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
          <p class="module-sub-title">different industry products in use</p>
          <p class="module-description">
            From consumer products to financial services, from B2B to B2C products, from major brands to individual
            developers, TDesign fully meets the needs of low-cost, efficient, and high-quality front-end design and
            development work, helping to enhance product experience and effectively improve design and development
            efficiency
          </p>
          <div class="module-brand-wall">
            <div class="mask left" />
            <div class="mask middle" />
            <div class="mask right" />

            <t-space break-line :size="14">
              <div
                class="brand-content"
                v-for="({ title, logo, width }, index) in brandList"
                :key="index"
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
      <p class="module-title">Grow together with TDesign</p>
      <p class="module-description">
        Not only limited to the Tencent ecosystem, TDesign provides a more textured, stable, and sustainable experience
        to help a wider range of industries and developers enhance product experience, improve design and development
        efficiency, and explore more possibilities at a lower cost with TDesign
      </p>
      <t-button href="https://github.com/Tencent/tdesign">Get started</t-button>
    </div>

    <td-backtop />
    <td-doc-footer :style="footerStyle" />
  </section>
</template>

<script>
import { DesktopIcon, Icon } from 'tdesign-icons-vue';
import Banner from './banner.vue';
import Avatar from './avatar.vue';
import ComponentList from './component-list.vue';
import Prismjs from 'prismjs';
import { contributors } from './consts';

import vueLogo from './assets/vue-logo.svg';
import reactLogo from './assets/react-logo.svg';
import figmaLogo from './assets/figma-logo.svg';
import axLogo from './assets/ax-logo.svg';
import xdLogo from './assets/xd-logo.svg';
import flutterLogo from './assets/flutter-logo.svg';
import sketchLogo from './assets/sketch-logo.svg';
import miniprogramLogo from './assets/miniprogram-logo.svg';
import qqLogo from './assets/qq-logo.svg';

import { figmaWebUrl, figmaMobileUrl, sketchWebUrl, sketchMobileUrl, axWebUrl, xdWebUrl } from '@consts';

const brandUrl = 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com/brand/list';
const newsUrl = 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com/news';

const isIntranet = location.host.includes('woa.com'); // 部分动态或内容只能通过内网访问
let ticking = false;

export default {
  name: 'site-home',
  components: {
    DesktopIcon,
    Icon,
    Banner,
    Avatar,
    ComponentList,
  },

  filters: {
    githubAvatar(v) {
      return `https://avatars.githubusercontent.com/${v}`;
    },
    githubUrl(v) {
      return `https://github.com/${v}`;
    },
    statusText(v) {
      if (v === 0) return 'In Progress';
      if (v === 1) return 'Stable';
      if (v === 2) return 'Alpha';
      if (v === 3) return 'Beta';
      if (v === 4) return 'Rc';
      return '';
    },
  },

  data() {
    return {
      contributorCount: 8,
      currentTab: 0,
      brandList: [],
      newsList: [],
      tabTransformWidth: 0,
      contributors: contributors.slice(),
      topContributors: [],
      bottomContributors: [],
      windowWidth: window.innerWidth,
      themeMode: 'light',
      stepsTimers: [],
      stepsCounts: [0, 0, 0],
      tabTimer: null,
      // status 1 上线、2 alpha、3 beta、0 待上线
      sourceList: [
        { logo: vueLogo, name: 'Vue', href: '/vue/', status: 1 },
        { logo: vueLogo, name: 'Vue Next', href: '/vue-next/', status: 1 },
        { logo: reactLogo, name: 'React', href: '/react/', status: 1 },
      ],
      designList: [
        {
          logo: figmaLogo,
          name: 'Figma',
          href: figmaWebUrl,
          status: 1,
        },
        {
          logo: sketchLogo,
          name: 'Sketch',
          href: sketchWebUrl,
          status: 1,
        },
        {
          logo: axLogo,
          name: 'Axure',
          href: axWebUrl,
          status: 1,
        },
        {
          logo: xdLogo,
          name: 'AdobeXD',
          href: xdWebUrl,
          status: 1,
        },
      ],
      mobileSourceList: [
        { logo: vueLogo, name: 'Vue Next', href: '/mobile-vue/', status: 1 },
        { logo: reactLogo, name: 'React', href: '/mobile-react/', status: 2 },
        { logo: flutterLogo, name: 'Flutter', href: '/flutter/', status: 2 },
      ],
      mobileDesignList: [
        { logo: figmaLogo, name: 'Figma', href: figmaMobileUrl, status: 1 },
        {
          logo: sketchLogo,
          name: 'Sketch',
          href: sketchMobileUrl,
          status: 1,
        },
      ],
      miniSourceList: [
        { logo: miniprogramLogo, name: 'Wechat MiniProgram', href: '/miniprogram/', status: 1 },
        { logo: qqLogo, name: 'QQ MiniProgram', href: '/qq-miniprogram/', status: 2 },
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
          { type: 'javascript', code: '<t-tag theme="primary">重要</t-tag>' },
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
      },
      componentModel: {
        selectValue: ['1'],
        selectOptions: [
          { label: 'Marketing Department', value: '1' },
          { label: 'Finance Department', value: '2' },
          { label: 'Development Department', value: '3' },
        ],
        menuExanded: ['dashboard'],
        treeData: [
          {
            value: '1',
            label: 'Headquarters',
          },
          {
            value: '2',
            label: 'Huadong Region',
            children: [
              {
                value: '2.1',
                label: 'Marketing Department',
              },
              {
                value: '2.2',
                label: 'Finance Department',
              },
            ],
          },
          {
            value: '3',
            label: 'Huanan Region',
            children: [
              {
                value: '3.1',
                label: 'Marketing Departmen',
              },
              {
                value: '3.2',
                label: 'Finance Department',
              },
            ],
          },
        ],
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
    };
  },

  computed: {
    footerStyle() {
      return {
        '--content-padding-right': '0',
        '--content-max-width': '1440px',
        '--content-padding-left-right': '48px',
        '--footer-inner-position': 'relative',
        '--footer-logo-position': 'unset',
      };
    },
  },

  watch: {
    currentTab: {
      handler(tab) {
        if (this.windowWidth >= 888) {
          if (tab === 0) this.tabTransformWidth = 0;
          else if (tab === 1) this.tabTransformWidth = 1048;
          else this.tabTransformWidth = 1048 + 480 + this.windowWidth * 0.5;
        } else {
          if (tab === 0) this.tabTransformWidth = 0;
          else if (tab === 1) this.tabTransformWidth = this.windowWidth - 20;
          else this.tabTransformWidth = this.windowWidth * 2;
        }
      },
    },
    codeFramework: {
      immediate: true,
      handler() {
        requestAnimationFrame(() => {
          Prismjs.highlightAll();
        });
      },
    },
    windowWidth: {
      immediate: true,
      handler(v) {
        if (v > 750 && v < 960) {
          this.contributorCount = 6;
        } else if (v < 750) {
          this.contributorCount = 3;
        } else {
          this.contributorCount = 8;
        }
      },
    },
    contributorCount() {
      clearInterval(this.randomTimer);
      clearInterval(this.avatarTimer);
      this.changeContributors();
    },
  },

  mounted() {
    this.watchHtmlMode();
    this.changeContributors();
    this.getBrandList();
    this.getNews();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMousemove);
    this.initTabTimer();
  },

  beforeDestroy() {
    clearInterval(this.randomTimer);
    clearInterval(this.avatarTimer);
    clearInterval(this.tabTimer);
    this.observer.disconnect();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMousemove);
  },

  methods: {
    handleMousemove(event) {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        this.checkMousePosition(event);
        ticking = false;
      });
    },
    checkMousePosition(event) {
      const element = document.querySelector('#moduleBoard');
      if (!element) return;
      const isOver = element.contains(event.target);
      if (isOver) {
        clearInterval(this.tabTimer);
        this.tabTimer = null;
        return;
      }
      if (this.tabTimer) return;
      this.initTabTimer();
    },
    initTabTimer() {
      clearInterval(this.tabTimer);
      this.tabTimer = setInterval(() => {
        this.currentTab = this.currentTab === 2 ? 0 : this.currentTab + 1;
      }, 4000);
    },
    handleClickNews(url) {
      if (url) window.open(url, '_blank');
    },
    getNews() {
      fetch(newsUrl).then((data) => {
        data.json().then((list) => {
          this.newsList = isIntranet ? list : list.filter((v) => !v.isIntranet);
        });
      });
    },
    getBrandList() {
      fetch(brandUrl).then((data) => {
        data.json().then((list) => {
          this.brandList = list;
        });
      });
    },
    handleIntroClick(item) {
      if (!item.status) return;
      window.open(item.href, '_blank');
    },
    changeContributors() {
      const { contributorCount, contributors } = this;
      this.topContributors = contributors.slice(0, contributorCount);
      this.bottomContributors = contributors.slice(-contributorCount);

      let unshowContributors = contributors.slice(contributorCount, -contributorCount);

      this.avatarTimer = setInterval(() => {
        const r1 = Math.floor(Math.random() * contributorCount);
        const r2 = Math.floor(Math.random() * contributorCount);
        if (this.$refs.topAvatars[r1].$el) {
          this.$refs.topAvatars[r1].$el.classList.toggle('active');
          this.$refs.bottomAvatars[r2].$el.classList.toggle('active');
        }

        setTimeout(() => {
          if (this.$refs.topAvatars[r1].$el) {
            this.$refs.topAvatars[r1].$el.classList.remove('active');
            this.$refs.bottomAvatars[r2].$el.classList.remove('active');
          }
        }, 5000);
      }, 2500);

      this.randomTimer = setInterval(() => {
        const r1 = Math.floor(Math.random() * contributorCount);
        const r2 = Math.floor(Math.random() * contributorCount);

        let nextShows = unshowContributors.splice(0, 2);
        if (nextShows.length !== 2) {
          unshowContributors = contributors.filter((c) => {
            return !this.topContributors.includes(c) && !this.bottomContributors.includes(c);
          });
          nextShows = unshowContributors.splice(0, 2);
        }

        if (this.$refs.topAvatars[r1].$el) {
          this.$refs.topAvatars[r1].$el.classList.add('change');
          this.$refs.bottomAvatars[r2].$el.classList.add('change');
        }
        setTimeout(() => {
          this.topContributors.splice(r1, 1, nextShows[0]);
          this.bottomContributors.splice(r2, 1, nextShows[1]);
        }, 500);
        setTimeout(() => {
          if (this.$refs.topAvatars[r1].$el) {
            this.$refs.topAvatars[r1].$el.classList.remove('change');
            this.$refs.bottomAvatars[r2].$el.classList.remove('change');
          }
        }, 1500);
      }, 2500);
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    watchHtmlMode() {
      this.themeMode = document.documentElement.getAttribute('theme-mode') || 'light';

      const targetNode = document.documentElement;
      const config = { attributes: true };

      const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.attributeName === 'theme-mode') {
            const themeMode = mutation.target.getAttribute('theme-mode') || 'light';
            if (themeMode) this.themeMode = themeMode;
          }
        }
      };

      this.observer = new MutationObserver(callback);
      this.observer.observe(targetNode, config);
    },
    stepsStart(e, index) {
      clearInterval(this.stepsTimers[index]);
      const el = document.querySelectorAll('.steps-image')[index];
      const { height } = el.getBoundingClientRect();
      this.stepsTimers[index] = setInterval(() => {
        if (this.stepsCounts[index] >= 24) return;
        this.stepsCounts[index] += 1;
        Object.assign(el.style, { backgroundPositionY: `-${height * this.stepsCounts[index]}px` });
      }, 40);
    },
    stepsEnd(e, index) {
      clearInterval(this.stepsTimers[index]);
      const el = document.querySelectorAll('.steps-image')[index];
      const { height } = el.getBoundingClientRect();
      this.stepsTimers[index] = setInterval(() => {
        if (this.stepsCounts[index] <= 0) return;
        this.stepsCounts[index] -= 1;
        Object.assign(el.style, { backgroundPositionY: `-${height * this.stepsCounts[index]}px` });
      }, 40);
    },
  },
};
</script>
