<template>
  <div>
    <t-drawer
      size="348px"
      v-model:visible="visible"
      :header="false"
      :closeBtn="false"
      :preventScrollThrough="false"
      :footer="false"
      :attach="handleAttach"
    >
      <sticky-theme-display />
      <div style="display: flex">
        <switch-tabs :activeTabIdx="activeTabIdx" @changeActiveTab="changeActiveTab" />
        <color-panel :key="`${$refreshId}-color`" v-show="activeTabIdx === ACTIVE_TAB_MAP.color" />
        <font-panel :key="`${$refreshId}-font`" v-show="activeTabIdx === ACTIVE_TAB_MAP.font" />
        <radius-panel :key="`${$refreshId}-radius`" v-show="activeTabIdx === ACTIVE_TAB_MAP.radius" />
        <shadow-panel :key="`${$refreshId}-shadow`" v-show="activeTabIdx === ACTIVE_TAB_MAP.shadow" />
        <size-panel :key="`${$refreshId}-size`" v-show="activeTabIdx === ACTIVE_TAB_MAP.size" />
      </div>
    </t-drawer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Drawer as TDrawer } from 'tdesign-vue-next';

import { themeStore } from '@/common/themes';
import { handleAttach } from '@/common/utils';

import ColorPanel from '../color-panel';
import FontPanel from '../font-panel';
import RadiusPanel from '../radius-panel';
import ShadowPanel from '../shadow-panel';
import SizePanel from '../size-panel';

import StickyThemeDisplay from './components/StickyThemeDisplay';
import SwitchTabs from './components/SwitchTabs';

defineOptions({ name: 'PanelDrawer' });

const props = defineProps({
  showSetting: {
    type: [String, Boolean],
  },
  theme: {
    type: [Object, String],
  },
  drawerVisible: {
    type: [String, Number, Boolean],
  },
});

const emit = defineEmits(['panel-drawer-visible']);

const ACTIVE_TAB_MAP = {
  color: 0,
  font: 1,
  radius: 2,
  shadow: 3,
  size: 4,
};

const activeTabIdx = ref(ACTIVE_TAB_MAP.color);
const visible = ref(false);

const $refreshId = computed(() => themeStore.refreshId);

watch(
  () => props.drawerVisible,
  (v) => {
    if ((typeof v === 'string' && v === 'false') || v === false) {
      visible.value = false;
      return;
    }
    visible.value = true;
  },
);

watch(visible, (v) => {
  emit('panel-drawer-visible', v);
});

function changeActiveTab(tab) {
  activeTabIdx.value = tab;
}
</script>

<style lang="less">
/* 非 scoped：drawer/popup 通过 :attach teleport 到 .theme-generator 后脱离本组件根节点，
   scoped 的 [data-v-xxx] 前缀会让选择器失配。shadow DOM 已隔离，无需 scoped。 */
.t-drawer__mask {
  background: none;
  /* mask 不拦截宿主页面交互，仅作为点击外部关闭的判定层；
     content-wrapper 仍可正常点击。 */
  pointer-events: none;
}

.t-drawer__content-wrapper {
  box-shadow: var(--shadow-2);
  border-radius: 12px 0 0 0;
  position: fixed;
  pointer-events: auto;
  .t-drawer__body {
    padding: 0;
    background: var(--bg-color-theme-transparent);
    backdrop-filter: blur(10px);
  }
}

.t-popup__content {
  font-size: 14px;
  box-shadow: var(--shadow-2), var(--shadow-inset-top), var(--shadow-inset-right), var(--shadow-inset-bottom),
    var(--shadow-inset-left);
}

.t-popup__content:not(.t-tooltip) {
  background: var(--bg-color-container);
}

.t-popup[data-popper-placement='bottom-end'] .t-popup__arrow {
  left: calc(100% - 16px * 2);
}

.t-popup[data-popper-placement='bottom-start'] .t-popup__arrow {
  left: 20px;
}

.t-popup__content:not(.t-tooltip) .t-popup__arrow:before {
  background: var(--bg-color-container);
}

.t-select__list {
  padding: 0;
}

.t-button--variant-text:hover {
  background: var(--bg-color-container-hover);
}

.t-input {
  padding-left: 4px !important;
}
</style>
