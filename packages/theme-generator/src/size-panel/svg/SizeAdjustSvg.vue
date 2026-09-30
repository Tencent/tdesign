<template>
  <svg width="8" :height="height" :viewBox="`0 0 8 ${height}`" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="8" :height="height" rx="3" fill="#F78D94" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 16,
  },
);

const height = computed(() => {
  return Math.min(parseInt(String(props.size), 10) / 2, 80);
});
</script>
