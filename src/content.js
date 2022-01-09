export default {
  'zh-CN': {
    lang: 'zh-CN',
    introTitle: '在你开始之前...',
    introOne: '首先，虽然我们为了中文用户的方便提供了中文的表单，但在填写时请',
    introWarningTitle: '不要用 Issue Helper 提使用问题！',
    introWarningContent: '这只会让 Issue 被立即关闭。如果有使用问题，可以加入官方社区求助：',
    introTwo: '对于使用中遇到的问题，请使用以下资源：',
    explainTitle: '为什么要有这么严格的 issue 规定？',
    explain: '维护开源项目是',
    repoSelectHint: '选择要提交 issue 的库',
    repos: [
      {
        name: 'naive-ui',
        github: 'TuSimple/naive-ui',
        npm: 'naive-ui',
      },
    ],
    issueTypesHint: 'Issue 类别',
    issueTitleHint: 'Issue 标题',
    issueTypes: [
      { label: 'Bug', value: 'Bug' },
      { label: '新功能', value: 'New' },
    ],
    versionRepositoryHint: '项目版本',
    versionVueHint: 'Vue版本',
    versionBrowserHint: '浏览器及其版本',
    versionSystemHint: '系统及其版本',
    versionNodeHint: 'Node版本（可选）',
    firstTipTitle: '版本',
    firstTip: '请检查在最新项目版本中能否重现此 issue。',
    reproduceHint: '重现链接',
    secondTipTitle: '重现链接',
    secondTip:
      '请提供一个尽可能精简的 CodePen、CodeSandbox 或是提供一个 GitHub 仓库的链接。请不要乱填一个链接，那只会让你的 issue 被直接关闭。',
    reproduceHintSamll: '什么是最小化重现，为什么这是必需的？',
    reproduceTitle: '关于重现',
    reproduceExplain:
      '所谓『重现』，就是一段可以运行并展示一个 bug 如何发生的代码。',
    reproduceExplainTitleOne: '文字是不够的',
    reproduceExplainParagraphOne:
      '如果你遇到一个问题，但是只提供了一些文字描述，我们是不可能修复这个 bug 的。首先，文字在描述技术问题时的表达难度和不精确性；其次，问题的真实原因有很多可能，它完全有可能是一个你根本没有提及的因素导致的。重现是唯一能够可靠地让我们理解问题本质的方式。',
    reproduceExplainTitleTwo: '重现必须是可运行的',
    keyWords: '截图和视频不是重现。',
    reproduceExplainParagraphTwo:
      '它们仅仅证明了 bug 的存在，但却不能提供关于 bug 是如何发生的信息。只有可运行的代码提供了完整的上下文，并让我们可以进行真正的 debug 而不是空想和猜测。当然，在提供的重现的前提下，视频或是 gif 动画可以帮助解释一些比较难用文字描述的交互行为。',
    reproduceExplainTitleThree: '重现应当尽量精简',
    reproduceExplainParagraphThree1:
      '有些用户会直接给我们一整个项目的代码，然后希望我们帮忙找出问题所在。此类请求我们通常不予接受，因为：',
    reproduceExplainParagraphThree2:
      '你对你的项目的代码结构可能已经非常熟悉，但我们并不是。阅读、运行、分析一个完全陌生的项目是极其耗费时间和精力的；',
    reproduceExplainParagraphThree3:
      '由于涉及了大量业务代码，问题可能是你的代码错误，而不是所使用库的 bug 所导致的。',
    reproduceExplainParagraphThree4:
      '一个最小化的重现意味着它精确地定位了 bug 本身 - 它应当只包含能够触发 bug 的最少量的代码。你应当尽可能地剔除任何跟该 bug 无关的部分。',
    reproduceExplainTitleFour: '如何提供一个重现',
    reproduceExplainParagraphFour:
      '提供一个尽可能精简的 CodePen、CodeSandbox 或是提供一个 GitHub 仓库的链接',
    stepsHint: '重现步骤',
    thirdTipTitle: '重现步骤',
    thirdTip:
      "打开重现后，我们需要执行哪些操作才能让 bug 出现？简洁清晰的重现步骤能够帮助我们更迅速地定位问题所在。请清晰的描述重现该 issue 的步骤，没有清晰重现步骤的 issue 将不会被修复。标有 'need reproduction' 的 issue 如果在 7 天内不提供相关步骤，将直接被关闭。",
    expectHint: '期望的结果是什么',
    actualHint: '实际的结果是什么',
    remarks: '补充说明（可选）',
    fourthTipTitle: '补充说明',
    fourthTip: '可以是遇到这个 bug 的业务场景、上下文等信息。',
    preview: '预览',
    valid: {
      repo: '请选择库名',
      title: '请填写 issue 标题',
      type: '请选择 issue 类别',
      versionRepository: '请选择项目的版本',
      versionVue: '请选择Vue版本',
      versionBrowser: '请填写浏览器及其版本',
      versionSystem: '请填写系统及其版本',
      reproduce: '请填写重现链接',
      steps: '请填写重现步骤',
      expected: '请填写期望的结果',
      actual: '请填写实际的结果',
      functionContent: '请填写这个功能解决的问题',
      functionalExpectations: '请填写你期望的 API',
    },
    loadingText: '加载中',
    noMatchText: '无匹配数据',
    noDataText: '无数据',
    dialog: {
      title: 'Issue 预览',
      button: '创建',
    },
    functionContent: '这个功能解决了什么问题',
    functionContentTipTitle: '这个功能解决了什么问题',
    functionContentTip:
      '请尽可能详尽地说明这个需求的用例和场景。最重要的是：解释清楚是怎样的用户体验需求催生了这个功能上的需求。Naive UI 的一个重要设计原则是保持 API 的简洁和直接。通常来说，我们只考虑添加在现有的 API 下无法轻松实现的功能。新功能的用例也应当足够常见。',
    functionalExpectations: '你期望的 API 是怎样的',
    functionalExpectationsTipTitle: '你期望的 API 是怎样的',
    functionalExpectationsTip:
      '描述一下你期望这个新功能的 API 是如何使用的，并提供一些代码示例。',
  },
};
