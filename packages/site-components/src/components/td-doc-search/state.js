/**
 * td-doc-search —— 状态层
 *
 * 这里集中了所有"与 DOM/渲染无关，只读写 host 响应式属性"的逻辑：
 *   - 小工具（interp / flattenGroups / computeView）
 *   - 状态变更（applyGroups / setActiveCategory / resetToRecent / moveSelection / moveCategory）
 *   - 搜索调度（debouncedSearch / runSearch）
 *
 * 所有函数的第一参 host 都是 hybrids 组件实例，改它上面的 _groups / _flatHits /
 * _currentIndex / _loading 等 property 会自动触发 re-render，这是我们驱动视图的核心。
 * 本文件 **不** 生成任何 html`` 片段，也不查询 DOM（唯一例外是 scrollActiveIntoView，
 * 因为它天然就是"修改 DOM scroll 位置"的副作用）。
 */

import { searchAlgolia, groupHits, formatHit } from './algolia.js';
import { listRecent } from './recent.js';
import { DEBOUNCE_MS, VIEW } from './constants.js';

/* ------------------------------------------------------------------ *
 * 工具
 * ------------------------------------------------------------------ */

/**
 * 简单模板占位替换。
 *   interp('没有找到 "{query}" 相关结果', { query: 'button' })
 *   => '没有找到 "button" 相关结果'
 * 只替换形如 {name} 的单词占位符；未命中的占位会被替换成空串，避免把原模板字样泄露到 UI。
 *
 * @param {string} tmpl 模板串
 * @param {Record<string,string|number>} vars 替换字典
 * @returns {string}
 */
export function interp(tmpl, vars) {
  return String(tmpl).replace(/\{(\w+)\}/g, (_, k) => (vars && k in vars ? String(vars[k]) : ''));
}

/**
 * 把分组后的 hits 按"当前激活分类"拍平为一维 hit 数组。
 * 右栏的展示顺序就是这个数组的顺序；键盘 ArrowUp/Down 也按它来移动 _currentIndex。
 *
 * 优先读取 groupHits 阶段缓存在 item.__formatted 上的格式化结果，
 * 仅在极少数情况下（外部直接构造 groups）回退到现场调用 formatHit。
 *
 * @param {Array<{key:string,title:string,items:Array}>} groups  已分组的 Algolia hits
 * @param {string|null} activeKey  当前激活的分类 key；为空则拍平所有分组
 * @returns {Array<{url:string,title:string,subtitle:string,breadcrumb:string}>}
 */
export function flattenGroups(groups, activeKey) {
  const visible = activeKey ? groups.filter((g) => g.key === activeKey) : groups;
  const out = [];
  for (const g of visible) {
    for (const h of g.items) {
      const f = h.__formatted || formatHit(h);
      out.push({ url: f.url, title: f.title, subtitle: f.subtitle, breadcrumb: f.breadcrumb });
    }
  }
  return out;
}

/**
 * 根据四个输入决定当前应展示哪一种视图形态。
 * 所有 UI 切换都由 computeView 单点决定，避免在渲染函数里散落 if/else。
 *
 * 决策优先级：
 *   loading + query
 *     → 有 groups 快照：LOADING_RESULTS （继续展示旧结果 + spinner，避免闪空）
 *     → 无 groups 快照：LOADING_PLACEHOLDER（展示"正在搜索 xxx…"）
 *   有 query → groups.length ? RESULTS : EMPTY
 *   无 query → recent.length ? RECENT  : INITIAL
 *
 *   （loading 且 无 query 的组合实际不会命中——onTriggerInput 空串时会直接 _loading=false）
 *
 * @param {{query:string, loading:boolean, groups:Array, recent:Array}} s
 * @returns {typeof VIEW[keyof typeof VIEW]}
 */
export function computeView({ query, loading, groups, recent }) {
  if (loading && query) {
    return groups && groups.length ? VIEW.LOADING_RESULTS : VIEW.LOADING_PLACEHOLDER;
  }
  if (query) return groups && groups.length ? VIEW.RESULTS : VIEW.EMPTY;
  if (recent && recent.length) return VIEW.RECENT;
  return VIEW.INITIAL;
}

/* ------------------------------------------------------------------ *
 * 状态变更（修改 host 上的响应式属性）
 * ------------------------------------------------------------------ */

/**
 * 应用一批新的搜索结果分组到 host。
 * 同时维护 _activeKey（若当前 key 在新 groups 中不存在，重置到首个分组）
 * 以及 _flatHits / _currentIndex（重置到第 1 项）。
 *
 * @param {HTMLElement} host
 * @param {Array<{key:string,title:string,items:Array}>} groups
 */
export function applyGroups(host, groups) {
  host._groups = groups || [];
  if (!host._activeKey || !host._groups.some((g) => g.key === host._activeKey)) {
    host._activeKey = host._groups[0]?.key || null;
  }
  host._flatHits = flattenGroups(host._groups, host._activeKey);
  host._currentIndex = 0;
}

