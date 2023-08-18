import TencentBlue from "!raw-loader!../assets/TencentBlue"; //腾讯蓝
import HyacinthBlue from "!raw-loader!../assets/HyacinthBlue"; //风信子蓝
import PetelotiiYellow from "!raw-loader!../assets/PetelotiiYellow"; //金茶花黄

import AgapanthusPurple from "!raw-loader!../assets/AgapanthusPurple"; // 百子莲紫
import YulaniaPink from "!raw-loader!../assets/YulaniaPink";
import DavidiaGreen from "!raw-loader!../assets/DavidiaGreen"; // 珙桐绿
import MarigoldOrange from "!raw-loader!../assets/MarigoldOrange"; // 万寿菊橙
import PlumbagoBlue from "!raw-loader!../assets/PlumbagoBlue"; // 花丹蓝
import MultifloraRed from "!raw-loader!../assets/MultifloraRed"; // 蔷薇红
import TaxusRed from "!raw-loader!../assets/TaxusRed"; // 豆衫红
import ViridifloraGreen from "!raw-loader!../assets/ViridifloraGreen"; // 鸢尾绿

import WeChatGreen from "!raw-loader!../assets/WeChatGreen"; //微信绿
import TCloudBlack from "!raw-loader!../assets/TCloudBlack"; // 腾云黑
import TourismPurple from "!raw-loader!../assets/TourismPurple"; // 文旅紫
import GovRed from "!raw-loader!../assets/GovRed"; // 政务红

export const DEFAULT_THEME = "#0052D9";
export const GREEN_THEME = "#DDCC00";
export const DEFAULT_COLOR = [
  {
    name: "腾讯蓝",
    subtitle: TencentBlue,
    value: DEFAULT_THEME,
  },
  {
    name: "风信子蓝",
    subtitle: HyacinthBlue,
    value: "#0894FA",
  },
  {
    name: "金花茶黄",
    subtitle: PetelotiiYellow,
    value: "#F3B814",
  },
];

export const RECOMMEND_COLOR = [
  {
    name: "珙桐绿",
    subtitle: DavidiaGreen,
    value: "#45C58B",
  },
  {
    name: "鸢尾绿",
    subtitle: ViridifloraGreen,
    value: "#0ED6CA",
  },
  {
    name: "花丹蓝",
    subtitle: PlumbagoBlue,
    value: "#53B1FD",
  },
  {
    name: "百子莲紫",
    subtitle: AgapanthusPurple,
    value: "#7A5AF8",
  },
  {
    name: "",
    subtitle: YulaniaPink,
    value: "#EF45B3",
  },
  {
    name: "豆衫红",
    subtitle: TaxusRed,
    value: "#F54343",
  },

  {
    name: "蔷薇红",
    subtitle: MultifloraRed,
    value: "#FF5479",
  },
  {
    name: "万寿菊橙",
    subtitle: MarigoldOrange,
    value: "#FD853A",
  },
];

export const SCENE_COLOR = [
  {
    name: "微信绿",
    subtitle: WeChatGreen,
    value: "#07C160",
  },
  {
    name: "腾云黑",
    subtitle: TCloudBlack,
    value: "#262626",
  },
  {
    name: "文旅紫",
    subtitle: TourismPurple,
    value: "#623BFF",
  },
  {
    name: "政务红",
    subtitle: GovRed,
    value: "#EE1C25",
  },
];

export const BRAND_COLOR_MAP = [
  { name: "--td-brand-color-light", type: "light", idx: 0 },
  { name: "--td-brand-color-focus", type: "focus", idx: 1 },
  { name: "--td-brand-color-disabled", type: "disabled", idx: 2 },
];

export const ERROR_COLOR_MAP = [
  { name: "--td-error-color-light", type: "light", idx: 0 },
  { name: "--td-error-color-focus", type: "focus", idx: 1 },
  { name: "--td-error-color-disabled", type: "disabled", idx: 2 },
  { name: "--td-error-color-hover", type: "hover", idx: 4 },
  { name: "--td-error-color", type: "main", idx: 5 },
  { name: "--td-error-color-active", type: "active", idx: 6 },
];

