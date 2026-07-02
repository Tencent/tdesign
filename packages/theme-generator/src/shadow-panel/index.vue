<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="shadow-content__content" :style="contentStyle">
      <div class="shadow-content__main">
        <p class="shadow-content__title">{{ lang.shadow.title }}</p>
        <SegmentSelection
          v-model="step"
          :selectOptions="selectOptions"
          :suspendedLabels="suspendedLabels"
          :disabled="forbidden"
        >
          <template #left>
            <div class="shadow-panel__round-box" :style="{ 'box-shadow': leftShadow }"></div>
          </template>
          <template #right>
            <div class="shadow-panel__round-box" :style="{ 'box-shadow': rightShadow }"></div>
          </template>
        </SegmentSelection>
        <shadow-card
          v-for="(shadow, i) in shadowPalette"
          :key="i"
          :index="i"
          :shadow="shadow"
          :detail="shadowTypeDetail[i]"
          @change="(value) => change(value, i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { SegmentSelection } from '@/common/components';
import { useLang } from '@/common/i18n';
import { getOptionFromLocal, modifyToken, updateLocalOption } from '@/common/themes';
import { getTokenValue } from '@/common/utils';

import {
  ShadowSelect,
  ShadowSelectDetail,
  ShadowSelectType,
  ShadowTypeDetail,
  ShadowTypeMap,
} from './built-in/shadow-map';
import ShadowCard from './components/ShadowCard';

defineOptions({ name: 'ShadowPanel' });

const props = defineProps({
  top: Number,
});

const { lang, isEn } = useLang();

const selectOptions = ShadowSelect;
const shadowTypeDetail = ShadowTypeDetail;
const step = ref(getOptionFromLocal('shadow') || ShadowSelectType.Default);
const shadowPalette = ref([]);
const suspendedLabels = ref({});

// created
suspendedLabels.value = selectOptions.reduce((acc, option) => {
  acc[option.value] = isEn ? option.enLabel : option.label;
  return acc;
}, {});

const contentStyle = computed(() => {
  const clientHeight = window.innerHeight;
  return {
    overflowY: 'scroll',
    height: `${clientHeight - (props.top || 0) - 96}px`,
  };
});

const leftShadow = computed(() => {
  const selectKeys = Object.keys(ShadowSelectDetail);
  if (selectKeys.length < 1) return '';
  const shadowArray = ShadowSelectDetail[selectKeys[0]][0];
  return shadowArray;
});

const rightShadow = computed(() => {
  const selectKeys = Object.keys(ShadowSelectDetail);
  if (selectKeys.length < 1) return '';
  // 倒数第二个的，最后一个为自定义
  const shadowArray = ShadowSelectDetail[selectKeys[selectKeys.length - 2]][0];
  return shadowArray;
});

const forbidden = computed(() => step.value === ShadowSelectType.Self_Defined);

// 拆分 box-shadow 的值 0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 8%), 0 2px 4px -1px rgba(0, 0, 0, 12%)
function splitShadowValue(data) {
  const tempData = `${data},`;
  const shadows = tempData.split('),');
  return shadows
    .filter((shadow) => shadow)
    .map((shadow) => {
      const value = shadow.trim();
      return `${value})`;
    });
}

function getCurrentPalette() {
  const currentPalette = [...new Array(ShadowTypeMap.length).keys()].map((_, i) => {
    const { value, from } = ShadowTypeMap[i];
    if (value) return value;
    const data = getTokenValue(from);
    return splitShadowValue(data);
  });
  return currentPalette;
}

function change(value, index) {
  step.value = ShadowSelectType.Self_Defined;
  const val = [...shadowPalette.value];
  val[index] = value;
  shadowPalette.value = val;
}

function setCurrentPalette() {
  const currentTokenArr = getCurrentPalette();
  shadowPalette.value = currentTokenArr.map((token) => splitShadowValue(token));
}

watch(step, (nVal) => {
  updateLocalOption('shadow', nVal !== ShadowSelectType.Default ? nVal : null);
  // 自定义时去当前系统值
  if (nVal === ShadowSelectType.Self_Defined) {
    // this.shadowPalette = this.getCurrentPalette();
    return;
  }
  const shadows = ShadowSelectDetail[nVal];
  if (!shadows) return;
  shadowPalette.value = shadows.map((shadow) => splitShadowValue(shadow));
});

watch(shadowPalette, (nVal) => {
  // shadowPalette 值变化时认为有编辑
  const currentPalette = getCurrentPalette();
  for (let index = 0; index < nVal.length; index++) {
    const shadow = nVal[index];
    const current = currentPalette[index];
    const newShadow = shadow.join(',');
    if (newShadow === current.join(',')) continue;
    const { name } = ShadowTypeMap[index];

    const isCustom = step.value === ShadowSelectType.Self_Defined;
    modifyToken(name, newShadow, isCustom);
  }
});

onMounted(() => {
  nextTick(() => {
    setCurrentPalette();
  });
});
</script>

<style scoped lang="less">
:deep(.t-popup[data-popper-placement='bottom-end']) .t-popup__arrow {
  left: calc(100% - 16px * 2) !important;
}

.shadow-content {
  &__content {
    padding: 0;
    overflow: auto;

    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: var(--bg-color-scroll);
      }
    }

    &::-webkit-scrollbar {
      width: 12px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      border: 4px solid transparent;
      background-clip: content-box;
      background-color: transparent;
    }
  }

  &__main {
    padding: 12px 4px 16px 16px;
  }

  &__title {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 8px;
    margin-top: 0px;
    line-height: 22px;
    display: flex;
    align-items: center;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
}
.shadow-panel {
  &__round-box {
    width: 20px;
    height: 20px;
    background: var(--bg-color-theme-surface);
    border-radius: 3px;
  }
}
</style>
