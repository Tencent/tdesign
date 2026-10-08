<template>
  <span :class="_class" :style="_style">
    <img v-if="!error && imgSrc" :src="imgSrc" alt="user avatar" @error="onError" />
    <div class="tdesign-avatar-name">{{ username }}</div>
  </span>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CSSProperties } from 'vue';

interface AvatarProps {
  type?: 'square' | 'round';
  size?: 'large' | 'default' | 'small';
  username?: string;
  src?: string;
  width?: string | number;
  height?: string | number;
}

function getSrc(username?: string, src?: string): string {
  if (username) {
    return `https://dayu.woa.com/avatars/${username}/profile.jpg`;
  }

  return src || '';
}

const props = withDefaults(defineProps<AvatarProps>(), {
  type: 'round',
  size: 'default',
});

const prefixCls = 'tdesign-avatar';
const error = ref(false);
const imgSrc = computed(() => getSrc(props.username, props.src));
const _class = computed(() => [
  prefixCls,
  {
    [`${prefixCls}__lg`]: props.size === 'large',
    [`${prefixCls}__square`]: props.type === 'square',
    [`${prefixCls}__default`]: error.value || !imgSrc.value,
  },
]);
const _style = computed<CSSProperties>(() => {
  if (!props.width) return {};
  return {
    width: `${props.width}px`,
    height: `${props.width}px`,
  };
});

function onError(_event: Event): void {
  error.value = true;
}
</script>

<style lang="less">
.tdesign-avatar {
  display: inline-block;
  width: 34px;
  height: 34px;
  border: 1px solid #eee;
  line-height: 0;
  vertical-align: middle;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  &-name {
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: center;
    width: 100%;
  }

  &__default {
    background: url(http://tdesign.gtimg.com/docs/male.png) no-repeat center;
    background-size: 100%;
  }

  &__lg {
    width: 40px;
    height: 40px;
  }

  &__square {
    border-radius: 0;
  }
}
</style>
