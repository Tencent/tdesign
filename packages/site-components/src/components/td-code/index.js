import { define, html } from 'hybrids';
import style from './style.less?inline';

export default define({
  tag: 'td-code',
  text: '',
  render: ({ text }) => html`<code class="TDesign-code">${text}</code>`.css`${style}`,
});
