import { html, define } from 'hybrids';
import style from './style.less';
import Prism from 'prismjs';

function getLineStyle(host) {
  const { slotsName, panel } = host;
  const index = slotsName?.findIndex(s => s === panel) || 0;

  if (index === -1 || !host.shadowRoot) return '';

  const panelEls = host.shadowRoot.querySelectorAll('.header-panel');

  const { offsetLeft, offsetWidth } = panelEls[index];
  return `width: ${offsetWidth}px; left: ${offsetLeft}px`;
}

function extractSlots(host) {
  const slotsEl = Array.from(host.querySelectorAll('td-code-block > [slot]'));
  const slotsName = [];
  const slotsContentMap = {};

  slotsEl.forEach(s => {
    slotsName.push(s.slot);
    slotsContentMap[s.slot] = {
      name: s.slot,
      lang: s.lang,
      content: decodeURIComponent(s.innerHTML),
    }
  });

  // 保存 slots
  host.slotsName = slotsName;

  return {
    slotsEl,
    slotsName,
    slotsContentMap,
  };
}

export default define({
  tag: 'td-code-block',
  panel: {
    get: (host, lastValue) => lastValue || '',
    set: (host, value) => value,
    observe: (host) => {
      if (!host.shadowRoot) return;

      const lineEl = host.shadowRoot.querySelector('.active-line');
      lineEl.style = getLineStyle(host);
    }
  },
  render: (host) => {
    const { panel } = host;
    const { slotsName, slotsContentMap } = extractSlots(host);

    const slotObj = slotsContentMap[panel];

    const highlightCode = Prism.highlight(
      slotObj.content,
      Prism.languages[slotObj.lang],
      slotObj.lang
    );

    return html`
      <div class="TDesign-code-block">
        <td-doc-copy code="${slotObj.content}"></td-doc-copy>
        <div class="TDesign-code-block__header">
          ${slotsName.map(slotName => html`
            <div class="header-panel" onclick="${html.set('panel', slotName)}">
              <span class="panel-inner ${panel === slotName ? 'active' : ''}">${slotName}</span>
            </div>
          `)}

          <span class="active-line"></span>
        </div>

        <div class="TDesign-code-block__body">
          <pre class="language-${slotObj.lang}" innerHTML="${highlightCode}"></pre>
        </div>
      </div>
    `.css`${style}`
  },
});
