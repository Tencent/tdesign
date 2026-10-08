import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const execAsync = promisify(exec);

export default defineConfig({
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
    allowedHosts: true,
  },

  build: {
    outDir: 'lib',
    lib: {
      name: 'td-site',
      entry: './src/main.ts',
      fileName: (format) => `site.${format}.js`,
      formats: ['es', 'umd'],
    },
  },

  plugins: [lessCompilePlugin()],
});

function lessCompilePlugin(): Plugin {
  return {
    name: 'less-compile-plugin',
    async closeBundle() {
      if (process.env.VITEST) return;
      if (this.environment?.name === 'ssr') return;
      console.log('Running compile-less.ts...');
      try {
        const { stdout } = await execAsync('node --experimental-strip-types ./script/compile-less.ts');
        console.log('Compiled successfully:\n', stdout);
      } catch (err) {
        console.error('Compiled failed:\n', err);
      }
    },
  };
}
