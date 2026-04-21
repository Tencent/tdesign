/**
 * td-doc-search —— 视图层
 *
 * 全部渲染片段集中于此，每个导出函数接受两个参数：
 *   - host      hybrids 组件实例（用于读响应式 property 与文案 attribute）
 *   - handlers  事件回调注入对象（把"视图如何响应交互"和"视图长什么样"解耦）
 *
 * 为什么用 handlers 注入？如果在 views.js 里 import 事件实现，视图层就反向依赖了
 * 事件层（`onTriggerInput` 等存在 index.js 里）。注入方式让 views.js 保持"纯"：
 *   - 不读 DOM（除了 innerHTML 透传高亮片段）
 *   - 不写 host 响应式状态（改状态的职责全部在 state.js / index.js）
 *
 * handlers 结构（由 index.js 传入）：
 * {
 *   onTriggerInput,      // input 输入时
 *   onTriggerKeyDown,    // input 键盘按下
 *   onTriggerFocus,      // input 聚焦（用于打开 popover）
 *   onHitClick,          // 点某个命中项 (host, hit, e) => void
 *   onCategoryClick,     // 点左栏分类   (host, key, e) => void
 *   onRemoveRecent,      // 点最近搜索项右侧"移除"按钮 (host, url, e) => void
 * }
 */

import { html } from 'hybrids';
import SearchIcon from 'tdesign-icons-svg/src/search.svg?raw';
import CloseIcon from 'tdesign-icons-svg/src/close.svg?raw';

import { VIEW } from './constants.js';
import { computeView, interp } from './state.js';

/* ------------------------------------------------------------------ *
 * 触发区（始终可见的顶部输入框）
 * ------------------------------------------------------------------ */

/**
 * 顶部输入框与图标。所有键盘快捷交互（ArrowUp/Down/Enter/Escape 等）都由
 * onTriggerKeyDown 统一派发；onTriggerFocus 负责把 popover 打开。
 *
 * @param {HTMLElement} host
 * @param {Object} handlers
 */
export function renderTrigger(host, handlers) {
  return html`
    <div class="TDesign-docsearch-trigger">
      <span class="TDesign-docsearch-trigger__icon" innerHTML=${SearchIcon}></span>
      <input
        type="search"
        class="TDesign-docsearch-trigger__input"
        placeholder=${host.placeholder}
        autocomplete="off"
        spellcheck="false"
        aria-label=${host.placeholder}
        aria-expanded=${host.open ? 'true' : 'false'}
        aria-controls="TDesign-docsearch-popover"
        onfocus=${handlers.onTriggerFocus}
        oninput=${handlers.onTriggerInput}
        onkeydown=${handlers.onTriggerKeyDown}
      />
      ${host._loading
        ? html`
            <span class="TDesign-docsearch-trigger__suffix" aria-hidden="true">
              <span class="TDesign-docsearch-spinner"></span>
            </span>
          `
        : html``}
    </div>
  `;
}

/* ------------------------------------------------------------------ *
 * 小型视图
 * ------------------------------------------------------------------ */

/**
 * 通用"空态"块：一行标题 + 一行说明文案。
 * 同时用于 INITIAL（没搜过也没最近记录）与 EMPTY（搜过但无结果）两种场景。
 *
 * @param {string} title
 * @param {string} desc
 */
function renderEmpty(title, desc) {
  return html`
    <div class="TDesign-docsearch-empty">
      <div class="TDesign-docsearch-empty__title">${title}</div>
      <div class="TDesign-docsearch-empty__desc">${desc}</div>
    </div>
  `;
}

/**
 * 命中项 `<li>` 的公共渲染——最近搜索与搜索结果共用。
 *
 * 两处差异由 options 控制：
 *  - `highlight=true`（搜索结果）：title/subtitle 里含 <mark> 片段，走 innerHTML 透传
 *  - `highlight=false`（最近搜索）：title/subtitle 已 strip 过 HTML，走普通文本插值
 *  - `showRemove=true`（最近搜索）：在右侧额外渲染"移除"按钮
 *
 * @param {HTMLElement} host
 * @param {{url:string, title:string, subtitle?:string}} item
 * @param {number} idx
 * @param {Object} handlers
 * @param {{ showRemove?: boolean, highlight?: boolean }} [options]
 */
function renderHitItem(host, item, idx, handlers, options = {}) {
  const { showRemove = false, highlight = true } = options;
  const active = idx === host._currentIndex;

  const titleNode = highlight
    ? html`<span class="TDesign-docsearch-hit__title" innerHTML=${item.title}></span>`
    : html`<span class="TDesign-docsearch-hit__title">${item.title}</span>`;

  const subtitleNode = item.subtitle
    ? highlight
      ? html`<span class="TDesign-docsearch-hit__subtitle" innerHTML=${item.subtitle}></span>`
      : html`<span class="TDesign-docsearch-hit__subtitle">${item.subtitle}</span>`
    : html``;

  const removeBtn = showRemove
    ? html`<button
        type="button"
        class="TDesign-docsearch-hit__remove"
        aria-label=${host.removeLabel}
        innerHTML=${CloseIcon}
        onclick=${(h, e) => handlers.onRemoveRecent(h, item.url, e)}
      ></button>`
    : html``;

  return html`
    <li
      class="TDesign-docsearch-hit ${active ? 'is-active' : ''}"
      data-idx=${idx}
      role="option"
      aria-selected=${active ? 'true' : 'false'}
    >
      <a class="TDesign-docsearch-hit__link" href=${item.url} onclick=${(h, e) => handlers.onHitClick(h, item, e)}>
        ${titleNode}${subtitleNode}${removeBtn}
      </a>
    </li>
  `;
}

