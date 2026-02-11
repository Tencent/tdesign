<template>
  <div class="shadow-card">
    <t-popup
      placement="left"
      show-arrow
      destroy-on-close
      :attach="handleAttach"
      :overlay-style="{ borderRadius: '9px', padding: '12px 16px 8px' }"
    >
      <div class="shadow-card__item" :style="{ 'box-shadow': shadow.join(',') }">
        <div class="shadow-card__title">{{ detail.label }}:</div>
        <div class="shadow-card__tips">
          {{ isEn ? detail.enTips : detail.tips }}
        </div>
        <t-divider class="shadow-card__divided"></t-divider>
        <div class="shadow-card__info">
          <div v-for="(value, i) in shadow" :key="i" :class="['shadow-card__info-item', 'text-ellipsis']">
            {{ value }} {{ i === shadow.length - 1 ? ';' : ',' }}
          </div>
        </div>
      </div>
      <template #content>
        <shadow-layer :shadow="shadow" :detail="detail" @change="change"></shadow-layer>
      </template>
    </t-popup>
  </div>
</template>

<script lang="jsx">
import { Divider as TDivider, Popup as TPopup } from 'tdesign-vue';

import { langMixin } from '@/common/i18n';
import { handleAttach } from '@/common/utils';

import ShadowLayer from './ShadowLayer.vue';

export default {
  name: 'ShadowCard',
  components: {
    TPopup,
    TDivider,
    ShadowLayer,
  },
  mixins: [langMixin],
  props: {
    shadow: {
      type: Array,
      default: () => [],
    },
    detail: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleAttach,
    change(value) {
      this.$emit('change', value);
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
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
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
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
}
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
