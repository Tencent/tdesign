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
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import siteEnConfig from '../../site-en.config';

const { docs: designDocs } = JSON.parse(JSON.stringify(siteEnConfig.design).replace(/component:.+/g, ''));

const route = useRoute();
const router = useRouter();
const tdDocAside = ref();
const tdDocContent = ref();
const tdDocHeader = ref();
const asideList = computed(() => designDocs);
let timer = null;

const initDocHeader = () => {
  const { meta } = route;

  if (route.path.includes('/design/')) {
    clearTimeout(timer);
    tdDocHeader.value.docInfo = meta;
    tdDocHeader.value.spline = '';
    timer = setTimeout(() => {
      tdDocHeader.value.spline = meta.spline || '';
    }, 500);
  }
};

watch(route, () => {
  tdDocContent.value.pageStatus = 'hidden';

  requestAnimationFrame(() => {
    initDocHeader();
    tdDocContent.value.pageStatus = 'show';
  });
});

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
