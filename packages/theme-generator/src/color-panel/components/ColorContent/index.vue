<template>
  <div
    :style="{
      width: '268px',
      background: 'var(--bg-color-card)',
      border: '1px solid var(--theme-component-border)',
      borderRadius: '12px',
    }"
  >
    <div class="color-content__content" :style="contentStyle">
      <div class="color-content__main">
        <p class="color-content__title">{{ lang.color.themeColor }}</p>
        <t-row :gutter="[4, 4]" :style="{ marginLeft: '0' }">
          <t-col
            v-for="(theme, idx) in themes.slice(0, 3)"
            :key="idx"
            :span="3"
            :style="{ padding: '0' }"
          >
            <div
              :class="{
                'color-content__block': true,
                'is-active':
                  currentThemeColor === theme.value && !isMoreVisible,
              }"
              :style="{ paddingBottom: '4px', color: 'var(--text-secondary)' }"
            >
              <div
                @click="generateNewTheme(theme.value)"
                :class="{ 'is-active': currentThemeColor === theme.value }"
              >
                <div
                  :style="{
                    width: '48px',
                    height: '48px',
                    border: '1px solid var(--theme-component-border)',
                    'border-radius': '6px',
                    'background-color': theme.value,
                  }"
                >
                  <span v-if="currentThemeColor === theme.value"></span>
                </div>
              </div>
            </div>
          </t-col>
          <t-col :span="3" :style="{ padding: '0' }">
            <t-popup
              placement="bottom-left"
              showArrow
              trigger="hover"
              :attach="handleAttach"
              @visible-change="handleVisibleChange"
              overlayClassName="popup-arrow"
              :overlayStyle="{
                width: '268px',
                padding: '16px',
                borderRadius: '9px',
                marginTop: '8px',
              }"
            >
              <div
                :class="{
                  'color-content__block': true,
                  'is-active': isMoreVisible,
                }"
                :style="{
                  paddingBottom: '4px',
                  color: 'var(--text-secondary)',
                }"
              >
                <div>
                  <div
                    :style="{
                      width: '48px',
                      height: '48px',
                      'border-radius': '6px',
                      position: 'relative',
                    }"
                  >
                    <canvas
                      id="canvas"
                      class="recommend-block"
                      width="24px"
                      height="24px"
                    ></canvas>
                  </div>
                </div>
              </div>
              <template #content>
                <p class="color-content__title" style="margin-bottom: 8px">
                  <span>{{ lang.color.officialRecommendation }}</span>
                </p>
                <div class="color-content__flex">
                  <div
                    class="color-content__block"
                    style="background: none"
                    :key="idx"
                    v-for="(theme, idx) in recommendThemes"
                  >
                    <div
                      @click="generateNewTheme(theme.value)"
                      :class="{
                        'is-active': currentThemeColor === theme.value,
                      }"
                      :style="{ color: 'var(--text-secondary)' }"
                    >
                      <p
                        :style="{
                          width: '48px',
                          height: '48px',
                          'border-radius': '6px',
                          'background-color': theme.value,
                          border: '1px solid var(--theme-component-border)',
                        }"
                      ></p>
                    </div>
                  </div>
                </div>
                <t-divider style="margin: 16px 0" />
                <p class="color-content__title" style="margin-bottom: 8px">
                  <span>{{ lang.color.sceneRecommendation }}</span>
                </p>
                <div class="color-content__flex">
                  <div
                    class="color-content__block"
                    style="background: none"
                    :key="idx"
                    v-for="(theme, idx) in sceneThemes"
                  >
                    <div
                      @click="generateNewTheme(theme.value)"
                      :class="{
                        'is-active': currentThemeColor === theme.value,
                      }"
                    >
                      <p
                        :style="{
                          width: '48px',
                          height: '48px',
                          border: '1px solid var(--theme-component-border)',
                          'border-radius': '6px',
                          'background-color': theme.value,
                        }"
                      ></p>
                    </div>
                  </div>
                </div>
              </template>
            </t-popup>
          </t-col>
        </t-row>
        <!-- 自定义主题色部分 -->
        <t-popup
          placement="bottom-left"
          showArrow
          trigger="click"
          :destroyOnClose="true"
          :attach="handleAttach"
          :overlayStyle="{ borderRadius: '9px' }"
        >
          <div class="color-content__custom">
            <div class="color-content__custom-inner">
              <div
                class="color-content__custom-top"
                :style="{
                  width: '100%',
                  'border-radius': '6px',
                  'background-color': currentDisplayThemeColor,
                }"
              >
                <p>hsv: {{ themeColorHsv }}</p>
                <p>rgba: {{ themeColorRgb }}</p>
              </div>
              <div class="color-content__custom-bottom">
                <div>
                  <p>{{ lang.color.customizeTitle }}</p>
                  <p :style="{ color: 'var(--text-secondary)' }">
                    HEX: {{ currentDisplayThemeColor }}
                  </p>
                </div>
                <edit-1-icon
                  size="20"
                  :style="{ marginRight: '8px', color: 'var(--text-primary)' }"
                />
              </div>
            </div>
          </div>
          <template #content>
            <color-picker :value="currentThemeColor" @change="changeColor" />
          </template>
        </t-popup>
        <!-- 色彩生产模式 -->
        <div class="color-content__generate-mode">
          <div
            :class="{
              'color-content__generate-mode-btn': true,
              'is-active': generateMode === 'remain',
            }"
            @click="generateMode = 'remain'"
          >
            <div
              class="color-content__generate-mode-btn-inner"
              :style="{
                backgroundColor: currentDisplayThemeColor,
              }"
            >
              <span>{{ lang.color.remainText }}</span>
              <t-tooltip content="保留选中的主题色，不做改动">
                <help-circle-icon
                  size="14px"
                  :style="{
                    margin: '0 12px 0 5px',
                    color: 'rgba(255,255,255,0.35)',
                  }"
                />
              </t-tooltip>
              <file-copy-icon size="14px" />
            </div>
          </div>
          <div
            :class="{
              'color-content__generate-mode-btn': true,
              'is-active': generateMode === 'recommend',
            }"
            @click="generateMode = 'recommend'"
          >
            <div
              class="color-content__generate-mode-btn-inner"
              :style="{
                backgroundColor: currentDisplayThemeColor,
              }"
            >
              <span>{{ lang.color.aiRecommendation }}</span>
              <t-tooltip content="选中的主题色若无法做主题色，会做调整">
                <help-circle-icon
                  size="14px"
                  :style="{
                    margin: '0 12px 0 5px',
                    color: 'rgba(255,255,255,0.35)',
                  }"
                />
              </t-tooltip>
              <file-copy-icon size="14px" />
            </div>
          </div>
        </div>
        <!-- 主题色阶部分 -->
        <color-column
          type="brand"
          :colorPalette="colorPalette"
          :originColorPalette="initColorPalette"
          @changeGradation="changeGradation"
          @recoverGradation="recoverGradation"
          :paletteChange="isColorPaletteChange"
        />
      </div>
      <color-collapse
        :title="lang.color.neutralColor"
        :colorPalette="grayColorPalette"
        type="gray"
        :disableSelfDefine="isGeneratedNeutralColor"
        @changeMainColor="changeMainColor"
      >
        <template #subTitle>
          <div>
            {{ lang.color.fromThemeColor
            }}<t-switch
              style="margin-left: 4px"
              v-model="isGeneratedNeutralColor"
              @change="handleChangeGenerateNeutralColor"
            ></t-switch>
          </div>
        </template>
        <color-column
          type="gray"
          :colorPalette="grayColorPalette"
          :originColorPalette="initGrayColorPalette"
          @changeGradation="changeGradation"
          @recoverGradation="recoverGradation"
          :paletteChange="isGrayPaletteChange"
        />
      </color-collapse>
      <color-collapse
        :title="lang.color.successColor"
        :colorPalette="successColorPalette"
        type="success"
        @changeMainColor="changeMainColor"
      >
        <color-column
          type="success"
          :colorPalette="successColorPalette"
          :originColorPalette="initSuccessColorPalette"
          @changeGradation="changeGradation"
          @recoverGradation="recoverGradation"
          :paletteChange="isSuccessPaletteChange"
        />
      </color-collapse>
      <color-collapse
        :title="lang.color.errorColor"
        :colorPalette="errorColorPalette"
        type="error"
        @changeMainColor="changeMainColor"
      >
        <color-column
          type="error"
          :colorPalette="errorColorPalette"
          :originColorPalette="initErrorColorPalette"
          @changeGradation="changeGradation"
          @recoverGradation="recoverGradation"
          :paletteChange="isErrorPaletteChange"
        />
      </color-collapse>
      <color-collapse
        :title="lang.color.warningColor"
        :colorPalette="warningColorPalette"
        type="warning"
        @changeMainColor="changeMainColor"
      >
        <color-column
          type="warning"
          :colorPalette="warningColorPalette"
          :originColorPalette="initWarningColorPalette"
          @changeGradation="changeGradation"
          @recoverGradation="recoverGradation"
          :paletteChange="isWarningPaletteChange"
        />
      </color-collapse>
    </div>
  </div>
