import { defineCustomElement } from 'vue';

// TDesign Vue Next 全局基础样式（组件库自身样式）
import 'tdesign-vue-next/es/style/index.css';
// 站点级重置样式
import './styles/reset.min.css';

import Generator from './Generator.vue';

const TDThemeGenerator = defineCustomElement(Generator);

customElements.define('td-theme-generator', TDThemeGenerator);

export default TDThemeGenerator;
