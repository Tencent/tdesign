<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="size-content__content" :style="contentStyle">
      <div class="size-content__main">
        <p class="size-content__title">{{  lang.size.basicSize }}</p>
        <size-display />
      </div>
      <!-- 组件大小 -->
      <common-collapse>
        <template #round>
          <div
            class="block"
            :style="{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-color-theme-secondary)',
            }"
          >
            <size-svg />
          </div>
        </template>
        <template #title>{{  lang.size.componentSize }}</template>
        <template #subTitle>size</template>
        <template #content>
          <size-adjust :tokenList="compSizeArr" type="comp-size" />
        </template>
      </common-collapse>
      <!-- 组件上下边距 -->
      <common-collapse>
        <template #round>
          <div
            class="block"
            :style="{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'var(--bg-color-theme-secondary)',
            }"
          >
            <vertical-padding-svg />
          </div>
        </template>
        <template #title>{{ lang.size.yPadding }}</template>
        <template #subTitle>padding top & bottom</template>
        <template #content>
          <size-adjust :tokenList="compPaddingTBArr" type="comp-padding-tb" />
        </template>
      </common-collapse>
      <!-- 组件左右边距 -->
      <common-collapse>
        <template #round>
          <div
            class="block"
            :style="{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'var(--bg-color-theme-secondary)',
            }"
          >
            <horizontal-padding-svg />
          </div>
        </template>
        <template #title>{{ lang.size.xPadding }}</template>
        <template #subTitle>padding left & right</template>
        <template #content>
          <size-adjust :tokenList="compPaddingLRArr" type="comp-padding-lr" />
        </template>
      </common-collapse>
      <!-- popup 边距 -->
      <common-collapse>
        <template #round>
          <div
            class="block"
            :style="{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-color-theme-secondary)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          >
            <popup-padding-svg />
          </div>
        </template>
        <template #title>{{ lang.size.popupPadding }}</template>
        <template #subTitle>popup padding</template>
        <template #content>
          <size-adjust :tokenList="compPopupPaddingArr" type="popup-padding" />
        </template>
      </common-collapse>
      <!-- margin 边距 -->
      <common-collapse>
        <template #round>
          <div
            class="block"
            :style="{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'var(--bg-color-theme-secondary)',
            }"
          >
            <margin-svg />
          </div>
        </template>
        <template #title>{{ lang.size.margin }}</template>
        <template #subTitle>margin</template>
        <template #content>
          <size-adjust :tokenList="compMarginArr" type="comp-margin" />
        </template>
      </common-collapse>
    </div>
  </div>
</template>
<script lang="jsx">
import CommonCollapse from "../common/Collapse/index.vue";
import SizeDisplay from "./components/SizeDisplay.vue";
import SizeAdjust from "./components/SizeAdjust.vue";

import SizeSvg from "./svg/SizeSvg.vue";
import HorizontalPaddingSvg from "./svg/HorizontalPaddingSvg.vue";
import VerticalPaddingSvg from "./svg/VerticalPaddingSvg.vue";
import PopupPaddingSvg from "./svg/PopupPaddingSvg.vue";
import MarginSvg from "./svg/MarginSvg.vue";

import { modifyToken } from "../common/utils";
import { FONT_COLOR_MAP } from "../color-panel/utils/const";
import {
  compSizeArr,
  compPaddingLRArr,
  compPaddingTBArr,
  compPopupPaddingArr,
  compMarginArr,
} from "./built-in/size-map";
import langMixin from "../common/i18n/mixin";

