module.exports = {
  root: true,
  extends: ['./../../.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['test/**/*.ts'],
      env: {
        jest: true,
      },
    },
  ],
  rules: {},
};
