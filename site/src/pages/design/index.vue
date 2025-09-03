<template>
  <td-doc-layout>
    <td-header slot="header" framework="site" />
    <td-doc-aside ref="tdDocAsideRef" />
    <td-doc-content ref="tdDocContentRef" page-status="hidden">
      <td-doc-header ref="tdDocHeaderRef" slot="doc-header" key="header" />
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
const tdDocAsideRef = ref(null);
const tdDocContentRef = ref(null);
const tdDocHeaderRef = ref(null);

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
  const { meta } = route.value;

  if (route.path.includes('/design/')) {
    clearTimeout(timer.value);
    tdDocHeaderRef.value.docInfo = meta;
    tdDocHeaderRef.value.spline = '';
    timer.value = setTimeout(() => {
      tdDocHeaderRef.value.spline = meta.spline || '';
    }, 500);
  }
};

// Watch
watch(route, (v) => {
  tdDocContentRef.value.pageStatus = 'hidden';

  requestAnimationFrame(() => {
    initDocHeader();
    tdDocContentRef.value.pageStatus = 'show';
  });
});

// Lifecycle
onMounted(() => {
  tdDocAsideRef.value.routerList = asideList.value;
  tdDocAsideRef.value.onchange = ({ detail }) => {
    if (route.path === detail) return;
    router.push(detail);
    window.scrollTo(0, 0);
  };

  initDocHeader();
  tdDocContentRef.value.pageStatus = 'show';
});
</script>
