<template>
  <section class="community-card">
    <div class="community-network">
      <div class="community-network__canvas">
        <svg class="community-network__lines" viewBox="0 0 432 413" fill="none" aria-hidden="true">
          <g class="community-network__wheel community-network__wheel--outer">
            <circle cx="216" cy="206.5" r="183" />
            <path
              v-for="point in networkPoints.slice(0, outerRingPointCount)"
              :key="`${point.x}-${point.y}`"
              :d="`M216 206.5 L${point.x} ${point.y}`"
            />
          </g>
          <g class="community-network__wheel community-network__wheel--inner">
            <circle cx="216" cy="206.5" r="119" />
            <path
              v-for="point in networkPoints.slice(outerRingPointCount)"
              :key="`${point.x}-${point.y}`"
              :d="`M216 206.5 L${point.x} ${point.y}`"
            />
          </g>
        </svg>
        <span class="community-network__logo">
          <img :src="tdesignLogo" alt="TDesign" />
        </span>
        <div
          v-for="(member, index) in communityMembers"
          :key="index"
          :class="[
            'community-network__orbit',
            index < outerRingPointCount ? 'community-network__orbit--outer' : 'community-network__orbit--inner',
          ]"
        >
          <span
            :class="[
              'community-network__avatar',
              {
                'community-network__avatar--active': activeMembers.includes(index),
                'community-network__avatar--change': changingMembers.includes(index),
              },
            ]"
            :style="{
              left: `${networkPoints[index].x}px`,
              top: `${networkPoints[index].y}px`,
              backgroundColor: avatarColors[index % avatarColors.length],
            }"
          >
            <span class="community-network__avatar-content">
              <a
                v-if="isGithubMember(member)"
                class="community-network__profile-link"
                :href="githubProfile(member)"
                :aria-label="`${member} 的 GitHub 主页`"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="githubAvatar(member)" :alt="member" />
              </a>
              <template v-else>{{ member }}</template>
            </span>
          </span>
        </div>
      </div>
    </div>

    <div class="community-activity">
      <div class="activity-feed">
        <header class="activity-feed__header">
          <h3>实时动态</h3>
          <t-link
            theme="default"
            size="small"
            :underline="false"
            href="https://tdesign.tencent.com/about/release"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看全部
            <template #suffixIcon><icon name="chevron-right" /></template>
          </t-link>
        </header>

        <div v-if="isActivityLoading" class="activity-feed__list" aria-label="实时动态加载中" aria-busy="true">
          <div v-for="index in 7" :key="index" class="activity-feed__item activity-feed__item--skeleton">
            <t-skeleton animation="gradient" :row-col="activitySkeletonRows" />
          </div>
        </div>
        <div v-else class="activity-feed__list">
          <div v-for="item in activities" :key="item.url" class="activity-feed__item">
            <a class="activity-feed__title" :href="item.url" target="_blank" rel="noopener noreferrer">
              {{ item.title }}
            </a>
            <div class="activity-feed__meta">
              <t-avatar size="16px" :image="item.avatar" alt="" />
              <span class="activity-feed__meta-full">{{ item.meta }}</span>
              <span class="activity-feed__meta-compact">{{ item.compactMeta }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="community-stats">
        <template v-if="isActivityLoading">
          <template v-for="index in 3" :key="index">
            <span v-if="index > 1" class="community-stats__divider"></span>
            <div class="community-stat community-stat--skeleton">
              <t-skeleton animation="gradient" :row-col="statSkeletonRows" />
            </div>
          </template>
        </template>
        <template v-else>
          <template v-for="(item, index) in stats" :key="item.label">
            <span v-if="index" class="community-stats__divider"></span>
            <div class="community-stat">
              <div class="community-stat__value">
                <strong>{{ formatStatValue(item.value) }}</strong>
              </div>
              <p>{{ item.label }}</p>
            </div>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { Icon } from 'tdesign-icons-vue-next';
import { HOME_API_ENDPOINTS } from './api';
import tdesignLogo from './assets/tdesign.svg';

const outerRingPointCount = 11;
const innerRingPointCount = 6;
const networkCenter = { x: 216, y: 206.5 };

function createRingPoints(radius: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
    return {
      x: networkCenter.x + radius * Math.cos(angle),
      y: networkCenter.y + radius * Math.sin(angle),
    };
  });
}

