import { isEn, isIntranet } from '@utils';
import { jumpLocation } from '@utils/locale';
import flutterIcon from '../src/images/flutter-logo.svg?url';
import uniappIcon from '../src/images/uniapp-logo.png?url';
import reactIcon from '../src/images/react-logo.svg?url';
import vueIcon from '../src/images/vue-logo.svg?url';
import wxIcon from '../src/images/wx-logo.svg?url';
import type { ComponentLinkGroup, HeaderConfig, HeaderItem } from './types';

const baseComponentsLinks: HeaderConfig['baseComponentsLinks'] = {
  web: {
    name: 'Web 桌面端',
    links: [
      {
        name: 'Vue Next',
        icon: vueIcon,
        path: jumpLocation('/vue-next/overview'),
        npm: 'tdesign-vue-next',
        status: 1,
      },
      {
        name: 'React',
        icon: reactIcon,
        path: jumpLocation('/react/overview'),
        npm: 'tdesign-react',
        status: 1,
      },
      {
        name: 'Vue',
        icon: vueIcon,
        path: jumpLocation('/vue/overview'),
        npm: 'tdesign-vue',
        status: 1,
      },
    ],
  },
  mobile: {
    name: 'Mobile 移动端',
    links: [
      {
        name: '微信小程序',
        icon: wxIcon,
        path: jumpLocation('/miniprogram/overview'),
        npm: 'tdesign-miniprogram',
        status: 1,
      },
      {
        name: 'Vue Next',
        icon: vueIcon,
        path: jumpLocation('/mobile-vue/overview'),
        npm: 'tdesign-mobile-vue',
        status: 1,
      },
      {
        name: 'React',
        icon: reactIcon,
        path: jumpLocation('/mobile-react/overview'),
        npm: 'tdesign-mobile-react',
        status: 2,
      },
      {
        name: 'Uniapp',
        icon: uniappIcon,
        path: jumpLocation('/uniapp/overview'),
        npm: '@tdesign/uniapp',
        status: 2,
      },
      {
        name: 'Flutter',
        icon: flutterIcon,
        path: jumpLocation('/flutter/overview'),
        npm: 'tdesign-flutter',
        status: 2,
      },
    ],
  },
};

const baseComponentPrefix = [
  'vue',
  'react',
  'mobile-vue',
  'mobile-react',
  'vue-next',
  'flutter',
  'uniapp',
  'miniprogram',
];

export default {
  baseComponentsLinks,
  baseComponentPrefix,
};

export const getHeaderConfig = (): HeaderConfig => {
  const intranet = isIntranet();
  const en = isEn();

  const headerItems: Array<HeaderItem | null> = [
    { name: en ? 'Design' : '设计语言', path: jumpLocation('/design'), type: 'main', target: '_self' },
    { name: en ? 'Resources' : '设计资源', path: jumpLocation('/source'), type: 'main', target: '_self' },
    { name: en ? 'Components' : '前端组件', type: 'base', target: '_self' },
    { name: en ? 'Icons' : '图标', path: jumpLocation('/icons'), type: 'main', target: '_self' },
    intranet ? { name: en ? 'Industry component' : '行业组件', path: '/trade', type: 'main', target: '_self' } : null,
    {
      name: en ? 'Templates' : '页面模板',
      path: 'https://tdesign.tencent.com/starter/',
      type: 'main',
      target: '_self',
    },
    { name: en ? 'About' : '关于', path: jumpLocation('/about/introduce'), type: 'main', target: '_self' },
  ];
  const headerList = headerItems.filter((item): item is HeaderItem => item !== null);

  const baseComponentsLinks: { web: ComponentLinkGroup; mobile: ComponentLinkGroup } = {
    web: {
      name: en ? 'Web PC' : 'Web 桌面端',
      links: [
        {
          name: 'Vue Next',
          icon: vueIcon,
          path: jumpLocation('/vue-next/overview'),
          npm: 'tdesign-vue-next',
          status: 1,
        },
        {
          name: 'React',
          icon: reactIcon,
          path: jumpLocation('/react/overview'),
          npm: 'tdesign-react',
          status: 1,
        },
        {
          name: 'Vue',
          icon: vueIcon,
          path: jumpLocation('/vue/overview'),
          npm: 'tdesign-vue',
          status: 1,
        },
      ],
    },
    mobile: {
      name: en ? 'Mobile' : 'Mobile 移动端',
      links: [
        {
          name: en ? 'WeChat-Miniprogram' : '微信小程序',
          icon: wxIcon,
          path: jumpLocation('/miniprogram/overview'),
          npm: 'tdesign-miniprogram',
          status: 1,
        },
        {
          name: 'Vue Next',
          icon: vueIcon,
          path: jumpLocation('/mobile-vue/overview'),
          npm: 'tdesign-mobile-vue',
          status: 1,
        },
        {
          name: 'React',
          icon: reactIcon,
          path: jumpLocation('/mobile-react/overview'),
          npm: 'tdesign-mobile-react',
          status: 2,
        },
        {
          name: 'Uniapp',
          icon: uniappIcon,
          path: jumpLocation('/uniapp/overview'),
          npm: '@tdesign/uniapp',
          status: 2,
        },
        {
          name: 'Flutter',
          icon: flutterIcon,
          path: jumpLocation('/flutter/overview'),
          npm: 'tdesign-flutter',
          status: 2,
        },
      ],
    },
  };

  const baseComponentPrefix = [
    'vue',
    'react',
    'mobile-vue',
    'mobile-react',
    'vue-next',
    'flutter',
    'uniapp',
    'miniprogram',
  ];

  return {
    headerList,
    baseComponentsLinks,
    baseComponentPrefix,
  };
};
