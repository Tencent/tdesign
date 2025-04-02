import TDesignOriginal from '!raw-loader!./built-in/svg/TDesignOriginal';
import TencentCloud from '!raw-loader!./built-in/svg/TencentCloud';
// import TencentQuestionnaire from '!raw-loader!./built-in/svg/TencentQuestionnaire';
// import GovService from '!raw-loader!./built-in/svg/GovService';
// import SmartRetail from '!raw-loader!./built-in/svg/SmartRetail';
// import WeChatPay from '!raw-loader!./built-in/svg/WeChatPay';
// import CulturalTourism from '!raw-loader!./built-in/svg/CulturalTourism';
// import TencentEducation from '!raw-loader!./built-in/svg/TencentEducation';
// import TencentHealthcare from '!raw-loader!./built-in/svg/TencentHealthcare';
// import TencentGames from '!raw-loader!./built-in/svg/TencentGames';
// import TencentSafe from '!raw-loader!./built-in/svg/TencentSafe';

import WebTCloudDark from '!raw-loader!./built-in/css/web/TCloud/dark.css';
import WebTCloudExtra from '!raw-loader!./built-in/css/web/TCloud/extra.css';
import WebTCloudLight from '!raw-loader!./built-in/css/web/TCloud/light.css';
import WebTDesignDark from '!raw-loader!./built-in/css/web/TDesign/dark.css';
import WebTDesignLight from '!raw-loader!./built-in/css/web/TDesign/light.css';
import WebFont from '!raw-loader!./built-in/css/web/common/font.css';
import WebRadius from '!raw-loader!./built-in/css/web/common/radius.css';
import WebShadow from '!raw-loader!./built-in/css/web/common/shadow.css';
import WebSize from '!raw-loader!./built-in/css/web/common/size.css';

import MobileTDesignDark from '!raw-loader!./built-in/css/mobile/TDesign/dark.css';
import MobileTDesignLight from '!raw-loader!./built-in/css/mobile/TDesign/light.css';
import MobileFont from '!raw-loader!./built-in/css/mobile/common/font.css';
import MobileRadius from '!raw-loader!./built-in/css/mobile/common/radius.css';
import MobileShadow from '!raw-loader!./built-in/css/mobile/common/shadow.css';
import MobileSpacer from '!raw-loader!./built-in/css/mobile/common/spacer.css';

export const CUSTOM_THEME_TEXT = {
  name: '自定义主题',
  enName: 'Custom',
  subtitleText: 'Custom Theme',
};

export const DEFAULT_THEME = {
  name: '默认主题',
  enName: 'TDesign',
  subtitle: TDesignOriginal,
  subtitleText: 'TDesign Original',
  value: '#0052D9',
};

export const RECOMMEND_THEMES = [
  {
    title: '官方推荐',
    options: [
      DEFAULT_THEME,
      {
        name: '腾讯云',
        enName: 'TCloud',
        subtitle: TencentCloud,
        subtitleText: 'Tencent Cloud',
        value: '#006EFF',
      },
      // {
      //   name: "微信支付",
      //   subtitle: WeChatPay,
      //   subtitleText:'WeChat Pay',
      //   value: "#07C160",
      // },
      // {
      //   name: "腾讯问卷",
      //   subtitle: TencentQuestionnaire,
      //   subtitleText: 'Tencent Questionnaire',
      //   value: "#53B1FD",
      // },
      // {
      //   name: "腾讯教育",
      //   subtitle: TencentEducation,
      //   value: "#0DB282",
      // },
      // {
      //   name: "腾讯医疗",
      //   subtitle: TencentHealthcare,
      //   value: "#0077FF",
      // },
      // {
      //   name: "腾讯游戏",
      //   subtitle: TencentGames,
      //   value: "#FD853A",
      // },
      // {
      //   name: "腾讯安全",
      //   subtitle: TencentSafe,
      //   value: "#005AFF",
      // },
    ],
  },
  // {
  //   title: "业务推荐",
  //   options: [
  //     {
  //       name: "政务",
  //       subtitle: GovService,
  //       value: "#EE1C25",
  //     },

  //     {
  //       name: "文旅",
  //       subtitle: CulturalTourism,
  //       value: "#262626",
  //     },
  //     {
  //       name: "智慧零售",
  //       subtitle: SmartRetail,
  //       value: "#623BFF",
  //     },
  //   ],
  // },
];

/**
 * 主题文件夹名字需要和 `RECOMMEND_THEMES` 中的 `enName` 对应
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
      shadow: WebShadow,
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
      shadow: MobileShadow,
      spacer: MobileSpacer,
    },
  },
};
