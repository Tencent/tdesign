<template>
  <t-drawer
    :visible.sync="visible"
    :header="false"
    :closeBtn="false"
    :preventScrollThrough="false"
    :footer="false"
    size="348px"
    :style="drawerStyle"
  >
    <sticky-theme-display />
    <div style="display: flex">
      <switch-tabs :activeTabIdx="activeTabIdx" @changeActiveTab="changeActiveTab" />
      <color-content :top="top" :key="`${$refreshId}-color`" v-show="activeTabIdx === activeTabMap.color" />
      <font-content :top="top" :key="`${$refreshId}-font`" v-show="activeTabIdx === activeTabMap.font" />
      <radius-content :top="top" :key="`${$refreshId}-radius`" v-show="activeTabIdx === activeTabMap.radius" />
      <shadow-content :top="top" :key="`${$refreshId}-shadow`" v-show="activeTabIdx === activeTabMap.shadow" />
      <size-content :top="top" :key="`${$refreshId}-size`" v-show="activeTabIdx === activeTabMap.size" />
    </div>
  </t-drawer>
</template>

<script>
import { Drawer as TDrawer } from 'tdesign-vue';

import ColorContent from '../color-panel/components/ColorContent/index.vue'; //色彩配置
import FontContent from '../font-panel/index.vue'; // 字体配置
import RadiusContent from '../radius-panel/index.vue'; // 字体配置
import ShadowContent from '../shadow-panel/index.vue'; // 阴影配置
import SizeContent from '../size-panel/index.vue'; // 阴影配置

import StickyThemeDisplay from '../common/StickyThemeDisplay/index.vue';
import SwitchTabs from '../common/SwitchTabs/index.vue';
import { themeStore } from '../common/Themes/store';
import { syncThemeToGenerator } from '../common/utils';

const activeTabMap = {
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
    ColorContent,
    FontContent,
    RadiusContent,
    ShadowContent,
    SizeContent,
  },
  props: {
    propsTop: String,
    showSetting: {
      type: [String, Boolean],
    },
    theme: {
      type: [Object, String],
    },
    drawerVisible: {
      type: [String, Number, Boolean],
    },
  },
  data() {
    return {
      top: null,
      activeTabMap,
      isHeaderShow: true,
      activeTabIdx: activeTabMap.color,
      visible: false,
    };
  },
  computed: {
    $refreshId() {
      return themeStore.refreshId;
    },
    drawerStyle() {
      return {
        top: `${this.top}px`,
      };
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
  mounted() {
    syncThemeToGenerator();

    if (this.propsTop) {
      this.top = parseInt(this.propsTop, 10);
    } else {
      const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');

      if (headerHeight) this.top = parseInt(headerHeight) - window.scrollY;
    }

    window.addEventListener('scroll', this.calcHeaderShow);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.calcHeaderShow);
  },
  methods: {
    changeActiveTab(tab) {
      this.activeTabIdx = tab;
    },
    calcHeaderShow() {
      const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
      this.top = Math.max(parseInt(headerHeight) - window.scrollY, 0);
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
