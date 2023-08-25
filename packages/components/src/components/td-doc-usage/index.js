import { html, define, dispatch } from "hybrids";
import style from "./style.less";
import tipsIcon from "@images/tips.svg?raw";
import codeIcon from "@images/code.svg?raw";
import Prism from 'prismjs';

function getLineStyle(host) {
  const { panelList, panel } = host;
  const index = panelList.findIndex(p => p.value === panel);

  if (index === -1 || !host.shadowRoot) return '';

  const panelEls = host.shadowRoot.querySelectorAll('.header-panel');

  const { offsetLeft, offsetWidth } = panelEls[index];
  return `width: ${offsetWidth}px; left: ${offsetLeft}px`;
}

function handleConfigChange(host, e, item) {
  const { detail } = e;

  dispatch(host, "ConfigChange", {
    detail: { value: detail.value, name: item.name, type: item.type },
  });
}

function renderConfig(configList = []) {
  const booleanList = [];
  const enumList = [];

  configList.forEach((item) => {
    if (/boolean/i.test(item.type)) booleanList.push(item);
    if (/enum/i.test(item.type)) enumList.push(item);
  });

  return html`
    ${booleanList.length
      ? html`
          <ul class="TDesign-doc-usage__config-list">
            ${booleanList.map(
              (item) => html`
                <li class="item">
                  <span class="name" title="${item.name}">${item.name}</span>
                  <td-switch
                    size="small"
                    value="${item.defaultValue}"
                    onchange="${(host, e) => handleConfigChange(host, e, item)}"
                  ></td-switch>
                </li>
              `
            )}
          </ul>
        `
      : ""}
    ${enumList.length
      ? html`
          ${booleanList.length ? html`<div class="TDesign-doc-usage__config-divider"></div>` : ''}
          <ul class="TDesign-doc-usage__config-list">
            ${enumList.map(
              (item) => html`
                <li class="item">
                  <span class="name" title="${item.name}">${item.name}</span>
                  <td-select
                    borderless
                    value="${item.defaultValue}"
                    options="${item.options}"
                    onchange="${(host, e) => handleConfigChange(host, e, item)}"
                  ></td-select>
                </li>
              `
            )}
          </ul>
        `
      : ""}
  `;
}

export default define({
  tag: "td-doc-usage",
  code: "",
  showCode: false,
  language: "markup",
  panel: {
    set: (host, value, lastValue) => {
      if (value && lastValue !== value) {
        dispatch(host, "PanelChange", { detail: { value } });
      }
      return value;
    },
    get: (host, lastValue) => lastValue || host.panelList[0]?.value,
    observe: (host) => {
      if (!host.shadowRoot) return;

      const lineEl = host.shadowRoot.querySelector('.active-line');
      lineEl.style = getLineStyle(host);
    }
  },
  panelList: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value) => value,
  },
  configList: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value) => value,
  },
  render: (host) => {
    const { code, language, showCode, configList, panelList, panel } = host;
    const highlightCode = Prism.highlight(
      code,
      Prism.languages[language],
      language
    );

    const showCodeStyle = {
      transitionDuration: '.2s',
      maxHeight: showCode ? "240px" : 0,
      transitionTimingFunction: showCode ? "cubic-bezier(.82, 0, 1, .9)" : 'ease',
    };

    return html`
      <div class="TDesign-doc-usage">
        <div class="TDesign-doc-usage__content">
          <div class="TDesign-doc-usage__render">
            <div class="TDesign-doc-usage__render-header">
              ${panelList.map(item => html`
                <div class="header-panel" onclick="${html.set('panel', item.value)}">
                  <span class="panel-inner ${panel === item.value ? 'active' : ''}">${item.label}</span>
                </div>
              `)}

              <span class="active-line"></span>
            </div>

            <slot name="${panel}" class="TDesign-doc-usage__render-slot"></slot>

            <div class="TDesign-doc-usage__render-footer">
              <slot name="action"></slot>
              <td-doc-copy code=${code}></td-doc-copy>
              <span
                class="action code ${showCode ? "active" : ""}"
                onclick=${html.set("showCode", !showCode)}
                innerHTML=${codeIcon}
              ></span>
            </div>
          </div>

          <div class="TDesign-doc-usage__config">
            <div class="TDesign-doc-usage__config-title">
              <i innerHTML="${tipsIcon}"></i>
              <span>配置</span>
            </div>

            <div class="TDesign-doc-usage__config-content">
              ${renderConfig(configList)}
            </div>

          </div>
        </div>
        <div class="TDesign-doc-usage__code" style="${showCodeStyle}">
          <pre
            class="language-${language}"
          ><code class="language-${language}" innerHTML="${highlightCode}"></code></pre>
        </div>
      </div>
    `.css`${style}`;
  },
});
