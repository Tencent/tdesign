<template>
  <div :style="{ display: 'flex' }">
    <div class="segment-panel__round" :class="{ disabled: disabled }">
      <div class="segment-panel__round-tag">
        <slot name="left"></slot>
      </div>
      <div class="segment-panel__round-slider">
        <div
          v-for="(v, i) in selectOptions.slice(0, 5)"
          :key="i"
          class="slider-split"
          :style="{
            opacity: i == 0 || i === selectOptions.length - 1 ? 0 : 1,
          }"
        ></div>
        <t-slider
          :min="1"
          :disabled="disabled"
          :max="5"
          :value="step"
          @change="handleSliderChange"
          :label="suspendedLabels[step]"
        ></t-slider>
      </div>
      <div class="segment-panel__round-tag">
        <slot name="right"></slot>
      </div>
    </div>
    <t-select
      class="segment-panel__select"
      :options="innerSelectOptions"
      @change="handleSelectChange"
      :onVisibleChange="handleVisibleChange"
      :keys="isEn ? { label: 'enLabel' } : null"
      v-model="step"
      :popup-props="{ attach: handleAttach }"
    ></t-select>
  </div>
</template>

<script>
import { Slider as TSlider, Select as TSelect } from "tdesign-vue";
import { handleAttach } from "../../common/utils";
import langMixin from "../i18n/mixin";
export default {
  name: "SegmentSelection",
  components: {
    TSlider,
    TSelect,
  },
  mixins: [langMixin],
  props: {
    selectOptions: {
      type: Array,
      required: true,
      default: () => [],
    },
    suspendedLabels: {
      type: Object,
      required: false,
      default: () => {},
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      step: this.value,
      innerSelectOptions: this.selectOptions,
    };
  },
  watch: {
    step(newStep) {
      this.$emit("input", newStep);
    },
    disabled(val) {
      if (val) {
        this.step = Number(this.selectOptions.find((v) => v.disabled).value);
      }
    },
  },
  methods: {
    handleAttach,
    handleSelectChange() {
      this.$emit("enable");
    },
    handleVisibleChange(val) {
      if (val && this.disabled) {
        this.innerSelectOptions = this.selectOptions;
        return;
      }
    },
    handleSliderChange(v) {
      if (this.disabled) return;
      this.step = v;
    },
  },
};
</script>

<style lang="less" scoped>
.segment-panel {
  &__round {
    display: flex;
    height: 32px;
    > div {
      display: flex;
      background-color: var(--bg-color-theme-secondary);
      margin-right: 2px;
      align-items: center;
      justify-content: center;
    }
    &-tag {
      height: 100%;
      width: 32px;
      color: var(--text-primary);
      position: relative;
      &:first-child {
        border-radius: 9px 0px 0px 9px;
      }
      &:last-child {
        border-radius: 0px 9px 9px 0px;
        margin-right: 0;
      }
    }
    &-slider {
      width: 76px;
      padding: 6px;
      position: relative;
      display: flex;
      justify-content: space-between !important;
      .slider-split {
        background-color: var(--bg-color-theme-secondary);
        width: 2px;
        height: 8px;
        z-index: 2;
      }
      /deep/ .t-slider__container {
        position: absolute;
        top: 6px;
        width: 60px;
        left: 8px;
      }

      /deep/ .t-slider {
        padding: 6px 0;
      }

      /deep/ .t-slider__rail {
        height: 8px;
        background-color: var(--bg-color-theme-tertiary);
      }
      /deep/ .t-slider__track {
        height: 8px;
      }
      /deep/ .t-slider__button {
        box-shadow: var(--shadow-1);
      }
    }

    &.disabled {
      /deep/ .t-slider__button {
        border-color: var(--bg-color-tag);
        background-color: var(--bg-color-theme-surface);
      }
    }
  }
  &__select {
    text-align: center;
    padding: 0;
    margin-left: 8px;
    width: 82px;
    /deep/ .t-input {
      background: var(--bg-color-theme-secondary);
      border: 1px solid transparent;
      height: 32px;
      border-radius: 9px;
      padding: 0px 8px;
      transition: border-color 0.2s;
      font-size: 14px;
    }
    /deep/ .t-select {
      font-size: 14px;
    }
    /deep/ .t-select:hover {
      border-color: var(--component-border);
    }
    /deep/ .t-is-active {
      border-color: var(--brand-main) !important;
    }
    /deep/ .t-select__right-icon {
      color: var(--text-placeholder) !important;
    }

    /deep/ .t-select__single {
      margin-left: 0;
    }
  }
}

</style>
