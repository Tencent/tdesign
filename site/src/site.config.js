import siteMessages from './locales/site';

const designComponents = {
  values: () => import('@/pages/design/values.vue'),
  color: () => import('@/pages/design/color.vue'),
  fonts: () => import('@/pages/design/fonts.vue'),
  motion: () => import('@/pages/design/motion.vue'),
  icon: () => import('@/pages/design/icon.vue'),
  layout: () => import('@/pages/design/layout.vue'),
  dark: () => import('@/pages/design/dark.vue'),
};

const markdownComponents = {
  'zh-CN': {
    offices: () => import('@docs/design/offices_zh-CN.md'),
    officesTask: () => import('@docs/design/offices-task_zh-CN.md'),
    introduce: () => import('@docs/introduce_zh-CN.md'),
    tech: () => import('@docs/tech_zh-CN.md'),
    roadmap: () => import('@docs/roadmap_zh-CN.md'),
    faq: () => import('@docs/faq_zh-CN.md'),
    awesome: () => import('@docs/awesome_zh-CN.md'),
    contributing: () => import('@docs/contributing_zh-CN.md'),
    newComponent: () => import('@docs/new-component_zh-CN.md'),
    contact: () => import('@docs/contact_zh-CN.md'),
  },
  'en-US': {
    offices: () => import('@docs/design/offices.md'),
    officesTask: () => import('@docs/design/offices-task.md'),
    introduce: () => import('@docs/introduce.md'),
    tech: () => import('@docs/tech.md'),
    roadmap: () => import('@docs/roadmap.md'),
    faq: () => import('@docs/faq.md'),
    awesome: () => import('@docs/awesome.md'),
    contributing: () => import('@docs/contributing.md'),
    newComponent: () => import('@docs/new-component.md'),
    contact: () => import('@docs/contact.md'),
  },
};

const designSplines = {
  values: 'design-value',
  color: 'design-color',
  fonts: 'design-font',
  motion: 'design-motion',
  icon: 'design-icon',
  layout: 'design-layout',
  dark: 'design-mode',
  offices: 'design-layout',
  officesTask: 'design-layout',
};

function localizePath(path, locale) {
  return locale === 'en-US' ? `${path}-en` : path;
}

function localizeName(name, locale) {
  return locale === 'en-US' ? `${name}-en` : name;
}

function createDesignPage(key, locale, component) {
  const [title, desc] = siteMessages[locale].design.pages[key];
  return {
    name: localizeName(key, locale),
    title,
    path: localizePath(`/design/${key === 'officesTask' ? 'offices-task' : key}`, locale),
    meta: {
      locale,
      documentTitle: `${title} - TDesign`,
      title,
      desc,
      spline: designSplines[key],
    },
    component,
  };
}

function createAboutPage(key, locale, component) {
  const title = siteMessages[locale].about.pages[key];
  const pathName = key === 'newComponent' ? 'new-component' : key;
  return {
    name: localizeName(key, locale),
    title,
    path: localizePath(`/about/${pathName}`, locale),
    meta: {
      locale,
      documentTitle: `${title} - TDesign`,
      title,
    },
    component,
  };
}

export function createSiteConfig(locale = 'zh-CN') {
  const messages = siteMessages[locale];
  const markdown = markdownComponents[locale];

  return {
    design: {
      title: messages.design.title,
      url: locale === 'en-US' ? 'design-en' : 'design',
      docs: [
        {
          name: localizeName('tdesign', locale),
          title: messages.design.groups.tdesign,
          children: [createDesignPage('values', locale, designComponents.values)],
        },
        {
          name: localizeName('global', locale),
          title: messages.design.groups.global,
          children: ['color', 'fonts', 'motion', 'icon', 'layout', 'dark'].map((key) =>
            createDesignPage(key, locale, designComponents[key]),
          ),
        },
        {
          name: localizeName('offices-design', locale),
          title: messages.design.groups.offices,
          children: [
            createDesignPage('offices', locale, markdown.offices),
            createDesignPage('officesTask', locale, markdown.officesTask),
          ],
        },
      ],
    },
    about: {
      title: messages.about.title,
      url: locale === 'en-US' ? 'about-en' : 'about',
      docs: [
        {
          title: messages.about.groups.introduce,
          children: [
            createAboutPage('introduce', locale, markdown.introduce),
            createAboutPage('tech', locale, markdown.tech),
            createAboutPage('roadmap', locale, markdown.roadmap),
            createAboutPage('faq', locale, markdown.faq),
            createAboutPage('awesome', locale, markdown.awesome),
            createAboutPage('release', locale, () => import('@/pages/about/release.vue')),
          ],
        },
        {
          title: messages.about.groups.join,
          children: [
            createAboutPage('contributing', locale, markdown.contributing),
            createAboutPage('newComponent', locale, markdown.newComponent),
            createAboutPage('contact', locale, markdown.contact),
          ],
        },
      ],
    },
  };
}

export { siteMessages };
