<template>
  <td-doc-layout direction="column">
    <td-header framework="site" :style="headerStyle" />
    <router-view />
  </td-doc-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch, type CSSProperties } from 'vue';
import { useRoute, type RouteMeta } from 'vue-router';

const route = useRoute();

const headerStyle = computed<CSSProperties>(() => {
  if (route.meta.fixedHeader) {
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
});

function handleHashScroll(): void {
  const hash = decodeURIComponent(route.hash);
  requestAnimationFrame(() => {
    const anchorEl = document.getElementById(hash.slice(1));
    if (!anchorEl) return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: anchorEl.offsetTop - 88 });
    });
  });
}

watch(
  () => route.meta,
  (meta: RouteMeta) => {
    document.title = typeof meta.documentTitle === 'string' ? meta.documentTitle : 'TDesign';
  },
  { immediate: true },
);

onMounted(() => window.addEventListener('load', handleHashScroll));
onBeforeUnmount(() => window.removeEventListener('load', handleHashScroll));
</script>
