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

    // 初始化 Web Components 尺寸变量隔离
    this.initWebComponentsSizeProtection();
  },
  methods: {
    initWebComponentsSizeProtection() {
      // 创建隔离样式表，保护 Web Components 不受尺寸变量修改的影响
      let styleEl = document.getElementById('__web-components-size-lock__');

      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = '__web-components-size-lock__';
        document.head.appendChild(styleEl);
      }

      // 定义所有 Web Components 使用的尺寸变量的初始值
      const webComponentsSizeVars = {
        '--td-size-1': '2px',
        '--td-size-2': '4px',
        '--td-size-3': '6px',
        '--td-size-4': '8px',
        '--td-size-5': '12px',
        '--td-size-6': '16px',
        '--td-size-7': '20px',
        '--td-size-8': '24px',
        '--td-size-9': '28px',
        '--td-size-10': '32px',
        '--td-size-11': '36px',
        '--td-size-12': '40px',
        '--td-size-13': '48px',
        '--td-size-14': '56px',
        '--td-size-15': '64px',
        '--td-size-16': '72px',
        '--td-comp-size-xxxs': '16px',
        '--td-comp-size-xxs': '20px',
        '--td-comp-size-xs': '24px',
        '--td-comp-size-s': '28px',
        '--td-comp-size-m': '32px',
        '--td-comp-size-l': '36px',
        '--td-comp-size-xl': '40px',
        '--td-comp-size-xxl': '48px',
        '--td-comp-size-xxxl': '56px',
        '--td-comp-size-xxxxl': '64px',
        '--td-comp-size-xxxxxl': '72px',
      };

      let cssRules = '.theme-generator {\n';
      Object.entries(webComponentsSizeVars).forEach(([key, val]) => {
        cssRules += `  ${key}: ${val} !important;\n`;
      });
      cssRules += '}';

      styleEl.textContent = cssRules;
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
