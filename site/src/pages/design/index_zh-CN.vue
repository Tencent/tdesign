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
import { ref, computed, watch, onMounted, getCurrentInstance, nextTick } from 'vue';
import siteConfig from '../../site.config';

const { proxy } = getCurrentInstance();
const route = computed(() => proxy.$route);
const router = proxy.$router;

// Template refs
const tdDocAsideRef = ref(null);
const tdDocContentRef = ref(null);
const tdDocHeaderRef = ref(null);

const { docs: designDocs } = JSON.parse(JSON.stringify(siteConfig.design).replace(/component:.+/g, ''));

// Data
const timer = ref(null);

// Computed
const asideList = computed(() => {
  if (route.value && route.value.path && route.value.path.includes('/design')) return designDocs;
  return designDocs;
});

// Methods
const initDocHeader = () => {
  const meta = route.value && route.value.meta ? route.value.meta : {};

  if (route.value && route.value.path && route.value.path.includes('/design/')) {
    clearTimeout(timer.value);
    if (tdDocHeaderRef.value) {
      tdDocHeaderRef.value.docInfo = meta;
      tdDocHeaderRef.value.spline = '';
      timer.value = setTimeout(() => {
        tdDocHeaderRef.value.spline = meta.spline || '';
      }, 500);
    }
  }
};

// Watch
watch(route, (v) => {
  if (tdDocContentRef.value) tdDocContentRef.value.pageStatus = 'hidden';

  requestAnimationFrame(() => {
    initDocHeader();
    if (tdDocContentRef.value) tdDocContentRef.value.pageStatus = 'show';
  });
});

// Lifecycle
onMounted(async () => {
  await nextTick();
  if (tdDocAsideRef.value) {
    tdDocAsideRef.value.routerList = asideList.value;
    tdDocAsideRef.value.onchange = ({ detail }) => {
      if (route.value && route.value.path === detail) return;
      if (router && router.push) router.push(detail);
      window.scrollTo(0, 0);
    };
  }

  initDocHeader();
  if (tdDocContentRef.value) tdDocContentRef.value.pageStatus = 'show';
});
</script>
