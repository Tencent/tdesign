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

<script>
import { langMixin } from '../../../common/i18n';
import { themeStore } from '../../../common/themes';
import { getTokenValue } from '../../../common/utils';

export default {
  name: 'StickyThemeDisplay',
  props: {
    top: Number,
    theme: {
      type: Object,
    },
  },
  mixins: [langMixin],
  data() {
    return {
      isAnimating: false,
      brandColor: null,
      styleObserver: null,
    };
  },
  computed: {
    $theme() {
      return themeStore.theme;
    },
    stickyThemeStyle() {
      return {
        top: `${this.top}px`,
      };
    },
  },
  mounted() {
    this.brandColor = getTokenValue('--brand-main');
    this.setupStyleObserver();
  },
  methods: {
    setupStyleObserver() {
      this.styleObserver = new MutationObserver(this.checkBrandColorChange);
      this.styleObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
      });
    },
    checkBrandColorChange() {
      const newColor = getTokenValue('--brand-main');
      if (newColor && newColor !== this.brandColor) {
        this.brandColor = newColor;
        this.isAnimating = true;

        setTimeout(() => {
          this.isAnimating = false;
        }, 1000);
      }
    },
  },
  beforeDestroy() {
    if (this.styleObserver) {
      this.styleObserver.disconnect();
    }
  },
};
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
