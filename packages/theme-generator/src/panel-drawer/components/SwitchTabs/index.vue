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
        <div>
          <component :is="tab.image" />
        </div>
        <p>{{ tab.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, computed, onMounted, markRaw } from 'vue';
import { useLang } from '@/common/i18n';
import { isMobile, themeStore } from '@/common/themes';

import BoxshadowSvg from './BoxshadowSvg.vue';
import ColorSvg from './ColorSvg.vue';
import FontSvg from './FontSvg.vue';
import RadiusSvg from './RadiusSvg.vue';
import SizeSvg from './SizeSvg.vue';

defineProps({
  activeTabIdx: Number,
});

const emit = defineEmits(['changeActiveTab']);

const { lang } = useLang();

const tabs = shallowRef([]);

const filteredTabs = computed(() => {
  // 移动端不显示尺寸配置
  return isMobile(themeStore.device) ? tabs.value.filter((tab) => tab.title !== lang.size.title) : tabs.value;
});

function handleClickPanel(idx) {
  emit('changeActiveTab', idx);
}

onMounted(() => {
  const text = lang;
  tabs.value = [
    {
      title: text.color.title,
      image: markRaw(ColorSvg),
    },
    {
      title: text.font.title,
      image: markRaw(FontSvg),
    },
    {
      title: text.borerRadius.title,
      image: markRaw(RadiusSvg),
    },
    {
      title: text.shadow.title,
      image: markRaw(BoxshadowSvg),
    },
    {
      title: text.size.title,
      image: markRaw(SizeSvg),
    },
  ];
});
</script>

<style scoped lang="less">
.switch-tabs {
  width: 72px;
  height: 100%;
  position: sticky;
  top: 0;

  &__panel {
    padding: 0px 8px;
    position: relative;

    .border {
      position: absolute;
      width: 3px;
      height: 80px;
      left: 0;
      top: 0;
      background: var(--td-brand-color);
      border-radius: 0px 9px 9px 0px;
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

      svg {
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
