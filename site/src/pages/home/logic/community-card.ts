import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import homeMessages from '@/locales/pages/home';
import { isRecord } from '@/utils/type';
import { HOME_API_ENDPOINTS } from '../services/api';

const OUTER_RING_POINT_COUNT = 11;
const INNER_RING_POINT_COUNT = 6;
const NETWORK_CENTER = { x: 216, y: 206.5 };

interface Activity {
  title: string;
  author: string;
  avatar: string;
  repository: string;
  number: number;
  url: string;
  updatedAt: string;
}

interface CommunityStat {
  value: number;
  labelKey: string;
}

function createRingPoints(radius: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
    return {
      x: NETWORK_CENTER.x + radius * Math.cos(angle),
      y: NETWORK_CENTER.y + radius * Math.sin(angle),
    };
  });
}

const NETWORK_POINTS = [
  ...createRingPoints(183, OUTER_RING_POINT_COUNT),
  ...createRingPoints(119, INNER_RING_POINT_COUNT),
];

function getStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function parseContributors(value: unknown): string[] {
  if (!isRecord(value)) return [];

  const names: string[] = [];
  Object.entries(value).forEach(([group, items]) => {
    if (group === 'design' && isRecord(items)) {
      Object.values(items).forEach((members) => names.push(...getStringList(members)));
      return;
    }

    if (!Array.isArray(items)) return;
    items.forEach((component) => {
      if (!isRecord(component) || !Array.isArray(component.tasks)) return;
      component.tasks.forEach((task) => {
        if (isRecord(task)) names.push(...getStringList(task.contributors));
      });
    });
  });

  const uniqueNames = new Map<string, string>();
  names.forEach((name) => {
    const normalizedName = name.trim();
    if (normalizedName) uniqueNames.set(normalizedName.toLowerCase(), normalizedName);
  });
  return Array.from(uniqueNames.values());
}

function githubAvatar(value: string): string {
  return `https://avatars.githubusercontent.com/${value}`;
}

function parseActivities(value: unknown): Activity[] {
  if (!isRecord(value) || !Array.isArray(value.repositories)) return [];

  return value.repositories
    .flatMap((repository) => {
      if (!isRecord(repository) || typeof repository.name !== 'string' || !isRecord(repository.pullRequests)) {
        return [];
      }

      const repositoryName = repository.name;
      const recent = repository.pullRequests.recent;
      if (!Array.isArray(recent)) return [];

      return recent.flatMap((item) => {
        if (
          !isRecord(item) ||
          typeof item.title !== 'string' ||
          typeof item.author !== 'string' ||
          typeof item.updatedAt !== 'string' ||
          typeof item.url !== 'string' ||
          typeof item.number !== 'number'
        ) {
          return [];
        }

        return [
          {
            title: item.title,
            author: item.author,
            avatar: githubAvatar(item.author),
            repository: repositoryName,
            number: item.number,
            url: item.url,
            updatedAt: item.updatedAt,
          },
        ];
      });
    })
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .slice(0, 7);
}

function parseStats(value: unknown): CommunityStat[] {
  if (!isRecord(value) || !isRecord(value.summary)) return [];

  const { newPullRequests, defaultBranchCommits, activeIssues } = value.summary;
  if (
    typeof newPullRequests !== 'number' ||
    typeof defaultBranchCommits !== 'number' ||
    typeof activeIssues !== 'number'
  ) {
    return [];
  }

  return [
    { value: newPullRequests, labelKey: 'home.contributors.activity.stats.pullRequests' },
    { value: defaultBranchCommits, labelKey: 'home.contributors.activity.stats.commits' },
    { value: activeIssues, labelKey: 'home.contributors.activity.stats.issues' },
  ];
}