const networkPoints = [...createRingPoints(183, outerRingPointCount), ...createRingPoints(119, innerRingPointCount)];

const communityMembers = ref([
  '👩🏻',
  '👨🏻',
  '👩🏻',
  '👨🏻',
  '👩🏻',
  '👨🏻',
  '👩🏻',
  '👨🏻',
  '👨🏻',
  '👨🏻',
  '👩🏻',
  '👨🏻',
  '👩🏻',
  '👨🏻',
  '👩🏻',
  '👨🏻',
  '👨🏻',
]);
const avatarColors = ['#d9f1ff', '#ffe9bf', '#fbe2f5', '#d9f5ed', '#ffe8d1', '#e6ddff'];
const activeMembers = ref<number[]>([]);
const changingMembers = ref<number[]>([]);
let contributors: string[] = [];
let contributorCursor = networkPoints.length;
let avatarTimer: number | undefined;
let randomTimer: number | undefined;

interface Activity {
  title: string;
  meta: string;
  compactMeta: string;
  author: string;
  avatar: string;
  url: string;
  updatedAt: string;
}

interface CommunityStat {
  value: number;
  label: string;
}

const formatStatValue = (value: number) => new Intl.NumberFormat('en-US').format(value);

const activities = ref<Activity[]>([]);
const stats = ref<CommunityStat[]>([]);
const isActivityLoading = ref(true);
const activitySkeletonRows = [
  { width: '72%', height: '16px' },
  [
    { type: 'circle' as const, size: '16px', marginRight: '8px' },
    { width: '56%', height: '12px' },
  ],
];
const statSkeletonRows = [
  { width: '56px', height: '23px' },
  { width: '72px', height: '12px' },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

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

function isGithubMember(value: string): boolean {
  return !value.includes('🏻');
}

function githubAvatar(value: string): string {
  return `https://avatars.githubusercontent.com/${value}`;
}

function githubProfile(value: string): string {
  return `https://github.com/${encodeURIComponent(value)}`;
}

function formatRelativeTime(value: string): string {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60 * 1000) return '刚刚';

  const minutes = Math.floor(elapsed / (60 * 1000));
  if (minutes < 60) return `${minutes} 分钟前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;

  return `${Math.floor(hours / 24)} 天前`;
}

function parseActivities(value: unknown): Activity[] {
  if (!isRecord(value) || !Array.isArray(value.repositories)) return [];

  return value.repositories
    .flatMap((repository) => {
      if (!isRecord(repository) || typeof repository.name !== 'string' || !isRecord(repository.pullRequests)) {
        return [];
      }

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
            meta: `@${item.author} · ${formatRelativeTime(item.updatedAt)} · ${repository.name} #${item.number}`,
            compactMeta: `@${item.author} · ${formatRelativeTime(item.updatedAt)}`,
            author: item.author,
            avatar: githubAvatar(item.author),
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
    { value: newPullRequests, label: '本周新增 PR' },
    { value: defaultBranchCommits, label: '本周新增 Commit' },
    { value: activeIssues, label: '活跃 Issue' },
  ];
}

function randomIndexes(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * networkPoints.length));
}

