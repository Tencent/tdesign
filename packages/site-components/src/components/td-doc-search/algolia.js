/**
 * Algolia Search REST API 封装
 * 只做数据查询，UI 层完全由本组件自己实现（不依赖 Algolia 官方的 DocSearch UI 库）
 *
 * 关键配置（appId / apiKey / indexName / urlFilter / hitsPerPage）
 * 均通过参数传入；此处仅给出默认后备值，方便脱离 WebComponent 单独调用。
 */

import { stripHtml } from './utils.js';

// 默认后备值（供独立调用 / 未配置时使用）
export const DEFAULT_APP_ID = 'ALGOLIA_APP_ID';
export const DEFAULT_API_KEY = 'ALGOLIA_API_KEY';
export const DEFAULT_INDEX_NAME = 'tdesign.tencent.com';
export const DEFAULT_HITS_PER_PAGE = 20;

/**
 * 从当前页面 URL 推断 urlFilter。
 * 匹配 pathname 中第一段路径，如 `/vue-next/`、`/react/`、`/miniprogram/` 等。
 * 找不到则返回 `'/'` 表示不做框架级过滤。
 */
export function getDefaultUrlFilter() {
  try {
    const match = window.location.pathname.match(/^\/([^/]+)\//);
    return match ? `/${match[1]}/` : '/';
  } catch {
    return '/';
  }
}

const HIGHLIGHT_PRE_TAG = '<mark class="TDesign-docsearch-mark">';
const HIGHLIGHT_POST_TAG = '</mark>';

/**
 * 调用 Algolia REST Search API
 * @param {Object}      options
 * @param {string}      options.query                查询词
 * @param {AbortSignal} [options.signal]             取消信号
 * @param {string}      [options.appId]              Algolia Application ID
 * @param {string}      [options.apiKey]             Algolia Search-Only API Key
 * @param {string}      [options.indexName]          索引名
 * @param {string}      [options.urlFilter]          仅保留 url 中包含该子串的命中；空串表示不过滤；默认从当前页面 URL 推断
 * @param {number}      [options.hitsPerPage=20]
 * @returns {Promise<Array>} hits
 */
export async function searchAlgolia({
  query,
  signal,
  appId = DEFAULT_APP_ID,
  apiKey = DEFAULT_API_KEY,
  indexName = DEFAULT_INDEX_NAME,
  urlFilter = getDefaultUrlFilter(),
  hitsPerPage = DEFAULT_HITS_PER_PAGE,
} = {}) {
  const q = (query || '').trim();
  if (!q) return [];

  const endpoint = `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(indexName)}/query`;

  const body = {
    params: new URLSearchParams({
      query: q,
      hitsPerPage: String(hitsPerPage),
      attributesToRetrieve: JSON.stringify(['hierarchy', 'content', 'anchor', 'url', 'type']),
      attributesToSnippet: JSON.stringify([
        'hierarchy.lvl1:10',
        'hierarchy.lvl2:10',
        'hierarchy.lvl3:10',
        'hierarchy.lvl4:10',
        'hierarchy.lvl5:10',
        'hierarchy.lvl6:10',
        'content:10',
      ]),
      snippetEllipsisText: '…',
      highlightPreTag: HIGHLIGHT_PRE_TAG,
      highlightPostTag: HIGHLIGHT_POST_TAG,
    }).toString(),
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) throw new Error(`Algolia ${res.status}`);

    const data = await res.json();
    const hits = Array.isArray(data?.hits) ? data.hits : [];

    if (!urlFilter) return hits;
    return hits.filter((item) => {
      const url = item?.url || '';
      return url.includes(urlFilter);
    });
  } catch (err) {
    if (err && err.name === 'AbortError') throw err;
    // eslint-disable-next-line no-console
    console.warn('[td-doc-search] search failed:', err && err.message);
    return [];
  }
}

