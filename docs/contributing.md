---
title: How to Contribute
---

### Getting Involved in Contribution

Most of TDesign's collaboration takes place on Github transparently and openly. If you're interested in contributing to the development of TDesign, feel free to fix issues and submit new features at any time. Additionally, our members will continue to observe active contributors in different repositories. If we find that your submissions and contributions align with our ideas most of the time, and there is a possibility of long-term collaboration, we will contact you proactively to further our collaboration on this open-source project. Of course, the project may also occasionally offer you some benefits 🎁.

Before starting to contribute, please read the following code of conduct and collaboration guidelines.

### Code of Conduct

Here is a [Code of Conduct](https://github.com/Tencent/tdesign/blob/main/docs/CODE_OF_CONDUCT.md) that we hope you strictly adhere to at all times to maintain a good atmosphere for collaboration and discussion.

### Development

Currently TDesign's work is carried out in the form of issues on GitHub. Both core team members and external contributors' pull requests are subject to the same review process.

### Report Issues

TDesign uses Github issues for bug reports and new feature suggestions.
Before reporting a bug, please make sure you have searched for similar problems, as they may have already been answered or are being fixed. For existing issues, you can contribute ideas to the discussion or comment to claim and start working on them. Simply commenting `+1` will not help solve the problem faster.

For bug reports and new feature suggestions, we provide corresponding issue templates. Please try to complete all the information and provide an online sample, as this will allow the issue to receive a prompt response.

### Discover Tasks

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178890236-80533a12-840a-43d1-b061-193a8021272f.png">

There are many issues labeled with `help wanted` that have been initially filtered as reproducible bugs or features for which contributors are being recruited, such as [tdesign-vue issues](https://github.com/Tencent/tdesign-vue/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). You can click on this label to filter out all issues tagged with "help wanted".

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178891977-71e52b65-56c4-439c-aa5d-e279c9395e59.png">

If you want to claim a task, please leave a message in the issue comment section to prevent duplicate claims, preferably with an estimated PR submission time. Repository owners will change the issue label to `in progress`.

### Submit Pull Request

#### Fork Repository

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178892360-b999ecbd-c875-484b-b58f-279daf9815af.png">

Please fork the repository to your personal space before cloning it locally.
The official repository has access restrictions; Contributors other than administrators and writers of repository cannot submit code or create new branches.

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178904260-54aac4b4-989c-4572-9262-601f5ebf4af8.png">

Please clone repository by using SSH since some repositories of TDesign use git submodule to maintain [Tencent/tdesign-common](https://github.com/Tencent/tdesign-common) the shared styles and utils, and using HTTPS may cause subsequent submodule directory updates to fail.

```Shell
$ git clone git@github.com:${USER}/${PROJECT}.git
```

Please make sure that your local environment has Node version `12.0.0` or above. It is recommended to upgrade to `16.0.0` or higher, as we generally only guarantee that the project runs correctly under the current Node LTS version.

#### Git Account Configuration

Please do not use your company's internal Git account to directly submit code, as this may expose your ID or company email information in the commit history. You can set your local repository's Git information with the following method:

```Shell
## cd ${PROJECT}
$ git config user.name "your name"
$ git config user.email "your email address"
```

#### Code Synchronization

Before each commit of your local, it is recommended to synchronize the latest code from the upstream repository, otherwise, you may have to deal with many conflicts. GitHub also provides the ability to synchronize the upstream repository directly from the web interface:

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178912927-5b1c7bcc-023e-446c-acfd-1e08278740b2.png">

It is recommended to associate the remote upstream repository by adding `upstream` after cloning it to your local machine: This way, you can directly synchronize the changes from the upstream official repository to your local repository with the following steps:

```Shell
$ git remote add upstream https://github.com/Tencent/${PROJECT}.git
$ git remote -v
> origin    git@github.com:${USER}/${PROJECT}.git (fetch)
> origin    git@github.com:${USER}/${PROJECT}.git (push)
> upstream    https://github.com/Tencent/${PROJECT}.git (fetch)
> upstream    https://github.com/Tencent/${PROJECT}.git (push)
```

Your can synchronize the change from upstream repository to your local repository by the follow way：

```Shell
git fetch upstream
git rebase upstream/develop
```

Refer tot [Configuring a remote for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork)

#### Create Pull Request

Please create a new feat/fix branch from the develop branch (TDesign repositories use develop as the default latest development branch) after synchronizing the official repository's code,

```Shell
git checkout develop
git checkout -b feat/xxx
```

`feat` refers to new features such as new components or new functionality for existing components, while regular issue fixes start with `fix`.

#### Before submitting commit

When contributing to a specific repository, please refer to the `DEVELOP_GUIDE.md` in the repository for local development.

Once the local development is completed, please to execute `npm run lint` and `npm run test` to ensure the results pass.

- The `lint` command will check if the submitted code passes the eslint check. Some non-compliant code can be automatically fixed by executing npm run lint:fix.
- The `test` command will check which component snapshots have been affected by the changes, for example, if the implementation of the Button has been changed, the snapshots of other components that depend on the Button, such as Dialog/InputNumber, may also change accordingly. Please carefully check whether these differences meet the expectations to prevent unpredictable changes for this modification and the associated components. After confirming that everything is correct, you can execute `npm run test:update` to update the snapshot and submit it.

#### Submit commit

```Shell
git add .
git commit -m "feat: button commit message"
git push origin feat/xxx
```

Please follow [Angular Commits Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) to complete the commit message：

- `feat`: new feature
- `fix`: bug fix
- `docs`: modification for documentation
- `style`: modification for UI
- `refactor`: refactor
- `test`: add test
- `chore`：change for bundles, develop tools and workflow

#### Create Pull Request

After submitting your code, the homepage of your personal forked repository will prompt whether to initiate a merge.

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178922037-bafd6c85-b7be-4b5e-aa67-2b62ffa7a52b.png">

Afterward, it will be automatically redirected to the official repository's Comparing Changes page. Ensure that the submitted content is correct, then click the "Create pull request" button.

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178922547-ffd23594-f712-4075-bd9d-8bd3e5d80f9a.png">

TDesign provides a standard PR template, which is the final step in completing the PR information. Please read the content carefully and correctly fill in the information of this PR. The component library will generate update logs directly based on the Pull Request information when releasing a new version:

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178923906-b0a3046a-0e5e-48eb-86d0-fe7a651da031.png">

Refer to the pull request example：https://github.com/Tencent/tdesign-vue/pull/1150

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178924958-8e044f11-551a-485f-b596-e7994300a2c9.png">

After associating the issue, the link information of each Pull Request will be displayed in the corresponding issue. This helps to associate user feedback with your code implementation, making it easier to trace back issues in the future: https://github.com/Tencent/tdesign-vue/issues/1143

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178925507-d43dfb11-5628-4b72-a63a-2be11eb4229f.png">

[Why you nee to link issue？](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

After filling in the PR information completely, click Confirm to initiate this PR. This will trigger a series of CI steps to remotely execute npm run lint and npm run test, etc. If there are CI failures, click "detail" to view the error details.

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/178926235-7f05f4a7-3d29-4d93-9322-37ffcc2c525f.png">

Usually it is due to lint failures or unupdated snapshots. Please refer to the "Before submitting code" section earlier in this guide.

#### Review Pull Request

Once the Pull Request is submitted, reviewers will review the submitted code. The related information will be commented on in the Pull Request. Please pay attention to the comment notifications, and the such as：
https://github.com/Tencent/tdesign-vue/pull/1150

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178926813-9e32e5d6-e62e-4537-9c6f-4ef2748f3451.png">

Once all reviews are passed and the CI is in a normal state, the reviewers will approve and merge the PR into the development branch. Congratulations 🎉!
At this point, you have contributed your first code to TDesign! We hope you continue to actively participate, and your name and PR information will appear in the CHANGELOG of the most recent iteration.

<img width="500" alt="image" src="https://user-images.githubusercontent.com/7600149/178928257-623e9410-26b7-4b72-9779-57d773bf7acd.png">
