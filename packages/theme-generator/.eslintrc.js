const path = require('path');

module.exports = {
  root: true,
  extends: ['plugin:vue/essential', './../../.eslintrc.js'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    babelOptions: {
      configFile: path.resolve(__dirname, './babel.config.js'),
    },
  },
  rules: {},
};
