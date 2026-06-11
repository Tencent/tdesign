/**
 * 处理 tdesign.min.css 二次压缩脚本
 *
 * 1. 添加 :host 选择器，确保 Web Components 打包后样式正常
 * 2. 移除 td-brand-color-x 系列颜色 Token，使主题生成器能与外部主题色直接同步
 *
 * 用法: node scripts/process-css.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_CSS = path.resolve(__dirname, '../node_modules/tdesign-vue-next/dist/tdesign.min.css');
const DEST_CSS = path.resolve(__dirname, '../src/styles/tdesign.min.css');

// 读取上游 tdesign-vue-next 的原始 tdesign.min.css
const rawCss = fs.readFileSync(SRC_CSS, 'utf-8');

let processed = rawCss;

// ============================================================
// 1. 添加 :host 选择器
// ============================================================

// 1a. `:root{` → `:root,:host{`
processed = processed.replace(/:root\{/g, ':root,:host{');

// 1b. `:root,:root[theme-mode=light]{` → `:root,:root[theme-mode="light"],:host,:host([theme-mode="light"]){`
processed = processed.replace(
  /:root,:root\[theme-mode=light\]\{/g,
  ':root,:root[theme-mode="light"],:host,:host([theme-mode="light"]){',
);

// 1c. `:root[theme-mode=dark]{` → `:root[theme-mode="dark"],:host([theme-mode="dark"]){`
processed = processed.replace(
  /:root\[theme-mode=dark\]\{/g,
  ':root[theme-mode="dark"],:host([theme-mode="dark"]){',
);

// 1d. `:root.dark,:root[theme-mode=dark]{` → `:root.dark,:root[theme-mode="dark"],:host.dark,:host([theme-mode="dark"]){`
processed = processed.replace(
  /:root\.dark,:root\[theme-mode=dark\]\{/g,
  ':root.dark,:root[theme-mode="dark"],:host.dark,:host([theme-mode="dark"]){',
);

// ============================================================
// 2. 移除 td-brand-color-x 系列 Token
// ============================================================

// 2a. 移除所有 --td-brand-color-\d+:...; 声明（包括 light 和 dark 主题中的）
// 匹配形如 --td-brand-color-1:#f2f3ff; --td-brand-color-10:#001a57; 等
processed = processed.replace(/--td-brand-color-\d+:[^;]+;/g, '');

// 2b. 移除引用 td-brand-color-x 的语义 Token（light/dark 主题中索引可能不同）
const semanticPatterns = [
  /--td-brand-color:var\(--td-brand-color-\d+\);/g,
  /--td-brand-color-hover:var\(--td-brand-color-\d+\);/g,
  /--td-brand-color-focus:var\(--td-brand-color-\d+\);/g,
  /--td-brand-color-active:var\(--td-brand-color-\d+\);/g,
  /--td-brand-color-disabled:var\(--td-brand-color-\d+\);/g,
  /--td-brand-color-light:var\(--td-brand-color-\d+\);/g,
  /--td-brand-color-light-hover:var\(--td-brand-color-\d+\);/g,
  /--td-text-color-brand:var\(--td-brand-color-\d+\);/g,
  /--td-text-color-link:var\(--td-brand-color-\d+\);/g,
];
semanticPatterns.forEach((pattern) => {
  processed = processed.replace(pattern, '');
});

// 2c. 在第一个 `:root,:host{` 之后立即注入 `--td-brand-color:var(--brand-main) !important;`
//   使主题色与外部同步
processed = processed.replace(
  /(:root,:host\{)/,
  '$1--td-brand-color:var(--brand-main) !important;',
);

// 清理可能产生的多余分号或空声明
processed = processed.replace(/;;/g, ';');

// 写入目标文件
fs.writeFileSync(DEST_CSS, processed, 'utf-8');

const sizeOld = rawCss.length;
const sizeNew = processed.length;
console.log(`Processed tdesign.min.css:
  Source: ${SRC_CSS} (${(sizeOld / 1024).toFixed(1)} KB)
  Dest:   ${DEST_CSS} (${(sizeNew / 1024).toFixed(1)} KB)
  Delta:  ${sizeNew - sizeOld > 0 ? '+' : ''}${sizeNew - sizeOld} bytes
  :host selectors added
  td-brand-color-x tokens removed`);
