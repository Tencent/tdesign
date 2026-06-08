import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { resolve } from 'path';

/**
 * 自定义 Vite 插件：收集所有 CSS，导出为 JS 变量供 Web Component 使用
 *
 * 工作原理：
 * 1. 拦截 Vite 生成的 CSS 文件，删除它们
 * 2. 将 CSS 内容以 __WC_ALL_CSS__ 全局变量的形式注入到 JS 产物中
 * 3. wc-entry.js 读取 __WC_ALL_CSS__ 并传给 defineCustomElement 的 styles 配置
 * 4. Vue 3 CE 框架会自动将这些样式注入到 shadowRoot
 */
function wcCssPlugin() {
  return {
    name: 'wc-css-plugin',
    enforce: 'post',
    generateBundle(_, bundle) {
      let allCss = '';

      // 收集所有 CSS 文件内容
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          allCss += file.source + '\n';
          delete bundle[fileName];
        }
      }

      // 将 CSS 注入为全局变量，供 wc-entry.js 读取
      // 只注入到入口 chunk（isEntry），避免多个 chunk 时重复注入
      if (allCss) {
        for (const [fileName, file] of Object.entries(bundle)) {
          if (fileName.endsWith('.js') && file.type === 'chunk' && file.isEntry) {
            const cssVarCode = `var __WC_ALL_CSS__ = ${JSON.stringify(allCss)};\n`;
            file.code = cssVarCode + file.code;
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('td-'),
        },
      },
    }),
    svgLoader(),
    wcCssPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/wc-entry.js'),
      name: 'TdThemeGenerator',
      formats: ['iife'],
      fileName: () => 'td-theme-generator.js',
    },
    rollupOptions: {
      external: [],
    },
    minify: true,
  },
});
