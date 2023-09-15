const path = require('path');

module.exports = {
  root: true,
  extends: ['./../../.eslintrc.js'],
  parserOptions: {
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    babelOptions: {
      configFile: path.resolve(__dirname, './babelrc'),
    },
  },
  rules: {},
};
