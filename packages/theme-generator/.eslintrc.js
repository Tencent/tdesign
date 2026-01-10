const path = require('path');

module.exports = {
  root: true,
  extends: ['plugin:vue/recommended', './../../.eslintrc.js'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    babelOptions: {
      configFile: path.resolve(__dirname, './babel.config.js'),
    },
    ecmaVersion: 2020,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
