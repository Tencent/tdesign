<template>
  <div ref="article" name="DOC" class="doc-mode">
    <nav class="td-toc-container" style="position: absolute; top: 328px">
      <ol class="td-toc-list">
        <li v-for="anchor in catalog" :key="anchor.id" class="td-toc-list-item">
          <a class="td-toc-link" :href="'#' + anchor.id">{{ anchor.title }} </a>
          <ol v-if="anchor.children.length" class="td-toc-list">
            <li v-for="subAnchor in anchor.children" :key="subAnchor.id" class="td-toc-list-item">
              <a class="td-toc-link" :href="'#' + subAnchor.id">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <h2>{{ t('dark.summary.title') }}</h2>
    <p>{{ t('dark.summary.description') }}</p>

    <img class="starter" src="./assets/mode/starter.png" :alt="t('dark.summary.imageAlt')" />

    <h2>{{ t('dark.principles.title') }}</h2>
    <template v-for="principle in principles" :key="principle.key">
      <h3>{{ principle.title }}</h3>
      <p>{{ principle.description }}</p>
    </template>

    <h2>{{ t('dark.text.title') }}</h2>
    <p>{{ t('dark.text.description') }}</p>

    <t-table style="margin: 16px 0" bordered :data="dataSource" :columns="columns" row-key="index" size="small" />

    <h2>{{ t('dark.color.title') }}</h2>
    <p>{{ t('dark.color.description') }}</p>
    <p>{{ t('dark.color.paletteDescription') }}</p>

    <h3>{{ t('dark.color.basicPalette') }}</h3>

    <div class="color-board">
      <div v-for="(item, index) in colorList" :key="index" class="color-board-lists">
        <div
          v-for="(listLi, itemIndex) in item"
          :key="itemIndex"
          class="color-board-list"
          :style="{ background: listLi.rightTxt }"
          @click="copyColor(listLi.rightTxt)"
        >
          <p v-if="listLi.topTitle" class="color-board-bottom-txt">{{ listLi.topTitle }}</p>
          <p class="color-board-top-txt">
            <span>{{ listLi.leftTxt }}</span>
            <span>{{ listLi.rightTxt }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from '@/locales/pages/design-basic';

import useAnchor from '../mixins/anchor';
import type { MessageApi, PaletteColor } from '../types';

interface TextRow {
  index: number;
  token: string;
  name: string;
  color: string;
}

interface TextColumn {
  ellipsis: boolean;
  colKey: keyof Omit<TextRow, 'index'>;
}

interface DarkPageState {
  dataSource: TextRow[];
  columns: TextColumn[];
  colorList: Record<string, PaletteColor[]>;
}

const { article, catalog, genAnchor } = useAnchor();
const instance = getCurrentInstance();
if (!instance) throw new Error('dark.vue must be initialized inside a component instance');
const message = instance.appContext.config.globalProperties.$message as MessageApi;
const { locale, t } = useI18n({ messages });
const principles = computed(() =>
  ['contentFirst', 'readingComfort', 'consistency', 'wcag'].map((key) => ({
    key,
    title: t(`dark.principles.items.${key}.title`),
    description: t(`dark.principles.items.${key}.description`),
  })),
);

watch(locale, async () => {
  await nextTick();
  genAnchor();
});

const state = reactive<DarkPageState>({
  dataSource: [
    {
      index: 0,
      token: '@text-color-primary',
      name: 'title',
      color: '#ffffff 90%',
    },
    {
      index: 1,
      token: '@text-color-secondary',
      name: 'secondary',
      color: '#ffffff 60%',
    },
    {
      index: 2,
      token: '@text-color-placeholder',
      name: 'placeholder',
      color: '#ffffff 40%',
    },
    {
      index: 3,
      token: '@text-color-disabled',
      name: 'disabled',
      color: '#ffffff 26%',
    },
  ],
  columns: [
    { ellipsis: true, colKey: 'token' },
    { ellipsis: true, colKey: 'name' },
    { ellipsis: true, colKey: 'color' },
  ],
  colorList: {
    list: [
      {
        topTitle: 'Blue',
        leftTxt: 'Blue6',
        rightTxt: '#2174FF',
      },
      { leftTxt: 'Blue1', rightTxt: '#1E2C60' },
      { leftTxt: 'Blue2', rightTxt: '#062E9A' },
      { leftTxt: 'Blue3', rightTxt: '#073AB5' },
      { leftTxt: 'Blue4', rightTxt: '#084DCD' },
      { leftTxt: 'Blue5', rightTxt: '#0957D9' },
      { leftTxt: 'Blue6', rightTxt: '#2174FF' },
      { leftTxt: 'Blue7', rightTxt: '#478DFF' },
      { leftTxt: 'Blue8', rightTxt: '#69A1FF' },
      { leftTxt: 'Blue9', rightTxt: '#8CB8FF' },
      { leftTxt: 'Blue10', rightTxt: '#ABCAFF' },
    ],
    list1: [
      {
        topTitle: 'Cyan',
        leftTxt: 'Cyan6',
        rightTxt: '#3CB1FB',
      },
      { leftTxt: 'Cyan1', rightTxt: '#05437D' },
      { leftTxt: 'Cyan2', rightTxt: '#06579E' },
      { leftTxt: 'Cyan3', rightTxt: '#086CC0' },
      { leftTxt: 'Cyan4', rightTxt: '#0B83DF' },
      { leftTxt: 'Cyan5', rightTxt: '#0F98FA' },
      { leftTxt: 'Cyan6', rightTxt: '#3CB1FB' },
      { leftTxt: 'Cyan7', rightTxt: '#67C9FC' },
      { leftTxt: 'Cyan8', rightTxt: '#8FDDFF' },
      { leftTxt: 'Cyan9', rightTxt: '#BDEFFF' },
      { leftTxt: 'Cyan10', rightTxt: '#E0F9FF' },
    ],
    list2: [
      {
        topTitle: 'Purple',
        leftTxt: 'Purple6',
        rightTxt: '#B382F0',
      },
      { leftTxt: 'Purple1', rightTxt: '#451981' },
      { leftTxt: 'Purple2', rightTxt: '#5A2D96' },
      { leftTxt: 'Purple3', rightTxt: '#7141AC' },
      { leftTxt: 'Purple4', rightTxt: '#8755C2' },
      { leftTxt: 'Purple5', rightTxt: '#9E6CD8' },
      { leftTxt: 'Purple6', rightTxt: '#B382F0' },
      { leftTxt: 'Purple7', rightTxt: '#CB96FF' },
      { leftTxt: 'Purple8', rightTxt: '#DDB5FF' },
      { leftTxt: 'Purple9', rightTxt: '#EACFFF' },
      { leftTxt: 'Purple10', rightTxt: '#F7EBFF' },
    ],
    list3: [
      {
        topTitle: 'Pink',
        leftTxt: 'Pink6',
        rightTxt: '#FF70CF',
      },
      { leftTxt: 'Pink1', rightTxt: '#7B0554' },
      { leftTxt: 'Pink2', rightTxt: '#9B066D' },
      { leftTxt: 'Pink3', rightTxt: '#BC088A' },
      { leftTxt: 'Pink4', rightTxt: '#D435A0' },
      { leftTxt: 'Pink5', rightTxt: '#ED53B7' },
      { leftTxt: 'Pink6', rightTxt: '#FF70CF' },
      { leftTxt: 'Pink7', rightTxt: '#FF99E4' },
      { leftTxt: 'Pink8', rightTxt: '#FFBDF4' },
      { leftTxt: 'Pink9', rightTxt: '#FFDBFD' },
      { leftTxt: 'Pink10', rightTxt: '#FFF2FF' },
    ],
    list4: [
      {
        topTitle: 'Red',
        leftTxt: 'Red6',
        rightTxt: '#FB6E77',
      },
      { leftTxt: 'Red1', rightTxt: '#730524' },
      { leftTxt: 'Red2', rightTxt: '#960627' },
      { leftTxt: 'Red3', rightTxt: '#B01C37' },
      { leftTxt: 'Red4', rightTxt: '#C9384A' },
      { leftTxt: 'Red5', rightTxt: '#E35661' },
      { leftTxt: 'Red6', rightTxt: '#FB6E77' },
      { leftTxt: 'Red7', rightTxt: '#FF9195' },
      { leftTxt: 'Red8', rightTxt: '#FFB5B8' },
      { leftTxt: 'Red9', rightTxt: '#FFD6D8' },
      { leftTxt: 'Red10', rightTxt: '#FFF2F2' },
    ],
    list5: [
      {
        topTitle: 'Orange',
        leftTxt: 'Orange6',
        rightTxt: '#ED8139',
      },
      { leftTxt: 'Orange1', rightTxt: '#692204' },
      { leftTxt: 'Orange2', rightTxt: '#873105' },
      { leftTxt: 'Orange3', rightTxt: '#A24006' },
      { leftTxt: 'Orange4', rightTxt: '#C25110' },
      { leftTxt: 'Orange5', rightTxt: '#D66724' },
      { leftTxt: 'Orange6', rightTxt: '#ED8139' },
      { leftTxt: 'Orange7', rightTxt: '#FF9852' },
      { leftTxt: 'Orange8', rightTxt: '#FFB97D' },
      { leftTxt: 'Orange9', rightTxt: '#FFD8AD' },
      { leftTxt: 'Orange10', rightTxt: '#FFF4E5' },
    ],
    list6: [
      {
        topTitle: 'Yellow',
        leftTxt: 'Yellow6',
        rightTxt: '#D29E08',
      },
      { leftTxt: 'Yellow1', rightTxt: '#5E3B04' },
      { leftTxt: 'Yellow2', rightTxt: '#754E05' },
      { leftTxt: 'Yellow3', rightTxt: '#8C6106' },
      { leftTxt: 'Yellow4', rightTxt: '#A37407' },
      { leftTxt: 'Yellow5', rightTxt: '#BA8907' },
      { leftTxt: 'Yellow6', rightTxt: '#D29E08' },
      { leftTxt: 'Yellow7', rightTxt: '#EBB30E' },
      { leftTxt: 'Yellow8', rightTxt: '#FBCC30' },
      { leftTxt: 'Yellow9', rightTxt: '#FFE682' },
      { leftTxt: 'Yellow10', rightTxt: '#FFF9C2' },
    ],
    list7: [
      {
        topTitle: 'Green',
        leftTxt: 'Green6',
        rightTxt: '#07A872',
      },
      { leftTxt: 'Green1', rightTxt: '#034116' },
      { leftTxt: 'Green2', rightTxt: '#035428' },
      { leftTxt: 'Green3', rightTxt: '#046939' },
      { leftTxt: 'Green4', rightTxt: '#057E4C' },
      { leftTxt: 'Green5', rightTxt: '#06935F' },
      { leftTxt: 'Green6', rightTxt: '#07A872' },
      { leftTxt: 'Green7', rightTxt: '#37BF8E' },
      { leftTxt: 'Green8', rightTxt: '#71D5AE' },
      { leftTxt: 'Green9', rightTxt: '#B3E8D1' },
      { leftTxt: 'Green10', rightTxt: '#E8F7F1' },
    ],
  },
});
const { dataSource: rawDataSource, columns: rawColumns, colorList: rawColorList } = toRefs(state);
const dataSource = computed(() =>
  rawDataSource.value.map((item) => ({
    ...item,
    name: t(`dark.text.rows.${item.name}`),
  })),
);
const columns = computed(() =>
  rawColumns.value.map((column) => ({
    ...column,
    title: t(`dark.text.columns.${column.colKey}`),
  })),
);
const colorList = computed(() =>
  Object.fromEntries(
    Object.entries(rawColorList.value).map(([key, colors]) => [
      key,
      colors.map((color) => {
        const match = color.leftTxt.match(/^([A-Za-z]+)(\d+)$/);
        if (!match) return color;
        const [, family, level] = match;
        const familyKey = family.toLowerCase();
        return {
          ...color,
          topTitle: color.topTitle ? t(`dark.color.families.${familyKey}`) : undefined,
          leftTxt: t('dark.color.colorLabel', {
            family: t(`dark.color.families.${familyKey}`),
            level,
          }),
        };
      }),
    ]),
  ),
);

function copyColor(color: string) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(color);
    message.success(t('common.copied'));
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

  message.success(t('common.copied'));
}
</script>

