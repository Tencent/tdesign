module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['vue'],
  // 根配置在前，vue 配置在后（确保 vue 的 script-setup-uses-vars 等规则优先生效）
  extends: ['./../../.eslintrc.js', 'plugin:vue/vue3-essential'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // 基础规则会误报 TS 类型/重载签名，改用 TS 感知版本
        'no-unused-vars': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      },
    },
    {
      files: ['*.vue'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      },
    },
  ],
  rules: {
    // 让 no-unused-vars 识别 <script setup> 中被 template 使用的变量
    'vue/script-setup-uses-vars': 'error',
  },
};
