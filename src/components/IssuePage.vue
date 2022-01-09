<template>
  <PageHead :lang="lang" @langChange="setLang" />
  <div class="content-box">
    <div class="content"><Intro :lang="lang" /></div>
    <!-- <div class="content"><IssueForm :lang="lang" /></div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PageHead from './PageHead.vue';
import Intro from './Intro.vue';
// import IssueForm from './IssueForm.vue';
import { getQuery, updateQuery } from './utils';

export default defineComponent({
  name: 'IssuePage',
  components: {
    PageHead,
    Intro,
    // IssueForm,
  },
  setup: () => {
    const lang = ref<'en-US' | 'zh-CN'>('zh-CN');

    const setLang = (value: 'en-US' | 'zh-CN') => {
      lang.value = value;
      updateQuery({ lang: value });
    };

    // init
    const param = getQuery();
    if (!param?.lang) {
      updateQuery({ lang: lang.value });
    } else {
      setLang(param.lang);
    }

    // back, forward
    window.addEventListener(
      'popstate',
      () => (lang.value = getQuery()?.lang || 'en-US')
    );

    return {
      lang,
      setLang,
    };
  },
});
</script>

<style scoped>
.content-box {
  margin: auto;
  width: var(--content-width);
  max-width: var(--content-max-width);
}

.content {
  margin-top: 24px;
}
</style>
