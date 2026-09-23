import { defineCustomElement } from 'vue';

// TDesign Vue Next 全局基础样式（定制版：加 :host 选择器 + 移除 td-brand-color 系列 Token，
// 让主题生成器能作为 Web Component 渲染并直接同步外部主题色。由 scripts/build-tdesign-css.mjs 从
// tdesign-vue-next/dist/tdesign.min.css 重新生成，运行 `npm run build:css` 同步上游。）
// `?inline` 让 Vite 把 CSS 作为字符串导入，而非注入 document.head —— 配合 shadowRoot: true，
// 这些样式由 defineCustomElement 的 styles 选项注入到 shadowRoot 内，与宿主页样式完全隔离。
import tdesignCss from './styles/tdesign.min.css?inline';
import resetCss from './styles/reset.min.css?inline';
// 生成器专用变量（--brand-main、--bg-color-card 等），由 build-tdesign-css.mjs
// 从 vars.css 转换 :root→:host 生成，注入 Shadow Root 供生成器 UI 使用。
// 不注入 document.head，避免污染宿主页；CSS 自定义属性可继承穿透 Shadow Boundary，
// 因此 vars.css 中 var(--td-brand-color) 仍能命中宿主页 :root 上的主题变量。
import generatorVars from './styles/generator-vars.css?inline';

import Generator from './Generator.vue';

// shadowRoot: true —— 样式注入 shadowRoot 内，与宿主页（可能也使用 TDesign）完全隔离，
// 避免桌面端 tdesign.min.css 的 .t-button / --td-radius-default 等污染宿主页（如 mobile-vue 站点）。
// 弹层组件（t-popup/t-drawer 等）通过 handleAttach() 挂到 shadowRoot 内的 .theme-generator 节点，
// 因此也能命中 shadowRoot 内的样式。
const TDThemeGenerator = defineCustomElement(Generator, {
  shadowRoot: true,
  styles: [tdesignCss, resetCss, generatorVars],
});

customElements.define('td-theme-generator', TDThemeGenerator);

export default TDThemeGenerator;
