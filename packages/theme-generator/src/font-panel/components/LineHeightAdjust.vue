<template>
  <div>
    <!-- 顶部调整 -->
    <SegmentSelection
      :style="{ margin: '8px 0' }"
      v-if="tokenType === 'plus'"
      :selectOptions="selectOptions"
      :suspendedLabels="lineHeightLabels"
      v-model="step"
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
        <t-radio-button value="plus">{{
          lang.font.lineHeightFixedMode
        }}</t-radio-button>
        <t-radio-button value="time">{{
          lang.font.lineHeightSteppedMode
        }}</t-radio-button>
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
              border: isHover
                ? '1px solid var(--brand-main-hover)'
                : '1px solid transparent',
            }"
            ><div class="code">
              line-height = font size + {{ lineHeightValue }}
            </div>
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
              border: isHover
                ? '1px solid var(--brand-main-hover)'
                : '1px solid transparent',
            }"
            ><div class="code">
              line-height = font size * {{ lineHeightValue }}
            </div>
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
  RadioGroup as TRadioGroup,
  RadioButton as TRadioButton,
  Popup as TPopup,
} from "tdesign-vue";
import { handleAttach, modifyToken } from "../../common/utils";
import {
  lineHeightSteps,
  lineHeightLabels,
  lineHeightStepsArray,
} from "../built-in/line-height";
import SizeSlider from "../../common/SizeSlider/index.vue";
import SegmentSelection from "../../common/SegmentSelection/index.vue";
import langMixin from "../../common/i18n/mixin";

// eslint-disable-next-line no-unused-vars
const STEP_MAP = [
  { label: "超小", enLabel: "mini", value: 1 },
  { label: "小", enLabel: "small", value: 2 },
  { label: "默认", enLabel: "default", value: 3 },
  { label: "大", enLabel: "large", value: 4 },
  { label: "特大", enLabel: "max", value: 5 },
  { label: "自定义", enLabel: "customized", value: 6, disabled: true },
];

export default {
  name: "FontSizeAdjust",
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
      step: 3,
      isHover: null,
      selectOptions: STEP_MAP,
      tokenType: "plus", // plus or time
      lineHeightValue: null,
      lineHeightSteps,
      lineHeightLabels,
      segmentSelectionDisabled: false,
    };
  },
  watch: {
    step(v) {
      if (!lineHeightSteps[v]) return;
      const newLineHeight = lineHeightSteps[v];
      modifyToken("--td-line-height-common", `${newLineHeight}px`);
      this.lineHeightValue = newLineHeight;
    },
    tokenType(v) {
      const styleSheet = document.getElementById("custom-theme");
      if (!styleSheet) return;
      if (v === "plus") {
        styleSheet.innerText = styleSheet.innerText.replaceAll(
          `* var(--td-line-height-common)`,
          `+ var(--td-line-height-common)`
        );
        modifyToken("--td-line-height-common", "8px");
        this.lineHeightValue = 8;
      } else {
        modifyToken("--td-line-height-common", 1.5);
        this.lineHeightValue = 1.5;
        styleSheet.innerText = styleSheet.innerText.replaceAll(
          `+ var(--td-line-height-common)`,
          `* var(--td-line-height-common)`
        );
      }
    },
  },
  methods: {
    handleAttach,
    handleVisibleChange(v) {
      this.isHover = v;
    },
    handleChangeFontSize(v) {
      this.lineHeightValue = v;
      const isTimeCalc = this.tokenType === "time";
      const res = isTimeCalc ? v : `${v}px`;
      modifyToken("--td-line-height-common", res);
      if (!isTimeCalc && !lineHeightStepsArray.includes(res)) {
        this.segmentSelectionDisabled = true;
      }
    },
  },
  mounted() {
    // mounted后将当前的字体相关枚举存储
    const computedStyle = window.getComputedStyle(document.documentElement);
    this.computedStyle = computedStyle;
    // token模式列表
    this.lineHeightValue =
      parseInt(computedStyle.getPropertyValue("--td-line-height-common"), 10) ||
      8;
  },
};
</script>
<style lang="less" scoped>
.font-panel {
  &__round-tag-left {
    font-size: 14px;
    line-height: 32px;
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    margin: 0;

    &::before,
    &::after {
      content: "";
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
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    margin: 0;

    &::before,
    &::after {
      content: "";
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
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;
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
    }

    /deep/ .t-radio-group__bg-block {
      border-radius: 5px;
      width: calc(50% - 2px) !important;
      background-color: var(--bg-color-theme-radio-active);
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
