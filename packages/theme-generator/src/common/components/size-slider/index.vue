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
import { ref, computed, watch, onMounted, nextTick } from 'vue';
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
// TSlider / InputNumber 挂载时会各自派发一次 change（值为组件内部初始值，如 0），
// 这类非用户操作的事件必须忽略，否则会把尺寸误改成错误值（如字体大小被改成 0px）。
let ready = false;

// TSlider 的类型只接受 number，但运行时与 InputNumber 共用 size（可能是字符串）
const sliderValue = computed(() => size.value as number | undefined);

function format(val: number | string | null | undefined) {
  return val == null ? '' : `${val}px`;
}

function handleInputChange(rawValue: InputNumberValue | SliderValue) {
  const v = (Array.isArray(rawValue) ? rawValue[0] : rawValue) as number | string;
  // 初始化阶段由子组件派发的 change 直接忽略（避免把尺寸误改成组件内部初始值）
  if (!ready) return;
  // min/max 未传入时不参与边界校验（与原实现 `v < undefined` 恒为 false 的语义一致）
  if (
    v === size.value ||
    (props.min != null && Number(v) < props.min) ||
    (props.max != null && Number(v) > props.max) ||
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
  // 等挂载阶段的初始 change 事件派发完再开启用户交互
  nextTick(() => {
    ready = true;
  });
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
