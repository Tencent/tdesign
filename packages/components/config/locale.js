import { getLang } from '@utils';

export const getLocale = () => {
  const lang = getLang();
  const locale = {
    zh: {
      changelog: {
        title: '更新日志',
        emptyInfo: '暂无更新日志',
      },
      footer: {
        copyright: '腾讯公司 版权所有',
        weComGroup: '企业微信群',
        weComGroupDesc: '欢迎微信扫码联系我们',
      },
    },
    en: {
      changelog: {
        title: 'Changelog',
        emptyInfo: 'No changelog available',
      },
      footer: {
        copyright: 'Tencent Copyright',
        weComGroup: 'WeCom Group',
        weComGroupDesc: 'Welcome to contact us',
      },
    },
  };

  return locale[lang];
};
