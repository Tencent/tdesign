import { defineCustomElement } from 'vue';
import GeneratorCe from './Generator.vue';

/**
 * 样式来源说明：
 * 1. __WC_ALL_CSS__ — wcCssPlugin 在构建时注入的全局变量，包含 Vite 提取的 CSS
 *    （主要是 node_modules 中 tdesign-vue-next 的组件库样式）
 * 2. originalStyles — 从 Generator.vue 的 <style> 块提取的内联样式
 *    （包括 reset.min.css、tdesign.min.css 等 @import 及自定义覆盖样式）
 *
 * 注入顺序：
 * styles 数组中后注入的样式优先级更高。
 * [allCss, ...originalStyles] 确保：基础库样式优先级最低，组件覆盖样式优先级最高。
 */
const allCss = typeof __WC_ALL_CSS__ !== 'undefined' ? __WC_ALL_CSS__ : '';
const originalStyles = GeneratorCe.styles || [];
const allStyles = [allCss, ...originalStyles].filter(Boolean);

// 重新定义组件，注入完整样式
const ThemeGeneratorElement = defineCustomElement({
  ...GeneratorCe,
  styles: allStyles,
});

customElements.define('td-theme-generator', ThemeGeneratorElement);
