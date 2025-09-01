<template>
  <div class="theme-generator">
    <dock
      @trigger-visible="handleTriggerVisible"
      @refresh-content="handleRefreshContent"
      @change-theme="handleChangeTheme"
      @click-setting="handleClickSetting"
      :drawerVisible="visible"
      :showSetting="showSetting"
    />
    <panel-drawer
      :drawerVisible="visible"
      :theme="theme"
      :refresh="refresh"
      @panel-drawer-visible="handleDrawerVisible"
      :propsTop="propsTop"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import {
  applyThemeFromLocal,
  DEFAULT_THEME,
  generateNewTheme,
  getOptionFromLocal,
  syncThemeToIframe,
} from './common/Themes';

import Dock from './dock/index.vue';
import PanelDrawer from './panel-drawer/index.vue';

const activeTabMap = {
  color: 0,
  font: 1,
  radius: 2,
  shadow: 3,
  size: 4,
};

const props = defineProps({
  propsTop: String,
  showSetting: {
    type: [Boolean, String],
  },
  device: {
    type: String,
    default: 'web',
  },
});

const emit = defineEmits(['click-setting', 'panel-drawer-visible']);

// Provide device to child components
provide('device', props.device);

// Data
const refresh = ref(false);
const visible = ref(0);
const activeTabIdx = ref(activeTabMap.color);
const theme = ref(DEFAULT_THEME);

// Methods
const handleChangeTheme = (newTheme) => {
  theme.value = newTheme;
};

const handleRefreshContent = () => {
  refresh.value = !refresh.value;
};

const handleTriggerVisible = () => {
  visible.value = true;
};

const handleDrawerVisible = (v) => {
  visible.value = v;
  emit('panel-drawer-visible', v);
};

const handleClickSetting = () => {
  emit('click-setting');
  visible.value = false;
};

// Lifecycle hooks
onMounted(() => {
  const localTheme = getOptionFromLocal('color') ?? DEFAULT_THEME.value;
  generateNewTheme(localTheme, undefined, props.device);
  syncThemeToIframe(props.device);
  applyThemeFromLocal(props.device);
});
</script>

<style lang="less" scoped>
@import './styles/reset.min.css';
@import './styles/tdesign.min.css';

@media screen and (max-width: 960px) {
  .theme-generator {
    display: none;
  }
}
</style>
<style>
.t-popup .t-select-option {
  font-size: 14px;
}
.t-popconfirm {
  z-index: 10000;
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

.t-popconfirm .t-icon {
  font-size: 20px !important;
}
.t-popup .t-select__empty {
  font-size: 14px;
}
.t-button.t-size-l {
  font-size: 16px;
}
.t-radio-button__label {
  font-size: 14px;
}
.t-slider__button {
  width: 16px;
  height: 16px;
}
.t-button--variant-base.t-button--theme-primary:hover,
.t-button--variant-base.t-button--theme-primary:focus-visible {
  border-color: var(--brand-main-hover);
  background-color: var(--brand-main-hover);
}
</style>
