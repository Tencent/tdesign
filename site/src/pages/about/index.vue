<template>
  <td-doc-layout>
    <td-header slot="header" framework="site" />
    <td-doc-aside ref="tdDocAside" />
    <router-view v-slot="{ Component }">
      <component :is="Component" :style="contentStyle" @loaded="contentLoaded" />
    </router-view>
  </td-doc-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import type { RouteMeta } from 'vue-router';

import { createSiteConfig } from '../../site.config';
import type { Locale } from '../../i18n';

interface AsidePage {
  name?: string;
  title: string;
  path?: string;
  meta?: RouteMeta;
}

interface AsideRoute {
  title: string;
  children: AsidePage[];
}

type DocAsideElement = HTMLElement & {
  routerList: AsideRoute[];
};

const route = useRoute();
const router = useRouter();
const { locale } = useI18n({ useScope: 'global' });
const tdDocAside = ref<DocAsideElement | null>(null);
const loaded = ref(false);
const asideList = computed<AsideRoute[]>(() => {
  const { docs } = createSiteConfig(locale.value as Locale).about;
  return docs.map(({ title, children }) => ({
    title,
    children: children.map(({ name, title, path, meta }) => ({ name, title, path, meta })),
  }));
});
const contentStyle = computed(() => ({ visibility: loaded.value ? 'visible' : 'hidden' }));

const contentLoaded = (callback: () => void) => {
  requestAnimationFrame(() => {
    loaded.value = true;
    callback();
  });
};

onMounted(() => {
  if (!tdDocAside.value) return;

  tdDocAside.value.routerList = asideList.value;
  tdDocAside.value.onchange = (event: Event) => {
    const { detail } = event as CustomEvent<string>;
    if (route.path === detail) return;
    loaded.value = false;
    router.push(detail);
    window.scrollTo(0, 0);
  };
});
</script>
