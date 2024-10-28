import * as github from '@actions/github';

const submodules = {
  "tdesign-vue": {
    "title": "## Vue2 for Web 发布",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-vue/refs/heads/main/CHANGELOG.md"
  },
  "tdesign-vue-next": {
    "title": "## Vue3 for Web 发布",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-vue-next/refs/heads/main/CHANGELOG.md"
  },
  "tdesign-react": {
    "title": "## React for Web 发布 ",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-react/refs/heads/main/CHANGELOG.md"
  },
  "tdesign-miniprogram": {
    "title": "## Miniprogram for WeChat 发布",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-miniprogram/refs/heads/main/CHANGELOG.md"
  },
  "tdesign-mobile-vue": {
    "title": "## Vue3 for Mobile 发布",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-mobile-vue/refs/heads/main/CHANGELOG.md"
  },
  "tdesign-flutter": {
    "title": "## Flutter for Mobile 发布",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-flutter/refs/heads/main/tdesign-site/CHANGELOG.md"
  },
  "tdesign-mobile-react": {
    "title": "## React for Mobile 发布",
    "changelogUrl": "https://raw.githubusercontent.com/Tencent/tdesign-mobile-react/refs/heads/main/CHANGELOG.md"
  },
};

type SubmoduleItem = keyof typeof submodules;

const submodulesKeys: SubmoduleItem[] = [
  'tdesign-vue',
  'tdesign-vue-next',
  'tdesign-react',
  'tdesign-miniprogram',
  'tdesign-mobile-vue',
  'tdesign-mobile-react',
  'tdesign-flutter',
]

/**
 * @description 获取内容
 * @param {string} version 
 */
const getVersionContent = (version: string, markdown: string) => {
  const regex = new RegExp(`(${version}.*?(?=## 🌈|$))`, 's');
  const match = markdown.match(regex);

  if (match) {
    return match[0];
  } else {
    return 'Version Content not found';
  }
}

/**
 * @description 获取项目具体详情描述地址
 * @example:
 * ['## Vue3 for Web 发布 [1.10.1,1.10.1](https://github.com/Tencent/tdesign-vue-next/releases/tag/1.10.1)'
 * '详情见： https://github.com/Tencent/tdesign-vue-next/releases/tag/1.10.0'
 * ]
 * @param {string} project 
 * @param {string} tag 
 * @param {string} prefixDesc 
 * @param {string} suffixDesc 
 */
function getProjectDesc(project: SubmoduleItem, tag: string, prefixDesc: any, suffixDesc: any) {
  return [
    `${prefixDesc} [${tag}](https://github.com/Tencent/${project}/releases/tag/${tag})`,
    `${suffixDesc} https://github.com/Tencent/${project}/releases/tag/${tag}`,
  ];
}

// 开始执行

/**
 * @description 检查日期是否在指定日期范围内
 *  在每个月的1号、8号、15号、22号生成
 *  1号生成上个月的22号到最后一天的版本
 *  8号生成这个月的1号到7号的版本
 *  15号生成这个月的8号到14号的版本
 *  22号生成这个月的15号到21号的版本
 */

let START_DATE = '';
let END_DATE = '';

const today = new Date();

// 获取昨天的日期并且只取年月日格式化成'yyyy-mm-dd'
const someDaysAgo = new Date(today);
if (today.getDate() === 1) {
  // 获取上个月的22号到最后一天的版本
  START_DATE = new Date(today.getFullYear(), today.getMonth() - 1, 22).toISOString().split('T')[0];;
  END_DATE = new Date(someDaysAgo.setDate(today.getDate() - 1)).toISOString().split('T')[0];
} else {
  START_DATE = new Date(someDaysAgo.setDate(today.getDate() - 7)).toISOString().split('T')[0];
  END_DATE = new Date(someDaysAgo.setDate(today.getDate() - 1)).toISOString().split('T')[0];
}
console.log(`今天是:${today},开始日期:${START_DATE},结束日期:${END_DATE}`);

const fetchPromises = submodulesKeys.map(async project => {
  console.log(`开始处理${project}项目`);
  const changelogUrl = submodules[project].changelogUrl;
  console.log(changelogUrl);
  // 读取 CHANGELOG.md 文件内容
  const response = await fetch(changelogUrl);
  const changelogContent = await response.text();

  // 使用正则表达式提取版本标题行，确保以"##"开头并以日期结尾
  const versions = changelogContent.match(/^##.+?`\d{4}-\d{2}-\d{2}`\s*$/gm);

  const projectOutput: string[] = [];

  versions?.forEach((versionLine) => {
    const dateMatch = versionLine.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      const versionContent = getVersionContent(versionLine, changelogContent);
      const tag = versionLine.match(/\d+\.\d+\.\d+/);
      if (!tag) {
        throw new Error('tag is null');
      }

      const date = new Date(dateMatch[0]);
      // 检查日期是否在指定范围内,[2024-06-01, 2024-06-07] 闭区间
      if (date >= new Date(START_DATE) && date <= new Date(END_DATE)) {
        const desc = getProjectDesc(project, tag[0], submodules[project]['title'], '详情见：');
        projectOutput.push(`${desc[0]}\n${versionContent}\n${desc[1]}\n`);
      }
    }
  });

  return projectOutput.join('\n');
});

Promise.all(fetchPromises).then(projectOutputs => {
  const output = projectOutputs.join('\n');

  // 标题
  const monthShort = today.toLocaleString('en-US', { month: 'short' });
  const year = today.getFullYear();
  let times = "1st";

  console.log('today', today.getDate());
  switch (today.getDate()) {
    case 1:
      times = "4th";
      break;
    case 8:
      times = "1st";
      break;
    case 15:
      times = "2nd";
      break;
    case 22:
      times = "3rd";
      break;
    default:
      times = "1st";
      break;
  }

  const tag = `v${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
  const title = `TDesign Weekly Release (${monthShort} ${times} ${year})`;

  console.log('tag', tag);
  console.log('title', title);
  console.log('output', output);

  // 发布release

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw new Error('GITHUB_TOKEN is undefined');
  }

  console.log('tag', tag);
  console.log('title', title);
  console.log('output', output);
  console.log('GitHub Token:', githubToken);
  const octokit = github.getOctokit(githubToken);
  console.log('身份验证成功');

  try {
    octokit.rest.repos.createRelease({
      owner: "Tencent",
      repo: "tdesign",
      tag_name: tag, // 添加缺少的 tag_name 参数
      name: title, // 可选参数，使用 title 作为发布名称
      body: output, // 可选参数，发布说明内容
      draft: true, // 可选参数，是否为草稿
    })
  } catch (error) {
    console.error("Error:", error);
  }
});