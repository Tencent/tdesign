import TDesignOriginal from "!raw-loader!./svg/TDesignOriginal";
import TencentCloud from "!raw-loader!./svg/TencentCloud";
import TencentQuestionnaire from "!raw-loader!./svg/TencentQuestionnaire";
import GovService from "!raw-loader!./svg/GovService";
import SmartRetail from "!raw-loader!./svg/SmartRetail";
import WeChatPay from "!raw-loader!./svg/WeChatPay";
import CulturalTourism from "!raw-loader!./svg/CulturalTourism";
import TencentEducation from "!raw-loader!./svg/TencentEducation";
import TencentHealthcare from "!raw-loader!./svg/TencentHealthcare";
import TencentGames from "!raw-loader!./svg/TencentGames";
import TencentSafe from "!raw-loader!./svg/TencentSafe";

export const defaultTheme = {
  name: "默认主题",
  enName:'TDesign',
  subtitle: TDesignOriginal,
  subtitleText:'TDesign Original',
  value: "#0052D9",
};

export const RECOMMEND_THEMES = [
  {
    title: "官方推荐",
    options: [
      defaultTheme,
      {
        name: "腾讯云",
        enName:'TCloud',
        subtitle: TencentCloud,
        subtitleText:'Tencent Cloud',
        value: "#006EFF",
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
