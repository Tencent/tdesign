<template>
  <collapse-base variant="color">
    <!-- 左侧颜色选择器 -->
    <template #icon>
      <t-popup
        placement="left"
        show-arrow
        trigger="click"
        :destroy-on-close="true"
        :attach="handleAttach"
        :overlay-style="{ borderRadius: '9px' }"
        :hide-empty-popup="true"
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
        <template v-if="!disabled" #content>
          <color-picker :value="mainColor" @change="changeColor" />
        </template>
      </t-popup>
    </template>

    <!-- 标题 -->
    <template #title>{{ title }}</template>

    <!-- 副标题 -->
    <template #subTitle>
      HEX: {{ mainColor }}
      <t-popup
        placement="top"
        show-arrow
        trigger="click"
        :destroy-on-close="true"
        :attach="handleAttach"
        :overlay-style="{ borderRadius: '6px' }"
        @click.native.stop
      >
        <file-copy-icon @click="() => copyHex(mainColor)" />
        <template #content>
          <span :style="{ color: `var(--text-secondary)` }">{{ lang.copied }}</span>
        </template>
      </t-popup>
    </template>

    <!-- 内容 -->
    <template #content>
      <slot></slot>
    </template>
  </collapse-base>
</template>

<script>
import { Edit1Icon, FileCopyIcon } from 'tdesign-icons-vue';
import { Popup as TPopup } from 'tdesign-vue';

import { ColorPicker } from '@/common/components';
import CollapseBase from '@/common/components/CollapseBase/index.vue';
import { langMixin } from '@/common/i18n';
import { handleAttach } from '@/common/utils';

/**
 * 颜色展开/收起组件
 * 基于 CollapseBase，增加颜色选择、复制功能
 */
export default {
  name: 'ColorCollapse',
  components: { FileCopyIcon, TPopup, Edit1Icon, ColorPicker, CollapseBase },
  mixins: [langMixin],
  props: {
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    mainColor: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['changeMainColor'],
  data() {
    return {
      isHover: false,
    };
  },
  methods: {
    handleAttach,
    /**
     * 更改颜色
     */
    changeColor(hex) {
      this.$emit('changeMainColor', hex, this.type);
    },
    /**
     * 复制十六进制颜色值
     */
    copyHex(hex) {
      const input = document.createElement('input');
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

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

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
</style>
