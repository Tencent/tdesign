import { getLang } from '@utils';
import type { Language, SiteLocale } from './types';

export const getLocale = (): SiteLocale => {
  const lang = getLang();
  const locale: Record<Language, SiteLocale> = {
    zh: {
      changelog: {
        title: '更新日志',
        emptyInfo: '暂无更新日志',
      },
      footer: {
        brandDescription: '为腾讯业务打造的一站式企业级设计体系，连接设计与开发，助力高效构建一致的产品体验。',
        navigationLabel: '页脚导航',
        communityDescription: '加入社群实时交流，答疑解惑分享经验。',
        scanQrCode: '扫描二维码：',
        communityQrCode: '社群二维码',
        tencentCloud: '腾讯云',
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
        brandDescription:
          'An enterprise design system for Tencent products, connecting design and development for consistent experiences.',
        navigationLabel: 'Footer navigation',
        communityDescription: 'Join the community to connect, ask questions, and share ideas.',
        scanQrCode: 'Scan to join:',
        communityQrCode: 'community QR code',
        tencentCloud: 'Tencent Cloud',
        copyright: '',
        weComGroup: 'WeCom Group',
        weComGroupDesc: 'Welcome to contact us',
      },
    },
  };

  return locale[lang];
};
