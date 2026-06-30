import { defineCustomElement } from 'vue';

// TDesign Vue Next 全局基础样式（组件库自身样式）
import 'tdesign-vue-next/es/style/index.css';
// 站点级重置样式
import './styles/reset.min.css';

import Generator from './Generator.vue';

// shadowRoot: false —— 与原 `--inline-vue` 行为一致：渲染到 light DOM，
// TDesign 基础样式（注入 document.head）与 handleAttach 的 document.body fallback 才能生效。
// 若开启 shadow root，head 中的样式无法穿透 shadow 边界，TDesign 组件样式会失效。
const TDThemeGenerator = defineCustomElement(Generator, { shadowRoot: false });

customElements.define('td-theme-generator', TDThemeGenerator);

export default TDThemeGenerator;
