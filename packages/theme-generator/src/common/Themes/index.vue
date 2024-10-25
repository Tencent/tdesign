<template>
  <div class="recommend-theme">
    <div class="recommend-theme__title-group">
      <div :key="idx" v-for="(type, idx) in recommendThemes" class="recommend-theme__title"
        @click="selectThemeModel(idx)" :style="{ 'font-weight': selectedThemeModel === idx ? 'bold' : 'normal' }">
        {{ lang.dock[type.title] }}
      </div>
    </div>

    <div class="recommend-theme__flex" v-if="recommendThemes[selectedThemeModel].id === 'CUSTOM'">
      <div v-for="(theme, themeIdx) in recommendThemesOptions" :key="themeIdx">
        <t-upload v-if="recommendThemesOptions.length - 1 === themeIdx" :request-method="requestMethod"
          :show-upload-progress="false" :before-upload="uploadNewTheme">
          <template #fileListDisplay>
            <span />
          </template>
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
        </t-upload>
        <div v-else>
          <div class="recommend-theme__flex-theme" @click="generateNewTheme(theme)" :style="{
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
    </div>

    <div class="recommend-theme__flex" v-else>
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
  </div>
</template>

<script>
import { Upload as TUpload, MessagePlugin } from "tdesign-vue";
import { RECOMMEND_THEMES } from "./const";
import { generateNewTheme, appendStyleSheet } from "../utils";
import PickedSvg from "./PickedSvg.vue";
import langMixin from "../i18n/mixin";

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
      isThemeTabVisible: false,
      isDrawerVisible: false,
      selectedThemeModel: 0,
      uploadMethod: 'requestSuccessMethod',
      uploadThemeFile: [],
      customUploadTheme: [
        {
          name: "占位测试",
          subtitle: null,
          value: "#133BFF",
        }
      ],
    };
  },
  computed: {
    recommendThemesOptions() {
      if (this.recommendThemes[this.selectedThemeModel].id === 'CUSTOM') {
        return [...this.customUploadTheme, ...this.recommendThemes[this.selectedThemeModel].options];
      }
      return this.recommendThemes[this.selectedThemeModel].options;
    },
    requestMethod() {
      return {
        requestSuccessMethod: this.requestSuccessMethod,
        requestFailMethod: this.requestFailMethod,
      }[this.uploadMethod];
    },
  },
  methods: {
    // file 为等待上传的文件信息，用于提供给上传接口。file.raw 表示原始文件
    requestSuccessMethod(file /** UploadFile */) {
      return new Promise((resolve) => {
        // 控制上传进度
        //todo 这里要变成数组
        MessagePlugin.success('上传成功');
        this.uploadThemeFile.push(file);
        resolve({ status: 'success', response: { files: [...this.uploadThemeFile, file] } });
      });
    },
    requestFailMethod(file /** UploadFile */) {
      console.log(file);
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
    selectThemeModel(idx) {
      this.selectedThemeModel = idx;
    },
    uploadNewTheme(file) {
      console.log('todo', file);
      // 读取文件
      const fileReader = new FileReader();
      fileReader.readAsText(file.raw);
      fileReader.onload = (e) => {
        const theme = e.target.result;
        console.log('文件内容');
        const themeId = `custom-theme-${this.customUploadTheme.length}`;
        const existSheet = document.getElementById(themeId);
        if (!existSheet) {
          const styleSheet = document.createElement('style');
          styleSheet.id = themeId;
          styleSheet.type = 'text/css';
          styleSheet.textContent = theme;
          document.head.appendChild(styleSheet);
        }

        document.documentElement.setAttribute('theme-color', themeId);

      };
      // todo上传多个文件
      return false;
    },
  },
  mounted() {
    this.selectThemeModel(this.selectedThemeModel);
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