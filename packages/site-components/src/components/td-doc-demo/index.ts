import { html, define, dispatch } from 'hybrids';
import Prism from 'prismjs';
import { attribute, parseBoolean } from '@utils';
import style from './style.less?inline';
import codeIcon from '@images/code.svg?raw';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript';

interface TabStyle {
  width: string;
  transform: string;
}

interface DemoHost {
  code: string;
  language: string;
  showCode: boolean;
  mode: string;
  currentLangIndex: number;
  languages: string | undefined;
  _dataVersion: number;
  theme: string;
  activeStyleMap: Record<string, TabStyle> | null | undefined;
}

function getTabStyle(styleMap: Record<string, TabStyle> | null | undefined, tab: string): TabStyle | undefined {
  return styleMap?.[tab];
}

export default define<DemoHost>({
  tag: 'td-doc-demo',
  code: '',
  language: 'jsx',
  showCode: {
    value: (_host, v) => parseBoolean(v, false),
  },
  mode: 'auto', // auto open
  currentLangIndex: 0,
  languages: attribute<string | undefined>(undefined), // multiple languages display
  _dataVersion: {
    value: (_host, value) => value || 0,
    connect: (host) => {
      const observer = new MutationObserver((mutations) => {
        if (mutations.some(({ attributeName }) => attributeName?.startsWith('data-'))) {
          host._dataVersion += 1;
        }
      });
      observer.observe(host, { attributes: true });

      return () => observer.disconnect();
    },
  },
  theme: {
    value: (_host, v) => v || localStorage.getItem('--tdesign-theme') || 'light',
    connect(host, key, invalidate) {
      function themeChange() {
        const theme = localStorage.getItem('--tdesign-theme') || 'light';
        Object.assign(host, { [key]: theme });
        invalidate();
      }

      window.addEventListener('storageChange', themeChange);

      return () => window.removeEventListener('storageChange', themeChange);
    },
  },
  activeStyleMap: {
    value: (_host, v) => v || undefined,
    connect: (host, key) => {
      function handleResize() {
        if (!host.shadowRoot) {
          setTimeout(handleResize, 300);
          return;
        }

        const items = host.shadowRoot.querySelectorAll<HTMLElement>('.TDesign-doc-demo-tabs__item');
        let styleMap: Record<string, TabStyle> | null = {};
        items.forEach((item) => {
          if (!item.offsetWidth) {
            styleMap = null;
          } else if (styleMap) {
            const { tab } = item.dataset;
            if (tab) {
              styleMap[tab] = {
                width: `${item.offsetWidth}px`,
                transform: `translate3d(${item.offsetLeft}px, 0, 0)`,
              };
            }
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
    let { code, language, showCode, mode, theme, currentLangIndex, languages, _dataVersion, activeStyleMap } = host;
    void _dataVersion;
    const languageArr = typeof languages === 'string' ? languages.split(',') : [];

    const tabsDisplay =
      languageArr.length > 0 &&
      languageArr.filter((lang) => host.dataset?.[lang] || host.dataset?.[lang.toLocaleLowerCase()]).length ==
        languageArr.length;

    const currentLang = languageArr[currentLangIndex] || '';
    const currentCode = host.dataset?.[currentLang] || host.dataset?.[currentLang.toLocaleLowerCase()] || code;
    const highlightCode = Prism.highlight(currentCode, Prism.languages[language], language);
    const activeStyle =
      activeStyleMap && languageArr.length ? getTabStyle(activeStyleMap, languageArr[currentLangIndex]) : {};
    // mode 为 open 时始终保持展开，且不渲染切换按钮
    const expanded = mode === 'open' || showCode;
    const showCodeStyle = {
      transitionDuration: '.2s',
      maxHeight: expanded ? '560px' : 0,
      transitionTimingFunction: expanded ? 'cubic-bezier(.82, 0, 1, .9)' : 'ease',
    };

    const handleClick = (index: number) => {
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
