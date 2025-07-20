<template>
  <div>
    <!-- 顶部调整 -->
    <SegmentSelection
      :style="{ margin: '8px 0' }"
      v-if="tokenType === 'plus'"
      v-model="step"
      :selectOptions="lineHeightOptions"
      :suspendedLabels="lineHeightLabels"
      :disabled="segmentSelectionDisabled"
      @enable="segmentSelectionDisabled = false"
    >
      <template v-slot:left>
        <div class="font-panel__round-tag-left"><p>Aa</p></div>
      </template>
      <template v-slot:right>
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
          showArrow
          trigger="click"
          :destroyOnClose="true"
          :attach="handleAttach"
          :overlayStyle="{ borderRadius: '9px' }"
          @visible-change="handleVisibleChange"
        >
          <t-list-item
            :style="{
              transition: 'border-color .2s',
              border: isHover ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div class="code">line-height = font size + {{ lineHeightValue }}</div>
            <div>
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
              @changeFontSize="handleChangeFontSize"
          /></template>
        </t-popup>
      </t-list>
      <t-list v-else>
        <t-popup
          placement="left"
          showArrow
          trigger="click"
          :destroyOnClose="true"
          :attach="handleAttach"
          :overlayStyle="{ borderRadius: '9px' }"
          @visible-change="handleVisibleChange"
        >
          <t-list-item
            :style="{
              border: isHover ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div class="code">line-height = font size * {{ lineHeightValue }}</div>
            <div>
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
              @changeFontSize="handleChangeFontSize"
          /></template>
        </t-popup>
      </t-list>
    </div>
  </div>
</template>
<script lang="jsx">
import {
  List as TList,
  ListItem as TListItem,
  Popup as TPopup,
  RadioButton as TRadioButton,
  RadioGroup as TRadioGroup,
} from 'tdesign-vue';
import langMixin from '../../common/i18n/mixin';
import SegmentSelection from '../../common/SegmentSelection/index.vue';
import SizeSlider from '../../common/SizeSlider/index.vue';
import { getOptionFromLocal, updateLocalOption } from '../../common/themes';
import { handleAttach } from '../../common/utils';
import { LINE_HEIGHT_OPTIONS, LINE_HEIGHT_STEPS, updateLineHeightTokens } from '../built-in/line-height';
export default {
  name: 'LineHeightAdjust',
  components: {
    TList,
    TListItem,
    TRadioGroup,
    TRadioButton,
    TPopup,
    SizeSlider,
    SegmentSelection,
  },
  mixins: [langMixin],
  data() {
    return {
      isHover: null,
      /* 存入 local 的 line-height 结构为 ${tokenType}_${lineHeightValue}
         例如：plus_8 和 time_1.5  */
      tokenType: 'plus', // 固定（plus） or 递增（time）
      step: 3, // 默认
      lineHeightValue: LINE_HEIGHT_STEPS[3],
      lineHeightOptions: LINE_HEIGHT_OPTIONS,
      lineHeightLabels: Object.fromEntries(LINE_HEIGHT_OPTIONS.map((item, index) => [index + 1, item.label])),
      segmentSelectionDisabled: false,
    };
  },
  watch: {
    step(v) {
      if (!LINE_HEIGHT_STEPS[v]) return;
      this.lineHeightValue = LINE_HEIGHT_STEPS[v];

      updateLocalOption('line-height', `plus_${this.lineHeightValue}`, v !== 3);
      updateLineHeightTokens(this.lineHeightValue, this.tokenType);
    },
    tokenType(type) {
      const defaultVal = type === 'time' ? 1.5 : 8;

      const localLineHeight = getOptionFromLocal('line-height');
      const lineHeightParts = localLineHeight?.split('_');

      if (type === lineHeightParts?.[0]) {
        const suffixVal = lineHeightParts[1];
        this.lineHeightValue = suffixVal;
      } else {
        this.lineHeightValue = defaultVal;
      }
      updateLocalOption('line-height', `${type}_${this.lineHeightValue}`, this.step == 3);
      updateLineHeightTokens(this.lineHeightValue, type);
    },
  },
  methods: {
    handleAttach,
    initStep() {
      const localLineHeight = getOptionFromLocal('line-height');
      if (!localLineHeight) return;
      const lineHeightParts = localLineHeight.split('_');
      if (lineHeightParts[0].startsWith('time')) {
        this.tokenType = 'time';
        return;
      }

      const suffixVal = lineHeightParts[1];
      const stepKey = Number(Object.keys(LINE_HEIGHT_STEPS).find((key) => LINE_HEIGHT_STEPS[key] == suffixVal));

      if (stepKey >= 0) this.step = stepKey;
      this.lineHeightValue = suffixVal;
    },
    handleVisibleChange(v) {
      this.isHover = v;
    },
    handleChangeFontSize(v) {
      this.lineHeightValue = v;

      const isTimeCalc = this.tokenType === 'time';

      updateLineHeightTokens(v, this.tokenType);
      updateLocalOption('line-height', `${isTimeCalc ? 'time' : 'plus'}_${v}`);

      if (!isTimeCalc && !Object.values(LINE_HEIGHT_STEPS).includes(v)) {
        this.segmentSelectionDisabled = true;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initStep();
    });
  },
};
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
    padding: 4px 4px 0 4px;
    border-radius: 9px;
    background-color: var(--bg-color-theme-secondary);
    .code {
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
      margin-bottom: 8px;
    }
    /deep/ .t-radio-group {
      width: 100%;
      text-align: center;
      border-radius: 6px;
      margin-bottom: 4px;
      background-color: var(--bg-color-theme-radio);
    }
    /deep/ .t-radio-button {
      width: 50%;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/ .t-radio-group__bg-block {
      border-radius: 5px;
      width: calc(50% - 2px) !important;
    }
    /deep/ .t-list-item {
      margin-bottom: 4px;
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      background: var(--bg-color-theme-surface);
    }
    /deep/ .t-list-item__content {
      width: 100%;
    }
  }
}
</style>
