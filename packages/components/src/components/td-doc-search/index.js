import { html, define } from 'hybrids';
import style from './style.less';
import searchIcon from '@images/search.svg?raw';
import './docsearch.min.js';
import docsearchStyle from './docsearch.less';

function initDocSearch(docsearchInfo) {
  if (!docsearchInfo.indexName) return;

  const config = Object.assign({
    apiKey: 'b27ded009670a12d2f36303309a7f50a',
    // indexName: 'tdesign_doc',
    appId: 'FK4VWYRY3Q',
    inputSelector: '#TDSearch',
    // Set debug to true to inspect the dropdown
    debug: false,
  }, docsearchInfo);

  window.docsearch(config);
}

export default define({
  tag: 'td-doc-search',
  docsearchInfo: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value) => value,
    connect: (host) => {
      const innerDom = `
        <style>${style}</style>
        <style>${docsearchStyle}</style>
        <div class="TDesign-doc-search">
          <input id="TDSearch" class="TDesign-doc-search__inner" placeholder="搜索" type="text" />
          <span class="TDesign-doc-search__icon">${searchIcon}</span>
        </div>
      `;
      Object.assign(host, { innerHTML: innerDom });
    },
    observe(_host, value) {
      initDocSearch(value);
    },
  },

  render: () => html`
    <div>
      <slot></slot>
    </div>
  `,
});
