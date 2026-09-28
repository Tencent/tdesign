<template>
  <div class="component-list" ref="listWrapper">
    <div class="lottie-wrapper __light__">
      <video
        width="2560"
        height="296"
        autoplay="autoplay"
        loop="loop"
        muted
        defaultMuted
        playsinline
        x5-playsinline
        webkit-playsinline
        x5-video-player
        preload="auto"
        ref="lightVideoRef"
      >
        <source :src="lightVideo" type="video/mp4" />
      </video>
    </div>

    <div class="lottie-wrapper __dark__">
      <video
        width="2560"
        height="296"
        autoplay="autoplay"
        loop="loop"
        muted
        defaultMuted
        playsinline
        x5-playsinline
        webkit-playsinline
        x5-video-player
        preload="auto"
        ref="darkVideoRef"
      >
        <source :src="darkVideo" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  themeMode: {
    type: String,
    default: 'light',
  },
});

const lightVideo = 'https://tdesign.gtimg.com/site/images/component-light.mp4';
const darkVideo = 'https://tdesign.gtimg.com/site/images/component-dark.mp4';
const listWrapper = ref();
const lightVideoRef = ref();
const darkVideoRef = ref();
const isMobile = computed(() => /(iPhone|iPod|iOS|Android)/i.test(navigator.userAgent));
let intersectionObserver;

function playVideo() {
  darkVideoRef.value.paused && darkVideoRef.value.play();
  lightVideoRef.value.paused && lightVideoRef.value.play();
}

function togglePlay(theme) {
  if (isMobile.value) return;

  if (theme === 'dark') {
    darkVideoRef.value.play();
    lightVideoRef.value.pause();
  } else {
    lightVideoRef.value.play();
    darkVideoRef.value.pause();
  }
}

function watchList() {
  if (isMobile.value) return;

  intersectionObserver = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio <= 0) {
      lightVideoRef.value.pause();
      darkVideoRef.value.pause();
      return;
    }

    const currentThemeMode = document.documentElement.getAttribute('theme-mode');
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
  !isMobile.value && intersectionObserver.disconnect();
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
