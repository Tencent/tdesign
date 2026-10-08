module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-less'],
  rules: {
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    // TODO 后面统一改 class 小写 且 BEM，当前按警告提示
    'selector-class-pattern': [
      '^[a-z]+([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
      {
        resolveNestedSelectors: true,
        message: 'Expected class selector "%s" to be lowercase and BEM format',
        severity: 'warning',
      },
    ],
    'media-feature-range-notation': 'prefix',
    // 大型遗留 less 代码库中，Less 嵌套展开后选择器顺序难以保证，关闭以避免样式回归
    'no-descending-specificity': null,
  },
};
