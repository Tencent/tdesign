import { onMounted, ref, type Ref } from 'vue';

import { HOME_API_ENDPOINTS } from '../../services/api';

interface Release {
  publishedAt: string;
  body: string;
}

const releaseMatchers: Record<string, string> = {
  'vue-next': 'tdesign-vue-next@',
  'react-web': 'tdesign-react@',
  vue2: 'Vue2 for Web 发布',
  miniprogram: 'tdesign-miniprogram@',
  'vue-mobile': 'Vue3 for Mobile 发布',
  'react-mobile': 'React for Mobile 发布',
  'uniapp-mobile': '@tdesign/uniapp@',
  flutter: 'Flutter for Mobile 发布',
  'vue-chat': '@tdesign-vue-next/chat@',
  'react-chat': '@tdesign-react/chat@',
  'miniprogram-chat': '@tdesign-miniprogram/chat@',
};

function parseReleases(value: unknown): Release[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const release = item as Record<string, unknown>;
    // eslint-disable-next-line camelcase
    const publishedAt = release.published_at;
    if (typeof publishedAt !== 'string' || typeof release.body !== 'string') return [];
    return [{ publishedAt, body: release.body }];
  });
}

function parseReleaseDates(value: unknown): Record<string, string> {
  const dates: Record<string, string> = {};
  parseReleases(value).forEach((release) => {
    Object.entries(releaseMatchers).forEach(([key, marker]) => {
      if (release.body.includes(marker) && (!dates[key] || Date.parse(release.publishedAt) > Date.parse(dates[key]))) {
        dates[key] = release.publishedAt;
      }
    });
  });
  return dates;
}

export function createResourceReleases(locale: Ref<string>) {
  const releaseDates = ref<Record<string, string>>({});

  function formatUpdatedAt(value: string): string {
    const elapsedDays = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000)));
    const elapsedWeeks = Math.floor(elapsedDays / 7);
    const relativeTime = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }).format(-elapsedWeeks, 'week');
    return locale.value.startsWith('zh') ? `${relativeTime}更新` : relativeTime;
  }

  async function fetchReleaseDates(): Promise<void> {
    try {
      const response = await fetch(HOME_API_ENDPOINTS.releases);
      if (!response.ok) return;

      const data: unknown = await response.json();
      releaseDates.value = parseReleaseDates(data);
    } catch (error) {
      console.error(error);
    }
  }

  onMounted(fetchReleaseDates);

  return {
    releaseDates,
    formatUpdatedAt,
  };
}
