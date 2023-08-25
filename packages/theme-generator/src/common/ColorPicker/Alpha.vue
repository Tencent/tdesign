<template>
  <color-slider
    :class="[`t-color-picker__alpha`, `t-color-picker--bg-alpha`]"
    :color="color"
    :value="color.alpha * 100"
    @change="handleValueChange"
    :rail-style="railStyle"
    :max-value="100"
  />
</template>
<script>
import ColorSlider from "./Slider.vue";

export default {
  name: "AlphaSlider",
  components: {
    ColorSlider,
  },
  inheritAttrs: false,
  props: {
    color: Object,
  },
  emit:['change'],
  computed: {
    railStyle() {
      return {
        background: `linear-gradient(to right, rgba(0, 0, 0, 0), ${this.color.rgba})`,
      };
    },
  },
  methods: {
    handleValueChange(v, isDragEnd) {
      this.$emit('change',v / 100, isDragEnd);
    },
  },
};
</script>
<style lang="less" scoped>

.t-color-picker--bg-alpha {
  background-color: #fff;
  background-image: linear-gradient(45deg, #c5c5c5 25%, transparent 0, transparent 75%, #c5c5c5 0, #c5c5c5), linear-gradient(45deg, #c5c5c5 25%, transparent 0, transparent 75%, #c5c5c5 0, #c5c5c5);
  background-size: 6px 6px;
  background-position: 0 0, 3px 3px;
}
.t-color-picker__alpha .t-color-picker__rail {
  background: -webkit-gradient(linear, left top, right top, from(transparent), to(currentcolor));
  background: linear-gradient(to right, transparent, currentcolor);
}
</style>