<template>
  <t-drawer
    size="348px"
    :visible.sync="visible"
    :header="false"
    :close-btn="false"
    :prevent-scroll-through="false"
    :footer="false"
    show-in-attached-element
  >
    <sticky-theme-display />
    <div style="display: flex">
      <switch-tabs :active-tab-idx="activeTabIdx" @changeActiveTab="changeActiveTab" />
      <color-panel v-show="activeTabIdx === ACTIVE_TAB_MAP.color" :key="`${$refreshId}-color`" />
      <font-panel v-show="activeTabIdx === ACTIVE_TAB_MAP.font" :key="`${$refreshId}-font`" />
      <radius-panel v-show="activeTabIdx === ACTIVE_TAB_MAP.radius" :key="`${$refreshId}-radius`" />
      <shadow-panel v-show="activeTabIdx === ACTIVE_TAB_MAP.shadow" :key="`${$refreshId}-shadow`" />
      <size-panel v-show="activeTabIdx === ACTIVE_TAB_MAP.size" :key="`${$refreshId}-size`" />
    </div>
  </t-drawer>
</template>

<script>
import { Drawer as TDrawer } from 'tdesign-vue';

import { themeStore } from '@/common/themes';
import { handleAttach } from '@/common/utils';

import ColorPanel from '../color-panel';
import FontPanel from '../font-panel';
import RadiusPanel from '../radius-panel';
import ShadowPanel from '../shadow-panel';
import SizePanel from '../size-panel';

import StickyThemeDisplay from './components/StickyThemeDisplay';
import SwitchTabs from './components/SwitchTabs';

const ACTIVE_TAB_MAP = {
  color: 0,
  font: 1,
  radius: 2,
  shadow: 3,
  size: 4,
};

export default {
  name: 'PanelDrawer',
  components: {
    TDrawer,
    SwitchTabs,
    StickyThemeDisplay,
    ColorPanel,
    FontPanel,
    RadiusPanel,
    ShadowPanel,
    SizePanel,
  },
  props: {
    showSetting: {
      type: [String, Boolean],
      default: false,
    },
    theme: {
      type: [Object, String],
      default: () => ({}),
    },
    drawerVisible: {
      type: [String, Number, Boolean],
      default: false,
    },
  },
  data() {
    return {
      ACTIVE_TAB_MAP,
      isHeaderShow: true,
      activeTabIdx: ACTIVE_TAB_MAP.color,
      visible: false,
    };
  },
  computed: {
    $refreshId() {
      return themeStore.refreshId;
    },
  },
  watch: {
    drawerVisible(v) {
      if ((typeof v === 'string' && v === 'false') || v === false) {
        this.visible = false;
        return;
      }
      this.visible = true;
    },
    visible(v) {
      this.$emit('panel-drawer-visible', v);
    },
  },
  methods: {
    handleAttach,
    changeActiveTab(tab) {
      this.activeTabIdx = tab;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .t-drawer__mask {
  background: none;
}

/deep/ .t-drawer__content-wrapper {
  box-shadow: var(--shadow-2);
  border-radius: 12px 0 0 0;
  position: fixed;
  .t-drawer__body {
    padding: 0;
    background: var(--bg-color-theme-transparent);
    backdrop-filter: blur(10px);
  }
}

/deep/ .t-popup__content {
  font-size: 14px;
  box-shadow: var(--shadow-2), var(--shadow-inset-top), var(--shadow-inset-right), var(--shadow-inset-bottom),
    var(--shadow-inset-left);
}

/deep/ .t-popup__content:not(.t-tooltip) {
  background: var(--bg-color-container);
}

/deep/ .t-popup[data-popper-placement='bottom-end'] .t-popup__arrow {
  left: calc(100% - 16px * 2);
}

/deep/ .t-popup[data-popper-placement='bottom-start'] .t-popup__arrow {
  left: 20px;
}

/deep/ .t-popup__content:not(.t-tooltip) .t-popup__arrow:before {
  background: var(--bg-color-container);
}

/deep/ .t-select__list {
  padding: 0;
}

/deep/ .t-button--variant-text:hover {
  background: var(--bg-color-container-hover);
}

/deep/ .t-input {
  padding-left: 4px !important;
}
</style>
