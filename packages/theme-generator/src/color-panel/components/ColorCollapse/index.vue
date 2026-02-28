<template>
  <div class="color-collapse">
    <div class="color-collapse__header">
      <t-popup
        placement="left"
        showArrow
        trigger="click"
        :destroyOnClose="true"
        :attach="handleAttach"
        :overlayStyle="{ borderRadius: '9px' }"
        :hideEmptyPopup="true"
      >
        <div
          class="block"
          :style="{
            width: '48px',
            height: '48px',
            background: mainColor,
            borderRadius: '6px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            border: '1px solid var(--theme-component-border)',
            'justify-content': 'center',
            'align-items': 'center',
            color: 'var(--text-anti)',
          }"
          @mouseover="isHover = true"
          @mouseleave="isHover = false"
        >
          <transition name="fade">
            <edit-1-icon v-if="!disabled && isHover" size="24px" />
          </transition>
        </div>
        <template #content v-if="!disabled">
          <color-picker :value="mainColor" @change="changeColor" />
        </template>
      </t-popup>
      <div class="color-collapse__text">
        <div class="color-collapse__title" @click="isActive = !isActive">
          {{ title }}
        </div>
        <div class="color-collapse__subtitle" @click="handleSubtitleClick" :style="{ color: 'var(--text-secondary)' }">
          <slot name="subTitle">
            <!-- 没有 slot 时使用默认内容 -->
            HEX: {{ mainColor }}
            <t-popup
              placement="top"
              showArrow
              trigger="click"
              :destroyOnClose="true"
              :attach="handleAttach"
              :overlayStyle="{ borderRadius: '6px' }"
            >
              <file-copy-icon @click="() => copyHex(mainColor)" />
              <template #content>
                <span :style="{ color: `var(--text-secondary)` }">{{ lang.copied }}</span>
              </template>
            </t-popup>
          </slot>
        </div>
      </div>
      <div @click="isActive = !isActive">
        <arrow-icon :isActive="isActive" overlayClassName="color-collapse__arrow" />
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
      <slot v-if="isActive"></slot>
    </transition>
  </div>
</template>
<script>
import { Edit1Icon, FileCopyIcon } from 'tdesign-icons-vue';
import { Popup as TPopup } from 'tdesign-vue';
import ArrowIcon from 'tdesign-vue/es/common-components/fake-arrow';

import { ColorPicker } from '@/common/components';
import { langMixin } from '@/common/i18n';
import { collapseAnimation, handleAttach } from '@/common/utils';

export default {
  name: 'ColorCollapse',
  props: {
    type: String,
    title: String,
    mainColor: String,
    disabled: Boolean,
  },
  mixins: [langMixin],
  components: { FileCopyIcon, ArrowIcon, TPopup, Edit1Icon, ColorPicker },
  data() {
    return {
      ...collapseAnimation(),
      isActive: false,
      isHover: false,
    };
  },
  emit: ['changeMainColor'],
  methods: {
    handleAttach,
    handleSubtitleClick(event) {
      // 检查点击的元素是否是交互元素或其子元素
      const target = event.target;
      const interactiveElements = target.closest('.t-switch, .t-icon, .t-popup');
      if (!interactiveElements) {
        this.isActive = !this.isActive;
      }
    },
    changeColor(hex) {
      this.$emit('changeMainColor', hex, this.type);
    },
    copyHex(hex) {
      let input = document.createElement('input');
      input.value = hex;
      document.body.appendChild(input);
      input.select();
      document.execCommand('Copy');
      input.remove();
    },
  },
};
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.color-collapse {
  padding: 16px 4px 16px 16px;
  border-top: 1px solid var(--theme-component-border);

  &__header {
    display: flex;
    align-items: center;

    .block {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: transparent;
        transition: background-color 0.2s;
        border-radius: 6px;
      }
      &:hover {
        &::after {
          background-color: rgba(0, 0, 0, 0.1);
        }
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
    margin-bottom: 4px;
    font-weight: 500;
    color: var(--text-primary);
  }

  &__subtitle {
    display: flex;
    align-items: center;
    color: var(--text-secondary);
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
