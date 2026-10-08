<template>
  <div class="tdesign-document tdesign-source-page">
    <div class="tdesign-source-header">
      <div class="content">
        <h1>{{ t('source.title') }}</h1>
        <div class="description">
          <p>{{ t('source.introduction') }}</p>
          <p>
            {{ t('source.feedback') }}
            <a href="https://github.com/Tencent/tdesign/issues" target="_blank">{{ t('source.issue') }}</a>
          </p>
        </div>

        <td-doc-tabs ref="tabs" :tab="tab"></td-doc-tabs>
      </div>
    </div>

    <div class="tdesign-source-content">
      <div class="tdesign-source-content-box">
        <h2 class="tdesign-source-content__title">{{ t('source.preview') }}</h2>
      </div>
      <div class="tdesign-source-content__iframe-wrap">
        <iframe
          class="tdesign-source-content__iframe"
          :src="previewUrl[tab]"
          width="100%"
          height="100%"
          allowfullscreen
        ></iframe>
      </div>

      <div class="tdesign-source-content-box">
        <ul class="tdesign-source-content__list">
          <li
            v-for="item in sourceList"
            :key="item.title"
            class="tdesign-source-content__list-item"
            :disabled="item.status === -1"
            @click="handleSourceClick(item)"
          >
            <div class="tdesign-source-content__list-item-inner">
              <div :class="['mask', [item.icon]]"></div>
              <span v-if="item.status === 1" class="source-tag new">{{ t('source.status.latest') }}</span>
              <span v-else-if="item.status === 2" class="source-tag doing">{{ t('source.status.updating') }}</span>
              <span v-else-if="item.status === -1" class="source-tag todo">{{ t('source.status.upcoming') }}</span>
              <img :src="iconMap[item.icon]" class="source-icon" width="32" />
              <h3 class="source-title">{{ getSourceTitle(item) }}</h3>
              <div class="source-detail">
                <span v-if="item.watch" class="source-detail-watch">
                  <t-icon name="browse" size="16px" />
                  {{ item.watch }}
                </span>
                <span class="source-detail-time">
                  {{ getSourceDescription(item) }}
                </span>
                <t-icon
                  v-if="item.actionType === 'download'"
                  class="source-detail-action"
                  name="download"
                  size="16px"
                />
                <t-icon v-else-if="item.actionType === 'jump'" class="source-detail-action" name="jump" size="16px" />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="tdesign-source-content-box">
        <h2 class="tdesign-source-content__title">{{ t('source.contributors') }}</h2>
        <div class="contributor-list">
          <a
            v-for="user in designContributor"
            :key="user"
            class="contributor-avatar"
            :href="'https://github.com/' + user"
            target="_blank"
          >
            <t-tooltip :content="user">
              <img :src="'https://avatars.githubusercontent.com/' + user" width="56" />
            </t-tooltip>
          </a>
        </div>
      </div>
    </div>
    <td-doc-footer :style="footerStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type CSSProperties } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import figmaIcon from '@/assets/figma-logo.svg';
import sketchIcon from '@/assets/sketch-logo.svg';
import xdIcon from '@/assets/xd-logo.svg';
import axureIcon from '@/assets/axure-logo.svg';
import codesignIcon from '@/assets/codesign-logo.svg';
import jssjIcon from '@/assets/jssj-logo.svg';
import pixsoIcon from '@/assets/pixso-logo.svg';
import mdIcon from '@/assets/md-logo.svg';
import mastergoIcon from '@/assets/mastergo-logo.svg';
import ryIcon from '@/assets/ry-logo.svg';

import { webSourceList, mobileSourceList, sourceDownloadUrl, webChartSourceList } from '@/constants';
import messages from '@/locales/pages/design-shell';

const contributorsUrl = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/list';

type ResourceTab = 'web' | 'mobile' | 'web-chart';
type SourceIcon = 'figma' | 'sketch' | 'xd' | 'axure' | 'codesign' | 'jssj' | 'pixso' | 'md' | 'mastergo' | 'ry';
type SourceActionType = 'download' | 'jump';

