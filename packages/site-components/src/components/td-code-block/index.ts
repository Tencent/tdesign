import { html, define } from 'hybrids';
import style from './style.less?inline';
import Prism from 'prismjs';

interface SlotContent {
  name: string;
  lang: string;
  content: string;
}

interface CodeBlockProps {
  panel: string;
}

type CodeBlockHost = CodeBlockProps & HTMLElement;

function getLineStyle(host: CodeBlockHost) {
  const { panel } = host;
  const slots = host.querySelectorAll<HTMLElement>('td-code-block > [slot]');
  const index = Array.from(slots).findIndex((slot) => slot.slot === panel);

  if (index === -1 || !host.shadowRoot) return '';

  const panelEls = host.shadowRoot.querySelectorAll<HTMLElement>('.header-panel');

  const panelEl = panelEls[index];
  if (!panelEl) return '';
  const { offsetLeft, offsetWidth } = panelEl;
  return `width: ${offsetWidth}px; left: ${offsetLeft}px`;
}

function extractSlots(host: CodeBlockHost) {
  const slotsEl = Array.from(host.querySelectorAll('td-code-block > [slot]')) as HTMLElement[];
  const slotsName: string[] = [];
  const slotsContentMap = new Map<string, SlotContent>();

  slotsEl.forEach((s) => {
    slotsName.push(s.slot);
    slotsContentMap.set(s.slot, {
      name: s.slot,
      lang: s.lang,
      content: decodeURIComponent(s.innerHTML),
    });
  });

  return {
    slotsEl,
    slotsName,
    slotsContentMap,
  };
}

export default define<CodeBlockProps>({
  tag: 'td-code-block',
  panel: {
    value: (host, v) => v || '',
    observe: (host) => {
      if (!host.shadowRoot) return;

      const lineEl = host.shadowRoot.querySelector<HTMLElement>('.active-line');
      if (lineEl) lineEl.style.cssText = getLineStyle(host);
    },
  },
  render: (host) => {
    const { panel } = host;
    const { slotsName, slotsContentMap } = extractSlots(host);

    const slotObj = slotsContentMap.get(panel);
    if (!slotObj) return html``;

    const highlightCode = Prism.highlight(slotObj.content, Prism.languages[slotObj.lang], slotObj.lang);

    return html`
      <div class="td-code-block">
        <td-doc-copy code="${slotObj.content}"></td-doc-copy>
        <div class="td-code-block__header">
          ${slotsName.map(
            (slotName) => html`
              <div class="header-panel" onclick="${html.set('panel', slotName)}">
                <span class="panel-inner ${panel === slotName ? 'active' : ''}">${slotName}</span>
              </div>
            `,
          )}

          <span class="active-line"></span>
        </div>

        <div class="td-code-block__body">
          <pre class="language-${slotObj.lang}" innerHTML="${highlightCode}"></pre>
        </div>
      </div>
    `.css`${style}`;
  },
});
