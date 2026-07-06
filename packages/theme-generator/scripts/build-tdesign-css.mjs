/* eslint-disable */

// 重新生成 packages/theme-generator/src/styles/ 下的两个 CSS 文件：
//   1. tdesign.min.css —— 全量组件 + token CSS，定制 :host 变体 + 移除 brand-color token
//   2. reset.min.css   —— normalize.css 重置样式，仅压缩，无定制
//
// 数据来源：上游 tdesign-vue-next 的 dist 目录。
// tdesign.min.css 上游已压缩，reset.css 上游未压缩，本脚本对后者做压缩。
//
// 运行：npm run build:css
// 升级 tdesign-vue-next 后需重新运行以从新上游重新生成。
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(__dirname, '..');
const DIST = resolve(PKG, 'node_modules/tdesign-vue-next/dist');
const STYLES = resolve(PKG, 'src/styles');

// ========== tdesign.min.css ==========
let tdesignCss = readFileSync(resolve(DIST, 'tdesign.min.css'), 'utf8');

// --- (1) 为每个选择器组中的 :root 选择器追加 :host 变体 ---
// 上游压缩后的 CSS 使用形如 `:root,:root[theme-mode='light']{...}` 的选择器组。
// 对每个以 :root 开头的选择器，追加并行的 :host 变体，使用函数式 `:host(<tail>)`。
// Chrome 不会匹配复合形式 `:host[attr]` 或 `:host.class`，
// 只有 `:host([attr])` / `:host(.class)` 才能命中 host 的属性/类。
// 裸 `:root` 转为裸 `:host`（无括号）。上游不存在 `:root <后代>` 规则。
// @-moz-document url-prefix() 等 at-rule 没有 :root 选择器，原样透传。
tdesignCss = tdesignCss.replace(/([^{}]+)\{/g, (m, selectors) => {
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
tdesignCss = tdesignCss.replace(/--td-brand-color[a-z0-9-]*\s*:[^;}]*;?/g, '');

// --- (3) 移除 source-map 注释（不发布 .map 文件） ---
tdesignCss = tdesignCss.replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '');

writeFileSync(resolve(STYLES, 'tdesign.min.css'), tdesignCss + '\n', 'utf8');

// ========== reset.min.css ==========
// 上游 reset.css 是带注释的未压缩 normalize.css，无 :root 选择器、无 brand-color token，
// 因此不需要 tdesign.min.css 的两步定制，仅做压缩。
const resetCss = minifyCss(readFileSync(resolve(DIST, 'reset.css'), 'utf8'));
writeFileSync(resolve(STYLES, 'reset.min.css'), resetCss + '\n', 'utf8');

// ========== generator-vars.css ==========
// 生成器专用变量（vars.css）原通过 initGeneratorVars 注入 document.head（Light DOM），
// 但生成器 UI 运行在 Shadow DOM 中，CSS 自定义属性不穿透 Shadow Boundary。
// 这里把 vars.css 的 :root 选择器转为 :host 变体，生成 generator-vars.css，
// 由 wc-entry.js 以 ?inline 导入并注入 Shadow Root。
// 转换规则与 tdesign.min.css 的 :host 变体逻辑一致：
//   :root                  → :host
//   :root[theme-mode='x']  → :host([theme-mode='x'])
//   :root.dark             → :host(.dark)
const VARS_SRC = resolve(PKG, 'src/common/themes/built-in/css/vars.css');
let generatorVars = readFileSync(VARS_SRC, 'utf8');
generatorVars = generatorVars.replace(/([^{}]+)\{/g, (m, selectors) => {
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
writeFileSync(resolve(STYLES, 'generator-vars.css'), generatorVars + '\n', 'utf8');

// --- 压缩 CSS（仅用于 reset.css） ---
// 移除注释 → 折叠空白 → 压缩标点周围空白 → 移除 } 前的分号。
// 不改动选择器与值本身（保留 -webkit- 前缀、字体名引号等上游原始形态）。
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

// ========== 校验输出 ==========
const brandColorDefs = (tdesignCss.match(/--td-brand-color[a-z0-9-]*\s*:/g) || []).length;
const hostCount = (tdesignCss.match(/:host/g) || []).length;
const rootCount = (tdesignCss.match(/:root/g) || []).length;
const textColorBrand = /--td-text-color-brand\s*:/.test(tdesignCss);
const varsHostCount = (generatorVars.match(/:host/g) || []).length;
console.log(JSON.stringify({
  tdesignMinCss: {
    outBytes: tdesignCss.length,
    brandColorDefsRemoved: brandColorDefs === 0,
    brandColorDefsRemaining: brandColorDefs,
    hostSelectors: hostCount,
    rootSelectors: rootCount,
    textColorBrandKept: textColorBrand,
  },
  resetMinCss: {
    outBytes: resetCss.length,
  },
  generatorVarsCss: {
    outBytes: generatorVars.length,
    hostSelectors: varsHostCount,
  },
}, null, 2));
