// Shared theme rules. Panel labels and interaction metadata stay in their panels.

export interface FontSizeStep {
  name: string;
  value: string;
}

export const FONT_SIZE_STEPS: Record<number, FontSizeStep[]> = {
  1: [
    { name: '--td-font-size-link-small', value: '12px' },
    { name: '--td-font-size-link-medium', value: '13px' },
    { name: '--td-font-size-link-large', value: '14px' },
    { name: '--td-font-size-mark-small', value: '12px' },
    { name: '--td-font-size-mark-medium', value: '13px' },
    { name: '--td-font-size-body-small', value: '12px' },
    { name: '--td-font-size-body-medium', value: '13px' },
    { name: '--td-font-size-body-large', value: '14px' },
    { name: '--td-font-size-title-small', value: '13px' },
    { name: '--td-font-size-title-medium', value: '14px' },
    { name: '--td-font-size-title-large', value: '16px' },
    { name: '--td-font-size-headline-small', value: '21px' },
    { name: '--td-font-size-headline-medium', value: '24px' },
    { name: '--td-font-size-headline-large', value: '28px' },
    { name: '--td-font-size-display-medium', value: '36px' },
    { name: '--td-font-size-display-large', value: '48px' },
  ], // 超小号
  2: [
    { name: '--td-font-size-link-small', value: '12px' },
    { name: '--td-font-size-link-medium', value: '13px' },
    { name: '--td-font-size-link-large', value: '15px' },
    { name: '--td-font-size-mark-small', value: '12px' },
    { name: '--td-font-size-mark-medium', value: '13px' },
    { name: '--td-font-size-body-small', value: '12px' },
    { name: '--td-font-size-body-medium', value: '13px' },
    { name: '--td-font-size-body-large', value: '15px' },
    { name: '--td-font-size-title-small', value: '13px' },
    { name: '--td-font-size-title-medium', value: '15px' },
    { name: '--td-font-size-title-large', value: '17px' },
    { name: '--td-font-size-headline-small', value: '22px' },
    { name: '--td-font-size-headline-medium', value: '25px' },
    { name: '--td-font-size-headline-large', value: '31px' },
    { name: '--td-font-size-display-medium', value: '40px' },
    { name: '--td-font-size-display-large', value: '52px' },
  ], // 小号
  3: [
    { name: '--td-font-size-link-small', value: '12px' },
    { name: '--td-font-size-link-medium', value: '14px' },
    { name: '--td-font-size-link-large', value: '16px' },
    { name: '--td-font-size-mark-small', value: '12px' },
    { name: '--td-font-size-mark-medium', value: '14px' },
    { name: '--td-font-size-body-small', value: '12px' },
    { name: '--td-font-size-body-medium', value: '14px' },
    { name: '--td-font-size-body-large', value: '16px' },
    { name: '--td-font-size-title-small', value: '14px' },
    { name: '--td-font-size-title-medium', value: '16px' },
    { name: '--td-font-size-title-large', value: '18px' },
    { name: '--td-font-size-headline-small', value: '24px' },
    { name: '--td-font-size-headline-medium', value: '28px' },
    { name: '--td-font-size-headline-large', value: '36px' },
    { name: '--td-font-size-display-medium', value: '48px' },
    { name: '--td-font-size-display-large', value: '64px' },
  ], // 默认
  4: [
    { name: '--td-font-size-link-small', value: '13px' },
    { name: '--td-font-size-link-medium', value: '15px' },
    { name: '--td-font-size-link-large', value: '17px' },
    { name: '--td-font-size-mark-small', value: '13px' },
    { name: '--td-font-size-mark-medium', value: '15px' },
    { name: '--td-font-size-body-small', value: '13px' },
    { name: '--td-font-size-body-medium', value: '15px' },
    { name: '--td-font-size-body-large', value: '17px' },
    { name: '--td-font-size-title-small', value: '15px' },
    { name: '--td-font-size-title-medium', value: '17px' },
    { name: '--td-font-size-title-large', value: '19px' },
    { name: '--td-font-size-headline-small', value: '25px' },
    { name: '--td-font-size-headline-medium', value: '29px' },
    { name: '--td-font-size-headline-large', value: '37px' },
    { name: '--td-font-size-display-medium', value: '49px' },
    { name: '--td-font-size-display-large', value: '65px' },
  ], // 大号
  5: [
    { name: '--td-font-size-link-small', value: '14px' },
    { name: '--td-font-size-link-medium', value: '17px' },
    { name: '--td-font-size-link-large', value: '20px' },
    { name: '--td-font-size-mark-small', value: '14px' },
    { name: '--td-font-size-mark-medium', value: '17px' },
    { name: '--td-font-size-body-small', value: '14px' },
    { name: '--td-font-size-body-medium', value: '17px' },
    { name: '--td-font-size-body-large', value: '20px' },
    { name: '--td-font-size-title-small', value: '17px' },
    { name: '--td-font-size-title-medium', value: '20px' },
    { name: '--td-font-size-title-large', value: '20px' },
    { name: '--td-font-size-headline-small', value: '32px' },
    { name: '--td-font-size-headline-medium', value: '38px' },
    { name: '--td-font-size-headline-large', value: '47px' },
    { name: '--td-font-size-display-medium', value: '59px' },
    { name: '--td-font-size-display-large', value: '74px' },
  ], // 特大号
};