/**
 * 切换当前激活分类。
 * 若目标 key 非法或与当前相同则直接返回，避免多余 re-render。
 * 切换后 _flatHits 会重新拍平，_currentIndex 回到第 1 项，且当前高亮项会被滚入可视区。
 *
 * @param {HTMLElement} host
 * @param {string} key 目标分类 key
 */
export function setActiveCategory(host, key) {
  if (!key || key === host._activeKey) return;
  host._activeKey = key;
  host._flatHits = flattenGroups(host._groups, host._activeKey);
  host._currentIndex = 0;
  scrollActiveIntoView(host);
}

/**
 * 把 popover 切回"最近搜索 / 空态"视图。
 * 会：清空搜索结果、重新从 localStorage 读最近搜索、把 _flatHits 指向最近搜索列表
 * （这样键盘 Up/Down 在最近搜索里同样生效）。
 *
 * @param {HTMLElement} host
 */
export function resetToRecent(host) {
  host._groups = [];
  host._activeKey = null;
  host._recent = listRecent();
  host._flatHits = host._recent.map((r) => ({
    url: r.url,
    title: r.title,
    breadcrumb: r.breadcrumb,
  }));
  host._currentIndex = 0;
}

/**
 * 键盘 Up/Down 的公共实现：循环移动 _currentIndex。
 * 若 _flatHits 为空则是 no-op（此时不会有高亮项可移动）。
 *
 * @param {HTMLElement} host
 * @param {1|-1} delta  +1 下移 / -1 上移
 */
export function moveSelection(host, delta) {
  const total = host._flatHits.length;
  if (!total) return;
  host._currentIndex = (host._currentIndex + delta + total) % total;
  scrollActiveIntoView(host);
}

/**
 * Alt + ←/→：在分类间循环切换。
 * 只有 2 个以上分类时才有意义。
 *
 * @param {HTMLElement} host
 * @param {1|-1} delta
 */
export function moveCategory(host, delta) {
  const groups = host._groups || [];
  if (groups.length < 2) return;
  const idx = groups.findIndex((g) => g.key === host._activeKey);
  const next = groups[(idx + delta + groups.length) % groups.length];
  if (next) setActiveCategory(host, next.key);
}

/**
 * 把当前高亮项（.is-active）滚入可视区。
 * 延迟到下一帧执行，确保 hybrids 已经把最新的 class 落到 DOM 上。
 * 注意：这是本文件里唯一一处访问 DOM 的副作用。
 *
 * @param {HTMLElement} host
 */
export function scrollActiveIntoView(host) {
  requestAnimationFrame(() => {
    const root = host.shadowRoot;
    if (!root) return;
    const el = root.querySelector('.TDesign-docsearch-hit.is-active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  });
}

/* ------------------------------------------------------------------ *
 * 搜索调度
 * ------------------------------------------------------------------ */

/**
 * 对 runSearch 做防抖封装。
 * 每次调用都会重置上一个 timer，DEBOUNCE_MS 内的连续按键只会触发最后一次请求。
 *
 * @param {HTMLElement} host
 * @param {string} query
 */
export function debouncedSearch(host, query) {
  if (host._debounceTimer) clearTimeout(host._debounceTimer);
  host._debounceTimer = setTimeout(() => runSearch(host, query), DEBOUNCE_MS);
}

/**
 * 真正执行一次 Algolia 查询。
 * - 空 query：回退到"最近搜索"视图
 * - 非空 query：abort 上一次未完成的请求（防止慢响应覆盖快响应），发起新请求，期间 _loading=true
 * - AbortError：静默忽略（这是"主动取消"的正常路径）
 * - 其它错误：applyGroups([]) 让视图落到 EMPTY，避免卡在 loading
 *
 * Algolia 的 appId / apiKey / indexName / urlFilter / hitsPerPage 全部从 host 的
 * attribute 派生，未显式配置时使用各自的 DEFAULT_* 后备值。
 *
 * @param {HTMLElement} host
 * @param {string} query
 */
export async function runSearch(host, query) {
  const q = (query || '').trim();
  if (!q) {
    host._loading = false;
    resetToRecent(host);
    return;
  }

  if (host._abort) host._abort.abort();
  host._abort = new AbortController();
  host._loading = true;

  try {
    const hits = await searchAlgolia({
      query: q,
      signal: host._abort.signal,
      appId: host.appId,
      apiKey: host.apiKey,
      indexName: host.indexName,
      urlFilter: host.urlFilter,
      hitsPerPage: host.hitsPerPage,
    });
    // 请求返回前可能已被新的查询打断，此时不应再落盘
    if (host._abort.signal.aborted) return;
    host._loading = false;
    applyGroups(host, groupHits(hits));
  } catch (err) {
    if (err?.name === 'AbortError') return;
    host._loading = false;
    applyGroups(host, []);
  }
}
