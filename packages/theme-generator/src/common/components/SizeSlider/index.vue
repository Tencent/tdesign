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
        :value="sliderValue"
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

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { handleAttach } from '@/common/utils';
import { InputNumber as TInputNumber, Slider as TSlider } from 'tdesign-vue-next/lib';

type SliderValue = number | number[];
type InputNumberValue = number | string;

defineOptions({ name: 'SizeSlider' });

const props = withDefaults(
  defineProps<{
    sizeValue?: string | number;
    title?: string;
    step?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
    needInteger?: boolean;
  }>(),
  {
    needInteger: true,
  },
);

const emit = defineEmits<{ changeSize: [v: number | string] }>();

const size = ref<number | string | undefined>(undefined);

// TSlider 的类型只接受 number，但运行时与 InputNumber 共用 size（可能是字符串）
const sliderValue = computed(() => size.value as number | undefined);

function format(val: number | string | null | undefined) {
  return val == null ? '' : `${val}px`;
}

function handleInputChange(rawValue: InputNumberValue | SliderValue) {
  const v = (Array.isArray(rawValue) ? rawValue[0] : rawValue) as number | string;
  if (
    v === size.value ||
    Number(v) < (props.min ?? 0) ||
    Number(v) > (props.max ?? 0) ||
    props.disabled ||
    (props.needInteger && !Number.isInteger(Number(v)))
  )
    return;
  size.value = v;
  emit('changeSize', v);
}

// 外部 sizeValue 变化时同步（父组件 refreshId 变更后重读 token 值）
watch(
  () => props.sizeValue,
  (val) => {
    size.value = props.needInteger ? parseInt(String(val), 10) : (val as number);
  },
);

onMounted(() => {
  size.value = props.needInteger ? parseInt(String(props.sizeValue), 10) : (props.sizeValue as number);
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
  :deep(.t-input-number) {
    font-size: 14px !important;
  }
}
</style>