interface SourceItem {
  title: string;
  eventLabel: string;
  actionUrl?: string;
  description: string;
  descriptionEn: string;
  status: number;
  icon: SourceIcon;
  actionType: SourceActionType;
  id: string;
  watch?: string | number;
}

interface TabOption {
  tab: ResourceTab | 'icons';
  name: string;
}

type DocTabsElement = HTMLElement & {
  tabs: TabOption[];
};

interface HorizonReporter {
  send(category: string, action: string, label: string, url: string): void;
}

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n({ messages });
const tabs = ref<DocTabsElement | null>(null);
const toSourceItem = (item: (typeof webSourceList)[number] | (typeof mobileSourceList)[number]): SourceItem => ({
  ...item,
  icon: item.icon as SourceIcon,
  actionType: item.actionType as SourceActionType,
});
const currentWebSourceList = ref<SourceItem[]>(webSourceList.map(toSourceItem));
const currentMobileSourceList = ref<SourceItem[]>(mobileSourceList.map(toSourceItem));
const webDesignContributor = ref<string[]>([]);
const mobileDesignContributor = ref<string[]>([]);
const webChartDesignContributor = ref<string[]>([]);
const iconMap = {
  figma: figmaIcon,
  sketch: sketchIcon,
  xd: xdIcon,
  axure: axureIcon,
  codesign: codesignIcon,
  jssj: jssjIcon,
  pixso: pixsoIcon,
  md: mdIcon,
  mastergo: mastergoIcon,
  ry: ryIcon,
};
const previewUrl = {
  web: 'https://codesign.qq.com/s/705849079455594?menu_aside=null',
  mobile: 'https://codesign.qq.com/s/705854516818782?menu_aside=null',
  'web-chart': 'https://codesign.qq.com/s/705850116517658?menu_aside=null',
};
const tabList = computed<TabOption[]>(() => [
  { tab: 'web', name: t('source.tabs.web') },
  { tab: 'mobile', name: t('source.tabs.mobile') },
  { tab: 'web-chart', name: t('source.tabs.webChart') },
  { tab: 'icons', name: t('source.tabs.icons') },
]);
const resourceTabs: ResourceTab[] = ['web', 'mobile', 'web-chart'];
const isResourceTab = (value: unknown): value is ResourceTab =>
  typeof value === 'string' && resourceTabs.includes(value as ResourceTab);
const tab = computed<ResourceTab>({
  get: () => (isResourceTab(route.query.tab) ? route.query.tab : 'web'),
  set: (value: ResourceTab) => {
    if (route.query.tab !== value) router.push({ query: { tab: value } });
  },
});
const designContributor = computed<string[]>(() => {
  const map: Record<ResourceTab, string[]> = {
    web: webDesignContributor.value,
    mobile: mobileDesignContributor.value,
    'web-chart': webChartDesignContributor.value,
  };
  return map[tab.value];
});
const sourceList = computed<SourceItem[]>(() => {
  const map: Record<ResourceTab, SourceItem[]> = {
    web: currentWebSourceList.value,
    mobile: currentMobileSourceList.value,
    'web-chart': webChartSourceList.map((item) => ({
      ...item,
      icon: item.icon as SourceIcon,
      actionType: item.actionType as SourceActionType,
    })),
  };
  return map[tab.value];
});
const footerStyle = computed<CSSProperties>(() => ({
  '--content-padding-right': '0',
  '--content-max-width': '1440px',
  '--content-padding-left-right': '48px',
  '--footer-inner-position': 'relative',
  '--footer-logo-position': 'unset',
}));
const getSourceDescription = (item: SourceItem) => (locale.value === 'en-US' ? item.descriptionEn : item.description);
const getSourceTitle = (item: SourceItem) => t(`source.resourceTitles.${item.id}`);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const normalizeContributors = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  return value.reduce<string[]>((result, name) => {
    if (typeof name !== 'string') return result;
    const trimmed = name.trim();
    const key = trimmed.toLowerCase();
    if (trimmed && !seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
    return result;
  }, []);
};

