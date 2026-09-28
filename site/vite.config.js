import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tdocPlugin from './plugins/tdoc';
import iconsManifestPlugin from './plugins/icons-manifest';

const publicPathMap = {
  preview: '/',
  production: 'https://static.tdesign.tencent.com/',
};

export default defineConfig(({ mode }) => ({
  base: publicPathMap[mode],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr'],
  resolve: {
    extensions: ['.js', '.ts', '.mjs', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@docs': path.resolve(__dirname, '../docs'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@components': path.resolve(__dirname, './src/components'),
      'vue-router': path.resolve(__dirname, './node_modules/vue-router'),
    },
  },
  build: {
    outDir: mode === 'preview' ? '../_site' : '_site',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        contributor: path.resolve(__dirname, 'contributor.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 10000,
    open: '/',
    fs: {
      strict: false,
    },
    allowedHosts: true,
  },
  plugins: [
    vue({
      include: /(\.md|\.vue)$/,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('td-'),
        },
      },
    }),
    tdocPlugin(),
    iconsManifestPlugin(),
  ],
}));
