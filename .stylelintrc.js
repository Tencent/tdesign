module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-less'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      // 内置主题 token 由 TDesign 设计平台导出并直接 import ?raw 使用，
      // 保留其原始格式（百分比透明度等），不参与本地格式治理
      files: ['**/themes/built-in/css/**/*.css'],
      rules: {
        'alpha-value-notation': null,
        'custom-property-empty-line-before': null,
        'no-duplicate-selectors': null,
        'selector-class-pattern': null,
      },
    },
  ],
  rules: {
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    // TODO 后面统一改 class 小写 且 BEM，当前按警告提示
    // 兼容 tdoc 插件（vite-plugin-tdoc）生成的固定目录类名 tdesign-toc_*
    'selector-class-pattern': [
      '^[a-z]+([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$|^tdesign-toc_',
      {
        resolveNestedSelectors: true,
        message: 'Expected class selector "%s" to be lowercase and BEM format',
        severity: 'warning',
      },
    ],
    'media-feature-range-notation': 'prefix',
    // 大型遗留 less 代码库中，Less 嵌套展开后选择器顺序难以保证，关闭以避免样式回归
    'no-descending-specificity': null,

    // TDesign 设计 token 采用 camelCase 命名（如 --td-font-size-title-extraLarge、--td-comp-paddingLR-xs），
    // 属于设计规范约定，不对 custom property 名称做 kebab-case 强制
    'custom-property-pattern': null,
    // 字体名保持原始大小写（PingFang SC、Microsoft YaHei 等），不做小写化
    'value-keyword-case': null,
    // 关键帧名称沿用设计 token 命名风格
    'keyframes-name-pattern': null,
    // Vue 单文件组件使用 :deep() 等作用域样式伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
    // 设计系统需要保留 -webkit- / -moz- 等厂商前缀以兼容旧版 Safari / 小程序等运行时，
    // 不交由 stylelint 移除（自动前缀由构建侧 postcss/autoprefixer 负责）
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'selector-no-vendor-prefix': null,
    'at-rule-no-vendor-prefix': null,
    // 保留历史写法（如 rgba() 兼容函数、小数点精度），避免对已上线样式造成回归
    'color-function-alias-notation': null,
    'number-max-precision': null,
    // 设计系统会声明特定字体（如 PingFang SC、TCloud Number），不强制追加通用字体族
    'font-family-no-missing-generic-family-keyword': null,
  },
};
