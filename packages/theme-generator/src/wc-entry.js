import { defineCustomElement } from 'vue';
import GeneratorCe from './Generator.ce.vue';

// wcCssPlugin 会在 JS 产物顶部注入 __WC_ALL_CSS__ 全局变量
// 包含所有子组件和 TDesign 组件库的 CSS
const allCss = typeof __WC_ALL_CSS__ !== 'undefined' ? __WC_ALL_CSS__ : '';

// 将根组件自身的样式与收集的全局样式合并
const originalStyles = GeneratorCe.styles || [];
const allStyles = [...originalStyles, allCss].filter(Boolean);

// 重新定义组件，注入完整样式
const ThemeGeneratorElement = defineCustomElement({
  ...GeneratorCe,
  styles: allStyles,
});

customElements.define('td-theme-generator', ThemeGeneratorElement);