<style lang="less">
.doc-mode {
  .starter {
    border-radius: 6px;
    border: 1px solid var(--component-border);
  }

  .color-card {
    display: flex;
    flex-direction: column;
    min-height: 40px;
  }

  .color-board {
    background: #242424;
    border-radius: 3px;
    padding: 16px;
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;

    .color-board-lists {
      margin-right: 16px;
      margin-bottom: 24px;
      width: calc((100% - 48px) / 4);

      &:last-of-type,
      &:nth-child(4) {
        margin-right: 0;
      }

      &:nth-child(n + 5) {
        margin-bottom: 0;
      }

      .color-board-list {
        height: 40px;
        color: rgba(0, 0, 0, 0.9);
        padding: 4px 8px;
        transition: all 0.2s var(--anim-time-fn-easing);
        cursor: pointer;

        &:hover {
          transform: scale(1.04);
          border-radius: 3px !important;
        }

        .color-board-top-txt {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
        }

        span {
          font-size: 12px;
          line-height: 20px;
        }

        &:nth-child(-n + 6) {
          color: #fff;
        }

        &:first-child {
          border-radius: 6px 6px 0 0;
          height: 56px;
          color: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-flow: column;
          justify-content: space-between;

          .color-board-bottom-txt {
            font-size: 12px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.9);
            font-weight: 500;
          }

          .color-board-top-txt {
            height: unset;
          }
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }
      }
    }
  }
}
</style>
