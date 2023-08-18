<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="radius-content__content" :style="contentStyle">
      <div class="radius-content__main">
        <p class="radius-content__title">{{ lang.borerRadius.radiusSize }}</p>
        <SegmentSelection
          :selectOptions="selectOptions"
          :suspendedLabels="RadiusLabels"
          v-model="step"
          :disabled="segmentSelectionDisabled"
          @enable="segmentSelectionDisabled = false"
        >
          <template v-slot:left>
            <div
              class="radius-content__round-tag-left"
              :class="{ disabled: segmentSelectionDisabled }"
            ></div>
          </template>
          <template v-slot:right>
            <div
              class="radius-content__round-tag-right"
              :class="{ disabled: segmentSelectionDisabled }"
            ></div>
          </template>
        </SegmentSelection>
        <div class="radius-content__list">
          <t-list>
            <t-popup
              v-for="(token, idx) in radiusTypeList"
              :key="idx"
              placement="left"
              showArrow
              trigger="click"
              :destroyOnClose="true"
              :attach="handleAttach"
              @visible-change="(v, ctx) => handleVisibleChange(v, ctx, idx)"
              :overlayStyle="{ borderRadius: '9px' }"
            >
              <t-list-item
                :style="{
                  transition: 'border-color .2s',
                  border:
                    hoverIdx === idx
                      ? '1px solid var(--brand-main)'
                      : '1px solid transparent',
                }"
                ><div class="radius-content__list-item">
                  <div
                    class="radius-content__list-item-round-tag"
                    :style="{
                      'border-radius': formattedRadius(token.value),
                    }"
                  ></div>
                  <div class="radius-content__list-item-text">
                    <div class="radius-content__list-item-title">
                      <!-- 不展示--td-前缀 -->
                      {{
                        `${token.token.replace("--td-", "")}：${
                          token.value === "50%"
                            ? token.value
                            : `${formattedRadius(token.value)}`
                        }`
                      }}
                    </div>
                    <div class="radius-content__list-item-title bottom">
                      {{ isEn ? token.enDesc : token.desc }}
                    </div>
                  </div>
                </div>
              </t-list-item>
              <template #content
                ><size-slider
                  title="border-radius"
                  :sizeValue="token.value"
                  :disabled="token.token === '--td-radius-circle'"
                  @changeFontSize="(v) => handleChangeRadius(v, idx)"
              /></template>
            </t-popup>
          </t-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  List as TList,
  ListItem as TListItem,
  Popup as TPopup,
} from "tdesign-vue";
import isNumber from "lodash/isNumber";
import SizeSlider from "../common/SizeSlider/index.vue";
import SegmentSelection from "../common/SegmentSelection/index.vue";
import { handleAttach, modifyToken } from "../common/utils";
import {
  Radius_MAP,
  RadiusLabels,
  RadiusSteps,
  RadiusStepArray,
} from "./built-in/border-radius";
import langMixin from "../common/i18n/mixin";

