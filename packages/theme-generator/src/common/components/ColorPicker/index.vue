<template>
  <t-color-picker-panel
    :value="props.value"
    :format="format"
    :color-modes="['monochrome']"
    :recent-colors="null"
    :swatch-colors="null"
    :show-primary-color-preview="false"
    :select-input-props="{ popupProps: { attach: handleAttach } }"
    @change="handleChange"
    v-bind="$attrs"
  />
</template>

<script setup>
import { ColorPickerPanel as TColorPickerPanel } from 'tdesign-vue-next';
import { handleAttach } from '../../utils';

const props = defineProps({
  value: String,
  format: {
    type: String,
    default: 'HEX',
  },
});

const emit = defineEmits(['change']);

function handleChange(value) {
  emit('change', value);
}
</script>

<style lang="less" scoped>
.t-color-picker__format {
  display: flex;
  margin: 12px 0 0 0;
  :deep(.t-select) {
    width: 72px;
    font-size: 14px;
  }
  :deep(.t-input) {
    font-size: 14px;
  }
  :deep(.t-select__wrap) {
    width: auto;
    margin-right: 8px;
  }
}
.t-color-picker__body {
  padding: 8px 4px;
}
</style>
