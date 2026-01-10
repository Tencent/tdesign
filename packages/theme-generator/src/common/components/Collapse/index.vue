<template>
  <collapse-base variant="default">
    <template #icon>
      <slot name="round"></slot>
    </template>
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #subTitle>
      <slot name="subTitle"></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
  </collapse-base>
</template>

<script>
import CollapseBase from '../CollapseBase/index.vue';

/**
 * 通用展开/收起组件
 * 基于 CollapseBase 的简单包装
 */
export default {
  name: 'CommonCollapse',
  components: { CollapseBase },
};
</script>
