import siteConfig from './site.config.mjs'
import siteEnConfig from './site-en.config.mjs'

function getDocsRoutes (docs) {
  let docsRoutes = []
  let docRoute

  docs.forEach((item) => {
    if (item.children) {
      docsRoutes = docsRoutes.concat(getDocsRoutes(item.children))
    } else {
      docRoute = {
        name: item.name,
        path: item.path,
        meta: item.meta || {},
        component: item.component
      }
      docsRoutes.push(docRoute)
    }
  })
  return docsRoutes
}

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      documentTitle: 'TDesign - 开源的企业级设计体系'
    },
    component: () => import('./pages/home/index_zh-CN.vue')
  },
  {
    path: '/design',
    redirect: '/design/values',
    component: () => import('./pages/design/index_zh-CN.vue'),
    children: getDocsRoutes(siteConfig.design.docs)
  },
  {
    path: '/source',
    name: 'source',
    meta: {
      documentTitle: '资源 - TDesign'
    },
    component: () => import('./pages/design/source_zh-CN.vue')
  },
  {
    path: '/about',
    redirect: '/about/introduce',
    component: () => import('./pages/about/index.vue'),
    children: getDocsRoutes(siteConfig.about.docs)
  },
  {
    path: '/trade',
    name: 'trade',
    meta: {
      documentTitle: '行业组件 - TDesign'
    },
    component: () => import('./pages/design/trade.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

// 英文站点路由
const enRoutes = [
  {
    path: '/index-en',
    name: 'home-en',
    meta: {
      documentTitle: 'TDesign - Enterprise Design System'
    },
    component: () => import('./pages/home/index.vue')
  },
  {
    path: '/design-en',
    redirect: '/design/values-en',
    component: () => import('./pages/design/index.vue'),
    children: getDocsRoutes(siteEnConfig.design.docs)
  },
  {
    path: '/source-en',
    name: 'source-en',
    meta: {
      documentTitle: 'Resources - TDesign'
    },
    component: () => import('./pages/design/source.vue')
  },
  {
    path: '/about-en',
    redirect: '/about/introduce-en',
    component: () => import('./pages/about/index.vue'),
    children: getDocsRoutes(siteEnConfig.about.docs)
  },
  {
    path: '/trade-en',
    name: 'trade-en',
    meta: {
      documentTitle: '行业组件 - TDesign'
    },
    component: () => import('./pages/design/trade.vue')
  }
]
export default [...routes, ...enRoutes]
