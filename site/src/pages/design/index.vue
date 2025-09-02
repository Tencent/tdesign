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

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import siteEnConfig from '../../site-en.config';

const { proxy } = getCurrentInstance();
const route = computed(() => proxy.$route);
const router = proxy.$router;

// Template refs
const tdDocAside = ref(null);
const tdDocContent = ref(null);
const tdDocHeader = ref(null);

const { docs: designDocs } = JSON.parse(JSON.stringify(siteEnConfig.design).replace(/component:.+/g, ''));

// Data
const timer = ref(null);

// Computed
const asideList = computed(() => {
  if (route.path.includes('/design-en')) return designDocs;
  return designDocs;
});

// Methods
const initDocHeader = () => {
  const { meta } = route;

  if (route.path.includes('/design/')) {
    clearTimeout(timer.value);
    tdDocHeader.value.docInfo = meta;
    tdDocHeader.value.spline = '';
    timer.value = setTimeout(() => {
      tdDocHeader.value.spline = meta.spline || '';
    }, 500);
  }
};

// Watch
watch(route, (v) => {
  tdDocContent.value.pageStatus = 'hidden';

  requestAnimationFrame(() => {
    initDocHeader();
    tdDocContent.value.pageStatus = 'show';
  });
});

// Lifecycle
onMounted(() => {
  tdDocAside.value.routerList = asideList.value;
  tdDocAside.value.onchange = ({ detail }) => {
    if (route.path === detail) return;
    router.push(detail);
    window.scrollTo(0, 0);
  };

  initDocHeader();
  tdDocContent.value.pageStatus = 'show';
});
</script>
