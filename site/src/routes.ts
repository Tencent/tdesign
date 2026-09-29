import type { RouteRecordRaw } from 'vue-router';
import type { Locale } from './i18n';
import siteConfig, { type SiteDoc } from './site.config';
import siteEnConfig from './site-en.config';

const routeTitles: Record<Locale, { home: string; source: string; trade: string; icons: string }> = {
  'zh-CN': {
    home: 'TDesign - 开源的企业级设计体系，为设计师 & 开发者，打造工作美学',
    source: '资源 - TDesign',
    trade: '行业组件 - TDesign',
    icons: '图标资源 - TDesign',
  },
  'en-US': {
    home: 'TDesign - Enterprise Design System',
    source: 'Resources - TDesign',
    trade: 'Trade Components - TDesign',
    icons: 'Icons - TDesign',
  },
};

function getDocsRoutes(docs: SiteDoc[], locale: Locale): RouteRecordRaw[] {
  let docsRoutes: RouteRecordRaw[] = [];

  docs.forEach((item) => {
    if (item.children) {
      docsRoutes = docsRoutes.concat(getDocsRoutes(item.children, locale));
    } else {
      if (!item.name || !item.path || !item.component) {
        throw new Error(`Incomplete documentation route: ${item.name}`);
      }
      const docRoute: RouteRecordRaw = {
        name: item.name,
        path: item.path,
        meta: { locale, ...(item.meta || {}) },
        component: item.component,
      };
      docsRoutes.push(docRoute);
    }
  });
  return docsRoutes;
}

function createLocalizedRoutes(locale: Locale): RouteRecordRaw[] {
  const isEnglish = locale === 'en-US';
  const suffix = isEnglish ? '-en' : '';
  const config = isEnglish ? siteEnConfig : siteConfig;
  const titles = routeTitles[locale];

  return [
    {
      path: isEnglish ? '/index-en' : '/',
      name: `home${suffix}`,
      meta: { locale, documentTitle: titles.home, fixedHeader: true },
      component: () => import('./pages/home/index.vue'),
    },
    {
      path: `/design${suffix}`,
      name: `design${suffix}`,
      redirect: `/design/values${suffix}`,
      meta: { locale },
      component: () => import('./pages/design/index.vue'),
      children: getDocsRoutes(config.design.docs, locale),
    },
    {
      path: `/source${suffix}`,
      name: `source${suffix}`,
      meta: { locale, documentTitle: titles.source, fixedHeader: true },
      component: () => import('./pages/design/source.vue'),
    },
    {
      path: `/about${suffix}`,
      name: `about${suffix}`,
      redirect: `/about/introduce${suffix}`,
      meta: { locale },
      component: () => import('./pages/about/index.vue'),
      children: getDocsRoutes(config.about.docs, locale),
    },
    {
      path: `/trade${suffix}`,
      name: `trade${suffix}`,
      meta: { locale, documentTitle: titles.trade, fixedHeader: true },
      component: () => import('./pages/design/trade.vue'),
    },
    {
      path: `/icons${suffix}`,
      name: `icons${suffix}`,
      meta: { locale, documentTitle: titles.icons, fixedHeader: true },
      component: () => import('./pages/icons/index.vue'),
    },
  ];
}

const routes: RouteRecordRaw[] = [
  ...createLocalizedRoutes('zh-CN'),
  ...createLocalizedRoutes('en-US'),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

export default routes;
