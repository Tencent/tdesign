<template>
  <div class="recommend-theme">
    <div class="recommend-theme__title-group">
      <div :key="idx" v-for="(type, idx) in [...recommendThemes, upload_themes]" class="recommend-theme__title"
        @click="selectThemeModel(type.id)"
        :style="{ 'font-weight': selectedThemeModel === type.id ? 'bold' : 'normal' }">
        {{ lang.dock[type.title] }}
      </div>
    </div>
    <div class="recommend-theme__flex" v-if="selectedThemeModel !== 'CUSTOM'">
      <div v-for="(theme, themeIdx) in recommendThemesOptions" :key="themeIdx" @click="generateNewTheme(theme)">
        <div class="recommend-theme__flex-theme" :style="{
          'background-color': theme.value,
        }">
          <div v-html="theme.subtitle" />
          <div v-if="currentTheme && currentTheme.value === theme.value" class="recommend-theme__flex-theme--active">
            <picked-svg />
          </div>
        </div>
        <p :style="{
          margin: '4px 0',
          'text-align': 'center',
          'font-size': '12px',
          'line-height': '20px',
        }">
          {{ isEn ? theme.enName : theme.name }}
        </p>
      </div>
    </div>
    <div class="recommend-theme__flex" v-else>
      <div v-for="(theme, themeIdx) in customUploadTheme" :key="themeIdx">
        <div>
          <div class="recommend-theme__flex-theme" @click="generateUploadTheme(theme)" :style="{
            'background-color': '#0052D9',
          }">
            <div v-html="theme.subtitle" />
            <div v-if="currentTheme && currentTheme.value === theme.value" class="recommend-theme__flex-theme--active">
              <picked-svg />
            </div>
          </div>
          <p :style="{
            'margin': '4px 0',
            'text-align': 'center',
            'font-size': '12px',
            'line-height': '20px',
            'width': '78px',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
          }">
            {{ theme.name }}
          </p>
        </div>
      </div>
      <t-upload v-if="customUploadTheme.length < 4" :request-method="requestMethod" :show-upload-progress="false"
        :before-upload="uploadNewTheme" accept="text/css">
        <template #fileListDisplay>
          <span />
        </template>
        <div class="recommend-theme__flex-theme" :style="{
          'background-color': upload_themes.options[0].value,
        }">
          <div v-html="upload_themes.options[0].subtitle" />
          <div v-if="currentTheme && currentTheme.value === upload_themes.options[0].value"
            class="recommend-theme__flex-theme--active">
            <picked-svg />
          </div>
        </div>
        <p :style="{
          margin: '4px 0',
          'text-align': 'center',
          'font-size': '12px',
          'line-height': '20px',
        }">
          {{ isEn ? upload_themes.options[0].enName : upload_themes.options[0].name }}
        </p>
      </t-upload>
    </div>
  </div>
</template>

<script>
import { Upload as TUpload, MessagePlugin } from "tdesign-vue";
import { RECOMMEND_THEMES, UPLOAD_THEMES } from "./const";
import TencentSafe from "!raw-loader!./svg/TencentSafe";
import { generateNewTheme } from "../utils";
import PickedSvg from "./PickedSvg.vue";
import langMixin from "../i18n/mixin";
import { builtInThemeMap } from '../built-in/theme-map';

