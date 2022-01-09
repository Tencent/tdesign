<template>
  <v-node :render="contentText.introTitle" />
  <v-node :render="contentText.introOne" />

  <t-alert
    :title="contentText.introWarningTitle"
    :message="contentText.introWarningContent"
    theme="warning"
    style="margin-bottom: 16px"
  />

  <t-button variant="text" theme="primary" @click="introVisible = true">{{
    contentText.explainTitle
  }}</t-button>

  <v-node :render="contentText.introTwo" />

  <t-dialog
    v-model:visible="introVisible"
    theme="info"
    :header="contentText.explainTitle"
    :on-close="(introVisible = false)"
    :body="contentText.explain"
  />
</template>

<script lang="ts">
import { ref, defineComponent, Ref, PropType, toRef, computed } from 'vue';
import content from '../content.js';

export default defineComponent({
  name: 'Intro',
  props: {
    lang: {
      type: String as PropType<'en-US' | 'zh-CN'>,
    },
  },
  setup: (props) => {
    const lang = toRef(props, 'lang');
    const contentText = computed(() => content[lang.value]);
    const introVisible: Ref<boolean> = ref(false);
    return { lang, contentText, introVisible };
  },
});
</script>

<style scoped></style>
