<template>
  <div :class="['collapse-base', `collapse-base--${variant}`]">
    <div class="collapse-base__header">
      <!-- 左侧圆形图标区 -->
      <slot name="icon"></slot>

      <!-- 中间文本区 -->
      <div class="collapse-base__text" @click="toggleActive">
        <!-- 标题 -->
        <div class="collapse-base__title">
          <slot name="title"></slot>
        </div>
        <!-- 副标题 -->
        <div class="collapse-base__subtitle">
          <slot name="subTitle"></slot>
        </div>
      </div>

      <!-- 右侧箭头区 -->
      <div class="collapse-base__arrow" @click="toggleActive">
        <arrow-icon :is-active="isActive" :overlay-class-name="`${variant}-arrow`" />
      </div>
    </div>

    <!-- 展开内容 -->
    <transition
      name="t-slide-down"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div v-show="isActive" class="collapse-base__content">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import ArrowIcon from 'tdesign-vue/es/common-components/fake-arrow';
import { collapseAnimation, handleAttach } from '../../utils';

/**
 * 基础展开/收起组件
 * 提供统一的展开/收起交互和动画
 */
export default {
  name: 'CollapseBase',
  components: { ArrowIcon },
  props: {
    /**
     * 组件变体 ('default' | 'color')
     * 用于不同的样式和行为
     */
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'color'].includes(value),
    },
  },
  data() {
    return {
      ...collapseAnimation(),
      isActive: false,
    };
  },
  methods: {
    handleAttach,
    /**
     * 切换展开/收起状态
     */
    toggleActive() {
      this.isActive = !this.isActive;
    },
  },
};
</script>

<style scoped lang="less">
.collapse-base {
  padding: 16px 4px 16px 16px;
  border-top: 1px solid var(--theme-component-border);

  &__header {
    display: flex;
    align-items: center;
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
    margin-bottom: 4px;
    font-weight: 600;
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
    cursor: pointer;
  }

  &__content {
    /* 内容区空间预留 */
  }

  /* 默认变体样式 */
  &--default {
    .collapse-base__arrow {
      color: var(--text-primary);
    }

    .default-arrow {
      color: var(--text-primary);
      transform: scale(1.5);
    }
  }

  /* 颜色变体样式 */
  &--color {
    .collapse-base__title {
      font-weight: 500;
    }

    .collapse-base__subtitle {
      color: var(--text-secondary);
    }

    .color-arrow {
      color: var(--text-primary);
      transform: scale(1.5);
      cursor: pointer;
    }
  }
}
</style>
