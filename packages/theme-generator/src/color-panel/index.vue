<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="color-content__content" :style="contentStyle">
      <div class="color-content__main">
        <p class="color-content__title">
          {{ lang.color.themeColor }}
        </p>
        <t-row :gutter="[4, 4]" :style="{ marginLeft: '0' }">
          <t-col v-for="(color, idx) in DEFAULT_COLORS" :key="idx" :span="3" :style="{ padding: '0' }">
            <div
              :class="{
                'color-content__block': true,
                'is-active': $brandColor.toLowerCase() === color.value.toLowerCase() && !isMoreVisible,
              }"
              :style="{ paddingBottom: '4px', color: 'var(--text-secondary)' }"
            >
              <div
                :class="{ 'is-active': $brandColor.toLowerCase() === color.value.toLowerCase() }"
                @click="changeBrandColor(color.value)"
              >
                <div
                  :style="{
                    width: '48px',
                    height: '48px',
                    border: '1px solid var(--theme-component-border)',
                    'border-radius': '6px',
                    'background-color': color.value,
                  }"
                >
                  <span v-if="$brandColor === color.value"></span>
                </div>
              </div>
            </div>
          </t-col>
          <t-col :span="3" :style="{ padding: '0' }">
            <t-popup
              show-arrow
              placement="bottom-left"
              trigger="hover"
              :attach="handleAttach"
              overlay-class-name="popup-arrow"
              :overlay-style="{
                width: '268px',
                padding: '16px',
                borderRadius: '9px',
                marginTop: '8px',
              }"
              @visible-change="isMoreVisible = $event"
            >
              <div
                :class="{
                  'color-content__block': true,
                  'is-active': isMoreVisible,
                }"
                :style="{
                  paddingBottom: '4px',
                  color: 'var(--text-secondary)',
                }"
              >
                <div>
                  <div
                    :style="{
                      width: '48px',
                      height: '48px',
                      'border-radius': '6px',
                      position: 'relative',
                    }"
                  >
                    <canvas id="canvas" class="recommend-block" width="24px" height="24px"></canvas>
                  </div>
                </div>
              </div>
              <template #content>
                <p class="color-content__title" style="margin-bottom: 8px">
                  <span>{{ lang.color.officialRecommendation }}</span>
                </p>
                <div class="color-content__flex">
                  <div
                    v-for="(color, idx) in RECOMMEND_COLORS"
                    :key="idx"
                    class="color-content__block"
                    style="background: none"
                  >
                    <div
                      :class="{
                        'is-active': $brandColor === color.value,
                      }"
                      :style="{ color: 'var(--text-secondary)' }"
                      @click="changeBrandColor(color.value)"
                    >
                      <p
                        :style="{
                          width: '48px',
                          height: '48px',
                          border: '1px solid var(--theme-component-border)',
                          'border-radius': '6px',
                          'background-color': color.value,
                        }"
                      ></p>
                    </div>
                  </div>
                </div>
                <t-divider style="margin: 16px 0" />
                <p class="color-content__title" style="margin-bottom: 8px">
                  <span>{{ lang.color.sceneRecommendation }}</span>
                </p>
                <div class="color-content__flex">
                  <div
                    v-for="(color, idx) in SCENE_COLORS"
                    :key="idx"
                    class="color-content__block"
                    style="background: none"
                  >
                    <div
                      :class="{
                        'is-active': $brandColor === color.value,
                      }"
                      @click="changeBrandColor(color.value)"
                    >
                      <p
                        :style="{
                          width: '48px',
                          height: '48px',
                          border: '1px solid var(--theme-component-border)',
                          'border-radius': '6px',
                          'background-color': color.value,
                        }"
                      ></p>
                    </div>
                  </div>
                </div>
              </template>
            </t-popup>
          </t-col>
        </t-row>
        <!-- 自定义主题颜色 -->
        <t-popup
          placement="bottom-left"
          show-arrow
          trigger="click"
          :destroy-on-close="true"
          :attach="handleAttach"
          :overlay-style="{ borderRadius: '9px' }"
        >
          <div class="color-content__custom">
            <div class="color-content__custom-inner">
              <div
                class="color-content__custom-top"
                :style="{
                  width: '100%',
                  'border-radius': '6px',
                  'background-color': brandDisplayedColor,
                }"
              >
                <p>hsv: {{ convertFromHex(brandDisplayedColor, 'hsv') }}</p>
                <p>rgb: {{ convertFromHex(brandDisplayedColor, 'rgb') }}</p>
              </div>
              <div class="color-content__custom-bottom">
                <div>
                  <p>
                    {{
                      ALL_PRESET_COLORS.find((color) => color.value === $brandColor)?.[isEn ? 'enName' : 'name'] ||
                      lang.color.customizeTitle
                    }}
                  </p>
                  <p :style="{ color: 'var(--text-secondary)' }">HEX: {{ brandDisplayedColor }}</p>
                </div>
                <edit-1-icon size="20" :style="{ marginRight: '8px', color: 'var(--text-primary)' }" />
              </div>
            </div>
          </div>
          <template #content>
            <color-picker :value="$brandColor" @change="changeBrandColor" />
          </template>
        </t-popup>
        <div class="color-content__generate-mode">
          <!-- 保留输入 -->
          <div
            :class="{
              'color-content__generate-mode-btn': true,
              'is-active': generationMode === 'remain',
            }"
            @click="generationMode = 'remain'"
          >
            <div
              class="color-content__generate-mode-btn-inner"
              :style="{
                backgroundColor: $brandColor,
              }"
            >
              <span>{{ lang.color.remainText }}</span>
              <t-tooltip :content="lang.color.remainTip">
                <help-circle-icon
                  size="14px"
                  :style="{
                    margin: '0 12px 0 5px',
                    color: 'rgba(255,255,255,0.35)',
                  }"
                />
              </t-tooltip>
              <file-copy-icon size="14px" />
            </div>
          </div>
          <!-- 智能推荐 -->
          <div
            :class="{
              'color-content__generate-mode-btn': true,
              'is-active': generationMode === 'recommend',
            }"
            @click="generationMode = 'recommend'"
          >
            <div
              class="color-content__generate-mode-btn-inner"
              :style="{
                backgroundColor: $brandColor,
              }"
            >
              <span>{{ lang.color.aiRecommendation }}</span>
              <t-tooltip :content="lang.color.aiTip">
                <help-circle-icon
                  size="14px"
                  :style="{
                    margin: '0 12px 0 5px',
                    color: 'rgba(255,255,255,0.35)',
                  }"
                />
              </t-tooltip>
              <file-copy-icon size="14px" />
            </div>
          </div>
        </div>
        <!-- 主题色 -->
        <color-column
          type="brand"
          :gradient-step="10"
          :token-map="brandTokenMap"
          @change-gradation="changeGradation"
          @recover-gradation="recoverGradation"
        />
      </div>
      <!-- 中性色 -->
      <color-collapse
        type="gray"
        :title="lang.color.neutralColor"
        :main-color="grayMainColor"
        :disabled="isGrayRelatedToTheme"
        @change-main-color="changeFunctionColor"
      >
        <template #subTitle>
          {{ lang.color.fromThemeColor }}
          <t-switch v-model="isGrayRelatedToTheme" style="margin-left: 8px" @change="handleNeutralChange"></t-switch>
        </template>
        <color-column
          type="gray"
          :gradient-step="14"
          :token-map="functionTokenMap['gray']"
          @change-gradation="changeGradation"
          @recover-gradation="recoverGradation"
        />
      </color-collapse>
      <!-- 成功色 -->
      <color-collapse
        type="success"
        :title="lang.color.successColor"
        :main-color="successMainColor"
        @change-main-color="changeFunctionColor"
      >
        <color-column
          type="success"
          :gradient-step="10"
          :token-map="functionTokenMap['success']"
          @change-gradation="changeGradation"
          @recover-gradation="recoverGradation"
        />
      </color-collapse>
      <!-- 错误色 -->
      <color-collapse
        type="error"
        :title="lang.color.errorColor"
        :main-color="errorMainColor"
        @change-main-color="changeFunctionColor"
      >
        <color-column
          type="error"
          :gradient-step="10"
          :token-map="functionTokenMap['error']"
          @change-gradation="changeGradation"
          @recover-gradation="recoverGradation"
        />
      </color-collapse>
      <!-- 警告色 -->
      <color-collapse
        type="warning"
        :title="lang.color.warningColor"
        :main-color="warningMainColor"
        @change-main-color="changeFunctionColor"
      >
        <color-column
          type="warning"
          :gradient-step="10"
          :token-map="functionTokenMap['warning']"
          @change-gradation="changeGradation"
          @recover-gradation="recoverGradation"
        />
      </color-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import type { CSSProperties, Ref } from 'vue';
