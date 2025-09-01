<template>
  <td-doc-layout>
    <td-header slot="header" framework="site" />
    <td-doc-aside ref="tdDocAside" />
    <router-view :style="contentStyle" @loaded="contentLoaded" />
  </td-doc-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import siteConfig from '../../site.config'
import siteEnConfig from '../../site-en.config'

const route = useRoute()
const router = useRouter()

// Template refs
const tdDocAside = ref(null)

// Data (from page-load mixin)
const loaded = ref(false)

// Computed (from page-load mixin)
const contentStyle = computed(() => {
  return { visibility: loaded.value ? 'visible' : 'hidden' }
})

// Methods (from page-load mixin)
const contentLoaded = (callback) => {
  requestAnimationFrame(() => {
    loaded.value = true
    callback()
  })
}

const { docs: aboutDocs } = JSON.parse(JSON.stringify(siteConfig.about).replace(/component:.+/g, ''))
const { docs: aboutEnDocs } = JSON.parse(JSON.stringify(siteEnConfig.about).replace(/component:.+/g, ''))

// Computed (from component)
const asideList = computed(() => {
  if (route.path.includes('en')) return aboutEnDocs
  return aboutDocs
})

// Lifecycle
onMounted(() => {
  tdDocAside.value.routerList = asideList.value
  tdDocAside.value.onchange = ({ detail }) => {
    if (route.path === detail) return
    loaded.value = false
    router.push(detail)
    window.scrollTo(0, 0)
  }
})
</script>
