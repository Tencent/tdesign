<template>
  <div class="theme-generator">
    <float-dock
      :drawerVisible="visible"
      :showSetting="showSetting"
      @click-setting="handleClickSetting"
      @trigger-visible="handleTriggerVisible"
    />
    <panel-drawer :drawerVisible="visible" @panel-drawer-visible="handleDrawerVisible" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { applyTokenFromLocal, syncModeToGenerator, syncThemeToIframe, themeStore } from '@/common/themes';
import { setUpModeObserver } from '@/common/utils';

import FloatDock from './float-dock';
import PanelDrawer from './panel-drawer';

defineOptions({ name: 'ThemeGenerator' });

const props = defineProps({
  showSetting: {
    type: [Boolean, String],
  },
  device: {
    type: String,
    default: 'web',
  },
});

const visible = ref(false);
// 保存 observer 与清理函数，组件卸载时断开，避免泄漏
let modeSyncObserver = null;
let refreshObserver = null;
let iframeCleanup = null;

onMounted(() => {
  themeStore.updateDevice(props.device);
  modeSyncObserver = syncModeToGenerator();
  // initGeneratorVars 不再调用：generator-vars.css 已注入 Shadow Root，
  // 生成器 UI 专用变量（--brand-main 等）在 Shadow DOM 内直接可用。
  applyTokenFromLocal();
  iframeCleanup = syncThemeToIframe(props.device);
  // 宿主页亮暗模式切换时，font/shadow/size 面板以 $refreshId 为 key，
  // bump 后强制重新挂载并重读 token 值（getTokenValue 非响应式，需靠 key 变更触发重渲染）。
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

function handleDrawerVisible(v) {
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