import { Edit1Icon, FileCopyIcon, HelpCircleIcon } from 'tdesign-icons-vue-next';
import {
  Col as TCol,
  Divider as TDivider,
  Popup as TPopup,
  Row as TRow,
  Switch as TSwitch,
  Tooltip as TTooltip,
} from 'tdesign-vue-next/lib';

import { ColorPicker } from '@/common/components';
import { useLang } from '@/common/i18n';
import {
  collectTokenIndexes,
  convertFromHex,
  generateBrandPalette,
  generateFunctionalPalette,
  generateNeutralPalette,
  getOptionFromLocal,
  isMobile,
  modifyToken,
  syncColorTokensToStyle,
  themeStore,
  updateLocalOption,
  updateLocalToken,
  updateStyleSheetColor,
} from '@/common/themes';
import { colorAnimation, getThemeMode, getTokenValue, handleAttach, setUpModeObserver } from '@/common/utils';

import { FUNCTION_TOKENS } from './built-in/color-map';
import type { FunctionColorType } from './built-in/color-map';
import { ALL_PRESET_COLORS, DEFAULT_COLORS, RECOMMEND_COLORS, SCENE_COLORS } from './built-in/color-preset';

import ColorCollapse from './components/color-collapse/index.vue';
import ColorColumn from './components/color-column/index.vue';

