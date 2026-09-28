<template>
  <div ref="article" name="DOC" class="doc-fonts">
    <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
      <ol class="tdesign-toc_list">
        <li class="tdesign-toc_list_item" v-for="anchor in catalog" :key="anchor.id">
          <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
          <ol class="tdesign-toc_list" v-if="anchor.children.length">
            <li class="tdesign-toc_list_item" v-for="subAnchor in anchor.children" :key="subAnchor.id">
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
        <t-slider v-model="fontSize" :min="10" :max="64" :step="2" :inputNumberProps="false" />
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
            class="item"
            @click="copyColor(item.background)"
            v-for="item in fontColorListLeft"
            :key="item.text"
            :style="{ background: item.background, color: item.color }"
          >
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
      <div class="fonts-block black">
        <ul class="color-list">
          <li
            class="item"
            @click="copyColor(item.background)"
            v-for="item in fontColorListRight"
            :key="item.text"
            :style="{ background: item.background, color: item.color }"
          >
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from '@/locales/pages/design-basic';

const article = ref(null);
const catalog = ref([]);
const { proxy } = getCurrentInstance();
const { locale, t } = useI18n({ messages });

function genAnchor() {
  if (!article.value) return;
  const nodes = ['H2', 'H3'];
  const titles = [];
  article.value.childNodes.forEach((element, index) => {
    if (nodes.includes(element.nodeName)) {
      const id = `header-${index}`;
      element.setAttribute('id', id);
      titles.push({
        id,
        title: element.textContent,
        level: Number(element.nodeName.substring(1, 2)),
        nodeName: element.nodeName,
        children: [],
      });
    }
  });

  const isEveryLevel3 = titles.every((title) => title.level === 3);
  catalog.value = titles.reduce((result, current) => {
    if (isEveryLevel3 || current.level === 2) {
      result.push(current);
    } else if (current.level === 3) {
      result[result.length - 1].children.push(current);
    }
    return result;
  }, []);
}

onMounted(genAnchor);
watch(locale, async () => {
  await nextTick();
  genAnchor();
});

const fontDownloadUrl =
  'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/design-source/TCloudNumber%20v1.010.zip';

function genFontSize(num) {
  const result = [];
  for (let i = 10; i <= num; i += 2) {
    result.push({ label: t('fonts.size.option', { size: i }), value: i });
  }
  return result;
}

const fontSize = ref(48);
const fontList = computed(() => [
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
const fontColorListLeft = computed(() =>
  [90, 60, 40, 26].map((opacity, index) => ({
    background: `rgba(0, 0, 0, ${opacity / 100})`,
    color: '#fff',
    text: t('fonts.color.grayLabel', { number: index + 1 }),
    style: t('fonts.color.grayValue', { opacity }),
  })),
);
const fontColorListRight = computed(() =>
  [100, 55, 35, 22].map((opacity, index) => ({
    background: `rgba(255, 255, 255, ${opacity / 100})`,
    color: index ? '#fff' : 'rgba(0,0,0,.9)',
    text: t('fonts.color.whiteLabel', { number: index + 1 }),
    style: t('fonts.color.whiteValue', { opacity }),
  })),
);

function copyColor(color) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(color);
    proxy.$message.success(t('common.copied'));
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.textContent = color;
  textarea.style.width = 0;
  textarea.style.height = 0;
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(textarea);

  proxy.$message.success(t('common.copied'));
}
</script>

<style lang="less">
.download-link {
  color: var(--brand-main);
  text-decoration: underline;
  cursor: pointer;
}
</style>
