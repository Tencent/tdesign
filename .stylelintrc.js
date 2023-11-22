module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-less'],
  rules: {
    'number-leading-zero': 'never',
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
  },
};
