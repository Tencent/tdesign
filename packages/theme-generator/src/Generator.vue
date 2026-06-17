<template>
  <div class="theme-generator" :theme-mode="themeMode">
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  applyTokenFromLocal,
  initGeneratorVars,
  syncModeToGenerator,
  syncThemeToIframe,
  themeStore,
} from '@/common/themes';
import { getShadowRoot, setShadowRootRef, clearShadowRootRef, patchShadowDomPopupClose } from '@/common/utils';
import FloatDock from './float-dock';
import PanelDrawer from './panel-drawer';

const props = defineProps({
  showSetting: {
    type: [Boolean, String],
    default: false,
  },
  device: {
    type: String,
    default: 'web',
  },
  // Web Component 宿主元素的 theme-mode 属性
  themeMode: {
    type: String,
    default: '',
  },
});

const visible = ref(false);
let cleanupPopupPatch = null;

// 将 themeMode 同步到 shadowRoot 内的根元素
// 这样 shadowRoot 内的 CSS 变量才能根据 theme-mode 切换
const themeModeValue = computed(() => props.themeMode || 'light');

function syncThemeModeToShadowRoot(mode) {
  const shadowRoot = getShadowRoot();
  if (shadowRoot) {
    const rootEl = shadowRoot.querySelector('.theme-generator');
    if (rootEl) {
      rootEl.setAttribute('theme-mode', mode);
    }
  }
}

watch(themeModeValue, (mode) => {
  syncThemeModeToShadowRoot(mode);
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

onMounted(() => {
  // 缓存 shadowRoot 引用，避免后续重复 DOM 查询，支持多实例场景
  const shadowRoot = getShadowRoot();
  if (shadowRoot) {
    setShadowRootRef(shadowRoot);
    cleanupPopupPatch = patchShadowDomPopupClose(shadowRoot);
  }

  // Web Component 模式下，attribute → prop 转换可能有时序问题
  // 从宿主元素 DOM attribute 直接读取 device，确保不会漏掉外部传入的值
  const host = shadowRoot?.host;
  const device = host?.getAttribute('device') || props.device;

  themeStore.updateDevice(device);
  syncModeToGenerator();
  initGeneratorVars();
  applyTokenFromLocal();
  syncThemeToIframe(device);

  // 初始化时同步 theme-mode 到 shadowRoot
  if (props.themeMode) {
    syncThemeModeToShadowRoot(props.themeMode);
  }
});

onBeforeUnmount(() => {
  clearShadowRootRef();
  if (cleanupPopupPatch) {
    cleanupPopupPatch();
    cleanupPopupPatch = null;
  }
});
</script>

<style lang="less">
@import './styles/reset.min.css';
@import './styles/tdesign.min.css';

@media screen and (max-width: 960px) {
  .theme-generator {
    display: none;
  }
}

.t-popconfirm {
  z-index: 10000;
}
.t-popconfirm .t-icon {
  font-size: 20px !important;
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

/* 修复 float-dock 按钮样式被 tdesign.min.css 覆盖的问题
   .generator-btn .t-button 特异性 (0,2,0) 与 .t-button--shape-square.t-size-l (0,2,0) 相同，
   仅靠源码顺序决定优先级不够稳健，提升至 (0,3,0) 确保稳赢 */
.theme-generator .generator-btn .t-button,
.theme-generator .export-btn .t-button,
.theme-generator .setting-btn .t-button,
.theme-generator .recover-btn .t-button {
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
.theme-generator .generator-btn:hover .t-button,
.theme-generator .export-btn:hover .t-button,
.theme-generator .setting-btn:hover .t-button,
.theme-generator .recover-btn:hover .t-button {
  background-color: var(--bg-color-card);
  color: var(--text-primary);
}
</style>
