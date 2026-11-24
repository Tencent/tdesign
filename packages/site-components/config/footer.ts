import { isEn } from '@utils';
import { jumpLocation } from '@utils/locale';
import type { FooterGroup } from './types';

export const getFooterConfig = (): FooterGroup[] => {
  const en = isEn();

  const footerLinks: FooterGroup[] = [
    {
      title: en ? 'Resources' : '资源',
      links: [
        { name: en ? 'Design Resources' : '设计资源', url: jumpLocation('/source'), target: '_self' },
        { name: 'TDesign Starter', url: jumpLocation('https://tdesign.tencent.com/starter/'), target: '_self' },
      ],
    },
    {
      title: en ? 'Tencent Ecosystem' : '腾讯生态',
      links: [
        { name: 'TDesign', url: 'https://tdesign.tencent.com', target: '_self' },
        { name: 'TDS', url: 'https://tds.qq.com/', target: '_blank' },
      ],
      desktopOnly: true,
    },
    {
      title: en ? 'About' : '关于',
      links: [
        { name: en ? 'About Us' : '关于我们', url: jumpLocation('/about/introduce'), target: '_self' },
        { name: en ? 'Contact Us' : '联系我们', url: jumpLocation('/about/contact'), target: '_self' },
      ],
    },
  ];

  return footerLinks;
};