/**
 * "最近搜索"视图。
 * 每项是一条历史记录：点击链接跳转、点击右侧 X 单项删除。
 * title / breadcrumb 已在 recent.js 写入时 strip 为纯文本，这里直接文本插值。
 *
 * @param {HTMLElement} host
 * @param {Object} handlers
 */
function renderRecentView(host, handlers) {
  const recent = host._recent || [];
  return html`
    <div class="TDesign-docsearch-section">
      <div class="TDesign-docsearch-section__title">${host.recentTitle}</div>
      <ul class="TDesign-docsearch-list" role="listbox">
        ${recent.map((item, idx) =>
          renderHitItem(
            host,
            {
              url: item.url,
              title: item.title || item.query,
              subtitle: item.breadcrumb,
              breadcrumb: item.breadcrumb,
            },
            idx,
            handlers,
            { showRemove: true, highlight: false },
          ),
        )}
      </ul>
    </div>
  `;
}

/**
 * "两栏结果"视图：左栏分类列表、右栏命中项列表。
 * 命中项的 title / subtitle 是 Algolia 返回的高亮片段（含 <mark>），
 * 通过 innerHTML={hit.title} 透传，由 style.less 对 .TDesign-docsearch-mark 做样式。
 *
 * @param {HTMLElement} host
 * @param {Object} handlers
 */
function renderGroupsView(host, handlers) {
  const { _groups: groups, _activeKey: activeKey, _flatHits: flatHits } = host;

  return html`
    <div class="TDesign-docsearch-cols">
      <div class="TDesign-docsearch-cols__left">
        <ul class="TDesign-docsearch-cat-list" role="listbox" aria-label=${host.categoryLabel}>
          ${groups.map(
            (g) => html`
              <li
                class="TDesign-docsearch-cat ${g.key === activeKey ? 'is-active' : ''}"
                role="option"
                aria-selected=${g.key === activeKey ? 'true' : 'false'}
                onclick=${(h, e) => handlers.onCategoryClick(h, g.key, e)}
              >
                <span class="TDesign-docsearch-cat__title" innerHTML=${g.title}></span>
                <span class="TDesign-docsearch-cat__badge" aria-label=${`${g.items.length} ${host.resultLabel}`}
                  >${g.items.length}</span
                >
              </li>
            `,
          )}
        </ul>
      </div>
      <div class="TDesign-docsearch-cols__right">
        <ul class="TDesign-docsearch-list" role="listbox" aria-label=${host.resultLabel}>
          ${flatHits.map((hit, idx) => renderHitItem(host, hit, idx, handlers, { showRemove: false, highlight: true }))}
        </ul>
      </div>
    </div>
  `;
}

/**
 * Popover 主体内容调度器：根据 computeView 的结果选择渲染哪一种视图。
 *
 * 本函数是**纯 switch**——"搜索中应展示什么" 的所有判断都在 computeView 里收口，
 * 视图层只管按视图类型出 DOM。
 *
 * @param {HTMLElement} host
 * @param {Object} handlers
 */
function renderPopoverBody(host, handlers) {
  const view = computeView({
    query: host._query,
    loading: host._loading,
    groups: host._groups,
    recent: host._recent,
  });

  switch (view) {
    case VIEW.RESULTS:
    case VIEW.LOADING_RESULTS:
      return renderGroupsView(host, handlers);
    case VIEW.RECENT:
      return renderRecentView(host, handlers);
    case VIEW.EMPTY:
      return renderEmpty(interp(host.noResultTitle, { query: host._query }), host.noResultDesc);
    case VIEW.LOADING_PLACEHOLDER:
      return renderEmpty(interp(host.loadingTitle, { query: host._query }), host.loadingDesc);
    case VIEW.INITIAL:
    default:
      return renderEmpty(host.emptyTitle, host.emptyDesc);
  }
}

/* ------------------------------------------------------------------ *
 * Popover 外框（含 footer + loading 遮罩）
 * ------------------------------------------------------------------ */

/**
 * Popover 根节点。通过 host.open 控制 .is-open class 做显隐与动画；
 * footer 固定展示 "Search by Algolia" 品牌；loading 叠加层在右上角显示 spinner。
 *
 * @param {HTMLElement} host
 * @param {Object} handlers
 */
export function renderPopover(host, handlers) {
  return html`
    <div
      class="TDesign-docsearch-popover ${host.open ? 'is-open' : ''}"
      id="TDesign-docsearch-popover"
      role="dialog"
      aria-label=${host.dialogLabel}
    >
      <div class="TDesign-docsearch-popover__body">${renderPopoverBody(host, handlers)}</div>
    </div>
  `;
}
