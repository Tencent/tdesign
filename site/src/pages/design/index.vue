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

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import siteConfig, { type SiteDoc } from '../../site.config';
import siteEnConfig from '../../site-en.config';
import type { AsideRoute, DocAsideElement, DocHeaderElement } from '../types';

interface DocContentElement extends HTMLElement {
  pageStatus: 'hidden' | 'show';
}

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const tdDocAside = ref<DocAsideElement | null>(null);
const tdDocContent = ref<DocContentElement | null>(null);
const tdDocHeader = ref<DocHeaderElement | null>(null);
const asideList = computed<AsideRoute[]>(() => {
  const { docs } = (locale.value === 'en-US' ? siteEnConfig : siteConfig).design;
  const toAsideRoutes = (items: SiteDoc[]): AsideRoute[] =>
    items.map(({ name, title, path, meta, children }) => ({
      name,
      title,
      path,
      meta,
      children: children ? toAsideRoutes(children) : undefined,
    }));
  return toAsideRoutes(docs);
});

const initDocHeader = () => {
  const { meta } = route;

  if (route.path.includes('/design/') && tdDocHeader.value) {
    tdDocHeader.value.docInfo = meta;
  }
};

watch(route, () => {
  if (!tdDocContent.value) return;
  tdDocContent.value.pageStatus = 'hidden';

  requestAnimationFrame(() => {
    if (!tdDocContent.value) return;
    initDocHeader();
    tdDocContent.value.pageStatus = 'show';
  });
});

watch(asideList, (list) => {
  if (tdDocAside.value) tdDocAside.value.routerList = list;
});

onMounted(() => {
  if (!tdDocAside.value || !tdDocContent.value) return;

  tdDocAside.value.routerList = asideList.value;
  tdDocAside.value.onchange = (event: Event) => {
    const { detail } = event as CustomEvent<string>;
    if (route.path === detail) return;
    router.push(detail);
    window.scrollTo(0, 0);
  };

  initDocHeader();
  tdDocContent.value.pageStatus = 'show';
});
</script>