const fetchDesignContributors = async () => {
  try {
    const response = await fetch(contributorsUrl);
    const data: unknown = await response.json();
    const design = isRecord(data) && isRecord(data.design) ? data.design : {};

    webDesignContributor.value = normalizeContributors(design.web);
    mobileDesignContributor.value = normalizeContributors(design.mobile);
    webChartDesignContributor.value = normalizeContributors(design.chart);
  } catch (error: unknown) {
    console.error(error);
  }
};

const handleSourceClick = (item: SourceItem) => {
  if (item.status === -1 || !item.actionUrl) return;

  const horizon = (window as Window & { _horizon?: HorizonReporter })._horizon;
  if (horizon) {
    horizon.send('资源下载', 'click', item.eventLabel, item.actionUrl);
  }
  window.open(item.actionUrl, '_blank');
};

const fetchDownloadCounts = async () => {
  try {
    const response = await fetch(sourceDownloadUrl);
    const data: unknown = await response.json();
    if (!isRecord(data)) return;

    const withWatchCount = (item: SourceItem): SourceItem => {
      const watch = data[item.id];
      return typeof watch === 'string' || typeof watch === 'number' ? { ...item, watch } : item;
    };
    currentWebSourceList.value = currentWebSourceList.value.map(withWatchCount);
    currentMobileSourceList.value = currentMobileSourceList.value.map(withWatchCount);
  } catch (error: unknown) {
    console.error(error);
  }
};

watch(tabList, (list: TabOption[]) => {
  if (tabs.value) tabs.value.tabs = list;
});

onMounted(() => {
  if (tabs.value) {
    tabs.value.tabs = tabList.value;
    tabs.value.onchange = (event: Event) => {
      const { detail: currentTab } = event as CustomEvent<string>;
      if (isResourceTab(currentTab)) tab.value = currentTab;
      else if (currentTab === 'icons') window.open(locale.value === 'en-US' ? '/icons-en' : '/icons', '_blank');
    };
  }
  fetchDesignContributors();
  fetchDownloadCounts();
});
</script>

<style lang="less" scoped>
.tdesign-document {
  background: none;
}

