<template>
  <div class="t-color-picker__panel" ref="refPanel">
    <div class="t-color-picker__body">
      <saturation-block :color="color" @change="handleChange" />
      <slider-block
        :color="color"
        @change="handleSliderChange"
        :value="color.hue"
      />
      <alpha-block
        v-if="enableAlpha"
        :color="color"
        @change="handleAlphaChange"
      />
      <div class="t-color-picker__format">
        <t-select
          :options="
            enableAlpha
              ? [{ value: 'rgb', label: 'RGBA' }]
              : [
                  { value: 'rgb', label: 'RGB' },
                  { value: 'hex', label: 'HEX' },
                ]
          "
          v-model="format"
          @change="handleChangeFormat"
        />
        <t-input @blur="handleInputChange" v-model="inputValue" />
      </div>
    </div>
  </div>
</template>
<script>
import { Color as TVColor } from "tvision-color";
import { Input as TInput, Select as TSelect } from "tdesign-vue";
import SaturationBlock from "./Saturation.vue";
import SliderBlock from "./Slider.vue";
import AlphaBlock from "./Alpha.vue";

import { Color, getColorObject } from "../utils";

const DEFAULT_COLOR = "#001F97";
export default {
  name: "ColorPicker",
  components: {
    SaturationBlock,
    SliderBlock,
    AlphaBlock,
    TInput,
    TSelect,
  },
  props: {
    value: String,
    enableAlpha: Boolean,
  },
  emit: ["change"],
  data() {
    return {
      color: {},
      format: this.enableAlpha ? "rgb" : "hex",
      inputValue: "",
    };
  },
  methods: {
    handleAlphaChange(alpha) {
      this.color.alpha = alpha;
      const { rgba } = getColorObject(this.color);
      this.inputValue = rgba;
      this.$emit("change", rgba);
    },
    handleSliderChange(hue) {
      this.color.hue = hue;
      const { hex, rgb, rgba } = getColorObject(this.color);
      if (this.enableAlpha) {
        this.inputValue = rgba;
        this.$emit("change", rgba);
      } else {
        this.inputValue = this.format === "hex" ? hex : rgb;
        this.$emit("change", hex);
      }
    },
    handleChangeFormat(v) {
      if (v === "hex") {
        const hex = TVColor.colorTransform(this.inputValue, "rgb", "hex");
        this.inputValue = hex;
      } else {
        const rgb = TVColor.colorTransform(this.inputValue, "hex", "rgb");
        this.inputValue = `rgb(${rgb.join(",")})`;
      }
    },
    handleInputChange(v) {
      const newColor = new Color(v);
      this.color = newColor;

      this.$emit("change", v);
    },
    handleChange({ saturation, value }) {
      const { saturation: sat, value: val } = this.color;
      if (value !== val && saturation !== sat) {
        this.color.saturation = saturation;
        this.color.value = value;
      } else if (saturation !== sat) {
        this.color.saturation = saturation;
      } else if (value !== val) {
        this.color.value = value;
      } else {
        return;
      }
      const { hex, rgb } = getColorObject(this.color);
      this.inputValue = this.format === "hex" ? hex : rgb;

      this.$emit("change", this.inputValue);
    },
  },
  mounted() {
    this.color = new Color(this.value || DEFAULT_COLOR);
    if (this.enableAlpha) {
      this.inputValue = this.color.rgba;
    } else {
      this.inputValue = this.format === "hex" ? this.color.hex : this.color.rgb;
    }
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
