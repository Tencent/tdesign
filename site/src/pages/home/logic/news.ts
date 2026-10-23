import { computed, nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import { isIntranet } from '@tdesign/site-components';

import { isRecord } from '@/utils/type';
import { HOME_API_ENDPOINTS } from '../services/api';

const NEWS_ITEM_STRIDE = 342 + 16;

export interface NewsItem {
  title: string;
  desc: string;
  date: string;
  url?: string;
  isIntranet?: boolean;
}

function parseNews(value: unknown): NewsItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.title !== 'string' ||
      typeof item.desc !== 'string' ||
      typeof item.date !== 'string'
    ) {
      return [];
    }
    return [
      {
        title: item.title,
        desc: item.desc,
        date: item.date,
        url: typeof item.url === 'string' ? item.url : undefined,
        isIntranet: item.isIntranet === true,
      },
    ];
  });
}

export function createHomeNews(windowWidth: Ref<number>) {
  const newsList = ref<NewsItem[]>([]);
  const newsTrackRef = ref<HTMLElement | null>(null);
  const loopedNewsList = computed(() => {
    if (newsList.value.length <= 1) return newsList.value;

    const cycleWidth = newsList.value.length * NEWS_ITEM_STRIDE;
    const copyCount = Math.ceil(windowWidth.value / cycleWidth) + 2;
    return Array.from({ length: copyCount }, () => newsList.value).flat();
  });

  let animationFrame: number | null = null;
  let lastTimestamp = 0;

  function handleClickNews(url?: string): void {
    if (url) window.open(url, '_blank');
  }

  function animate(timestamp: number): void {
    const track = newsTrackRef.value;
    const items = track?.querySelectorAll<HTMLElement>('.module-news__item');
    if (!track || !items || newsList.value.length < 2) {
      animationFrame = null;
      return;
    }

    if (lastTimestamp > 0) {
      const elapsed = Math.min(timestamp - lastTimestamp, 50);
      track.scrollLeft += (elapsed / 1000) * 48;

      const cycleWidth = items[newsList.value.length].offsetLeft - items[0].offsetLeft;
      if (cycleWidth > 0 && track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
    }

    lastTimestamp = timestamp;
    animationFrame = requestAnimationFrame(animate);
  }

  function startNewsAutoplay(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || animationFrame !== null) return;
    lastTimestamp = 0;
    animationFrame = requestAnimationFrame(animate);
  }

  function stopNewsAutoplay(): void {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (animationFrame === null) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
    lastTimestamp = 0;
  }

  function resetAndStartAutoplay(): void {
    const track = newsTrackRef.value;
    if (track) track.scrollLeft = 0;
    startNewsAutoplay();
  }

  async function getNews(): Promise<void> {
    const response = await fetch(HOME_API_ENDPOINTS.news);
    const value: unknown = await response.json();
    const list = parseNews(value);

    newsList.value = isIntranet() ? list : list.filter((item) => !item.isIntranet);
    nextTick(resetAndStartAutoplay);
  }

  onMounted(() => {
    getNews();
    window.addEventListener('pageshow', startNewsAutoplay);
  });

  onBeforeUnmount(() => {
    stopNewsAutoplay();
    window.removeEventListener('pageshow', startNewsAutoplay);
  });

  return {
    handleClickNews,
    loopedNewsList,
    newsList,
    newsTrackRef,
    startNewsAutoplay,
    stopNewsAutoplay,
  };
}
