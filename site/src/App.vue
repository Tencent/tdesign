<template>
  <td-doc-layout direction="column">
    <td-header framework="site" :style="headerStyle" />
    <router-view />
  </td-doc-layout>
</template>

<script>
export default {
  computed: {
    headerStyle () {
      const { name } = this.$route
      const fixedHeaderList = ['home', 'home-en', 'source', 'source-en', 'trade']
      if (fixedHeaderList.includes(name)) {
        return {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1200,
          '--bg-color-secondarypage': 'var(--bg-color-navigation)',
          '--bg-color-secondarypage-hover': 'var(--bg-color-navigation-hover)',
          '--bg-color-secondarypage-select': 'var(--bg-color-navigation-select)'
        }
      }
      return { display: 'none' }
    }
  },

  mounted () {
    window.addEventListener('load', this.handleHashScroll)
  },

  beforeDestroy () {
    window.removeEventListener('load', this.handleHashScroll)
  },

  watch: {
    $route: {
      immediate: true,
      handler (route) {
        if (route.meta) {
          document.title = route.meta.documentTitle || 'TDesign'
        }
      }
    }
  },

  methods: {
    handleHashScroll () {
      const { $route } = this
      const hash = decodeURIComponent($route.hash)
      requestAnimationFrame(() => {
        const id = hash.slice(1)
        const anchorEl = document.getElementById(id)
        if (!anchorEl) return

        requestAnimationFrame(() => {
          window.scrollTo({ top: anchorEl.offsetTop - 88 })
        })
      })
    }
  }
}
</script>
