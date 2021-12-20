---
title: 常见问题
---

### 何时发版

目前按照每周一次迭代的发版节奏进行，如果你有线上问题急需解决，请在 issue 中留言要求发布先行版本，先行版本不受迭代版本节奏要求，随时可以发布。

### 如何定制主题

参考 [自定义主题](https://github.com/Tencent/tdesign-common/blob/develop/theme.md)，你可以自由修改全局和各组件抽离的样式变量，只有已有变量无法满足你的定制需求时才考虑通过同名类覆盖的方式重写默认样式，这可以降低你跟随组件库升级的难度。

### 受控与非受控用法

对于使用时可能需要更新的属性如 value(对应更新事件 onChange)，组件都实现了受控和非受控用法，下面使用 value/onChange 代入说明：

- 受控用法：传入属性 value 既代表受控用法，组件状态完全由属性值控制，无内部状态，如需更新状态，必须传入新的属性值，用户通过交互触发了更新事件 onChange，开发者需要更新 value 后传入组件，组件状态才会更新。
- 非受控用法：既初始值用法，不传入 value 属性，使用对应的初始值属性 defaultValue 设置组件初始状态，此时组件会在内部维护该状态，用户通过交互触发更新事件 onChange 之后，组件内部直接更新组件状态。

### 如何在设计工具 Sketch 中使用 TDesign
有两种方式，一是可以使用 TDesign 提供的 Sketch 源文件，它包括桌面端及移动端（近期上线），也可以使用 TDesign 提供的 Sketch 插件，具体使用方式请参考 [《插件使用手册》](https://doc.weixin.qq.com/doc/w3_m_OkshgETGpoGB?scode=AJEAIQdfAAoYvGqGCUAL8AZgbdAFw)。