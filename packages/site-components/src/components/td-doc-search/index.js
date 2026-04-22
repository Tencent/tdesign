/**
 * td-doc-search —— 组件入口（hybrids WebComponent）
 *
 * 本文件只负责"粘合"，不做具体业务。模块划分如下：
 *   - constants.js  共享常量（VIEW 枚举 / 防抖 ms）
 *   - algolia.js    Algolia REST 封装 + hit 格式化
 *   - recent.js     localStorage 最近搜索记录
 *   - hotkeys.js    全局快捷键（Cmd/Ctrl+K、/ 打开；Esc 关闭）
 *   - state.js      计算 + 改 host 响应式属性（搜索、分类、选中、防抖等）
 *   - views.js      纯渲染片段，接受 handlers 注入事件
 *   - index.js      事件 handler + hybrids define（组件属性与生命周期）
 *
 * 数据流：
 *   用户输入 / 快捷键 → index.js 的 handler → state.js 的状态变更函数
 *                  → 修改 host 的响应式 property → hybrids 自动重渲染
 *                  → views.js 根据最新 host 输出 html``
 */

import { define, html } from 'hybrids';

import style from './style.less?inline';
import {
  DEFAULT_APP_ID,
  DEFAULT_API_KEY,
  DEFAULT_INDEX_NAME,
  getDefaultUrlFilter,
  DEFAULT_HITS_PER_PAGE,
} from './algolia.js';
import { listRecent, addRecent, removeRecent } from './recent.js';
import { registerHotkeys } from './hotkeys.js';
import { debouncedSearch, moveSelection, moveCategory, resetToRecent, setActiveCategory } from './state.js';
import { renderTrigger, renderPopover } from './views.js';

/* ------------------------------------------------------------------ *
 * 事件 handler —— 把"用户动作"翻译为"状态变更"
 *
 * 约定：所有 handler 第一参都是 host；不访问 DOM 选择器（getInput 例外）；
 * 只调用 state.js / recent.js 中的纯函数来修改 host 响应式状态。
 * ------------------------------------------------------------------ */

/** 获取 Shadow DOM 内的输入框元素（用于聚焦）。 */
function getInput(host) {
  return host.shadowRoot?.querySelector('.TDesign-docsearch-trigger__input') || null;
}

/** 打开 popover（幂等）。 */
function openPopover(host) {
  if (!host.open) host.open = true;
}

/** 关闭 popover（幂等）。 */
function closePopover(host) {
  if (host.open) host.open = false;
}

/**
 * 选中某条 hit 后执行跳转：先落入"最近搜索"，再关闭 popover，最后导航。
 * 注意写入最近搜索必须发生在跳转**之前**——跳转会卸载页面，异步写入会丢失。
 */
function navigateTo(host, hit) {
  if (!hit?.url) return;
  addRecent({
    query: host._query,
    url: hit.url,
    title: hit.title,
    breadcrumb: hit.breadcrumb,
  });
  closePopover(host);
  window.location.href = hit.url;
}

/** input 的 focus 事件：打开 popover。 */
function onTriggerFocus(host) {
  openPopover(host);
}

/**
 * input 的 input 事件：
 *   - 打开 popover
 *   - 更新查询词
 *   - 立刻把 _loading 置为 true（避免"输入 → 等防抖"期间闪现空态）
 *     空 query 走 resetToRecent 回到最近搜索视图
 *   - 触发防抖搜索
 */
function onTriggerInput(host, e) {
  openPopover(host);
  const value = e.target.value;
  host._query = value;
  if (value.trim()) {
    host._loading = true;
  } else {
    host._loading = false;
    resetToRecent(host);
  }
  debouncedSearch(host, value);
}

/**
 * input 的 keydown 事件：统一处理所有"在输入框聚焦时"的键盘行为。
 *   - Escape           关闭 popover
 *   - ArrowDown(关)    打开 popover（不移动选中）
 *   - ArrowDown(开)    下移一项
 *   - ArrowUp(开)      上移一项
 *   - Alt + ←/→(开)   切换分类
 *   - Enter(开)        对当前选中项执行 navigateTo
 */
function onTriggerKeyDown(host, e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closePopover(host);
    return;
  }
  if (!host.open) {
    if (e.key === 'ArrowDown') openPopover(host);
    return;
  }
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      moveSelection(host, 1);
      return;
    case 'ArrowUp':
      e.preventDefault();
      moveSelection(host, -1);
      return;
    case 'ArrowLeft':
    case 'ArrowRight':
      if (e.altKey && host._groups?.length > 1) {
        e.preventDefault();
        moveCategory(host, e.key === 'ArrowRight' ? 1 : -1);
      }
      return;
    case 'Enter': {
      const hit = host._flatHits?.[host._currentIndex];
      if (hit?.url) {
        e.preventDefault();
        navigateTo(host, hit);
      }
      return;
    }
    default:
  }
}

/** 点击某条 hit 链接：阻止默认，走统一的 navigateTo。 */
function onHitClick(host, hit, e) {
  e.preventDefault();
  navigateTo(host, hit);
}

/** 点击左栏某个分类：切换激活分类，并把焦点保留在输入框上（继续键盘操作）。 */
function onCategoryClick(host, key, e) {
  e.preventDefault();
  setActiveCategory(host, key);
  getInput(host)?.focus();
}

