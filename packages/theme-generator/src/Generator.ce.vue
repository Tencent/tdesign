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
import { ref, computed, onMounted, watch } from 'vue';
import {
  applyTokenFromLocal,
  initGeneratorVars,
  syncModeToGenerator,
  syncThemeToIframe,
  themeStore,
} from '@/common/themes';
import { getShadowRoot } from '@/common/utils';
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
  themeStore.updateDevice(props.device);
  syncModeToGenerator();
  initGeneratorVars();
  applyTokenFromLocal();
  syncThemeToIframe(props.device);

  // 初始化时同步 theme-mode 到 shadowRoot
  if (props.themeMode) {
    syncThemeModeToShadowRoot(props.themeMode);
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
</style>
<style>
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
</style>
