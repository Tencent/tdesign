<template>
  <div class="shadow-layer__card">
    <div class="shadow-layer__title">
      <div class="shadow-layer__name">{{ name }}</div>
      <remove-icon class="shadow-layer__remove" @click="handleMove" />
    </div>
    <div class="shadow-layer__card--item">
      <t-input-number theme="normal" auto-width v-model="shadow[0]" class="shadow-layer__card--x" placeholder="0px">
        <template #suffix><div class="shadow-layer__suffix">X</div></template>
      </t-input-number>
      <t-input-number theme="normal" auto-width v-model="shadow[1]" class="shadow-layer__card--x" placeholder="0px">
        <template #suffix><div class="shadow-layer__suffix">Y</div></template>
      </t-input-number>
    </div>
    <t-input-number auto-width theme="normal" v-model="shadow[2]" class="shadow-layer__card--item" placeholder="0px">
      <template #suffix><div class="shadow-layer__suffix">Blur</div></template>
    </t-input-number>
    <t-input-number auto-width theme="normal" v-model="shadow[3]" class="shadow-layer__card--item" placeholder="0px">
      <template #suffix><span class="shadow-layer__suffix">Spread</span></template>
    </t-input-number>
    <t-popup class="placement top center" placement="left" show-arrow destroy-on-close :attach="handleAttach">
      <t-input v-model="color">
        <template #prefix-icon>
          <div class="shadow-layer__card--sharp" :style="{ background: color }"></div>
        </template>
      </t-input>
      <template #content>
        <color-picker :value="color" enable-alpha format="RGBA" @change="changeColor" />
      </template>
    </t-popup>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RemoveIcon } from 'tdesign-icons-vue-next';
import { Input as TInput, InputNumber as TInputNumber, Popup as TPopup } from 'tdesign-vue-next';

import { ColorPicker } from '@/common/components';
import { handleAttach } from '@/common/utils';

const props = defineProps({
  name: String,
  value: String,
});

const emit = defineEmits(['change', 'move']);

const shadow = ref([0, 0, 0, 0]);
const color = ref('');
const hasInit = ref(false);

// init
shadow.value = splitShadowValue(props.value);
color.value = getShadowColor(props.value);

watch(
  shadow,
  (nVal) => {
    if (!hasInit.value) {
      return;
    }
    const shadowStr = nVal.map((val) => `${val}px`).join(' ');
    emit('change', `${shadowStr} ${color.value}`);
  },
  { deep: true },
);

watch(color, (nVal) => {
  if (!hasInit.value) {
    hasInit.value = true;
    return;
  }
  const shadowStr = shadow.value.map((val) => `${val}px`).join(' ');
  emit('change', `${shadowStr} ${nVal}`);
});

function splitShadowValue(value) {
  const data = value.match(/(-)?[0-9]+(px)?/g);
  if (!data || data.length < 2) {
    console.log(`invalid shadow value ${value}`);
    return [0, 0, 0, 0];
  }
  return data
    .concat([0, 0])
    .splice(0, 4)
    .map((val) => {
      const num = val.match(/(-)?[0-9]+/g);
      if (num.length < 1) return 0;
      try {
        return Number(num[0]);
      } catch (error) {
        console.log(`invalid shadow value ${value}`);
        return 0;
      }
    });
}

function getShadowColor(value) {
  const data = value.match(/rgb(a)?(.*)/g);
  if (!data || data.length < 1) {
    console.log(`invalid shadow value ${value}`);
    return 'rgba(0, 0, 0, 0)';
  }
  return data[0].trim();
}

function changeColor(hex) {
  color.value = hex;
}

function handleMove() {
  emit('move');
}
</script>

<style lang="less">
.shadow-layer {
  display: flex;
  flex-direction: column;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    &--name {
      font-size: 14px;
      color: var(--text-primary);
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    }
  }
  &__remove {
    color: var(--text-primary);
    cursor: pointer;
  }
  &__card {
    padding: 8px;
    width: 208px;
    background: var(--bg-color-code);
    border-radius: 6px;
    &--item {
      display: flex;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      .t-input--auto-width {
        width: auto;
      }
    }
    &--x {
      width: 60px;
      margin-right: 8px;
      width: 50%;
      &:last-child {
        margin-right: 0;
      }
    }
    &--sharp {
      width: 24px;
      height: 24px;
      border: 1px solid var(--bg-color-demo-select);
      border-radius: 3px;
    }
    &--color {
      margin-left: 4px;
      font-size: 14px;
      line-height: 22px;
      color: var(--text-primary);
    }
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  &__name {
    font-family: 'SF Mono';
    font-size: 12px;
    color: var(--text-primary);
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
  &__suffix {
    font-size: 14px;
    color: var(--text-placeholder);
  }
}
</style>
