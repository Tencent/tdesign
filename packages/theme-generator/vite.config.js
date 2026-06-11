import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { resolve } from 'path';
import MagicString from 'magic-string';
import remapping from '@ampproject/remapping';

/**
 * 自定义 Vite 插件：收集所有 CSS，注入为全局变量供 build-entry.js 使用
 *
 * 工作原理：
 * 1. 拦截 Vite 生成的 CSS 文件，删除它们
 * 2. 将 CSS 内容以 __WC_ALL_CSS__ 全局变量的形式注入到 JS 产物顶部
 * 3. build-entry.js 读取 __WC_ALL_CSS__ 并与组件自身样式合并
 *
 * Dev 模式下 Vite 通过 HMR 注入 CSS 到 document.head，无需此插件处理。
 */
function wcCssPlugin() {
  return {
    name: 'wc-css-plugin',
    enforce: 'post',
    transform() {
      // Dev 模式由 Vite HMR 处理，此处跳过
      return null;
    },
    generateBundle(_, bundle) {
      let allCss = '';

      // 收集所有 CSS 文件内容
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          const source = typeof file.source === 'string' ? file.source : new TextDecoder().decode(file.source);
          allCss += source + '\n';
          delete bundle[fileName];
        }
      }

      // 将 CSS 注入为全局变量，供 build-entry.js 读取
      // 只注入到入口 chunk（isEntry），避免多个 chunk 时重复注入
      if (allCss) {
        for (const [fileName, file] of Object.entries(bundle)) {
          if (fileName.endsWith('.js') && file.type === 'chunk' && file.isEntry) {
            const cssVarCode = `var __WC_ALL_CSS__ = ${JSON.stringify(allCss)};\n`;
            const ms = new MagicString(file.code);
            ms.prepend(cssVarCode);
            file.code = ms.toString();
            // 同步更新 sourcemap，避免行号偏移
            if (file.map) {
              const incrementMap = ms.generateMap({ hires: 'boundary' });
              file.map = remapping(incrementMap, () => file.map);
            }
          }
        }
      }
    },
  };
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 10002,
    open: '/',
    fs: {
      strict: false,
    },
    allowedHosts: true,
  },
  plugins: [vue(), svgLoader(), wcCssPlugin()],
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
      entry: resolve(__dirname, 'src/build-entry.js'),
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
