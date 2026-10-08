<template>
  <div class="tdesign-document">
    <div class="tdesign-source-header">
      <div class="content">
        <h1>{{ t('trade.title') }}</h1>
        <div class="description">
          <p>{{ t('trade.description') }}</p>
        </div>
      </div>
    </div>
    <div class="tdesign-source">
      <div v-for="card in cards" :key="card.key" class="tdesign-trade-card" :class="card.className">
        <div class="info">
          <h2 class="title">{{ t(`trade.cards.${card.key}.title`) }}</h2>
          <p v-for="descriptionKey in card.descriptionKeys" :key="descriptionKey" class="description">
            {{ t(`trade.cards.${card.key}.${descriptionKey}`) }}
          </p>
        </div>
        <a v-if="card.hasLink" :href="card.href" target="_blank">
          <t-button size="large" class="action">{{ t('trade.actions.view') }}</t-button>
        </a>
        <t-button v-else size="large" class="action" theme="default" disabled>
          {{ t('trade.actions.comingSoon') }}
        </t-button>
      </div>
    </div>
    <td-doc-footer :style="footerStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from '@/locales/pages/trade';

interface TradeCard {
  key: string;
  className: string;
  descriptionKeys: string[];
  hasLink?: boolean;
  href?: string;
}

const safeTeamUrl: string | undefined = import.meta.env.VITE_SAFE_TEAM_URL;
const { t } = useI18n({ messages });
const cards: TradeCard[] = [
  {
    key: 'creatorCommerce',
    className: 'power',
    descriptionKeys: ['description'],
    hasLink: true,
    href: 'https://pd.pages.woa.com',
  },
  {
    key: 'travel',
    className: 'travel',
    descriptionKeys: ['description'],
    hasLink: true,
    href: 'http://tmdesign.pages.oa.com/',
  },
  {
    key: 'education',
    className: 'education',
    descriptionKeys: ['description'],
    hasLink: true,
    href: 'https://v.campus.qq.com/edu-design/guide/quickstart.html',
  },
  {
    key: 'healthcare',
    className: 'health',
    descriptionKeys: ['description'],
    hasLink: true,
    href: 'https://caredesign.tencent.com/design-code/vue-pc/default',
  },
  {
    key: 'security',
    className: 'safe',
    descriptionKeys: ['description'],
    hasLink: true,
    href: safeTeamUrl,
  },
  {
    key: 'government',
    className: 'political',
    descriptionKeys: ['description'],
  },
  {
    key: 'map',
    className: 'map',
    descriptionKeys: ['descriptions[0]', 'descriptions[1]'],
  },
];

const footerStyle = computed<CSSProperties>(() => ({
  '--content-padding-right': '0',
  '--content-max-width': '1440px',
  '--content-padding-left-right': '48px',
  '--footer-logo-position': 'unset',
}));
</script>

<style lang="less">
.tdesign-trade-card + .tdesign-trade-card {
  margin-top: 24px;
}

.tdesign-source-header {
  .add {
    position: absolute;
    right: 48px;
    bottom: 48px;
    width: 132px;
    height: 40px;
    padding: 4px;
    background: var(--bg-color-component-transparent);
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--popup-box-shadow);

    a {
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      padding: 5px 8px;
      line-height: 22px;
      color: var(--text-primary);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s linear;

      &:hover {
        background: var(--bg-color-component-hover);
      }
    }

    svg {
      margin-right: 8px;
    }
  }
}

.tdesign-trade-card {
  --base-width: 720;

  position: relative;
  width: 100%;
  max-width: 1760px;
  height: 0;
  border-radius: 6px;
  overflow: hidden;
  padding-bottom: calc(var(--base-width) / 2688 * 100%);

  &.political {
    background-color: #f1e6e3;
    background-image: url('./assets/trade/political.png');
    background-size: 100% auto;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #f1e6e3;

      &::before {
        background: linear-gradient(91.32deg, #f1e6e3 1.12%, rgba(241, 230, 227, 0) 101.08%);
      }
    }
  }

  &.map {
    background-color: #eaecea;
    background-image: url('./assets/trade/map.png');
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #eaecea;

      &::before {
        background: linear-gradient(91.32deg, #eaecea 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  &.education {
    background-color: #e0ece8;
    background-image: url('./assets/trade/education.png');
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #eaecea;

      &::before {
        background: linear-gradient(91.32deg, #eaecea 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  &.health {
    background-color: #ebf4ff;
    background-image: url('./assets/trade/health.png');
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;
  }

  &.safe {
    background-color: #ebf4ff;
    background-image: url('./assets/trade/safe.png');
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;
  }

  &.power {
    background-color: #e3e6eb;
    background-image: url('./assets/trade/power.png');
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #e3e6eb;

      &::before {
        background: linear-gradient(91.32deg, #e3e6eb 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  &.travel {
    background-color: #e3e6eb;
    background-image: url('./assets/trade/travel.png');
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #e3e6eb;

      &::before {
        background: linear-gradient(91.32deg, #e3e6eb 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  .info {
    width: 40%;
    height: 0;
    position: relative;
    padding-bottom: calc(var(--base-width) / 2688 * 100% - 48px);
    padding-left: 48px;
    padding-top: 48px;
    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 100%;
      top: 0;
    }

    .title {
      font-size: 36px;
      line-height: 44px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.9);
    }

    .description {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .action {
    position: absolute;
    left: 48px;
    bottom: 48px;
  }

  @media screen and (max-width: 1200px) {
    .info {
      width: 90%;
      padding-top: 32px;
      padding-left: 32px;
      padding-bottom: calc(var(--base-width) / 2688 * 100% - 32px);

      .title {
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 8px;
      }
    }

    .action.t-button {
      height: 32px;
      padding-left: 16px;
      padding-right: 16px;
      left: 32px;
      bottom: 32px;
    }
  }

  @media screen and (max-width: 960px) {
    --base-width: 860;
  }

  @media screen and (max-width: 750px) {
    --base-width: 1200;
  }

  @media screen and (max-width: 640px) {
    --base-width: 1800;
  }

  @media screen and (max-width: 480px) {
    --base-width: 2600;
  }

  @media screen and (max-width: 400px) {
    --base-width: 3200;
  }

  @media screen and (max-width: 320px) {
    --base-width: 4200;
  }
}
</style>
