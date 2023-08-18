<template>
  <div>
    <!-- 顶部调整 -->
    <!-- <SegmentSelection
      :selectOptions="selectOptions"
      :suspendedLabels="sizeLabels"
      v-model="step"
      :disabled="segmentSelectionDisabled"
      @enable="segmentSelectionDisabled = false"
    >
      <template v-slot:left>
        <div class="size-panel__round-tag-left">
          <SectionLeftSvg />
        </div>
      </template>
      <template v-slot:right>
        <SectionRightSvg />
      </template>
    </SegmentSelection> -->
    <!-- Token List -->
    <div class="size-panel__token-list">
      <div
        v-for="(size, index) in sizeTokenList"
        :key="index"
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }"
      >
        <span><SectionDynamicSvg :size="parseInt(size.value, 10)" /></span>
        <span>{{ size.name }} : {{ size.value }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="jsx">
import { sizeSteps, sizeLabels, sizeArr } from "../built-in/size-map";
import SegmentSelection from "../../common/SegmentSelection/index.vue";
import SectionLeftSvg from "../svg/SectionLeftSvg.vue";
import SectionRightSvg from "../svg/SectionRightSvg.vue";
import SectionDynamicSvg from "../svg/SectionDynamicSvg.vue";

const STEP_MAP = [
  { label: "默认", value: 3 },
  { label: "自定义", value: 6, disabled: true },
];

export default {
  name: "SizeDisplay",
  components: {
    SegmentSelection,
    SectionLeftSvg,
    SectionRightSvg,
    SectionDynamicSvg,
  },
  data() {
    return {
      step: 3,
      hoverIdx: null,
      selectOptions: STEP_MAP,
      computedStyle: null,
      segmentSelectionDisabled: false,
      sizeLabels,
      sizeArr,
      initSizeTokenList: [],
      sizeTokenList: [
        { token: "--td-size-1", name: "size-1", value: null },
        { token: "--td-size-2", name: "size-2", value: null },
        { token: "--td-size-3", name: "size-3", value: null },
        { token: "--td-size-4", name: "size-4", value: null },
        { token: "--td-size-5", name: "size-5", value: null },
        { token: "--td-size-6", name: "size-6", value: null },
        { token: "--td-size-7", name: "size-7", value: null },
        { token: "--td-size-8", name: "size-8", value: null },
        { token: "--td-size-9", name: "size-9", value: null },
        { token: "--td-size-10", name: "size-10", value: null },
        { token: "--td-size-11", name: "size-11", value: null },
        { token: "--td-size-12", name: "size-12", value: null },
        { token: "--td-size-13", name: "size-13", value: null },
        { token: "--td-size-14", name: "size-14", value: null },
        { token: "--td-size-15", name: "size-15", value: null },
        { token: "--td-size-16", name: "size-16", value: null },
      ],
    };
  },
  watch: {
    step(v) {
      // 改变阶梯
      if (!sizeSteps[v]) return;
    },
  },
  methods: {
    setSizeTokenList() {
      this.sizeTokenList = this.getCurrentSizeToken();
      this.initSizeTokenList = this.sizeTokenList;
    },
    getCurrentSizeToken() {
      let docStyle = getComputedStyle(document.documentElement);
      let currentSizeToken = this.sizeTokenList.map((v, i) => {
        return {
          ...v,
          value:
            v.value ??
            docStyle.getPropertyValue(this.sizeTokenList[i].token).trim(),
        };
      });

      return currentSizeToken;
    },
  },
  mounted() {
    this.setSizeTokenList();
  },
};
</script>
<style lang="less" scoped>
.size-panel {
  &__token-list {
    width: 236px;
    background-color: var(--bg-color-theme-secondary);
    margin-top: 8px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    padding: 8px;
    font-size: 12px;
    border-radius: 9px;
  }
}
</style>
