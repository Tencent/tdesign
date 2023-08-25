<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="shadow-content__content" :style="contentStyle">
      <div class="shadow-content__main">
        <p class="shadow-content__title">{{ lang.shadow.title }}</p>
        <!-- 顶部调整 -->
        <div :style="{ display: 'flex' }">
          <div class="shadow-panel__round">
            <div class="shadow-panel__round-tag">
              <div
                class="shadow-panel__round-box"
                :style="{ 'box-shadow': leftShadow }"
              ></div>
            </div>
            <div class="shadow-panel__round-slider">
              <div
                class="slider-split"
                :key="i"
                :style="{
                  opacity: i == 0 || i === selectOptions.length - 1 ? 0 : 1,
                }"
                v-for="(v, i) in selectOptions.slice(
                  0,
                  selectOptions.length - 1
                )"
              ></div>

              <t-slider
                :min="0"
                :max="selectOptions.length - 2"
                :value="step"
                @change="handleSliderChange"
                :label="selectOptions[step].label"
                :disabled="forbidden"
              ></t-slider>
            </div>
            <div class="shadow-panel__round-tag">
              <div
                class="shadow-panel__round-box"
                :style="{ 'box-shadow': rightShadow }"
              ></div>
            </div>
          </div>
          <t-select
            class="shadow-panel__select"
            :options="selectOptions"
            v-model="step"
            :keys="isEn ? { label: 'enLabel' } : null"
            :popup-props="{ attach: handleAttach }"
            style="width:82px"
          ></t-select>
        </div>
        <shadow-card
          v-for="(shadow, i) in shadowPalette"
          :key="i"
          :index="i"
          :shadow="shadow"
          :detail="shadowTypeDetail[i]"
          @change="(value) => change(value, i)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="jsx">
import { Slider as TSlider, Select as TSelect } from "tdesign-vue";
import { modifyToken, handleAttach, replacePercentages } from "../common/utils";
import {
  ShadowSelect,
  ShadowSelectType,
  ShadowTypeMap,
  ShadowTypeDetail,
  ShadowSelectDetail,
} from "./const";
import ShadowCard from "./components/ShadowCard.vue";
import langMixin from "../common/i18n/mixin";

