<template>
  <div class="theme-generator">
    <float-dock
      :drawer-visible="visible"
      :show-setting="showSetting"
      @click-setting="handleClickSetting"
      @trigger-visible="handleTriggerVisible"
    />
    <panel-drawer :drawer-visible="visible" @panel-drawer-visible="handleDrawerVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { applyTokenFromLocal, syncModeToGenerator, syncThemeToIframe, themeStore } from '@/common/themes';
import { setUpModeObserver } from '@/common/utils';

import FloatDock from './float-dock/index.vue';
import PanelDrawer from './panel-drawer/index.vue';

defineOptions({ name: 'ThemeGenerator' });

const props = withDefaults(
  defineProps<{
    showSetting?: boolean | string;
    device?: string;
  }>(),
  {
    device: 'web',
  },
);

const visible = ref(false);
let modeSyncObserver: MutationObserver | null = null;
let refreshObserver: MutationObserver | null = null;
let iframeCleanup: (() => void) | null = null;

onMounted(() => {
  themeStore.updateDevice(props.device);
  modeSyncObserver = syncModeToGenerator();
  applyTokenFromLocal();
  iframeCleanup = syncThemeToIframe(props.device);
  refreshObserver = setUpModeObserver(() => {
    themeStore.incrementRefreshId();
  });
});

onUnmounted(() => {
  modeSyncObserver?.disconnect();
  refreshObserver?.disconnect();
  iframeCleanup?.();
  modeSyncObserver = null;
  refreshObserver = null;
  iframeCleanup = null;
});

function handleTriggerVisible() {
  visible.value = true;
}

function handleDrawerVisible(v: boolean) {
  visible.value = v;
}

function handleClickSetting() {
  visible.value = false;
}
</script>

<style lang="less" scoped>
@media screen and (max-width: 960px) {
  .theme-generator {
    display: none;
  }
}
</style>
<style>
.t-popconfirm {
  z-index: 10000;
}

.t-popconfirm .t-icon {
  font-size: 20px !important;
}

.t-popup__content {
  box-shadow: var(--shadow-2);
}

.t-popup .t-select-option {
  font-size: 14px;
}

.t-popup .t-input-number {
  font-size: 14px;
}

.t-popup .t-input {
  border-radius: 3px !important;
}

.t-popup .t-icon {
  font-size: 14px !important;
}

.t-popup .t-select__empty {
  font-size: 14px;
}

.t-radio-button__label {
  font-size: 14px;
}

.t-radio-group__bg-block {
  background: var(--bg-color-theme-radio-active) !important;
}

.t-slider__button {
  width: 16px;
  height: 16px;
}

.t-button.t-size-l {
  font-size: 16px;
}

.t-button--variant-base.t-button--theme-primary:hover,
.t-button--variant-base.t-button--theme-primary:focus-visible {
  border-color: var(--brand-main-hover);
  background-color: var(--brand-main-hover);
}
</style>
