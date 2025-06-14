import path from 'path';
import { exec } from 'child_process';

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

  plugins: [lessCompilePlugin()],
};

function lessCompilePlugin() {
  return {
    name: 'less-compile-plugin',
    closeBundle() {
      console.log('Running compile-less.js...');
      exec('node ./script/compile-less.js', (err, stdout, stderr) => {
        if (err) {
          console.error('Compiled failed:\n', stderr);
        } else {
          console.log('Compiled successfully:\n', stdout);
        }
      });
    },
  };
}
