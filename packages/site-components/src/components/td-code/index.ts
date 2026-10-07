import { define, html } from 'hybrids';
import style from './style.less?inline';

interface CodeProps {
  text: string;
}

export default define<CodeProps>({
  tag: 'td-code',
  text: '',
  render: ({ text }) => html`<code class="TDesign-code">${text}</code>`.css`${style}`,
});
