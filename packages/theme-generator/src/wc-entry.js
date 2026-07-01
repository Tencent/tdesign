import { defineCustomElement } from 'vue';

// TDesign Vue Next 全局基础样式（定制版：加 :host 选择器 + 移除 td-brand-color 系列 Token，
// 让主题生成器能作为 Web Component 渲染并直接同步外部主题色。由 scripts/build-tdesign-css.mjs 从
// tdesign-vue-next/dist/tdesign.min.css 重新生成，运行 `npm run build:css` 同步上游。）
import './styles/tdesign.min.css';
// 站点级重置样式
import './styles/reset.min.css';

import Generator from './Generator.vue';

// shadowRoot: false —— 与原 `--inline-vue` 行为一致：渲染到 light DOM，
// TDesign 基础样式（注入 document.head）与 handleAttach 的 document.body fallback 才能生效。
// 若开启 shadow root，head 中的样式无法穿透 shadow 边界，TDesign 组件样式会失效。
const TDThemeGenerator = defineCustomElement(Generator, { shadowRoot: false });

customElements.define('td-theme-generator', TDThemeGenerator);

export default TDThemeGenerator;
