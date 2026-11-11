<template>
  <div>
    <!-- Token List -->
    <div class="size-panel__token-list">
      <t-list>
        <t-popup
          v-for="(token, idx) in tokenList"
          :key="idx"
          placement="left"
          show-arrow
          trigger="click"
          :destroy-on-close="true"
          :attach="handleAttach"
          :overlay-style="{ borderRadius: '9px' }"
          @visible-change="(v, ctx) => handleVisibleChange(v, ctx, idx)"
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
                  {{ token.from }} : {{ getCurrentTokenValue(`--td-${token.from}`) }}
                </div>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <size-adjust-svg
                  v-if="type === 'comp-size'"
                  :size="parseSize(getCurrentTokenValue(`--td-${token.name}`))"
                />
                <horizontal-padding-adjust-svg
                  v-else-if="type === 'comp-padding-lr'"
                  :size="parseSize(getCurrentTokenValue(`--td-${token.from}`))"
                />
                <vertical-padding-adjust-svg
                  v-else-if="type === 'comp-padding-tb'"
                  :size="parseSize(getCurrentTokenValue(`--td-${token.from}`))"
                />
                <margin-adjust-svg
                  v-else-if="type === 'comp-margin'"
                  :size="parseSize(getCurrentTokenValue(`--td-${token.from}`))"
                />
                <popup-padding-adjust-svg
                  v-else-if="type === 'popup-padding'"
                  :size="parseSize(getCurrentTokenValue(`--td-${token.from}`))"
                />
              </div>
            </div>
          </t-list-item>
          <template #content
            ><size-slider
              title="size"
              :size-value="getCurrentTokenValue(`--td-${token.from}`)"
              @change-size="(v) => handleChangeSize(`--td-${token.from}`, v)"
          /></template>
        </t-popup>
      </t-list>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { List as TList, ListItem as TListItem, Popup as TPopup } from 'tdesign-vue-next/lib';

import { SizeSlider } from './../../common/components';
import { modifyToken, themeStore } from './../../common/themes';
import { getTokenValue, handleAttach } from './../../common/utils';

import HorizontalPaddingAdjustSvg from '../svg/horizontal-padding-adjust-svg.vue';
import MarginAdjustSvg from '../svg/margin-adjust-svg.vue';
import PopupPaddingAdjustSvg from '../svg/popup-padding-adjust-svg.vue';
import SizeAdjustSvg from '../svg/size-adjust-svg.vue';
import VerticalPaddingAdjustSvg from '../svg/vertical-padding-adjust-svg.vue';

import type { SizeMapItem } from '../built-in/size-map';

defineOptions({ name: 'SizeAdjust' });

const props = defineProps<{
  tokenList?: SizeMapItem[];
  type?: string;
}>();

const hoverIdx = ref<number | null>(null);

function handleVisibleChange(v: boolean, ctx: { trigger?: string }, idx: number) {
  if (v) hoverIdx.value = idx;
  if (!v && ctx.trigger === 'document' && hoverIdx.value === idx) hoverIdx.value = null;
}

function handleChangeSize(token: string, v: number | string) {
  modifyToken(token, `${v}px`);
  themeStore.incrementSizeRefresh(props.type ?? null);
}

function getCurrentTokenValue(token: string): string {
  // getTokenValue 本身不是响应式读取；订阅刷新计数可让当前分组在拖动后重读 Token，
  // 同时避免通过 key 重挂载当前分组而关闭正在操作的弹层。
  void themeStore.sizeRefreshId;
  return getTokenValue(token);
}

function parseSize(val: string | number): number {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }
  return val;
}
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

    :deep(.t-radio-group) {
      width: 228px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 4px;
    }

    :deep(.t-list-item) {
      margin-bottom: 4px;
      border-radius: 6px;
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

    :deep(.t-list-item__content) {
      width: 100%;
    }
  }
}
</style>
