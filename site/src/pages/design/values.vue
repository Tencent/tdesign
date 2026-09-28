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
        loop="loop"
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

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from '@/locales/pages/design-basic';

const article = ref(null);
const catalog = ref([]);
const { locale, t } = useI18n({ messages });
const values = [
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

function genAnchor() {
  if (!article.value) return;
  const nodes = ['H2', 'H3'];
  const titles = [];
  article.value.childNodes.forEach((element, index) => {
    if (nodes.includes(element.nodeName)) {
      const id = `header-${index}`;
      element.setAttribute('id', id);
      titles.push({
        id,
        title: element.textContent,
        level: Number(element.nodeName.substring(1, 2)),
        nodeName: element.nodeName,
        children: [],
      });
    }
  });

  const isEveryLevel3 = titles.every((title) => title.level === 3);
  catalog.value = titles.reduce((result, current) => {
    if (isEveryLevel3 || current.level === 2) {
      result.push(current);
    } else if (current.level === 3) {
      result[result.length - 1].children.push(current);
    }
    return result;
  }, []);
}

function playAllVideo() {
  Array.from(article.value.querySelectorAll('video')).forEach((item) => {
    if (item.paused) item.play();
  });
}

onMounted(() => {
  genAnchor();
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
