import { modifyToken } from '../../common/utils';

export const LINE_HEIGHT_STEPS = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
};

export const LINE_HEIGHT_OPTIONS = [
  { label: '超小', enLabel: 'mini', value: 1 },
  { label: '小', enLabel: 'small', value: 2 },
  { label: '默认', enLabel: 'default', value: 3 },
  { label: '大', enLabel: 'large', value: 4 },
  { label: '特大', enLabel: 'max', value: 5 },
  { label: '自定义', enLabel: 'customized', value: 6, disabled: true },
];

export function updateLineHeightTokens(commonVal, type = 'plus') {
  const LINE_HEIGHT_VAR = [
    'link-small',
    'link-medium',
    'link-large',
    'mark-small',
    'mark-medium',
    'body-small',
    'body-medium',
    'body-large',
    'title-small',
    'title-medium',
    'title-large',
    'headline-small',
    'headline-medium',
    'headline-large',
    'display-medium',
    'display-large',
  ];

  LINE_HEIGHT_VAR.forEach((size) => {
    const fontSizeToken = `--td-font-size-${size}`;
    const lineHeightToken = `--td-line-height-${size}`;

    // 基于字体大小计算行高
    const fontSize = getComputedStyle(document.documentElement).getPropertyValue(fontSizeToken);
    const fontSizeNum = parseFloat(fontSize);
    const commonValNum = parseFloat(commonVal);

    if (!fontSize || isNaN(commonValNum)) return;

    let result;
    if (type === 'plus') {
      result = fontSizeNum + commonValNum;
    } else if (type === 'time') {
      result = fontSizeNum * commonValNum;
    }

    modifyToken(lineHeightToken, result + 'px');
  });
}
