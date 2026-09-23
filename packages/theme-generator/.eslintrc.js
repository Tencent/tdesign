module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['vue'],
  // 根配置在前，vue 配置在后（确保 vue 的 script-setup-uses-vars 等规则优先生效）
  extends: ['./../../.eslintrc.js', 'plugin:vue/vue3-essential'],
  rules: {
    // 让 no-unused-vars 识别 <script setup> 中被 template 使用的变量
    'vue/script-setup-uses-vars': 'error',
  },
};
