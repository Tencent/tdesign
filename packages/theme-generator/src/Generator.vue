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

<script>
import {
  applyTokenFromLocal,
  initGeneratorVars,
  syncModeToGenerator,
  syncThemeToIframe,
  themeStore,
} from '@/common/themes';
import { COMP_SIZE_DEFAULT_VALUES, SIZE_DEFAULT_VALUES } from '@/size-panel/built-in/size-map';

const STYLE_LOCK_ID = '__web-components-size-lock__';

import FloatDock from './float-dock';
import PanelDrawer from './panel-drawer';

export default {
  name: 'ThemeGenerator',
  components: {
    FloatDock,
    PanelDrawer,
  },
  props: {
    showSetting: {
      type: [Boolean, String],
    },
    device: {
      type: String,
      default: 'web',
    },
  },
  data() {
    return {
      visible: 0,
    };
  },
  mounted() {
    themeStore.updateDevice(this.device);
    syncModeToGenerator();
    initGeneratorVars();
    applyTokenFromLocal();
    syncThemeToIframe(this.device);

    this.initWebComponentsSizeProtection();
  },
  methods: {
    initWebComponentsSizeProtection() {
      let styleEl = document.getElementById(STYLE_LOCK_ID);

      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = STYLE_LOCK_ID;
        document.head.appendChild(styleEl);
      }

      const sizeVars = { ...SIZE_DEFAULT_VALUES, ...COMP_SIZE_DEFAULT_VALUES };
      styleEl.textContent = buildSizeVarsCSS(sizeVars);
    },
    handleTriggerVisible() {
      this.visible = true;
    },
    handleDrawerVisible(v) {
      this.visible = v;
    },
    handleClickSetting() {
      this.visible = false;
    },
  },
};

function buildSizeVarsCSS(sizeVars) {
  const body = Object.entries(sizeVars)
    .map(([key, val]) => `  ${key}: ${val} !important;`)
    .join('\n');
  return `:root {\n${body}\n}`;
}
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
