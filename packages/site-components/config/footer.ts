import { isEn, isIntranet } from '@utils';
import { jumpLocation } from '@utils/locale';
import type { FooterGroup, FooterLink } from './types';

export const getFooterConfig = (): FooterGroup[] => {
  const en = isEn();

  const footerLinks: FooterGroup[] = [
    {
      title: en ? 'Resource' : '资源',
      links: [
        { name: en ? 'Design Resource' : '设计资源', url: jumpLocation('/source'), target: '_self' },
        { name: 'TDesign Starter', url: jumpLocation('https://tdesign.tencent.com/starter/'), target: '_self' },
      ],
    },
    {
      title: en ? 'Tencent Ecosystem' : '腾讯生态',
      links: [
        { name: 'TDesign', url: `https://tdesign.${isIntranet() ? 'woa' : 'tencent'}.com`, target: '_self' },
        { name: 'TDS', url: 'https://tds.qq.com/', target: '_blank' },
        { name: 'Miora', url: 'https://miora.qq.com/', target: '_blank' },
        isIntranet() ? { name: 'TVision', url: 'https://tvision.woa.com/', target: '_blank' } : null,
        isIntranet() ? { name: 'TEditor', url: 'https://teditor.woa.com/', target: '_blank' } : null,
      ].filter((item): item is FooterLink => item !== null),
      desktopOnly: true,
    },
    {
      title: en ? 'About' : '关于',
      links: [
        { name: en ? 'About us' : '关于我们', url: jumpLocation('/about/introduce'), target: '_self' },
        { name: en ? 'Contact us' : '联系我们', url: jumpLocation('/about/contact'), target: '_self' },
      ],
    },
  ];

  return footerLinks;
};
