<template>
  <div class="panel__size-slider">
    <div>{{ title }}</div>
    <div class="panel__size-slider-op">
      <t-input-number
        :disabled="disabled"
        :value="size"
        :format="format"
        theme="column"
        @change="handleInputChange"
        :style="{ marginBottom: '8px' }"
      />
      <t-slider
        :disabled="disabled"
        :value="size"
        :min="min"
        :max="max"
        :step="step"
        @change="handleInputChange"
        :tooltipProps="{
          attach: handleAttach,
        }"
      ></t-slider>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { InputNumber as TInputNumber, Slider as TSlider } from 'tdesign-vue';
import { handleAttach } from '../../common/utils';

const props = defineProps({
  sizeValue: [String, Number],
  title: String,
  step: Number,
  min: Number,
  max: Number,
  disabled: Boolean,
  needInteger: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['changeFontSize']);

// Data
const size = ref(null);

// Methods
const format = (val) => {
  return `${val}px`;
};

const handleInputChange = (v) => {
  if (
    v === size.value ||
    v < props.min ||
    v > props.max ||
    props.disabled ||
    (props.needInteger && !Number.isInteger(Number(v)))
  )
    return;
  size.value = v;
  emit('changeFontSize', v);
};

// Lifecycle hooks
onMounted(() => {
  size.value = props.needInteger ? parseInt(props.sizeValue, 10) : props.sizeValue;
});
</script>
<style lang="less" scoped>
.panel {
  &__size-slider {
    border-radius: 9px;
    padding: 8px 8px 12px 8px;
    font-size: 14px;
    &-op {
      width: 108px;
      margin-top: 4px;
      padding: 8px;
      border-radius: 6px;
      background-color: var(--bg-color-code);
    }
  }
  /deep/ .t-input-number {
    font-size: 14px !important;
  }
}
</style>