export const WARNING_COLOR_MAP = [
  { name: "--td-warning-color-light", type: "light", idx: 0 },
  { name: "--td-warning-color-focus", type: "focus", idx: 1 },
  { name: "--td-warning-color-disabled", type: "disabled", idx: 2 },
  { name: "--td-warning-color-hover", type: "hover", idx: 3 },
  { name: "--td-warning-color", type: "main", idx: 4 },
  { name: "--td-warning-color-active", type: "active", idx: 5 },
];

export const SUCCESS_COLOR_MAP = [
  { name: "--td-success-color-light", type: "light", idx: 0 },
  { name: "--td-success-color-focus", type: "focus", idx: 1 },
  { name: "--td-success-color-disabled", type: "disabled", idx: 2 },
  { name: "--td-success-color-hover", type: "hover", idx: 3 },
  { name: "--td-success-color", type: "main", idx: 4 },
  { name: "--td-success-color-active", type: "active", idx: 5 },
];

export const GRAY_COLOR_MAP = [
  { name: "--td-bg-color-container-hover", type: "", idx: 0 },
  { name: "--td-bg-color-secondarycontainer", type: "", idx: 0 },
  { name: "--td-bg-color-secondarycontainer-hover", type: "", idx: 1 },
  { name: "--td-bg-color-component-disabled", type: "", idx: 1 },
  { name: "--td-bg-color-page", type: "", idx: 1 },
  { name: "--td-bg-color-container-active", type: "", idx: 2 },
  { name: "--td-bg-color-component", type: "", idx: 2 },
  { name: "--td-component-stroke", type: "", idx: 2 },
  { name: "--td-bg-color-secondarycontainer-active", type: "main", idx: 3 },
  { name: "--td-bg-color-component-hover", type: "", idx: 3 },
  { name: "--td-component-border", type: "", idx: 3 },
  { name: "--td-bg-color-component-active", type: "", idx: 5 },
];

export const FONT_COLOR_MAP = [
  { name: "--td-text-color-primary", from: "--td-font-gray-1" },
  { name: "--td-text-color-secondary", from: "--td-font-gray-2" },
  { name: "--td-text-color-placeholder", from: "--td-font-gray-3" },
  { name: "--td-text-color-disabled", from: "--td-font-gray-4" },
  { name: "--td-text-color-anti", value: "#fff" },
  { name: "--td-text-color-brand", from: "--td-brand-color" },
  { name: "--td-text-color-link", from: "--td-brand-color" },
];

// 亮色模式下的功能色、中性色等
export const LIGHT_WARNING_COLOR = `--td-warning-color-1: #fef3e6;
--td-warning-color-2: #f9e0c7;
--td-warning-color-3: #f7c797;
--td-warning-color-4: #f2995f;
--td-warning-color-5: #ed7b2f;
--td-warning-color-6: #d35a21;
--td-warning-color-7: #ba431b;
--td-warning-color-8: #9e3610;
--td-warning-color-9: #842b0b;
--td-warning-color-10: #5a1907;
--td-warning-color: var(--td-warning-color-5);
--td-warning-color-hover: var(--td-warning-color-4);
--td-warning-color-focus: var(--td-warning-color-2);
--td-warning-color-active: var(--td-warning-color-6);
--td-warning-color-disabled: var(--td-warning-color-3);
--td-warning-color-light: var(--td-warning-color-1);`;

export const LIGHT_ERROR_COLOR = `--td-error-color-1: #fdecee;
--td-error-color-2: #f9d7d9;
--td-error-color-3: #f8b9be;
--td-error-color-4: #f78d94;
--td-error-color-5: #f36d78;
--td-error-color-6: #e34d59;
--td-error-color-7: #c9353f;
--td-error-color-8: #b11f26;
--td-error-color-9: #951114;
--td-error-color-10: #680506;
--td-error-color: var(--td-error-color-6);
--td-error-color-hover: var(--td-error-color-5);
--td-error-color-focus: var(--td-error-color-2);
--td-error-color-active: var(--td-error-color-7);
--td-error-color-disabled: var(--td-error-color-3);
--td-error-color-light: var(--td-error-color-1);`;

