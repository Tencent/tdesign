<template>
  <section class="community-card">
    <div class="community-network" aria-hidden="true">
      <svg class="community-network__lines" viewBox="0 0 432 413" fill="none">
        <circle cx="216" cy="206.5" r="119" />
        <circle cx="216" cy="206.5" r="183" />
        <path v-for="point in networkPoints" :key="`${point.x}-${point.y}`" :d="`M216 206.5 L${point.x} ${point.y}`" />
      </svg>
      <span class="community-network__logo">
        <img :src="tdesignLogo" alt="TDesign" />
      </span>
      <span
        v-for="(member, index) in communityMembers"
        :key="index"
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
        <img v-if="isGithubMember(member)" :src="githubAvatar(member)" :alt="member" />
        <template v-else>{{ member }}</template>
      </span>
    </div>

    <div class="community-activity">
      <div class="activity-feed">
        <header class="activity-feed__header">
          <h3>实时动态</h3>
          <t-link theme="default" size="small" :underline="false">
            查看全部
            <template #suffixIcon><icon name="chevron-right" /></template>
          </t-link>
        </header>

        <div class="activity-feed__list">
          <div v-for="item in activities" :key="item.title" class="activity-feed__item">
            <p class="activity-feed__title">{{ item.title }}</p>
            <div class="activity-feed__meta">
              <t-avatar size="20px" :style="{ backgroundColor: item.color }">{{ item.avatar }}</t-avatar>
              <span>{{ item.meta }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="community-stats">
        <template v-for="(item, index) in stats" :key="item.label">
          <span v-if="index" class="community-stats__divider"></span>
          <div class="community-stat">
            <div class="community-stat__value">
              <strong>{{ item.value }}</strong>
              <span :style="{ color: item.color }"><icon name="trending-up" />{{ item.change }}</span>
            </div>
            <p>{{ item.label }}</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { Icon } from 'tdesign-icons-vue-next';
import tdesignLogo from './assets/community-tdesign-logo.png';

const contributorsUrl = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/list';

const networkPoints = [
  { x: 216, y: 24 },
  { x: 328, y: 52 },
  { x: 396, y: 137 },
  { x: 408, y: 246 },
  { x: 350, y: 348 },
  { x: 254, y: 389 },
  { x: 146, y: 386 },
  { x: 64, y: 328 },
  { x: 25, y: 229 },
  { x: 50, y: 126 },
  { x: 136, y: 64 },
  { x: 216, y: 88 },
  { x: 318, y: 153 },
  { x: 307, y: 274 },
  { x: 197, y: 304 },
  { x: 113, y: 265 },
  { x: 112, y: 164 },
] as const;

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

const activities = [
  {
    title: 'feat(button): add loading state props',
    meta: '@alice · 2 小时前 · +42 lines',
    avatar: '👩🏻',
    color: '#d9f5ed',
  },
  {
    title: 'fix: virtualScroll scroll jumps on Safari',
    meta: '@kai · 4 小时前 · 3 files changed',
    avatar: '👨🏻',
    color: '#ffe9bf',
  },
  {
    title: 'Release: tdesign-react v1.9.0 正式发布',
    meta: '@tdesign-bot · 1 天前 · 🎉 Major release',
    avatar: '👩🏻',
    color: '#fbe2f5',
  },
  {
    title: 'chore: docs website tokens refreshed',
    meta: '@marvin · 2 天前 · 12 components',
    avatar: '👨🏻',
    color: '#d9f1ff',
  },
];

const stats = [
  { value: 42, change: '12%', label: '本周新增 PR', color: '#2ba471' },
  { value: 186, change: '38%', label: '本周合并 Commit', color: '#0052d9' },
  { value: 264, change: '12%', label: '活跃 Issue', color: '#e37318' },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isGithubMember(value: string): boolean {
  return !value.includes('🏻');
}

function githubAvatar(value: string): string {
  return `https://avatars.githubusercontent.com/${value}`;
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
    const indexes = randomIndexes(2);
    changingMembers.value = indexes;
    window.setTimeout(() => {
      indexes.forEach((index) => {
        communityMembers.value[index] = contributors[contributorCursor % contributors.length];
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
    const response = await fetch(contributorsUrl);
    const data: unknown = await response.json();
    const design = isRecord(data) && isRecord(data.design) ? data.design : {};
    const names = [
      ...(Array.isArray(design.web) ? design.web : []),
      ...(Array.isArray(design.mobile) ? design.mobile : []),
      ...(Array.isArray(design.chart) ? design.chart : []),
    ];
    contributors = Array.from(new Set(names.map((name) => String(name).trim()).filter(Boolean)));
    if (contributors.length) {
      communityMembers.value = networkPoints.map((_, index) => contributors[index % contributors.length]);
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  fetchContributors();
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

.community-network {
  position: relative;
  width: 432px;
  height: 413px;
  flex: none;

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

  &__logo {
    position: absolute;
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
    border-top: 1px solid var(--component-border);

    &:last-child {
      border-bottom: 1px solid var(--component-border);
    }
  }

  &__title {
    margin: 0 0 4px;
    overflow: hidden;
    font-size: 14px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-placeholder);
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;

    :deep(.t-avatar) {
      font-size: 13px;
    }
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
  gap: 16px;

  &__value {
    display: flex;
    height: 23px;
    align-items: center;
    gap: 4px;

    strong {
      font-family: TCloudNumber, sans-serif;
      font-size: 32px;
      font-weight: 500;
      line-height: 23px;
    }

    span {
      display: flex;
      align-items: center;
      font-size: 12px;
      line-height: 20px;
    }

    .t-icon {
      width: 14px;
      height: 14px;
    }
  }

  p {
    margin: 0;
    color: var(--text-placeholder);
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
  }
}

@media screen and (max-width: 960px) {
  .community-card {
    height: auto;
    min-height: 520px;
    padding: 24px;
    gap: 24px;
  }

  .community-network {
    width: calc(100% - 328px);
    min-width: 280px;
    transform: scale(0.85);
    transform-origin: center;
  }

  .community-activity {
    width: 304px;
  }
}

@media screen and (max-width: 750px) {
  .community-card {
    flex-direction: column;
  }

  .community-network {
    width: 432px;
    max-width: 100%;
    height: 330px;
    transform: scale(0.76);
  }

  .community-activity {
    width: 100%;
  }
}
</style>