/** 点击最近搜索项的"移除"按钮：删除该条后刷新最近搜索列表。 */
function onRemoveRecent(host, url, e) {
  e.preventDefault();
  e.stopPropagation();
  removeRecent(url);
  resetToRecent(host);
}

/** 传给 views.js 的 handlers 包。独立出来避免 render 每次重建对象。 */
const HANDLERS = {
  onTriggerFocus,
  onTriggerInput,
  onTriggerKeyDown,
  onHitClick,
  onCategoryClick,
  onRemoveRecent,
};

/**
 * 生成一个"attribute 可覆盖、未设置时走默认文案"的 hybrids property 描述符。
 * @param {string} defaultValue 未显式设置 attribute 时返回的默认值
 */
const stringProp = (defaultValue) => ({
  get: (_h, v) => v || defaultValue,
  set: (_h, v) => v,
});

/* ------------------------------------------------------------------ *
 * 组件定义
 *
 * 下面这些 property 分三类：
 *   1) Algolia 配置    —— 外部可通过 attribute 覆盖；未设置时用 DEFAULT_*
 *   2) 文案            —— 同样 attribute 可覆盖；未设置时中文默认
 *   3) 内部状态（_xxx）—— 组件自用，hybrids property 化以获得自动 re-render
 * ------------------------------------------------------------------ */

export default define({
  tag: 'td-doc-search',

  // ---------- 1) Algolia 配置 ----------
  appId: stringProp(DEFAULT_APP_ID),
  apiKey: stringProp(DEFAULT_API_KEY),
  indexName: stringProp(DEFAULT_INDEX_NAME),
  // urlFilter 特殊：显式传空串 "" 应被视为"关闭过滤"，所以用 == null 判空而非 || 短路
  urlFilter: { get: (_h, v) => (v == null ? getDefaultUrlFilter() : v), set: (_h, v) => v },
  hitsPerPage: {
    get: (_h, v) => (v != null && v !== '' ? Number(v) : DEFAULT_HITS_PER_PAGE),
    set: (_h, v) => v,
  },

  // ---------- 2) 文案 ----------
  placeholder: stringProp('搜索文档'),
  recentTitle: stringProp('最近搜索'),
  emptyTitle: stringProp('输入关键词开始搜索'),
  emptyDesc: stringProp('查找组件、API、指南等文档内容'),
  noResultTitle: stringProp('没有找到 "{query}" 相关结果'),
  noResultDesc: stringProp('试试其它关键词，或检查拼写'),
  loadingTitle: stringProp('正在搜索 "{query}"…'),
  loadingDesc: stringProp('稍等片刻'),
  removeLabel: stringProp('移除'),
  dialogLabel: stringProp('搜索结果'),
  categoryLabel: stringProp('分类'),
  resultLabel: stringProp('结果'),

  // ---------- 3) 内部状态 ----------
  _query: { get: (_h, v) => v || '', set: (_h, v) => v },
  _loading: { get: (_h, v) => Boolean(v), set: (_h, v) => Boolean(v) },
  _groups: { get: (_h, v) => v || [], set: (_h, v) => v || [] },
  _activeKey: { get: (_h, v) => (v == null ? null : v), set: (_h, v) => v },
  _flatHits: { get: (_h, v) => v || [], set: (_h, v) => v || [] },
  _currentIndex: {
    get: (_h, v) => (Number.isFinite(v) ? v : 0),
    set: (_h, v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    },
  },
  _recent: { get: (_h, v) => v || [], set: (_h, v) => v || [] },

  // ---------- open 属性 + 生命周期 ----------
  /**
   * open 既是对外 property，也挂载组件生命周期（注册/注销快捷键、点击外部关闭）。
   * observe 里还兼做"每次打开时刷新最近搜索"。
   */
  open: {
    get: (_host, lastValue) => Boolean(lastValue),
    set: (_host, value) => Boolean(value),
    connect: (host) => {
      // 初始最近搜索填充
      host._recent = listRecent();

      // 全局快捷键：Cmd/Ctrl+K、/、Esc
      const unregister = registerHotkeys({
        onOpen: () => {
          openPopover(host);
          requestAnimationFrame(() => getInput(host)?.focus());
        },
        onClose: () => closePopover(host),
      });

      // 点击 host 之外的任意位置：关闭 popover
      // 使用 composedPath 以穿透 Shadow DOM 边界
      const onDocMouseDown = (e) => {
        const path = e.composedPath ? e.composedPath() : [];
        if (!path.includes(host)) closePopover(host);
      };
      document.addEventListener('mousedown', onDocMouseDown, true);

      // disconnect 时清理：快捷键、全局监听、未完成的防抖/请求
      return () => {
        unregister?.();
        document.removeEventListener('mousedown', onDocMouseDown, true);
        if (host._debounceTimer) {
          clearTimeout(host._debounceTimer);
          host._debounceTimer = null;
        }
        if (host._abort) {
          host._abort.abort();
          host._abort = null;
        }
      };
    },
    observe: (host, value) => {
      // 每次打开且无查询词时，刷新一次最近搜索（避免别的 tab 改过 localStorage 后此处不同步）
      if (value && !host._query) resetToRecent(host);
    },
  },

  // 最终渲染：trigger 始终在；popover 作为模板一部分，由 host.open 控制显隐
  render: (host) => html`${renderTrigger(host, HANDLERS)}${renderPopover(host, HANDLERS)}`.css`${style}`,
});
