<template>
  <div ref="article" name="DOC" class="doc-values">
    <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
      <ol class="tdesign-toc_list">
        <li class="tdesign-toc_list_item" v-for="anchor in catalog" :key="anchor.id">
          <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
          <ol class="tdesign-toc_list" v-if="anchor.children.length">
            <li class="tdesign-toc_list_item" v-for="subAnchor in anchor.children" :key="subAnchor.id">
              <a class="tdesign-toc_list_item_a" :href="'#' + subAnchor.id">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <template v-for="section in sections" :key="section.key">
      <h2>{{ section.title }}</h2>
      <video
        autoplay
        loop
        muted
        defaultMuted
        playsinline
        x5-playsinline
        webkit-playsinline
        x5-video-player
        x5-video-player-type="h5"
        preload="auto"
      >
        <source :src="section.video" type="video/mp4" />
      </video>
      <p>{{ section.description }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from '@/locales/pages/design-basic';

import useAnchor from '../mixins/anchor';

interface ValueSection {
  key: string;
  video: string;
}

const { article, catalog, genAnchor } = useAnchor();
const { locale, t } = useI18n({ messages });
const values: ReadonlyArray<readonly [ValueSection['key'], ValueSection['video']]> = [
  ['inclusiveness', '包容'],
  ['diversity', '多元'],
  ['evolution', '进化'],
  ['connectivity', '连接'],
];
const sections = computed(() =>
  values.map(([key, video]) => ({
    key,
    title: t(`values.sections.${key}.title`),
    description: t(`values.sections.${key}.description`),
    video: encodeURI(`https://tdesign.gtimg.com/site/images/${video}.mp4`),
  })),
);

function playAllVideo(_event: TouchEvent) {
  article.value?.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
    if (video.paused) video.play();
  });
}

onMounted(() => {
  window.addEventListener('touchstart', playAllVideo);
});

watch(locale, async () => {
  await nextTick();
  genAnchor();
});

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', playAllVideo);
});
</script>

<style lang="less" scoped>
.doc-values {
  video {
    border-radius: 6px;
    width: 100%;
  }
}
</style>
