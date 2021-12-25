---
title: 如何贡献
---

在正式参与 TDesign 贡献前，请务必先阅读本篇内容。

### 行为准则

这里有一份 [行为准则](https://github.com/Tencent/tdesign/blob/main/docs/CODE_OF_CONDUCT.md) 希望你能在任何时候都严格遵守，帮助维护良好的协作与讨论氛围。

### 透明的开发

TDesign 目前的工作都以 issue 的形式在 GitHub 上进行。不管是核心团队的成员还是外部贡献者的 pull request 都需要经过同样流程的 review。

### Issue 反馈

TDesign 使用 Github issues 进行 bug 报告和新 feature 建议。在报告 bug 之前，请确保已经搜索过类似的 问题，因为它们可能已经得到解答或正在被修复。对于已存在的 issue，你可以提供想法参与讨论或者评论认领后着手开始处理，仅仅评论 “+1” 并不能帮助问题得到快速解决。

对于 bug 反馈和新 feature，我们都提供了相应的 issue 模板，请尽量完善所有信息并提供在线样例，这能让 issue 得到快速响应。

### 提交 Pull Request

- 请将本项目 fork 至个人空间，clone 至本地后，通过 `git remote add upstream` 指令添加上游库地址，参考 [Configuring a remote for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork)
- 确保 npm 版本为 7.0.0 及以上
- 创建 feature/fix 分支，开发过程中可以使用 `git fetch upstream` 或 `git rebase upstream/feature` 来同步上游分支代码
- 提交代码到 forked 仓库，commit message 撰写请参照 [Angular Commits 规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)
- 本地执行 `npm run lint` 及 `npm run test` 并保证结果通过，当修改了样式导致 snapshot 不一致的情况，可以通过 `npm run test:node -- -u` 和 `npm run test:test -- -u` 指令来更新 snapshot 并提交上来
- 在上游仓库中发起 PR，如有相关的 issue，请进行 [关联](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
- 提交 PR 会触发自动化 CI 环节，如果 CI 未通过请重新在本地执行第 4 步中的测试流程
- 会有 PMC 同学来 CR 本次提交的代码，请及时关注 CR 评论通知信息

参与某个技术栈贡献时，请参照仓库中的 `DEVELOP_GUIDE.md` 来进行本地开发工作。

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