import type { TokenIndex } from '@/common/types';

defineOptions({ name: 'ColorPanel' });

const props = defineProps<{
  top?: number;
}>();

const { lang, isEn } = useLang();

const functionTokenMap = ref<Record<FunctionColorType, TokenIndex[]>>({
  gray: [],
  success: [],
  error: [],
  warning: [],
});
const brandInputColor = ref(themeStore.brandColor);
const brandIndexes = ref<{ light: number; dark: number }>({
  light: 7,
  dark: 8,
});
const currentBrandIdx = ref(7);
const brandTokenMap = ref<TokenIndex[]>([]); // `-td-brand-x` 系列的 token 映射需要根据 brandIdx 动态计算；其它功能色都是固定的
const grayMainColor = ref(getOptionFromLocal('gray') || getTokenValue('--td-gray-color-4'));
const successMainColor = ref(getOptionFromLocal('success') || getTokenValue('--td-success-color'));
const errorMainColor = ref(getOptionFromLocal('error') || getTokenValue('--td-error-color'));
const warningMainColor = ref(getOptionFromLocal('warning') || getTokenValue('--td-warning-color'));
const generationMode = ref(getOptionFromLocal('recommend') === 'true' ? 'recommend' : 'remain'); // remain: 保留输入, recommend: 智能推荐
const isGrayRelatedToTheme = ref(getOptionFromLocal('neutral') === 'true');
const isMoreVisible = ref(false);

// 用于动态访问 `this[\`${type}MainColor\`]`
const mainColorMap: Record<FunctionColorType, Ref<string>> = {
  gray: grayMainColor,
  success: successMainColor,
  error: errorMainColor,
  warning: warningMainColor,
};

const $theme = computed(() => themeStore.theme);
const $device = computed(() => themeStore.device);
const isRemainMode = computed(() => generationMode.value === 'remain');
const $brandColor = computed(() => themeStore.brandColor);
const brandDisplayedColor = computed(() => (isRemainMode.value ? brandInputColor.value : $brandColor.value));
const contentStyle = computed<CSSProperties>(() => {
  const clientHeight = window.innerHeight;
  return {
    overflowY: 'scroll',
    height: `${clientHeight - (props.top || 0) - 96}px`,
  };
});

function generateBrandTokenMap(brandIdx: number): TokenIndex[] {
  const hoverIdx = brandIdx - 1;
  const activeIdx = brandIdx > 8 ? brandIdx : brandIdx + 1;
  return [
    { name: '--td-brand-color-light', idx: 1 },
    { name: '--td-brand-color-focus', idx: isMobile($device.value) ? 1 : 2 },
    { name: '--td-brand-color-disabled', idx: 3 },
    ...(!isMobile($device.value) ? [{ name: '--td-brand-color-hover', idx: hoverIdx }] : []),
    { name: '--td-brand-color', idx: brandIdx },
    { name: '--td-brand-color-active', idx: activeIdx },
  ];
}

