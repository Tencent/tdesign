<template>
  <section class="industry-cases">
    <div class="industry-cases__content">
      <header class="industry-cases__heading">
        <h2>{{ t('home.service.title') }}</h2>
        <p>{{ t('home.service.description') }}</p>
      </header>

      <div class="logo-marquee">
        <div
          v-for="(row, rowIndex) in logoRows"
          :key="rowIndex"
          :class="['logo-marquee__row', `logo-marquee__row--${rowIndex + 1}`]"
        >
          <div v-for="copyIndex in 2" :key="copyIndex" class="logo-marquee__track">
            <div
              v-for="logo in row"
              :key="logo.name"
              class="logo-marquee__item"
              :style="{ width: `${logo.cardWidth}px` }"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                :style="{ width: `${logo.width}px`, height: `${logo.height}px`, objectFit: logo.fit || 'contain' }"
              />
            </div>
          </div>
        </div>
        <div class="logo-marquee__fade logo-marquee__fade--left"></div>
        <div class="logo-marquee__fade logo-marquee__fade--right"></div>
      </div>
    </div>

    <div class="industry-cases__stats">
      <div v-for="stat in stats" :key="stat.value" class="industry-cases__stat">
        <div class="industry-cases__value">
          <strong>{{ stat.value }}</strong>
          <span>{{ t(stat.unitKey) }}</span>
        </div>
        <p>{{ t(stat.labelKey) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import argusLogo from './assets/industry-cases/argus.png';
import codesignLogo from './assets/industry-cases/codesign.svg';
import guojiuLogo from './assets/industry-cases/guojiu.png';
import iwikiLogo from './assets/industry-cases/iwiki.svg';
import kaadasLogo from './assets/industry-cases/kaadas.png';
import qingyanLogo from './assets/industry-cases/qingyan.png';
import taxLogo from './assets/industry-cases/tax.png';
import tencentAdminLogo from './assets/industry-cases/tencent-admin.svg';
import tencentMapLogo from './assets/industry-cases/tencent-map.png';
import tencentSurveyLogo from './assets/industry-cases/tencent-survey.png';
import tencentVideoLogo from './assets/industry-cases/tencent-video.png';
import unimisLogo from './assets/industry-cases/unimis.png';
import wechatPayLogo from './assets/industry-cases/wechat-pay.svg';
import wecomLogo from './assets/industry-cases/wecom.jpg';
import xinyueLogo from './assets/industry-cases/xinyue.png';

import homeMessages from '@/locales/pages/home';

interface LogoItem {
  name: string;
  src: string;
  cardWidth: number;
  width: number;
  height: number;
  fit?: 'contain' | 'cover';
}

const { t } = useI18n({ messages: homeMessages });

const logoRows: LogoItem[][] = [
  [
    { name: '国家税务总局', src: taxLogo, cardWidth: 394, width: 312, height: 50 },
    { name: '国久大数据', src: guojiuLogo, cardWidth: 254, width: 172, height: 44 },
    { name: '腾讯行政', src: tencentAdminLogo, cardWidth: 217, width: 135, height: 28 },
    { name: 'Argus Monitor', src: argusLogo, cardWidth: 258, width: 176, height: 36 },
    { name: '腾讯游戏心悦俱乐部', src: xinyueLogo, cardWidth: 224, width: 142, height: 34 },
  ],
  [
    { name: '青燕和示', src: qingyanLogo, cardWidth: 224, width: 142, height: 36, fit: 'cover' },
    { name: '腾讯视频', src: tencentVideoLogo, cardWidth: 240, width: 158, height: 43 },
    { name: 'CoDesign', src: codesignLogo, cardWidth: 243, width: 161, height: 33 },
    { name: '腾讯问卷', src: tencentSurveyLogo, cardWidth: 244, width: 162, height: 44 },
    { name: '凯迪仕', src: kaadasLogo, cardWidth: 262, width: 180, height: 22, fit: 'cover' },
  ],
  [
    { name: 'UNIMIS-MOM', src: unimisLogo, cardWidth: 96, width: 40, height: 40 },
    { name: 'iWiki', src: iwikiLogo, cardWidth: 195, width: 113, height: 40 },
    { name: '微信支付', src: wechatPayLogo, cardWidth: 232, width: 150, height: 34 },
    { name: '企业微信', src: wecomLogo, cardWidth: 96, width: 40, height: 40, fit: 'cover' },
    { name: '腾讯地图', src: tencentMapLogo, cardWidth: 224, width: 142, height: 40 },
  ],
];

const stats = [
  { value: '8,000', unitKey: 'home.service.stats.projectsUnit', labelKey: 'home.service.stats.projects' },
  { value: '120', unitKey: 'home.service.stats.teamsUnit', labelKey: 'home.service.stats.teams' },
  { value: '5,000', unitKey: 'home.service.stats.downloadsUnit', labelKey: 'home.service.stats.downloads' },
];
</script>

<style scoped lang="less">
@keyframes industry-marquee-left {
  to {
    transform: translateX(-50%);
  }
}

@keyframes industry-marquee-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

.industry-cases {
  width: 100%;
  padding-top: 120px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  background: #fff;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 72px;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: min(888px, calc(100% - 48px));
    text-align: center;

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 36px;
      font-weight: 600;
      line-height: 44px;
    }

    p {
      color: rgba(0, 0, 0, 0.6);
      font-size: 20px;
      font-weight: 300;
      line-height: 28px;
    }
  }

  &__stats {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 160px;
    min-height: 388px;
    margin-top: 0;
    background: url('./assets/industry-cases/pattern.png') center / cover no-repeat;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    min-width: 206px;

    > p {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      white-space: nowrap;
    }
  }

  &__value {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    height: 56px;
    white-space: nowrap;

    strong {
      font-family: 'DIN Alternate', 'Roboto Mono', sans-serif;
      font-size: 52px;
      font-weight: 400;
      line-height: 56px;
    }

    span {
      font-size: 40px;
      font-weight: 300;
      line-height: 52px;
    }
  }
}

