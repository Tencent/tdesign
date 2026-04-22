/**
 * 最近搜索记录 —— 基于 localStorage
 * 存储结构：{ query, url, title, breadcrumb, ts }[]
 *
 * 注意：title / breadcrumb 一律存**纯文本**（不带 <mark> 等 HTML），
 * 避免跨会话在列表里残留当时搜索关键词的高亮。
 */

import { stripHtml } from './utils.js';

const STORAGE_KEY = 'td-docsearch:recent';
const MAX_ITEMS = 5;

function safeRead() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function safeWrite(list) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch (_) {
    /* noop */
  }
}

/**
 * 读取最近搜索。对历史数据做一次性兼容：若某条记录的 title/breadcrumb 还含有 HTML，
 * 就地 strip 一次再返回（不重写存储，交由下一次 addRecent 自然覆盖）。
 */
export function listRecent() {
  const list = safeRead();
  let mutated = false;
  const cleaned = list.map((item) => {
    const title = stripHtml(item?.title);
    const breadcrumb = stripHtml(item?.breadcrumb);
    if (title !== item?.title || breadcrumb !== item?.breadcrumb) mutated = true;
    return { ...item, title, breadcrumb };
  });
  // 顺手把纯文本版本写回，消除旧数据残留
  if (mutated) safeWrite(cleaned);
  return cleaned;
}

export function addRecent(record) {
  if (!record || !record.url) return;
  const list = safeRead();
  const normalized = {
    query: stripHtml(record.query),
    url: record.url,
    title: stripHtml(record.title),
    breadcrumb: stripHtml(record.breadcrumb),
    ts: Date.now(),
  };
  const next = [normalized, ...list.filter((x) => x.url !== normalized.url)].slice(0, MAX_ITEMS);
  safeWrite(next);
  return next;
}

export function removeRecent(url) {
  const list = safeRead();
  const next = list.filter((x) => x.url !== url);
  safeWrite(next);
  return next;
}