export function createCommunityCardModel() {
  const { locale, t } = useI18n({ messages: homeMessages });
  const communityMembers = ref<string[]>([]);
  const activeMembers = ref<number[]>([]);
  const changingMembers = ref<number[]>([]);
  const activities = ref<Activity[]>([]);
  const stats = ref<CommunityStat[]>([]);
  const isActivityLoading = ref(true);

  let contributors: string[] = [];
  let contributorCursor = NETWORK_POINTS.length;
  let avatarTimer: number | undefined;
  let randomTimer: number | undefined;
  const animationTimeouts = new Set<number>();

  const randomIndexes = (count: number) =>
    Array.from({ length: count }, () => Math.floor(Math.random() * NETWORK_POINTS.length));

  const scheduleAnimation = (callback: () => void, delay: number) => {
    const timeout = window.setTimeout(() => {
      animationTimeouts.delete(timeout);
      callback();
    }, delay);
    animationTimeouts.add(timeout);
  };

  const startContributorAnimation = () => {
    avatarTimer = window.setInterval(() => {
      activeMembers.value = randomIndexes(2);
      scheduleAnimation(() => {
        activeMembers.value = [];
      }, 5000);
    }, 2500);

    randomTimer = window.setInterval(() => {
      if (!contributors.length) return;
      if (contributorCursor >= contributors.length) {
        clearInterval(randomTimer);
        randomTimer = undefined;
        return;
      }

      const indexes = randomIndexes(2);
      changingMembers.value = indexes;
      scheduleAnimation(() => {
        indexes.forEach((index) => {
          if (contributorCursor >= contributors.length) return;
          communityMembers.value[index] = contributors[contributorCursor];
          contributorCursor += 1;
        });
      }, 500);
      scheduleAnimation(() => {
        changingMembers.value = [];
      }, 1500);
    }, 2500);
  };

  const fetchContributors = async () => {
    try {
      const response = await fetch(HOME_API_ENDPOINTS.contributors);
      if (!response.ok) return;

      const data: unknown = await response.json();
      contributors = parseContributors(data);
      if (contributors.length) {
        communityMembers.value = NETWORK_POINTS.map((_, index) => contributors[index % contributors.length]);
        startContributorAnimation();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch(HOME_API_ENDPOINTS.communityActivity);
      if (!response.ok) return;

      const data: unknown = await response.json();
      activities.value = parseActivities(data);
      stats.value = parseStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      isActivityLoading.value = false;
    }
  };

  const formatRelativeTime = (value: string) => {
    const elapsed = Date.now() - new Date(value).getTime();
    if (!Number.isFinite(elapsed) || elapsed < 60 * 1000) return t('home.contributors.activity.justNow');

    const minutes = Math.floor(elapsed / (60 * 1000));
    const formatter = new Intl.RelativeTimeFormat(locale.value, { numeric: 'always' });
    if (minutes < 60) return formatter.format(-minutes, 'minute');

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return formatter.format(-hours, 'hour');

    return formatter.format(-Math.floor(hours / 24), 'day');
  };

  onMounted(() => {
    fetchContributors();
    fetchActivity();
  });

  onBeforeUnmount(() => {
    clearInterval(avatarTimer);
    clearInterval(randomTimer);
    animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    animationTimeouts.clear();
  });

  return {
    t,
    outerRingPointCount: OUTER_RING_POINT_COUNT,
    networkPoints: NETWORK_POINTS,
    communityMembers,
    avatarColors: ['#d9f1ff', '#ffe9bf', '#fbe2f5', '#d9f5ed', '#ffe8d1', '#e6ddff'],
    activeMembers,
    changingMembers,
    activities,
    stats,
    isActivityLoading,
    activitySkeletonRows: [
      { width: '72%', height: '16px' },
      [
        { type: 'circle' as const, size: '16px', marginRight: '8px' },
        { width: '56%', height: '12px' },
      ],
    ],
    statSkeletonRows: [
      { width: '56px', height: '23px' },
      { width: '72px', height: '12px' },
    ],
    isGithubMember: (value: string) => !value.includes('🏻'),
    githubAvatar,
    githubProfile: (value: string) => `https://github.com/${encodeURIComponent(value)}`,
    formatStatValue: (value: number) => new Intl.NumberFormat(locale.value).format(value),
    activityMeta: (item: Activity, compact = false) => {
      const base = `@${item.author} · ${formatRelativeTime(item.updatedAt)}`;
      return compact ? base : `${base} · ${item.repository} #${item.number}`;
    },
  };
}
