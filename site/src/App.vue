<template>
  <td-doc-layout direction="column">
    <td-header framework="site" :style="headerStyle" />
    <router-view />
  </td-doc-layout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const headerStyle = computed(() => {
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

function handleHashScroll() {
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
  (meta) => {
    document.title = meta?.documentTitle || 'TDesign';
  },
  { immediate: true },
);

onMounted(() => window.addEventListener('load', handleHashScroll));
onBeforeUnmount(() => window.removeEventListener('load', handleHashScroll));
</script>
