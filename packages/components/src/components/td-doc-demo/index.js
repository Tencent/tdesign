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
  languageArr: undefined, // multiple languages display
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
  activeStyleMap: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    connect: (host, key) => {
      function handleResize() {
        if (!host.shadowRoot) {
          setTimeout(handleResize, 300);
          return;
        }

        const items = host.shadowRoot.querySelectorAll('.TDesign-doc-demo-tabs__item');
        let styleMap = {};
        items.forEach((item) => {
          if (!item.offsetWidth) {
            styleMap = null;
          } else {
            const { tab } = item.dataset;
            styleMap[tab] = {
              width: `${item.offsetWidth}px`,
              transform: `translate3d(${item.offsetLeft - 4}px, 0, 0)`,
            };
          }
        });
        Object.assign(host, { [key]: styleMap });
      }

      requestAnimationFrame(handleResize);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
  },
  render: (host) => {
    let { code, language, showCode, mode, theme, currentLangIndex, languageArr, activeStyleMap } = host;

    const currentCode = languageArr?.[currentLangIndex].code || code;
    const highlightCode = Prism.highlight(currentCode, Prism.languages[language], language);
    const activeStyle = activeStyleMap && languageArr ? activeStyleMap[languageArr[currentLangIndex].name] : {};

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
            languageArr
              ? html`<div class="TDesign-doc-demo-tabs">
                  <span class="TDesign-doc-demo-tabs__active" style="${activeStyle}"></span>
                  ${languageArr.map(
                    ({ name }, index) =>
                      html`<div
                        data-tab=${name}
                        class="TDesign-doc-demo-tabs__item ${currentLangIndex === index ? 'active' : null}"
                        onclick=${html.set('currentLangIndex', index)}
                      >
                        ${name}
                      </div>`,
                  )}
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
