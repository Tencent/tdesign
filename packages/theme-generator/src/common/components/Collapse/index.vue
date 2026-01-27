<template>
  <div class="common-collapse">
    <div class="common-collapse__header">
      <slot name="round"></slot>
      <div class="common-collapse__text">
        <div class="common-collapse__title" @click="isActive = !isActive">
          <slot name="title"></slot>
        </div>
        <div class="common-collapse__subtitle" @click="handleSubtitleClick">
          <slot name="subTitle"></slot>
        </div>
      </div>
      <div @click="isActive = !isActive">
        <arrow-icon :isActive="isActive" overlayClassName="common-collapse__arrow" />
      </div>
    </div>
    <transition
      name="t-slide-down"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div v-show="isActive">
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script>
import ArrowIcon from 'tdesign-vue/es/common-components/fake-arrow';
import { collapseAnimation, handleAttach } from '../../utils';

export default {
  name: 'CommonCollapse',
  props: {
    title: String,
    colorPalette: Array,
    type: String,
  },
  components: { ArrowIcon },

  data() {
    return {
      ...collapseAnimation(),
      isActive: false,
      isHover: false,
    };
  },
  methods: {
    handleAttach,
    handleSubtitleClick(event) {
      // 检查点击的元素是否是交互元素或其子元素
      const target = event.target;
      const interactiveElements = target.closest('.t-switch, .t-icon, .t-popup, .t-button');
      if (!interactiveElements) {
        this.isActive = !this.isActive;
      }
    },
  },
};
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.common-collapse {
  padding: 16px 4px 16px 16px;
  border-top: 1px solid var(--component-border);

  &__header {
    display: flex;
    align-items: center;

    .block {
      position: relative;
      border-radius: 6px;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: transparent;
        border-radius: 6px;
      }
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 12px;
    font-size: 14px;
    line-height: 22px;
    flex: 1;
    cursor: pointer;
  }

  &__title {
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-primary);
  }

  &__subtitle {
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 20px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    /deep/ .t-icon {
      margin-left: 4px;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: var(--text-primary);
      }
    }
  }

  &__arrow {
    color: var(--text-primary);
    transform: scale(1.5);
    cursor: pointer;
  }
}
</style>
