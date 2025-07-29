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
<script lang="jsx">
import { getTokenValue } from '../../common/utils';
import { SIZE_TOKENS } from '../built-in/size-map';
import SectionDynamicSvg from '../svg/SectionDynamicSvg.vue';

export default {
  name: 'SizeDisplay',
  components: {
    SectionDynamicSvg,
  },
  data() {
    return {
      SIZE_TOKENS,
    };
  },
  methods: {
    getTokenValue,
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化 local 的 token 后更新 size 显示
      this.$forceUpdate();
    });
    this.$root.$on('refresh-size-tokens', () => {
      this.$forceUpdate();
    });
  },
};
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
