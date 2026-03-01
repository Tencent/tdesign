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
          :select-options="selectOptions"
          :suspended-labels="suspendedLabels"
          :disabled="segmentSelectionDisabled"
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
  ShadowLabels,
  ShadowSelect,
  ShadowSelectType,
  ShadowStepArray,
  ShadowTypeDetail,
  ShadowTypeMap,
} from './built-in/shadow-map';
import ShadowCard from './components/ShadowCard';

export default {
  name: 'ShadowPanel',
  components: {
    SegmentSelection,
    ShadowCard,
  },
  mixins: [langMixin],
  props: {
    top: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      shadowPalette: [],
      selectOptions: ShadowSelect,
      step: getOptionFromLocal('shadow') || ShadowSelectType.Default,
      suspendedLabels: ShadowLabels,
      segmentSelectionDisabled: false,
    };
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
      if (ShadowStepArray.length < 1) return '';
      return ShadowStepArray[0][0];
    },
    rightShadow() {
      if (ShadowStepArray.length < 2) return '';
      return ShadowStepArray[ShadowStepArray.length - 1][0];
    },
  },
  watch: {
    shadowPalette(list) {
      // 检查当前值是否匹配任何预设
      const currentShadowList = list.map((v) => v.join(', '));
      const existStep = ShadowStepArray.findIndex((steps) => {
        return steps.every((step, i) => {
          // 标准化比较：去除多余空格
          const normalizedStep = step.replace(/\s+/g, ' ').trim();
          const normalizedCurrent = currentShadowList[i]?.replace(/\s+/g, ' ').trim();
          return normalizedStep === normalizedCurrent;
        });
      });

      if (existStep === -1) {
        this.segmentSelectionDisabled = true;
      }
    },
    step(val) {
      updateLocalOption('shadow', val !== ShadowSelectType.Default ? val : null);
      const isCustom = val === ShadowSelectType.Self_Defined;
      this.segmentSelectionDisabled = isCustom;
      if (!ShadowStepArray[val - 1]) return;

      // 批量修改 shadow
      const presetShadows = ShadowStepArray[val - 1];
      this.shadowPalette = presetShadows.map((shadow, index) => {
        const shadowArray = this.splitShadowValue(shadow);
        const newShadow = shadowArray.join(',');
        modifyToken(ShadowTypeMap[index].name, newShadow, isCustom);
        return shadowArray;
      });
    },
  },
  created() {
    this.shadowTypeDetail = ShadowTypeDetail;
  },
  mounted() {
    this.$nextTick(() => {
      this.initShadowToken();
    });
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
    change(value, index) {
      const val = [...this.shadowPalette];
      val[index] = value;
      this.shadowPalette = val;

      // 修改单独的 shadow
      const newShadow = value.join(',');
      modifyToken(ShadowTypeMap[index].name, newShadow);

      // 检查是否还匹配当前预设
      if (ShadowStepArray[this.step - 1]) {
        const presetShadow = this.splitShadowValue(ShadowStepArray[this.step - 1][index]).join(',');
        if (newShadow !== presetShadow) {
          this.segmentSelectionDisabled = true;
        }
      }
    },
    initShadowToken() {
      this.shadowPalette = ShadowTypeMap.map((item) => {
        const data = getTokenValue(item.from);
        return this.splitShadowValue(data);
      });
    },
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
