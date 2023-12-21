---
title: 如何贡献
---

### 参与贡献

TDesign 的大部分协作都是在 Github 完全公开透明地进行的，如果你有兴趣为 TDesign 的建设贡献一份力量，随时欢迎修复问题和提交新的功能。同时，我们的成员会持续观察不同方向的仓库的活跃贡献者，如果我们觉得你的提交、贡献与我们的想法大部分时间都是一致的，而且也有可能长期合作下去，我们会主动联系你，让我们更进一步地在这个开源项目上合作，当然了，项目也会时不时给你发放一些福利 🎁。

在开始贡献之前，可以先阅读以下的行为准则和协作规范指南。

### 行为准则

这里有一份 [行为准则](https://github.com/Tencent/tdesign/blob/main/docs/CODE_OF_CONDUCT.md) 希望你能在任何时候都严格遵守，帮助维护良好的协作与讨论氛围。

### 透明的开发

TDesign 目前的工作都以 issue 的形式在 GitHub 上进行。不管是核心团队的成员还是外部贡献者的 pull request 都需要经过同样流程的 review。

### Issue 反馈

TDesign 使用 Github issues 进行 bug 报告和新 feature 建议。在报告 bug 之前，请确保已经搜索过类似的 问题，因为它们可能已经得到解答或正在被修复。对于已存在的 issue，你可以提供想法参与讨论或者评论认领后着手开始处理，仅仅评论 “+1” 并不能帮助问题得到快速解决。

对于 bug 反馈和新 feature，我们都提供了相应的 issue 模板，请尽量完善所有信息并提供在线样例，这能让 issue 得到快速响应。

### 发现任务

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178890236-80533a12-840a-43d1-b061-193a8021272f.png">

各仓库下有很多打了 `help wanted` 的 label 的 issue，都是初步经过筛选能够复现的 Bug 或是正在招募贡献者参与的 feature，例如 [tdesign-vue issues](https://github.com/Tencent/tdesign-vue/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)，你可以点击这个标签筛选出所有 `help wanted` 的 issue。

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178891977-71e52b65-56c4-439c-aa5d-e279c9395e59.png">

如果想认领该任务，请在 issue 评论区中留言后再着手处理防止重复认领，最好附带预估提交 PR 时间的信息，之后负责跟进的 PMC 同学会将 issue label 改为 `in progress`。

### 提交 Pull Request

#### Fork 仓库

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178892360-b999ecbd-c875-484b-b58f-279daf9815af.png">

请将仓库 fork 至个人空间后再 clone 至本地，官方仓库有权限限制，除 PMC 成员外其他同学不能提交代码或新建分支。

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178904260-54aac4b4-989c-4572-9262-601f5ebf4af8.png">

请使用 SSH 方式 clone 仓库，TDesign 的一些仓库使用了 git submodule 方式来额外引入 [Tencent/tdesign-common](https://github.com/Tencent/tdesign-common) 中的公共样式，使用 HTTPS 方式可能会导致后续更新 submodule 目录失败。

```Shell
$ git clone git@github.com:${USER}/${PROJECT}.git
```

本地环境请确保 Node 版本在 12.0.0 及以上，建议升级到 16.0.0 及以上，我们一般只保证当前 Node LTS 版本下项目运行正常。

#### 设置 Git 账户信息

请不要使用公司内部 Git 账号直接提交代码，这可能会在 commit 历史中暴露你的 ID 或公司邮箱等信息，可以通过如下方式设置本地仓库的 Git 信息：

```Shell
## cd ${PROJECT} 本地仓库目录
$ git config user.name "your name"
$ git config user.email "your email address"
```

#### 同步代码

在每次提交本地代码前，建议都从上游仓库同步最新代码，否则你可能要额外处理很多冲突。GitHub 提供了页面上操作同步上游仓库的能力：

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178912927-5b1c7bcc-023e-446c-acfd-1e08278740b2.png">

但仍然建议在 clone 仓库至本地后通过添加 upstream 的方式来关联远端上游仓库：

```Shell
$ git remote add upstream https://github.com/Tencent/${PROJECT}.git
$ git remote -v
> origin    git@github.com:${USER}/${PROJECT}.git (fetch)
> origin    git@github.com:${USER}/${PROJECT}.git (push)
> upstream    https://github.com/Tencent/${PROJECT}.git (fetch)
> upstream    https://github.com/Tencent/${PROJECT}.git (push)
```

这样你可以直接在本地通过如下方式将 upstream 官方仓库的改动同步到本地：

```Shell
git fetch upstream
git rebase upstream/develop
```

参考 [Configuring a remote for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork)

#### 创建 PR

在同步官方仓库代码后，请从 develop 分支（TDesign 仓库均以 develop 作为默认最新的开发分支）创建新的 feat/fix 分支：

```Shell
git checkout develop
git checkout -b feat/xxx
```

feat 指代新特性如新组件或者组件新功能，日常问题修复以 fix 开头。

#### 在提交代码前

参与某个技术栈贡献时，请参照仓库中的 `DEVELOP_GUIDE.md` 来进行本地开发工作。

本地开发完成后，需要执行 `npm run lint` 及 `npm run test` 并保证结果通过。

- lint 指令会检查本次提交的代码是否通过了 eslint 检查，某些未通过的代码可以通过执行 `npm run lint:fix` 来自动修复。
- test 指令会检查本次改动影响了哪些组件的 snapshot，比如改动了 Button 的实现，其他依赖了 Button 的 Dialog/InputNumber 等组件的 snapshot 也可能会有相应变动，请仔细检查这些差异是否符合预期，这可以防止本次修改和相关联组件发生不可预料的变动。确认无误后可以通过 `npm run test:update` 指令来更新 snapshot 并提交上来

#### 提交代码

```Shell
git add .
git commit -m "feat: button commit message"
git push origin feat/xxx
```

commit message 撰写请参照 [Angular Commits 规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)，一般来说 commit 信息将遵照下面的约定：

- feat：新功能
- fix：修补 bug
- docs：文档类变动
- style：样式
- refactor：重构
- test：增加测试
- chore：构建过程或辅助工具的变动

#### 发起 PR

提交代码后你个人的 forked 的仓库主页会出现提示是否发起合并，当然你也可以直接在 Pull requests 页点击发起：

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178922037-bafd6c85-b7be-4b5e-aa67-2b62ffa7a52b.png">

之后会自动跳转到官方仓库 Comparing changes 页面，确认提交内容无误后可以点击 “Create pull request” 按钮。

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178922547-ffd23594-f712-4075-bd9d-8bd3e5d80f9a.png">

TDesign 提供了标准的 PR 模板，这是完善 PR 信息的最后一步，需要认真阅读内容正确填写本次 PR 的信息，后续组件库发版时会直接根据 PR 信息生成更新日志：

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178923906-b0a3046a-0e5e-48eb-86d0-fe7a651da031.png">

参考案例：https://github.com/Tencent/tdesign-vue/pull/1150

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178924958-8e044f11-551a-485f-b596-e7994300a2c9.png">

关联 issue 后会在对应 issue 中展示本次 PR 的链接信息，有助于将用户反馈与你的代码实现关联起来，方便以后回溯问题：https://github.com/Tencent/tdesign-vue/issues/1143

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178925507-d43dfb11-5628-4b72-a63a-2be11eb4229f.png">

[为什么要关联 issue？](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

PR 信息填写完整后就可以点击确认发起本次 PR，这会触发一系列 CI 环节在远端执行 `npm run lint` 及 `npm run test` 等，如果有 CI 失败的情况，请点击 “detail” 查看报错详情：

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178926235-7f05f4a7-3d29-4d93-9322-37ffcc2c525f.png">

这一般是因为 lint 失败或者 snapshot 未更新，请参照上文“在提交代码前”章节执行

#### Review PR

提交 PR 后会有 PMC 同学来 CR 本次提交的代码，相关信息会评论在 PR 中，请及时关注 CR 评论通知信息：
https://github.com/Tencent/tdesign-vue/pull/1150

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178926813-9e32e5d6-e62e-4537-9c6f-4ef2748f3451.png">

当所有 Review 通过，CI 正常后 PMC 同学会 approve 并将 PR 合并到开发分支。
恭喜你 🎉，到这里为止你已经为 TDesign 贡献了第一次代码！希望你再接再厉持续参与，你的名字和 PR 信息将出现在最近一次迭代的 Changelog 中：

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178928257-623e9410-26b7-4b72-9779-57d773bf7acd.png">