export default {
  name: "RadiusPanel",
  components: {
    TList,
    TListItem,
    TPopup,
    SizeSlider,
    SegmentSelection,
  },
  props: {
    isRefresh: Boolean,
  },
  mixins: [langMixin],
  data() {
    return {
      step: 3,
      hoverIdx: null,
      selectOptions: Radius_MAP,
      RadiusSteps,
      RadiusLabels,
      segmentSelectionDisabled: false,
      radiusTypeList: [
        {
          token: "--td-radius-small",
          value: null,
          enDesc: "internal scenes of basic components.",
          desc: "适用于基础组件内部场景",
        },
        {
          token: "--td-radius-default",
          value: null,
          enDesc: "basic components",
          desc: "适用于所有基础组件",
        },
        {
          token: "--td-radius-medium",
          value: null,
          enDesc: "popup and card-type components",
          desc: "适用于弹出类型和卡片类型组件",
        },
        {
          token: "--td-radius-large",
          value: null,
          enDesc: "dialog-type components",
          desc: "适用于对话框类型组件",
        },
        {
          token: "--td-radius-extraLarge",
          value: null,
          enDesc: "extra-large display-type components",
          desc: "适用于超大型展示型组件",
        },
        {
          token: "--td-radius-circle",
          value: null,
          enDesc: "Circular Components",
          desc: "适用于圆形组件",
        },
      ],
    };
  },
  computed: {
    contentStyle() {
      const clientHeight = window.innerHeight;
      return {
        overflowY: "scroll",
        height: `${clientHeight - (this.top || 0) - 96}px`,
      };
    },
  },
  watch: {
    radiusTypeList(list) {
      const currentRadiusList = list.map((v) => v.value);
      const existStep = RadiusStepArray.find((steps) => {
        const arr = steps.filter((v, i) => {
          const step = typeof v === "number" ? `${v}px` : v;
          const currentRadius =
            typeof currentRadiusList[i] === "number"
              ? `${currentRadiusList[i]}px`
              : currentRadiusList[i].trim();
          return step === currentRadius;
        });
        return arr.length === steps.length;
      });

      if (!existStep) this.segmentSelectionDisabled = true;
    },
    step(val) {
      if (!RadiusStepArray[val - 1]) return;
      this.radiusTypeList = this.radiusTypeList.map((item, index) => {
        const preVal = RadiusStepArray?.[val - 1]?.[index];
        const formattedVal =
          typeof preVal === "number" ? `${preVal}px` : preVal;
        modifyToken(item.token, formattedVal);
        return {
          ...item,
          value: RadiusStepArray[val - 1][index],
        };
      });
    },
  },
  methods: {
    handleAttach,
    handleVisibleChange(v, ctx, idx) {
      if (v) this.hoverIdx = idx;
      if (!v && ctx.trigger === "document" && this.hoverIdx === idx)
        this.hoverIdx = null;
    },
    handleChangeRadius(val, idx) {
      this.radiusTypeList.splice(idx, 1, {
        ...this.radiusTypeList[idx],
        value: val,
      });
      modifyToken(this.radiusTypeList[idx]["token"], `${val}px`);

      if (val !== RadiusStepArray[this.step - 1]?.[idx]) {
        this.segmentSelectionDisabled = true;
      }
    },
    formattedRadius(radius) {
      if (radius === "50%") return "50%";
      if (isNumber(radius)) return `${radius}px`;
      return radius;
    },
    getCurrentRadiusToken() {
      let docStyle = getComputedStyle(document.documentElement);
      let currentRadiusToken = this.radiusTypeList.map((v, i) => {
        return {
          ...v,
          value:
            v.value ?? docStyle.getPropertyValue(this.radiusTypeList[i].token),
        };
      });

      return currentRadiusToken;
    },
    setRadiusTokenList() {
      this.radiusTypeList = this.getCurrentRadiusToken();
    },
  },
  mounted() {
    // update radius token list on mounted when switch new theme
    this.setRadiusTokenList();
  },
};
</script>

<style scoped lang="less">
.radius-content {
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

  &__round-tag-left,
  &__round-tag-right {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* Brand 品牌/Brand1-Light */
    background: var(--brand-main-light);
    /* Brand 品牌/Brand8-Normal */
    border: 1px solid var(--brand-main);
    &.disabled {
      background: var(--bg-color-tag);
      border: 1px solid var(--theme-component-border);
    }
  }
  &__round-tag-left {
    border-radius: 3px;
  }
  &__round-tag-right {
    border-radius: 8px;
  }
  &__list {
    margin-top: 8px;
    padding: 4px;
    border-radius: 9px;
    background-color: var(--bg-color-theme-secondary);
    &-item {
      display: flex;
      align-items: center;
      &-text {
        flex: 1;
        width: 158px;
      }
      &-title {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: var(--text-primary);
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
          "Liberation Mono", monospace;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &.bottom {
          color: var(--text-placeholder);
        }
      }
      &-round-tag {
        width: 32px;
        height: 32px;
        /* Brand 品牌/Brand1-Light */
        background: var(--brand-main-light);
        /* Brand 品牌/Brand8-Normal */
        border: 1px solid var(--brand-main);
        margin-right: 8px;
      }
    }
    span {
      font-size: 14px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;
    }
    /deep/ .t-radio-group {
      width: 228px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 8px;
    }
    /deep/ .t-radio-button {
      width: 50%;
    }
    /deep/ .t-radio-group__bg-block {
      border-radius: 5px;
      width: calc(50% - 2px) !important;
    }

    /deep/ .t-list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 4px 6px;
      gap: 12px;
      background: var(--bg-color-theme-surface);
      border-radius: 6px;
      margin-bottom: 4px;
      &:last-child {
        margin-bottom: 0;
      }
      cursor: pointer;
    }
    /deep/ .t-list-item__content {
      width: 100%;
    }
  }
}
</style>
