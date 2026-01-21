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
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import siteConfig from '../../site.config';

const route = useRoute();
const router = useRouter();

// Template refs
const tdDocAsideRef = ref(null);
const tdDocContentRef = ref(null);
const tdDocHeaderRef = ref(null);

const { docs: designDocs } = JSON.parse(JSON.stringify(siteConfig.design).replace(/component:.+/g, ''));

// Data
const timer = ref(null);

// Computed
const asideList = computed(() => {
  if (route && route.path && route.path.includes('/design')) return designDocs;
  return designDocs;
});

// Methods
const initDocHeader = () => {
  const meta = route && route.meta ? route.meta : {};

  if (route && route.path && route.path.includes('/design/')) {
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
      if (route && route.path === detail) return;
      if (router && router.push) router.push(detail);
      window.scrollTo(0, 0);
    };
  }

  initDocHeader();
  if (tdDocContentRef.value) tdDocContentRef.value.pageStatus = 'show';
});
</script>
