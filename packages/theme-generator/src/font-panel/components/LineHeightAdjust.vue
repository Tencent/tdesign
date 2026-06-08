<template>
  <div>
    <!-- 顶部调整 -->
    <SegmentSelection
      v-if="tokenType === 'plus'"
      v-model="step"
      :style="{ margin: '8px 0' }"
      :selectOptions="lineHeightOptions"
      :suspendedLabels="lineHeightLabels"
      :disabled="segmentSelectionDisabled"
    >
      <template #left>
        <div class="font-panel__round-tag-left"><p>Aa</p></div>
      </template>
      <template #right>
        <div class="font-panel__round-tag-right"><p>Aa</p></div>
      </template>
    </SegmentSelection>
    <!-- Token List -->
    <div class="font-panel__token-list">
      <t-radio-group variant="default-filled" v-model="tokenType">
        <t-radio-button value="plus">{{ lang.font.lineHeightFixedMode }}</t-radio-button>
        <t-radio-button value="time">{{ lang.font.lineHeightSteppedMode }}</t-radio-button>
      </t-radio-group>
      <t-list v-if="tokenType === 'plus'">
        <t-popup
          placement="left"
          show-arrow
          trigger="click"
          :destroy-on-close="true"
          :attach="handleAttach"
          :overlay-style="{ borderRadius: '9px' }"
          @visible-change="handleVisibleChange"
        >
          <t-list-item
            :style="{
              transition: 'border-color .2s',
              border: isHover ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div class="code">line-height = font size + {{ lineHeightValue }}</div>
            <div :style="{ lineHeight: `${getTokenValue('--td-line-height-body-small')}` }">
              {{ lang.font.lineHeightFixedDesc }}
            </div></t-list-item
          >
          <template #content
            ><size-slider
              title="line-height"
              :min="1"
              :max="99"
              :step="1"
              :sizeValue="lineHeightValue"
              @changeSize="handleChangeFontSize"
          /></template>
        </t-popup>
      </t-list>
      <t-list v-else>
        <t-popup
          placement="left"
          show-arrow
          trigger="click"
          :destroy-on-close="true"
          :attach="handleAttach"
          :overlay-style="{ borderRadius: '9px' }"
          @visible-change="handleVisibleChange"
        >
          <t-list-item
            :style="{
              border: isHover ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div class="code">line-height = font size * {{ lineHeightValue }}</div>
            <div :style="{ lineHeight: `${getTokenValue('--td-line-height-body-small')}` }">
              {{ lang.font.lineHeightSteppedDesc }}
            </div></t-list-item
          >
          <template #content
            ><size-slider
              title="line-height"
              :sizeValue="lineHeightValue"
              :min="1"
              :max="5"
              :step="0.5"
              :needInteger="false"
              @changeSize="handleChangeFontSize"
          /></template>
        </t-popup>
      </t-list>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import {
  List as TList,
  ListItem as TListItem,
  Popup as TPopup,
  RadioButton as TRadioButton,
  RadioGroup as TRadioGroup,
} from 'tdesign-vue-next';

import { SegmentSelection, SizeSlider } from '@/common/components';
import { useLang } from '@/common/i18n';
import { getOptionFromLocal, updateLocalOption } from '@/common/themes';
import { getTokenValue, handleAttach } from '@/common/utils';

import { LINE_HEIGHT_OPTIONS, LINE_HEIGHT_STEPS, updateLineHeightTokens } from '../built-in/line-height-map';

const { lang } = useLang();

const isHover = ref(null);
const tokenType = ref('plus');
const step = ref(3);
const lineHeightValue = ref(LINE_HEIGHT_STEPS[3]);
const lineHeightOptions = ref(LINE_HEIGHT_OPTIONS);
const lineHeightLabels = ref(Object.fromEntries(LINE_HEIGHT_OPTIONS.map((item, index) => [index + 1, item.label])));
const segmentSelectionDisabled = ref(false);

watch(step, (v) => {
  if (!LINE_HEIGHT_STEPS[v]) return;
  lineHeightValue.value = LINE_HEIGHT_STEPS[v];

  updateLocalOption('line-height', v !== 3 ? `plus_${lineHeightValue.value}` : null);
  updateLineHeightTokens(lineHeightValue.value, tokenType.value);
});

watch(tokenType, (type) => {
  const defaultVal = type === 'time' ? 1.5 : 8;

  const localLineHeight = getOptionFromLocal('line-height');
  const lineHeightParts = localLineHeight?.split('_');

  if (type === lineHeightParts?.[0]) {
    const suffixVal = lineHeightParts[1];
    lineHeightValue.value = suffixVal;
  } else {
    lineHeightValue.value = defaultVal;
  }
  updateLocalOption('line-height', step.value == 3 ? `${type}_${lineHeightValue.value}` : null);
  updateLineHeightTokens(lineHeightValue.value, type);
});

function initStep() {
  const localLineHeight = getOptionFromLocal('line-height');
  if (!localLineHeight) return;
  const lineHeightParts = localLineHeight.split('_');
  if (lineHeightParts[0].startsWith('time')) {
    tokenType.value = 'time';
    return;
  } else {
    tokenType.value = 'plus';
  }

  const suffixVal = lineHeightParts[1];
  const stepKey = Number(Object.keys(LINE_HEIGHT_STEPS).find((key) => LINE_HEIGHT_STEPS[key] == suffixVal));

  if (stepKey >= 0) step.value = stepKey;
  lineHeightValue.value = suffixVal;
}

function handleVisibleChange(v) {
  isHover.value = v;
}

function handleChangeFontSize(v) {
  lineHeightValue.value = v;

  const isTimeCalc = tokenType.value === 'time';

  updateLineHeightTokens(v, tokenType.value);
  updateLocalOption('line-height', `${isTimeCalc ? 'time' : 'plus'}_${v}`);

  if (!isTimeCalc && !Object.values(LINE_HEIGHT_STEPS).includes(v)) {
    segmentSelectionDisabled.value = true;
  }
}

onMounted(() => {
  nextTick(() => {
    initStep();
  });
});
</script>

<style lang="less" scoped>
.font-panel {
  &__round-tag-left {
    font-size: 14px;
    line-height: 32px;
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    margin: 0;

    &::before,
    &::after {
      content: '';
      height: 3px;
      width: 100%;
      background-color: rgba(227, 77, 89, 0.2);
      position: absolute;
      z-index: 0;
      left: 0;
    }
    &::before {
      top: 8px;
    }
    &::after {
      top: 21px;
    }
  }

  &__round-tag-right {
    font-size: 14px;
    line-height: 32px;
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    margin: 0;

    &::before,
    &::after {
      content: '';
      height: 5px;
      width: 100%;
      background-color: rgba(227, 77, 89, 0.2);
      position: absolute;
      z-index: 0;
      left: 0;
    }
    &::before {
      top: 6px;
    }
    &::after {
      top: 21px;
    }
  }
  &__token-list {
    margin-top: 8px;
    padding: 4px;
    border-radius: 9px;
    background-color: var(--bg-color-theme-secondary);
    .code {
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
      margin-bottom: 8px;
    }
    :deep(.t-radio-group) {
      width: 100%;
      text-align: center;
      border-radius: 6px;
      margin-bottom: 4px;
      background-color: var(--bg-color-theme-radio);
    }
    :deep(.t-radio-button) {
      width: 50%;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    :deep(.t-list-item) {
      margin-bottom: 4px;
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      background: var(--bg-color-theme-surface);
    }
    :deep(.t-list-item__content) {
      width: 100%;
    }
  }
}
</style>
