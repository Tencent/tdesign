import Vue from "vue";

import Generator from "./Generator.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Generator),
}).$mount("#app");
