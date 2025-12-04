<template>
  <div>
    <!-- 顶部调整 -->
    <SegmentSelection
      v-model="step"
      :selectOptions="FONT_SIZE_OPTIONS"
      :suspendedLabels="FONT_SIZE_LABELS"
      :disabled="segmentSelectionDisabled"
    >
      <template v-slot:left>
        <div class="font-panel__round-tag-left">Aa</div>
      </template>
      <template v-slot:right>
        <div class="font-panel__round-tag-right">Aa</div>
      </template>
    </SegmentSelection>
    <!-- Token List -->
    <div class="font-panel__token-list">
      <t-radio-group variant="default-filled" v-model="tokenType">
        <t-radio-button value="list">{{ lang.font.steppedMode }}</t-radio-button>
        <t-radio-button value="token">{{ lang.font.tokenMode }}</t-radio-button>
      </t-radio-group>
      <t-list v-if="tokenType === 'list'">
        <t-popup
          v-for="(token, idx) in ladderTypeList"
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
              transition: 'border-color .2s',
              border: hoverIdx === idx ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <span>{{ token.label }}</span
              ><span>{{ token.value }}</span>
            </div>
            <div
              :style="{
                fontSize: token.value,
                fontWeight: token.isBold ? '600' : 'normal',
                lineHeight: `calc(${token.value} + 8px)`,
              }"
            >
              TDesign
            </div>
          </t-list-item>
          <template #content
            ><size-slider
              title="font-size"
              :sizeValue="token.value"
              @changeSize="(v) => handleChangeFontSize(v, 'list', token.tokens, idx)"
          /></template>
        </t-popup>
      </t-list>
      <t-list v-else class="token-type-list">
        <t-popup
          v-for="(token, idx) in tokenTypeList"
          :key="idx"
          placement="left"
          showArrow
          trigger="click"
          :destroyOnClose="true"
          :attach="handleAttach"
          :overlayStyle="{ borderRadius: '9px' }"
          @visible-change="(v, ctx) => handleVisibleChange(v, ctx, idx)"
        >
          <t-list-item
            :style="{
              transition: 'border-color .2s',
              border: hoverIdx === idx ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <span>{{ token.label.replace('--td-', '') }}</span
              ><span>{{ token.value }}</span>
            </div>
            <div
              :style="{
                fontSize: `${getTokenValue(token.label)}`,
                fontWeight: token.isBold ? '600' : 'normal',
                lineHeight: `calc(${token.value} + 8px)`,
              }"
            >
              TDesign
            </div>
          </t-list-item>
          <template #content
            ><size-slider
              title="font-size"
              :sizeValue="token.value"
              @changeSize="(v) => handleChangeFontSize(v, 'token', token.label, idx)"
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

import { SegmentSelection, SizeSlider } from '@/common/components';
import { langMixin } from '@/common/i18n';
import { getOptionFromLocal, modifyToken, updateLocalOption } from '@/common/themes';
import { getTokenValue, handleAttach } from '@/common/utils';

import { FONT_SIZE_LABELS, FONT_SIZE_OPTIONS, FONT_SIZE_STEPS, FONT_SIZE_TOKEN_LIST } from '../built-in/font-map';