export default {
  emit: ["changeTabTheme"],
  props: {
    currentTheme: Object,
  },
  components: { PickedSvg, TUpload },
  mixins: [langMixin],
  data() {
    return {
      MessagePlugin,
      recommendThemes: RECOMMEND_THEMES,
      upload_themes: UPLOAD_THEMES,
      isThemeTabVisible: false,
      isDrawerVisible: false,
      selectedThemeModel: 'OFFICIAL',
      uploadMethod: 'requestSuccessMethod',
      uploadThemeFile: [],
      customUploadTheme: [],
    };
  },
  computed: {
    recommendThemesOptions() {
      return this.recommendThemes.find(i => i.id === this.selectedThemeModel)?.options;
    },
    requestMethod() {
      return {
        requestSuccessMethod: this.requestSuccessMethod,
        requestFailMethod: this.requestFailMethod,
      }[this.uploadMethod];
    },
  },
  mounted() {
    this.createCacheCssLocal();
  },
  methods: {
    createCacheCssLocal() {
      const localCustomThemes = localStorage.getItem('customThemes');
      const localThemesArr = JSON.parse(localCustomThemes) ?? [];

      this.recommendThemes.forEach((item) => {
        const currentTypeIndex = localThemesArr.findIndex(type => type.id === item.id);

        if (currentTypeIndex !== -1) {
          item.options.forEach((option) => {
            const currentThemeIndex = localThemesArr[currentTypeIndex].options.findIndex(theme => theme.value === option.value);
            const themeCss = builtInThemeMap[option.value];

            if (currentThemeIndex !== -1) {
              localThemesArr[currentTypeIndex].options[currentThemeIndex].theme = themeCss;
            } else {
              localThemesArr[currentTypeIndex].options.push({
                value: option.value,
                theme: themeCss,
              });
            }
          });
        } else {
          const themes = item.options.map((option) => {
            return {
              value: option.value,
              theme: builtInThemeMap[option.value],
            }
          });
          localThemesArr.push({
            id: item.id,
            options: themes,
          });
        }
      });
      localStorage.setItem('customThemes', JSON.stringify(localThemesArr));
    },
    updateCacheCssLocal(id, value, theme) {
      const localCustomThemes = localStorage.getItem('customThemes');
      let localThemesArr = JSON.parse(localCustomThemes) ?? [];

      const currentTypeIndex = localThemesArr?.findIndex(item => item.id === id);

      if (currentTypeIndex === -1) {
        localThemesArr.push({ id: id, options: [] });
      }

      const currentOption = localThemesArr[localThemesArr.length - 1].options;
      const currentThemeIndex = currentOption.findIndex(item => item.value === value);
      if (currentThemeIndex !== -1) {
        currentOption[currentThemeIndex].theme = theme;
      } else {
        currentOption.push({ value: value, theme: theme });
      }
      localStorage.setItem('customThemes', JSON.stringify(localThemesArr));
    },
    requestSuccessMethod(file) {
      return new Promise((resolve) => {
        MessagePlugin.success('上传成功');
        this.uploadThemeFile.push(file);
        resolve({ status: 'success', response: { files: [...this.uploadThemeFile, file] } });
      });
    },
    requestFailMethod(file) {
      return new Promise((resolve) => {
        // resolve 参数为关键代码
        MessagePlugin.error('上传失败，请检查文件是否符合规范');
        resolve({ status: 'fail', error: '上传失败，请检查文件是否符合规范' });
      });
    },
    generateNewTheme(theme) {
      generateNewTheme(theme.value);
      this.$emit("changeTabTheme", theme);
    },
    generateUploadTheme(theme) {
      document.getElementById('custom-theme').innerText = theme.theme;
      this.$emit("changeTabTheme", theme);
    },
    selectThemeModel(id) {
      this.selectedThemeModel = id;
    },
    uploadNewTheme(file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file.raw);
      fileReader.onload = (e) => {
        const theme = e.target.result;
        const themeId = file.name.split('.')[0];
        this.updateCacheCssLocal('CUSTOM', themeId, theme);

        // let themeMap = new Map(this.customUploadTheme.map(item => [item.name, item]));
        // themeMap.set(themeId, {
        //   name: themeId,
        //   value: themeId,
        //   theme: theme,
        //   subtitle: TencentSafe,
        // });
        // this.customUploadTheme = Array.from(themeMap.values());
      };
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.recommend-theme {
  max-height: 376px;
  border-radius: 32px 32px 0px 0px;

  &__title-group {
    display: flex;
  }

  &__title {
    color: var(--text-primary);
    font-weight: 600;
    font-size: 14px;
    margin: 8px 0px 0px 12px;
    line-height: 22px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

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

  &__flex {
    display: flex;
    flex-wrap: wrap;
    margin: 4px -4px;
    cursor: pointer;

    >div {
      margin: 4px;
      padding: 6px 6px 0px 6px;
      color: var(--text-primary);
      background: var(--bg-color-card);
      border-radius: 18px;
      transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);

      &:hover {
        scale: 1.05;
      }
    }

    &-theme {
      width: 78px;
      height: 62px;
      padding: 8px 6px;
      border-radius: 12px;
      position: relative;
      overflow: hidden;

      &--active {
        position: absolute;
        right: 0px;
        top: 30px;
      }
    }
  }
}
</style>