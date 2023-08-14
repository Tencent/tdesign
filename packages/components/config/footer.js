import { isIntranet, getLang } from '@utils';
import { jumpLocation } from '@utils/locale';

export const getFooterConfig = () => {
  const lang = getLang();
  const isEnglish = lang === 'en';

  const footerLinks = [
    {
      title: isEnglish ? 'Resource' : '资源',
      links: [
        { name: isEnglish ? 'Design Resource' : '设计资源', url: jumpLocation('/source'), target: '_self' },
        { name: 'TDesign Starter', url: jumpLocation('https://tdesign.tencent.com/starter/'), target: '_self' }
      ],
    },
    {
      title: isEnglish ? 'Tencent Design' : '腾讯设计',
      links: [
        { name: 'CoDesign', url: 'https://codesign.qq.com/', target: '_blank' },
        { name: 'ProWork', url: 'https://prowork.qq.com/', target: '_blank' },
        { name: 'TDesign', url: `https://tdesign.${isIntranet() ? 'woa' : 'tencent'}.com`, target: '_self' },
        isIntranet() ? { name: 'TVision', url: 'https://tvision.oa.com/', target: '_blank' } : null,
      ].filter(item => item),
    },
    {
      title: isEnglish ? 'About' : '关于',
      links: [
        { name: isEnglish ? 'About us' : '关于我们', url: jumpLocation('/about/introduce'), target: '_self' },
        { name: isEnglish ? 'Contact us' : '联系我们', url: jumpLocation('/about/contact'), target: '_self' },
        { name: isEnglish ? 'Feedback' : '意见反馈', url: '//support.qq.com/products/293854', target: '_blank' }
      ],
    },
  ];

  return footerLinks;
}
