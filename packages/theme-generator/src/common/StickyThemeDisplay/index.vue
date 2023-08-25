<template>
  <div class="sticky-theme" :style="stickyThemeStyle">
    <div class="theme-status">
      <p class="theme-status-title">{{ title }}</p>
      <p class="theme-status-subtitle">{{ subtitleText }}</p>
    </div>
  </div>
</template>
<script>
import langMixin from "../i18n/mixin";
export default {
  name: "StickyExport",
  props: {
    top: Number,
    theme: {
      type: Object,
    },
  },
  mixins: [langMixin],
  computed: {
    stickyThemeStyle() {
      return {
        top: `${this.top}px`,
      };
    },
    title() {
      return this.isEn ? this.theme.enName : this.theme.name;
    },
    subtitleText() {
      return this.theme.subtitleText;
    },
  },
};
</script>
<style scoped lang="less">
.sticky-theme {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  left: 0;
}

.theme-status {
  background-color: var(--td-brand-color);
  width: 332px;
  height: 72px;
  padding: 8px 12px;
  border-radius: 12px;

  &-title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px 0;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
  }

  &-subtitle {
    font-size: 14px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
  }
}
</style>
