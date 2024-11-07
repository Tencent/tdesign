import * as github from '@actions/github';
import { SubmoduleItem } from './constants';

/**
 * @description 获取内容
 * @param {string} version
 */
export function getVersionContent(version: string, markdown: string) {
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
export function getProjectDesc(project: SubmoduleItem, tag: string, prefixDesc: string, suffixDesc: string) {
  return [
    `${prefixDesc} [${tag}](https://github.com/Tencent/${project}/releases/tag/${tag})`,
    `${suffixDesc} https://github.com/Tencent/${project}/releases/tag/${tag}`,
  ];
}

export function getReleaseData() {
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
    START_DATE = new Date(today.getFullYear(), today.getMonth() - 1, 22).toISOString().split('T')[0];
    END_DATE = new Date(someDaysAgo.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  } else {
    START_DATE = new Date(someDaysAgo.setDate(today.getDate() - 7)).toISOString().split('T')[0];
    END_DATE = new Date(someDaysAgo.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  }
  console.log(`今天是:${today},开始日期:${START_DATE},结束日期:${END_DATE}`);

  // 标题
  const monthShort = today.toLocaleString('en-US', { month: 'short' });
  const year = today.getFullYear();
  let times = '1st';

  console.log('today', today.getDate());
  switch (today.getDate()) {
    case 1:
      times = '4th';
      break;
    case 8:
      times = '1st';
      break;
    case 15:
      times = '2nd';
      break;
    case 22:
      times = '3rd';
      break;
    default:
      times = '1st';
      break;
  }

  const tag = `v${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
  const title = `TDesign Weekly Release (${monthShort} ${times} ${year})`;

  console.log('tag', tag);
  console.log('title', title);

  return {
    tag,
    title,
    START_DATE,
    END_DATE,
  };
}

export function getReleaseContent(projectOutputs: string[]) {
  return projectOutputs.filter((output) => output.trim() != '').join('\n');
}

export function createRelease(tag: string, title: string, content: string) {
  const githubToken = process.env.GITHUB_TOKEN || '';
  const isCI = process.env.CI;
  if (content === '') {
    console.log('没有需要发布的内容');
    return;
  }
  if (!githubToken && isCI) {
    throw new Error('GITHUB_TOKEN is undefined');
  }

  if (isCI) {
    const octokit = github.getOctokit(githubToken);
    console.log('身份验证成功');
    try {
      octokit.rest.repos.createRelease({
        owner: 'Tencent',
        repo: 'tdesign',
        tag_name: tag, // 添加缺少的 tag_name 参数
        name: title, // 可选参数，使用 title 作为发布名称
        body: content, // 可选参数，发布说明内容
        draft: true, // 可选参数，是否为草稿
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
