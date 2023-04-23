---
title: 从构思到生产：一个组件的诞生
---

### 简介

本文详细介绍了一个组件从构思到生产上线的全过程，TDesign 官方需要维护多个技术栈，保证各个技术栈的同个组件实现（UI/API 功能）一致是团队优先需要考虑的问题之一，在过去招募开发组件的过程中，团队总结了一套通过流程和工具来解决这个问题的经验：

<img width="100%" alt="组件流程" src="https://user-images.githubusercontent.com/7600149/150783157-d4947506-e68a-4d08-915f-85dea1df8080.png">

### 收集需求、评估

- PMC 同学从 issue、论坛或业务使用群中收集新组件需求，PMC 提出讨论，协商一致确定新组件满足“通用性”与“必要性”的要求。
- 向设计师同学同步新组件设计需求，需要提供必要的组件功能说明、业务使用样例截图或业界其他组件库中类似组件的链接等
- 设计师同学排期安排产出交互稿，确定后续负责设计稿的设计同学
- 在主仓库里 [新组件招募](https://github.com/Tencent/tdesign/issues/220) 里新增组件类型，状态标记为“待启动”

所以如果你需要一个新组件或者组件新功能，请务必先创建 issue 并提供相关的交互演示、类似组件的链接等信息，你可以在主仓库中找到如下创建 issue 的入口，请选择适合你类型的 issue 模板：

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233825362-243fc802-062c-46fa-8608-164fdeb0ad49.png">

## 准备阶段

- 在 TDesign 周报、内部论坛、issue、内外部群等渠道持续招募各角色贡献者：UI 开发同学、API 制定者、各技术栈开发同学（角色只用于明确开发职责，可以都是同一位同学，招募时可以询问是否愿意承担相应的职责）
- UI 开发、API 制定及某个技术栈开发角色招募到位后，就可以拉企业微信群介绍组件相关情况，包括但不限于：宣讲各参与人职责、交互稿地址、相关开发、设计指引文档等。API 制定者需要根据现有设计稿及业界类似组件实现，制定一份 API 初稿，并约相关组件参与者进行线上会议评审
- 线上评审会
  - 必需参与的角色：技术栈 PMC 负责同学、交互设计师、视觉设计师、UI 开发同学、API 制定者、各技术栈开发同学
  - 讨论内容：API 设置是否满足业务场景需求，是否留有扩展空间（组件易用性与灵活性 trade-off）；API 描述等是否框架无关，能够在多个技术栈中实现；交互稿是否满足需求，是否提供了所有场景的 demo
  - 会后需要明确交互稿调整后定稿时间
- 交互设计师撰写该组件的设计指南（例：https://tdesign.tencent.com/vue-next/components/button?tab=design）
- 视觉设计师根据调整后的交互稿，产出设计稿及时在群中同步
- 负责组件进展的 PMC 同学录入 API 管理平台：https://github.com/Tdesignoteam/tdesign-api

tdesign-api 提供了一个可以本地运行的、有 UI 界面的 API 维护平台：

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233825592-ed541243-8937-4b03-a31d-ac583bcb5d5a.png">

在 API 制定阶段大家会遵循一些已经被认为行之有效的原则，比如通过抽象的 `TNode` 概念来描述那些 Vue/React 技术栈中特定语法糖的内容，参见 [组件 API 制定指引](https://github.com/Tencent/tdesign/wiki/component-api-guide)。录入平台后的 API 描述会生成该组件开发所需的相关文件，对于该组件的开发者来说你需要通过 cli 工具或者 tdesign-api 项目的 GitHub Action 自动触发对对应技术栈的分支提交，如果你对如何生成这些文件存有疑问，请联系这个组件负责的 PMC 同学寻求帮助：

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233825825-a0a87de3-ce7a-4be5-ad57-f8d08ab3d12d.png">

## 开发阶段

- 负责 UI 开发的同学按照设计稿独立在 [common](https://github.com/Tencent/tdesign-common) 中开发组件 UI（LESS），UI demo 需要包括交互稿中给出的各类使用场景的静态样式。提交 PR 后在群中同步信息，如果有其他技术栈开发同学需要与 PMC 同学一起 CR UI 实现，没问题后合入 PR
- 组件开发：各技术栈开发同学使用 cli 工具拉取生成本技术栈的组件 API 定义相关文件（例：https://github.com/Tencent/tdesign-vue/blob/develop/src/button/props.ts），根据定义文件和 UI 实现进行组件逻辑开发
- 开发完成后提交 PR，各 CI 环节执行通过后需要邀请 PMC 同学进行 CR，如果在提交 PR 过程中遇到问题，可以先参考指引：https://tdesign.tencent.com/about/contributing

### why Git submodule？

你可能注意到了各个技术栈组件仓库中都有一个指向 [common](https://github.com/Tencent/tdesign-common) 的 submodule，这是为了保证各个技术栈的同个组件 UI 实现和 DOM 结构一致，各仓库不会各自维护任何组件样式代码，当 UI 需要调整时，统一在 common 仓库修改，再同步各仓库。

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233826152-e0ea729a-2073-42a9-a801-d2f37bd1994f.png">

Git submodule 是个在多个仓库间同步代码不错的方案，后续 TDesign 也有可能改为在各个仓库中以 npm 包引入 UI 产物 CSS 的方式，但在这之前你还需要熟悉 submodule 的日常操作。

## 验收阶段

- CR 问题修复后，邀请交互、视觉设计师同学参与走查验收，对照 PR 上预览官网地址走查组件 demo 实现情况
- 视觉设计师需要设计该组件的一个缩略图，以在 [组件概览](https://tdesign.tencent.com/vue-next/overview) 页展示
- PMC 同学上传缩略图到 TDesign 公共 COS 服务，生成图片链接给组件开发同学，在 [common overview](https://github.com/Tencent/tdesign-common/blob/develop/docs/web/overview.md) 文档中新增组件预览入口，并更新该分类下组件数量
- PR 合入 develop，准备发布
- PMC 同学收集各位参与同学 GitHub 账号，更新到贡献者维护系统中

当所有这些环节完成后，一个组件才会走完从需求到发布的完整流程，我们也曾尝试过更简单、更“快速”的流程，但最终会发现在组件质量、配套设计资源等方面存在问题，还得回炉返工，如果你有更好的建议也欢迎在仓库中启动一个 discussions 来讨论。