/**
 * 按 hierarchy.lvl1（优先）或 lvl0 分组。
 *
 * 每组的 title 使用"命中项中高亮版本的同层级值"（含 <mark>）——同组内多个 hit
 * 的纯文本一致，但高亮情况可能不同，因此遍历整组挑出"确实带 <mark> 的那一个"
 * 作为 title；若整组都未命中该层级，则退化为纯文本，再退化为 key。
 *
 * 每个 hit 在入组时会顺手缓存一次 formatHit 结果到 item.__formatted，
 * 避免 flattenGroups / setActiveCategory 每次切换分类都重新格式化。
 *
 * @param {Array} hits
 * @returns {Array<{ key: string, title: string, items: Array }>}
 */
export function groupHits(hits = []) {
  const map = new Map();
  // 外部记录：key -> 是否已锁定到带 <mark> 的高亮 title
  const locked = new Map();

  for (const item of hits) {
    const h = item?.hierarchy || {};
    // 分组标题取自哪一层级——lvl1 优先
    const level = h.lvl1 ? 'lvl1' : 'lvl0';
    const key = h[level] || 'Other';

    if (!map.has(key)) map.set(key, { key, title: key, items: [] });
    const g = map.get(key);
    // 顺便缓存 formatHit 结果，后续 flattenGroups 直接读
    item.__formatted = formatHit(item);
    g.items.push(item);

    // 升级 title：优先带 <mark> 的高亮值，其次纯文本
    if (!locked.get(key)) {
      const hl = item?._highlightResult?.hierarchy?.[level]?.value;
      if (hl && hl.indexOf('<mark') !== -1) {
        g.title = hl;
        locked.set(key, true);
      } else if (hl && g.title === key) {
        g.title = hl; // 纯文本的高亮版（无 <mark>）也比 raw key 好，至少走同一渲染路径
      }
    }
  }
  return Array.from(map.values());
}

/**
 * 从 hit 中拿到用于展示的数据
 * - title      命中项的最深层级（用 _highlightResult 保留 <mark>）
 * - subtitle   次深层级（用于右栏第二行；若命中的是 content，则 subtitle = content 片段）
 * - breadcrumb 祖先路径（给"最近搜索"等场景使用，纯文本）
 * - snippet    content 命中时的正文片段
 */
export function formatHit(hit) {
  if (!hit) return { title: '', subtitle: '', breadcrumb: '', snippet: '', url: '' };
  const h = hit.hierarchy || {};
  const hlHierarchy = hit._highlightResult?.hierarchy || {};
  const snippetHierarchy = hit._snippetResult?.hierarchy || {};
  const contentHl = hit._snippetResult?.content?.value || hit._highlightResult?.content?.value || hit.content || '';

  const levels = ['lvl0', 'lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'];

  // 拿到某一 level 的展示值，优先高亮版
  const pickLevel = (lv) => hlHierarchy[lv]?.value || snippetHierarchy[lv]?.value || h[lv] || '';

  // 找出实际存在的层级数组（从深到浅）
  const existing = levels.filter((lv) => !!h[lv]);

  let title = '';
  let subtitle = '';

  if (hit.type === 'content' && existing.length) {
    // content 类型：title = 当前页面的最深层级（页面标题），subtitle = content 片段
    const deepest = existing[existing.length - 1];
    title = pickLevel(deepest);
    subtitle = contentHl;
  } else if (existing.length >= 2) {
    const deepest = existing[existing.length - 1];
    const parent = existing[existing.length - 2];
    title = pickLevel(deepest);
    subtitle = pickLevel(parent);
  } else if (existing.length === 1) {
    title = pickLevel(existing[0]);
    subtitle = '';
  }

  // 构建上级面包屑（去掉主标题这一层）——保留给"最近搜索"列表使用
  const crumbs = [];
  for (const lv of levels) {
    const v = h[lv];
    if (!v) continue;
    if (v === stripHtml(title)) break;
    crumbs.push(v);
  }

  return {
    title,
    subtitle,
    breadcrumb: crumbs.join(' › '),
    snippet: hit.type === 'content' ? contentHl : '',
    url: hit.url || '',
    type: hit.type || 'content',
  };
}
