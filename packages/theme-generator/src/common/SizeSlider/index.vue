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
<script>
import { Slider as TSlider, InputNumber as TInputNumber } from "tdesign-vue";
import { handleAttach } from "../../common/utils";

export default {
  props: {
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
  },
  components: {
    TSlider,
    TInputNumber,
  },
  emit: ["changeFontSize"],
  data() {
    return {
      size: null,
    };
  },
  methods: {
    format(val) {
      return `${val}px`;
    },
    handleAttach,
    handleInputChange(v) {
      if (
        v < this.min ||
        v > this.max ||
        this.disabled ||
        (this.needInteger && !Number.isInteger(Number(v)))
      )
        return;
      this.size = v;
      this.$emit("changeFontSize", v);
    },
  },
  mounted() {
    this.size = this.needInteger
      ? parseInt(this.sizeValue, 10)
      : this.sizeValue;
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
