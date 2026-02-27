import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import tdocPlugin from './plugin-tdoc/index.js';

const publicPathMap = {
  preview: '/',
  production: 'https://static.tdesign.tencent.com/',
};

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: publicPathMap[mode],
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr'],
    resolve: {
      extensions: ['.js', '.ts', '.mjs', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@docs': path.resolve(__dirname, '../docs'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@components': path.resolve(__dirname, './src/components'),
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
      proxy: {
        '/api/apigw': {
          target: 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/apigw/, ''),
        },
        '/api/scf': {
          target: 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/scf/, ''),
        },
      },
    },
    plugins: [
      vue({
        include: /(\.md|\.vue)$/,
      }),
      tdocPlugin(),
    ],
  });
};
