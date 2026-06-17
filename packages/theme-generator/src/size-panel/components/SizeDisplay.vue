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
import { onMounted, onBeforeUnmount } from 'vue';
import { getTokenValue } from '@/common/utils';
import emitter from '@/common/event-bus';
import { SIZE_TOKENS } from '../built-in/size-map';
import SectionDynamicSvg from '../svg/SectionDynamicSvg.vue';

// refreshKey 原本用于强制重渲染，但模板中未绑定 :key，
// 实际重渲染由父组件 refreshId 变化驱动，此处仅监听事件以同步 token 值
function onRefreshSizeTokens() {
  // 事件触发时 getTokenValue 读取最新 DOM 值，下次渲染自动反映变化
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
