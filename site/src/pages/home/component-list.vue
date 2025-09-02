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
        ref="lightVideo"
      >
        <source :src="lightVideoUrl" type="video/mp4" />
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
        ref="darkVideo"
      >
        <source :src="darkVideoUrl" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, defineProps } from 'vue';

const props = defineProps({
  themeMode: {
    type: String,
    default: 'light',
  },
});

// Template refs
const listWrapper = ref(null);
const lightVideo = ref(null);
const darkVideo = ref(null);

// Data
const lightVideoUrl = ref('https://tdesign.gtimg.com/site/images/component-light.mp4');
const darkVideoUrl = ref('https://tdesign.gtimg.com/site/images/component-dark.mp4');
let intersectionObserver = null;

// Computed
const isMobile = computed(() => {
  return /(iPhone|iPod|iOS|Android)/i.test(navigator.userAgent);
});

// Methods
const playVideo = () => {
  darkVideo.value.paused && darkVideo.value.play();
  lightVideo.value.paused && lightVideo.value.play();
};

const togglePlay = (theme) => {
  if (isMobile.value) return;

  if (theme === 'dark') {
    darkVideo.value.play();
    lightVideo.value.pause();
  } else {
    lightVideo.value.play();
    darkVideo.value.pause();
  }
};

const watchList = () => {
  if (isMobile.value) return;

  intersectionObserver = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio <= 0) {
      lightVideo.value.pause();
      darkVideo.value.pause();
      return;
    }

    const currentThemeMode = document.documentElement.getAttribute('theme-mode');
    togglePlay(currentThemeMode);
  });
  intersectionObserver.observe(listWrapper.value);
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('touchstart', playVideo);
  watchList();
});

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', playVideo);
  !isMobile.value && intersectionObserver.disconnect();
});

// Watch
watch(
  () => props.themeMode,
  (v) => {
    togglePlay(v);
  },
);
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