export const LIGHT_SUCCESS_COLOR = `--td-success-color-1: #e8f8f2;
--td-success-color-2: #bcebdc;
--td-success-color-3: #85dbbe;
--td-success-color-4: #48c79c;
--td-success-color-5: #00a870;
--td-success-color-6: #078d5c;
--td-success-color-7: #067945;
--td-success-color-8: #056334;
--td-success-color-9: #044f2a;
--td-success-color-10: #033017;
--td-success-color: var(--td-success-color-5);
--td-success-color-hover: var(--td-success-color-4);
--td-success-color-focus: var(--td-success-color-2);
--td-success-color-active: var(--td-success-color-6);
--td-success-color-disabled: var(--td-success-color-3);
--td-success-color-light: var(--td-success-color-1);`;

export const LIGHT_GRAY_COLOR = `--td-gray-color-1: #f3f3f3;
--td-gray-color-2: #eee;
--td-gray-color-3: #e7e7e7;
--td-gray-color-4: #dcdcdc;
--td-gray-color-5: #c5c5c5;
--td-gray-color-6: #a6a6a6;
--td-gray-color-7: #8b8b8b;
--td-gray-color-8: #777;
--td-gray-color-9: #5e5e5e;
--td-gray-color-10: #4b4b4b;
--td-gray-color-11: #383838;
--td-gray-color-12: #2c2c2c;
--td-gray-color-13: #242424;
--td-gray-color-14: #181818;
--td-bg-color-container: #fff;
--td-bg-color-container-select: #fff;
--td-bg-color-page: var(--td-gray-color-2);
--td-bg-color-container-hover: var(--td-gray-color-1);
--td-bg-color-container-active: var(--td-gray-color-3);
--td-bg-color-secondarycontainer: var(--td-gray-color-1);
--td-bg-color-secondarycontainer-hover: var(--td-gray-color-2);
--td-bg-color-secondarycontainer-active: var(--td-gray-color-4);
--td-bg-color-component: var(--td-gray-color-3);
--td-bg-color-component-hover: var(--td-gray-color-4);
--td-bg-color-component-active: var(--td-gray-color-6);
--td-bg-color-component-disabled: var(--td-gray-color-2);
--td-component-stroke: var(--td-gray-color-3);
--td-component-border: var(--td-gray-color-4);`;

export const LIGHT_FONT_COLOR = `--td-font-white-1: #ffffff;
--td-font-white-2: rgba(255, 255, 255, 0.55);
--td-font-white-3: rgba(255, 255, 255, 0.35);
--td-font-white-4: rgba(255, 255, 255, 0.22);
--td-font-gray-1: rgba(0, 0, 0, 0.9);
--td-font-gray-2: rgba(0, 0, 0, 0.6);
--td-font-gray-3: rgba(0, 0, 0, 0.4);
--td-font-gray-4: rgba(0, 0, 0, 0.26);`;

export const LIGHT_SCROLLBAR_COLOR = `--td-brand-color-light-hover: var(--td-brand-color-2);
--td-warning-color-light-hover: var(--td-warning-color-2);
--td-error-color-light-hover: var(--td-error-color-2);
--td-success-color-light-hover: var(--td-success-color-2);
--td-bg-color-secondarycomponent: var(--td-gray-color-4);
--td-bg-color-secondarycomponent-hover: var(--td-gray-color-5);
--td-bg-color-secondarycomponent-active: var(--td-gray-color-6);
--td-table-shadow-color: rgba(0, 0, 0, 8%);
--td-scrollbar-color: rgba(0, 0, 0, 10%);
--td-scrollbar-hover-color: rgba(0, 0, 0, 30%);
--td-scroll-track-color: #fff;
--td-bg-color-specialcomponent: #fff;
--td-border-level-1-color: var(--td-gray-color-3);
--td-border-level-2-color: var(--td-gray-color-4);
--td-shadow-inset-top: inset 0 0.5px 0 #dcdcdc;
--td-shadow-inset-right: inset 0.5px 0 0 #dcdcdc;
--td-shadow-inset-bottom: inset 0 -0.5px 0 #dcdcdc;
--td-shadow-inset-left: inset -0.5px 0 0 #dcdcdc;
--td-mask-active: rgba(0, 0, 0, 0.6);
--td-mask-disabled: rgba(255, 255, 255, 0.6);`;

