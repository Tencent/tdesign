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
        ref="darkVideo"
      >
        <source :src="darkVideo" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    themeMode: {
      type: String,
      default: 'light',
    },
  },

  data() {
    return {
      lightVideo: 'https://tdesign.gtimg.com/site/images/component-light.mp4',
      darkVideo: 'https://tdesign.gtimg.com/site/images/component-dark.mp4',
    };
  },

  computed: {
    isMobile() {
      return /(iPhone|iPod|iOS|Android)/i.test(navigator.userAgent);
    },
  },

  mounted() {
    window.addEventListener('touchstart', this.playVideo);
    this.watchList();
  },

  beforeDestroy() {
    window.removeEventListener('touchstart', this.playVideo);
    !this.isMobile && this.intersectionObserver.disconnect();
  },

  watch: {
    themeMode(v) {
      this.togglePlay(v);
    },
  },

  methods: {
    playVideo() {
      this.$refs.darkVideo.paused && this.$refs.darkVideo.play();
      this.$refs.lightVideo.paused && this.$refs.lightVideo.play();
    },

    togglePlay(theme) {
      if (this.isMobile) return;

      if (theme === 'dark') {
        this.$refs.darkVideo.play();
        this.$refs.lightVideo.pause();
      } else {
        this.$refs.lightVideo.play();
        this.$refs.darkVideo.pause();
      }
    },
    watchList() {
      if (this.isMobile) return;

      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio <= 0) {
          this.$refs.lightVideo.pause();
          this.$refs.darkVideo.pause();
          return;
        }

        const currentThemeMode = document.documentElement.getAttribute('theme-mode');
        this.togglePlay(currentThemeMode);
      });
      this.intersectionObserver.observe(this.$refs.listWrapper);
    },
  },
};
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
