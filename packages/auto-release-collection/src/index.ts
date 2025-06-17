import { submodules, submodulesKeys } from './constants';
import { createRelease, getProjectDesc, getVersionContent, getReleaseData, getReleaseContent } from './utils';

// 开始执行
const { tag, title, START_DATE, END_DATE } = getReleaseData();
const fetchPromises = submodulesKeys.map(async (project) => {
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
        const desc = getProjectDesc(
          submodules[project].repo,
          `${submodules[project].tagPrefix}${tag[0]}`,
          submodules[project]['title'],
          '详情见：',
        );
        projectOutput.push(`${desc[0]}\n${versionContent}\n${desc[1]}\n`);
      }
    }
  });

  return projectOutput.join('\n');
});

Promise.all(fetchPromises).then((projectOutputs) => {
  const output = getReleaseContent(projectOutputs);

  console.log('output', output);

  // 发布release
  createRelease(tag, title, output);
});
