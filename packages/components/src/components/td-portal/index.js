import { html, define } from 'hybrids';
import style from './style.less';

export default define({
  tag: 'td-portal',
  visible: false,
  portalStyle: '',
  render: (host) => {
    return html`
      ${host.portalStyle ? html`<style>${host.portalStyle}</style>` : ''}
      <slot class="TDesign-portal" name="content"></slot>
    `.css`${style}`
  },
});
