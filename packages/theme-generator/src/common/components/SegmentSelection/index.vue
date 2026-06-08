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
          :tooltip-props="{ attach: handleAttach }"
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
      :on-visible-change="handleVisibleChange"
      :keys="isEn ? { label: 'enLabel' } : null"
      v-model="step"
      :popup-props="{ attach: handleAttach }"
    ></t-select>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Select as TSelect, Slider as TSlider } from 'tdesign-vue-next';

import { useLang } from '@/common/i18n';
import { handleAttach } from '@/common/utils';

const props = defineProps({
  selectOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  suspendedLabels: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'enable']);

const { isEn } = useLang();

const step = ref(props.modelValue);
const innerSelectOptions = ref(props.selectOptions);

// 获取倒数第二个选项的 value 作为 Slider 的最大值（忽略自定义）
const maxSliderValue = computed(() => {
  if (props.selectOptions.length < 2) return 1;
  return props.selectOptions[props.selectOptions.length - 2].value;
});

const sliderValue = computed(() => {
  // 如果 step 超过 max（自定义选项），依旧显示 max 值
  return step.value > maxSliderValue.value ? maxSliderValue.value : step.value;
});

watch(
  () => props.modelValue,
  (val) => {
    step.value = val;
  },
);

watch(step, (newStep) => {
  emit('update:modelValue', newStep);
});

watch(
  () => props.disabled,
  (val) => {
    if (val) {
      step.value = Number(props.selectOptions.find((v) => v.disabled).value);
    }
  },
);

function handleSelectChange() {
  emit('enable');
}
function handleVisibleChange(val) {
  if (val && props.disabled) {
    innerSelectOptions.value = props.selectOptions;
    return;
  }
}
function handleSliderChange(v) {
  if (props.disabled) return;
  step.value = v;
}
function renderLabel() {
  return props.suspendedLabels[step.value];
}
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
      :deep(.t-slider__container) {
        position: absolute;
        top: 6px;
        width: 60px;
        left: 8px;
      }

      :deep(.t-slider) {
        padding: 6px 0;
      }

      :deep(.t-slider__rail) {
        height: 8px;
        background-color: var(--bg-color-theme-tertiary);
      }
      :deep(.t-slider__track) {
        height: 8px;
      }
      :deep(.t-slider__button) {
        box-shadow: var(--shadow-1);
      }
    }

    &.disabled {
      :deep(.t-slider__button) {
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
    :deep(.t-input) {
      background: var(--bg-color-theme-secondary);
      border: 1px solid transparent;
      height: 32px;
      border-radius: 9px;
      padding: 0px 8px;
      transition: border-color 0.2s;
      font-size: 14px;
    }
    :deep(.t-select) {
      font-size: 14px;
    }
    :deep(.t-select:hover) {
      border-color: var(--component-border);
    }
    :deep(.t-is-active) {
      border-color: var(--brand-main) !important;
    }
    :deep(.t-select__right-icon) {
      color: var(--text-placeholder) !important;
    }

    :deep(.t-select__single) {
      margin-left: 0;
    }
  }
}
</style>
