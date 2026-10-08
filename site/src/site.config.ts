import type { Component } from 'vue';

type PageLoader = () => Promise<{ default: Component }>;

export interface SiteDocMeta {
  documentTitle?: string;
  title?: string;
  desc?: string;
}

export interface SiteDoc {
  name?: string;
  title: string;
  path?: string;
  meta?: SiteDocMeta;
  component?: PageLoader;
  children?: SiteDoc[];
}

export interface SiteConfig {
  design: {
    title: string;
    url: string;
    docs: SiteDoc[];
  };
  about: {
    title: string;
    url: string;
    docs: SiteDoc[];
  };
}

const siteConfig: SiteConfig = {
  design: {
    title: '设计指南',
    url: 'design',
    docs: [
      {
        name: 'tdesign',
        title: 'TDesign',
        children: [
          {
            name: 'values',
            title: '价值观',
            path: '/design/values',
            meta: {
              documentTitle: '价值观 - TDesign',
              title: '价值观',
              desc: 'TDesign 为了在开源体系的基础上打造具有自身品牌特色且好⽤的产品，秉承包容、多元、进化、连接的价值观。',
            },
            component: () => import('@/pages/design/values.vue'),
          },
        ],
      },
      {
        name: 'global',
        title: '全局样式',
        children: [
          {
            name: 'color',
            title: 'Color 色彩',
            path: '/design/color',
            meta: {
              documentTitle: 'Color 色彩 - TDesign',
              title: 'Color 色彩',
              desc: '色彩在产品中起到传递信息、创建层级、表达情感、构建一致性的目的。',
            },
            component: () => import('@/pages/design/color.vue'),
          },
          {
            name: 'fonts',
            title: 'Fonts 字体',
            path: '/design/fonts',
            meta: {
              documentTitle: 'Fonts 字体 - TDesign',
              title: 'Fonts 字体',
              desc: '字体遵循好用、好记和美观的设计原则，让内容更有规律和韵律。',
            },
            component: () => import('@/pages/design/fonts.vue'),
          },
          {
            name: 'motion',
            title: 'Motion 动效',
            path: '/design/motion',
            meta: {
              documentTitle: 'Motion 动效 - TDesign',
              title: 'Motion 动效',
              desc: '动效可以让界面表达明确、清晰、流畅，从而增强用户感知。',
            },
            component: () => import('@/pages/design/motion.vue'),
          },
          {
            name: 'icon',
            title: 'Icon 图标',
            path: '/design/icon',
            meta: {
              documentTitle: 'Icon 图标 - TDesign',
              title: 'Icon 图标',
              desc: 'Icon 作为 UI 构成中重要的元素，一定程度上影响 UI 界面整体呈现出的风格。',
            },
            component: () => import('@/pages/design/icon.vue'),
          },
          {
            name: 'layout',
            title: 'Layout 布局',
            path: '/design/layout',
            meta: {
              documentTitle: 'Layout 布局 - TDesign',
              title: 'Layout 布局',
              desc: '用于组织网页的框架结构，可以影响用户的浏览顺序。清晰的布局和数据展示可以帮助用户高效获取信息。',
            },
            component: () => import('@/pages/design/layout.vue'),
          },
          {
            name: 'dark',
            title: 'Dark Mode 深色模式',
            path: '/design/dark',
            meta: {
              documentTitle: 'Dark Mode 深色模式 - TDesign',
              title: 'Dark Mode 深色模式',
              desc: '深色模式是一种夜间友好的颜色主题，帮助用户更沉浸式地工作。',
            },
            component: () => import('@/pages/design/dark.vue'),
          },
        ],
      },
      {
        name: 'offices-design',
        title: '中后台设计指南',
        children: [
          {
            name: 'offices',
            title: '如何搭建整体框架',
            path: '/design/offices',
            meta: {
              documentTitle: '如何搭建整体框架 - TDesign',
              title: '如何搭建整体框架',
              desc: '在明确系统功能分类和结构后，先选择合适的页面导航和布局，建立基础的中后台框架。',
            },
            component: () => import('@docs/design/offices_zh-CN.md'),
          },
          {
            name: 'officesTask',
            title: '如何设计高频任务',
            path: '/design/offices-task',
            meta: {
              documentTitle: '如何设计高频任务 - TDesign',
              title: '如何设计高频任务',
              desc: '明确整体框架和页面布局后，根据业务场景，对相关任务流程进行设计。',
            },
            component: () => import('@docs/design/offices-task_zh-CN.md'),
          },
        ],
      },
    ],
  },
  about: {
    title: '关于',
    url: 'about',
    docs: [
      {
        title: '介绍',
        children: [
          {
            name: 'introduce',
            title: '关于我们',
            path: '/about/introduce',
            meta: {
              documentTitle: '关于我们 - TDesign',
              title: '关于我们',
            },
            component: () => import('@docs/introduce_zh-CN.md'),
          },
          {
            name: 'tech',
            title: '整体方案',
            path: '/about/tech',
            meta: {
              documentTitle: '整体方案 - TDesign',
              title: '整体方案',
            },
            component: () => import('@docs/tech_zh-CN.md'),
          },
          {
            name: 'roadmap',
            title: '后续计划',
            path: '/about/roadmap',
            meta: {
              documentTitle: '后续计划 - TDesign',
              title: '后续计划',
            },
            component: () => import('@docs/roadmap_zh-CN.md'),
          },
          {
            name: 'faq',
            title: '常见问题',
            path: '/about/faq',
            meta: {
              documentTitle: '常见问题 - TDesign',
              title: '常见问题',
            },
            component: () => import('@docs/faq_zh-CN.md'),
          },
          {
            name: 'awesome',
            title: '社区资源',
            path: '/about/awesome',
            meta: {
              documentTitle: '社区资源 - TDesign',
              title: '社区资源',
            },
            component: () => import('@docs/awesome_zh-CN.md'),
          },
          {
            name: 'release',
            title: '发布汇总',
            path: '/about/release',
            meta: {
              documentTitle: '发布汇总 - TDesign',
              title: '发布汇总',
              desc: '为你带来TDesign最新的发布动态',
            },
            component: () => import('@/pages/about/release.vue'),
          },
        ],
      },
      {
        title: '加入',
        children: [
          {
            name: 'contributing',
            title: '如何贡献',
            path: '/about/contributing',
            meta: {
              documentTitle: '如何贡献 - TDesign',
              title: '如何贡献',
            },
            component: () => import('@docs/contributing_zh-CN.md'),
          },
          {
            name: 'newComponent',
            title: '组件开发流程',
            path: '/about/new-component',
            meta: {
              documentTitle: '组件开发流程 - TDesign',
              title: '组件开发流程',
            },
            component: () => import('@docs/new-component_zh-CN.md'),
          },
          {
            name: 'contact',
            title: '联系我们',
            path: '/about/contact',
            meta: {
              documentTitle: '联系我们 - TDesign',
              title: '联系我们',
            },
            component: () => import('@docs/contact_zh-CN.md'),
          },
        ],
      },
    ],
  },
};

export default siteConfig;
