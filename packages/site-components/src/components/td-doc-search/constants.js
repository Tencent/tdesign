/**
 * td-doc-search —— 共享常量
 *
 * 本文件只放"与业务/渲染都无关的纯常量"。
 * 任何需要根据状态计算出来的派生值都应放到 state.js。
 */

/**
 * 搜索输入的 debounce 时长（毫秒）。
 * 用户每次键入后，经过该时长没有再次输入，才触发一次 Algolia 请求。
 * 取值偏短是因为 Algolia 响应本身很快，过长会显得"输入不跟手"。
 */
export const DEBOUNCE_MS = 150;

/**
 * 视图枚举（popover 的 6 种可视化形态）。
 * - INITIAL              首次打开且无输入、无最近搜索：展示"开始搜索"引导文案
 * - RECENT               首次打开且无输入、有最近搜索：展示最近搜索列表
 * - LOADING_RESULTS      正在请求 Algolia 且有上一次的 groups 快照：继续展示 groups（spinner 在 input 后缀）
 * - LOADING_PLACEHOLDER  正在请求 Algolia 但无可复用快照：展示"正在搜索 xxx…"占位
 * - RESULTS              有输入且有结果：两栏（分类 + 命中项）
 * - EMPTY                有输入但无结果：展示"没有找到 xxx 相关结果"
 *
 * LOADING 被拆成 LOADING_RESULTS / LOADING_PLACEHOLDER 两种，是为了让"搜索中应该展示什么"
 * 的决策在 computeView 内部收口，而不是渲染层再做一次 if/else。
 */
export const VIEW = {
  INITIAL: 'initial',
  RECENT: 'recent',
  LOADING_RESULTS: 'loading_results',
  LOADING_PLACEHOLDER: 'loading_placeholder',
  RESULTS: 'results',
  EMPTY: 'empty',
};
