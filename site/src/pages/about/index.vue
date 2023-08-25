<template>
  <td-doc-layout>
    <td-header slot="header" framework="site" />
    <td-doc-aside ref="tdDocAside" />
    <router-view :style="contentStyle" @loaded="contentLoaded" />
  </td-doc-layout>
</template>

<script>
import siteConfig from '../../site.config'
import siteEnConfig from '../../site-en.config'

import pageLoadMixin from '../mixins/page-load.js'

const { docs: aboutDocs } = JSON.parse(JSON.stringify(siteConfig.about).replace(/component:.+/g, ''))
const { docs: aboutEnDocs } = JSON.parse(JSON.stringify(siteEnConfig.about).replace(/component:.+/g, ''))

export default {
  mixins: [pageLoadMixin],

  computed: {
    asideList () {
      if (this.$route.path.includes('en')) return aboutEnDocs
      return aboutDocs
    }
  },
  mounted () {
    this.$refs.tdDocAside.routerList = this.asideList
    this.$refs.tdDocAside.onchange = ({ detail }) => {
      if (this.$route.path === detail) return
      this.loaded = false
      this.$router.push(detail)
      window.scrollTo(0, 0)
    }
  }
}
</script>
