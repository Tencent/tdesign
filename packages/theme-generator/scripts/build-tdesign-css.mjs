/* eslint-disable */
// Regenerates packages/theme-generator/src/styles/tdesign.min.css from the
// upstream tdesign-vue-next dist (already minified, full component + token CSS)
// with two customizations:
//   1. Add a :host variant alongside every :root selector (Web Component
//      compatibility — declarations apply in both light DOM and shadow DOM).
//   2. Strip all --td-brand-color* token definitions so the theme-generator
//      syncs with the host page's external brand color scale instead of
//      overriding it. var(--td-brand-color-*) *usages* are kept (e.g.
//      --td-text-color-brand: var(--td-brand-color-7)) — they resolve against
//      whatever the host page defines.
//
// Run: npm run build:css
// When upgrading tdesign-vue-next, re-run to regenerate from the new upstream.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(__dirname, '..');
const SRC = resolve(PKG, 'node_modules/tdesign-vue-next/dist/tdesign.min.css');
const OUT = resolve(PKG, 'src/styles/tdesign.min.css');

let css = readFileSync(SRC, 'utf8');

// --- (1) Add :host variants for every :root selector in each selector list ---
// The upstream minified CSS uses selector lists like `:root,:root[theme-mode='light']{...}`.
// For each selector that starts with :root, append a parallel :host variant using the
// FUNCTIONAL form `:host(<tail>)`. Chrome does NOT match the compound form `:host[attr]`
// or `:host.class` — only `:host([attr])` / `:host(.class)` match host attributes/classes.
// Bare `:root` becomes bare `:host` (no parens). Upstream has no `:root <descendant>` rules.
// At-rules like @-moz-document url-prefix() have no :root selector and pass through.
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

// --- (2) Remove --td-brand-color* custom-property declarations ---
// Matches the exact base (--td-brand-color) and the derived/numbered series
// (--td-brand-color-1, --td-brand-color-hover, ...). Does NOT match
// --td-text-color-brand / --td-text-color-link (different prefix).
// The upstream minified form is `--td-brand-color-1:#f2f3ff;` (no spaces, semicolon-terminated).
// [^;}]* stops at the next ; or } so it never crosses into the next declaration.
css = css.replace(/--td-brand-color[a-z0-9-]*\s*:[^;}]*;?/g, '');

// --- (3) Drop the source-map comment (no .map file is shipped) ---
css = css.replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '');

writeFileSync(OUT, css + '\n', 'utf8');

// --- verification output ---
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
