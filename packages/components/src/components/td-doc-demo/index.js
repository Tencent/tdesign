import { html, define } from 'hybrids';
import Prism from 'prismjs';
import style from './style.less';
import codeIcon from '@images/code.svg?raw';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript';

export default define({
  tag: 'td-doc-demo',
  code: '',
  language: 'jsx',
  showCode: false,
  mode: 'auto', // auto open
  tsCode: undefined,
  compositionCode: undefined,
  currentLangIndex: 0,
  theme: {
    get: (host, lastValue) => lastValue || sessionStorage.getItem('--tdesign-theme') || 'light',
    set: (host, value) => value,
    connect(host, key, invalidate) {
      function themeChange() {
        const theme = sessionStorage.getItem('--tdesign-theme');
        Object.assign(host, { [key]: theme });
        invalidate();
      }

      window.addEventListener('storageChange', themeChange);

      return () => window.removeEventListener('storageChange', themeChange);
    },
  },
  render: (host) => {
    let { code, language, showCode, mode, theme, tsCode, compositionCode, currentLangIndex } = host;
    const codeMap = {
      0: code,
      1: tsCode,
      2: compositionCode,
    };
    const currentCode = codeMap[currentLangIndex];
    const highlightCode = Prism.highlight(currentCode, Prism.languages[language], language);

    const showCodeStyle = {
      transitionDuration: '.2s',
      maxHeight: showCode ? '560px' : 0,
      transitionTimingFunction: showCode ? 'cubic-bezier(.82, 0, 1, .9)' : 'ease',
    };

    return html`
      <div class="TDesign-doc-demo ${mode}">
        <slot></slot>
        <div class="TDesign-doc-demo__footer">
          <div class="TDesign-doc-demo__btns">
            <slot name="action"></slot>
            <td-doc-copy code=${currentCode} theme=${mode === 'open' ? 'dark' : 'light'}></td-doc-copy>
            ${
              mode === 'open'
                ? html``
                : html`<span
                    class="action code ${showCode ? 'active' : ''}"
                    onclick=${html.set('showCode', !showCode)}
                    innerHTML=${codeIcon}
                  ></span>`
            }
          </div>
          <div class="TDesign-doc-demo__code ${theme}" style="${showCodeStyle}">
          ${
            tsCode || compositionCode
              ? html`<div class="TDesign-doc-demo-tabs">
                  <span class="TDesign-doc-demo-tabs__block"></span>
                  <div
                    data-tab="Javascript"
                    class="item ${currentLangIndex === 0 ? 'active' : null}"
                    onclick=${html.set('currentLangIndex', 0)}
                  >
                    Javascript
                  </div>
                  ${tsCode
                    ? html`<div
                        data-tab="TypeScript"
                        class="item ${currentLangIndex === 1 ? 'active' : null}"
                        onclick=${html.set('currentLangIndex', 1)}
                      >
                        TypeScript
                      </div>`
                    : null}
                  ${compositionCode
                    ? html`<div
                        data-tab="JavaScript(composition-api)"
                        class="item ${currentLangIndex === 2 ? 'active' : null}"
                        onclick=${html.set('currentLangIndex', 2)}
                      >
                        JavaScript(composition-api)
                      </div>`
                    : null}
                </div>`
              : ''
          }
            <pre class="language-${language}"><code class="language-${language}" innerHTML="${highlightCode}"></code></pre>
            </div>
          </div>
        </div>
      </div>
    `.css`${style}`;
  },
});
