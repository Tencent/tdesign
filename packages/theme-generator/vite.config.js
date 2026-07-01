import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// tdesign-vue-next 每个组件都会 `import './style/css.mjs'` 引入自己的 CSS，
// tdesign-icons-vue-next 也有 `style/css.js` 引入图标 CSS。
// 但 theme-generator 已通过 `?inline` 导入全量 dist/tdesign.min.css（含所有组件 + 图标样式）。
// 屏蔽这些组件级 CSS import，避免重复打包 + 单独输出 .css 文件（shadowRoot 模式下无法消费）。
function stripTdesignComponentCSS() {
  return {
    name: 'strip-tdesign-component-css',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer) return null;
      // 匹配 tdesign-vue-next / tdesign-icons-vue-next 内的 style/css.{mjs,js}
      if (/[\\/]style[\\/]css\.(mjs|js)$/.test(source) && /tdesign-(icons-)?vue-next/.test(importer)) {
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
    plugins: [vue(), stripTdesignComponentCSS()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
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
