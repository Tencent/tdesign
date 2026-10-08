import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      include: ['src/**/*.{test,spec}.ts'],
      coverage: {
        provider: 'v8',
        reportsDirectory: 'coverage',
        include: ['src/components/**/*.ts'],
      },
    },
  }),
);
