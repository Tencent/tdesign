<template>
  <div class="shadow-layer">
    <div class="shadow-layer__header">
      <div class="shadow-layer__header--name">{{ detail.key }}</div>
      <add-icon class="shadow-layer__add" @click="handleAdd" />
    </div>
    <shadow-editor
      class="shadow-layer__edit"
      v-for="(data, i) in shadow"
      :key="i"
      :name="`layer${i + 1}`"
      :value="data"
      @change="(value) => change(value, i)"
      @move="() => handleMove(i)"
    >
    </shadow-editor>
  </div>
</template>
<script lang="jsx">
import { AddIcon } from "tdesign-icons-vue";
import ShadowEditor from "./ShadowEditor.vue";
export default {
  name: "ShadowLayer",
  props: {
    shadow: Array,
    detail: Object,
  },
  components: {
    AddIcon,
    ShadowEditor,
  },
  methods: {
    change(value, index) {
      const val = [...this.shadow];
      val[index] = value;
      this.$emit("change", val);
    },
    handleAdd() {
      const val = [...this.shadow];
      val.push("0, 0, 0, 0, rgba(0, 0, 0, 0)");
      this.$emit("change", val);
    },
    handleMove(index) {
      const val = [...this.shadow];
      val.splice(index, 1);
      this.$emit("change", val);
    },
  },
};
</script>
<style scoped lang="less">
.shadow-layer {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: auto;

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

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    &--name {
      font-size: 14px;
      color: var(--text-primary);
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
        "Liberation Mono", monospace;
    }
  }
  &__add {
    margin-right: 8px;
    color: var(--text-primary);
    cursor: pointer;
  }
  &__card {
    padding: 8px;
    width: 208px;
    background: var(--bg-color-theme-secondary);
    border-radius: 6px;
    &--item {
      display: flex;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    &--x {
      width: 60px;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
    &--sharp {
      width: 24px;
      height: 24px;
      border: 1px solid var(--bg-color-demo-select);
      border-radius: 3px;
    }
    &--color {
      margin-left: 4px;
      font-size: 14px;
      line-height: 22px;
      color: var(--text-primary);
    }
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  &__name {
    font-size: 12px;
    color: var(--text-primary);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
  }
  &__suffix {
    font-size: 14px;
    color: var(--text-placeholder);
  }
  &__edit {
    margin-bottom: 8px;
  }
}
</style>
