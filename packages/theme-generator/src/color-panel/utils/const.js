import AgapanthusPurple from '!raw-loader!../assets/AgapanthusPurple'; // 百子莲紫
import DavidiaGreen from '!raw-loader!../assets/DavidiaGreen'; // 珙桐绿
import GovRed from '!raw-loader!../assets/GovRed'; // 政务红
import HyacinthBlue from '!raw-loader!../assets/HyacinthBlue'; //风信子蓝
import MarigoldOrange from '!raw-loader!../assets/MarigoldOrange'; // 万寿菊橙
import MultifloraRed from '!raw-loader!../assets/MultifloraRed'; // 蔷薇红
import PetelotiiYellow from '!raw-loader!../assets/PetelotiiYellow'; //金茶花黄
import PlumbagoBlue from '!raw-loader!../assets/PlumbagoBlue'; // 花丹蓝
import TaxusRed from '!raw-loader!../assets/TaxusRed'; // 豆衫红
import TCloudBlack from '!raw-loader!../assets/TCloudBlack'; // 腾云黑
import TencentBlue from '!raw-loader!../assets/TencentBlue'; //腾讯蓝
import TourismPurple from '!raw-loader!../assets/TourismPurple'; // 文旅紫
import ViridifloraGreen from '!raw-loader!../assets/ViridifloraGreen'; // 鸢尾绿
import WeChatGreen from '!raw-loader!../assets/WeChatGreen'; //微信绿
import YulaniaPink from '!raw-loader!../assets/YulaniaPink'; // 玉兰粉

/* ============================== */

export const DEFAULT_BRAND = '#0052D9';
const DEFAULT_GRAY = '#ddd';
const DEFAULT_SUCCESS = '#2ba471';
const DEFAULT_ERROR = '#d54941';
const DEFAULT_WARNING = '#e37318';

export const DEFAULT_FUNCTION_COLORS = {
  // TO FIX 腾讯云默认的功能色也不需要存入 local
  gray: DEFAULT_GRAY,
  success: DEFAULT_SUCCESS,
  error: DEFAULT_ERROR,
  warning: DEFAULT_WARNING,
};

/* ============================== */

export const DEFAULT_COLORS = [
  {
    name: '腾讯蓝',
    enName: 'Tencent Blue',
    subtitle: TencentBlue,
    value: DEFAULT_BRAND,
  },
  {
    name: '风信子蓝',
    enName: 'Hyacinth Blue',
    subtitle: HyacinthBlue,
    value: '#0894FA',
  },
  {
    name: '金花茶黄',
    enName: 'Petelotii Yellow',
    subtitle: PetelotiiYellow,
    value: '#F3B814',
  },
];

export const RECOMMEND_COLORS = [
  {
    name: '珙桐绿',
    enName: 'Davidia Green',
    subtitle: DavidiaGreen,
    value: '#45C58B',
  },
  {
    name: '鸢尾绿',
    enName: 'Viridiflora Green',
    subtitle: ViridifloraGreen,
    value: '#0ED6CA',
  },
  {
    name: '花丹蓝',
    enName: 'Plumbago Blue',
    subtitle: PlumbagoBlue,
    value: '#53B1FD',
  },
  {
    name: '百子莲紫',
    enName: 'Agapanthus Purple',
    subtitle: AgapanthusPurple,
    value: '#7A5AF8',
  },
  {
    name: '玉兰粉',
    enName: 'Yulania Pink',
    subtitle: YulaniaPink,
    value: '#EF45B3',
  },
  {
    name: '豆衫红',
    enName: 'Taxus Red',
    subtitle: TaxusRed,
    value: '#F54343',
  },

  {
    name: '蔷薇红',
    enName: 'Multiflora Red',
    subtitle: MultifloraRed,
    value: '#FF5479',
  },
  {
    name: '万寿菊橙',
    enName: 'Marigold Orange',
    subtitle: MarigoldOrange,
    value: '#FD853A',
  },
];

