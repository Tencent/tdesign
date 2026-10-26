<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="radius-content__content" :style="contentStyle">
      <div class="radius-content__main">
        <p class="radius-content__title">{{ lang.borderRadius.radiusSize }}</p>
        <SegmentSelection
          :modelValue="step"
          @update:modelValue="handleStepChange"
          :selectOptions="RADIUS_OPTIONS"
          :suspendedLabels="RADIUS_LABELS"
          :disabled="segmentSelectionDisabled"
        >
          <template v-slot:left>
            <div class="radius-content__round-tag-left" :class="{ disabled: segmentSelectionDisabled }"></div>
          </template>
          <template v-slot:right>
            <div class="radius-content__round-tag-right" :class="{ disabled: segmentSelectionDisabled }"></div>
          </template>
        </SegmentSelection>
        <div class="radius-content__list">
          <t-list>
            <t-popup
              v-for="(token, idx) in radiusTypeList"
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
                  border: hoverIdx === idx ? '1px solid var(--brand-main)' : '1px solid transparent',
                }"
                ><div class="radius-content__list-item">
                  <div
                    class="radius-content__list-item-round-tag"
                    :style="{
                      'border-radius': formattedRadius(token.value),
                    }"
                  ></div>
                  <div class="radius-content__list-item-text">
                    <div class="radius-content__list-item-title">
                      <!-- 不展示--td-前缀 -->
                      {{
                        `${token.token.replace('--td-', '')}：${
                          token.value === '50%' ? token.value : `${formattedRadius(token.value)}`
                        }`
                      }}
                    </div>
                    <div class="radius-content__list-item-title bottom">
                      {{ isEn ? token.enDesc : token.desc }}
                    </div>
                  </div>
                </div>
              </t-list-item>
              <template #content
                ><size-slider
                  title="border-radius"
                  :sizeValue="token.value"
                  :disabled="token.token === '--td-radius-circle'"
                  @changeSize="(v) => handleChangeRadius(v, idx)"
              /></template>
            </t-popup>
          </t-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import type { CSSProperties } from 'vue';
import isNumber from 'lodash-es/isNumber';
import { List as TList, ListItem as TListItem, Popup as TPopup } from 'tdesign-vue-next/lib';

import { SegmentSelection, SizeSlider } from '@/common/components';
import { useLang } from '@/common/i18n';
import { CUSTOM_EXTRA_ID, getOptionFromLocal, modifyToken, updateLocalOption } from '@/common/themes';
import { handleAttach } from '@/common/utils';

import { RADIUS_LABELS, RADIUS_OPTIONS, RADIUS_STEP_ARRAY, RADIUS_TOKEN_LIST } from './built-in/radius-map';
import type { RadiusTokenItem } from './built-in/radius-map';

defineOptions({ name: 'RadiusPanel' });

const props = defineProps<{
  isRefresh?: boolean;
  top?: number;
}>();

const { lang, isEn } = useLang();

const step = ref<string | number>(getOptionFromLocal('radius') || 3);
const hoverIdx = ref<number | null>(null);
const segmentSelectionDisabled = ref(false);
const radiusTypeList = ref<RadiusTokenItem[]>(RADIUS_TOKEN_LIST.map((item) => ({ ...item })));

const contentStyle = computed<CSSProperties>(() => {
  const clientHeight = window.innerHeight;
  return {
    overflowY: 'scroll',
    height: `${clientHeight - (props.top || 0) - 96}px`,
  };
});

watch(radiusTypeList, (list) => {
  const existStep = RADIUS_STEP_ARRAY.find((steps) =>
    list.every((item) => {
      const index = RADIUS_TOKEN_LIST.findIndex((token) => token.token === item.token);
      const expected = typeof steps[index] === 'number' ? `${steps[index]}px` : steps[index];
      const current = typeof item.value === 'number' ? `${item.value}px` : item.value?.trim();
      return current === expected;
    }),
  );

  if (!existStep) segmentSelectionDisabled.value = true;
});