</template>
<script lang="jsx">
import {
  Row as TRow,
  Col as TCol,
  Popup as TPopup,
  Divider as TDivider,
  Tooltip as TTooltip,
  Switch as TSwitch,
} from "tdesign-vue";
import { Edit1Icon, HelpCircleIcon, FileCopyIcon } from "tdesign-icons-vue";
import { Color } from "tvision-color";
import ColorColumn from "../ColorColumn/index.vue";
import ColorCollapse from "./ColorCollapse.vue";
import ColorPicker from "../../../common/ColorPicker/ColorPicker.vue";
import {
  handleAttach,
  generateNewTheme,
  generateTokenList,
} from "../../../common/utils";
import {
  DEFAULT_COLOR,
  BRAND_COLOR_MAP,
  ERROR_COLOR_MAP,
  WARNING_COLOR_MAP,
  SUCCESS_COLOR_MAP,
  GRAY_COLOR_MAP,
  DEFAULT_THEME,
  RECOMMEND_COLOR,
  SCENE_COLOR,
} from "../../utils/const";
import { colorAnimation } from "../../../common/utils/animation";
import langMixin from "../../../common/i18n/mixin";

export default {
  name: "ColorContent",
  props: {
    top: Number,
    isRefresh: Boolean,
  },
  mixins: [langMixin],
  components: {
    TRow,
    TCol,
    TDivider,
    TPopup,
    TTooltip,
    TSwitch,
    Edit1Icon,
    HelpCircleIcon,
    FileCopyIcon,
    ColorColumn,
    ColorPicker,
    ColorCollapse,
  },
  data() {
    return {
      themes: DEFAULT_COLOR,
      recommendThemes: RECOMMEND_COLOR,
      sceneThemes: SCENE_COLOR,
      currentThemeColor: DEFAULT_THEME,
      currentDisplayThemeColor: DEFAULT_THEME,
      currentBrandIdx: 6,
      colorPalette: [""], //主题色色阶
      initColorPalette: [""],
      successColorPalette: [""], //成功色色阶
      initSuccessColorPalette: [""],
      warningColorPalette: [""], //告警色色阶
      initWarningColorPalette: [""],
      errorColorPalette: [""], // 错误色色阶
      initErrorColorPalette: [""],
      grayColorPalette: [""], // 中性色色阶
      initGrayColorPalette: [""],
      activeTab: "color",
      isMoreVisible: false,
      generateMode: "remain",
      isGeneratedNeutralColor: false,
      initDefaultGrayColorPalette: [""], // 默认的中性色色阶
    };
  },
  computed: {
    isRemainGenerateMode() {
      return this.generateMode === "remain";
    },
    themeColorRgb() {
      return `(${Color.colorTransform(
        this.currentDisplayThemeColor,
        "hex",
        "rgb"
      ).join(",")})`;
    },
    themeColorHsv() {
      return `(${Color.colorTransform(
        this.currentDisplayThemeColor,
        "hex",
        "hsv"
      ).join(",")})`;
    },
    isColorPaletteChange() {
      return (
        JSON.stringify(this.colorPalette) !==
        JSON.stringify(this.initColorPalette)
      );
    },
    isSuccessPaletteChange() {
      return (
        JSON.stringify(this.successColorPalette) !==
        JSON.stringify(this.initSuccessColorPalette)
      );
    },
    isWarningPaletteChange() {
      return (
        JSON.stringify(this.warningColorPalette) !==
        JSON.stringify(this.initWarningColorPalette)
      );
    },
    isErrorPaletteChange() {
      return (
        JSON.stringify(this.errorColorPalette) !==
        JSON.stringify(this.initErrorColorPalette)
      );
    },
    isGrayPaletteChange() {
      return (
        JSON.stringify(this.grayColorPalette) !==
        JSON.stringify(this.initGrayColorPalette)
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
  mounted() {
    this.setPalette();
    this.setDefaultPalette();
    const currentThemeColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--td-brand-color")
      .toLocaleLowerCase()
      .trim();
    this.currentThemeColor = currentThemeColor;
    this.$nextTick(() => {
      colorAnimation();
    });
  },
  watch: {
    currentThemeColor(currentColor) {
      this.setPalette();
      this.isGeneratedNeutralColor = false;
      if (this.isRemainGenerateMode)
        this.currentDisplayThemeColor = currentColor;
      else
        this.currentDisplayThemeColor = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--td-brand-color")
          .toLocaleLowerCase()
          .trim();
    },
    isRefresh() {
      this.setPalette();
    },
    generateMode() {
      this.changeColor(this.currentThemeColor);
      this.setPalette();
    },
    isRemainGenerateMode(remain) {
      if (remain) this.currentDisplayThemeColor = this.currentThemeColor;
      else
        this.currentDisplayThemeColor = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--td-brand-color")
          .toLocaleLowerCase()
          .trim();
    },
  },
  methods: {
    handleVisibleChange(v) {
      this.isMoreVisible = v;
    },
    changeMainColor(v, type) {
      // 改变某个功能色的主题色
      const { colorPalette } = generateTokenList(
        v,
        false,
        type !== "gray" ? 10 : 14,
        this.isRemainGenerateMode
      );
      let newPalette = [];
      let newInitPalette = [];
      if (type === "error") {
        newPalette = this.errorColorPalette;
        newInitPalette = this.initErrorColorPalette;
      }
      if (type === "success") {
        newPalette = this.successColorPalette;
        newInitPalette = this.initSuccessColorPalette;
      }
      if (type === "warning") {
        newPalette = this.warningColorPalette;
        newInitPalette = this.initWarningColorPalette;
      }
      if (type === "gray") {
        newPalette = this.grayColorPalette;
        newInitPalette = this.initGrayColorPalette;
      }
      colorPalette.forEach((v, i) => {
        if (newPalette[i] && !(newPalette[i] instanceof Array)) {
          newPalette[i].value = v;
          newInitPalette[i].value = v;
          this.changeGradation(v, i, type);
        } else if (newPalette[i] && newPalette[i] instanceof Array) {
          newPalette[i].forEach((p) => {
            p.value = v;
          });

          newInitPalette[i].forEach((p) => {
            p.value = v;
          });
          this.changeGradation(v, i, type);
        }
      });
    },
    setPalette() {
      // 设置各种色阶 为重置需要保留各类色板的初始色阶
      const colorPalette = this.getCurrentPalette();
      this.initColorPalette = JSON.parse(JSON.stringify(colorPalette));
      this.colorPalette = colorPalette;

      const successPalette = this.getCurrentPalette("success");
      this.initSuccessColorPalette = JSON.parse(JSON.stringify(successPalette));
      this.successColorPalette = successPalette;

      const warningPalette = this.getCurrentPalette("warning");
      this.initWarningColorPalette = JSON.parse(JSON.stringify(warningPalette));
      this.warningColorPalette = warningPalette;

      const errorColorPalette = this.getCurrentPalette("error");
      this.initErrorColorPalette = JSON.parse(
        JSON.stringify(errorColorPalette)
      );
      this.errorColorPalette = errorColorPalette;

      const grayColorPalette = this.getCurrentPalette("gray");
      this.initGrayColorPalette = JSON.parse(JSON.stringify(grayColorPalette));

      this.grayColorPalette = grayColorPalette;
    },
    setDefaultPalette() {
      const grayColorPalette = this.getCurrentPalette("gray");
      this.initDefaultGrayColorPalette = JSON.parse(
        JSON.stringify(grayColorPalette)
      );
    },
    handleAttach,
    handleChangeGenerateNeutralColor(generated) {
      if (generated) {
        // 关联生成
        this.generatedNeutralColors = Color.getNeutralColor(
          this.currentThemeColor
        );
        this.generatedNeutralColors.map((color, idx) =>
          this.changeGradation(color, idx, "gray")
        );

        const grayColorPalette = this.getCurrentPalette("gray");
        this.initGrayColorPalette = JSON.parse(
          JSON.stringify(grayColorPalette)
        );
      } else {
        // 不关联生成
        this.initGrayColorPalette = JSON.parse(
          JSON.stringify(this.initDefaultGrayColorPalette)
        );
        this.grayColorPalette = JSON.parse(
          JSON.stringify(this.initDefaultGrayColorPalette)
        );

        this.$nextTick(() => {
          this.recoverGradation("gray");
        });
      }
    },
    changeColor(hex) {
      this.currentThemeColor = hex;
      this.generateNewTheme(hex, this.isRemainGenerateMode);
    },
    recoverGradation(type) {
      let palette;
      const modifiedPalette = this.getCurrentPalette(type);

      if (type === "brand") palette = this.initColorPalette;
      if (type === "error") palette = this.initErrorColorPalette;
      if (type === "success") palette = this.initSuccessColorPalette;
      if (type === "warning") palette = this.initWarningColorPalette;
      if (type === "gray") palette = this.initGrayColorPalette;

      const diffPalette = palette.filter(
        (v, i) => JSON.stringify(v) !== JSON.stringify(modifiedPalette[i])
      );
      diffPalette.forEach((v) => {
        if (v instanceof Array) {
          this.changeGradation(v[0].value, v[0].idx, type);

          return;
        } else this.changeGradation(v.value, v.idx, type);
      });
    },
    changeGradation(hex, idx, type) {
      const tokenIdxName = `--td-${type}-color-${idx + 1}`;
      const styleSheet = document.getElementById("custom-theme");
      if (type === "brand") {
        if (this.colorPalette[idx] instanceof Array) {
          this.colorPalette[idx].map((v) => (v.value = hex));
        } else {
          this.colorPalette[idx].value = hex;
        }
      }
      if (type === "error") {
        this.errorColorPalette[idx].value = hex;
      }
      if (type === "success") {
        this.successColorPalette[idx].value = hex;
      }
      if (type === "warning") {
        this.warningColorPalette[idx].value = hex;
      }
      if (type === "gray") {
        if (this.grayColorPalette[idx] instanceof Array) {
          this.grayColorPalette[idx].map((v) => (v.value = hex));
        } else {
          this.grayColorPalette[idx].value = hex;
        }
      }
      if (styleSheet) {
        const reg = new RegExp(`${tokenIdxName}: (.*)`);
        const curHex = styleSheet.innerText.match(reg)[1].split(";")[0];
        styleSheet.innerText = styleSheet.innerText.replace(
          `${tokenIdxName}: ${curHex}`,
          `${tokenIdxName}: ${hex}`
        );
      }
    },
    getCurrentPalette(type = "brand") {
      let colorMap;
      let duplicateMap = [];
      // 获取匹配色表
      if (type === "brand") {
        colorMap = BRAND_COLOR_MAP;
        const brandIdx = this.currentBrandIdx;
        const hoverIdx = brandIdx > 0 ? brandIdx - 1 : brandIdx;
        const activeIdx = brandIdx > 8 ? brandIdx : brandIdx + 1;
        duplicateMap = [
          { name: "--td-brand-color-hover", type: "hover", idx: hoverIdx },
          { name: "--td-brand-color", type: "main", idx: brandIdx },
          { name: "--td-brand-color-active", type: "active", idx: activeIdx },
        ];
        colorMap = colorMap.concat(duplicateMap);
      }
      if (type === "error") colorMap = ERROR_COLOR_MAP;
      if (type === "success") colorMap = SUCCESS_COLOR_MAP;
      if (type === "warning") colorMap = WARNING_COLOR_MAP;
      if (type === "gray") colorMap = GRAY_COLOR_MAP;

      let docStyle = getComputedStyle(document.documentElement);

      let currentPalette = [...new Array(type === "gray" ? 14 : 10).keys()].map(
        (v, i) => {
          const color = colorMap.filter((v) => v.idx === i);
          if (color.length) {
            if (color.length === 1)
              return {
                ...color[0],
                value: docStyle.getPropertyValue(`--td-${type}-color-${i + 1}`),
              };
            return color.map((v) => ({
              ...v,
              value: docStyle.getPropertyValue(
                `--td-${type}-color-${v.idx + 1}`
              ),
            }));
          }
          return {
            value: docStyle.getPropertyValue(`--td-${type}-color-${i + 1}`),
          };
        }
      );

      return currentPalette;
    },
    generateNewTheme(hex) {
      this.currentThemeColor = hex;
      this.currentBrandIdx = generateNewTheme(
        hex,
        this.isRemainGenerateMode
      ).brandColorIdx;
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .t-popup[data-popper-placement="bottom-end"] .t-popup__arrow {
  left: calc(100% - 16px * 2) !important;
}

.color-content {
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

  /deep/ .t-divider__horizontal {
    margin: 16px 0;
  }

  &__main {
    padding: 12px 4px 16px 16px;
  }

  &__title {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 600;
    margin: 0 0 8px 0;
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
    margin: 0 -2px;
    > div {
      margin: 2px;
    }
  }

  &__block {
    line-height: 18px;
    font-size: 12px;
    text-align: center;
    border-radius: 9px;
    cursor: pointer;
    width: 56px;
    height: 56px;
    transition: background 0.2s;

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
      width: 56px;
      height: 56px;
      border: 1px solid transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: var(--text-secondary);
      transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);

      &:hover {
        color: var(--text-secondary-hover);
        scale: 1.05;
      }

      &.is-active {
        border: 1px solid var(--td-brand-color);
      }

      > div {
        color: var(--td-font-white-1);
      }
    }
  }

  &__custom {
    margin: 8px 0px;
    padding: 2px;
    height: 106px;
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
      padding: 2px 2px 4px 2px;
      border-radius: 7px;
      max-height: 100%;
    }
    &-top {
      padding: 4px 8px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;

      > p {
        color: var(--td-font-white-3);
        margin: 0;
        line-height: 20px;
        font-size: 12px;
      }
    }

    &-bottom {
      padding: 4px 8px;
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

  &__generate-mode {
    display: flex;
    justify-content: space-between;

    &-btn {
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 118px;
      border-radius: 8px;
      &.is-active {
        background: conic-gradient(
          from 180deg at 50% 50%,
          #00c3ff 0,
          var(--td-brand-color) 120deg,
          var(--td-brand-color) 180deg,

          #4ceb1b 290.62deg,
          #00c3ff 360deg
        );
      }
      &-inner {
        border-radius: 6px;
        border: 2px solid var(--bg-color-card);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-anti);
        width: 113px;
        height: 36px;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
