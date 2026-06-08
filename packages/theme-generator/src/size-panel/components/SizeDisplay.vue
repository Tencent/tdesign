<template>
  <div>
    <div class="size-panel__token-list">
      <div
        v-for="(token, index) in SIZE_TOKENS"
        :key="index"
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }"
      >
        <span><SectionDynamicSvg :size="parseInt(getTokenValue(token), 10)" /></span>
        <span>{{ token.replace('--td-', '') }} : {{ getTokenValue(token) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getTokenValue } from '@/common/utils';
import emitter from '@/common/event-bus';
import { SIZE_TOKENS } from '../built-in/size-map';
import SectionDynamicSvg from '../svg/SectionDynamicSvg.vue';

// Use a reactive key to force re-render instead of $forceUpdate
const refreshKey = ref(0);

onMounted(() => {
  nextTick(() => {
    refreshKey.value++;
  });
  emitter.on('refresh-size-tokens', () => {
    refreshKey.value++;
  });
});

onBeforeUnmount(() => {
  emitter.off('refresh-size-tokens');
});
</script>

<style lang="less" scoped>
.size-panel {
  &__token-list {
    width: 236px;
    background-color: var(--bg-color-theme-secondary);
    margin-top: 8px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    padding: 8px;
    font-size: 12px;
    border-radius: 9px;
  }
}
</style>
