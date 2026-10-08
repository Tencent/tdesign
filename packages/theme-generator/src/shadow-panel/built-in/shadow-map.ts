import { SHADOW_TOKENS, ShadowSelectType } from '@/common/themes/presets';
import type { ShadowSelectTypeValue } from '@/common/themes/presets';

export { ShadowSelectType, ShadowSelectDetail } from '@/common/themes/presets';
export type { ShadowSelectTypeValue } from '@/common/themes/presets';

export interface ShadowSelectOption {
  label: string;
  enLabel: string;
  value: ShadowSelectTypeValue;
  disabled?: boolean;
}

export const ShadowSelect: ShadowSelectOption[] = [
  { label: '超轻', enLabel: 'lighter', value: ShadowSelectType.Super_Light },
  { label: '轻', enLabel: 'light', value: ShadowSelectType.Light },
  { label: '默认', enLabel: 'default', value: ShadowSelectType.Default },
  { label: '深', enLabel: 'deep', value: ShadowSelectType.Deep },
  { label: '超深', enLabel: 'deeper', value: ShadowSelectType.Super_Deep },
  { label: '自定义', enLabel: 'customized', value: ShadowSelectType.Self_Defined, disabled: true },
];

export interface ShadowTypeDetailItem {
  label: string;
  key: string;
  tips: string;
  enTips: string;
}

export const ShadowTypeDetail: ShadowTypeDetailItem[] = [
  {
    label: 'shadow-1',
    key: 'td-shadow-1',
    tips: '组件 hover 状态使用，例如表格和树拖动',
    enTips: 'Used when the component is hovered',
  },
  {
    label: 'shadow-2',
    key: 'td-shadow-2',
    tips: '下拉组件使用，例如下拉菜单 / 气泡确认框 / 选择器 等',
    enTips: 'Used for dropdown components, such as dropdown, menu, select, etc.',
  },
  {
    label: 'shadow-3',
    key: 'td-shadow-3',
    tips: '警示或弹窗组件使用，例如全局提示 / 消息通知等',
    enTips: 'Used for alert or popup components, such as global prompt, message notification, etc.',
  },
];

export interface ShadowTypeMapItem {
  name: string;
  from: string;
  value?: string;
}

export const ShadowTypeMap: ShadowTypeMapItem[] = [
  {
    name: SHADOW_TOKENS[0],
    from: SHADOW_TOKENS[0],
  },
  {
    name: SHADOW_TOKENS[1],
    from: SHADOW_TOKENS[1],
  },
  {
    name: SHADOW_TOKENS[2],
    from: SHADOW_TOKENS[2],
  },
];
