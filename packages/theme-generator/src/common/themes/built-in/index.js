import TDesignOriginal from './svg/TDesignOriginal?raw';
import TencentCloud from './svg/TencentCloud?raw';

import WebTDesignDark from './css/web/TDesign/dark.css?raw';
import WebTDesignExtra from './css/web/TDesign/extra.css?raw';
import WebTDesignLight from './css/web/TDesign/light.css?raw';

import MobileTDesignDark from './css/mobile/TDesign/dark.css?raw';
import MobileTDesignExtra from './css/mobile/TDesign/extra.css?raw';
import MobileTDesignLight from './css/mobile/TDesign/light.css?raw';

import WebTCloudDark from './css/web/TCloud/dark.css?raw';
import WebTCloudExtra from './css/web/TCloud/extra.css?raw';
import WebTCloudLight from './css/web/TCloud/light.css?raw';

export const TENCENT_BLUE = '#0052D9';

export const DEFAULT_THEME_META = {
  name: '默认主题',
  enName: 'TDesign',
  subtitle: TDesignOriginal,
  subtitleText: 'TDesign Original',
  value: TENCENT_BLUE,
};

const OFFICIAL_THEMES_META = {
  title: '官方推荐',
  enTitle: 'Official recommendation',
};

export const TDESIGN_WEB_THEME = {
  ...DEFAULT_THEME_META,
  css: {
    light: WebTDesignLight,
    dark: WebTDesignDark,
    extra: WebTDesignExtra,
  },
};

export const TDESIGN_MOBILE_THEME = {
  ...DEFAULT_THEME_META,
  css: {
    light: MobileTDesignLight,
    dark: MobileTDesignDark,
    extra: MobileTDesignExtra,
  },
};

const TCLOUD_THEME = {
  name: '腾讯云',
  enName: 'TCloud',
  subtitle: TencentCloud,
  subtitleText: 'Tencent Cloud',
  value: '#006EFF',
  css: {
    light: WebTCloudLight,
    dark: WebTCloudDark,
    extra: WebTCloudExtra,
  },
};

export const WEB_RECOMMEND_THEMES = [
  {
    ...OFFICIAL_THEMES_META,
    options: [TDESIGN_WEB_THEME, TCLOUD_THEME],
  },
];

export const MOBILE_RECOMMEND_THEMES = [
  {
    ...OFFICIAL_THEMES_META,
    options: [TDESIGN_MOBILE_THEME],
  },
];

/**
 * 腾讯蓝的 `--td-brand-color-x` 系列 Token 深色数值
 */
export const TENCENT_BLUE_DARK_PALETTE = [
  '#1b2f51',
  '#173463',
  '#143975',
  '#103d88',
  '#0d429a',
  '#054bbe',
  '#2667d4',
  '#4582e6',
  '#699ef5',
  '#96bbf8',
];
