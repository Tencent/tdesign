/**
 * 组件内部共用工具
 */

/**
 * 把含 HTML 标签与基础实体的字符串剥成纯文本。
 * 用于：
 *  - recent 存储（防止 <mark> 高亮随关键词跨会话残留）
 *  - formatHit 构建面包屑时比较层级文本
 */
export function stripHtml(str) {
  if (str == null) return '';
  const s = String(str);
  if (s.indexOf('<') === -1 && s.indexOf('&') === -1) return s;
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
