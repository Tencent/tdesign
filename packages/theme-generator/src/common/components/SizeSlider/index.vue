<template>
  <div class="panel__size-slider">
    <div>{{ title }}</div>
    <div class="panel__size-slider-op">
      <t-input-number
        :disabled="disabled"
        :value="size"
        :format="format"
        theme="column"
        :style="{ marginBottom: '8px' }"
        @change="handleInputChange"
      />
      <t-slider
        :disabled="disabled"
        :value="size"
        :min="min"
        :max="max"
        :step="step"
        :tooltip-props="{
          attach: handleAttach,
        }"
        @change="handleInputChange"
      ></t-slider>
    </div>
  </div>
</template>
<script>
import { handleAttach } from '@/common/utils';
import { InputNumber as TInputNumber, Slider as TSlider } from 'tdesign-vue';

export default {
  name: 'SizeSlider',
  components: {
    TSlider,
    TInputNumber,
  },
  props: {
    sizeValue: {
      type: [String, Number],
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    needInteger: {
      type: Boolean,
      default: true,
    },
  },
  emit: ['changeSize'],
  data() {
    return {
      size: null,
    };
  },
  mounted() {
    this.size = this.needInteger ? parseInt(this.sizeValue, 10) : this.sizeValue;
  },
  methods: {
    format(val) {
      return `${val}px`;
    },
    handleAttach,
    handleInputChange(v) {
      if (
        v === this.size ||
        v < this.min ||
        v > this.max ||
        this.disabled ||
        (this.needInteger && !Number.isInteger(Number(v)))
      )
        return;
      this.size = v;
      this.$emit('changeSize', v);
    },
  },
};
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
