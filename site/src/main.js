/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';
import TDesign from 'tdesign-vue';
import routes from './routes';
import App from './App.vue';
import '@/style/index.less';

// import tdesign style;
import 'tdesign-vue/es/style/index.css';

// import site webcomponents
import 'tdesign-site-components';
import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';
import "tdesign-icons-view";
import { registerLocaleChange } from 'tdesign-site-components';

registerLocaleChange()

Vue.use(TDesign);
Vue.use(VueRouter);

Vue.config.ignoredElements = [/^td-/];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== from.name) {
    window.NProgress && NProgress.start?.();
  }
  next();
});

router.afterEach(() => {
  window.NProgress && NProgress.done?.();
  document.querySelector('td-stats')?.track?.();
});

new Vue({
  el: '#app',
  render: (h) => h(App),
  router,
});

