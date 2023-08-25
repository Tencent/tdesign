<template>
  <div :style="{ width: '100%' }">
    <t-radio-group
      class="font-color__type-radio"
      variant="default-filled"
      v-model="colorType"
    >
      <!-- <t-radio-button :value="0" disabled>弱对比</t-radio-button> -->
      <t-radio-button :value="1">{{ lang.font.colorDefault }}</t-radio-button>
      <!-- <t-radio-button :value="2" disabled>高对比</t-radio-button> -->
    </t-radio-group>

    <div class="font-color__vertical-list">
      <span
        class="current-arrow"
        :style="{
          left: `${colorType * 58 + 24}px`,
        }"
      ></span>
      <div
        v-if="flattenPalette.find((v) => v.idx === activeIdx)"
        class="active-tab"
        :style="{
          top: `${
            flattenPalette
              .filter((v) => !!v.name)
              .findIndex((v) => v.idx === activeIdx) *
              56 +
            8
          }px`,
          height: `${
            flattenPalette
              .filter((v) => !!v.name)
              .filter((v) => v.idx === activeIdx).length * 56
          }px`,
        }"
      ></div>

      <div
        v-for="(color, idx) in flattenPalette.filter((v) => !!v.name)"
        :key="idx"
      >
        <t-popup
          placement="left"
          showArrow
          trigger="click"
          :destroyOnClose="true"
          :attach="handleAttach"
          :overlayStyle="{ borderRadius: '9px' }"
        >
          <div
            class="block"
            :style="{
              border: '1px solid var(--theme-component-border)',
              'background-color': color.value,
              minWidth: '32px',
              height: '32px',
              'border-radius': '6px',
              cursor: 'pointer',
              display: 'flex',
              'justify-content': 'center',
              'align-items': 'center',
              color: 'var(--text-anti)',
            }"
            @mouseover="hoverIdx = idx"
            @mouseleave="hoverIdx = null"
          >
            <transition name="fade">
              <edit-1-icon v-if="hoverIdx === idx" />
            </transition>
            <!-- <edit-1-icon /> -->
          </div>
          <template #content>
            <color-picker
              :value="color.value"
              @change="(hex) => changeColor(hex, idx)"
              :enable-alpha="true"
            />
          </template>
        </t-popup>
        <div v-if="color.name" class="font-color__vertical-list-content">
          <div class="font-color__vertical-list-title" :title="color.name">
            {{ color.name }}
          </div>
          <div class="font-color__vertical-list-subtitle">
            <span>{{ color.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import flatten from "lodash/flatten";
import {
  Popup as TPopup,
  RadioGroup as TRadioGroup,
  RadioButton as TRadioButton,
} from "tdesign-vue";
import { Edit1Icon } from "tdesign-icons-vue";
import ColorPicker from "../../common/ColorPicker/ColorPicker.vue";
import { handleAttach } from "../../common/utils";
import langMixin from "../../common/i18n/mixin";
export default {
  name: "FontColorAdjust",
  props: {
    type: String,
    colorPalette: Array,
    paletteChange: Boolean,
    originColorPalette: Array,
  },
  emit: ["recoverGradation", "changeGradation"],
  mixins: [langMixin],
  components: {
    TPopup,
    TRadioGroup,
    TRadioButton,
    ColorPicker,
    Edit1Icon,
  },
  data() {
    return {
      activeIdx: 0,
      hoverIdx: null,
      colorType: 1,
    };
  },
  watch: {
    colorType(v) {
      if (v === "custom") return;
    },
  },
  computed: {
    flattenPalette() {
      return flatten(this.colorPalette);
    },
    originFlattenPalette() {
      return flatten(this.originColorPalette);
    },
  },
  methods: {
    flatten(arr) {
      return flatten(arr);
    },
    handleAttach,
    handleClickIdx(idx) {
      this.activeIdx = idx;
    },
    handleRecover() {
      this.$emit("recoverGradation", this.type);
    },
    changeColor(hex, idx) {
      this.$emit("changeGradation", hex, idx, this.type);
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

.font-color {
  &__type-radio {
    margin: 16px 0;
    display: flex;
    width: 100%;
    border-radius: 6px;
    background-color: var(--bg-color-theme-secondary);

    /deep/ .t-radio-button {
      flex: 1;
      text-align: center;
      width: 25%;
      padding: 4px 0;
    }

    /deep/ .t-radio-group__bg-block {
      border-radius: 5px;
      background-color: var(--bg-color-theme-surface);
    }
  }
  &__horizontal-list {
    width: 100%;
    margin: 20px 0;
    position: relative;
    height: 32px;
    transition: height 0.2s;

    > div {
      display: flex;
      width: 100%;

      > div {
        flex: 1;
        height: 32px;
        transition: transform 0.2s;
        cursor: pointer;

        &:first-child {
          border-radius: 6px 0 0 6px;
        }

        &:last-child {
          border-radius: 0 6px 6px 0;
        }

        &:hover {
          transform: scale(1.2);
          border-radius: 3px;
          box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05),
            0px 4px 5px rgba(0, 0, 0, 0.08),
            0px 2px 4px -1px rgba(0, 0, 0, 0.12);
        }
      }
    }
  }

  &__vertical-list {
    width: 100%;
    background: var(--bg-color-theme-secondary);
    padding: 4px;
    font-size: 14px;
    line-height: 22px;
    border-radius: 9px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    cursor: pointer;
    position: relative;

    .block {
      position: relative;

      .t-icon-edit-1 {
        font-size: 16px;
        color: var(--text-anti);
        z-index: 2;
      }

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
        border-radius: 5px;
      }
      &:hover {
        &::after {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }

    > .current-arrow {
      top: -6px;
      width: 12px;
      height: 12px;
      z-index: 10;
      background: var(--bg-color-theme-secondary);
      position: absolute;
      transform: rotate(45deg);
      transition: left 0.2s;
    }

    .active-tab {
      position: absolute;
      width: calc(100% - 12px);
      border-radius: 6px;
      background: var(--bg-color-card);
      left: 6px;
      transition: top 0.2s;
      height: 56px;
    }

    > div:not(.active-tab) {
      width: 100%;
      display: flex;
      padding: 4px 6px;
      border-radius: 6px;
      position: relative;

      .error-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 16px;
      }

      > div:first-child {
        margin-right: 8px;
        margin-top: 2px;
      }

      > p {
        margin-right: 12px;
        flex: 1;
      }
    }

    &-title {
      color: var(--text-primary);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 182px;
      font-size: 12px;
      line-height: 18px;
    }

    &-subtitle {
      color: var(--text-placeholder);
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>