.tdesign-source-page {
  --source-page-padding: 48px;

  @media screen and (max-width: 959px) {
    --source-page-padding: 24px;
  }

  @media screen and (max-width: 1344px) {
    --iframe-height: calc((100vw - 48px * 2) * (632 / 1344));
    --iframe-border: none;
    --iframe-border-radius: 0;
  }

  .tdesign-source-header {
    box-shadow: var(--header-box-shadow);

    .content {
      position: relative;

      td-doc-tabs {
        position: absolute;
        left: var(--source-page-padding);
      }
    }
  }

  .tdesign-source-content {
    background: none;
    overflow: hidden;

    &-box {
      padding: 0 var(--source-page-padding);
      max-width: 1440px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    &__title {
      margin-top: 72px;
      color: var(--text-primary);
    }

    &__iframe {
      border-radius: var(--iframe-border-radius, 6px);
      padding: 0;
      border: 0;
      height: var(--iframe-height, 576px);
      min-height: 376px;
      max-height: 576px;
      display: block;
      margin-top: -56px;

      &-wrap {
        border-radius: var(--iframe-border-radius, 6px);
        overflow: hidden;
        margin: 24px auto 48px;
        max-width: 1344px;
        border: var(--iframe-border, 1px solid var(--component-border));
        box-sizing: border-box;
      }
    }

    &__list {
      --item-width: calc((100% - 24px * 3) / 4);

      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      list-style: none;
      padding: 0;
      margin: 0;

      @media screen and (max-width: 1200px) {
        --item-width: calc((100% - 24px * 2) / 3);
      }

      @media screen and (max-width: 959px) {
        --item-width: calc((100% - 24px) / 2);
      }

      @media screen and (max-width: 639px) {
        --item-width: 100%;
      }

      &-item {
        width: var(--item-width);
        position: relative;
        cursor: pointer;
        overflow: hidden;
        box-sizing: border-box;
        padding: 1px;
        border-radius: 10px;

        &[disabled] {
          cursor: no-drop;
        }

        &::after {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: conic-gradient(from 187.79deg at 50% 50%, #4ceb1b 0deg, #0062ff 180deg, #4ceb1b 360deg);
          z-index: -1;
          visibility: hidden;
          opacity: 0;
          transition: all 0.2s linear;
        }

        &-inner {
          display: flex;
          gap: 8px;
          border-radius: 9px;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
          height: 128px;
          box-sizing: border-box;
          background: var(--td-bg-color-resource);
        }

        &:hover {
          &::after {
            opacity: 1;
            visibility: visible;
          }

          .source-detail-action {
            opacity: 1;
            visibility: visible;
          }
        }

        .mask {
          position: absolute;
          width: 400px;
          height: 400px;
          left: 0;
          top: 0;
          border-radius: 100%;
          filter: blur(50px);
          pointer-events: none;
          z-index: 10;

          &.figma {
            background: radial-gradient(50% 50% at 50% 50%, rgba(242, 78, 30, 0.1) 0%, rgba(242, 78, 30, 0) 100%);
            animation: maskRun1 20s linear infinite;
          }

          &.sketch {
            background: radial-gradient(50% 50% at 50% 50%, rgba(253, 173, 0, 0.1) 0%, rgba(253, 173, 0, 0) 100%);
            animation: maskRun2 20s linear infinite;
          }

          &.axure {
            background: radial-gradient(50% 50% at 50% 50%, rgba(246, 94, 199, 0.1) 0%, rgba(246, 94, 199, 0) 100%);
            animation: maskRun3 20s linear infinite;
          }

          &.xd {
            background: radial-gradient(50% 50% at 50% 50%, rgba(255, 97, 246, 0.1) 0%, rgba(255, 97, 246, 0) 100%);
            animation: maskRun1 20s linear infinite;
          }

          &.codesign {
            background: radial-gradient(50% 50% at 50% 50%, rgba(0, 199, 248, 0.1) 0%, rgba(0, 199, 248, 0) 100%);
            animation: maskRun2 20s linear infinite;
          }

          &.jssj {
            background: radial-gradient(50% 50% at 50% 50%, rgba(253, 173, 0, 0.1) 0%, rgba(253, 173, 0, 0) 100%);
            animation: maskRun3 20s linear infinite;
          }

          &.pixso {
            background: radial-gradient(50% 50% at 50% 50%, rgba(246, 94, 199, 0.1) 0%, rgba(246, 94, 199, 0) 100%);
            animation: maskRun3 20s linear infinite;
          }

          &.md {
            background: radial-gradient(50% 50% at 50% 50%, rgba(255, 51, 51, 0.1) 0%, rgba(255, 51, 51, 0) 100%);
            animation: maskRun1 20s linear infinite;
          }

          &.mastergo {
            background: radial-gradient(50% 50% at 50% 50%, rgba(57, 112, 227, 0.1) 0%, rgba(57, 112, 227, 0) 100%);
            animation: maskRun2 20s linear infinite;
          }
        }

        .source-tag {
          position: absolute;
          left: 1px;
          top: 1px;
          border-top-left-radius: 9px;
          border-bottom-right-radius: 9px;
          padding: 6px 16px;

          &.new {
            color: var(--success-main);
            background: var(--success-main-light);
          }

          &.doing {
            color: var(--warning-main);
            background: var(--warning-main-light);
          }

          &.todo {
            color: var(--text-secondary);
            background: var(--bg-color-tag);
          }
        }
      }

      .source-icon {
        position: absolute;
        top: 16px;
        right: 16px;
      }

      .source-title {
        color: var(--text-primary);
        font-size: 20px;
      }

      .source-detail {
        display: flex;
        gap: 16px;
        color: var(--text-placeholder);

        &-watch,
        &-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        &-action {
          position: absolute;
          right: 20px;
          bottom: 19px;
          visibility: hidden;
          opacity: 0;
          transition: all 0.2s linear;
        }
      }
    }
  }

  .contributor-link {
    margin: 16px 0 24px;
    display: block;
    text-decoration: none;
  }

  .contributor-list {
    margin-top: 24px;
    margin-bottom: 80px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 16px;
    padding-left: 10px;

    .contributor-avatar {
      margin-left: -10px;

      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 4px solid var(--bg-color-container);
      }
    }
  }
}
</style>
