import { html, define } from 'hybrids';
import style from './style.less';
import { mobileBodyStyle } from '@utils';

const FIXED_HEADER_TOP = 228;

function anchorHighlight() {
  const selectors = ['div[name="DEMO"]', 'div[name="API"]', 'div[name="DESIGN"]', 'div[name="DOC"]'];

  function getLinkTopList(anchorList) {
    const linkList = anchorList.map((anchor) => {
      const [, id] = decodeURIComponent(anchor.href).split('#');
      return document.getElementById(id);
    });
    return linkList.map((link) => {
      if (!link) return 0;
      const { top } = link.getBoundingClientRect();
      return top + document.documentElement.scrollTop;
    });
  }

  function highlightAnchor(anchorList, linkTopList) {
    const { scrollTop } = document.documentElement;

    for (let i = 0; i < linkTopList.length; i++) {
      if (scrollTop <= linkTopList[i]) {
        if (anchorList[i].classList.contains('active')) break;
        anchorList.forEach((anchor) => anchor.classList.remove('active'));
        anchorList[i].classList.add('active');
        break;
      }
    }
  }

  selectors.forEach((item) => {
    const wrapper = document.querySelector(item);
    if (!wrapper) return;

    const anchorList = Array.from(wrapper.querySelectorAll('.tdesign-toc_list_item_a')) || [];
    const linkTopList = getLinkTopList(anchorList);
    highlightAnchor(anchorList, linkTopList);
  });
}

export default define({
  tag: 'td-doc-content',
  platform: 'web',
  pageStatus: 'show',
  mobileBodyStyle,
  fixedAnchor: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    connect: () => {
      function changeTocHeight() {
        const { scrollTop } = document.documentElement;
        // 固定右侧目录
        const containers = document.querySelectorAll('.tdesign-toc_container');

        if (scrollTop > FIXED_HEADER_TOP) {
          containers.forEach((container) => {
            Object.assign(container.style, { position: 'fixed', top: '152px' });
          });
        } else {
          containers.forEach((container) => {
            Object.assign(container.style, { position: 'absolute', top: '316px'  });
          });
        }

        anchorHighlight();
      }
      // 优化锚点滚动体验
      function proxyTitleAnchor(e) {
        if (e.target.tagName !== 'A') return;
        const { target } = e;
        const href = decodeURIComponent(target.href);
        if (!href.includes('#')) return;

        const [, id = ''] = href.split('#');
        if (target.classList.contains('tdesign-header-anchor') || target.classList.contains('tdesign-toc_list_item_a')) {
          const idTarget = document.getElementById(id);
          if (!idTarget) return;
          const { top } = idTarget.getBoundingClientRect();
          const offsetTop = top + document.documentElement.scrollTop; 

          requestAnimationFrame(() => window.scrollTo({ top: offsetTop - 120, left: 0 }));
        }
      }

      // 加载后跳转到锚点定位处
      function handleAnchorScroll() {
        const href = decodeURIComponent(location.href);
        if (!href.includes('#')) return;

        const [, id = ''] = href.split('#');
        const idTarget = document.getElementById(id);
        if (!idTarget) return;

        const { top } = idTarget.getBoundingClientRect();
        const offsetTop = top + document.documentElement.scrollTop; 

        requestAnimationFrame(() => window.scrollTo({ top: offsetTop - 120, left: 0 }));
      }

      document.addEventListener('scroll', changeTocHeight);
      document.addEventListener('click', proxyTitleAnchor);
      window.addEventListener('load', handleAnchorScroll)
      
      return () => {
        document.removeEventListener('scroll', changeTocHeight);
        document.removeEventListener('click', proxyTitleAnchor);
        window.removeEventListener('load', handleAnchorScroll)
      };
    },
  },
  render: (host) => {
    return html`
      <style>${style}</style>
      <div class="TDesign-doc-content ${host.pageStatus}">
        <slot name="doc-header"></slot>

        <div class="TDesign-doc-body" style=${host.mobileBodyStyle}>
          <div class="TDesign-doc-body__inner">
            <slot></slot>
          </div>
        </div>

        <slot name="doc-footer"></slot>

        <td-backtop></td-backtop>
      </div>
    `;
  },
});
