<template>
  <section
    ref="resourceSectionRef"
    class="resource-section"
    :style="{
      '--mobile-section-height': mobileSectionHeight,
      '--tablet-layout-scale': tabletLayoutScale,
      '--tablet-section-height': tabletSectionHeight,
    }"
  >
    <div ref="resourceLayoutRef" class="resource-section__layout">
      <header class="resource-section__heading">
        <h2>{{ t('home.resources.title') }}</h2>
        <p>{{ t('home.resources.description') }}</p>
      </header>

      <div class="resource-grid">
        <article
          v-for="card in resourceCards"
          :key="card.title"
          :class="['resource-card', `resource-card--${card.type}`]"
          @mousemove="updateResourceIllustrationHover(card.type, $event)"
          @mouseleave="leaveResourceCard(card.type)"
        >
          <div class="resource-card__illustration" aria-hidden="true">
            <div :ref="(element) => setResourceSprite(card.type, element)" class="resource-card__frames"></div>
          </div>

          <div class="resource-card__content">
            <span class="resource-card__label">{{ card.label }}</span>
            <div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </div>

          <div class="resource-card__items">
            <a
              v-for="item in card.items"
              :key="item.name"
              class="resource-item"
              :class="{ 'resource-item--single-line': !releaseDates[item.releaseKey] }"
              :href="item.href"
              referrerpolicy="no-referrer"
            >
              <img :src="item.logo" :alt="t('home.resources.logoAlt', { name: item.name })" />
              <span class="resource-item__name">{{ item.name }}</span>
              <span v-if="releaseDates[item.releaseKey]" class="resource-item__updated">
                {{ formatUpdatedAt(releaseDates[item.releaseKey]) }}
              </span>
              <span v-else class="resource-item__updated" aria-hidden="true"></span>
              <span class="resource-item__action">{{ t('home.resources.enterAction') }}</span>
            </a>
            <span
              v-if="card.type === 'icons'"
              class="resource-item resource-item--placeholder"
              aria-hidden="true"
            ></span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ThemeMode } from '@/pages/types';
import homeMessages from '@/locales/pages/home';
import { createResourceCards } from './logic/resource-section/cards';
import { createResourceLayout } from './logic/resource-section/layout';
import { createResourceReleases } from './logic/resource-section/releases';
import { createResourceSprite } from './logic/resource-section/sprite';

const props = withDefaults(defineProps<{ themeMode?: ThemeMode }>(), {
  themeMode: 'light',
});

const { t, locale } = useI18n({ messages: homeMessages });
const resourceCards = createResourceCards(t);
const { releaseDates, formatUpdatedAt } = createResourceReleases(locale);
const { drawResourceFrames, setResourceSprite, updateResourceIllustrationHover, leaveResourceCard } =
  createResourceSprite(toRef(props, 'themeMode'));
const { resourceSectionRef, resourceLayoutRef, mobileSectionHeight, tabletLayoutScale, tabletSectionHeight } =
  createResourceLayout(drawResourceFrames);
</script>

<style lang="less" scoped>
.resource-section {
  position: relative;
  left: 50%;
  width: 1512px;
  padding: 80px 116px 60px;
  box-sizing: border-box;
  color: var(--text-primary);
  transform: translateX(-50%);

  &__layout {
    display: contents;
  }

  &__heading {
    margin-bottom: 64px;

    h2 {
      margin: 0 0 20px;
      font-size: 36px;
      font-weight: 600;
      line-height: 44px;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 300;
      line-height: 28px;
    }
  }
}

.resource-grid {
  display: grid;
  width: 1280px;
  grid-template-columns: 528px 736px;
  gap: 16px;
}

