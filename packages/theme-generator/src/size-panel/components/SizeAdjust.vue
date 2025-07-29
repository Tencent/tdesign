<template>
  <div>
    <!-- Token List -->
    <div class="size-panel__token-list">
      <t-list>
        <t-popup
          v-for="(token, idx) in tokenList"
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
              border: hoverIdx === idx ? '1px solid var(--brand-main-hover)' : '1px solid transparent',
            }"
            ><div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <div>
                <div>{{ token.name }}</div>
                <div :style="{ color: 'var(--text-secondary)' }">
                  {{ token.from }} : {{ getTokenValue(`--td-${token.from}`) }}
                </div>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <size-adjust-svg v-if="type === 'comp-size'" :size="parseSize(getTokenValue(`--td-${token.name}`))" />
                <horizontal-padding-adjust-svg
                  v-else-if="type === 'comp-padding-lr'"
                  :size="parseSize(getTokenValue(`--td-${token.from}`))"
                />
                <vertical-padding-adjust-svg
                  v-else-if="type === 'comp-padding-tb'"
                  :size="parseSize(getTokenValue(`--td-${token.from}`))"
                />
                <margin-adjust-svg v-else-if="type === 'comp-margin'" :size="parseSize(getTokenValue(token.from))" />
                <popup-padding-adjust-svg
                  v-else-if="type === 'popup-padding'"
                  :size="parseSize(getTokenValue(`--td-${token.from}`))"
                />
              </div>
            </div>
          </t-list-item>
          <template #content
            ><size-slider
              title="size"
              :sizeValue="getTokenValue(`--td-${token.from}`)"
              @changeSize="(v) => handleChangeSize(`--td-${token.from}`, v)"
          /></template>
        </t-popup>
      </t-list>
    </div>
  </div>
</template>
<script lang="jsx">
import { List as TList, ListItem as TListItem, Popup as TPopup } from 'tdesign-vue';

import { SizeSlider } from './../../common/components';
import { modifyToken } from './../../common/themes';
import { getTokenValue, handleAttach } from './../../common/utils';

import HorizontalPaddingAdjustSvg from '../svg/HorizontalPaddingAdjustSvg.vue';
import MarginAdjustSvg from '../svg/MarginAdjustSvg.vue';
import PopupPaddingAdjustSvg from '../svg/PopupPaddingAdjustSvg.vue';
import SizeAdjustSvg from '../svg/SizeAdjustSvg.vue';
import VerticalPaddingAdjustSvg from '../svg/VerticalPaddingAdjustSvg.vue';

export default {
  name: 'SizeAdjust',
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
  methods: {
    getTokenValue,
    handleAttach,
    handleVisibleChange(v, ctx, idx) {
      if (v) this.hoverIdx = idx;
      if (!v && ctx.trigger === 'document' && this.hoverIdx === idx) this.hoverIdx = null;
    },
    handleChangeSize(token, v) {
      modifyToken(token, `${v}px`);
      this.$forceUpdate();
      this.$root.$emit('refresh-size-tokens', this.type);
    },
    parseSize(val) {
      if (typeof val === 'string') {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    },
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
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
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
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
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
