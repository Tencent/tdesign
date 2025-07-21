<template>
  <t-color-picker-panel
    v-model="color"
    format="HEX"
    :color-modes="['monochrome']"
    :recent-colors="null"
    :swatch-colors="null"
    :show-primary-color-preview="false"
    :popup-props="{ attach: handleAttach }"
    @change="handleChange"
  />
</template>

<script>
import { ColorPickerPanel as TColorPickerPanel } from 'tdesign-vue';
import { handleAttach } from '../../utils';

export default {
  name: 'ColorPicker',
  components: {
    TColorPickerPanel,
  },
  props: {
    value: String,
  },
  emit: ['change'],
  data() {
    return {
      color: this.value,
    };
  },
  methods: {
    handleAttach,
    handleChange(value) {
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="less" scoped>
.t-color-picker__format {
  display: flex;
  margin: 12px 0 0 0;
  /deep/ .t-select {
    width: 72px;
    font-size: 14px;
  }
  /deep/ .t-input {
    font-size: 14px;
  }
  /deep/ .t-select__wrap {
    width: auto;
    margin-right: 8px;
  }
}
.t-color-picker__body {
  padding: 8px 4px;
}
</style>
