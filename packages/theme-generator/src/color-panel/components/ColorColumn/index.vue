<template>
  <div>
    <div class="color-content__horizontal-list">
      <div v-if="!paletteChange">
        <div
          v-for="(color, idx) in flattenPalette.filter(
            (v, i) =>
              v &&
              ((flattenPalette[i + 1] &&
                v.value !== flattenPalette[i + 1].value) ||
                i === flattenPalette.length - 1)
          )"
          :key="idx"
          :style="{ background: color.value }"
          @click="() => handleClickIdx(idx)"
        />
      </div>
      <div v-else class="unlink" @click="handleRecover">
        <link-unlink-icon size="20px" />色阶断开，点击恢复上次结果
      </div>
    </div>

    <div class="color-content__vertical-list">
      <span
        class="current-arrow"
        :style="{
          left: `${
            activeIdx * (type === 'gray' ? 16 : 23) + (type === 'gray' ? 5 : 8)
          }px`,
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
              44 +
            4
          }px`,
          height: `${
            flattenPalette
              .filter((v) => !!v.name)
              .filter((v) => v.idx === activeIdx).length * 44
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
            @mouseover="hoverIdx = color.idx"
            @mouseleave="hoverIdx = null"
          >
            <transition name="fade">
              <edit-1-icon v-if="hoverIdx === color.idx" />
            </transition>
          </div>
          <template #content>
            <color-picker
              :value="color.value"
              @change="(hex) => changeColor(hex, color.idx)"
            />
          </template>
        </t-popup>
        <div
          v-if="color.name"
          @click="() => handleClickIdx(color.idx)"
          class="color-content__vertical-list-content"
        >
          <div class="color-content__vertical-list-title" :title="color.name">
            <!-- 不展示--td-前缀 -->
            {{ color.name.replace('--td-','') }}
          </div>
          <div class="color-content__vertical-list-subtitle">
            <span>{{ type }}{{ color.idx + 1 }}</span
            ><span>{{ color.value }}</span>
          </div>
          <error-circle-icon
            class="error-icon"
            v-if="
              flattenPalette[activeIdx].value === color.value &&
              color.value !== originFlattenPalette[activeIdx].value
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import flatten from "lodash/flatten";
import { Popup as TPopup } from "tdesign-vue";
import { LinkUnlinkIcon, Edit1Icon, ErrorCircleIcon } from "tdesign-icons-vue";
import ColorPicker from "../../../common/ColorPicker/ColorPicker.vue";
import { handleAttach } from "../../../common/utils";

export default {
  name: "ColorColumn",
  props: {
    type: String,
    colorPalette: Array,
    paletteChange: Boolean,
    originColorPalette: Array,
  },
  emit: ["recoverGradation", "changeGradation"],
  components: {
    TPopup,
    ColorPicker,
    LinkUnlinkIcon,
    Edit1Icon,
    ErrorCircleIcon,
  },
  data() {
    return {
      activeIdx: 0,
      hoverIdx: null,
    };
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

.color-content {
  &__horizontal-list {
    width: 100%;
    margin: 12px 0 12px 0;
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
    .unlink {
      width: 100%;
      height: 32px;
      background: var(--bg-color-theme-secondary);
      border: 1px solid var(--theme-component-border);
      border-radius: 6px;
      font-size: 12px;
      line-height: 20px;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      /deep/ .t-icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }
  }

  &__vertical-list {
    width: 100%;
    background: var(--bg-color-theme-secondary);
    padding: 4px;
    font-size: 12px;
    line-height: 18px;
    border-radius: 9px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    cursor: pointer;
    position: relative;
    &-content {
      width: 158px;
    }
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
        border-radius: 5px;
        transition: background-color 0.2s linear;
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
      width: calc(100% - 8px);
      border-radius: 6px;
      background: var(--bg-color-theme-surface);
      left: 4px;
      transition: top 0.2s;
      height: 44px;
      z-index: 15;
    }

    > div:not(.active-tab) {
      width: 100%;
      display: flex;
      padding: 4px 6px;
      border-radius: 6px;
      position: relative;
      z-index: 20;

      .error-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 8px;
        font-size: 16px;
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
      max-width: 225px;
    }

    &-subtitle {
      color: var(--text-placeholder);
    }
  }
}
</style>
