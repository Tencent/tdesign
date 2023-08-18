<template>
  <div class="shadow-card">
    <t-popup
      placement="left"
      showArrow
      destroyOnClose
      :attach="handleAttach"
      :overlayStyle="{ borderRadius: '9px', padding: '12px 16px 8px' }"
    >
      <div
        class="shadow-card__item"
        :style="{ 'box-shadow': shadow.join(',') }"
      >
        <div class="shadow-card__title">{{ detail.label }}:</div>
        <div class="shadow-card__tips">
          {{ isEn ? detail.enTips : detail.tips }}
        </div>
        <t-divider class="shadow-card__divided"></t-divider>
        <div class="shadow-card__info">
          <div
            :class="['shadow-card__info-item', 'text-ellipsis']"
            v-for="(value, i) in shadow"
            :key="i"
          >
            {{ value }} {{ i === shadow.length - 1 ? ";" : "," }}
          </div>
        </div>
      </div>
      <template #content>
        <shadow-layer
          :shadow="shadow"
          :detail="detail"
          @change="change"
        ></shadow-layer>
      </template>
    </t-popup>
  </div>
</template>
<script lang="jsx">
import { Popup as TPopup, Divider as TDivider } from "tdesign-vue";
import ShadowLayer from "./ShadowLayer.vue";
import { handleAttach } from "../../common/utils";
import langMixin from "../../common/i18n/mixin";

export default {
  name: "ShadowCard",
  props: {
    shadow: Array,
    detail: Object,
    index: Number,
  },
  mixins: [langMixin],
  components: {
    TPopup,
    TDivider,
    ShadowLayer,
  },
  methods: {
    handleAttach,
    change(value) {
      this.$emit("change", value);
    },
  },
};
</script>
<style scoped lang="less">
.shadow-card {
  display: flex;
  margin-top: 8px;
  background-color: var(--bg-color-theme-secondary);
  border-radius: 9px;
  &__item {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    border-radius: 6px;
    padding: 6px 8px;
    margin: 16px;
    overflow: hidden;
    background-color: var(--bg-color-theme-surface);
  }
  &__item--active {
    border: 1px solid var(--brand-main);
  }
  &__title {
    font-size: 12px;
    color: var(--text-primary);
    line-height: 20px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
  }
  &__tips {
    font-size: 12px;
    color: var(--text-placeholder);
    line-height: 20px;
  }
  &__divided {
    margin: 4px 0;
  }
  &__info {
    font-size: 12px;
    color: var(--text-placeholder);
    line-height: 20px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
  }
}
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
