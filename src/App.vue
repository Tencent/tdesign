<template>
  <IssuePage />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IssuePage from './components/IssuePage';

export default defineComponent({
  name: 'App',
  components: {
    IssuePage,
  },
});
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 320px;
  --header-height: 60px;
  --header-box-shadow: inset 0 -1px 0 #e7e7e7;
  --header-inner-padding: 0 24px;
  --content-width: 960px;
}

body {
  overflow: auto;
  -webkit-font-smoothing: antialiased;
  font-family: "PingFang SC";
}

a {
  text-decoration: none;
  color: #0052D9;
  cursor: pointer;
}

.content-text {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.content-paragraph {
  margin-bottom: 16px;
}

.content-box {
  margin: auto;
  width: var(--content-width);
}

.t-input__extra {
  margin: 0;
}
</style>
