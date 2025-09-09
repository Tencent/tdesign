<template>
  <td-doc-layout direction="column">
    <td-header framework="site" :style="headerStyle" />
    <router-view />
  </td-doc-layout>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch, getCurrentInstance } from 'vue';
// vue-router@3 无 useRoute 组合式 API，使用实例 proxy.$route，并用 computed 保持响应式
const { proxy } = getCurrentInstance();
const route = computed(() => proxy.$route);

// Computed
const headerStyle = computed(() => {
  const { name } = route.value;
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
  const hash = decodeURIComponent(route.value.hash);
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
  route,
  (newRoute) => {
    if (newRoute && newRoute.meta) {
      document.title = newRoute.meta.documentTitle || 'TDesign';
    }
  },
  { immediate: true },
);
</script>
