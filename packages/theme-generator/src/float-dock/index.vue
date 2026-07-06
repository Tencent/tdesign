<template>
  <t-popup hide-empty-popup :attach="handleAttach" :visible="isThemeTabVisible" @visible-change="handleVisibleChange">
    <div
      class="dock"
      :style="{
        zIndex: 9999,
        width: operationWidth,
        transition: 'width .3s',
        bottom: `${dockY}px`,
        left: `${dockX}px`,
        transform: 'translateX(-50%)',
        userSelect: isDragging ? 'none' : 'auto',
      }"
      @mousedown="dragStart"
    >
      <div class="dock__theme-tab" :style="{ height: !isThemeTabVisible ? '0px' : '140px' }">
        <transition name="fade">
          <recommend-themes v-if="isThemeTabVisible && isThemeTabContentDisplay" />
        </transition>
      </div>
      <div class="dock__operation">
        <div
          ref="btn"
          class="generator-btn"
          @click="handleClickTheme"
          @mouseleave="handleLeaveTheme"
          :style="{
            width: generateBtnWidth,
            marginRight: '4px',
            transition: 'width .3s',
          }"
        >
          <t-button variant="outline" shape="square" size="large">
            <template #icon>
              <palette-svg />
            </template>
            <div v-if="!isCustomizeDrawerVisible" style="margin-left: 8px">
              {{ isEn ? $theme.enName : $theme.name }}
            </div>
          </t-button>
        </div>
        <div
          class="generator-btn"
          @click="handleClickCustomize"
          :style="{
            width: !isCustomizeDrawerVisible ? '48px' : '216px',
            margin: '0 4px',
            transition: 'width .3s',
          }"
        >
          <t-button variant="outline" shape="square" size="large">
            <template #icon>
              <adjust-svg />
            </template>
            <div v-if="isCustomizeDrawerVisible" style="margin-left: 8px">
              {{ lang.dock.adjustText }}
            </div>
          </t-button>
        </div>
        <div v-if="showSetting" class="setting-btn" :style="{ width: '48px', marginLeft: '4px' }">
          <t-button variant="outline" shape="square" size="large" @click="triggerSettingDrawer">
            <template #icon>
              <setting-svg />
            </template>
          </t-button>
        </div>
        <div
          v-if="isCustomizeDrawerVisible || isThemeTabVisible"
          class="export-btn"
          @click="handleDownload"
          :style="{ width: '48px', margin: '0 4px' }"
        >
          <t-button variant="outline" shape="square" size="large">
            <template #icon>
              <download-svg />
            </template>
          </t-button>
        </div>
        <div
          v-if="isCustomizeDrawerVisible || isThemeTabVisible"
          class="recover-btn"
          :style="{ width: '48px', marginLeft: '4px' }"
        >
          <t-popconfirm
            :content="lang.dock.recoverConfirm"
            :popup-props="{
              attach: handleAttach,
            }"
            @confirm="resetTheme"
          >
            <t-button variant="outline" shape="square" size="large">
              <template #icon>
                <recover-svg />
              </template>
            </t-button>
          </t-popconfirm>
        </div>
      </div>
    </div>
  </t-popup>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { MessagePlugin, Button as TButton, Popconfirm as TPopconfirm, Popup as TPopup } from 'tdesign-vue-next/lib';

import { useLang } from '@/common/i18n';
import { exportCustomStyleSheet, themeStore } from '@/common/themes';
import { handleAttach } from '@/common/utils';

import RecommendThemes from './components/RecommendThemes';

import AdjustSvg from './svg/AdjustSvg.vue';
import DownloadSvg from './svg/DownloadSvg.vue';
import PaletteSvg from './svg/PaletteSvg.vue';
import RecoverSvg from './svg/RecoverSvg.vue';
import SettingSvg from './svg/SettingSvg.vue';

defineOptions({ name: 'FloatDock' });

const props = defineProps({
  drawerVisible: { type: [Boolean, Number] },
  showSetting: { type: [Boolean, String] },
});

const emit = defineEmits(['click-setting', 'trigger-visible']);

const { lang, isEn } = useLang();

const isThemeTabVisible = ref(false);
const isCustomizeDrawerVisible = ref(false);
const isThemeTabContentDisplay = ref(false);
const dockY = ref(null);
const dockX = ref(0);
const startY = ref(null);
const startX = ref(null);
const isDragging = ref(false);
const btn = ref(null);

