import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/__tests__/setup.ts'],
      include: ['src/**/*.{spec,test}.ts'],
      server: {
        deps: {
          // 这些依赖存在无扩展名的 ESM 互导入，Node 原生 loader 无法解析，
          // 强制内联到 Vite 的 SSR 转换管线（esbuild 能解析无扩展名导入）
          inline: ['tvision-color', '@material/material-color-utilities', 'tdesign-vue-next'],
        },
      },
    },
  }),
);
