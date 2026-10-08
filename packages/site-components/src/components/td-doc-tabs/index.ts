import { html, dispatch, define } from 'hybrids';
import { isEn } from '@utils';
import style from './style.less?inline';

interface TabItem {
  tab: string;
  name: string;
}

interface TabBlockStyle {
  width: string;
  transform: string;
}

type TabScrollMap = Record<string, number>;
type TabBlockStyleMap = Record<string, TabBlockStyle>;

interface DocTabsProps {
  tab: string;
  autoScroll: boolean;
  tabScrollMap: TabScrollMap;
  tabs: TabItem[];
  blockStyleMap: TabBlockStyleMap | null;
}

type DocTabsHost = HTMLElement & DocTabsProps;

function handleTabClick(host: DocTabsHost, event?: Event): void {
  host.tabScrollMap[host.tab] = document.documentElement.scrollTop;

  const currentTab = (event?.target as HTMLElement | null)?.dataset.tab;
  if (!currentTab) return;
  Object.assign(host, { tab: currentTab });
  dispatch(host, 'change', { detail: currentTab });

  // 自动滚动
  if (host.autoScroll) {
    requestAnimationFrame(() => {
      window.scrollTo({
        left: 0,
        top: host.tabScrollMap[currentTab],
        behavior: 'smooth',
      });
    });
  }
}

const defaultTabs = [
  { tab: 'demo', name: !isEn() ? '示例' : 'Demo' },
  { tab: 'api', name: 'API' },
  { tab: 'design', name: !isEn() ? '指南' : 'Guide' },
];

export default define<DocTabsProps>({
  tag: 'td-doc-tabs',
  tab: 'demo',
  // 记录每个 tab 滚动条并自动滚动
  autoScroll: true,
  // 记录每个 tab 的滚动距离
  tabScrollMap: {
    value: (host, v) => {
      const tabMap: TabScrollMap = {};
      host.tabs.forEach(({ tab }) => {
        tabMap[tab] = 0;
      });
      return v || tabMap;
    },
  },
  tabs: {
    value: (_host, v) => v || defaultTabs,
  },
  blockStyleMap: {
    value: (_host, v) => v || undefined,
    connect: (host, key) => {
      function handleResize() {
        if (!host.shadowRoot) {
          setTimeout(handleResize, 300);
          return;
        }

        const items = host.shadowRoot.querySelectorAll<HTMLElement>('.item');
        let styleMap: TabBlockStyleMap | null = {};
        items.forEach((item) => {
          if (!item.offsetWidth) {
            styleMap = null;
          } else {
            const { tab } = item.dataset;
            if (!tab) return;
            if (!styleMap) return;
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
    const { tab, tabs, blockStyleMap } = host;
    const blockStyle = blockStyleMap ? blockStyleMap[tab] : {};

    if (!tabs.length) return html``;

    return html`
      <div class="TDesign-doc-tabs">
        <span class="TDesign-doc-tabs__block" style="${blockStyle}"></span>
        ${tabs.map(
          (item) => html`
            <div data-tab=${item.tab} onclick="${handleTabClick}" class="item ${item.tab === tab ? 'active' : ''}">
              ${item.name}
            </div>
          `,
        )}
      </div>
    `.css`${style}`;
  },
});
