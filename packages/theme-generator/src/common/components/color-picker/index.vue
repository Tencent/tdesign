<template>
  <t-color-picker-panel
    v-model="color"
    :format="format"
    :color-modes="['monochrome']"
    :recent-colors="undefined"
    :swatch-colors="undefined"
    :show-primary-color-preview="false"
    :select-input-props="{ popupProps: { attach: handleAttach } }"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ColorPickerPanel as TColorPickerPanel } from 'tdesign-vue-next/lib';
import { handleAttach } from '../../utils';

defineOptions({ name: 'ColorPicker', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    value?: string;
    format?: 'HEX' | 'HEX8' | 'RGB' | 'RGBA' | 'HSL' | 'HSLA' | 'HSV' | 'HSVA' | 'CMYK' | 'CSS';
  }>(),
  {
    format: 'HEX',
  },
);

const emit = defineEmits<{ change: [value: string] }>();

const color = ref(props.value);

watch(
  () => props.value,
  (val) => {
    color.value = val;
  },
);

function handleChange(value: string) {
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
