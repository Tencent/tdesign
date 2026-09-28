import { createSiteConfig, siteMessages } from './site.config';

function getDocsRoutes(docs) {
  let docsRoutes = [];
  let docRoute;

  docs.forEach((item) => {
    if (item.children) {
      docsRoutes = docsRoutes.concat(getDocsRoutes(item.children));
    } else {
      docRoute = {
        name: item.name,
        path: item.path,
        meta: item.meta || {},
        component: item.component,
      };
      docsRoutes.push(docRoute);
    }
  });
  return docsRoutes;
}

function createLocalizedRoutes(locale) {
  const isEnglish = locale === 'en-US';
  const suffix = isEnglish ? '-en' : '';
  const config = createSiteConfig(locale);
  const titles = siteMessages[locale].routeTitles;

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
      children: getDocsRoutes(config.design.docs),
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
      children: getDocsRoutes(config.about.docs),
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

export default [
  ...createLocalizedRoutes('zh-CN'),
  ...createLocalizedRoutes('en-US'),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];