.resource-card {
  position: relative;
  display: flex;
  min-width: 0;
  height: 308px;
  padding: 32px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 12px;
  background: var(--bg-color-card);

  &::before {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    content: '';
    pointer-events: none;
    filter: blur(100px);
    transform-origin: center;
    will-change: transform;
  }

  &--mobile::before {
    top: -260px;
    left: 348px;
    width: 440px;
    height: 440px;
    background: linear-gradient(246deg, #b5fff5 44.26%, #4794ff 63.43%, #3700ff 89.4%);
    opacity: 0.12;
    animation: resource-glow-mobile 14s ease-in-out infinite;
  }

  &--aigc::before {
    top: 32px;
    left: 44px;
    width: 430px;
    height: 430px;
    background: linear-gradient(221deg, #b5c7ff 50%, #c574ff 62.12%, #ff47d4 74.43%, #ff0004 90.66%);
    opacity: 0.1;
    animation: resource-glow-aigc 16s ease-in-out -5s infinite;
  }

  &--icons::before {
    top: 120px;
    left: 120px;
    width: 430px;
    height: 430px;
    background: linear-gradient(221deg, #ffb5b5 50%, #ffd874 62.12%, #ceff47 74.43%, #6fff00 90.66%);
    opacity: 0.1;
    animation: resource-glow-icons 15s ease-in-out -9s infinite;
  }

  &:nth-child(3) {
    grid-column: 1;
    width: 600px;
  }

  &:nth-child(4) {
    grid-column: 2;
    margin-left: 72px;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 3px;
    background: var(--brand-main-light);
    color: var(--brand-main);
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
  }

  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    padding: 0 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    h3 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
    }
  }

  &__items {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__illustration {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 12px;
    width: 180px;
    height: 180px;
    opacity: 0.7;
    pointer-events: auto;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .resource-card__frames {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 900% 300%;
    }
  }

  &--mobile &__illustration {
    top: 0;
    right: 12px;
  }

  &--mobile {
    width: 736px;
  }

  &--aigc &__illustration {
    top: 0;
    right: 12px;
    left: auto;
  }

  &--icons &__illustration {
    top: 20px;
    right: 12px;
    left: auto;
    width: 268px;
    height: 268px;
    opacity: 1;

    img,
    .resource-card__frames {
      width: 268px;
      height: 268px;
      object-fit: contain;
      transform: none;
    }
  }

  &--icons {
    width: 664px;
  }
}

@keyframes resource-glow-mobile {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(0.96);
  }

  25% {
    transform: translate3d(-180px, 180px, 0) rotate(90deg) scale(1.06);
  }

  50% {
    transform: translate3d(-360px, 120px, 0) rotate(180deg) scale(0.94);
  }

  75% {
    transform: translate3d(-180px, 240px, 0) rotate(270deg) scale(1.08);
  }
}

@keyframes resource-glow-aigc {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(0.94);
  }

  25% {
    transform: translate3d(140px, -100px, 0) rotate(90deg) scale(1.08);
  }

  50% {
    transform: translate3d(80px, -220px, 0) rotate(180deg) scale(0.96);
  }

  75% {
    transform: translate3d(-100px, -100px, 0) rotate(270deg) scale(1.04);
  }
}

@keyframes resource-glow-icons {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1.04);
  }

  25% {
    transform: translate3d(140px, -140px, 0) rotate(90deg) scale(0.94);
  }

  50% {
    transform: translate3d(0, -260px, 0) rotate(180deg) scale(1.08);
  }

  75% {
    transform: translate3d(-140px, -120px, 0) rotate(270deg) scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resource-card::before {
    animation: none;
    will-change: auto;
  }
}

.resource-item {
  display: flex;
  width: 100px;
  height: 100px;
  padding: 8px 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 12px;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-color-demo-hover);
  }

  img {
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 16px;
    line-height: 24px;
  }

  &__updated,
  &__action {
    min-height: 20px;
    color: var(--text-placeholder);
    font-size: 12px;
    font-weight: 300;
    line-height: 20px;
  }

  &__updated {
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  &__action {
    display: none;
  }

  &:hover &__updated {
    display: none;
  }

  &:hover &__action {
    display: block;
  }
}

.resource-card--icons .resource-card__items {
  justify-content: flex-start;
  gap: 16px;
}

.resource-card .resource-item--placeholder {
  display: none;
}