export const SCENE_COLORS = [
  {
    name: '微信绿',
    enName: 'WeChat Green',
    subtitle: WeChatGreen,
    value: '#07C160',
  },
  {
    name: '腾云黑',
    enName: 'TCloud Black',
    subtitle: TCloudBlack,
    value: '#262626',
  },
  {
    name: '文旅紫',
    enName: 'Tourism Purple',
    subtitle: TourismPurple,
    value: '#623BFF',
  },
  {
    name: '政务红',
    enName: 'Government Red',
    subtitle: GovRed,
    value: '#EE1C25',
  },
];

/* ============================== */

/* `idx` 对应实际的颜色索引，例如 `--td-brand-color-light: var(--td-brand-1)` */

export const BRAND_TOKEN_MAP = [
  { name: '--td-brand-color-light', idx: 1 },
  { name: '--td-brand-color-focus', idx: 2 },
  { name: '--td-brand-color-disabled', idx: 3 },
];

const GRAY_TOKEN_MAP = [
  { name: '--td-bg-color-container-hover', idx: 1 },
  { name: '--td-bg-color-secondarycontainer', idx: 1 },
  { name: '--td-bg-color-secondarycontainer-hover', idx: 2 },
  { name: '--td-bg-color-component-disabled', idx: 2 },
  { name: '--td-bg-color-page', type: '', idx: 2 },
  { name: '--td-bg-color-container-active', idx: 3 },
  { name: '--td-bg-color-component', type: '', idx: 3 },
  { name: '--td-component-stroke', type: '', idx: 3 },
  { name: '--td-bg-color-secondarycontainer-active', idx: 4 },
  { name: '--td-bg-color-component-hover', idx: 4 },
  { name: '--td-component-border', idx: 4 },
  { name: '--td-bg-color-component-active', idx: 6 },
];

const SUCCESS_TOKEN_MAP = [
  { name: '--td-success-color-light', idx: 1 },
  { name: '--td-success-color-focus', idx: 2 },
  { name: '--td-success-color-disabled', idx: 3 },
  { name: '--td-success-color-hover', idx: 4 },
  { name: '--td-success-color', idx: 5 },
  { name: '--td-success-color-active', idx: 6 },
];

const ERROR_TOKEN_MAP = [
  { name: '--td-error-color-light', idx: 1 },
  { name: '--td-error-color-focus', idx: 2 },
  { name: '--td-error-color-disabled', type: 'disabled', idx: 3 },
  { name: '--td-error-color-hover', type: 'hover', idx: 5 },
  { name: '--td-error-color', type: 'main', idx: 6 },
  { name: '--td-error-color-active', type: 'active', idx: 7 },
];

const WARNING_TOKEN_MAP = [
  { name: '--td-warning-color-light', idx: 1 },
  { name: '--td-warning-color-focus', idx: 2 },
  { name: '--td-warning-color-disabled', idx: 3 },
  { name: '--td-warning-color-hover', idx: 4 },
  { name: '--td-warning-color', idx: 5 },
  { name: '--td-warning-color-active', idx: 6 },
];

export const FUNCTION_TOKEN_MAPS = {
  gray: GRAY_TOKEN_MAP,
  success: SUCCESS_TOKEN_MAP,
  error: ERROR_TOKEN_MAP,
  warning: WARNING_TOKEN_MAP,
};

/* ============================== */

export const FONT_TOKEN_MAP = [
  { name: '--td-text-color-primary', from: '--td-font-gray-1' },
  { name: '--td-text-color-secondary', from: '--td-font-gray-2' },
  { name: '--td-text-color-placeholder', from: '--td-font-gray-3' },
  { name: '--td-text-color-disabled', from: '--td-font-gray-4' },
  { name: '--td-text-color-anti', value: '#fff' },
  { name: '--td-text-color-brand', from: '--td-brand-color' },
  { name: '--td-text-color-link', from: '--td-brand-color' },
];
