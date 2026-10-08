import { html, define, dispatch } from 'hybrids';
import style from './style.less?inline';

type SwitchSize = 'small' | 'medium' | 'large';

interface SwitchProps {
  value: boolean;
  size: SwitchSize;
}

function handleChange(host: SwitchProps & HTMLElement) {
  host.value = !host.value;
  dispatch(host, 'change', { detail: { value: host.value } });
}

export default define<SwitchProps>({
  tag: 'td-switch',
  value: false,
  size: 'medium',
  render: (host) => {
    const { value, size } = host;

    const switchClass = {
      'td-switch': true,
      'is-checked': value,
      [`size-${size}`]: size,
    };

    return html`
      <button type="button" class="${switchClass}" onclick="${handleChange}">
        <span class="td-switch__handle"></span>
      </button>
    `.css`${style}`;
  },
});