function updateBrandTokenMap() {
  const brandIdx = currentBrandIdx.value;
  const extraBrandTokens = generateBrandTokenMap(brandIdx);
  brandTokenMap.value = extraBrandTokens;
}

function updateFunctionTokenMap() {
  (Object.keys(FUNCTION_TOKENS) as FunctionColorType[]).forEach((type) => {
    const tokens = FUNCTION_TOKENS[type];
    functionTokenMap.value[type] = collectTokenIndexes(tokens);
  });
}

function changeBrandColor(hex: string, trigger: 'update' | 'init' = 'update') {
  // 备份用户实际输入的颜色
  // 在智能推荐模式下，它与实际更新的颜色不同
  brandInputColor.value = hex.toUpperCase();

  const { lightPalette, lightBrandIdx, darkPalette, darkBrandIdx } = generateBrandPalette(hex, isRemainMode.value);
  brandIndexes.value = {
    light: lightBrandIdx,
    dark: darkBrandIdx,
  };

  const newBrandColor = lightPalette[lightBrandIdx - 1].toUpperCase();
  themeStore.updateBrandColor(newBrandColor);
  updateLocalOption(
    'color',
    newBrandColor.toLowerCase() !== $theme.value.value.toLowerCase() ? brandInputColor.value : null,
  );
  updateLocalOption('recommend', !isRemainMode.value ? 'true' : null);

  const lightExtraTokens = generateBrandTokenMap(lightBrandIdx);
  const darkExtraTokens = generateBrandTokenMap(darkBrandIdx);

  currentBrandIdx.value = brandIndexes.value[getThemeMode()];
  const shouldUpdateStyleSheet = $brandColor.value !== $theme.value.value || trigger === 'update';
  if (shouldUpdateStyleSheet) {
    // 只在用户手动修改主题色时同步 stylesheet，避免覆盖内置主题自身的逻辑
    updateStyleSheetColor('brand', lightPalette, darkPalette, trigger);
    syncColorTokensToStyle(lightExtraTokens, darkExtraTokens);
    changeNeutralColor(isGrayRelatedToTheme.value, trigger);
  }

  updateBrandTokenMap();
}

function changeNeutralColor(related: boolean, trigger: 'update' | 'init' = 'update') {
  updateLocalOption('neutral', related ? 'true' : null);
  // grayMainColor 始终保持用户自定义的中性色，不随关联状态改变
  // 关联时只是借用品牌色作为生成算法的输入
  const inputHex = related ? $brandColor.value : grayMainColor.value;
  const palette = generateNeutralPalette(inputHex, related);
  updateStyleSheetColor('gray', palette, palette, trigger);
  nextTick(refreshColorTokens);
}

function changeFunctionColor(hex: string, type: string, trigger: 'update' | 'init' = 'update') {
  if (trigger !== 'init') {
    updateLocalOption(type, hex);
  }
  mainColorMap[type as FunctionColorType].value = hex;
  if (type === 'gray') {
    changeNeutralColor(isGrayRelatedToTheme.value, trigger);
    return;
  }
  const { lightPalette, darkPalette } = generateFunctionalPalette(hex);
  updateStyleSheetColor(type, lightPalette, darkPalette, trigger);
  nextTick(refreshColorTokens);
}

function changeGradation(hex: string, idx: number, type: string, saveToLocal = true) {
  const tokenName = `--td-${type}-color-${idx}`;
  modifyToken(tokenName, hex, saveToLocal);
  nextTick(refreshColorTokens);
}

function recoverGradation(type: string) {
  Array(14) // 最长的情况为 gray 的 14 个色阶（虽然理论上有些 token 用户无法直接在 UI 中修改）
    .fill(0)
    .forEach((_, idx) => {
      const tokenName = `--td-${type}-color-${idx + 1}`;
      updateLocalToken(tokenName, undefined); // 清空本地缓存值
    });
  if (type === 'brand') {
    changeBrandColor(brandInputColor.value);
    return;
  }
  changeFunctionColor(mainColorMap[type as FunctionColorType].value, type as FunctionColorType);
}

function refreshColorTokens() {
  themeStore.incrementColorRefresh();
}

function handleNeutralChange(value: string | number | boolean) {
  changeNeutralColor(Boolean(value));
}

watch(generationMode, () => {
  changeBrandColor(brandDisplayedColor.value);
});

