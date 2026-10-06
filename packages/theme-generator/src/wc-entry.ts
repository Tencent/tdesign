import { defineCustomElement } from 'vue';

import tdesignCssRaw from 'tdesign-vue-next/dist/tdesign.min.css?inline';
import resetCssRaw from 'tdesign-vue-next/dist/reset.css?inline';
import varsCssRaw from './common/themes/built-in/css/vars.css?inline';

import Generator from './generator.vue';

// Shadow DOM 内 :root 无法命中，为每个 :root 选择器补充对应的 :host 变体。
// 上游选择器未压缩，形如 `:root, :root[theme-mode='light'] {...}`：
//   :root                  → :host
//   :root[theme-mode='x']  → :host([theme-mode='x'])
//   :root.dark             → :host(.dark)
function toHostVariants(css: string): string {
  return css.replace(/([^{}]+)\{/g, (m, selectors) => {
    const list = selectors
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
    const hosts = list
      .filter((s: string) => /^:root(?=[[\].\s,:]|$)/.test(s))
      .map((s: string) => {
        const tail = s.slice(':root'.length);
        return tail ? `:host(${tail})` : ':host';
      });
    if (!hosts.length) return m;
    return `${list.join(',')},${hosts.join(',')}{`;
  });
}

// 移除 --td-brand-color* token（品牌色由生成器自行管理，避免覆盖）。
function stripBrandColorTokens(css: string): string {
  return css.replace(/--td-brand-color[a-z0-9-]*\s*:[^;}]*;?/g, '');
}

const tdesignCss = stripBrandColorTokens(toHostVariants(tdesignCssRaw));
const resetCss = toHostVariants(resetCssRaw);
const generatorVars = toHostVariants(varsCssRaw);

const TDThemeGenerator = defineCustomElement(Generator, {
  shadowRoot: true,
  styles: [tdesignCss, resetCss, generatorVars],
});

customElements.define('td-theme-generator', TDThemeGenerator);

export default TDThemeGenerator;