export default {
  name: "SizePanel",
  props: {
    top: Number,
  },
  components: {
    CommonCollapse,
    SizeDisplay,
    SizeAdjust,
    // svg
    SizeSvg,
    HorizontalPaddingSvg,
    VerticalPaddingSvg,
    PopupPaddingSvg,
    MarginSvg,
  },
  mixins: [langMixin],
  data() {
    return {
      textColorPalette: [""],
      initTextColorPalette: [""],
      compSizeArr,
      compPaddingLRArr,
      compPaddingTBArr,
      compPopupPaddingArr,
      compMarginArr,
    };
  },
  mounted() {
    const textColorPalette = this.getCurrentPalette();
    this.textColorPalette = textColorPalette;
    this.initTextColorPalette = JSON.parse(JSON.stringify(textColorPalette));
  },
  computed: {
    isTextPaletteChange() {
      return (
        JSON.stringify(this.textColorPalette) !==
        JSON.stringify(this.initTextColorPalette)
      );
    },
    contentStyle() {
      const clientHeight = window.innerHeight;
      return {
        overflowY: "scroll",
        height: `${clientHeight - (this.top || 0) - 96}px`,
      };
    },
  },
  methods: {
    changeGradation(hex, idx) {
      const tokenIdxName = this.textColorPalette[idx].name;

      this.textColorPalette[idx].value = hex;
      modifyToken(tokenIdxName, hex);
    },
    getCurrentPalette() {
      let colorMap = FONT_COLOR_MAP;
      let docStyle = getComputedStyle(document.documentElement);

      let currentPalette = [...new Array(7).keys()].map((v, i) => {
        return {
          ...colorMap[i],
          value:
            colorMap[i].value ?? docStyle.getPropertyValue(colorMap[i].from),
        };
      });

      return currentPalette;
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .t-popup[data-popper-placement="bottom-end"] .t-popup__arrow {
  left: calc(100% - 16px * 2) !important;
}

.size-content {
  &__content {
    padding: 0;
    overflow: auto;

    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: var(--bg-color-scroll);
      }
    }

    &::-webkit-scrollbar {
      width: 12px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      border: 4px solid transparent;
      background-clip: content-box;
      background-color: transparent;
    }
  }

  &__main {
    padding: 12px 4px 16px 16px;
  }

  &__title {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 8px;
    margin-top: 0px;
    line-height: 22px;
    display: flex;
    align-items: center;
  }

  &__subtitle {
    font-size: 12px;
    margin: 4px 0 10px 0;

    button {
      margin-right: 8px;
      width: 30px;
      height: 30px;
    }
  }

  &__flex {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -4px;
    > div {
      margin: 4px;
    }
  }

  &__block {
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    border-radius: 9px;
    cursor: pointer;
    background: var(--bg-color-code);
    max-width: 72px;
    transition: background 0.2s;

    &:hover {
      background: var(--bg-color-code-hover);
    }

    .recommend-block {
      transform: scale(2);
      transform-origin: top left;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 3px;
    }

    > div {
      border-radius: 9px;
      width: 72px;
      height: 72px;
      border: 1px solid transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: var(--text-secondary);
      transition: border 0.2s;

      &:hover {
        color: var(--text-secondary-hover);
      }

      &.is-active {
        border: 1px solid var(--brand-main-hover);
      }

      > div {
        color: var(--td-font-white-1);
      }
    }
  }

  &__custom {
    margin: 16px 0 8px 0;
    padding: 2px;
    height: 131px;
    background: conic-gradient(
      from 180deg at 50% 50%,
      #00c3ff 0,
      var(--td-brand-color) 120deg,
      var(--td-brand-color) 180deg,

      #4ceb1b 290.62deg,
      #00c3ff 360deg
    );
    border-radius: 9px;
    cursor: pointer;
    transition: padding 0.2s;
    &:hover {
      padding: 4px;
    }
    &-inner {
      background-color: var(--bg-color-card);
      padding: 4px;
      border-radius: 7px;
      max-height: 100%;
    }
    &-top {
      padding: 10px 12px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;

      > p {
        color: var(--td-font-white-3);
        margin: 0;
        line-height: 22px;
        font-size: 14px;
      }
    }

    &-bottom {
      padding: 8px 8px 3px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 0;
        line-height: 22px;
        font-size: 14px;

        &:first-child {
          color: var(--text-primary);
          font-weight: 600;
        }
        &:last-child {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
            "Liberation Mono", monospace;
        }
      }
    }
  }
}
</style>
