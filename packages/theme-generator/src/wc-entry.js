import { defineCustomElement } from 'vue';
import GeneratorCe from './Generator.vue';

// wcCssPlugin 会在 JS 产物顶部注入 __WC_ALL_CSS__ 全局变量
// 包含所有 Vite 提取的 CSS 文件内容（主要是 TDesign 组件库样式）
// 注意：__WC_ALL_CSS__ 不包含 Generator.vue 中 <style> 块的内联样式，
// 后者由 Vue 3 CE 编译器编译到 GeneratorCe.styles 中（即 originalStyles）
const allCss = typeof __WC_ALL_CSS__ !== 'undefined' ? __WC_ALL_CSS__ : '';

// Vue 3 CE 会将 styles 数组中的每个元素创建为独立的 <style> 标签注入到 shadowRoot，
// 后注入的标签在同等特异性下优先级更高。
// 顺序必须是：基础样式（allCss）在前，覆盖样式（originalStyles）在后，
// 这样组件自身的覆盖样式才能生效。
const originalStyles = GeneratorCe.styles || [];
const allStyles = [allCss, ...originalStyles].filter(Boolean);

// 重新定义组件，注入完整样式
const ThemeGeneratorElement = defineCustomElement({
  ...GeneratorCe,
  styles: allStyles,
});

customElements.define('td-theme-generator', ThemeGeneratorElement);
