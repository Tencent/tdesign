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
        <SegmentSelection
          v-model="step"
          :selectOptions="selectOptions"
          :suspendedLabels="suspendedLabels"
          :disabled="forbidden"
        >
          <template #left>
            <div class="shadow-panel__round-box" :style="{ 'box-shadow': leftShadow }"></div>
          </template>
          <template #right>
            <div class="shadow-panel__round-box" :style="{ 'box-shadow': rightShadow }"></div>
          </template>
        </SegmentSelection>
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
import { SegmentSelection } from '@/common/components';
import { langMixin } from '@/common/i18n';
import { getOptionFromLocal, modifyToken, updateLocalOption } from '@/common/themes';
import { getTokenValue } from '@/common/utils';

import {
  ShadowSelect,
  ShadowSelectDetail,
  ShadowSelectType,
  ShadowTypeDetail,
  ShadowTypeMap,
} from './built-in/shadow-map';
import ShadowCard from './components/ShadowCard';

export default {
  name: 'ShadowPanel',
  props: {
    top: Number,
  },
  components: {
    SegmentSelection,
    ShadowCard,
  },
  mixins: [langMixin],
  data() {
    return {
      shadowPalette: [],
      selectOptions: ShadowSelect,
      selfDefined: ShadowSelectType,
      step: getOptionFromLocal('shadow') || ShadowSelectType.Default,
      suspendedLabels: {},
    };
  },
  created() {
    this.shadowTypeDetail = ShadowTypeDetail;
    this.suspendedLabels = this.selectOptions.reduce((acc, option) => {
      acc[option.value] = this.isEn ? option.enLabel : option.label;
      return acc;
    }, {});
  },
  computed: {
    contentStyle() {
      const clientHeight = window.innerHeight;
      return {
        overflowY: 'scroll',
        height: `${clientHeight - (this.top || 0) - 96}px`,
      };
    },
    leftShadow() {
      const selectKeys = Object.keys(ShadowSelectDetail);
      if (selectKeys.length < 1) return '';
      const shadowArray = ShadowSelectDetail[selectKeys[0]][0];
      return shadowArray;
    },
    rightShadow() {
      const selectKeys = Object.keys(ShadowSelectDetail);
      if (selectKeys.length < 1) return '';
      // 倒数第二个的，最后一个为自定义
      const shadowArray = ShadowSelectDetail[selectKeys[selectKeys.length - 2]][0];
      return shadowArray;
    },
    forbidden() {
      return this.step === ShadowSelectType.Self_Defined;
    },
  },
  watch: {
    step: {
      handler(nVal) {
        updateLocalOption('shadow', nVal !== ShadowSelectType.Default ? nVal : null);
        // 自定义时去当前系统值
        if (nVal === ShadowSelectType.Self_Defined) {
          // this.shadowPalette = this.getCurrentPalette();
          return;
        }
        const shadows = ShadowSelectDetail[nVal];
        if (!shadows) return;
        this.shadowPalette = shadows.map((shadow) => this.splitShadowValue(shadow));
      },
    },
    shadowPalette(nVal) {
      // shadowPalette 值变化时认为有编辑
      const currentPalette = this.getCurrentPalette();
      for (let index = 0; index < nVal.length; index++) {
        const shadow = nVal[index];
        const current = currentPalette[index];
        const newShadow = shadow.join(',');
        if (newShadow === current.join(',')) continue;
        const { name } = ShadowTypeMap[index];

        const isCustom = this.step === ShadowSelectType.Self_Defined;
        modifyToken(name, isCustom ? newShadow : null);
      }
    },
  },
  methods: {
    // 拆分 box-shadow 的值 0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 8%), 0 2px 4px -1px rgba(0, 0, 0, 12%)
    splitShadowValue(data) {
      const tempData = `${data},`;
      const shadows = tempData.split('),');
      return shadows
        .filter((shadow) => shadow)
        .map((shadow) => {
          const value = shadow.trim();
          return `${value})`;
        });
    },
    getCurrentPalette() {
      const currentPalette = [...new Array(ShadowTypeMap.length).keys()].map((_, i) => {
        const { value, from } = ShadowTypeMap[i];
        if (value) return value;
        const data = getTokenValue(from);
        return this.splitShadowValue(data);
      });
      return currentPalette;
    },
    change(value, index) {
      this.step = ShadowSelectType.Self_Defined;
      const val = [...this.shadowPalette];
      val[index] = value;
      this.shadowPalette = val;
    },
    setCurrentPalette() {
      const currentTokenArr = this.getCurrentPalette();
      this.shadowPalette = currentTokenArr.map((token) => this.splitShadowValue(token));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setCurrentPalette();
    });
  },
};
</script>

<style scoped lang="less">
/deep/ .t-popup[data-popper-placement='bottom-end'] .t-popup__arrow {
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
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
}
.shadow-panel {
  &__round-box {
    width: 20px;
    height: 20px;
    background: var(--bg-color-theme-surface);
    border-radius: 3px;
  }
}
</style>
