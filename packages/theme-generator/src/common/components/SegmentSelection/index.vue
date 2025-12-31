<template>
  <div :style="{ display: 'flex' }">
    <div class="segment-panel__round" :class="{ disabled: disabled }">
      <div class="segment-panel__round-tag">
        <slot name="left"></slot>
      </div>
      <div class="segment-panel__round-slider">
        <!-- 自定义选项不放入 Slider -->
        <div
          v-for="(_, i) in selectOptions.slice(0, selectOptions.length - 1)"
          :key="i"
          class="slider-split"
          :style="{
            opacity: i == 0 || i === selectOptions.length - 1 ? 0 : 1,
          }"
        ></div>
        <t-slider
          :min="1"
          :disabled="disabled"
          :max="maxSliderValue"
          :value="sliderValue"
          @change="handleSliderChange"
          :label="renderLabel"
          :tooltipProps="{ attach: handleAttach }"
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
import { Select as TSelect, Slider as TSlider } from 'tdesign-vue';

import { langMixin } from '@/common/i18n';
import { handleAttach } from '@/common/utils';

export default {
  name: 'SegmentSelection',
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
  computed: {
    // 获取倒数第二个选项的 value 作为 Slider 的最大值（忽略自定义）
    maxSliderValue() {
      if (this.selectOptions.length < 2) return 1;
      return this.selectOptions[this.selectOptions.length - 2].value;
    },
    sliderValue() {
      // 如果 step 超过 max（自定义选项），依旧显示 max 值
      return this.step > this.maxSliderValue ? this.maxSliderValue : this.step;
    },
  },
  watch: {
    value(val) {
      this.step = val;
    },
    step(newStep) {
      this.$emit('input', newStep);
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
      this.$emit('enable');
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
    renderLabel() {
      return this.suspendedLabels[this.step];
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