function handleStepChange(val: string | number | undefined) {
  if (val === undefined) return;
  step.value = val;
  updateLocalOption('radius', val !== 3 ? val : null);
  const isCustom = val === 6;
  segmentSelectionDisabled.value = isCustom;
  if (!RADIUS_STEP_ARRAY[Number(val) - 1]) return;

  // 批量修改 radius
  radiusTypeList.value = radiusTypeList.value.map((item) => {
    const index = RADIUS_TOKEN_LIST.findIndex((token) => token.token === item.token);
    const preVal = RADIUS_STEP_ARRAY?.[Number(val) - 1]?.[index];
    const formattedVal = typeof preVal === 'number' ? `${preVal}px` : String(preVal);
    modifyToken(item.token, formattedVal, isCustom);

    return {
      ...item,
      value: RADIUS_STEP_ARRAY[Number(val) - 1][index],
    };
  });
}

function handleVisibleChange(v: boolean, ctx: { trigger?: string }, idx: number) {
  if (v) hoverIdx.value = idx;
  if (!v && ctx.trigger === 'document' && hoverIdx.value === idx) hoverIdx.value = null;
}

function handleChangeRadius(val: number | string, idx: number) {
  // 修改单独的 radius
  radiusTypeList.value.splice(idx, 1, {
    ...radiusTypeList.value[idx],
    value: val,
  });
  modifyToken(radiusTypeList.value[idx]['token'], `${val}px`);

  const tokenIndex = RADIUS_TOKEN_LIST.findIndex((token) => token.token === radiusTypeList.value[idx].token);
  if (val !== RADIUS_STEP_ARRAY[Number(step.value) - 1]?.[tokenIndex]) {
    segmentSelectionDisabled.value = true;
  }
}

function formattedRadius(radius: string | number | undefined): string {
  if (radius === '50%') return '50%';
  if (isNumber(radius)) return `${radius}px`;
  return String(radius ?? '');
}

function initRadiusToken() {
  const radiusStyle = document.getElementById(CUSTOM_EXTRA_ID);

  // 过滤不存在的 Token
  radiusTypeList.value = radiusTypeList.value
    .map((v) => {
      const regex = new RegExp(`${v.token}\\s*:\\s*([^;]+);`);
      const match = regex.exec(radiusStyle?.innerText ?? '');
      // 获取 token 对应的实际值
      return { ...v, value: match?.[1].trim() };
    })
    .filter((v) => v.value !== undefined);
}

onMounted(() => {
  nextTick(() => {
    // 下一个 tick 再更新避免与 init 的 step 冲突
    initRadiusToken();
  });
});
</script>

<style scoped lang="less">
.radius-content {
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
  }

  &__round-tag-left,
  &__round-tag-right {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* Brand 品牌/Brand1-Light */
    background: var(--brand-main-light);
    /* Brand 品牌/Brand8-Normal */
    border: 1px solid var(--brand-main);
    &.disabled {
      background: var(--bg-color-tag);
      border: 1px solid var(--theme-component-border);
    }
  }
  &__round-tag-left {
    border-radius: 3px;
  }
  &__round-tag-right {
    border-radius: 8px;
  }
  &__list {
    margin-top: 8px;
    padding: 4px;
    border-radius: 9px;
    background-color: var(--bg-color-theme-secondary);
    &-item {
      display: flex;
      align-items: center;
      &-text {
        flex: 1;
        width: 158px;
      }
      &-title {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: var(--text-primary);
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &.bottom {
          color: var(--text-placeholder);
        }
      }
      &-round-tag {
        width: 32px;
        height: 32px;
        /* Brand 品牌/Brand1-Light */
        background: var(--brand-main-light);
        /* Brand 品牌/Brand8-Normal */
        border: 1px solid var(--brand-main);
        margin-right: 8px;
      }
    }
    span {
      font-size: 14px;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    }
    :deep(.t-radio-group) {
      width: 228px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 8px;
    }
    :deep(.t-radio-button) {
      width: 50%;
    }
    :deep(.t-list-item) {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 4px 6px;
      gap: 12px;
      background: var(--bg-color-theme-surface);
      border-radius: 6px;
      margin-bottom: 4px;
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
