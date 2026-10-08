import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '.pnpm-store/**',
      '**/dist/**',
      '**/lib/**',
      '**/_data/**',
      '**/_site/**',
      '**/results/**',
      '**/static_site/**',
      '**/coverage/**',
      // site
      'site/snapshot*',
      'site/common/**',
      'site/cypress/**',
      'site/script/test/cypress/**',
      'site/temp*',
      'site/tdesign/**',
      'site/plugins/tdoc/**',
      'site/public/**',
      'site/spline/**',
      'site/src/pages/design/assets/motion/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettierConfig,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/require-default-prop': 'off',
    },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    files: ['services/**/*.js', '**/*.cjs', 'site/postcss.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  {
    files: [
      'packages/auto-release-collection/**',
      'packages/site-components/script/**',
      'packages/site-components/vite.config.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['site/src/pages/home/banner.vue'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'time', 'timeEnd', 'log'] }],
    },
  },

  {
    files: ['site/src/**'],
    languageOptions: {
      globals: {
        aegis: 'readonly',
        NProgress: 'readonly',
      },
    },
  },

  {
    // 这些文件仅渲染受信任的内容：本地导入的 SVG 常量、i18n 文案、站点配置或服务端渲染的文档正文
    files: [
      'packages/theme-generator/src/**/*.vue',
      'site/src/components/design-source.vue',
      'site/src/pages/about/release.vue',
      'site/src/pages/design/motion.vue',
    ],
    rules: {
      'vue/no-v-html': 'off',
    },
  },
);