export default {
  name: "ShadowPanel",
  props: {
    top: Number,
  },
  components: {
    TSlider,
    TSelect,
    ShadowCard,
  },
  mixins: [langMixin],
  data() {
    return {
      shadowPalette: [],
      selectOptions: ShadowSelect,
      selfDefined: ShadowSelectType,
      step: ShadowSelectType.Default,
    };
  },
  created() {
    this.shadowTypeDetail = ShadowTypeDetail;
    // 判断是否是提供的值， 并设置 step
    this.checkStep();
  },
  computed: {
    contentStyle() {
      const clientHeight = window.innerHeight;
      return {
        overflowY: "scroll",
        height: `${clientHeight - (this.top || 0) - 96}px`,
      };
    },
    leftShadow() {
      const selectKeys = Object.keys(ShadowSelectDetail);
      if (selectKeys.length < 1) return "";
      const shadowArray = ShadowSelectDetail[selectKeys[0]][0];
      return shadowArray;
    },
    rightShadow() {
      const selectKeys = Object.keys(ShadowSelectDetail);
      if (selectKeys.length < 1) return "";
      //倒数第二个的， 最后一个为自定义
      const shadowArray =
        ShadowSelectDetail[selectKeys[selectKeys.length - 2]][0];
      return shadowArray;
    },
    forbidden() {
      return this.step === ShadowSelectType.Self_Defined;
    },
  },
  watch: {
    step: {
      handler(nVal) {
        // 自定义时去当前系统值
        if (nVal === ShadowSelectType.Self_Defined) {
          // this.shadowPalette = this.getCurrentPalette();
          return;
        }
        const shadows = ShadowSelectDetail[nVal];
        if (!shadows) return;
        this.shadowPalette = shadows.map((shadow) =>
          this.splitShadowValue(shadow)
        );
      },
    },
    shadowPalette(nVal) {
      // shadowPalette 值变化时认为 有编辑
      const currentPalette = this.getCurrentPalette();
      for (let index = 0; index < nVal.length; index++) {
        const shadow = nVal[index];
        const current = currentPalette[index];
        const newShadow = shadow.join(",");
        if (newShadow === current.join(",")) continue;
        const { name } = ShadowTypeMap[index];
        modifyToken(name, newShadow);
      }

      // 如果palette中的值不是定义好的任何一个 则变为自定义
      const newPalette = nVal.map((v) => v.join(", "));
      const isSelfDefined = !this.selectOptions.find((v) => {
        const currentStr = replacePercentages(JSON.stringify(newPalette));
        const optionStr = replacePercentages(
          JSON.stringify(ShadowSelectDetail[v.value])
        );
        return currentStr === optionStr;
      });
      if (isSelfDefined) this.step = ShadowSelectType.Self_Defined;
    },
  },
  methods: {
    handleAttach,
    handleSliderChange(v) {
      if (this.forbidden) return;
      this.step = v;
    },
    checkStep() {
      const shadowPalette = this.getCurrentPalette();
      const shadowSteps = Object.entries(ShadowSelectDetail);
      for (let index = 0; index < shadowSteps.length; index++) {
        const [step, shadows] = shadowSteps[index];
        let isEqual = true;
        for (let id = 0; id < shadows.length; id++) {
          const shadow = shadows[id];
          const currentShadow = shadowPalette[id];
          if (shadow !== currentShadow.join(",")) {
            isEqual = false;
            break;
          }
        }
        if (isEqual) return step;
      }
    },
    // 拆分 box-shadow的值 0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 8%), 0 2px 4px -1px rgba(0, 0, 0, 12%)
    splitShadowValue(data) {
      const tempData = `${data},`;
      const shadows = tempData.split("),");
      return shadows
        .filter((shadow) => shadow)
        .map((shadow) => {
          const value = shadow.trim();
          return `${value})`;
        });
    },
    getCurrentPalette() {
      const docStyle = getComputedStyle(document.documentElement);
      const currentPalette = [...new Array(ShadowTypeMap.length).keys()].map(
        (v, i) => {
          const { value, from } = ShadowTypeMap[i];
          if (value) return value;
          const data = docStyle.getPropertyValue(from);
          return this.splitShadowValue(data);
        }
      );
      return currentPalette;
    },
    change(value, index) {
      const val = [...this.shadowPalette];
      val[index] = value;
      this.shadowPalette = val;
    },
    setCurrentPalette() {
      const currentTokenArr = this.getCurrentPalette();
      this.shadowPalette = currentTokenArr.map((token) =>
        this.splitShadowValue(token)
      );
    },
  },
  mounted() {
    this.setCurrentPalette();
  },
};
</script>
<style scoped lang="less">
/deep/ .t-popup[data-popper-placement="bottom-end"] .t-popup__arrow {
  left: calc(100% - 16px * 2) !important;
}

.shadow-content {
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
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
  }
}
.shadow-panel {
  &__round {
    display: flex;
    height: 32px;
    > div {
      display: flex;
      background-color: var(--bg-color-theme-secondary);
      margin-right: 2px;
      align-items: center;
      justify-content: center;
    }
    &-tag {
      height: 100%;
      width: 32px;
      color: var(--text-primary);
      &:first-child {
        border-radius: 9px 0px 0px 9px;
      }
      &:last-child {
        border-radius: 0px 9px 9px 0px;
        margin-right: 0;
      }
    }
    &-box {
      width: 20px;
      height: 20px;
      background: var(--bg-color-theme-surface);
      border-radius: 3px;
    }
    &-slider {
      width: 76px;
      padding: 6px;
      position: relative;
      display: flex;
      justify-content: space-between !important;
      .slider-split {
        background-color: var(--bg-color-theme-secondary);
        width: 2px;
        height: 8px;
        z-index: 2;
      }
      /deep/ .t-slider__container {
        position: absolute;
        top: 6px;
        width: 60px;
        left: 8px;
      }
      /deep/ .t-slider {
        padding: 6px 0;
      }
      /deep/ .t-slider__rail {
        height: 8px;
        background-color: var(--bg-color-theme-tertiary);
      }
      /deep/ .t-slider__track {
        height: 8px;
      }
      /deep/ .t-slider__button {
        box-shadow: var(--shadow-1);
        border-color: var(--bg-color-tag);
      }
    }
  }
  &__select {
    text-align: center;
    padding: 0;
    margin-left: 8px;
    /deep/ .t-input {
      background: var(--bg-color-theme-secondary);
      border: 1px solid transparent;
      height: 32px;
      border-radius: 9px;
      padding: 0 8px;
      transition: border-color 0.2s;
    }
    /deep/ .t-select:hover {
      border-color: var(--component-border);
    }
    /deep/ .t-is-active {
      border-color: var(--brand-main) !important;
    }
    /deep/ .t-select__right-icon {
      color: var(--text-placeholder) !important;
    }

    /deep/ .t-select__single {
      margin-left: 0;
    }
  }
}
</style>
