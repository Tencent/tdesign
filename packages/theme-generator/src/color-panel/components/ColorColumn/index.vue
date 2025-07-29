<template>
  <div>
    <div class="color-content__horizontal-list">
      <!-- 渐变色条 -->
      <div v-if="!paletteChanged">
        <div
          v-for="(_, idx) in new Array(Number(gradientStep))"
          :key="idx"
          :style="{ background: `var(--td-${type}-color-${idx + 1})` }"
          @click="handleClickIdx(idx + 1)"
        />
      </div>
      <!-- 色阶断开 -->
      <div v-else class="unlink" @click="handleRecover">
        <link-unlink-icon size="15px" />{{ lang.color.gradientTip }}
      </div>
    </div>

    <div class="color-content__vertical-list">
      <span
        class="current-arrow"
        :style="{
          left: `${activeIdx * (type === 'gray' ? 16 : 23) + (type === 'gray' ? 5 : 8)}px`,
        }"
      ></span>
      <div
        v-if="tokenMap.find((v) => v.idx === activeIdx)"
        class="active-tab"
        :style="{
          top: `${tokenMap.findIndex((v) => v.idx === activeIdx) * 44 + 4}px`,
          height: `${tokenMap.filter((v) => v.idx === activeIdx).length * 44}px`,
        }"
      ></div>

      <div v-for="(color, idx) in tokenMap" :key="idx">
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
              'background-color': `var(--td-${type}-color-${color.idx})`,
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
            <color-picker :value="color.value" @change="(hex) => changeGradation(hex, color.idx)" />
          </template>
        </t-popup>
        <div v-if="color.name" @click="() => handleClickIdx(color.idx)" class="color-content__vertical-list-content">
          <div class="color-content__vertical-list-title" :title="color.name">
            {{ color.name.replace('--td-', '') }}
          </div>
          <div class="color-content__vertical-list-subtitle">
            <span>{{ type }}{{ color.idx }} </span>
            <span>{{ getTokenValue(color.name) }}</span>
          </div>
          <error-circle-icon class="error-icon" v-if="color.isModified" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Edit1Icon, ErrorCircleIcon, LinkUnlinkIcon } from 'tdesign-icons-vue';
import { Popup as TPopup } from 'tdesign-vue';

import { ColorPicker } from '../../../common/components';
import { langMixin } from '../../../common/i18n';
import { CUSTOM_TOKEN_ID } from '../../../common/themes';
import { getTokenValue, handleAttach } from '../../../common/utils';

export default {
  name: 'ColorColumn',
  props: {
    type: String,
    gradientStep: Number,
    tokenMap: Array,
  },
  emit: ['recoverGradation', 'changeGradation'],
  components: {
    TPopup,
    ColorPicker,
    LinkUnlinkIcon,
    Edit1Icon,
    ErrorCircleIcon,
  },
  mixins: [langMixin],
  data() {
    return {
      activeIdx: 0,
      hoverIdx: null,
      paletteChanged: this.hasModifiedColors(),
    };
  },
  watch: {
    tokenMap() {
      this.paletteChanged = this.hasModifiedColors();
    },
  },
  mounted() {
    this.$root.$on('refresh-color-tokens', () => {
      this.$forceUpdate();
    });
  },
  methods: {
    getTokenValue,
    handleAttach,
    handleClickIdx(idx) {
      this.activeIdx = idx;
    },
    handleRecover() {
      this.paletteChanged = false;
      this.$emit('recoverGradation', this.type);
    },
    changeGradation(hex, idx) {
      this.paletteChanged = true;
      this.$emit('changeGradation', hex, idx, this.type);
    },
    hasModifiedColors() {
      const localTokens = localStorage.getItem(CUSTOM_TOKEN_ID);
      if (!localTokens) return false;
      try {
        const tokenObj = JSON.parse(localTokens);
        const tokenKeys = Object.keys(tokenObj);
        return this.tokenMap.some((color) => {
          const mappedToken = color.name.replace(/-[^-]*$/, `-${color.idx}`);
          return tokenKeys.includes(mappedToken);
        });
      } catch {
        return false;
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
          box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05), 0px 4px 5px rgba(0, 0, 0, 0.08),
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
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
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
        content: '';
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
