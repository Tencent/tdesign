import { html, define } from 'hybrids';
import style from './style.less?inline';

interface PortalProps {
  visible: boolean;
  portalStyle: string;
}

export default define<PortalProps>({
  tag: 'td-portal',
  visible: { value: false, reflect: true },
  portalStyle: '',
  render: (host) => {
    return html`
      ${
        host.portalStyle
          ? html`<style>
              ${host.portalStyle}
            </style>`
          : ''
      }
      <slot class="td-portal" name="content"></slot>
    `.css`${style}`;
  },
});
