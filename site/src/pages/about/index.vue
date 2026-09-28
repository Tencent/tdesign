<template>
  <td-doc-layout>
    <td-header slot="header" framework="site" />
    <td-doc-aside ref="tdDocAside" />
    <router-view v-slot="{ Component }">
      <component :is="Component" :style="contentStyle" @loaded="contentLoaded" />
    </router-view>
  </td-doc-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { createSiteConfig } from '../../site.config';

const route = useRoute();
const router = useRouter();
const { locale } = useI18n({ useScope: 'global' });
const tdDocAside = ref();
const loaded = ref(false);
const asideList = computed(() => {
  const { docs } = createSiteConfig(locale.value).about;
  return JSON.parse(JSON.stringify(docs));
});
const contentStyle = computed(() => ({ visibility: loaded.value ? 'visible' : 'hidden' }));

const contentLoaded = (callback) => {
  requestAnimationFrame(() => {
    loaded.value = true;
    callback();
  });
};

onMounted(() => {
  tdDocAside.value.routerList = asideList.value;
  tdDocAside.value.onchange = ({ detail }) => {
    if (route.path === detail) return;
    loaded.value = false;
    router.push(detail);
    window.scrollTo(0, 0);
  };
});
</script>
