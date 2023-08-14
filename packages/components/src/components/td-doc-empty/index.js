import { html, define } from 'hybrids';
import style from './style.less';

function renderEmpty(type) {
  if (type === 'design') {
    return html`
      <div class="TDesign-doc-empty__design">
        <img class="light" src="https://tdesign.gtimg.com/site/webcomponents/empty-light.png" />
        <img class="dark" src="https://tdesign.gtimg.com/site/webcomponents/empty-dark.png" />
      </div>
    `;
  }
}

export default define({
  tag: 'td-doc-empty',
  type: 'design',
  render: (host) => {
    const { type } = host;

    return html`
      <div class="TDesign-doc-empty">
        ${renderEmpty(type)}
      </div>
    `.css`${style}`;
  },
});
