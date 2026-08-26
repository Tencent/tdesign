<p>
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

[English](./README.md) | 简体中文

TDesign 是一套完整的 [企业级设计体系](https://tdesign.tencent.com/design/values)，拥有基于 [Vue](https://tdesign.tencent.com/vue/) / [React](https://tdesign.tencent.com/react/) / [小程序](https://tdesign.tencent.com/miniprogram/) 等技术栈的组件库解决方案。
用于构建 [设计统一](#一致) / [跨端多技术栈](#完整) 的前端应用时，TDesign 更有优势。

![TDesign](https://user-images.githubusercontent.com/88708072/147124305-fbb74f9f-65b2-44f9-9f1c-e812ce63a547.gif)

## 仓库

TDesign 是一个 `multi-repo`， TDesign 有如下代码仓库：

### 桌面端组件库

| 仓库                                                            | 描述                  | 状态                                                                                                                                                                                                        |
| --------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [tdesign-vue-next](https://github.com/Tencent/tdesign-vue-next) | TDesign Vue 组件库    | [![LTS](https://img.shields.io/badge/dynamic/json?style=flat-square&label=LTS&query=version&url=https://registry.npmjs.org/tdesign-vue-next/latest&color=blue)](https://npmjs.com/package/tdesign-vue-next) |
| [tdesign-react](https://github.com/Tencent/tdesign-react)       | TDesign React 组件库  | [![LTS](https://img.shields.io/badge/dynamic/json?style=flat-square&label=LTS&query=version&url=https://registry.npmjs.org/tdesign-react/latest&color=blue)](https://npmjs.com/package/tdesign-react)       |
| [tdesign-vue](https://github.com/Tencent/tdesign-vue)           | TDesign Vue2.x 组件库 | [![LTS](https://img.shields.io/badge/dynamic/json?style=flat-square&label=LTS&query=version&url=https://registry.npmjs.org/tdesign-vue/latest&color=blue)](https://npmjs.com/package/tdesign-vue)           |

### 移动端组件库

| 仓库                                                                    | 描述                        | 状态                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [tdesign-miniprogram](https://github.com/Tencent/tdesign-miniprogram)   | TDesign 微信小程序组件库    | [![LTS](https://img.shields.io/badge/dynamic/json?style=flat-square&label=LTS&query=version&url=https://registry.npmjs.org/tdesign-miniprogram/latest&color=blue)](https://npmjs.com/package/tdesign-miniprogram)         |
| [tdesign-mobile-vue](https://github.com/Tencent/tdesign-mobile-vue)     | TDesign Vue3.x 移动端组件库 | [![LTS](https://img.shields.io/badge/dynamic/json?style=flat-square&label=LTS&query=version&url=https://registry.npmjs.org/tdesign-mobile-vue/latest&color=blue)](https://npmjs.com/package/tdesign-mobile-vue)           |
| [tdesign-mobile-react](https://github.com/Tencent/tdesign-mobile-react) | TDesign React 移动端组件库  | [![Alpha](https://img.shields.io/badge/dynamic/json?style=flat-square&label=Alpha&query=version&url=https://registry.npmjs.org/tdesign-mobile-react/latest&color=orange)](https://npmjs.com/package/tdesign-mobile-react) |
| [tdesign-flutter](https://github.com/Tencent/tdesign-flutter)           | TDesign Flutter 组件库      | [![Alpha](https://img.shields.io/badge/dynamic/json?style=flat-square&label=Alpha&query=latest.version&url=https://pub.dev/api/packages/tdesign_flutter&color=orange)](https://pub.dev/packages/tdesign_flutter)          |
| [tdesign-uniapp](https://github.com/Tencent/tdesign-miniprogram)        | TDesign Uniapp 组件库       | [![Alpha](https://img.shields.io/badge/dynamic/json?style=flat-square&label=Alpha&query=version&url=https://registry.npmjs.org/@tdesign/uniapp/latest&color=orange)](https://npmjs.com/package/@tdesign/uniapp)           |

### 基础通用仓库

| 仓库                                                        | 描述                 |
| ----------------------------------------------------------- | -------------------- |
| [tdesign](https://github.com/Tencent/tdesign)               | TDesign 主仓库和文档 |
| [tdesign-icons](https://github.com/Tencent/tdesign-icons)   | TDesign 公共图标     |
| [tdesign-common](https://github.com/Tencent/tdesign-common) | TDesign 公共样式     |

### 解决方案及周边

| 仓库                                                                                                | 描述                                        |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [tdesign-starter-cli](https://github.com/Tencent/tdesign-starter-cli)                               | TDesign 解决方案的脚手架                    |
| [tdesign-vue-starter](https://github.com/Tencent/tdesign-vue-starter)                               | 基于 tdesign-vue 的解决方案                 |
| [tdesign-vue-next-starter](https://github.com/Tencent/tdesign-vue-next-starter)                     | 基于 tdesign-vue-next 的解决方案            |
| [tdesign-react-starter](https://github.com/Tencent/tdesign-react-starter)                           | 基于 tdesign-react 的解决方案               |
| [tdesign-miniprogram-starter-retail](https://github.com/Tencent/tdesign-miniprogram-starter-retail) | 基于 tdesign-miniprogram 的零售行业解决方案 |

## 为什么会有 TDesign

在过去，腾讯有许多设计体系和组件库类型的项目，围绕产品做“去中心化”的快速迭代。

2019 年腾讯成立了[开源协同委员会](https://m.thepaper.cn/yidian_promDetail.jsp?contid=4653692&from=tdesign)，通过内部开源协同的方式，把同类技术产品的不同团队组织到一起共建。

TDesign 正是腾讯开源协同下前端和设计领域的协作产物，期待共建出一个完善且通用的设计体系和组件库产品。

![image](https://user-images.githubusercontent.com/7600149/147126818-0e5a5b2d-a833-4107-b654-442f3a1098c5.png)

## TDesign 的发展

TDesign 在创建之初就秉承开源协作的原则，包括源代码在内的[协作方案讨论](https://github.com/Tencent/tdesign/wiki)、[组件设计](https://github.com/Tencent/tdesign/wiki)及 [API 制定](https://github.com/Tencent/tdesign/wiki)的过程也完全在公司内部开放，得到了内部开发和设计同学的广泛关注。无论以什么身份参与，TDesign 都同样遵循平等、公开、严格的原则来对待。

很多同学从个人项目中试用组件库开始，到提交第一个 `Bug Issue`，再到提交第一个 `Feature MR`，最后逐步参与到 `Code Review` 和方案制定工作中，成为核心贡献者。在过去的一年中，TDesign 关闭了 1k+ `Issue`，进行了 5k+ 次 `CR`，保持 [每周迭代](https://tdesign.tencent.com/vue/components/changelog) 发布新版本。

组件库目前支持[多个端和主流技术栈](#仓库)，桌面端 Vue2、Vue3、React 和移动端 Vue3、微信小程序均已发布 1.x 版本，移动端 React、Flutter 和 Uniapp 已发布 `Alpha` 内测版本。

## 为什么开源

通过开源，TDesign 期望持续打磨出更加完善易用的组件库，收获丰富的生态。

借助社区，TDesign 期望与更多产品设计和开发者持续交流，成为更加有价值的产品。

对 TDesign 而言，开源是一个新的起点。

TDesign 后续发展规划请参阅 [后续计划](https://github.com/Tencent/tdesign/projects/1)。

## 产品特性

#### 完整

- 支持了 [Vue 2](https://tdesign.tencent.com/vue/)、[Vue 3](https://tdesign.tencent.com/vue-next/)、[React](https://tdesign.tencent.com/react/) 和移动端 [Vue 3](https://tdesign.tencent.com/vue-mobile/)、[微信小程序](https://tdesign.tencent.com/miniprogram/) 的开发，其他技术栈如 Flutter 正在开发中
- 提供丰富多样的[设计资源](#设计资源)，包括 Figma、Adobe XD、Sketch 等，将设计师从重复劳动中释放出来
- 提供辅助设计工具如 [Sketch 设计插件](https://tdesign.tencent.com/source)，也支持在腾讯 CoDesign、即时设计、Pixso、墨刀等市面常用设计工具中使用

![image](https://user-images.githubusercontent.com/7600149/147127234-7961b616-90b6-4197-8676-c041c161ac0d.png)

#### 一致

- 拥有统一的[价值观](https://tdesign.tencent.com/design/values)和[视觉风格](https://tdesign.tencent.com/design/color)，帮助产品在跨端设计和开发过程中保持一致的产品使用体验
- 各技术栈产物 [API 定义](https://tdesign.tencent.com/apis)和实现保持一致，在构建统一/多端覆盖/跨技术栈的前端应用时更有优势

![image](https://user-images.githubusercontent.com/7600149/168031968-267c60f1-efaa-498d-a230-a6e0a8093402.png)

#### 易用

- 提炼不同业务、场景的设计经验，提供通用的设计指南以降低使用门槛
- 支持使用者通过 [Design Token](https://tdesign.tencent.com/design/color#header-21) 对设计风格进行扩展
- 提供 [Starter Kit](https://tdesign.tencent.com/starter/) 帮助使用者快速上手

![image](https://user-images.githubusercontent.com/7600149/147127377-6f7e95f6-cfa8-459a-86e0-058c545d34f3.png)

## 文档

- [介绍](https://tdesign.tencent.com/about/introduce)
- [参与贡献](https://tdesign.tencent.com/about/contributing)
- [基础组件](https://tdesign.tencent.com/)
- [解决方案](https://tdesign.tencent.com/starter/)
- [中后台设计指南](https://tdesign.tencent.com/design/offices)

更多文档在 [TDesign 官网](https://tdesign.tencent.com/)。

## 设计指南

TDesign 将腾讯内部多年设计经验提炼总结为专业的设计指南，提供的通用设计解决方案。

- [价值观](https://tdesign.tencent.com/design/values)
- [色彩](https://tdesign.tencent.com/design/color)
- [字体](https://tdesign.tencent.com/design/fonts)
- [动效](https://tdesign.tencent.com/design/motion)
- [图标](https://tdesign.tencent.com/design/icon)
- [布局](https://tdesign.tencent.com/design/layout)
- [深色模式](https://tdesign.tencent.com/design/dark)

更多内容参考每个组件的指南部分，例如：[Button](https://tdesign.tencent.com/vue/components/button?tab=design)。

## 设计资源

为了实现开发与设计之间的高效协同，TDesign 中包含了丰富可复用的设计组件资源：

- [Figma 设计资源](https://www.figma.com/@tencent)
- [Sketch、Axure、Adobe XD 等设计资源](https://tdesign.tencent.com/source)
- [TDesign Maker: 一款来自 TDesign 的 Sketch 插件](https://tdesign.tencent.com/source)

## 贡献者

❤️ 感谢 TDesign 所有的贡献者。可以访问我们的贡献者照片墙查看所有贡献者 https://tdesign.tencent.com/contributor.html

## 参与贡献

请参照[《如何贡献》](https://tdesign.tencent.com/about/contributing)文档。

## 开源协议

TDesign 使用 [MIT 协议](./LICENSE)。
