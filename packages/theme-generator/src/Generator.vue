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

<script>
import PanelDrawer from "./panel-drawer/index.vue";
import Dock from "./dock/index.vue";

import { defaultTheme } from "./common/Themes/const";
import { generateNewTheme } from "./common/utils";

const activeTabMap = {
  color: 0,
  font: 1,
  radius: 2,
  shadow: 3,
  size: 4,
};

export default {
  components: {
    PanelDrawer,
    Dock,
  },
  props: {
    propsTop: String,
    showSetting: {
      type: [Boolean, String],
    },
  },
  data() {
    return {
      activeTabMap,
      refresh: false,
      visible: 0,
      activeTabIdx: activeTabMap.color,
      theme: defaultTheme,
    };
  },
  mounted() {
    generateNewTheme("#0052D9");
  },
  methods: {
    handleChangeTheme(theme) {
      this.theme = theme;
    },
    handleRefreshContent() {
      this.refresh = !this.refresh;
    },
    handleTriggerVisible() {
      this.visible = true;
    },
    handleDrawerVisible(v) {
      this.visible = v;
      this.$emit("panel-drawer-visible", v);
    },
    handleClickSetting() {
      this.$emit("click-setting");
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../node_modules/tdesign-vue/dist/tdesign.css";
@import "../node_modules/tdesign-vue/dist/reset.css";

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
</style>
