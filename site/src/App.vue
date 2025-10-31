<template>
  <td-doc-layout direction="column">
    <td-header framework="site" :style="headerStyle" />
    <router-view />
  </td-doc-layout>
</template>

<script>
export default {
  computed: {
    headerStyle() {
      const { name } = this.$route;
      const fixedHeaderList = ['home', 'home-en', 'source', 'source-en', 'trade', 'icons', 'icons-en'];
      if (fixedHeaderList.includes(name)) {
        return {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1200,
          '--bg-color-secondarypage': 'var(--bg-color-navigation)',
          '--bg-color-secondarypage-hover': 'var(--bg-color-navigation-hover)',
          '--bg-color-secondarypage-select': 'var(--bg-color-navigation-select)',
        };
      }
      return { display: 'none' };
    },
  },

  mounted() {
    // 初次挂载时尝试根据 URL 哈希滚动（考虑固定头部 88px 偏移）
    this.handleHashScroll();
    // 监听页面加载与哈希变化
    window.addEventListener('load', this.handleHashScroll);
    window.addEventListener('hashchange', this.handleHashScroll);
  },

  beforeDestroy() {
    window.removeEventListener('load', this.handleHashScroll);
    window.removeEventListener('hashchange', this.handleHashScroll);
  },

  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.meta) {
          document.title = route.meta.documentTitle || 'TDesign';
        }
      },
    },
  },

  methods: {
    handleHashScroll() {
      const { $route } = this;
      const hash = decodeURIComponent($route.hash);
      if (!hash) return;

      // 使用两次 rAF，确保路由切换/内容渲染完成后再计算位置
      requestAnimationFrame(() => {
        const id = hash.slice(1);
        const anchorEl = document.getElementById(id);
        if (!anchorEl) return;

        requestAnimationFrame(() => {
          const rect = anchorEl.getBoundingClientRect();
          const absoluteTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
          const targetTop = Math.max(absoluteTop - 88, 0);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
      });
    },
  },
};
</script>
