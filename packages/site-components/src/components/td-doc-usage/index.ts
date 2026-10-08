import { html, define, dispatch } from 'hybrids';
import style from './style.less?inline';
import tipsIcon from '@images/tips.svg?raw';
import codeIcon from '@images/code.svg?raw';
import Prism from 'prismjs';

interface PanelItem {
  label: string;
  value: string;
}

interface ConfigItem {
  name: string;
  type: string;
  defaultValue: string | boolean;
  options?: readonly unknown[];
}

interface ConfigChangeEvent extends Event {
  detail: { value: unknown };
}

interface DocUsageProps {
  code: string;
  showCode: boolean;
  language: string;
  panel: string | undefined;
  panelList: PanelItem[];
  configList: ConfigItem[];
}

type DocUsageHost = HTMLElement & DocUsageProps;

function getLineStyle(host: DocUsageHost): string {
  const { panelList, panel } = host;
  const index = panelList.findIndex((p) => p.value === panel);

  if (index === -1 || !host.shadowRoot) return '';

  const panelEls = host.shadowRoot.querySelectorAll<HTMLElement>('.header-panel');

  const panelEl = panelEls[index];
  if (!panelEl) return '';
  const { offsetLeft, offsetWidth } = panelEl;
  return `width: ${offsetWidth}px; left: ${offsetLeft}px`;
}

function handleConfigChange(host: DocUsageHost, event: ConfigChangeEvent, item: ConfigItem): void {
  const { detail } = event;

  dispatch(host, 'ConfigChange', {
    detail: { value: detail.value, name: item.name, type: item.type },
  });
}

function renderConfig(configList: ConfigItem[] = []) {
  const booleanList: ConfigItem[] = [];
  const enumList: ConfigItem[] = [];

  configList.forEach((item) => {
    if (/boolean/i.test(item.type)) booleanList.push(item);
    if (/enum/i.test(item.type)) enumList.push(item);
  });

  return html`
    ${
      booleanList.length
        ? html`
            <ul class="td-doc-usage__config-list">
              ${booleanList.map(
                (item) => html`
                  <li class="item">
                    <span class="name" title="${item.name}">${item.name}</span>
                    <td-switch
                      size="small"
                      value="${item.defaultValue}"
                      onchange="${(host: DocUsageHost, event?: Event) =>
                        event && handleConfigChange(host, event as ConfigChangeEvent, item)}"
                    ></td-switch>
                  </li>
                `,
              )}
            </ul>
          `
        : ''
    }
    ${
      enumList.length
        ? html`
            ${booleanList.length ? html`<div class="td-doc-usage__config-divider"></div>` : ''}
            <ul class="td-doc-usage__config-list">
              ${enumList.map(
                (item) => html`
                  <li class="item">
                    <span class="name" title="${item.name}">${item.name}</span>
                    <td-select
                      borderless
                      value="${item.defaultValue}"
                      options="${item.options}"
                      onchange="${(host: DocUsageHost, event?: Event) =>
                        event && handleConfigChange(host, event as ConfigChangeEvent, item)}"
                    ></td-select>
                  </li>
                `,
              )}
            </ul>
          `
        : ''
    }
  `;
}

export default define<DocUsageProps>({
  tag: 'td-doc-usage',
  code: '',
  showCode: false,
  language: 'markup',
  panel: {
    value: (host, v) => v || host.panelList[0]?.value,
    observe: (host, value, lastValue) => {
      if (value && lastValue !== value) {
        dispatch(host, 'PanelChange', { detail: { value } });
      }
      if (!host.shadowRoot) return;

      const lineEl = host.shadowRoot.querySelector<HTMLElement>('.active-line');
      if (lineEl) lineEl.style.cssText = getLineStyle(host);
    },
  },
  panelList: {
    value: (host, v) => v || [],
  },
  configList: {
    value: (host, v) => v || [],
  },
  render: (host) => {
    const { code, language, showCode, configList, panelList, panel } = host;
    const highlightCode = Prism.highlight(code, Prism.languages[language], language);

    const showCodeStyle = {
      transitionDuration: '.2s',
      maxHeight: showCode ? '240px' : 0,
      transitionTimingFunction: showCode ? 'cubic-bezier(.82, 0, 1, .9)' : 'ease',
    };

    return html`
      <div class="td-doc-usage">
        <div class="td-doc-usage__content">
          <div class="td-doc-usage__render">
            <div class="td-doc-usage__render-header">
              ${panelList.map(
                (item) => html`
                  <div class="header-panel" onclick="${html.set('panel', item.value)}">
                    <span class="panel-inner ${panel === item.value ? 'active' : ''}">${item.label}</span>
                  </div>
                `,
              )}

              <span class="active-line"></span>
            </div>

            <slot name="${panel}" class="td-doc-usage__render-slot"></slot>

            <div class="td-doc-usage__render-footer">
              <slot name="action"></slot>
              <td-doc-copy code=${code}></td-doc-copy>
              <span
                class="action code ${showCode ? 'active' : ''}"
                onclick=${html.set('showCode', !showCode)}
                innerHTML=${codeIcon}
              ></span>
            </div>
          </div>

          <div class="td-doc-usage__config">
            <div class="td-doc-usage__config-title">
              <i innerHTML="${tipsIcon}"></i>
              <span>配置</span>
            </div>

            <div class="td-doc-usage__config-content">${renderConfig(configList)}</div>
          </div>
        </div>
        <div class="td-doc-usage__code" style="${showCodeStyle}">
          <pre
            class="language-${language}"
          ><code class="language-${language}" innerHTML="${highlightCode}"></code></pre>
        </div>
      </div>
    `.css`${style}`;
  },
});
