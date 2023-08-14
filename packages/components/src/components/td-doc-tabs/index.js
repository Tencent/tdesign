import { html, dispatch, define } from "hybrids";
import style from "./style.less";
import { getLang } from '@utils';

const lang = getLang();

function handleTabClick(host, e) {
  host.tabScrollMap[host.tab] = document.documentElement.scrollTop;

  const { tab: currentTab } = e.target.dataset;
  Object.assign(host, { tab: currentTab });
  dispatch(host, "change", { detail: currentTab });

  // 自动滚动
  if (host.autoScroll) {
    requestAnimationFrame(() => {
      window.scrollTo({
        left: 0,
        top: host.tabScrollMap[currentTab],
        behavior: "smooth",
      });
    });
  }
}

const defaultTabs = [
  { tab: "demo", name: lang === 'zh' ? "示例" : "Demo" },
  { tab: "api", name: "API" },
  { tab: "design", name: lang === 'zh' ? "指南" : "Guide" },
];

export default define({
  tag: "td-doc-tabs",
  tab: "demo",
  // 记录每个 tab 滚动条并自动滚动
  autoScroll: true,
  // 记录每个 tab 的滚动距离
  tabScrollMap: {
    get: (host, lastValue) => {
      const tabMap = {};
      host.tabs.forEach(({ tab }) => {
        tabMap[tab] = 0;
      });
      return lastValue || tabMap;
    },
    set: (_host, value) => value,
  },
  tabs: {
    get: (_host, lastValue) => lastValue || defaultTabs,
    set: (_host, value) => value,
  },
  blockStyleMap: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    connect: (host, key) => {
      function handleResize() {
        if (!host.shadowRoot) {
          setTimeout(handleResize, 300);
          return;
        }

        const items = host.shadowRoot.querySelectorAll(".item");
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

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
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
            <div
              data-tab=${item.tab}
              onclick="${handleTabClick}"
              class="item ${item.tab === tab ? "active" : ""}"
            >
              ${item.name}
            </div>
          `
        )}
      </div>
    `.css`${style}`;
  },
});
