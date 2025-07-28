import TDesignOriginal from '!raw-loader!./svg/TDesignOriginal';
import TencentCloud from '!raw-loader!./svg/TencentCloud';

import WebTCloudDark from '!raw-loader!./css/web/TCloud/dark.css';
import WebTCloudExtra from '!raw-loader!./css/web/TCloud/extra.css';
import WebTCloudLight from '!raw-loader!./css/web/TCloud/light.css';
import WebTDesignDark from '!raw-loader!./css/web/TDesign/dark.css';
import WebTDesignLight from '!raw-loader!./css/web/TDesign/light.css';
import WebFont from '!raw-loader!./css/web/common/font.css';
import WebRadius from '!raw-loader!./css/web/common/radius.css';
import WebSize from '!raw-loader!./css/web/common/size.css';

import MobileTDesignDark from '!raw-loader!./css/mobile/TDesign/dark.css';
import MobileTDesignLight from '!raw-loader!./css/mobile/TDesign/light.css';
import MobileFont from '!raw-loader!./css/mobile/common/font.css';
import MobileRadius from '!raw-loader!./css/mobile/common/radius.css';

export const DEFAULT_THEME = {
  name: '默认主题',
  enName: 'TDesign',
  subtitle: TDesignOriginal,
  subtitleText: 'TDesign Original',
  value: '#0052D9',
  // gray: '#ddd',
  // success: '#2ba471',
  // error: '#d54941',
  // warning: '#e37318',
};

// UNCONFIRMED: 确定 CSS 的功能色与算法生成的一致，才能内置一个 mainColor 用于匹配
const TCLOUD_THEME = {
  name: '腾讯云',
  enName: 'TCloud',
  subtitle: TencentCloud,
  subtitleText: 'Tencent Cloud',
  value: '#006EFF',
};

export const RECOMMEND_THEMES = [
  {
    title: '官方推荐',
    options: [DEFAULT_THEME, TCLOUD_THEME],
  },
];

/**
 * 主题的名字 (对象的 key) 需要和 `RECOMMEND_THEMES` 中的 `enName` 对应
 */
export const BUILT_IN_THEMES = {
  web: {
    TDesign: {
      light: WebTDesignLight,
      dark: WebTDesignDark,
    },
    TCloud: {
      light: WebTCloudLight,
      dark: WebTCloudDark,
      extra: WebTCloudExtra,
    },
    common: {
      font: WebFont,
      radius: WebRadius,
      size: WebSize,
    },
  },
  mobile: {
    TDesign: {
      light: MobileTDesignLight,
      dark: MobileTDesignDark,
    },
    common: {
      font: MobileFont,
      radius: MobileRadius,
    },
  },
};

/**
 * 移动端缺失的 Token
 */
export const MOBILE_MISSING_TOKENS = [
  '--td-brand-color-hover',
  '--td-warning-color-hover',
  '--td-error-color-hover',
  '--td-success-color-hover',
  '--td-bg-color-container-hover',
  '--td-bg-color-secondarycontainer-hover',
  '--td-bg-color-component-hover',
  '--td-brand-color-light-hover',
  '--td-warning-color-light-hover',
  '--td-error-color-light-hover',
  '--td-success-color-light-hover',
  '--td-bg-color-secondarycomponent-hover',
  '--td-bg-color-container-select',
];

/**
 * 默认主题的 `--td-brand-color-x` 系列 Token 对应的数值
 * - 浅色版直接交给算法生成
 * - 但深色版需要手动调整
 */
export const DEFAULT_DARK_BRAND_PALETTE = [
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
