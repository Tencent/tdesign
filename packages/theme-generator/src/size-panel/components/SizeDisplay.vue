<template>
  <div>
    <div class="size-panel__token-list">
      <div
        v-for="(item, index) in tokenList"
        :key="index"
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }"
      >
        <span><SectionDynamicSvg :size="parseInt(item.value, 10)" /></span>
        <span>{{ item.token.replace('--td-', '') }} : {{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getTokenValue } from '@/common/utils';
import { themeStore } from '@/common/themes';
import { SIZE_TOKENS } from '../built-in/size-map';
import SectionDynamicSvg from '../svg/SectionDynamicSvg.vue';

defineOptions({ name: 'SizeDisplay' });

const refreshKey = ref(0);

onMounted(() => {
  nextTick(() => {
    // 初始化 local 的 token 后更新 size 显示
    refreshKey.value++;
  });
});

watch(
  () => themeStore.sizeRefreshId,
  () => {
    refreshKey.value++;
  },
);

const tokenList = computed(() => {
  refreshKey.value;
  return SIZE_TOKENS.map((token) => ({ token, value: getTokenValue(token) }));
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
