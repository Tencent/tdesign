import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// tdesign-icons-vue-next/esm/index.js 会 `import './style/css.js'` 引入图标 CSS，
// 但该 CSS（@keyframes t-spin + .t-icon 基础样式）已包含在全量 tdesign.min.css 里
// （通过 ?inline 注入 shadowRoot）。屏蔽这条 import 避免重复输出 .css 文件。
// tdesign-vue-next 走 lib/ alias（无样式入口），无需此插件处理。
function stripTdesignIconsCSS() {
  return {
    name: 'strip-tdesign-icons-css',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer) return null;
      if (/[\\/]style[\\/]css\.js$/.test(source) && /tdesign-icons-vue-next/.test(importer)) {
        return '\0virtual:empty-style';
      }
      return null;
    },
    load(id) {
      if (id === '\0virtual:empty-style') {
        return 'export default {}';
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      // dev 与 build 统一走 Web Component 路径：customElement: true 让 SFC <style>
      // 以 &inline 字符串导入为 comp.styles，由 defineCustomElement 注入 shadowRoot，
      // 与宿主页样式完全隔离（dev 也模拟真实 WC 使用环境）。
      vue({ customElement: true }),
      stripTdesignIconsCSS(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // tdesign-vue-next / tdesign-icons-vue-next 的 lib/ 入口是��样式 ESM 构建
        // （不带任何 CSS import）。theme-generator 已通过 `?inline` 导入全量
        // dist/tdesign.min.css 注入 shadowRoot，组件级 CSS 无需再 import，
        // 否则会落到 document.head（shadowRoot 无法消费）造成污染 + 重复打包。
        // 用 alias 把裸导入 + 子路径导入都重定向到 lib/。
        'tdesign-vue-next': resolve(__dirname, 'node_modules/tdesign-vue-next/lib'),
      },
      extensions: ['.mjs', '.js', '.json', '.vue'],
    },
    css: {
      preprocessorOptions: {
        less: {
          // keep default; no global variable injection needed
        },
      },
    },
    server: {
      host: true,
      allowedHosts: true,
    },
    optimizeDeps: {
      // tvision-color 间接依赖 @material/material-color-utilities，
      // 后者内部存在无扩展名的 ESM 互导入（如 `import './blend/blend'`），
      // Node 原生 ESM loader 无法解析。通过预打包（esbuild）合并这些模块。
      include: ['tvision-color'],
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/wc-entry.js'),
        name: 'TDThemeGenerator',
        fileName: () => 'td-theme-generator.js',
        formats: ['es'],
      },
      cssCodeSplit: false,
      sourcemap: false,
      rollupOptions: {
        // Inline vue + tdesign-vue-next into the bundle (replicates --inline-vue)
        external: [],
        output: {
          assetFileNames: 'td-theme-generator.[ext]',
        },
      },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/__tests__/setup.js'],
      include: ['src/**/*.{spec,test}.js'],
      server: {
        deps: {
          // 这些依赖存在无扩展名的 ESM 互导入，Node 原生 loader 无法解析，
          // 强制内联到 Vite 的 SSR 转换管线（esbuild 能解析无扩展名导入）
          inline: ['tvision-color', '@material/material-color-utilities', 'tdesign-vue-next'],
        },
      },
    },
  };
});
