import { html, define } from 'hybrids';
import style from './style.less?inline';

export default define({
  tag: 'td-portal',
  visible: { value: false, reflect: true },
  portalStyle: '',
  render: (host) => {
    return html`
      ${host.portalStyle
        ? html`<style>
            ${host.portalStyle}
          </style>`
        : ''}
      <slot class="TDesign-portal" name="content"></slot>
    `.css`${style}`;
  },
});
