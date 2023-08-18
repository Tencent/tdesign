<template>
  <div>
    <!-- Token List -->
    <div class="size-panel__token-list">
      <t-list>
        <t-popup
          v-for="(token, idx) in tokenTypeList"
          :key="idx"
          placement="left"
          showArrow
          trigger="click"
          :destroyOnClose="true"
          :attach="handleAttach"
          @visible-change="(v, ctx) => handleVisibleChange(v, ctx, idx)"
          :overlayStyle="{ borderRadius: '9px' }"
        >
          <t-list-item
            :style="{
              height: '48px',
              transition: 'border-color .2s',
              border:
                hoverIdx === idx
                  ? '1px solid var(--brand-main-hover)'
                  : '1px solid transparent',
            }"
            ><div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <div>
                <div>{{ token.label }}</div>
                <div :style="{ color: 'var(--text-secondary)' }">
                  {{ token.remark }} : {{ token.value }}
                </div>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <size-adjust-svg
                  v-if="type === 'comp-size'"
                  :size="token.value"
                />
                <horizontal-padding-adjust-svg
                  v-else-if="type === 'comp-padding-lr'"
                  :size="token.value"
                />
                <vertical-padding-adjust-svg
                  v-else-if="type === 'comp-padding-tb'"
                  :size="token.value"
                />
                <margin-adjust-svg
                  v-else-if="type === 'comp-margin'"
                  :size="token.value"
                />
                <popup-padding-adjust-svg
                  v-else-if="type === 'popup-padding'"
                  :size="token.value"
                />
              </div>
            </div>
          </t-list-item>
          <template #content
            ><size-slider
              title="size"
              :sizeValue="token.value"
              @changeFontSize="(v) => handleChangeSize(v, idx)"
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
} from "tdesign-vue";
import {
  handleAttach,
  modifyToken,
  getCustomThemeSheet,
} from "../../common/utils";
import { sizeSteps, sizeLabels } from "../built-in/size-map";
import SizeSlider from "../../common/SizeSlider/index.vue";

import SizeAdjustSvg from "../svg/SizeAdjustSvg.vue";
import MarginAdjustSvg from "../svg/MarginAdjustSvg.vue";

import VerticalPaddingAdjustSvg from "../svg/VerticalPaddingAdjustSvg.vue";
import HorizontalPaddingAdjustSvg from "../svg/HorizontalPaddingAdjustSvg.vue";
import PopupPaddingAdjustSvg from "../svg/PopupPaddingAdjustSvg.vue";

const STEP_MAP = [
  { label: "默认", value: 3 },
  { label: "自定义", value: 6, disabled: true },
];

export default {
  name: "SizeAdjust",
  components: {
    TList,
    TListItem,
    TPopup,
    SizeSlider,
    SizeAdjustSvg,
    HorizontalPaddingAdjustSvg,
    VerticalPaddingAdjustSvg,
    MarginAdjustSvg,
    PopupPaddingAdjustSvg,
  },
  props: {
    tokenList: Array,
    type: String,
  },
  data() {
    return {
      step: 3,
      sizeLabels,
      hoverIdx: null,
      computedStyle: null,
      initTokenList: [],
      tokenTypeList: [],
      selectOptions: STEP_MAP,
      segmentSelectionDisabled: false,
    };
  },
  watch: {
    step(v) {
      // 改变阶梯
      if (!sizeSteps[v]) return;
      const newSteps = sizeSteps[v];
      newSteps.map(({ name, value, ...resParams }) => {
        modifyToken(name, value);
        // 同时将它从token模式中修改
        const i = this.tokenTypeList.findIndex((v) => v.label === name);
        if (i !== -1) {
          this.tokenTypeList[i] = {
            ...this.tokenTypeList[i],
            value,
            ...resParams,
          };
        }
      });

      this.initTokenList = JSON.parse(JSON.stringify(this.tokenTypeList));
    },
  },
  methods: {
    handleAttach,
    handleVisibleChange(v, ctx, idx) {
      if (v) this.hoverIdx = idx;
      if (!v && ctx.trigger === "document" && this.hoverIdx === idx)
        this.hoverIdx = null;
    },
    handleChangeSize(v, idx) {
      const res = `${v}px`;
      const tokenName = `--td-${this.tokenTypeList[idx].label}`;
      const styleSheet = getCustomThemeSheet();
      if (!styleSheet) return;

      // token 需要修改所有对应该token的值
      if (parseInt(this.initTokenList[idx].value, 10) !== parseInt(res, 10))
        this.segmentSelectionDisabled = true;
      // 修改state
      this.tokenTypeList[idx].value = res;
      modifyToken(tokenName, res);
    },
  },
  mounted() {
    // 将当前的尺寸相关枚举存储
    const computedStyle = window.getComputedStyle(document.documentElement);
    this.computedStyle = computedStyle;
    // token模式列表
    this.tokenTypeList = this.tokenList.map((v) => ({
      label: v.label,
      value: computedStyle.getPropertyValue(`--td-${v.label}`),
      desc: v.desc,
      remark: v.remark,
    }));
    this.initTokenList = JSON.parse(JSON.stringify(this.tokenTypeList));
  },
};
</script>
<style lang="less" scoped>
.size-panel {
  &__token-list {
    margin-top: 16px;
    padding: 4px;
    border-radius: 9px;
    background-color: var(--bg-color-theme-secondary);

    span {
      font-size: 14px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;
    }
    /deep/ .t-radio-group {
      width: 228px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 4px;
    }
    /deep/ .t-radio-button {
      width: 50%;
    }
    /deep/ .t-radio-group__bg-block {
      border-radius: 5px;
      width: calc(50% - 2px) !important;
    }

    /deep/ .t-list-item {
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
      background-color: var(--bg-color-theme-surface);
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;
      padding: 4px 6px;
      font-size: 12px;
      line-height: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      cursor: pointer;
    }
    /deep/ .t-list-item__content {
      width: 100%;
    }
  }
}
</style>
