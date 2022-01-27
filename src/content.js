import { h } from 'vue';
import { Popup } from 'tdesign-vue-next';
import TDesignIM from './assets/TDesign-IM.png'

export default {
  'zh-CN': {
    lang: 'zh-CN',
    introTitle: '欢迎你的参与',
    introCommunity: () =>
      h(
        'div',
        { class: 'content-text' },
        {
          default: () => [
            'TDesign 的 Issue 列表接受 bug 报告或是新功能请求。也可加入官方社区：',
            h(
              Popup,
              {
                content: () =>
                  h('img', {
                    style: {
                      width: '112px',
                      height: '112px',
                      display: 'block',
                    },
                    src: TDesignIM,
                  }),
                showArrow: true,
              },
              { default: () => h('a', null, '企业微信') }
            ),
            '。',
          ],
        }
      ),
    introOne: () =>
      h(
        'div',
        { class: 'content-text' },
        {
          default: () => [
            '在发布一个 Issue 前，请确保：',
            h('br'),
            '1. 在 ',
            h('a', null, '常见问题'),
            '、',
            h('a', null, '更新日志'),
            ' 和 ',
            h('a', null, '旧issue列表 '),
            '中搜索过你的问题。（你的问题可能已有人提出，也可能已在最新版本中被修正）',
            h('br'),
            '2. 如果你发现一个已经关闭的旧 Issue 在最新版本中仍然存在，不要在旧 Issue 下面留言，请建一个新的 issue。',
          ],
        }
      ),
    introWarningMsg: '注意：不符合issue规定将会被关闭',
    introWarningBtn: '什么是 Good Issue？',
    explainTitle: '为什么要有这么严格的 Issue 规定？',
    explain: () =>
      h(
        'div',
        { class: 'content-text' },
        {
          default: () => [
            h(
              'p',
              null,
              '维护开源项目是非常辛苦的工作。随着 TDesign 在社区越来越受欢迎，我们每天都在收到越来越多的问题、bug 报告、功能需求和 Pull Requests。作为一个完全免费使用的开源项目，TDesign 项目的维护人手是有限的。这意味着想要让项目长期的可持续发展，我们必须：'
            ),
            h('ol', null, {
              default: () => [
                h(
                  'li',
                  null,
                  '给予更具体的工作更高的优先级（比如 bug 的修复和新功能的开发）；'
                ),
                h('li', null, '提高 Issue 处理的效率。'),
              ],
            }),
            h(
              'p',
              null,
              '针对（1），我们决定将 GitHub Issue 列表严格地限制用于有具体目标和内容的工作。问题和讨论应当发送到更适合它们的场合。'
            ),
            h(
              'p',
              null,
              '针对（2），我们发现影响 Issue 处理效率的最大因素是用户在开 Issue 时没有提供足够的信息。这导致我们需要花费大量的时间去跟用户来回沟通，只为了获得一些基本信息好让我们对 Issue 进行真正的分析。这正是我们开发 Issue Helper 的理由：我们要确保每个新 Issue 都提供了必需的信息，这样能节省维护者和开发者双方的时间。'
            ),
            h(
              'p',
              null,
              '最重要的是，请明白一件事：开源项目的用户和维护者之间并不是甲方和乙方的关系，issue 也不是客服。在开 Issue 的时候，请抱着一种「一起合作来解决这个问题」的心态，不要期待我们单方面地为你服务。'
            ),
          ],
        }
      ),
    explainBtn: '我知道了',
    repos: [
      {
        name: 'tdesign',
        github: 'Tencent/tdesign',
        npm: '',
      },
      {
        name: 'tdesign-vue',
        github: 'Tencent/tdesign-vue',
        npm: 'tdesign-vue',
      },
      {
        name: 'tdesign-vue-next',
        github: 'Tencent/tdesign-vue-next',
        npm: 'tdesign-vue-next',
      },
      {
        name: 'tdesign-react',
        github: 'Tencent/tdesign-react',
        npm: 'tdesign-react',
      },
      {
        name: 'tdesign-miniprogram',
        github: 'Tencent/tdesign-miniprogram',
        npm: 'tdesign-miniprogram',
      },
      {
        name: 'tdesign-starter-cli',
        github: 'Tencent/tdesign-starter-cli',
        npm: 'tdesign-starter-cli',
      },
      {
        name: 'tdesign-common',
        github: 'Tencent/tdesign-common',
        npm: '',
      },
      {
        name: 'tdesign-vue-starter',
        github: 'Tencent/tdesign-vue-starter',
        npm: '',
      },
      {
        name: 'tdesign-vue-next-starter',
        github: 'Tencent/tdesign-vue-next-starter',
        npm: '',
      },
      {
        name: 'tdesign-icons',
        github: 'Tencent/tdesign-icons',
        npm: '',
      },
    ],
    issueTypesLabel: 'Issue 类别',
    repoSelectLabel: '相关仓库',
    issueTitleLabel: 'Issue 标题',
    issueTitlePlaceholder: '[组件名称] 描述问题的标题',
    issueTypes: [
      { label: 'Bug', value: 'Bug' },
      { label: '新功能', value: 'New' },
    ],
    versionRepositoryLabel: '相关版本',
    versionRepositoryTip: '请检查在最新项目版本中能否重现此 issue。',
    versionStructureLabel: '框架版本',
    versionStructurePlaceholder: 'Vue(3.2.12) / React(17.0.2)',
    versionSystemLabel: '系统、浏览器',
    versionSystemPlaceholder: 'MacOS(11.2.3)、Chrome(8.213.231.123)',
    versionNodeLabel: 'Node版本',
    reproduceLabel: '重现链接',
    reproduceTip:
      '请提供尽可能精简的 CodePen、CodeSandbox 或 GitHub 仓库的链接。请不要填无关链接，否则你的 Issue 将被关闭。',
    stepsLabel: '重现步骤',
    stepsTip:
      "请清晰的描述重现该 Issue 的步骤，这能帮助我们快速定位问题。没有清晰重现步骤将不会被修复，标有 'need reproduction' 的 Issue 在 7 天内不提供相关步骤，将被关闭。",
    expectLabel: '期望结果',
    actualLabel: '实际结果',
    remarksLabel: '补充说明',
    remarksTip: '可以是遇到这个 bug 的业务场景、上下文等信息。',
    pictureTipPlaceholder: '请输入内容 (如需上传图片，请先输入图片名称，在预览时上传图片并替换图片名称)',
    placeholder: '请输入内容',
    preview: '预览',
    valid: {
      repo: '请选择库名',
      title: '请填写 Issue 标题',
      type: '请选择 Issue 类别',
      versionRepository: '请选择项目的版本',
      versionStructure: '请选择框架版本',
      versionSystem: '请填写系统、浏览器',
      reproduce: '请填写重现链接',
      steps: '请填写重现步骤',
      expected: '请填写期望的结果',
      actual: '请填写实际的结果',
      functionContent: '请填写这个功能解决的问题',
      functionalExpectations: '请填写你建议的方案是什么？',
    },
    loadingText: '加载中',
    noMatchText: '无匹配数据',
    noDataText: '无数据',
    dialog: {
      header: 'Issue 预览',
      button: '创建',
    },
    functionContentLabel: '这个功能解决了什么问题',
    functionContentTip:
      '请详尽说明这个需求的用例和场景。最重要的是：解释清楚是怎样的用户体验需求催生了这个功能上的需求。我们将考虑添加在现有 API 无法轻松实现的功能。新功能的用例也应当足够常见。',
    functionalExpectationsLabel: '你建议的方案是什么？',
  },
};
