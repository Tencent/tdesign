import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@config': path.resolve(__dirname, './config'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@images': path.resolve(__dirname, './src/images'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: '/',
    https: false,
  },

  build: {
    outDir: 'lib',
    lib: {
      name: 'td-site',
      entry: './src/main.js',
      fileName: 'site',
      formats: ['es', 'umd'],
    },
  },
};
