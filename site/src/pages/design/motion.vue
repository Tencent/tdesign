<template>
  <div ref="article" name="DOC" class="doc-motion">
    <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
      <ol class="tdesign-toc_list">
        <li v-for="anchor in catalog" :key="anchor.id" class="tdesign-toc_list_item">
          <a class="tdesign-toc_list_item_a" :href="`#${anchor.id}`">{{ anchor.title }} </a>
          <ol v-if="anchor.children.length" class="tdesign-toc_list">
            <li v-for="subAnchor in anchor.children" :key="subAnchor.id" class="tdesign-toc_list_item">
              <a class="tdesign-toc_list_item_a" :href="`#${subAnchor.id}`">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <h2>{{ t('motion.summary.title') }}</h2>
    <p>{{ t('motion.summary.text') }}</p>

    <h2>{{ t('motion.principle.title') }}</h2>
    <p>{{ t('motion.principle.intro') }}</p>
    <h3>{{ t('motion.principle.understandingTitle') }}</h3>
    <p>{{ t('motion.principle.understanding') }}</p>
    <h3>{{ t('motion.principle.focusingTitle') }}</h3>
    <p>{{ t('motion.principle.focusing') }}</p>
    <h3>{{ t('motion.principle.empathyTitle') }}</h3>
    <p>{{ t('motion.principle.empathy') }}</p>
    <br />
    <p>{{ t('motion.principle.goal') }}</p>
    <h3>{{ t('motion.principle.measureTitle') }}</h3>
    <i18n-t keypath="motion.principle.measure" tag="p">
      <template #link>
        <a href="#motion-self-check">{{ t('motion.principle.selfCheckLink') }}</a>
      </template>
    </i18n-t>

    <h2>{{ t('motion.mode.title') }}</h2>
    <p>{{ t('motion.mode.intro') }}</p>
    <h3>{{ t('motion.mode.definitionTitle') }}</h3>
    <p>{{ t('motion.mode.micro') }}</p>
    <p>{{ t('motion.mode.macro') }}</p>
    <h3>{{ t('motion.mode.chooseTitle') }}</h3>
    <p>{{ t('motion.mode.choose') }}</p>
    <ul>
      <li>
        <b>{{ t('motion.mode.axisItem') }}</b>
      </li>
      <li>
        <b>{{ t('motion.mode.containerItem') }}</b>
      </li>
      <li>
        <b>{{ t('motion.mode.fadeItem') }}</b>
      </li>
    </ul>

    <h3>{{ t('motion.mode.axisTitle') }}</h3>
    <p>{{ t('motion.mode.axis') }}</p>
    <p>{{ t('motion.mode.axisDetail') }}</p>
    <div class="axis-motion">
      <t-radio-group variant="default-filled" :value="axisValue" @change="changeAxis">
        <t-radio-button value="x">{{ t('motion.mode.xAxis') }}</t-radio-button>
        <t-radio-button value="y">{{ t('motion.mode.yAxis') }}</t-radio-button>
        <t-radio-button value="z">{{ t('motion.mode.zAxis') }}</t-radio-button>
      </t-radio-group>
      <div v-show="axisValue === 'x'" ref="axisX" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'x'" ref="axisXDark" class="axis-motion-stage dark"></div>
      <div v-show="axisValue === 'y'" ref="axisY" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'y'" ref="axisYDark" class="axis-motion-stage dark"></div>
      <div v-show="axisValue === 'z'" ref="axisZ" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'z'" ref="axisZDark" class="axis-motion-stage dark"></div>
    </div>

    <h3>{{ t('motion.mode.containerTitle') }}</h3>
    <p>{{ t('motion.mode.container') }}</p>
    <div ref="containerMotion" class="container-motion"></div>
    <div ref="containerMotionDark" class="container-motion dark"></div>
    <p>{{ t('motion.mode.containerDetail') }}</p>
    <div ref="containerMotionSample" class="container-motion"></div>
    <div ref="containerMotionSampleDark" class="container-motion dark"></div>

    <h3>{{ t('motion.mode.fadeTitle') }}</h3>
    <p>{{ t('motion.mode.fade') }}</p>
    <div ref="fadeMotion" class="fade-motion"></div>
    <div ref="fadeMotionDark" class="fade-motion dark"></div>

    <h2>{{ t('motion.duration.title') }}</h2>
    <p>{{ t('motion.duration.intro') }}</p>
    <p>{{ t('motion.duration.detail') }}</p>
    <pre class="sport-code"><code>{{ t('motion.duration.formula') }}</code></pre>
    <h3>{{ t('motion.duration.fixedTitle') }}</h3>
    <p>{{ t('motion.duration.fixed') }}</p>
    <p>{{ t('motion.duration.research') }}</p>
    <p>{{ t('motion.duration.tokenIntro') }}</p>
    <table class="motion-table">
      <thead>
        <tr>
          <th>{{ t('motion.duration.token') }}</th>
          <th>{{ t('motion.duration.usage') }}</th>
          <th>{{ t('motion.duration.value') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in durationRows" :key="row.token">
          <td>{{ row.token }}</td>
          <td>{{ t(row.usageKey) }}</td>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
    <h3>{{ t('motion.duration.dynamicTitle') }}</h3>
    <p>{{ t('motion.duration.dynamic') }}</p>
    <div></div>

    <h2>{{ t('motion.easing.title') }}</h2>
    <p v-html="t('motion.easing.intro')"></p>
    <table class="motion-table">
      <thead>
        <tr>
          <th>{{ t('motion.duration.token') }}</th>
          <th>{{ t('motion.duration.usage') }}</th>
          <th>{{ t('motion.easing.cssValue') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in easingRows" :key="row.token">
          <td>{{ row.token }}</td>
          <td>{{ t(row.usageKey) }}</td>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>

    <div class="slow-motion">
      <t-radio-group variant="default-filled" :value="slowValue" @change="changeSlow">
        <t-radio-button value="easing">{{ t('motion.easing.standard') }}</t-radio-button>
        <t-radio-button value="ease-out">{{ t('motion.easing.out') }}</t-radio-button>
        <t-radio-button value="ease-in">{{ t('motion.easing.in') }}</t-radio-button>
        <t-radio-button value="linear">{{ t('motion.easing.linear') }}</t-radio-button>
      </t-radio-group>
      <div v-show="slowValue === 'easing'" class="slow-motion-stage easing">
        <img class="preview" src="./assets/motion/easing.svg" alt="" />
        <div class="detail"><div class="ball"></div></div>
      </div>
      <div v-show="slowValue === 'ease-out'" class="slow-motion-stage ease-out">
        <img class="preview" src="./assets/motion/ease-out.svg" alt="" />
        <div class="detail"><div class="ball"></div></div>
      </div>
      <div v-show="slowValue === 'ease-in'" class="slow-motion-stage ease-in">
        <img class="preview" src="./assets/motion/ease-in.svg" alt="" />
        <div class="detail"><div class="ball"></div></div>
      </div>
      <div v-show="slowValue === 'linear'" class="slow-motion-stage linear">
        <img class="preview" src="./assets/motion/linear.svg" alt="" />
        <div class="detail"><div class="ball"></div></div>
      </div>
    </div>

    <h2>{{ t('motion.brand.title') }}</h2>
    <p>{{ t('motion.brand.text') }}</p>
    <div class="motion-board">
      <t-button>{{ t('motion.brand.button') }}</t-button>
      <t-select v-model="value" style="width: 240px" :options="options" :placeholder="t('motion.brand.placeholder')" />
    </div>

    <h2>{{ t('motion.arrangement.title') }}</h2>
    <p>{{ t('motion.arrangement.intro') }}</p>
    <h3>{{ t('motion.arrangement.pathTitle') }}</h3>
    <p>{{ t('motion.arrangement.path') }}</p>
    <h4>{{ t('motion.arrangement.biAxialTitle') }}</h4>
    <p>{{ t('motion.arrangement.biAxial') }}</p>
    <h4>{{ t('motion.arrangement.singleTitle') }}</h4>
    <p>{{ t('motion.arrangement.single') }}</p>
    <h4>{{ t('motion.arrangement.combinationTitle') }}</h4>
    <p>{{ t('motion.arrangement.combination') }}</p>
    <h3>{{ t('motion.arrangement.reduceTitle') }}</h3>
    <p>{{ t('motion.arrangement.reduce') }}</p>

    <h2 id="motion-self-check">{{ t('motion.check.title') }}</h2>
    <p>{{ t('motion.check.intro') }}</p>
    <table ref="tableCheck" class="table-check">
      <template v-for="section in checkSections" :key="section.titleKey">
        <thead>
          <tr>
            <th></th>
            <th>{{ t(section.titleKey) }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in section.items" :key="item.textKey">
            <td>
              <label>
                <input type="checkbox" />
                <t-icon name="check-circle-filled" />
              </label>
            </td>
            <td>{{ t(item.textKey) }}</td>
            <td :class="{ desc: item.descKey }">{{ item.descKey ? t(item.descKey) : '' }}</td>
          </tr>
        </tbody>
      </template>
    </table>

    <a ref="downloadBtn" href="" :download="t('motion.check.filename')" :aria-label="t('motion.check.download')">
      <t-button class="download-btn" shape="circle" theme="default" :title="t('motion.check.download')">
        <template #icon><img width="16" src="./assets/motion/download.svg" alt="" /></template>
      </t-button>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import lottie, { type AnimationItem } from 'lottie-web';

import messages from '../../locales/pages/design-motion-icon';
import xAxis from './assets/motion/X_Axis.json';
import xAxisDark from './assets/motion/X_Axis_dark.json';
import yAxis from './assets/motion/Y_Axis.json';
import yAxisDark from './assets/motion/Y_Axis_dark.json';
import zAxis from './assets/motion/Z_Axis.json';
import zAxisDark from './assets/motion/Z_Axis_dark.json';
import containerTrans from './assets/motion/container_trans.json';
import containerTransDark from './assets/motion/container_trans_dark.json';
import containerTransSample from './assets/motion/container_trans_sample.json';
import containerTransSampleDark from './assets/motion/container_trans_sample_dark.json';
import fadeInOut from './assets/motion/fade_in_out.json';
import fadeInOutDark from './assets/motion/fade_in_out_dark.json';

const { locale, t } = useI18n({ messages });
const lottieProps = { renderer: 'svg' as const, loop: true, autoplay: true };
const animations: AnimationItem[] = [];
let downloadUrl: string | undefined;

interface Anchor {
  id: string;
  title: string;
  level: number;
  children: Anchor[];
}

type AxisValue = 'x' | 'y' | 'z';
type SlowValue = 'easing' | 'ease-out' | 'ease-in' | 'linear';

const durationRows = [
  { token: '@duration-mobile-base', usageKey: 'motion.duration.mobileBase', value: '100ms' },
  { token: '@duration-mobile-moderate', usageKey: 'motion.duration.mobileModerate', value: '120ms' },
  { token: '@duration-mobile-slow', usageKey: 'motion.duration.mobileSlow', value: '140ms' },
  { token: '@duration-desktop-base', usageKey: 'motion.duration.desktopBase', value: '200ms' },
  { token: '@duration-desktop-moderate', usageKey: 'motion.duration.desktopModerate', value: '240ms' },
  { token: '@duration-desktop-slow', usageKey: 'motion.duration.desktopSlow', value: '280ms' },
];
const easingRows = [
  { token: '@standard easing', usageKey: 'motion.easing.standardUsage', value: 'cubic-bezier(.38,0,.24,1)' },
  { token: '@ease out', usageKey: 'motion.easing.outUsage', value: 'cubic-bezier(0,0,.15,1)' },
  { token: '@ease in', usageKey: 'motion.easing.inUsage', value: 'cubic-bezier(0.82,0,1,.9)' },
  { token: '@linear', usageKey: 'motion.easing.linearUsage', value: 'N/A' },
];
const checkSections = [
  {
    titleKey: 'motion.check.meaning',
    items: [
      { textKey: 'motion.check.solve' },
      { textKey: 'motion.check.understand' },
      { textKey: 'motion.check.entropy' },
    ],
  },
  {
    titleKey: 'motion.check.perceived',
    items: [
      { textKey: 'motion.check.category' },
      { textKey: 'motion.check.duration' },
      { textKey: 'motion.check.allEnds', descKey: 'motion.check.allEndsDesc' },
    ],
  },
  {
    titleKey: 'motion.check.elegant',
    items: [
      { textKey: 'motion.check.curve' },
      { textKey: 'motion.check.simple', descKey: 'motion.check.simpleDesc' },
      { textKey: 'motion.check.excessive' },
      { textKey: 'motion.check.static' },
    ],
  },
];

const article = ref<HTMLElement | null>(null);
const catalog = ref<Anchor[]>([]);
const axisValue = ref<AxisValue>('x');
const slowValue = ref<SlowValue>('easing');
const value = ref('');
const options = computed(() => [
  { label: t('motion.brand.options.architecture'), value: '1' },
  { label: t('motion.brand.options.bigData'), value: '2' },
  { label: t('motion.brand.options.blockchain'), value: '3' },
  { label: t('motion.brand.options.iot'), value: '4', disabled: true },
  { label: t('motion.brand.options.ai'), value: '5' },
  {
    label: t('motion.brand.options.computing'),
    value: '6',
    content: () => h('span', t('motion.brand.options.computingDetail')),
  },
]);

const axisX = ref<HTMLElement | null>(null);
const axisXDark = ref<HTMLElement | null>(null);
const axisY = ref<HTMLElement | null>(null);
const axisYDark = ref<HTMLElement | null>(null);
const axisZ = ref<HTMLElement | null>(null);
const axisZDark = ref<HTMLElement | null>(null);
const containerMotion = ref<HTMLElement | null>(null);
const containerMotionDark = ref<HTMLElement | null>(null);
const containerMotionSample = ref<HTMLElement | null>(null);
const containerMotionSampleDark = ref<HTMLElement | null>(null);
const fadeMotion = ref<HTMLElement | null>(null);
const fadeMotionDark = ref<HTMLElement | null>(null);
const tableCheck = ref<HTMLTableElement | null>(null);
const downloadBtn = ref<HTMLAnchorElement | null>(null);

const genAnchor = () => {
  if (!article.value) return;
  const titles: Anchor[] = [];
  Array.from(article.value.children).forEach((element, index) => {
    if (['H2', 'H3'].includes(element.nodeName)) {
      const id = element.id || `header-${index}`;
      element.id = id;
      titles.push({
        id,
        title: element.textContent ?? '',
        level: Number(element.nodeName.slice(1)),
        children: [],
      });
    }
  });
  const isEveryLevel3 = titles.every((title) => title.level === 3);
  catalog.value = titles.reduce<Anchor[]>((result, current) => {
    if (isEveryLevel3 || current.level === 2) {
      result.push(current);
    } else {
      result[result.length - 1]?.children.push(current);
    }
    return result;
  }, []);
};

const loadAnimations = () => {
  const animationConfigs: Array<[Ref<HTMLElement | null>, object]> = [
    [axisX, xAxis],
    [axisXDark, xAxisDark],
    [axisY, yAxis],
    [axisYDark, yAxisDark],
    [axisZ, zAxis],
    [axisZDark, zAxisDark],
    [containerMotion, containerTrans],
    [containerMotionDark, containerTransDark],
    [containerMotionSample, containerTransSample],
    [containerMotionSampleDark, containerTransSampleDark],
    [fadeMotion, fadeInOut],
    [fadeMotionDark, fadeInOutDark],
  ];

  animationConfigs.forEach(([container, animationData]) => {
    if (!container.value) return;
    animations.push(lottie.loadAnimation({ ...lottieProps, container: container.value, animationData }));
  });
};

const changeAxis = (newValue: unknown) => {
  if (newValue === 'x' || newValue === 'y' || newValue === 'z') axisValue.value = newValue;
};
const changeSlow = (newValue: unknown) => {
  if (newValue === 'easing' || newValue === 'ease-out' || newValue === 'ease-in' || newValue === 'linear') {
    slowValue.value = newValue;
  }
};

const initDownloadTable = () => {
  if (!tableCheck.value || !downloadBtn.value) return;
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  const html = `<html><head><meta charset="utf-8"></head><body>${tableCheck.value.outerHTML}</body></html>`;
  downloadUrl = URL.createObjectURL(new Blob([html], { type: 'application/vnd.ms-excel' }));
  downloadBtn.value.href = downloadUrl;
};

onMounted(() => {
  genAnchor();
  loadAnimations();
  initDownloadTable();
});

watch(locale, async () => {
  await nextTick();
  genAnchor();
  initDownloadTable();
});

onBeforeUnmount(() => {
  animations.forEach((animation) => animation.destroy());
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
});
</script>
