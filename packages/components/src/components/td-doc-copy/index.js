import { html, dispatch, define } from 'hybrids';
import style from './style.less';
import copyIcon from '@images/copy.svg?raw';

function handleCopy(host) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(host.code)
      .then(() => {
        Object.assign(host, { showTip: true });
        setTimeout(() => Object.assign(host, { showTip: false }), 800);
        dispatch(host, 'copy', { detail: host.code });
      });
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.textContent = host.code;
  textarea.style.width = 0;
  textarea.style.height = 0;
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(textarea);

  dispatch(host, 'copy', { detail: host.code });
}

export default define({
  tag: 'td-doc-copy',
  code: '',
  render: () => html`
    <td-tooltip duration="800">
      <div class="TDesign-doc-copy__inner" innerHTML=${copyIcon} onclick=${handleCopy}></div>
      <span slot="content">已复制</span>
    </td-tooltip>
  `.css`${style}`,
});
