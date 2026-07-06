/* eslint-disable */

// 重新生成 packages/theme-generator/src/styles/tdesign.min.css
// 数据来源：上游 tdesign-vue-next 的 dist（已压缩，包含全量组件 + token CSS）
// 在此基础上做两处定制：
//   1. 为每个 :root 选择器追加 :host 变体（Web Component 兼容，
//      使声明同时作用于 light DOM 与 shadow DOM）。
//   2. 移除所有 --td-brand-color* token 定义，让主题生成器
//      同步宿主页的外部品牌色阶，而不是覆盖它。var(--td-brand-color-*)
//      的「使用处」保留（如 --td-text-color-brand: var(--td-brand-color-7)），
//      它们会解析为宿主页定义的值。
//
// 运行：npm run build:css
// 升级 tdesign-vue-next 后需重新运行以从新上游重新生成。
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(__dirname, '..');
const SRC = resolve(PKG, 'node_modules/tdesign-vue-next/dist/tdesign.min.css');
const OUT = resolve(PKG, 'src/styles/tdesign.min.css');

let css = readFileSync(SRC, 'utf8');

// --- (1) 为每个选择器组中的 :root 选择器追加 :host 变体 ---
// 上游压缩后的 CSS 使用形如 `:root,:root[theme-mode='light']{...}` 的选择器组。
// 对每个以 :root 开头的选择器，追加并行的 :host 变体，使用函数式 `:host(<tail>)`。
// Chrome 不会匹配复合形式 `:host[attr]` 或 `:host.class`，
// 只有 `:host([attr])` / `:host(.class)` 才能命中 host 的属性/类。
// 裸 `:root` 转为裸 `:host`（无括号）。上游不存在 `:root <后代>` 规则。
// @-moz-document url-prefix() 等 at-rule 没有 :root 选择器，原样透传。
css = css.replace(/([^{}]+)\{/g, (m, selectors) => {
  const list = selectors.split(',').map((s) => s.trim()).filter(Boolean);
  const hostVariants = list
    .filter((s) => /^:root(?=[[\].\s,:]|$)/.test(s))
    .map((s) => {
      const tail = s.slice(':root'.length);
      return tail ? `:host(${tail})` : ':host';
    });
  if (hostVariants.length === 0) return m;
  return `${list.join(',')},${hostVariants.join(',')}{`;
});

// --- (2) 移除 --td-brand-color* 自定义属性声明 ---
// 匹配基础名（--td-brand-color）和派生/编号系列
// （--td-brand-color-1、--td-brand-color-hover ...）。
// 不会匹配 --td-text-color-brand / --td-text-color-link（前缀不同）。
// 上游压缩形态为 `--td-brand-color-1:#f2f3ff;`（无空格，分号结尾）。
// [^;}]* 在下一个 ; 或 } 处停止，因此不会越过下一条声明。
css = css.replace(/--td-brand-color[a-z0-9-]*\s*:[^;}]*;?/g, '');

// --- (3) 移除 source-map 注释（不发布 .map 文件） ---
css = css.replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '');

writeFileSync(OUT, css + '\n', 'utf8');

// --- 校验输出 ---
const brandColorDefs = (css.match(/--td-brand-color[a-z0-9-]*\s*:/g) || []).length;
const hostCount = (css.match(/:host/g) || []).length;
const rootCount = (css.match(/:root/g) || []).length;
const textColorBrand = /--td-text-color-brand\s*:/.test(css);
console.log(JSON.stringify({
  outBytes: css.length,
  brandColorDefsRemoved: brandColorDefs === 0,
  brandColorDefsRemaining: brandColorDefs,
  hostSelectors: hostCount,
  rootSelectors: rootCount,
  textColorBrandKept: textColorBrand,
}, null, 2));