export const LIGHT_FUNCTION_COLOR = `${LIGHT_WARNING_COLOR} ${LIGHT_ERROR_COLOR} ${LIGHT_SUCCESS_COLOR} ${LIGHT_GRAY_COLOR} ${LIGHT_FONT_COLOR} ${LIGHT_SCROLLBAR_COLOR}`;

// 暗色模式下的功能色、中性色等
export const DARK_ERROR_COLOR = `--td-error-color-1: #472324;
--td-error-color-2: #5e2a2d;
--td-error-color-3: #703439;
--td-error-color-4: #83383e;
--td-error-color-5: #a03f46;
--td-error-color-6: #c64751;
--td-error-color-7: #de6670;
--td-error-color-8: #ec888e;
--td-error-color-9: #edb1b6;
--td-error-color-10: #eeced0;`;

export const DARK_SUCCESS_COLOR = `--td-success-color-1: #193a2a;
--td-success-color-2: #1a4230;
--td-success-color-3: #17533d;
--td-success-color-4: #0d7a55;
--td-success-color-5: #059465;
--td-success-color-6: #43af8a;
--td-success-color-7: #46bf96;
--td-success-color-8: #80d2b6;
--td-success-color-9: #b4e1d3;
--td-success-color-10: #deede8;`;

export const DARK_WARNING_COLOR = `--td-warning-color-1: #4f2a1d;
--td-warning-color-2: #582f21;
--td-warning-color-3: #733c23;
--td-warning-color-4: #a75d2b;
--td-warning-color-5: #cf6e2d;
--td-warning-color-6: #dc7633;
--td-warning-color-7: #e8935c;
--td-warning-color-8: #ecbf91;
--td-warning-color-9: #eed7bf;
--td-warning-color-10: #f3e9dc;`;

export const DARK_GRAY_COLOR = `--td-gray-color-1: #f3f3f3;
--td-gray-color-2: #eee;
--td-gray-color-3: #e7e7e7;
--td-gray-color-4: #dcdcdc;
--td-gray-color-5: #c5c5c5;
--td-gray-color-6: #a6a6a6;
--td-gray-color-7: #8b8b8b;
--td-gray-color-8: #777;
--td-gray-color-9: #5e5e5e;
--td-gray-color-10: #4b4b4b;
--td-gray-color-11: #383838;
--td-gray-color-12: #2c2c2c;
--td-gray-color-13: #242424;
--td-gray-color-14: #181818;
--td-bg-color-page: var(--td-gray-color-14);
--td-bg-color-container: var(--td-gray-color-13);
--td-bg-color-container-hover: var(--td-gray-color-12);
--td-bg-color-container-active: var(--td-gray-color-10);
--td-bg-color-container-select: var(--td-gray-color-9);
--td-bg-color-secondarycontainer: var(--td-gray-color-12);
--td-bg-color-secondarycontainer-hover: var(--td-gray-color-11);
--td-bg-color-secondarycontainer-active: var(--td-gray-color-9);
--td-bg-color-component: var(--td-gray-color-11);
--td-bg-color-component-hover: var(--td-gray-color-10);
--td-bg-color-component-active: var(--td-gray-color-9);
--td-bg-color-component-disabled: var(--td-gray-color-12);
--td-component-stroke: var(--td-gray-color-11);
--td-component-border: var(--td-gray-color-9);`;

export const DARK_FONT_COLOR = `--td-font-white-1: rgba(255, 255, 255, 0.9);
--td-font-white-2: rgba(255, 255, 255, 0.55);
--td-font-white-3: rgba(255, 255, 255, 0.35);
--td-font-white-4: rgba(255, 255, 255, 0.22);
--td-font-gray-1: rgba(0, 0, 0, 0.9);
--td-font-gray-2: rgba(0, 0, 0, 0.6);
--td-font-gray-3: rgba(0, 0, 0, 0.4);
--td-font-gray-4: rgba(0, 0, 0, 0.26);`;

export const DARK_FUNCTION_COLOR = `${DARK_WARNING_COLOR} ${DARK_ERROR_COLOR} ${DARK_SUCCESS_COLOR} ${DARK_GRAY_COLOR} ${DARK_FONT_COLOR}`;