// 保存动画取消函数与模式观察者，组件卸载时清理，避免泄漏
let cancelColorAnimation: (() => void) | null = null;
let modeObserver: MutationObserver | null = null;
// 标记组件是否已卸载：onMounted 的初始化在 nextTick 内异步执行，
// 若组件在 tick 前卸载，回调里应跳过启动动画 / observer，避免泄漏。
let disposed = false;

onMounted(() => {
  nextTick(() => {
    if (disposed) return;
    cancelColorAnimation = colorAnimation();
    changeBrandColor($brandColor.value, 'init');
    updateFunctionTokenMap();
    // 恢复用户上次选择的功能色
    const functionColors: FunctionColorType[] = ['gray', 'success', 'error', 'warning'];
    functionColors.forEach((type) => {
      const color = getOptionFromLocal(type);
      if (color) {
        changeFunctionColor(color, type, 'init');
      }
    });
    modeObserver = setUpModeObserver((theme) => {
      updateBrandTokenMap();
      updateFunctionTokenMap();
      currentBrandIdx.value = brandIndexes.value[theme];
    });
  });
});

onUnmounted(() => {
  disposed = true;
  cancelColorAnimation?.();
  modeObserver?.disconnect();
  cancelColorAnimation = null;
  modeObserver = null;
});
</script>

<style scoped lang="less">
:deep(.t-popup[data-popper-placement='bottom-end'] .t-popup__arrow) {
  left: calc(100% - 16px * 2) !important;
}

.color-content {
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

  :deep(.t-divider__horizontal) {
    margin: 16px 0;
  }

  &__main {
    padding: 12px 4px 16px 16px;
  }

  &__title {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 600;
    margin: 0 0 8px;
    line-height: 22px;
    display: flex;
    align-items: center;
  }

  &__subtitle {
    font-size: 12px;
    margin: 4px 0 10px;

    button {
      margin-right: 8px;
      width: 30px;
      height: 30px;
    }
  }

  &__flex {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -2px;

    > div {
      margin: 2px;
    }
  }

  &__block {
    line-height: 18px;
    font-size: 12px;
    text-align: center;
    border-radius: 9px;
    cursor: pointer;
    width: 56px;
    height: 56px;
    transition: background 0.2s;

    .recommend-block {
      transform: scale(2);
      transform-origin: top left;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 3px;
    }

    > div {
      border-radius: 9px;
      width: 56px;
      height: 56px;
      border: 1px solid transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: var(--text-secondary);
      transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);

      &:hover {
        color: var(--text-secondary-hover);
        scale: 1.05;
      }

      &.is-active {
        border: 1px solid var(--td-brand-color);
      }

      > div {
        color: var(--td-font-white-1);
      }
    }
  }

  &__custom {
    margin: 8px 0;
    padding: 2px;
    height: 106px;
    background: conic-gradient(
      from 180deg at 50% 50%,
      #00c3ff 0,
      var(--td-brand-color) 120deg,
      var(--td-brand-color) 180deg,

      #4ceb1b 290.62deg,
      #00c3ff 360deg
    );
    border-radius: 9px;
    cursor: pointer;
    transition: padding 0.2s;

    &:hover {
      padding: 4px;
    }

    &-inner {
      background-color: var(--bg-color-card);
      padding: 2px 2px 4px;
      border-radius: 7px;
      max-height: 100%;
    }

    &-top {
      padding: 4px 8px;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;

      > p {
        color: var(--td-font-white-3);
        margin: 0;
        line-height: 20px;
        font-size: 12px;
      }
    }

    &-bottom {
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 0;
        line-height: 22px;
        font-size: 14px;

        &:first-child {
          color: var(--text-primary);
          font-weight: 600;
        }

        &:last-child {
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
        }
      }
    }
  }

  &__generate-mode {
    display: flex;
    justify-content: space-between;

    &-btn {
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 118px;
      border-radius: 8px;

      &.is-active {
        background: conic-gradient(
          from 180deg at 50% 50%,
          #00c3ff 0,
          var(--td-brand-color) 120deg,
          var(--td-brand-color) 180deg,

          #4ceb1b 290.62deg,
          #00c3ff 360deg
        );
      }

      &-inner {
        border-radius: 6px;
        border: 2px solid var(--bg-color-card);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-anti);
        width: 113px;
        height: 36px;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
