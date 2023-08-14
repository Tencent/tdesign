import { html, define } from 'hybrids';
import style from './style.less';

function getColor(message) {
  const percentage = message && parseFloat(message);
  if (percentage >= 90) {
    return 'brightgreen';
  } if (percentage >= 70) {
    return 'yellow';
  }
  return 'red';
}

export default define({
  tag: 'td-doc-badge',
  label: 'coverage',
  message: '0%',
  color: '',
  render: (host) => {
    const { label, message, color: defaultColor } = host;
    let color = defaultColor;

    if (!color) color = getColor(message);

    const badgeUrl = encodeURI(`https://img.shields.io/badge/${label}-${message}-${color}`);

    return html`
      <img class="TDesign-doc-badge" src="${badgeUrl}" />
    `.css`${style}`;
  },
});
