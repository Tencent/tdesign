<template>
  <div ref="article" name="DOC" class="doc-fonts">
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

    <h2>{{ t('fonts.summary.title') }}</h2>
    <p>{{ t('fonts.summary.description') }}</p>
    <p>{{ t('fonts.summary.principles') }}</p>

    <h2>{{ t('fonts.style.title') }}</h2>
    <p>{{ t('fonts.style.description') }}</p>

    <h3>{{ t('fonts.family.title') }}</h3>
    <p>{{ t('fonts.family.description') }}</p>
    <p>{{ t('fonts.family.note') }}</p>

    <pre><code>{{ t('fonts.family.stack') }}</code></pre>

    <h4>{{ t('fonts.numberFont.title') }}</h4>
    <p>
      {{ t('fonts.numberFont.description') }}
      <a class="download-link" :href="fontDownloadUrl" target="_blank">{{ t('fonts.numberFont.download') }}</a>
    </p>
    <div class="fonts-block tcloud">
      <font>%*+,-./0123456789:</font>
    </div>

    <h3>{{ t('fonts.size.title') }}</h3>
    <p>{{ t('fonts.size.description') }}</p>
    <p>{{ t('fonts.size.primary') }}</p>
    <p>{{ t('fonts.size.secondary') }}</p>
    <div class="fonts-block font-steps">
      <div>
        <span class="step title">{{ t('fonts.size.stepColumn') }}</span>
        <span class="title">{{ t('fonts.size.sizeColumn') }}</span>
      </div>
      <template v-for="(item, i) in fontList" :key="i">
        <div v-if="item.type === 'divider'" class="divider"></div>
        <div v-else :class="['font-' + item.fontSize]">
          <span class="step">{{ item.step }}</span>
          <span>{{ item.size }}</span>
          <span v-if="item.desc" class="desc">{{ item.desc }}</span>
        </div>
      </template>
    </div>

    <h3>{{ t('fonts.lineHeight.title') }}</h3>
    <p>{{ t('fonts.lineHeight.standard') }}</p>
    <p>{{ t('fonts.lineHeight.problem') }}</p>
    <p>{{ t('fonts.lineHeight.solution') }}</p>
    <div class="fonts-block font-size">
      <div class="ctrl">
        <t-select
          v-model="fontSize"
          :bordered="false"
          style="width: 146px"
          :placeholder="t('fonts.lineHeight.placeholder')"
          :options="fontSelectList"
        />
        <t-slider v-model="fontSize" :min="10" :max="64" :step="2" :input-number-props="false" />
      </div>
      <p :class="['font-' + fontSize]">{{ t('fonts.sample') }}</p>
      <div class="divider"></div>
      <p class="line-height">{{ t('fonts.lineHeight.value', { value: Number(fontSize) + 8 }) }}</p>
    </div>

    <pre><code>{{ t('fonts.lineHeight.formula') }}</code><br /><code>{{ t('fonts.lineHeight.variable') }}</code></pre>

    <h3>{{ t('fonts.weight.title') }}</h3>
    <p>{{ t('fonts.weight.description') }}</p>
    <p>{{ t('fonts.weight.platforms') }}</p>
    <p>{{ t('fonts.weight.values') }}</p>
    <div class="fonts-block font-weight">
      <span class="weight-600">{{ t('fonts.weight.sample600') }}</span>
      <span>{{ t('fonts.weight.sample400') }}</span>
    </div>

    <h3>{{ t('fonts.color.title') }}</h3>
    <p>{{ t('fonts.color.description') }}</p>
    <p>{{ t('fonts.color.levels') }}</p>
    <p>{{ t('fonts.color.note') }}</p>
    <p>{{ t('fonts.color.usage') }}</p>
    <div class="fonts-block-wrapper">
      <div class="fonts-block">
        <ul class="color-list">
          <li
            v-for="item in fontColorListLeft"
            :key="item.text"
            class="item"
            :style="{ background: item.background, color: item.color }"
            @click="copyColor(item.background)"
          >
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
      <div class="fonts-block black">
        <ul class="color-list">
          <li
            v-for="item in fontColorListRight"
            :key="item.text"
            class="item"
            :style="{ background: item.background, color: item.color }"
            @click="copyColor(item.background)"
          >
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from '@/locales/pages/design-basic';

import useAnchor from '../mixins/anchor';
import type { MessageApi } from '../types';

interface FontSizeOption {
  label: string;
  value: number;
}

type FontListItem =
  | { type: 'divider' }
  | {
      type?: undefined;
      step: string;
      size: string;
      fontSize: number;
      desc?: string;
    };

interface FontColor {
  background: string;
  color: string;
  text: string;
  style: string;
}

const { article, catalog, genAnchor } = useAnchor();
const instance = getCurrentInstance();
if (!instance) throw new Error('fonts.vue must be initialized inside a component instance');
const message = instance.appContext.config.globalProperties.$message as MessageApi;
const { locale, t } = useI18n({ messages });

watch(locale, async () => {
  await nextTick();
  genAnchor();
});

const fontDownloadUrl =
  'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/design-source/TCloudNumber%20v1.010.zip';

function genFontSize(num: number): FontSizeOption[] {
  const result: FontSizeOption[] = [];
  for (let i = 10; i <= num; i += 2) {
    result.push({ label: t('fonts.size.option', { size: i }), value: i });
  }
  return result;
}

const fontSize = ref(48);
const fontList = computed<FontListItem[]>(() => [
  {
    step: t('fonts.size.baseStep'),
    size: t('fonts.size.items.mobileMinimum'),
    fontSize: 10,
    desc: t('fonts.size.primaryLabel'),
  },
  { step: '+2', size: t('fonts.size.items.desktopMinimum'), fontSize: 12 },
  { step: '+2', size: t('fonts.size.items.body'), fontSize: 14 },
  { step: '+2', size: t('fonts.size.items.tdesign16'), fontSize: 16 },
  { type: 'divider' },
  { step: '+4', size: t('fonts.size.items.tdesign20'), fontSize: 20, desc: t('fonts.size.secondaryLabel') },
  ...[24, 28, 36, 48, 64].map((size, index) => ({
    step: ['+4', '+4', '+8', '+12', '+16'][index],
    size: t('fonts.size.items.tdesign', { size }),
    fontSize: size,
  })),
]);
const fontSelectList = computed(() => genFontSize(64));
const fontColorListLeft = computed<FontColor[]>(() =>
  [90, 60, 40, 26].map((opacity, index) => ({
    background: `rgba(0, 0, 0, ${opacity / 100})`,
    color: '#fff',
    text: t('fonts.color.grayLabel', { number: index + 1 }),
    style: t('fonts.color.grayValue', { opacity }),
  })),
);
const fontColorListRight = computed<FontColor[]>(() =>
  [100, 55, 35, 22].map((opacity, index) => ({
    background: `rgba(255, 255, 255, ${opacity / 100})`,
    color: index ? '#fff' : 'rgba(0,0,0,.9)',
    text: t('fonts.color.whiteLabel', { number: index + 1 }),
    style: t('fonts.color.whiteValue', { opacity }),
  })),
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
.download-link {
  color: var(--brand-main);
  text-decoration: underline;
  cursor: pointer;
}
</style>
