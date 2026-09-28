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
import { useRoute, useRouter } from 'vue-router';

import siteConfig from '../../site.config';
import siteEnConfig from '../../site-en.config';

const { docs: aboutDocs } = JSON.parse(JSON.stringify(siteConfig.about).replace(/component:.+/g, ''));
const { docs: aboutEnDocs } = JSON.parse(JSON.stringify(siteEnConfig.about).replace(/component:.+/g, ''));

const route = useRoute();
const router = useRouter();
const tdDocAside = ref();
const loaded = ref(false);
const asideList = computed(() => (route.path.includes('en') ? aboutEnDocs : aboutDocs));
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
