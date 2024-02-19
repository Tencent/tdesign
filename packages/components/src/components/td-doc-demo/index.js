import { html, define, dispatch } from 'hybrids';
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
  currentLangIndex: 0,
  languages: undefined, // multiple languages display
  currentRenderCode: '',
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
    let { code, language, showCode, mode, theme, currentLangIndex, languages, activeStyleMap } = host;
    const languageArr = typeof languages === 'string' ? languages.split(',') : [];

    const tabsDisplay =
      languageArr.length > 0 &&
      languageArr.filter((lang) => host.dataset?.[lang] || host.dataset?.[lang.toLocaleLowerCase()]).length ==
        languageArr.length;

    const currentLang = languageArr[currentLangIndex] || '';
    const currentCode = host.dataset?.[currentLang] || host.dataset?.[currentLang.toLocaleLowerCase()] || code;
    const highlightCode = Prism.highlight(currentCode, Prism.languages[language], language);
    host.currentRenderCode = currentCode;
    const activeStyle = activeStyleMap && languageArr.length ? activeStyleMap[languageArr[currentLangIndex]] : {};
    const showCodeStyle = {
      transitionDuration: '.2s',
      maxHeight: showCode ? '560px' : 0,
      transitionTimingFunction: showCode ? 'cubic-bezier(.82, 0, 1, .9)' : 'ease',
    };

    const handleClick = (index) => {
      host.currentLangIndex = index;
      dispatch(host, 'click', { detail: { index, lang: languageArr[index] } });
    };

    return html`
      <div class="TDesign-doc-demo ${mode}">
        <slot></slot>
        <div class="TDesign-doc-demo__footer">
          <div class="TDesign-doc-demo__btns">
            <slot name="action"></slot>
            <td-doc-copy code=${
              host.dataset?.[currentLang] || host.dataset?.[currentLang.toLocaleLowerCase()] || code
            } theme=${mode === 'open' ? 'dark' : 'light'}></td-doc-copy>
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
            tabsDisplay
              ? html`<div class="TDesign-doc-demo-tabs">
                  <span class="TDesign-doc-demo-tabs__active" style="${activeStyle}"></span>
                  ${languageArr.map(
                    (language, index) =>
                      html`<div
                        data-tab=${language}
                        class="TDesign-doc-demo-tabs__item ${currentLangIndex === index ? 'active' : null}"
                        onclick=${() => handleClick(index)}
                      >
                        ${language}
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
