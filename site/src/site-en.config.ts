import type { SiteConfig } from './site.config';

const siteEnConfig: SiteConfig = {
  design: {
    title: 'Design Guidelines',
    url: 'design-en',
    docs: [
      {
        name: 'tdesign-en',
        title: 'TDesign',
        children: [
          {
            name: 'values-en',
            title: 'Values',
            path: '/design/values-en',
            meta: {
              documentTitle: 'Values - TDesign',
              title: 'Values',
              desc: 'TDesign adheres to the values of inclusiveness, diversity, evolution, and connectivity.',
            },
            component: () => import('@/pages/design/values.vue'),
          },
        ],
      },
      {
        name: 'global-en',
        title: 'Global Styles',
        children: [
          {
            name: 'color-en',
            title: 'Color',
            path: '/design/color-en',
            meta: {
              documentTitle: 'Color - TDesign',
              title: 'Color',
              desc: 'Color conveys information, creates hierarchy, expresses emotion, and builds consistency.',
            },
            component: () => import('@/pages/design/color.vue'),
          },
          {
            name: 'fonts-en',
            title: 'Fonts',
            path: '/design/fonts-en',
            meta: {
              documentTitle: 'Fonts - TDesign',
              title: 'Fonts',
              desc: 'Fonts follow the principles of usability, memorability, and aesthetics.',
            },
            component: () => import('@/pages/design/fonts.vue'),
          },
          {
            name: 'motion-en',
            title: 'Motion',
            path: '/design/motion-en',
            meta: {
              documentTitle: 'Motion - TDesign',
              title: 'Motion',
              desc: 'Motion makes interfaces clear and fluent while enhancing user perception.',
            },
            component: () => import('@/pages/design/motion.vue'),
          },
          {
            name: 'icon-en',
            title: 'Icon',
            path: '/design/icon-en',
            meta: {
              documentTitle: 'Icon - TDesign',
              title: 'Icon',
              desc: 'Icons affect the overall style of UI interfaces.',
            },
            component: () => import('@/pages/design/icon.vue'),
          },
          {
            name: 'layout-en',
            title: 'Layout',
            path: '/design/layout-en',
            meta: {
              documentTitle: 'Layout - TDesign',
              title: 'Layout',
              desc: 'A clear framework and data presentation help users obtain information efficiently.',
            },
            component: () => import('@/pages/design/layout.vue'),
          },
          {
            name: 'dark-en',
            title: 'Dark Mode',
            path: '/design/dark-en',
            meta: {
              documentTitle: 'Dark Mode - TDesign',
              title: 'Dark Mode',
              desc: 'Dark mode is a night-friendly color theme that helps users work immersively.',
            },
            component: () => import('@/pages/design/dark.vue'),
          },
        ],
      },
      {
        name: 'offices-design-en',
        title: 'Design Guidelines',
        children: [
          {
            name: 'offices-en',
            title: 'How to build the framework',
            path: '/design/offices-en',
            meta: {
              documentTitle: 'How to build the framework - TDesign',
              title: 'How to build the framework',
              desc: 'Choose suitable navigation and layout after determining the system structure.',
            },
            component: () => import('@docs/design/offices.md'),
          },
          {
            name: 'officesTask-en',
            title: 'Design high-frequency tasks',
            path: '/design/offices-task-en',
            meta: {
              documentTitle: 'Design high-frequency tasks - TDesign',
              title: 'Design high-frequency tasks',
              desc: 'Design task processes for the business scenario after clarifying the framework and layout.',
            },
            component: () => import('@docs/design/offices-task.md'),
          },
        ],
      },
    ],
  },
  about: {
    title: 'About',
    url: 'about-en',
    docs: [
      {
        title: 'Introduce',
        children: [
          {
            name: 'introduce-en',
            title: 'About',
            path: '/about/introduce-en',
            meta: {
              documentTitle: 'About - TDesign',
              title: 'About',
            },
            component: () => import('@docs/introduce.md'),
          },
          {
            name: 'tech-en',
            title: 'Overall',
            path: '/about/tech-en',
            meta: {
              documentTitle: 'Overall - TDesign',
              title: 'Overall',
            },
            component: () => import('@docs/tech.md'),
          },
          {
            name: 'roadmap-en',
            title: 'Roadmap',
            path: '/about/roadmap-en',
            meta: {
              documentTitle: 'Roadmap - TDesign',
              title: 'Roadmap',
            },
            component: () => import('@docs/roadmap.md'),
          },
          {
            name: 'faq-en',
            title: 'FAQ',
            path: '/about/faq-en',
            meta: {
              documentTitle: 'FAQ - TDesign',
              title: 'FAQ',
            },
            component: () => import('@docs/faq.md'),
          },
          {
            name: 'awesome-en',
            title: 'Community Resources',
            path: '/about/awesome-en',
            meta: {
              documentTitle: 'Community Resources - TDesign',
              title: 'Community Resources',
            },
            component: () => import('@docs/awesome.md'),
          },
          {
            name: 'release-en',
            title: 'Release Summary',
            path: '/about/release-en',
            meta: {
              documentTitle: 'Release Summary - TDesign',
              title: 'Release Summary',
              desc: 'TDesign Release Summary',
            },
            component: () => import('@/pages/about/release.vue'),
          },
        ],
      },
      {
        title: 'Join Us',
        children: [
          {
            name: 'contributing-en',
            title: 'How to Contribute',
            path: '/about/contributing-en',
            meta: {
              documentTitle: 'How to Contribute - TDesign',
              title: 'How to Contribute',
            },
            component: () => import('@docs/contributing.md'),
          },
          {
            name: 'newComponent-en',
            title: 'New Component',
            path: '/about/new-component-en',
            meta: {
              documentTitle: 'New Component - TDesign',
              title: 'New Component',
            },
            component: () => import('@docs/new-component.md'),
          },
          {
            name: 'contact-en',
            title: 'Contact Us',
            path: '/about/contact-en',
            meta: {
              documentTitle: 'Contact Us - TDesign',
              title: 'Contact Us',
            },
            component: () => import('@docs/contact.md'),
          },
        ],
      },
    ],
  },
};

export default siteEnConfig;
