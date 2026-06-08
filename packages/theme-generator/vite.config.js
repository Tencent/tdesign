import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { resolve } from 'path';

/**
 * 自定义 Vite 插件：将 CSS 内联注入到 JS 产物中
 * 对于 Web Component (defineCustomElement) 构建，CSS 不能单独提取
 */
function cssInlinePlugin() {
  let cssContent = '';

  return {
    name: 'css-inline-plugin',
    enforce: 'post',
    generateBundle(_, bundle) {
      // 收集所有 CSS 文件内容
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          cssContent += file.source;
          delete bundle[fileName];
        }
      }

      // 将 CSS 注入到 JS 产物的开头
      if (cssContent) {
        for (const [fileName, file] of Object.entries(bundle)) {
          if (fileName.endsWith('.js') && file.type === 'chunk') {
            const cssInjectCode = `
(function() {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = ${JSON.stringify(cssContent)};
  var target = document.querySelector('td-theme-generator');
  if (target && target.shadowRoot) {
    target.shadowRoot.prepend(style);
  } else {
    document.head.prepend(style);
  }
})();
`;
            file.code = cssInjectCode + file.code;
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
    cssInlinePlugin(),
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
    minify: false,
  },
});
