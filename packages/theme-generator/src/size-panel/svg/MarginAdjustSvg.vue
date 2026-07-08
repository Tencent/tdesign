<template>
  <svg width="16" :height="viewHeight" :viewBox="`0 0 16 ${viewHeight}`" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="8" rx="3" fill="#D54941" fill-opacity="0.2" />
    <rect x="6" y="8" width="4" height="2" fill="#F78D94" />
    <rect x="7" y="10" width="2" :height="height" fill="#F78D94" />
    <rect x="6" :y="10 + height" width="4" height="2" fill="#F78D94" />
    <rect :y="12 + height" width="16" height="8" rx="3" fill="#D54941" fill-opacity="0.2" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 2,
  },
});

const height = computed(() => {
  return Math.min(parseInt(props.size, 10), 12);
});

const viewHeight = computed(() => {
  return Math.min(20 + height.value, 36);
});
</script>
