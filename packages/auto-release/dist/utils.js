'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createRelease =
  exports.formatProjectOutput =
  exports.getReleaseData =
  exports.getProjectDesc =
  exports.getVersionContent =
    void 0;
const github = __importStar(require('@actions/github'));
/**
 * @description 获取内容
 * @param {string} version
 */
function getVersionContent(version, markdown) {
  const regex = new RegExp(`(${version}.*?(?=## 🌈|$))`, 's');
  const match = markdown.match(regex);
  if (match) {
    return match[0];
  } else {
    return 'Version Content not found';
  }
}
exports.getVersionContent = getVersionContent;
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
function getProjectDesc(project, tag, prefixDesc, suffixDesc) {
  return [
    `${prefixDesc} [${tag}](https://github.com/Tencent/${project}/releases/tag/${tag})`,
    `${suffixDesc} https://github.com/Tencent/${project}/releases/tag/${tag}`,
  ];
}
exports.getProjectDesc = getProjectDesc;
function getReleaseData() {
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
exports.getReleaseData = getReleaseData;
function formatProjectOutput(projectOutputs) {
  return projectOutputs.map((output) => output.trim() != '').join('\n');
}
exports.formatProjectOutput = formatProjectOutput;
function createRelease(tag, title, content) {
  const githubToken = process.env.GITHUB_TOKEN || '';
  const isCI = process.env.CI;
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
        tag_name: tag,
        name: title,
        body: content,
        draft: true, // 可选参数，是否为草稿
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
exports.createRelease = createRelease;