export default {
  name: 'FontSizeAdjust',
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
      FONT_SIZE_OPTIONS,
      FONT_SIZE_LABELS,
      step: getOptionFromLocal('font') || 3,
      hoverIdx: null,
      tokenType: 'list', // list or token
      computedStyle: null,
      segmentSelectionDisabled: false,
      tokenTypeList: FONT_SIZE_TOKEN_LIST,
      initTokenList: [],
      ladderTypeList: [],
      initLadderList: [],
    };
  },
  watch: {
    tokenTypeList(list) {
      const fontSizeStepArray = Object.keys(FONT_SIZE_STEPS).map((v) => FONT_SIZE_STEPS[v]);

      if (
        !fontSizeStepArray.find(
          (array) => array.filter((v, i) => v?.value === list[i]?.value?.trim()).length === array.length,
        )
      ) {
        this.segmentSelectionDisabled = true;
      }
    },
    step(v) {
      const isCustom = v === 6;
      this.segmentSelectionDisabled = isCustom;
      // 默认值（v=3) 的时候不存到本地
      updateLocalOption('font', v !== 3 ? v : null);

      if (!FONT_SIZE_STEPS[v]) return;
      const newSteps = FONT_SIZE_STEPS[v];
      newSteps.map(({ name, value }) => {
        modifyToken(name, value, isCustom);
        const i = this.tokenTypeList.findIndex((v) => v.label === name);
        if (i !== -1) this.tokenTypeList[i].value = value;
      });

      this.initTokenList = JSON.parse(JSON.stringify(this.tokenTypeList));
      // 阶梯模式列表
      this.ladderTypeList = [];
      this.tokenTypeList.forEach((token) => {
        const listIdx = this.ladderTypeList.map((v) => v.value).indexOf(token.value);
        if (listIdx !== -1) {
          this.ladderTypeList[listIdx].tokens.push(token.label);
        } else {
          this.ladderTypeList.push({
            value: token.value,
            tokens: [token.label],
          });
        }
      });
      this.initLadderList = JSON.parse(JSON.stringify(this.ladderTypeList));
    },
  },
  methods: {
    getTokenValue,
    handleAttach,
    handleVisibleChange(v, ctx, idx) {
      if (v) this.hoverIdx = idx;
      if (!v && ctx.trigger === 'document' && this.hoverIdx === idx) this.hoverIdx = null;
    },
    handleInitFontSize() {
      // token 模式列表
      this.tokenTypeList = this.tokenTypeList.map((v) => ({
        label: v.label,
        value: getTokenValue(v.label),
        isBold: v.isBold,
      }));
      this.initTokenList = JSON.parse(JSON.stringify(this.tokenTypeList));
      // 阶梯模式列表
      this.tokenTypeList.forEach((token) => {
        const listIdx = this.ladderTypeList.map((v) => v.value).indexOf(token.value);
        if (listIdx !== -1) {
          this.ladderTypeList[listIdx].tokens.push(token.label);
        } else {
          this.ladderTypeList.push({
            value: token.value,
            tokens: [token.label],
          });
        }
      });
      this.initLadderList = JSON.parse(JSON.stringify(this.ladderTypeList));
    },
    handleChangeFontSize(v, type, tokenName, idx) {
      const res = `${v}px`;
      if (Array.isArray(tokenName)) {
        // 阶梯模式传进来的是数组
        tokenName.forEach((token) => {
          modifyToken(token, res);
        });
      } else {
        // Token 模式传进来的是单个
        modifyToken(tokenName, res);
      }

      if (type === 'list') {
        // 阶梯模式需要修改所有对应该梯度的值
        const fontSizeList = this.ladderTypeList[idx].tokens;
        // 修改 state
        this.ladderTypeList[idx].value = res;
        if (parseInt(this.initLadderList[idx].value, 10) !== parseInt(res, 10)) this.segmentSelectionDisabled = true;

        fontSizeList.map((tokenName) => {
          const i = this.tokenTypeList.findIndex((v) => v.label === tokenName);
          if (i !== -1) this.tokenTypeList[i].value = res;
        });
      }

      if (type === 'token') {
        // token 需要修改所有对应该 token 的值
        if (parseInt(this.initTokenList[idx].value, 10) !== parseInt(res, 10)) this.segmentSelectionDisabled = true;
        // 修改 state
        this.tokenTypeList[idx].value = res;
        const preVal = this.initTokenList[idx].value;
        if (res !== preVal) {
          const preListIdx = this.ladderTypeList.findIndex((v) => v.tokens.includes(tokenName));
          if (preListIdx !== -1) {
            const resIdx = this.ladderTypeList?.[preListIdx].tokens?.indexOf(tokenName);
            this.ladderTypeList[preListIdx].tokens?.splice(resIdx, 1);
          }
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInitFontSize();
    });
  },
};
</script>

<style lang="less" scoped>
.font-panel {
  &__round-tag-left {
    font-size: 12px;
    line-height: 32px;
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
  &__round-tag-right {
    font-size: 18px;
    line-height: 32px;
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
  &__token-list {
    margin-top: 8px;
    padding: 4px;
    border-radius: 9px;
    background-color: var(--bg-color-theme-secondary);

    span {
      font-size: 11.5px;
      line-height: 12px;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    }
    /deep/ .t-radio-group {
      width: 100%;
      border-radius: 6px;
      text-align: center;
      background-color: var(--bg-color-theme-radio);
    }
    /deep/ .t-radio-button {
      width: 50%;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/ .t-list__inner {
      overflow: hidden;
    }

    /deep/ .t-list-item {
      margin: 4px 0;
      border-radius: 6px;
      padding: 4px;
      cursor: pointer;
      background-color: var(--bg-color-theme-surface);
    }
    /deep/ .t-list-item__content {
      width: 100%;
    }
  }
}
</style>
