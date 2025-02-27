<template>
  <div class="recommend-theme">

    <div class="recommend-theme__title-group">
      <div :key="idx" v-for="(type, idx) in recommendThemes" class="recommend-theme__title"
        @click="selectThemeModel(type.id)"
        :style="{ 'font-weight': selectedThemeModelId === type.id ? 'bold' : 'normal' }">
        {{ lang.dock[type.title] }}
      </div>
    </div>

    <div :key="idx" v-for="(type, idx) in recommendThemes">
      <div class="recommend-theme__flex" v-if="type.id === selectedThemeModelId">
        <div v-for="(theme, themeIdx) in type.options" :key="themeIdx" @click=" generateNewTheme(theme)">
          <div class="recommend-theme__flex-theme" :style="{
            'background-color': theme?.subBgColor || uploadThemesConfig.options.subBgColor,
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
            {{ isEn ? theme.enName : theme.name }}
          </p>
        </div>

        <t-upload v-if="type.id === uploadThemesConfig.id" :show-upload-progress="false" :before-upload="uploadNewTheme"
          accept="text/css">
          <template #fileListDisplay>
            <span />
          </template>
          <div class="recommend-theme__flex-theme" :style="{
            'background-color': '#0052D9',
          }">
            <div v-html="uploadThemesConfig.options.subtitle" />
          </div>
          <p :style="{
            margin: '4px 0',
            'text-align': 'center',
            'font-size': '12px',
            'line-height': '20px',
          }">
            {{ isEn ? uploadThemesConfig.options.enName : uploadThemesConfig.options.name }}
          </p>
        </t-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { Upload as TUpload, MessagePlugin } from "tdesign-vue";
import { RECOMMEND_THEMES, UPLOAD_THEMES, UPLOAD_LIMIT_EXCEEDED_MESSAGE } from "./const";
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
      recommendThemesConfig: RECOMMEND_THEMES,
      uploadThemesConfig: UPLOAD_THEMES,
      recommendThemes: [],
      isThemeTabVisible: false,
      isDrawerVisible: false,
      selectedThemeModelId: 'OFFICIAL',
    };
  },
  computed: {
    recommendThemesOptions() {
      return this.recommendThemesConfig.find(i => i.id === this.selectedThemeModelId)?.options;
    },
  },
  mounted() {
    this.createCacheCssLocal();
  },
  methods: {
    createCacheCssLocal() {
      const localCustomThemes = localStorage.getItem('customThemes');
      const localThemesArr = JSON.parse(localCustomThemes) ?? [];

      this.recommendThemesConfig.forEach((item) => {
        const currentTypeIndex = localThemesArr.findIndex(type => type.id === item.id);

        if (currentTypeIndex === -1) {

          const themes = item.options.map((option) => {
            return {
              name: option.name,
              enName: option.enName,
              subtitle: option.subtitle,
              subtitleText: option.subtitleText,
              subBgColor: option.subBgColor,
              value: option.value,
              theme: builtInThemeMap[option.value],
            }
          });
          localThemesArr.push({
            id: item.id,
            title: item.title,
            options: themes,
          });
        } else {
          item.options.forEach((option) => {
            const currentThemeIndex = localThemesArr[currentTypeIndex].options.findIndex(theme => theme.value === option.value);
            const themeCss = builtInThemeMap[option.value];
            if (currentThemeIndex === -1) {
              localThemesArr[currentTypeIndex].options.push({
                name: option.name,
                enName: option.enName,
                subtitle: option.subtitle,
                subBgColor: option.subBgColor,
                subtitleText: option.subtitleText,
                value: option.value,
                theme: themeCss,
              });
            } else {
              localThemesArr[currentTypeIndex].options[currentThemeIndex].theme = themeCss;
            }
          });
        }
      });

      const uploadThemes = localThemesArr.find(item => item.id === this.uploadThemesConfig.id);
      if (!uploadThemes) {
        localThemesArr.push({
          id: this.uploadThemesConfig.id,
          title: this.uploadThemesConfig.title,
          options: [],
        });
      }

      // 初始化主题选择
      this.recommendThemes = localThemesArr;
      localStorage.setItem('customThemes', JSON.stringify(localThemesArr));
    },
    updateCacheCssLocal(id, title, option) {
      const localCustomThemes = localStorage.getItem('customThemes');
      let localThemesArr = JSON.parse(localCustomThemes) ?? [];

      const currentTypeIndex = localThemesArr?.findIndex(item => item.id === id);

      if (currentTypeIndex === -1) {
        localThemesArr.push({
          id,
          title,
          options: []
        });
      }

      const currentOption = localThemesArr[localThemesArr.length - 1].options;
      const currentThemeIndex = currentOption.findIndex(item => item.value === option?.value);

      if (currentThemeIndex === -1) {
        currentOption.push(option);
      } else {
        currentOption[currentThemeIndex] = option;
      }

      this.recommendThemes = localThemesArr;
      localStorage.setItem('customThemes', JSON.stringify(localThemesArr));
    },
    generateNewTheme(theme) {
      document.getElementById('custom-theme').innerText = theme.theme;
      this.$emit("changeTabTheme", theme);
    },
    selectThemeModel(id) {
      this.selectedThemeModelId = id;
    },
    uploadNewTheme(file) {
      const uploadThemes = this.recommendThemes.find(item => item.id === this.uploadThemesConfig.id);
      if (uploadThemes.options.length > 3) {
        //后续改为横向 scroll 滚动展示,可以提高上传数量
        MessagePlugin.success("超过上传数量限制,最大上传数量为3个");
        return false;
      }

      const fileReader = new FileReader();
      fileReader.readAsText(file.raw);
      fileReader.onload = (e) => {
        const theme = e.target.result;
        const themeId = file.name.split('.')[0];
        this.updateCacheCssLocal(this.uploadThemesConfig.id, this.uploadThemesConfig.title, {
          name: themeId,
          enName: themeId,
          subtitle: this.uploadThemesConfig.options.subtitle,
          subtitleText: this.uploadThemesConfig.options.subtitleText,
          subBgColor: this.uploadThemesConfig.options.subBgColor,
          value: themeId,
          theme: theme,
        });
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