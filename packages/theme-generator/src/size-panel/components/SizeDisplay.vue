<template>
  <div :key="refreshKey">
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getTokenValue } from '@/common/utils';
import emitter from '@/common/event-bus';
import { SIZE_TOKENS } from '../built-in/size-map';
import SectionDynamicSvg from '../svg/SectionDynamicSvg.vue';

// Vue 3 <script setup> 中，只有模板中实际读取的 ref 才会触发重渲染
// refreshKey 绑定在根元素 :key 上，值变化时强制组件重渲染，
// 确保 getTokenValue() 读取的最新 DOM 值能反映到 UI
const refreshKey = ref(0);

function onRefreshSizeTokens() {
  refreshKey.value++;
}

onMounted(() => {
  emitter.on('refresh-size-tokens', onRefreshSizeTokens);
});

onBeforeUnmount(() => {
  emitter.off('refresh-size-tokens', onRefreshSizeTokens);
});
</script>

<style lang="less">
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
