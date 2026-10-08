<template>
  <div ref="listWrapper" class="component-list">
    <div class="lottie-wrapper td-light">
      <video
        ref="lightVideoRef"
        width="2560"
        height="296"
        autoplay
        loop
        muted
        defaultMuted
        playsinline
        x5-playsinline
        webkit-playsinline
        x5-video-player
        preload="auto"
      >
        <source :src="lightVideo" type="video/mp4" />
      </video>
    </div>

    <div class="lottie-wrapper td-dark">
      <video
        ref="darkVideoRef"
        width="2560"
        height="296"
        autoplay
        loop
        muted
        defaultMuted
        playsinline
        x5-playsinline
        webkit-playsinline
        x5-video-player
        preload="auto"
      >
        <source :src="darkVideo" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { ThemeMode } from '@/pages/types';

const props = withDefaults(defineProps<{ themeMode?: ThemeMode }>(), {
  themeMode: 'light',
});

const lightVideo = 'https://tdesign.gtimg.com/site/images/component-light.mp4';
const darkVideo = 'https://tdesign.gtimg.com/site/images/component-dark.mp4';
const listWrapper = ref<HTMLDivElement | null>(null);
const lightVideoRef = ref<HTMLVideoElement | null>(null);
const darkVideoRef = ref<HTMLVideoElement | null>(null);
const isMobile = computed(() => /(iPhone|iPod|iOS|Android)/i.test(navigator.userAgent));
let intersectionObserver: IntersectionObserver | null = null;

function playVideo(): void {
  if (darkVideoRef.value?.paused) darkVideoRef.value.play();
  if (lightVideoRef.value?.paused) lightVideoRef.value.play();
}

function togglePlay(theme: ThemeMode | null): void {
  if (isMobile.value) return;

  if (theme === 'dark') {
    if (darkVideoRef.value) darkVideoRef.value.play();
    lightVideoRef.value?.pause();
  } else {
    if (lightVideoRef.value) lightVideoRef.value.play();
    darkVideoRef.value?.pause();
  }
}

function watchList(): void {
  if (isMobile.value || !listWrapper.value) return;

  intersectionObserver = new IntersectionObserver((entries) => {
    if (!entries[0] || entries[0].intersectionRatio <= 0) {
      lightVideoRef.value?.pause();
      darkVideoRef.value?.pause();
      return;
    }

    const currentThemeMode = document.documentElement.getAttribute('theme-mode') === 'dark' ? 'dark' : 'light';
    togglePlay(currentThemeMode);
  });
  intersectionObserver.observe(listWrapper.value);
}

watch(
  () => props.themeMode,
  (value) => togglePlay(value),
);

onMounted(() => {
  window.addEventListener('touchstart', playVideo);
  watchList();
});

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', playVideo);
  intersectionObserver?.disconnect();
});
</script>

<style lang="less">
.module-contributor {
  .component-list {
    display: flex;
    column-gap: 144px;
    align-items: center;
    height: 100%;
    background-color: var(--bg-color-card);
    position: relative;

    .lottie-wrapper {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, 0);
      -webkit-transform: translate(-50%, 0);
      width: 100%;
      height: 296px;

      svg {
        width: 2560px !important;
        height: 296px !important;
      }
    }

    video {
      pointer-events: none;
    }
  }
}
</style>