.logo-marquee {
  position: relative;
  width: 100%;
  height: 296px;
  overflow: hidden;

  &__row {
    position: absolute;
    left: 0;
    display: flex;
    gap: 16px;
    width: max-content;
    will-change: transform;

    &:hover {
      animation-play-state: paused;
    }

    &--1 {
      top: 0;
      animation: industry-marquee-left 42s linear infinite;
    }

    &--2 {
      top: 104px;
      padding-left: 16px;
      animation: industry-marquee-right 38s linear infinite;
    }

    &--3 {
      top: 208px;
      gap: 12px;
      animation: industry-marquee-left 34s linear infinite;

      .logo-marquee__track {
        gap: 12px;
      }
    }
  }

  &__track {
    display: flex;
    gap: 16px;
  }

  &__item {
    display: flex;
    flex: none;
    justify-content: center;
    align-items: center;
    height: 88px;
    padding: 0 28px;
    overflow: hidden;
    background: #fafafa;
    border-radius: 14px;

    img {
      display: block;
      flex: none;
    }
  }

  &__fade {
    position: absolute;
    z-index: 2;
    top: 0;
    width: 15%;
    height: 100%;
    pointer-events: none;

    &--left {
      left: 0;
      background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
    }

    &--right {
      right: 0;
      background: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
}

@media screen and (max-width: 960px) {
  .industry-cases {
    padding-top: 80px;

    &__content {
      gap: 48px;
    }

    &__heading {
      h2 {
        font-size: 30px;
        line-height: 40px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }

    &__stats {
      gap: 48px;
      min-height: 320px;
    }

    &__stat {
      min-width: 150px;
    }

    &__value {
      strong {
        font-size: 40px;
      }

      span {
        font-size: 28px;
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .industry-cases {
    &__stats {
      flex-direction: column;
      gap: 32px;
      padding: 48px 24px;
    }
  }

  .logo-marquee {
    transform-origin: top left;

    &__fade {
      width: 24%;
    }
  }
}
</style>