function startContributorAnimation(): void {
  avatarTimer = window.setInterval(() => {
    activeMembers.value = randomIndexes(2);
    window.setTimeout(() => {
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
    window.setTimeout(() => {
      indexes.forEach((index) => {
        if (contributorCursor >= contributors.length) return;
        communityMembers.value[index] = contributors[contributorCursor];
        contributorCursor += 1;
      });
    }, 500);
    window.setTimeout(() => {
      changingMembers.value = [];
    }, 1500);
  }, 2500);
}

async function fetchContributors(): Promise<void> {
  try {
    const response = await fetch(HOME_API_ENDPOINTS.contributors);
    if (!response.ok) return;

    const data: unknown = await response.json();
    contributors = parseContributors(data);
    if (contributors.length) {
      communityMembers.value = networkPoints.map((_, index) => contributors[index % contributors.length]);
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchActivity(): Promise<void> {
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
}

onMounted(() => {
  fetchContributors();
  fetchActivity();
  startContributorAnimation();
});

onBeforeUnmount(() => {
  clearInterval(avatarTimer);
  clearInterval(randomTimer);
});
</script>

<style lang="less" scoped>
.community-card {
  display: flex;
  width: min(888px, calc(100vw - 48px));
  height: 520px;
  margin: 0 auto;
  padding: 32px;
  box-sizing: border-box;
  align-items: center;
  gap: 40px;
  overflow: hidden;
  color: var(--text-primary);
  border-radius: 12px;
  background: var(--bg-color-card);
  box-shadow: 0 30px 60px rgb(0 0 0 / 10%), 0 50px 100px rgb(0 0 0 / 5%);
}

@media screen and (min-width: 1920px) {
  .community-card {
    width: 1000px;
    gap: 60px;
  }

  .community-network {
    margin-left: 60px;
  }
}

.community-network {
  position: relative;
  width: 432px;
  height: 413px;
  flex: none;
  overflow: clip;
  overflow-clip-margin: 20px;

  &__canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 432px;
    height: 413px;
    transform: translate(-50%, -50%);
  }

  &__lines {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    circle,
    path {
      stroke: var(--component-border);
      stroke-width: 1;
      stroke-dasharray: 4 4;
    }
  }

  &__wheel {
    transform-origin: 216px 206.5px;

    &--outer {
      animation: network-wheel-rotate 48s linear infinite;
    }

    &--inner {
      animation: network-wheel-rotate 32s linear infinite reverse;
    }
  }

  &__logo {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    display: grid;
    width: 110px;
    height: 110px;
    place-items: center;
    border-radius: 50%;
    background: var(--bg-color-card);
    box-shadow: 0 8px 32px rgb(0 0 0 / 8%);
    transform: translate(-50%, -50%);

    img {
      display: block;
      width: 48px;
      height: 48px;
    }
  }

  &__orbit {
    position: absolute;
    z-index: 1;
    inset: 0;
    pointer-events: none;
    transform-origin: center;

    &--outer {
      animation: network-wheel-rotate 48s linear infinite;

      .community-network__avatar-content {
        animation: network-avatar-counter-rotate 48s linear infinite;
      }
    }

    &--inner {
      animation: network-wheel-rotate 32s linear infinite reverse;

      .community-network__avatar-content {
        animation: network-avatar-counter-rotate 32s linear infinite reverse;
      }
    }
  }

  &__avatar {
    position: absolute;
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    font-size: 28px;
    border: 5px solid var(--bg-color-card);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
    pointer-events: auto;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    &--active {
      box-shadow: 0 0 0 4px rgb(0 82 217 / 18%), 0 2px 8px rgb(0 0 0 / 6%);
      animation: avatar-pulse 6s cubic-bezier(0.38, 0, 0.24, 1) infinite;
    }

    &--change {
      animation: avatar-change 1s cubic-bezier(0.38, 0, 0.24, 1);
    }
  }

  &__avatar-content {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    border-radius: inherit;
  }

  &__profile-link {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    line-height: 0;
    border-radius: 50%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }
}

@keyframes network-wheel-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes network-avatar-counter-rotate {
  to {
    transform: rotate(-360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .community-network__wheel,
  .community-network__orbit,
  .community-network__avatar-content {
    animation: none;
  }
}

@keyframes avatar-change {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(0);
  }
}

@keyframes avatar-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(0 82 217 / 22%);
  }

  50% {
    box-shadow: 0 0 0 8px rgb(0 82 217 / 0%);
  }
}

.community-activity {
  display: flex;
  width: 352px;
  height: 445px;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
}

.activity-feed {
  padding: 16px 0;

  &__header {
    display: flex;
    height: 24px;
    margin-bottom: 12px;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }

    :deep(.t-link) {
      color: var(--text-placeholder);
      font-size: 12px;
      line-height: 20px;
    }
  }

  &__item {
    height: 68px;
    padding: 12px 0;
    box-sizing: border-box;
    border-top: 0.5px solid var(--component-border);

    &:nth-child(n + 5) {
      display: none;
    }

    &:nth-child(4),
    &:last-child {
      border-bottom: 0.5px solid var(--component-border);
    }
  }

  &__item--skeleton {
    :deep(.t-skeleton) {
      width: 100%;
    }
  }

  &__title {
    display: block;
    margin: 0 0 4px;
    overflow: hidden;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      color: var(--text-interactive);
    }
  }

  &__meta {
    display: flex;
    max-width: 100%;
    min-width: 0;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    color: var(--text-placeholder);
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;

    :deep(.t-avatar) {
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      align-self: center;
      font-size: 13px;
      line-height: 0;
      vertical-align: middle;
    }
  }

  &__meta-full,
  &__meta-compact {
    max-width: calc(100% - 24px);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta-full {
    display: block;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  &__meta-compact {
    display: none;
  }
}

.community-stats {
  display: flex;
  height: 89px;
  align-items: center;
  justify-content: space-between;

  &__divider {
    width: 1px;
    height: 50px;
    background: var(--component-border);
    opacity: 0.7;
  }
}

.community-stat {
  display: flex;
  height: 89px;
  padding: 16px 0;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  gap: 8px;

  &__value {
    display: flex;
    height: 23px;
    align-items: center;

    strong {
      font-family: TCloudNumber, sans-serif;
      font-size: 32px;
      font-weight: 500;
      line-height: 23px;
    }
  }

  p {
    margin: 0;
    color: var(--text-placeholder);
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
  }

  &--skeleton {
    min-width: 72px;

    :deep(.t-skeleton) {
      width: 72px;
    }
  }
}

@media screen and (min-width: 701px) and (max-width: 960px) {
  .community-card {
    width: calc(100vw - 48px);
    height: 732px;
    padding: 32px clamp(24px, calc(2.8571vw + 4px), 32px);
    align-items: stretch;
    gap: clamp(16px, calc(9.2308vw - 48.6154px), 40px);
  }

  .community-network {
    width: calc(60.91% - 69.88px);
    height: 672px;
    min-height: 672px;

    &__canvas {
      transform: translate(-50%, -50%) scale(1.33);
    }
  }

  .community-activity {
    width: auto;
    height: 672px;
    min-width: 0;
    flex: 1;
  }

  .activity-feed {
    height: 544px;
    box-sizing: border-box;

    &__item:nth-child(n + 5) {
      display: block;
    }

    &__item:nth-child(4):not(:last-child) {
      border-bottom: 0;
    }
  }
}

@media screen and (max-width: 960px) {
  .activity-feed {
    &__meta-full {
      display: none;
    }

    &__meta-compact {
      display: block;
    }
  }
}

@media screen and (max-width: 700px) {
  .community-card {
    width: min(888px, calc(100vw - 48px));
    height: 795px;
    min-height: 795px;
    padding: 32px 24px;
    flex-direction: column;
    gap: 16px;
  }

  .community-network {
    width: 432px;
    max-width: none;
    height: 413px;
    margin-bottom: -159px;

    &__canvas {
      top: 0;
      transform: translateX(-50%) scale(0.6156);
      transform-origin: top center;
    }
  }

  .community-activity {
    width: 100%;
    height: 445px;
    gap: 16px;
  }

  .activity-feed {
    height: 324px;
    box-sizing: border-box;

    &__meta-full {
      display: block;
      text-overflow: clip;
    }

    &__meta-compact {
      display: none;
    }
  }

  .community-stats {
    height: 105px;
  }

  .community-stat {
    height: 105px;
    align-items: center;

    &__value {
      height: 20px;

      strong {
        font-size: 28px;
        line-height: 20px;
      }
    }

    p {
      font-size: 10px;
      line-height: 20px;
    }
  }
}

@media screen and (max-width: 499px) {
  .community-card {
    height: 804px;
    min-height: 804px;
  }

  .community-stat {
    gap: 16px;
  }
}

@media screen and (min-width: 500px) and (max-width: 700px) {
  .community-card {
    width: calc(100vw - 48px);
    height: 736px;
    min-height: 736px;
    align-items: center;
  }

  .community-network {
    width: 356px;
    height: 340px;
    margin-bottom: 0;

    &__canvas {
      transform: translateX(-50%) scale(0.823);
    }
  }

  .community-activity {
    height: 316px;
  }

  .activity-feed {
    height: 212px;
    padding: 0;

    &__item {
      display: grid;
      height: 44px;
      align-items: center;
      gap: 24px;
      grid-template-columns: minmax(200px, 1fr) minmax(0, 254px);
    }

    &__title {
      min-width: 200px;
      margin: 0;
    }

    &__meta {
      max-width: 254px;
      min-width: 0;
      overflow: hidden;
    }
  }

  .community-stats,
  .community-stat {
    height: 88px;
  }
}
</style>
