const siteConfig = {
  design: {
    title: 'Design Guidelines',
    url: 'design-en',
    docs: [
      {
        name: 'TDesign-en',
        title: 'TDesign',
        children: [
          {
            name: 'values-en',
            title: 'Values',
            meta: {
              documentTitle: 'Values - TDesign',
              title: 'Values',
              desc: 'TDesign adheres to the values of inclusiveness, diversity, evolution, and connectivity.',
              spline: 'design-value'
            },
            path: '/design/values-en',
            component: () => import('@/pages/design/values.vue')
          }
        ]
      },
      {
        name: 'global-en',
        title: 'Global Styles',
        children: [
          {
            name: 'color',
            title: 'Color',
            meta: {
              documentTitle: 'Color - TDesign',
              title: 'Color',
              desc: 'Color serves the purpose of conveying information, creating hierarchy, expressing emotions, and building consistency in products.',
              spline: 'design-color'
            },
            path: '/design/color-en',
            component: () => import('@/pages/design/color.vue')
          },
          {
            name: 'fonts-en',
            title: 'Fonts',
            path: '/design/fonts-en',
            meta: {
              documentTitle: 'Fonts - TDesign',
              title: 'Fonts',
              desc: ' Fonts follow the principles of usability, memorability, and aesthetics, making the content more regular and rhythmic.',
              spline: 'design-font'
            },
            component: () => import('@/pages/design/fonts.vue')
          },
          {
            name: 'motion-en',
            title: 'Motion',
            path: '/design/motion-en',
            meta: {
              documentTitle: 'Motion - TDesign',
              title: 'Motion',
              desc: 'Motion can make the interface clear, fluent, and enhance user perception',
              spline: 'design-motion'
            },
            component: () => import('@/pages/design/motion.vue')
          },
          {
            name: 'icon-en',
            title: 'Icon',
            path: '/design/icon-en',
            meta: {
              documentTitle: 'Icon - TDesign',
              title: 'Icon',
              desc: 'Icon affects the overall style presentation of UI interfaces.',
              spline: 'design-icon'
            },
            component: () => import('@/pages/design/icon.vue')
          },
          {
            name: 'layout-en',
            title: 'Layout',
            path: '/design/layout-en',
            meta: {
              documentTitle: 'Layout - TDesign',
              title: 'Layout',
              desc: 'The framework structure used to organize web pages can affect the browsing order of users. A clear layout and data presentation can help users efficiently obtain information.',
              spline: 'design-layout'
            },
            component: () => import('@/pages/design/layout.vue')
          },
          {
            name: 'dark-en',
            title: 'Dark Mode',
            path: '/design/dark-en',
            meta: {
              documentTitle: 'Dark Mode - TDesign',
              title: 'Dark Mode',
              desc: 'Dark mode is a night-friendly color theme that helps users work more immersively.',
              spline: 'design-mode'
            },
            component: () => import('@/pages/design/dark.vue')
          }
        ]
      },
      {
        name: 'offices design-en',
        title: 'Design Guidelines',
        children: [
          {
            name: 'offices',
            title: 'How to building the framework',
            path: '/design/offices-en',
            meta: {
              documentTitle: 'How to building the framework - TDesign',
              title: 'How to building the framework',
              desc: 'Choose suitable page navigation and layout, and establish the basic framework of the middle and back-end after determining the functional classification and structure of the system, ',
              spline: 'design-layout'
            },
            component: () => import('@/docs/design/offices.md')
          },
          {
            name: 'offices task',
            title: 'Design high-Frequency tasks',
            path: '/design/offices-task-en',
            meta: {
              documentTitle: 'Design high-Frequency tasks - TDesign',
              title: 'Design high-Frequency tasks',
              desc: 'Design the relevant task processes based on the business scenario after clarifying the overall framework and page layout.',
              spline: 'design-layout'
            },
            component: () => import('@/docs/design/offices-task.md')
          }
        ]
      }
    ]
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
              documentTitle: 'About - TDesign'
            },
            component: () => import('@docs/introduce.md')
          },
          {
            name: 'tech-en',
            title: 'Overall',
            path: '/about/tech-en',
            meta: {
              documentTitle: 'Overall - TDesign'
            },
            component: () => import('@docs/tech.md')
          },
          {
            name: 'roadmap-en',
            title: 'Roadmap',
            path: '/about/roadmap-en',
            meta: {
              documentTitle: 'Roadmap - TDesign'
            },
            component: () => import('@docs/roadmap.md')
          },
          {
            name: 'faq-en',
            title: 'FAQ',
            path: '/about/faq-en',
            meta: {
              documentTitle: 'FAQ - TDesign'
            },
            component: () => import('@docs/faq.md')
          },
          {
            name: 'awesome-en',
            title: 'Community Resources',
            path: '/about/awesome-en',
            meta: {
              documentTitle: 'Community Resources - TDesign',
              title: 'Community Resources'
            },
            component: () => import('@docs/awesome.md')
          },
          {
            name: 'release',
            title: 'Weekly Release',
            path: '/about/release-en',
            meta: {
              documentTitle: 'weekly release - TDesign',
              title: 'Weekly release',
              desc: 'TDesign Weekly release'
            },
            component: () => import('@/pages/about/release.vue')
          }
        ]
      },
      {
        title: 'Join Us',
        children: [
          {
            name: 'contributing-en',
            title: 'How to Contribute',
            path: '/about/contributing-en',
            meta: {
              documentTitle: '如何贡献 - TDesign'
            },
            component: () => import('@docs/contributing.md')
          },
          {
            name: 'contributing-en',
            title: 'New Component',
            path: '/about/new-component-en',
            meta: {
              documentTitle: '从构思到生产：一个组件的诞生 - TDesign'
            },
            component: () => import('@docs/new-component.md')
          },
          {
            name: 'contact-en',
            title: 'Contact Us',
            path: '/about/contact-en',
            meta: {
              documentTitle: 'Contact Us - TDesign'
            },
            component: () => import('@docs/contact.md')
          }
        ]
      }
    ]
  }
}

export default siteConfig;