@media screen and (min-width: 1200px) and (max-width: 1375px) {
  .resource-section {
    width: 100vw;
    padding-right: 48px;
    padding-left: 48px;
  }

  .resource-grid {
    width: 100%;
    grid-template-columns: minmax(0, 528fr) minmax(0, 736fr);
  }

  .resource-card {
    &--web,
    &--mobile {
      padding-right: 24px;
      padding-left: 24px;
    }

    &:nth-child(3) {
      width: calc(100% + 72px);
    }

    &:nth-child(4) {
      width: calc(100% - 72px);
      margin-left: 72px;
    }

    &--mobile {
      width: 100%;
    }

    &--icons {
      width: calc(100% - 72px);
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1280px) {
  .resource-card--icons .resource-card__illustration {
    right: 0;
    width: 256px;
    height: 256px;

    img,
    .resource-card__frames {
      width: 100%;
      height: 100%;
    }
  }
}

@media screen and (max-width: 1199px) {
  .resource-section {
    width: 100vw;
    padding-right: 48px;
    padding-left: 48px;
  }

  .resource-grid {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .resource-card,
  .resource-card:nth-child(3),
  .resource-card:nth-child(4) {
    grid-column: 1;
    width: 100%;
    margin-left: 0;
  }

  .resource-card__illustration {
    display: none;
  }
}

@media screen and (min-width: 960px) and (max-width: 1199px) {
  .resource-section {
    width: 100vw;
    height: var(--tablet-section-height);
    padding: 0 0 60px;
    overflow: hidden;

    &__layout {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 960px;
      padding: 80px 24px 60px;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      gap: 64px;
      transform: scale(var(--tablet-layout-scale));
      transform-origin: top left;
    }

    &__heading {
      width: 912px;
      box-sizing: border-box;
      margin: 0;

      h2 {
        margin-bottom: 20px;
      }
    }
  }

  .resource-grid {
    width: 912px;
    gap: 16px;
  }

  .resource-card,
  .resource-card:nth-child(3),
  .resource-card:nth-child(4) {
    width: 912px;
    height: auto;
    min-height: 224px;
    padding: 32px;
    margin: 0;
    justify-content: flex-start;
    gap: 24px;
  }

  .resource-card {
    &__items {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(4, 200px);
      justify-content: space-between;
      column-gap: 0;
      row-gap: 8px;
    }

    &--mobile &__illustration {
      top: 0;
      right: 12px;
      width: 280px;
      height: 280px;
    }

    &--mobile &__items {
      width: 100%;
    }

    &--aigc &__illustration {
      top: 0;
      right: 12px;
      left: auto;
      width: 300px;
      height: 300px;
    }

    &--icons &__illustration {
      top: 20px;
      right: 12px;
      left: auto;
      width: 340px;
      height: 340px;

      img,
      .resource-card__frames {
        width: 100%;
        height: 100%;
        transform: none;
      }
    }

    &--icons &__items {
      justify-content: space-between;
      column-gap: 0;
    }
  }

  .resource-item {
    display: grid;
    width: 200px;
    min-width: 200px;
    height: 64px;
    padding: 12px 24px 12px 16px;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 24px 20px;
    column-gap: 8px;
    row-gap: 0;

    img {
      width: 40px;
      height: 40px;
      margin: 0;
      grid-row: 1 / 3;
    }

    &__name {
      grid-column: 2;
      grid-row: 1;
    }

    &__updated,
    &__action {
      grid-column: 2;
      grid-row: 2;
    }
  }
}

@media screen and (min-width: 597px) and (max-width: 750px) {
  .resource-section {
    padding: 0 24px 60px;

    &__heading {
      margin-bottom: 36px;

      h2 {
        font-size: 28px;
        line-height: 36px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .resource-card {
    height: auto;
    min-height: 308px;
    padding: 24px 16px;

    &__items {
      margin-top: 44px;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 8px;
    }

    &__illustration {
      opacity: 0.7;
    }
  }

  .resource-item {
    width: calc(33.333% - 6px);
  }
}

@media screen and (min-width: 751px) and (max-width: 959px) {
  .resource-section {
    padding-top: 0;
    padding-right: 24px;
    padding-left: 24px;
  }
}

@media screen and (min-width: 700px) and (max-width: 959px) {
  .resource-card {
    height: auto;
    min-height: 0;
    gap: 24px;
    justify-content: flex-start;

    &__items {
      display: grid;
      width: 100%;
      margin-top: 0;
      grid-template-columns: repeat(auto-fit, minmax(164px, 200px));
      justify-content: space-between;
      gap: 8px;
    }

    &--icons &__items {
      grid-template-columns: repeat(3, minmax(164px, 200px));
      justify-content: space-between;
      gap: 8px;
    }
  }

  .resource-card .resource-item--placeholder {
    display: grid;
    visibility: hidden;
    pointer-events: none;
  }

  .resource-item {
    display: grid;
    width: 100%;
    min-width: 0;
    height: 64px;
    padding: 12px 24px 12px 16px;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 24px 20px;
    column-gap: 8px;
    row-gap: 0;

    img {
      width: 40px;
      height: 40px;
      margin: 0;
      grid-row: 1 / 3;
    }

    &__name {
      grid-column: 2;
      grid-row: 1;
    }

    &__updated,
    &__action {
      grid-column: 2;
      grid-row: 2;
    }
  }
}

@media screen and (min-width: 700px) and (max-width: 1199px) {
  .resource-item--single-line:not(:hover) .resource-item__name {
    grid-row: 1 / 3;
    align-self: center;
  }
}

@media screen and (max-width: 699px) {
  .resource-section {
    left: 50%;
    width: 100vw;
    height: var(--mobile-section-height);
    padding: 0 24px 60px;
    overflow: hidden;
    transform: translateX(-50%);

    &__layout {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      padding: 60px 24px;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
    }

    &__heading {
      width: 100%;
      padding: 0;
      box-sizing: border-box;
      margin: 0;

      h2 {
        margin-bottom: 12px;
        font-size: 28px;
        line-height: 35px;
      }

      p {
        font-size: 12px;
        line-height: 17px;
      }
    }
  }

  .resource-grid {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .resource-card,
  .resource-card:nth-child(3),
  .resource-card:nth-child(4) {
    width: 100%;
    height: auto;
    min-height: 0;
    padding: 24px;
    margin: 0;
    grid-column: 1;
    justify-content: flex-start;
    gap: 16px;

    &::after {
      position: absolute;
      z-index: 0;
      width: 440px;
      height: 440px;
      border-radius: 50%;
      content: '';
      filter: blur(100px);
      pointer-events: none;
    }
  }

  .resource-card {
    &__content {
      padding: 0;
      gap: 16px;

      h3 {
        margin-bottom: 8px;
        font-size: 20px;
        line-height: 30px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
      }
    }

    &__items {
      margin: 0;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;
    }

    &__illustration {
      display: none;
    }

    &--web::after {
      display: none;
    }

    &--mobile::after {
      top: -370px;
      left: 98px;
      background: linear-gradient(246deg, #b5fff5 44.26%, #4794ff 63.43%, #3700ff 89.4%);
      opacity: 0.12;
    }

    &--aigc::after {
      top: 250px;
      left: 138px;
      background: linear-gradient(221deg, #b5c7ff 50%, #c574ff 62.12%, #ff47d4 74.43%, #ff0004 90.66%);
      opacity: 0.1;
    }

    &--icons::after {
      top: 170px;
      left: 138px;
      background: linear-gradient(221deg, #ffb5b5 50%, #ffd874 62.12%, #ceff47 74.43%, #6fff00 90.66%);
      opacity: 0.1;
    }

    &--icons &__items {
      gap: 4px;
    }
  }

  .resource-item {
    z-index: 1;
    width: calc(100% + 16px);
    height: 48px;
    padding: 12px 8px;
    margin-left: -8px;
    flex: 0 0 48px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
    border-radius: 12px;

    img {
      width: 24px;
      height: 24px;
      margin: 0;
    }

    &__name {
      font-size: 16px;
      line-height: 24px;
      white-space: nowrap;
    }

    &__updated,
    &__action {
      font-size: 12px;
      line-height: 20px;
      white-space: nowrap;
    }
  }
}

@media screen and (max-width: 959px) {
  .resource-section__heading {
    margin-bottom: 24px;

    h2 {
      margin-bottom: 12px;
      font-size: 28px;
      line-height: 36px;
    }

    p {
      font-size: 12px;
      line-height: 20px;
    }
  }
}

@media screen and (max-width: 699px) {
  .resource-card__content p {
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
