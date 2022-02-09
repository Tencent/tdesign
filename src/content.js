import { h } from 'vue';
import { Popup } from 'tdesign-vue-next';
import TDesignIM from './assets/TDesign-IM.png';

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
              { default: () => h('a', null, '微信群') }
            ),
            '。',
          ],
        }
      ),
    introOne: ({ faqUrl, changeLogUrl, issuesUrl }) =>
      h(
        'div',
        { class: 'content-text' },
        {
          default: () => [
            '在发布一个 Issue 前，请确保：',
            h('br'),
            '1. 在 ',
            h('a', { href: faqUrl, target: '_blank' }, '常见问题'),
            '、',
            h('a', { href: changeLogUrl, target: '_blank' }, '更新日志'),
            ' 和 ',
            h('a', { href: issuesUrl, target: '_blank' }, '旧Issue列表 '),
            '中搜索过你的问题。（你的问题可能已有人提出，也可能已在最新版本中被修正）',
            h('br'),
            '2. 如果你发现一个已经关闭的旧 Issue 在最新版本中仍然存在，不要在旧 Issue 下面留言，请建一个新的 issue。',
          ],
        }
      ),
    introWarningMsg: '注意：不符合issue规定将会被关闭',
    introWarningBtn: '什么是 Good Issue？',
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
      { label: 'Feature', value: 'New' },
    ],
    versionRepositoryLabel: '相关版本',
    versionRepositoryTip: '请检查在最新项目版本中能否重现此 issue。',
    versionStructureLabel: '框架版本 / 基础库版本',
    versionStructurePlaceholder: 'Vue(3.2.12) / React(17.0.2) / 小程序(v2.1.3)',
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
    pictureTipPlaceholder:
      '请输入内容 (如需上传图片，请先输入图片名称，在预览时上传图片并替换图片名称)',
    placeholder: '请输入内容',
    preview: '预览',
    valid: {
      repo: '请选择相关仓库',
      title: '请填写 Issue 标题',
      type: '请选择 Issue 类别',
      versionRepository: '请选择项目的版本',
      versionStructure: '请填写框架版本 / 基础库版本',
      versionSystem: '请填写系统、浏览器',
      reproduce: '请填写重现链接',
      steps: '请填写重现步骤',
      expected: '请填写期望的结果',
      actual: '请填写实际的结果',
      functionContent: '请填写这个功能解决的问题',
      functionalExpectations: '请填写你建议的方案是什么？',
    },
    functionContentLabel: '这个功能解决了什么问题',
    functionContentTip:
      '请详尽说明这个需求的用例和场景。最重要的是：解释清楚是怎样的用户体验需求催生了这个功能上的需求。我们将考虑添加在现有 API 无法轻松实现的功能。新功能的用例也应当足够常见。',
    functionalExpectationsLabel: '你建议的方案是什么？',
  },
};
