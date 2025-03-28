export * from 'tdesign-vue/es/_common/js/color-picker';

export function appendStyleSheet(themeId) {
  let styleSheet;
  const existSheet = document.getElementById(themeId);

  if (!existSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = themeId;
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);
  } else {
    styleSheet = existSheet;
  }
  return styleSheet;
}

export function handleAttach() {
  return document.querySelector('td-theme-generator')?.shadowRoot?.querySelector?.('.theme-generator') || document.body;
}

export function replacePercentages(str) {
  return str.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
    return `${parseFloat(number) / 100}`;
  });
}

export function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = fileName;
  a.target = '_blank';
  a.href = url;
  a.click();
}

export function removeCssProperties(cssText, properties) {
  if (!Array.isArray(properties)) {
    properties = [properties];
  }

  properties.forEach((property) => {
    const reg = new RegExp(`${property}:\\s*.*?;`, 'g');
    cssText = cssText.replace(reg, '');
  });

  return cssText;
}

export function extractRootContent(cssText) {
  // 匹配 {} 内的内容
  const match = cssText.match(/{([^}]*)}/);
  return match ? match[1].trim() : '';
}
