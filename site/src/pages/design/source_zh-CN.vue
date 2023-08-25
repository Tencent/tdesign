<template>
  <div class="tdesign-document tdesign-source-page">
    <div class="tdesign-source-header">
      <div class="content">
        <h1>设计资源</h1>
        <div class="description">
          <p>这里提供 TDesign 相关的设计资源和设计工具的下载，更多设计资源正在整理和完善中。</p>
          <p>
            你可以将反馈建议发送至 tdesign@tencent.com 或提交
            <a href="https://github.com/Tencent/tdesign/issues" target="_blank">issue</a>
          </p>
        </div>

        <td-doc-tabs ref="tabs" :tab="tab"></td-doc-tabs>
      </div>
    </div>

    <div class="tdesign-source-content">
      <div class="tdesign-source-content-box">
        <h2 class="tdesign-source-content__title">资源预览</h2>
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
            class="tdesign-source-content__list-item"
            v-for="item in sourceList"
            :key="item.title"
            @click="handleSourceClick(item)"
            :disabled="item.status === -1"
          >
            <div class="tdesign-source-content__list-item-inner">
              <div :class="['mask', [item.icon]]"></div>
              <span class="source-tag new" v-if="item.status === 1">最新</span>
              <span class="source-tag doing" v-else-if="item.status === 2">更新中</span>
              <span class="source-tag todo" v-else-if="item.status === -1">待上线</span>
              <img :src="iconMap[item.icon]" class="source-icon" width="32" />
              <h3 class="source-title">{{ item.title }}</h3>
              <div class="source-detail">
                <span class="source-detail-watch" v-if="item.watch">
                  <t-icon name="browse" size="16px" />
                  {{ item.watch }}
                </span>
                <span class="source-detail-time">
                  <t-icon name="history" size="16px" />
                  {{ item.lastUpdated }}
                </span>
                <t-icon
                  class="source-detail-action"
                  name="download"
                  size="16px"
                  v-if="item.actionType === 'download'"
                />
                <t-icon class="source-detail-action" name="jump" size="16px" v-else-if="item.actionType === 'jump'" />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="tdesign-source-content-box">
        <h2 class="tdesign-source-content__title">贡献者</h2>
        <!-- <a class="contributor-link" href="" target="_blank">怎样参与 TDesign 设计资源开源共建？</a> -->
        <div class="contributor-list">
          <a
            class="contributor-avatar"
            :href="'https://github.com/' + user"
            target="_blank"
            v-for="user in designContributor"
            :key="user"
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

<script>
import figmaIcon from './assets/source/figma-logo.svg';
import sketchIcon from './assets/source/sketch-logo.svg';
import xdIcon from './assets/source/xd-logo.svg';
import axureIcon from './assets/source/axure-logo.svg';
import codesignIcon from './assets/source/codesign-logo.svg';
import jssjIcon from './assets/source/jssj-logo.svg';
import pixsoIcon from './assets/source/pixso-logo.svg';
import mdIcon from './assets/source/md-logo.svg';
import mastergoIcon from './assets/source/mastergo-logo.svg';
import ryIcon from './assets/source/ry-logo.svg';

import { webSourceList, mobileSourceList, sourceDownloadUrl, webChartSourceList } from '@/consts';
import { webDesignContributor, mobileDesignContributor, webChartDesignContributor } from '@/contributor';

export default {
  data () {
    return {
      webSourceList,
      mobileSourceList,
      webChartSourceList,
      webDesignContributor,
      mobileDesignContributor,
      webChartDesignContributor,
      iconMap: {
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
      },
      previewUrl: {
        web: 'https://codesign.qq.com/s/dqN2925D7qjaBXe?active-screen=xDP39qAvLNl9wlK&menu_aside=null&minimap=close',
        mobile: 'https://codesign.qq.com/s/YDgGjYv28y9wEVQ?active-screen=GD5OjERAdXO93eA&menu_aside=null&minimap=close',
        'web-chart':
          'https://codesign.qq.com/s/kv8398d7m59nKeg?active-screen=6ym7ZRGAEOYjAYE&menu_aside=null&minimap=close',
      },
    };
  },
  computed: {
    designContributor() {
      const map = {
        web: this.webDesignContributor,
        mobile: this.mobileDesignContributor,
        'web-chart': this.webChartDesignContributor,
      };
      return map[this.tab];
    },
    sourceList() {
      const map = {
        web: this.webSourceList,
        mobile: this.mobileSourceList,
        'web-chart': this.webChartSourceList,
      };
      return map[this.tab];
    },
    tab: {
      get() {
        return this.$route.query.tab || 'web';
      },
      set(v) {
        if (this.$route.query.tab !== v) this.$router.push({ query: { tab: v } });
      },
    },
    footerStyle() {
      return {
        '--content-padding-right': '0',
        '--content-max-width': '1440px',
        '--content-padding-left-right': '48px',
        '--footer-inner-position': 'relative',
        '--footer-logo-position': 'unset',
      };
    },
  },

  mounted() {
    this.$refs.tabs.tabs = [
      { tab: 'web', name: '桌面端组件库' },
      { tab: 'mobile', name: '移动端组件库' },
      { tab: 'web-chart', name: '桌面端图表库' },
    ];
    this.$refs.tabs.onchange = ({ detail: currentTab }) => (this.tab = currentTab);
    fetch(sourceDownloadUrl)
      .then((res) => res.json())
      .then((res) => {
        this.webSourceList = this.webSourceList.map((item) => {
          item.watch = res[item.id];
          return item;
        });
        this.mobileSourceList = this.mobileSourceList.map((item) => {
          item.watch = res[item.id];
          return item;
        });
      });
  },

  methods: {
    handleSourceClick(item) {
      if (item.status === -1 || !item.actionUrl) return;

      if (window._horizon) {
        window._horizon.send('资源下载', 'click', item.eventLabel, item.actionUrl);
      }
      window.open(item.actionUrl, '_blank');
    },
  },
};
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
          bottom: 24px;
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
