import { beforeEach } from 'vitest';

// 全局重置 localStorage / 文档样式状态，避免用例间串扰
beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('theme-mode');
  document.documentElement.style.cssText = '';
  // 清理可能由 core.js / store 创建的 <style> 节点
  document.querySelectorAll('style').forEach((el) => el.remove());
});

// 各 SFC 在 <script setup> 中按需从 'tdesign-vue-next/lib'（无样式入口）import 组件，
// 挂载时会自动解析，因此无需在此全局注册 TDesign 插件。
// happy-dom 已内置 MutationObserver / localStorage / customElements，无需额外 polyfill。