const $theme = computed(() => themeStore.theme);
const $device = computed(() => themeStore.device);
const operationWidth = computed(() => {
  if (!props.showSetting) {
    if (isThemeTabVisible.value || isCustomizeDrawerVisible.value) return '400px';
    return '256px';
  } else {
    if (isThemeTabVisible.value || isCustomizeDrawerVisible.value) return '456px';
    return '312px';
  }
});
const generateBtnWidth = computed(() => {
  if (isThemeTabVisible.value) return '216px';
  if (isCustomizeDrawerVisible.value) return '48px';
  return '184px';
});

watch(
  () => props.drawerVisible,
  (v) => {
    if (!v) isCustomizeDrawerVisible.value = false;
  },
);

let themeTabTimer = null;

watch(isThemeTabVisible, (v) => {
  if (themeTabTimer) clearTimeout(themeTabTimer);
  themeTabTimer = setTimeout(() => {
    isThemeTabContentDisplay.value = v;
  }, 300);
});

onMounted(() => {
  dockY.value = 24;
  dockX.value = innerWidth / 2;
});

onUnmounted(() => {
  if (themeTabTimer) clearTimeout(themeTabTimer);
});

function dragStart(e) {
  startY.value = e.clientY;
  startX.value = e.clientX;
  isDragging.value = true;

  document.addEventListener('mouseup', handleMouseup, true);
  document.addEventListener('mousemove', handleMousemove, true);
}

function handleMousemove(e) {
  if (!isDragging.value) return false;
  // 获取拖拽移动的距离
  const movedY = startY.value - e.clientY;
  const movedX = startX.value - e.clientX;
  startY.value = e.clientY;
  startX.value = e.clientX;

  const newY = dockY.value + movedY;
  const newX = dockX.value - movedX;
  if (newY > 0) dockY.value = newY;
  dockX.value = newX;
}

function handleMouseup() {
  isDragging.value = false;
  document.removeEventListener('mouseup', handleMouseup, true);
  document.removeEventListener('mousemove', handleMousemove, true);
}

function handleDownload() {
  exportCustomStyleSheet($device.value);
  MessagePlugin.success(lang.dock.downloadTips);
}

function triggerSettingDrawer() {
  emit('click-setting');
}

function handleLeaveTheme() {
  btn.value.classList.add('is-mouseleave');
  setTimeout(() => {
    btn.value.classList.remove('is-mouseleave');
  }, 500);
}

function handleClickCustomize() {
  emit('trigger-visible');
  isCustomizeDrawerVisible.value = true;
  isThemeTabVisible.value = false;
  if (window._horizon) {
    window._horizon.send('主题生成器自定义按钮', 'click');
  }
}

function handleClickTheme() {
  isThemeTabVisible.value = true;
  isCustomizeDrawerVisible.value = false;
  if (window._horizon) {
    window._horizon.send('主题生成器主题按钮', 'click');
  }
}

function handleVisibleChange(visible, ctx) {
  if (!visible && ctx.trigger === 'document' && ctx.e.target?.localName !== 'td-theme-generator') {
    isThemeTabVisible.value = visible;
  }
}

function resetTheme() {
  themeStore.resetTheme();
}
</script>

<style lang="less" scoped>
@keyframes toConic {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes toPure {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 0;
  }
}
.fade-enter-active,
.fad-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.dock {
  position: fixed;
  margin: auto;
  width: fit-content;
  background-color: var(--bg-color-theme-transparent);
  padding: 8px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border-radius: 32px;
  &__theme-tab {
    transition: height 0.3s;
  }
  &__operation {
    display: flex;
  }
}
.generator-btn,
.export-btn,
.setting-btn,
.recover-btn {
  border-radius: 32px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--theme-component-border),
    var(--theme-component-border),
    var(--theme-component-border),
    #006cfc,
    #05c4f4,
    #7ee94c
  );
  background-size: 400%;
  &.is-mouseleave {
    animation: toPure 0.5s cubic-bezier(0.38, 0, 0.24, 1);
  }
  :deep(.t-button--variant-text:hover) {
    background: var(--bg-color-container-hover);
  }
  :deep(.t-button) {
    height: 46px;
    width: 100%;
    border-radius: 24px;
    border: none;
    margin: auto;
    transition: transform 0.2s, color 0.2s;
    background-color: var(--bg-color-card);
    --ripple-color: transparent;
    color: var(--text-secondary);
  }

  &:hover {
    animation: toConic 0.5s cubic-bezier(0.38, 0, 0.24, 1) forwards;
    :deep(.t-button) {
      background-color: var(--bg-color-card);
      color: var(--text-primary);
    }
  }
}
</style>
