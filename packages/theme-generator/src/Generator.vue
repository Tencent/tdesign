<template>
  <div id="theme-generator">
    <dock
      :drawerVisible="visible"
      :showSetting="showSetting"
      @click-setting="handleClickSetting"
      @trigger-visible="handleTriggerVisible"
    />
    <panel-drawer :drawerVisible="visible" :propsTop="propsTop" @panel-drawer-visible="handleDrawerVisible" />
  </div>
</template>

<script>
import { applyTokenFromLocal, initThemeStyleSheet, syncThemeToIframe, themeStore } from './common/themes';
import { initGeneratorVars } from './common/utils';

import Dock from './dock';
import PanelDrawer from './panel-drawer';

const activeTabMap = {
  color: 0,
  font: 1,
  radius: 2,
  shadow: 3,
  size: 4,
};

export default {
  name: 'ThemeGenerator',
  components: {
    PanelDrawer,
    Dock,
  },
  props: {
    propsTop: String,
    showSetting: {
      type: [Boolean, String],
    },
    device: {
      type: String,
      default: 'web',
    },
  },
  provide() {
    return {
      $device: this.device,
    };
  },
  data() {
    return {
      activeTabMap,
      visible: 0,
      activeTabIdx: activeTabMap.color,
    };
  },
  computed: {
    $theme() {
      return themeStore.theme;
    },
  },
  mounted() {
    initGeneratorVars();
    initThemeStyleSheet(this.$theme.enName);
    applyTokenFromLocal();
    syncThemeToIframe(this.device);
  },
  methods: {
    handleTriggerVisible() {
      this.visible = true;
    },
    handleDrawerVisible(v) {
      this.visible = v;
      this.$emit('panel-drawer-visible', v);
    },
    handleClickSetting() {
      this.$emit('click-setting');
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import './styles/reset.min.css';
@import './styles/tdesign.min.css';

@media screen and (max-width: 960px) {
  #theme-generator {
    display: none;
  }
}
</style>
<style>
:host {
  --td-bg-color-container: var(--bg-color-container);
  --td-bg-color-secondarycomponent: var(--bg-color-theme-secondary);
  --td-bg-color-container-hover: var(--bg-color-container-hover);
  --td-bg-color-component-active: var(--bg-color-component-hover);
  --td-border-level-2-color: var(--component-border);
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
