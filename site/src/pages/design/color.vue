<template>
  <div class="doc-color-wrapper">
    <div ref="article" name="DOC" class="doc-color">
      <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
        <ol class="tdesign-toc_list">
          <li v-for="anchor in catalog" :key="anchor.id" class="tdesign-toc_list_item">
            <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
            <ol v-if="anchor.children.length" class="tdesign-toc_list">
              <li v-for="subAnchor in anchor.children" :key="subAnchor.id" class="tdesign-toc_list_item">
                <a class="tdesign-toc_list_item_a" :href="'#' + subAnchor.id">{{ subAnchor.title }} </a>
              </li>
            </ol>
          </li>
        </ol>
      </nav>

      <h2>{{ t('color.summary.title') }}</h2>
      <p>{{ t('color.summary.description') }}</p>
      <h2>{{ t('color.palette.title') }}</h2>
      <p>{{ t('color.palette.description') }}</p>
      <h3>{{ t('color.theme.title') }}</h3>
      <p>{{ t('color.theme.description') }}</p>
      <div class="tdesign-color-theme">
        <p>{{ t('color.theme.name') }}</p>
        <div class="tdesign-color-theme-b">
          <p>rgba(0, 82, 217, 1)</p>
          <p>#0052d9</p>
        </div>
      </div>
      <h3>{{ t('color.functional.title') }}</h3>
      <p v-for="paragraph in functionalDescription" :key="paragraph">{{ paragraph }}</p>

      <div class="tdesign-color-features">
        <div v-for="(item, index) in listFeatures" :key="index" class="tdesign-color-features-lists">
          <div
            v-for="(listLi, itemIndex) in item"
            :key="itemIndex"
            class="tdesign-color-features-list"
            :style="{ background: listLi.rightTxt }"
            @click="copyColor(listLi.rightTxt)"
          >
            <p v-if="listLi.topTitle" class="tdesign-color-features-bottomTxt">{{ listLi.topTitle }}</p>
            <p class="tdesign-color-features-topTxt">
              <span>{{ listLi.leftTxt }}</span>
              <span>{{ listLi.rightTxt }}</span>
            </p>
          </div>
        </div>
      </div>
      <h3>{{ t('color.neutral.title') }}</h3>
      <p>{{ t('color.neutral.description') }}</p>
      <div class="tdesign-color-neutral">
        <div class="tdesign-color-neutral-l">
          <div class="tdesign-color-neutral-l-lists">
            <div
              v-for="(item, index) in listNeutralLeft"
              :key="index"
              class="tdesign-color-neutral-l-list"
              :style="{ background: item.rightTxt }"
              @click="copyColor(item.rightTxt)"
            >
              <span>{{ item.leftTxt }}</span>
              <span>{{ item.rightTxt }}</span>
            </div>
          </div>
        </div>
        <div class="tdesign-color-neutral-r">
          <div v-for="(list, index) in listNeutralRight" :key="index" class="tdesign-color-neutral-r-item">
            <ul>
              <li>
                <p>
                  <span>{{ list.color }}</span>
                  <span class="tdesign-color-neutral-r-item-checkbox"></span>
                </p>
              </li>
              <li v-for="(item, indexItem) in list.column" :key="indexItem">
                <div>
                  <span class="round" :style="{ background: item.roundBg }"></span>
                  <p>{{ item.font }}</p>
                  <p>{{ item.fontColor }}</p>
                </div>
                <div>
                  <p>{{ item.text }}</p>
                  <p>{{ item.size }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <h3>{{ t('color.brandNeutral.title') }}</h3>
      <p>{{ t('color.brandNeutral.description') }}</p>
      <div class="tdesign-color-neutral-brand">
        <div class="tdesign-color-neutral-brand-l">
          <div class="tdesign-color-neutral-brand-l-lists">
            <div
              v-for="(item, index) in listBrandLeft"
              :key="index"
              class="tdesign-color-neutral-brand-l-list"
              :style="{ background: item.color }"
              @click="copyColor(item.color)"
            >
              <span>{{ item.colorName }}</span>
              <span v-if="item.colorTxt">{{ item.colorTxt }}</span>
            </div>
          </div>
          <p class="tag">12%</p>
        </div>
        <div class="tdesign-color-neutral-brand-m">
          <div class="tdesign-color-neutral-brand-m-lists">
            <div
              v-for="(item, index) in listNeutralLeft.slice(1)"
              :key="index"
              class="tdesign-color-neutral-brand-m-list"
              :style="{ background: item.rightTxt }"
              @click="copyColor(item.rightTxt)"
            >
              <span>{{ item.leftTxt }}</span>
              <span>{{ item.rightTxt }}</span>
            </div>
          </div>
          <p class="tag">100%</p>
        </div>
        <div class="tdesign-color-neutral-brand-arr"></div>
        <div class="tdesign-color-neutral-brand-r">
          <div class="tdesign-color-neutral-brand-r-lists">
            <div
              v-for="(item, index) in listBrandRight"
              :key="index"
              class="tdesign-color-neutral-brand-r-list"
              :style="{ background: item.colorTxt }"
              @click="copyColor(item.colorTxt)"
            >
              <span>{{ item.colorName }}</span>
              <span>{{ item.colorTxt }}</span>
            </div>
          </div>
          <p class="tag">{{ t('color.brandNeutral.formula') }}</p>
        </div>
      </div>
      <h3>{{ t('color.extended.title') }}</h3>
      <p>{{ t('color.extended.description') }}</p>
      <div class="tdesign-color-expand tdesign-color-features">
        <div v-for="(item, index) in listExpand" :key="index" class="tdesign-color-features-lists">
          <div
            v-for="(listLi, itemIndex) in item"
            :key="itemIndex"
            class="tdesign-color-features-list"
            :style="{ background: listLi.rightTxt }"
            @click="copyColor(listLi.rightTxt)"
          >
            <p class="tdesign-color-expand-item">
              <span>{{ listLi.leftTxt }}</span>
              <span>{{ listLi.rightTxt }}</span>
            </p>
          </div>
        </div>
      </div>
      <h2>{{ t('color.application.title') }}</h2>
      <h3>{{ t('color.application.uiTitle') }}</h3>
      <p>{{ t('color.application.uiDescription') }}</p>
      <div class="tdesign-guide-ui-box">
        <div class="tdesign-guide-ui">
          <div v-for="(item, index) in listGuideUi" :key="index" class="tdesign-guide-ui-item">
            <div class="tdesign-guide-ui-item-lists">
              <div class="tdesign-guide-ui-item-list name">{{ item.name }}</div>
              <div class="tdesign-guide-ui-item-list title">{{ item.title }}</div>
              <div
                v-for="(itemCon, contentIndex) in item.content"
                :key="contentIndex"
                class="tdesign-guide-ui-item-list"
              >
                <span class="color-txt-l" :style="{ background: itemCon.color }">{{ itemCon.colorN }}</span>
                <span class="color-txt-r">{{ itemCon.colorTxt }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tdesign-guide-ui-arr"></div>
        <div class="tdesign-guide-ui-arr tdesign-guide-ui-arr--position"></div>
      </div>

      <h3>{{ t('color.application.dataTitle') }}</h3>
      <p>{{ t('color.application.dataDescription') }}</p>
      <img src="./assets/color/board.svg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import designVisualMessages from '../../locales/pages/design-visual';
import useAnchor from '../mixins/anchor';
import type { MessageApi, PaletteColor } from '../types';
import { localeArray } from '../../locales/locale-array';

interface NeutralColor {
  leftTxt: string;
  rightTxt: string;
}

interface ContrastItem {
  roundBg: string;
  font: string;
  fontColor: string;
  text: string;
  size: string;
}

interface NeutralContrast {
  color: string;
  icon: string;
  column: ContrastItem[];
}

interface BrandColorLeft {
  colorName: string;
  color: string;
  colorTxt?: string;
}

interface BrandColorRight {
  colorName: string;
  colorTxt: string;
}

interface GuideTokenContent {
  color?: string;
  colorTxt: string;
  colorN?: string;
}

interface GuideToken {
  name: string;
  title: string;
  content: GuideTokenContent[];
}

interface ColorPageState {
  listFeatures: Record<string, PaletteColor[]>;
  listNeutralLeft: NeutralColor[];
  listNeutralRight: NeutralContrast[];
  listBrandLeft: BrandColorLeft[];
  listBrandRight: BrandColorRight[];
  listExpand: Record<string, PaletteColor[]>;
}

const { article, catalog } = useAnchor();
const instance = getCurrentInstance();
if (!instance) throw new Error('color.vue must be initialized inside a component instance');
const message = instance.appContext.config.globalProperties.$message as MessageApi;
const { t, tm } = useI18n({ messages: designVisualMessages });
const functionalDescription = computed(() => localeArray<string>(tm('color.functional.description')));

const state = reactive<ColorPageState>({
  listFeatures: {
    list: [
      {
        topTitle: t('color.paletteLabels.blueContrast'),
        leftTxt: t('color.paletteLabels.brand'),
        rightTxt: '#0052d9',
      },
      {
        leftTxt: 'Blue1',
        rightTxt: '#f2f3ff',
      },
      {
        leftTxt: 'Blue2',
        rightTxt: '#d9e1ff',
      },
      {
        leftTxt: 'Blue3',
        rightTxt: '#b5c7ff',
      },
      {
        leftTxt: 'Blue4',
        rightTxt: '#8eabff',
      },
      {
        leftTxt: 'Blue5',
        rightTxt: '#618dff',
      },
      {
        leftTxt: 'Blue6',
        rightTxt: '#366ef4',
      },
      {
        leftTxt: 'Blue7',
        rightTxt: '#0052d9',
      },
      {
        leftTxt: 'Blue8',
        rightTxt: '#003cab',
      },
      {
        leftTxt: 'Blue9',
        rightTxt: '#002a7c',
      },
      {
        leftTxt: 'Blue10',
        rightTxt: '#001a57',
      },
    ],
    list1: [
      {
        topTitle: t('color.paletteLabels.redContrast'),
        leftTxt: t('color.paletteLabels.error'),
        rightTxt: '#d54941',
      },
      {
        leftTxt: 'Red1',
        rightTxt: '#fff0ed',
      },
      {
        leftTxt: 'Red2',
        rightTxt: '#ffd8d2',
      },
      {
        leftTxt: 'Red3',
        rightTxt: '#ffb9b0',
      },
      {
        leftTxt: 'Red4',
        rightTxt: '#ff9285',
      },
      {
        leftTxt: 'Red5',
        rightTxt: '#f6685d',
      },
      {
        leftTxt: 'Red6',
        rightTxt: '#d54941',
      },
      {
        leftTxt: 'Red7',
        rightTxt: '#ad352f',
      },
      {
        leftTxt: 'Red8',
        rightTxt: '#881f1c',
      },
      {
        leftTxt: 'Red9',
        rightTxt: '#68070a',
      },
      {
        leftTxt: 'Red10',
        rightTxt: '#490002',
      },
    ],
    list2: [
      {
        topTitle: t('color.paletteLabels.orangeContrast'),
        leftTxt: t('color.paletteLabels.warning'),
        rightTxt: '#e37318',
      },
      {
        leftTxt: 'Orange1',
        rightTxt: '#fff1e9',
      },
      {
        leftTxt: 'Orange2',
        rightTxt: '#ffd9c2',
      },
      {
        leftTxt: 'Orange3',
        rightTxt: '#ffb98c',
      },
      {
        leftTxt: 'Orange4',
        rightTxt: '#fa9550',
      },
      {
        leftTxt: 'Orange5',
        rightTxt: '#e37318',
      },
      {
        leftTxt: 'Orange6',
        rightTxt: '#be5a00',
      },
      {
        leftTxt: 'Orange7',
        rightTxt: '#954500',
      },
      {
        leftTxt: 'Orange8',
        rightTxt: '#713300',
      },
      {
        leftTxt: 'Orange9',
        rightTxt: '#532300',
      },
      {
        leftTxt: 'Orange10',
        rightTxt: '#3b1700',
      },
    ],
    list3: [
      {
        topTitle: t('color.paletteLabels.greenContrast'),
        leftTxt: t('color.paletteLabels.success'),
        rightTxt: '#2ba471',
      },
      {
        leftTxt: 'Green1',
        rightTxt: '#e3f9e9',
      },
      {
        leftTxt: 'Green2',
        rightTxt: '#c6f3d7',
      },
      {
        leftTxt: 'Green3',
        rightTxt: '#92dab2',
      },
      {
        leftTxt: 'Green4',
        rightTxt: '#56c08d',
      },
      {
        leftTxt: 'Green5',
        rightTxt: '#2ba471',
      },
      {
        leftTxt: 'Green6',
        rightTxt: '#008858',
      },
      {
        leftTxt: 'Green7',
        rightTxt: '#006c45',
      },
      {
        leftTxt: 'Green8',
        rightTxt: '#005334',
      },
      {
        leftTxt: 'Green9',
        rightTxt: '#003b23',
      },
      {
        leftTxt: 'Green10',
        rightTxt: '#002515',
      },
    ],
  },
  listNeutralLeft: [
    {
      leftTxt: 'White',
      rightTxt: '#ffffff',
    },
    {
      leftTxt: 'Gray1  L96',
      rightTxt: '#f3f3f3',
    },
    {
      leftTxt: 'Gray2  L94',
      rightTxt: '#eeeeee',
    },
    {
      leftTxt: 'Gray3  L92',
      rightTxt: '#e8e8e8',
    },
    {
      leftTxt: 'Gray4  L88',
      rightTxt: '#dddddd',
    },
    {
      leftTxt: 'Gray5  L80',
      rightTxt: '#c6c6c6',
    },
    {
      leftTxt: 'Gray6  L68',
      rightTxt: '#a6a6a6',
    },
    {
      leftTxt: 'Gray7  L58',
      rightTxt: '#8b8b8b',
    },
    {
      leftTxt: 'Gray8  L50',
      rightTxt: '#777777',
    },
    {
      leftTxt: 'Gray9  L40',
      rightTxt: '#5e5e5e',
    },
    {
      leftTxt: 'Gray10  L32',
      rightTxt: '#4b4b4b',
    },
    {
      leftTxt: 'Gray11  L24',
      rightTxt: '#393939',
    },
    {
      leftTxt: 'Gray12  L18',
      rightTxt: '#2c2c2c',
    },
    {
      leftTxt: 'Gray13  L14',
      rightTxt: '#242424',
    },
    {
      leftTxt: 'Gray14  L8',
      rightTxt: '#181818',
    },
  ],
  listNeutralRight: [
    {
      color: 'White',
      icon: '',
      column: [
        {
          roundBg: 'rgba(0, 0, 0, 0.9)',
          font: 'Font Gy1',
          fontColor: '#000000 90%',
          text: 'Text',
          size: 'AAA 17.5',
        },
        { roundBg: 'rgba(0, 0, 0, 0.6)', font: 'Font Gy2', fontColor: '#000000 60%', text: 'Text', size: 'AA 5.7' },
      ],
    },
    {
      color: 'Gray1',
      icon: '',
      column: [
        {
          roundBg: 'rgba(0, 0, 0, 0.9)',
          font: 'Font Gy1',
          fontColor: '#000000 90%',
          text: 'Text',
          size: 'AAA 15.8',
        },
        { roundBg: 'rgba(0, 0, 0, 0.6)', font: 'Font Gy2', fontColor: '#000000 60%', text: 'Text', size: 'AA 5.1' },
      ],
    },
    {
      color: 'Gray2',
      icon: '',
      column: [
        {
          roundBg: 'rgba(0, 0, 0, 0.9)',
          font: 'Font Gy1',
          fontColor: '#000000 90%',
          text: 'Text',
          size: 'AAA 15.1',
        },
        { roundBg: 'rgba(0, 0, 0, 0.6)', font: 'Font Gy2', fontColor: '#000000 60%', text: 'Text', size: 'AA 4.9' },
      ],
    },
  ],
  listBrandLeft: [
    { colorName: 'L96', color: '#f2f3ff' },
    { colorName: 'L94', color: '#ebedff' },
    { colorName: 'L92', color: '#e3e7ff' },
    { colorName: 'L88', color: '#d3dcff' },
    { colorName: 'L80', color: '#b4c5ff' },
    { colorName: 'L68', color: '#84a2ff' },
    { colorName: 'L58', color: '#5885ff' },
    { colorName: 'L50', color: '#366ef4' },
    { colorName: 'L40', color: '#0052D9', colorTxt: '#0052d9' },
    { colorName: 'L32', color: '#0042b2' },
    { colorName: 'L24', color: '#00328b' },
    { colorName: 'L18', color: '#00266e' },
    { colorName: 'L14', color: '#001e5c' },
    { colorName: 'L8', color: '#001442' },
  ],
  listBrandRight: [
    { colorName: 'BlueGray1  L96', colorTxt: '#f3f3f4' },
    { colorName: 'BlueGray2  L94', colorTxt: '#eeeef0' },
    { colorName: 'BlueGray3  L92', colorTxt: '#e7e8eb' },
    { colorName: 'BlueGray4  L88', colorTxt: '#dcdde1' },
    { colorName: 'BlueGray5  L80', colorTxt: '#c4c6cd' },
    { colorName: 'BlueGray6  L68', colorTxt: '#a2a6b1' },
    { colorName: 'BlueGray7  L58', colorTxt: '#858a99' },
    { colorName: 'BlueGray8  L50', colorTxt: '#6f7686' },
    { colorName: 'BlueGray9  L40', colorTxt: '#535d6d' },
    { colorName: 'BlueGray10  L32', colorTxt: '#424a57' },
    { colorName: 'BlueGray11  L24', colorTxt: '#323843' },
    { colorName: 'BlueGray12  L18', colorTxt: '#272b34' },
    { colorName: 'BlueGray13  L14', colorTxt: '#20232b' },
    { colorName: 'BlueGray14  L8', colorTxt: '#15181d' },
  ],
  listExpand: {
    list: [
      {
        leftTxt: 'Cyan5',
        rightTxt: '#029cd4',
      },
      {
        leftTxt: 'Cyan1',
        rightTxt: '#e8f5ff',
      },
      {
        leftTxt: 'Cyan2',
        rightTxt: '#c4e8ff',
      },
      {
        leftTxt: 'Cyan3',
        rightTxt: '#85d3ff',
      },
      {
        leftTxt: 'Cyan4',
        rightTxt: '#41b8f2',
      },
      {
        leftTxt: 'Cyan5',
        rightTxt: '#029cd4',
      },
      {
        leftTxt: 'Cyan6',
        rightTxt: '#0080b0',
      },
      {
        leftTxt: 'Cyan7',
        rightTxt: '#00668e',
      },
      {
        leftTxt: 'Cyan8',
        rightTxt: '#004e6d',
      },
      {
        leftTxt: 'Cyan9',
        rightTxt: '#003850',
      },
      {
        leftTxt: 'Cyan10',
        rightTxt: '#002536',
      },
    ],
    list1: [
      {
        leftTxt: 'Purple6',
        rightTxt: '#8e56dd',
      },
      {
        leftTxt: 'Purple1',
        rightTxt: '#fbf0ff',
      },
      {
        leftTxt: 'Purple2',
        rightTxt: '#eedcff',
      },
      {
        leftTxt: 'Purple3',
        rightTxt: '#dcbfff',
      },
      {
        leftTxt: 'Purple4',
        rightTxt: '#c69cff',
      },
      {
        leftTxt: 'Purple5',
        rightTxt: '#ad75fe',
      },
      {
        leftTxt: 'Purple6',
        rightTxt: '#8e56dd',
      },
      {
        leftTxt: 'Purple7',
        rightTxt: '#7137bf',
      },
      {
        leftTxt: 'Purple8',
        rightTxt: '#5610a4',
      },
      {
        leftTxt: 'Purple9',
        rightTxt: '#3b007b',
      },
      {
        leftTxt: 'Purple10',
        rightTxt: '#280057',
      },
    ],
    list2: [
      {
        leftTxt: 'Yellow4',
        rightTxt: '#f5ba18',
      },
      {
        leftTxt: 'Yellow1',
        rightTxt: '#fff5e4',
      },
      {
        leftTxt: 'Yellow2',
        rightTxt: '#ffe7b5',
      },
      {
        leftTxt: 'Yellow3',
        rightTxt: '#ffd36d',
      },
      {
        leftTxt: 'Yellow4',
        rightTxt: '#f5ba18',
      },
      {
        leftTxt: 'Yellow5',
        rightTxt: '#d8a100',
      },
      {
        leftTxt: 'Yellow6',
        rightTxt: '#b38500',
      },
      {
        leftTxt: 'Yellow7',
        rightTxt: '#8b6600',
      },
      {
        leftTxt: 'Yellow8',
        rightTxt: '#654900',
      },
      {
        leftTxt: 'Yellow9',
        rightTxt: '#443000',
      },
      {
        leftTxt: 'Yellow10',
        rightTxt: '#2b1d00',
      },
    ],
    list3: [
      {
        leftTxt: 'Pink5',
        rightTxt: '#e851b3',
      },
      {
        leftTxt: 'Pink1',
        rightTxt: '#fff0f6',
      },
      {
        leftTxt: 'Pink2',
        rightTxt: '#ffd8eb',
      },
      {
        leftTxt: 'Pink3',
        rightTxt: '#ffaedc',
      },
      {
        leftTxt: 'Pink4',
        rightTxt: '#ff79cd',
      },
      {
        leftTxt: 'Pink5',
        rightTxt: '#e851b3',
      },
      {
        leftTxt: 'Pink6',
        rightTxt: '#c43695',
      },
      {
        leftTxt: 'Pink7',
        rightTxt: '#a12279',
      },
      {
        leftTxt: 'Pink8',
        rightTxt: '#800a5f',
      },
      {
        leftTxt: 'Pink9',
        rightTxt: '#610046',
      },
      {
        leftTxt: 'Pink10',
        rightTxt: '#43002f',
      },
    ],
  },
});
const { listFeatures, listNeutralLeft, listNeutralRight, listBrandLeft, listBrandRight, listExpand } = toRefs(state);
const listGuideUi = computed(() => localeArray<GuideToken>(tm('color.guideTokens')));

function copyColor(color: string | undefined) {
  if (!color) return;
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(color);
    message.success(t('color.copySuccess'));
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.textContent = color;
  textarea.style.width = '0';
  textarea.style.height = '0';
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  if (!selection) {
    document.body.removeChild(textarea);
    return;
  }
  const range = document.createRange();
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(textarea);

  message.success(t('color.copySuccess'));
}
</script>