export const RADIUS_TOKENS = [
  '--td-radius-small',
  '--td-radius-default',
  '--td-radius-medium',
  '--td-radius-large',
  '--td-radius-extraLarge',
  '--td-radius-circle',
];

export const RADIUS_STEP_ARRAY: (number | string)[][] = [
  [0, 0, 0, 0, 0, '50%'],
  [1, 2, 4, 6, 8, '50%'],
  [2, 3, 6, 9, 12, '50%'],
  [3, 4, 8, 12, 16, '50%'],
  [4, 6, 12, 18, 24, '50%'],
];

export const SHADOW_TOKENS = ['--td-shadow-1', '--td-shadow-2', '--td-shadow-3'];

export const ShadowSelectType = {
  Super_Light: 0,
  Light: 1,
  Default: 2,
  Deep: 3,
  Super_Deep: 4,
  Self_Defined: 5,
} as const;

export type ShadowSelectTypeValue = (typeof ShadowSelectType)[keyof typeof ShadowSelectType];

export const ShadowSelectDetail: Record<number, string[]> = {
  [ShadowSelectType.Super_Light]: [
    '0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 2px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 2px 6px rgba(0, 0, 0, 0.02), 0 4px 6px rgba(0, 0, 0, 0.05), 0 3px 3px rgba(0, 0, 0, 0.06)',
    '0 4px 10px 3px rgba(0, 0, 0, 0.05), 0 4px 6px 2px rgba(0, 0, 0, 0.04), 0 2px 3px -3px rgba(0, 0, 0, 0.08)',
  ],
  [ShadowSelectType.Light]: [
    '0 1px 6px rgba(0, 0, 0, 0.05), 0 3px 4px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
    '0 3px 10px 2px rgba(0, 0, 0, 0.04), 0 6px 8px rgba(0, 0, 0, 0.05), 0 4px 4px -2px rgba(0, 0, 0, 0.08)',
    '0 4px 18px 5px rgba(0, 0, 0, 0.05), 0 10px 9px 2px rgba(0, 0, 0, 0.04), 0 3px 5px -3px rgba(0, 0, 0, 0.08)',
  ],
  [ShadowSelectType.Default]: [
    '0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
    '0 3px 14px 2px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.06), 0 5px 5px -3px rgba(0, 0, 0, 0.1)',
    '0 6px 30px 5px rgba(0, 0, 0, 0.05), 0 16px 24px 2px rgba(0, 0, 0, 0.04), 0 8px 10px -5px rgba(0, 0, 0, 0.08)',
  ],
  [ShadowSelectType.Deep]: [
    '0 3px 18px rgba(0, 0, 0, 0.06), 0 4px 7px rgba(0, 0, 0, 0.1), 0 2px 7px -1px rgba(0, 0, 0, 0.14)',
    '0 5px 18px 2px rgba(0, 0, 0, 0.07), 0 10px 15px 1px rgba(0, 0, 0, 0.1), 0 6px 10px -4px rgba(0, 0, 0, 0.14)',
    '0 8px 33px 5px rgba(0, 0, 0, 0.07), 0 18px 28px 2px rgba(0, 0, 0, 0.07), 0 10px 12px -6px rgba(0, 0, 0, 0.17)',
  ],
  [ShadowSelectType.Super_Deep]: [
    '0 5px 20px rgba(0, 0, 0, 0.08), 0 5px 8px rgba(0, 0, 0, 0.12), 0 5px 10px -1px rgba(0, 0, 0, 0.18)',
    '0 7px 23px 2px rgba(0, 0, 0, 0.09), 0 12px 17px 1px rgba(0, 0, 0, 0.1), 0 8px 14px -4px rgba(0, 0, 0, 0.18)',
    '0 11px 37px 5px rgba(0, 0, 0, 0.1), 0 21px 31px 2px rgba(0, 0, 0, 0.12), 0 14px 20px -6px rgba(0, 0, 0, 0.16)',
  ],
  [ShadowSelectType.Self_Defined]: ['', '', ''],
};
