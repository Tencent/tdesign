<template>
    <td-doc-layout>
        <td-header slot="header" framework="site" />
        <td-doc-aside ref="tdDocAside" />
        <td-doc-content ref="tdDocContent" page-status="hidden">
            <td-doc-header ref="tdDocHeader" slot="doc-header" key="header" />
            <router-view />
            <td-doc-footer slot="doc-footer" />
        </td-doc-content>
    </td-doc-layout>
</template>

<script>
import siteConfig from '../../site.config'

const { docs: designDocs } = JSON.parse(JSON.stringify(siteConfig.design).replace(/component:.+/g, ''))

export default {
  data () {
    return {
      timer: null
    }
  },

  computed: {
    asideList () {
      if (this.$route.path.includes('/design')) return designDocs
      return designDocs
    }
  },
  watch: {
    $route (v) {
      this.$refs.tdDocContent.pageStatus = 'hidden'

      requestAnimationFrame(() => {
        this.initDocHeader()
        this.$refs.tdDocContent.pageStatus = 'show'
      })
    }
  },

  mounted () {
    this.$refs.tdDocAside.routerList = this.asideList
    this.$refs.tdDocAside.onchange = ({ detail }) => {
      if (this.$route.path === detail) return
      this.$router.push(detail)
      window.scrollTo(0, 0)
    }

    this.initDocHeader()
    this.$refs.tdDocContent.pageStatus = 'show'
  },
  methods: {
    initDocHeader () {
      const { meta } = this.$route

      if (this.$route.path.includes('/design/')) {
        clearTimeout(this.timer)
        this.$refs.tdDocHeader.docInfo = meta
        this.$refs.tdDocHeader.spline = ''
        this.timer = setTimeout(() => {
          this.$refs.tdDocHeader.spline = meta.spline || ''
        }, 500)
      }
    }
  }
}
</script>
