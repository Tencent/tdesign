'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const constants_1 = require('./constants');
const utils_1 = require('./utils');
// 开始执行
const { tag, title, START_DATE, END_DATE } = (0, utils_1.getReleaseData)();
const fetchPromises = constants_1.submodulesKeys.map((project) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(`开始处理${project}项目`);
    const changelogUrl = constants_1.submodules[project].changelogUrl;
    console.log(changelogUrl);
    // 读取 CHANGELOG.md 文件内容
    const response = yield fetch(changelogUrl);
    const changelogContent = yield response.text();
    // 使用正则表达式提取版本标题行，确保以"##"开头并以日期结尾
    const versions = changelogContent.match(/^##.+?`\d{4}-\d{2}-\d{2}`\s*$/gm);
    const projectOutput = [];
    versions === null || versions === void 0
      ? void 0
      : versions.forEach((versionLine) => {
          const dateMatch = versionLine.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            const versionContent = (0, utils_1.getVersionContent)(versionLine, changelogContent);
            const tag = versionLine.match(/\d+\.\d+\.\d+/);
            if (!tag) {
              throw new Error('tag is null');
            }
            const date = new Date(dateMatch[0]);
            // 检查日期是否在指定范围内,[2024-06-01, 2024-06-07] 闭区间
            if (date >= new Date(START_DATE) && date <= new Date(END_DATE)) {
              const desc = (0, utils_1.getProjectDesc)(
                project,
                tag[0],
                constants_1.submodules[project]['title'],
                '详情见：',
              );
              projectOutput.push(`${desc[0]}\n${versionContent}\n${desc[1]}\n`);
            }
          }
        });
    return projectOutput.join('\n');
  }),
);
Promise.all(fetchPromises).then((projectOutputs) => {
  const output = (0, utils_1.formatProjectOutput)(projectOutputs);
  console.log('output', output);
  // 发布release
  (0, utils_1.createRelease)(tag, title, output);
});
