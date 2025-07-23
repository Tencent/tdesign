export const DEFAULT_BRAND = '#0052D9';
const DEFAULT_GRAY = '#ddd';
const DEFAULT_SUCCESS = '#2ba471';
const DEFAULT_ERROR = '#d54941';
const DEFAULT_WARNING = '#e37318';

export const DEFAULT_FUNCTION_COLORS = {
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
    value: DEFAULT_BRAND,
  },
  {
    name: '风信子蓝',
    enName: 'Hyacinth Blue',
    value: '#0894FA',
  },
  {
    name: '金花茶黄',
    enName: 'Petelotii Yellow',
    value: '#F3B814',
  },
];

export const RECOMMEND_COLORS = [
  {
    name: '珙桐绿',
    enName: 'Davidia Green',
    value: '#45C58B',
  },
  {
    name: '鸢尾绿',
    enName: 'Viridiflora Green',
    value: '#0ED6CA',
  },
  {
    name: '花丹蓝',
    enName: 'Plumbago Blue',
    value: '#53B1FD',
  },
  {
    name: '百子莲紫',
    enName: 'Agapanthus Purple',
    value: '#7A5AF8',
  },
  {
    name: '玉兰粉',
    enName: 'Yulania Pink',
    value: '#EF45B3',
  },
  {
    name: '豆衫红',
    enName: 'Taxus Red',
    value: '#F54343',
  },
  {
    name: '蔷薇红',
    enName: 'Multiflora Red',
    value: '#FF5479',
  },
  {
    name: '万寿菊橙',
    enName: 'Marigold Orange',
    value: '#FD853A',
  },
];

export const SCENE_COLORS = [
  {
    name: '微信绿',
    enName: 'WeChat Green',
    value: '#07C160',
  },
  {
    name: '腾云黑',
    enName: 'TCloud Black',
    value: '#262626',
  },
  {
    name: '文旅紫',
    enName: 'Tourism Purple',
    value: '#623BFF',
  },
  {
    name: '政务红',
    enName: 'Government Red',
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
