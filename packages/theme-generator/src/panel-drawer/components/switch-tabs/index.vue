<template>
  <div class="switch-tabs">
    <div class="switch-tabs__panel">
      <div class="border" :style="{ top: `${activeTabIdx * 88}px` }"></div>
      <div
        v-for="(tab, index) in filteredTabs"
        :key="index"
        :class="[
          'switch-tabs__panel-content',
          {
            'switch-tabs__panel-content--active': index === activeTabIdx,
          },
        ]"
        @click="() => handleClickPanel(index)"
      >
        <div v-html="tab.image"></div>
        <p>{{ tab.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLang } from '@/common/i18n';
import { isMobile, themeStore } from '@/common/themes';

import BoxshadowSvg from './boxshadow.svg?raw';
import ColorSvg from './color.svg?raw';
import FontSvg from './font.svg?raw';
import RadiusSvg from './radius.svg?raw';
import SizeSvg from './size.svg?raw';

defineOptions({ name: 'SwitchTabs' });

withDefaults(
  defineProps<{
    activeTabIdx?: number;
  }>(),
  {
    activeTabIdx: 0,
  },
);

const emit = defineEmits<{ changeActiveTab: [idx: number] }>();

const { lang } = useLang();

interface TabItem {
  title: string;
  image: string;
}

const tabs: TabItem[] = [
  {
    title: lang.color.title,
    image: ColorSvg,
  },
  {
    title: lang.font.title,
    image: FontSvg,
  },
  {
    title: lang.borderRadius.title,
    image: RadiusSvg,
  },
  {
    title: lang.shadow.title,
    image: BoxshadowSvg,
  },
  {
    title: lang.size.title,
    image: SizeSvg,
  },
];

const $device = computed(() => themeStore.device);

const filteredTabs = computed(() => {
  // 移动端不显示尺寸配置
  return isMobile($device.value) ? tabs.filter((tab) => tab.title !== lang.size.title) : tabs;
});

function handleClickPanel(idx: number) {
  emit('changeActiveTab', idx);
}
</script>

<style scoped lang="less">
.switch-tabs {
  width: 72px;
  height: 100%;
  position: sticky;
  top: 0;

  &__panel {
    padding: 0 8px;
    position: relative;

    .border {
      position: absolute;
      width: 3px;
      height: 80px;
      left: 0;
      top: 0;
      background: var(--td-brand-color);
      border-radius: 0 9px 9px 0;
      transition: top 0.2s;
    }

    &-content {
      cursor: pointer;
      text-align: center;
      height: 80px;
      width: 56px;
      padding: 4px;
      border-radius: 12px;
      margin-bottom: 8px;
      transition: all 0.2s linear;

      &:hover {
        background-color: var(--bg-color-card);
      }

      > div:not(.border) {
        height: 48px;
        width: 48px;
      }

      > p {
        margin-top: 4px;
        font-size: 12px;
        line-height: 20px;
        color: var(--text-primary);
      }

      :deep(svg) {
        border-radius: 9px;
        font-size: 48px;
      }

      &--active {
        background-color: var(--bg-color-card);
      }
    }
  }
}
</style>
