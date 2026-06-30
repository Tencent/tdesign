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
import { ref, onMounted } from 'vue';
import {
  applyTokenFromLocal,
  initGeneratorVars,
  syncModeToGenerator,
  syncThemeToIframe,
  themeStore,
} from '@/common/themes';

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

const visible = ref(0);

onMounted(() => {
  themeStore.updateDevice(props.device);
  syncModeToGenerator();
  initGeneratorVars();
  applyTokenFromLocal();
  syncThemeToIframe(props.device);
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
