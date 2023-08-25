export const ShadowSelectType = {
  Super_Light: 0,
  Light: 1,
  Default: 2,
  Deep: 3,
  Super_Deep: 4,
  Self_Defined: 5,
};

export const ShadowSelectDetail = {
  [ShadowSelectType.Super_Light]: [
    "0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 2px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05)",
    "0 2px 6px rgba(0, 0, 0, 0.02), 0 4px 6px rgba(0, 0, 0, 0.05), 0 3px 3px rgba(0, 0, 0, 0.06)",
    "0 4px 10px 3px rgba(0, 0, 0, 0.05), 0 4px 6px 2px rgba(0, 0, 0, 0.04), 0 2px 3px -3px rgba(0, 0, 0, 0.08)",
  ],
  [ShadowSelectType.Light]: [
    "0 1px 6px rgba(0, 0, 0, 0.05), 0 3px 4px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.08)",
    "0 3px 10px 2px rgba(0, 0, 0, 0.04), 0 6px 8px rgba(0, 0, 0, 0.05), 0 4px 4px -2px rgba(0, 0, 0, 0.08)",
    "0 4px 18px 5px rgba(0, 0, 0, 0.05), 0 10px 9px 2px rgba(0, 0, 0, 0.04), 0 3px 5px -3px rgba(0, 0, 0, 0.08)",
  ],
  [ShadowSelectType.Default]: [
    "0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.12)",
    "0 3px 14px 2px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.06), 0 5px 5px -3px rgba(0, 0, 0, 0.1)",
    "0 6px 30px 5px rgba(0, 0, 0, 0.05), 0 16px 24px 2px rgba(0, 0, 0, 0.04), 0 8px 10px -5px rgba(0, 0, 0, 0.08)",
  ],
  [ShadowSelectType.Deep]: [
    "0 3px 18px rgba(0, 0, 0, 0.06), 0 4px 7px rgba(0, 0, 0, 0.1), 0 2px 7px -1px rgba(0, 0, 0, 0.14)",
    "0 5px 18px 2px rgba(0, 0, 0, 0.07), 0 10px 15px 1px rgba(0, 0, 0, 0.1), 0 6px 10px -4px rgba(0, 0, 0, 0.14)",
    "0 8px 33px 5px rgba(0, 0, 0, 0.07), 0 18px 28px 2px rgba(0, 0, 0, 0.07), 0 10px 12px -6px rgba(0, 0, 0, 0.17)",
  ],
  [ShadowSelectType.Super_Deep]: [
    "0 5px 20px rgba(0, 0, 0, 0.08), 0 5px 8px rgba(0, 0, 0, 0.12), 0 5px 10px -1px rgba(0, 0, 0, 0.18)",
    "0 7px 23px 2px rgba(0, 0, 0, 0.09), 0 12px 17px 1px rgba(0, 0, 0, 0.1), 0 8px 14px -4px rgba(0, 0, 0, 0.18)",
    "0 11px 37px 5px rgba(0, 0, 0, 0.1), 0 21px 31px 2px rgba(0, 0, 0, 0.12), 0 14px 20px -6px rgba(0, 0, 0, 0.16)",
  ],
  [ShadowSelectType.Self_Defined]: ["", "", ""],
};

export const ShadowSelect = [
  { label: "超轻",  enLabel: "thiner",value: ShadowSelectType.Super_Light },
  { label: "轻",  enLabel: "thin",value: ShadowSelectType.Light },
  { label: "默认",  enLabel: "default",value: ShadowSelectType.Default },
  { label: "深",  enLabel: "deep",value: ShadowSelectType.Deep },
  { label: "超深",  enLabel: "deeper",value: ShadowSelectType.Super_Deep },
  { label: "自定义",  enLabel: "customized",value: ShadowSelectType.Self_Defined, disabled: true },
];

export const ShadowTypeDetail = [
  {
    label: "shadow-1",
    key: "td-shadow-1",
    tips: "组件 hover 状态使用，例如表格和树拖动",
    enTips: "Used when the component is hovered",
  },
  {
    label: "shadow-2",
    key: "td-shadow-2",
    tips: "下拉组件使用，例如下拉菜单 / 气泡确认框 / 选择器 等",
    enTips:
      "Used for dropdown components, such as dropdown, menu, select, etc.",
  },
  {
    label: "shadow-3",
    key: "td-shadow-3",
    tips: "警示或弹窗组件使用，例如全局提示 / 消息通知等",
    enTips:
      "Used for alert or popup components, such as global prompt, message notification, etc.",
  },
];

export const ShadowTypeMap = [
  {
    name: "--td-shadow-1",
    from: "--td-shadow-1",
  },
  {
    name: "--td-shadow-2",
    from: "--td-shadow-2",
  },
  {
    name: "--td-shadow-3",
    from: "--td-shadow-3",
  },
];
