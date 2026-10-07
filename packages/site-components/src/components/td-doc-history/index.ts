import { html, define } from 'hybrids';
import style from './style.less?inline';
import historyIcon from '@images/history.svg?raw';

interface HistoryHost {
  time: string;
  content: string;
}

function transformTime(time: string): string {
  let text = time;
  if (/^\d+$/.test(time)) {
    text = new Date(parseFloat(time)).toLocaleString('en-US');
  }

  return text;
}

export default define<HistoryHost>({
  tag: 'td-doc-history',
  time: '',
  content: '',
  render: ({ time, content }) => {
    return html`
      <div class="TDesign-doc-history">
        <i class="icon" innerHTML="${historyIcon}"></i>
        ${content
          ? content
          : html`
              <span class="text">Last Update: </span>
              ${transformTime(time)}
            `}
      </div>
    `.css`${style}`;
  },
});
