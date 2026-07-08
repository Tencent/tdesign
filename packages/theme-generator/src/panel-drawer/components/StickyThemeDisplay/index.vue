<template>
  <div class="sticky-theme" :style="stickyThemeStyle">
    <div class="theme-status"></div>
    <div v-if="isAnimating" class="theme-status color-transition"></div>
    <div class="theme-text">
      <p class="theme-text-title">{{ isEn ? $theme.enName : $theme.name }}</p>
      <p class="theme-text-subtitle">{{ $theme.subtitleText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useLang } from '@/common/i18n';
import { themeStore } from '@/common/themes';

defineOptions({ name: 'StickyThemeDisplay' });

const props = defineProps({
  top: Number,
  theme: {
    type: Object,
  },
});

const { isEn } = useLang();

const isAnimating = ref(false);

const $theme = computed(() => themeStore.theme);

const stickyThemeStyle = computed(() => {
  return {
    top: `${props.top}px`,
  };
});

// 监听 themeStore.brandColor 变化触发过渡动画。
// --brand-main 现设置在 Shadow Host 上（store.updateBrandColor），
// 不再设置 document.documentElement，故改用响应式 store 而非 MutationObserver。
watch(
  () => themeStore.brandColor,
  (newColor, oldColor) => {
    if (!newColor || newColor === oldColor) return;
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 1000);
  },
);
</script>

<style scoped lang="less">
.sticky-theme {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  left: 0;
}

.theme-status {
  position: absolute;
  background-color: var(--brand-main);
  transition: background-color 1s ease;
  width: 332px;
  height: 72px;
  padding: 8px 12px;
  border-radius: 12px;
  z-index: 0;
  inset: 0;
}

.theme-text {
  width: 100%;
  padding: 2px 8px;
  z-index: 1;

  &-title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px 0;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }

  &-subtitle {
    font-size: 14px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
  }
}

.color-transition {
  animation: prev-to-current 1s ease;
}

@keyframes prev-to-current {
  from {
    clip-path: polygon(0 0, 0 0, calc(tan(8deg) * -100vh) 100%, calc(tan(8deg) * -100vh) 100%);
  }

  to {
    clip-path: polygon(0 0, calc((tan(8deg) * 100vh) + 100%) 0, 100% 100%, calc(tan(8deg) * -100vh) 100%);
  }
}
</style>
