import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'node:path';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    plugins: [
      vue(),
      // Only inline CSS into JS for the Web Component build (self-contained bundle)
      ...(isBuild ? [cssInjectedByJsPlugin({ styleId: 'td-theme-generator-style' })] : []),
    ],
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
