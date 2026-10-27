import { html, define, type Descriptor } from 'hybrids';
import style from './style.less?inline';

interface BadgeHost {
  label: string;
  message: string;
  color: string;
}

function attribute(defaultValue: string): Descriptor<BadgeHost, string> {
  return {
    value: (_host, value) => value ?? defaultValue,
    connect: (host, key) => {
      const attributeName = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const syncAttribute = () => {
        host[key] = host.getAttribute(attributeName) ?? defaultValue;
      };
      const observer = new MutationObserver(syncAttribute);

      if (host.hasAttribute(attributeName)) syncAttribute();
      observer.observe(host, { attributes: true, attributeFilter: [attributeName] });

      return () => observer.disconnect();
    },
  };
}

function getColor(message: string): string {
  const percentage = parseFloat(message);
  if (percentage >= 90) {
    return 'brightgreen';
  }
  if (percentage >= 70) {
    return 'yellow';
  }
  return 'red';
}

export default define<BadgeHost>({
  tag: 'td-doc-badge',
  label: attribute('coverage'),
  message: attribute('0%'),
  color: attribute(''),
  render: (host) => {
    const { label, message, color: defaultColor } = host;
    let color = defaultColor;

    if (!color) color = getColor(message);

    const badgeUrl = encodeURI(`https://img.shields.io/badge/${label}-${message}-${color}`);

    return html` <img class="TDesign-doc-badge" src="${badgeUrl}" /> `.css`${style}`;
  },
});
