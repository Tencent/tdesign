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
            background: mainColorVal,
            borderRadius: '6px',
            cursor: 'pointer',
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
            <edit-1-icon v-if="isHover" size="24px" />
          </transition>
        </div>
        <template #content v-if="!disableSelfDefine">
          <color-picker :value="mainColorVal" @change="changeColor" />
        </template>
      </t-popup>
      <div class="color-collapse__text">
        <div class="color-collapse__title" @click="isActive = !isActive">
          {{ title }} 
        </div>
        <slot name="subTitle"></slot>
        <div
          class="color-collapse__subtitle"
          :style="{ color: 'var(--text-secondary)' }"
          v-if="!$slots.subTitle"
        >
          HEX: {{ mainColorVal }}
          <t-popup
            placement="top"
            showArrow
            trigger="click"
            :destroyOnClose="true"
            :attach="handleAttach"
            :overlayStyle="{ borderRadius: '6px' }"
          >
            <file-copy-icon @click="() => copyHex(mainColorVal)" />
            <template #content
              ><span :style="{ color: `var(--text-secondary)` }">{{ lang.copied }}</span>
            </template>
          </t-popup>
        </div>
      </div>
      <div @click="isActive = !isActive">
        <arrow-icon
          :isActive="isActive"
          overlayClassName="color-collapse__arrow"
        />
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
      <slot v-if="isActive" />
    </transition>
  </div>
</template>
<script>
import flatten from "lodash/flatten";
import { collapseAnimation } from "../../../common/utils/animation";
import { FileCopyIcon, Edit1Icon } from "tdesign-icons-vue";
import { Popup as TPopup } from "tdesign-vue";
import ArrowIcon from "tdesign-vue/es/common-components/fake-arrow";
import { handleAttach } from "../../../common/utils";
import ColorPicker from "../../../common/ColorPicker/ColorPicker.vue";
import langMixin  from "../../../common/i18n/mixin";

export default {
  name: "ColorCollapse",
  props: {
    title: String,
    colorPalette: Array,
    type: String,
    disableSelfDefine: Boolean
  },
  mixins:[langMixin],
  components: { FileCopyIcon, ArrowIcon, TPopup, Edit1Icon, ColorPicker },
  computed: {
    mainColorVal() {
      return this.flattenPalette.find(
        (v) => v.type === "main" || v.type === "gray"
      )?.value;
    },
    flattenPalette() {
      return flatten(this.colorPalette);
    },
  },
  data() {
    return {
      ...collapseAnimation(),
      isActive: false,
      isHover: false,
    };
  },
  emit: ["changeMainColor"],
  methods: {
    handleAttach,
    changeColor(hex) {
      this.$emit("changeMainColor", hex, this.type);
    },
    copyHex(hex) {
      let input = document.createElement("input");
      input.value = hex;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
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
        content: "";
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
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
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
