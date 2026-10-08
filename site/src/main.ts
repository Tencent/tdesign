import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import TDesign from 'tdesign-vue-next';
import routes from './routes';
import App from './App.vue';
import { getLocaleFromPath, i18n, setLocale } from './i18n';
import '@/style/index.less';

// import tdesign style;
import 'tdesign-vue-next/es/style/index.css';

// import site webcomponents
import '@tdesign/site-components';
import '@tdesign/site-components/lib/styles/style.css';
import '@tdesign/site-components/lib/styles/prism-theme.less';
import '@tdesign/site-components/lib/styles/prism-theme-dark.less';
import 'tdesign-icons-view';
import { registerLocaleChange } from '@tdesign/site-components';

registerLocaleChange();

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const locale = to.meta.locale === 'en-US' || to.meta.locale === 'zh-CN' ? to.meta.locale : getLocaleFromPath(to.path);
  setLocale(locale);
  if (to.name !== from.name) {
    window.NProgress?.start?.();
  }
  next();
});

router.afterEach(() => {
  window.NProgress?.done?.();
  document.querySelector<HTMLElement>('td-stats')?.track?.();
});

const app = createApp(App);

app.use(TDesign);
app.use(i18n);
app.use(router);
app.mount('#app');
