<template>
  <td-doc-layout direction="column">
    <td-header framework="site" :style="headerStyle" />
    <router-view />
  </td-doc-layout>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Computed
const headerStyle = computed(() => {
  const { name } = route;
  const fixedHeaderList = ['home', 'home-en', 'source', 'source-en', 'trade', 'icons', 'icons-en'];
  if (fixedHeaderList.includes(name)) {
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

// Methods
const handleHashScroll = () => {
  const hash = decodeURIComponent(route.hash);
  requestAnimationFrame(() => {
    const id = hash.slice(1);
    const anchorEl = document.getElementById(id);
    if (!anchorEl) return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: anchorEl.offsetTop - 88 });
    });
  });
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('load', handleHashScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('load', handleHashScroll);
});

// Watch
watch(
  () => route,
  (newRoute) => {
    if (newRoute && newRoute.meta) {
      document.title = newRoute.meta.documentTitle || 'TDesign';
    }
  },
  { immediate: true, deep: true },
);
</script>
