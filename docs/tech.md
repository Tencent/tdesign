---
title: 整体方案
---

## 仓库结构说明

每个仓库对应一个组件库技术栈实现，包含各自技术栈实现代码和一个 [tdesign-common](https://github.com/Tencent/tdesign-common) 子仓库，子仓库作为公共库包含：

- 一些公共的工具函数
- 组件库 UI 开发内容，既 HTML 结构和 CSS 样式（React/Vue 等多技术栈共用）

### 初始化子仓库

- 初次克隆代码后需要初始化子仓库： git submodule init && git submodule update
- git submodule update 之后子仓库不指向任何分支，只是一个指向某一个提交的游离状态

### 子仓库开发

子仓库组件分支从 develop checkout 示例：feature/button，提交代码时先进入子仓库完成提交，然在回到主仓库完成提交

- 先进入 common 文件夹，正常将样式修改添加提交
- 回到主仓库，此时会看到 common 文件夹是修改状态，按照正常步骤添加提交即可

### 关于组件库 UI

UI 开发（HTML & CSS）是由 React/Vue 等多个实现框架共用的。各个框架组件实现应该要复用 UI 开发的 HTML 结构，引用其组件 CSS 与 demo CSS（本仓库已在入口处引用），UI 开发一般可由单独的 UI 开发同学完成或各框架组件开发同学的其中一名同学完成

- 如果开发前已有某个组件的 UI 开发内容，直接在主仓库使用即可
- 如果没有，且你也负责 UI 开发：参考 UI 开发规范完成 UI 开发内容、然后再开发主仓库组件
- 如果没有，且 UI 开发工作已有其他同学负责或认领：可以先在主仓库开发组件功能，待 UI 开发输出之后对齐即可

如果 UI 内容和样式（其他同学负责开发）还未完成，而你开发组件功能时需要写一些样式，可以直接在组件文件夹先写一个临时的 less 文件，在 js 中引入即可，如：

```
├── button.less
├── button.tsx
```

```js
// button.tsx

// 先引入临时的样式文件用于开发功能，待 UI 开发完成之后需要与 UI 样式对齐并删除 less 文件
import "./button.less";
```

## 规范

### 命名规范

[https://github.com/Tencent/tdesign-common/blob/develop/naming.md](https://github.com/Tencent/tdesign-common/blob/develop/naming.md)

### Git 提交规范

使用 angular 提交规范：

<https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits>

feat 与 fix 提交将被用于生成 changelog

- feat：新功能
- fix：修补 bug
- docs：文档类变动
- style：样式
- refactor：重构
- test：增加测试
- chore：构建过程或辅助工具的变动

### TS 规范

- 组件库构建包导出变量使用大驼峰命名规则
- 遵循选型中 eslint 配置，使用 Airbnb 规范
- 代码注释规范，采用 jsdoc: <https://jsdoc.app/>

### 样式规范

- 类名使用 BEM 命名规则 [css-naming](https://github.com/Tencent/tdesign-common/blob/develop/css-naming.md)
- 样式文件夹独立，方便复用与后续主题定制工具的开发

### API 设计规范

为了保证组件库各技术栈实现版本使用体验一致，对于组件 API 命名 TDesign 有一套统一的规范，详情请阅读 [api.md](https://github.com/Tencent/tdesign-common/blob/develop/api.md)。

## 技术选型

| 类目         | 方案                                                                         | 参考链接                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 开发语言     | ts                                                                           | [http://www.typescriptlang.org/](http://www.typescriptlang.org/)                                                                                         |
| 样式语言     | less                                                                         | [http://lesscss.org/](http://lesscss.org/)                                                                                                               |
| 构建工具     | vite 组件库本地开发 <br> rollup 组件库打包 | [https://vitejs.dev/](https://vitejs.dev/)<br>[https://www.rollupjs.com/](https://www.rollupjs.com/) |
| 测试工具     | jest <br> cypress e2e 测试                                                   | [https://jestjs.io/](https://jestjs.io/)<br>[https://www.cypress.io/](https://www.cypress.io/)                                                           |
| web-vue      | vue@2.x                                                                      | [https://github.com/vuejs/vue](https://github.com/vuejs/vue)                                                                                             |
| web-vue-next | vue@3.x                                                                      | [https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)                                                                                   |
| mobile-vue   | vue@3.x                                                                      | [https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)                                                                                   |
| react        | react@16.x                                                                   | [https://github.com/facebook/react](https://github.com/facebook/react)                                                                                   |
