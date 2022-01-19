const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const { exec } = require("child_process");

const wxhook = core.getInput("wxhook");
const token = core.getInput("token");

console.log(wxhook, token);

const octokit = new Octokit({ auth: token });

const ReposEnum = [
  "tdesign",
  "tdesign-vue",
  "tdesign-vue-next",
  "tdesign-react",
  "tdesign-miniprogram",
  "tdesign-common",
  "tdesign-starter-cli",
  "tdesign-vue-starter",
  "tdesign-vue-next-starter",
  "tdesign-icons",
];

function renderMark(data) {
  data.sort((a, b) => b.length - a.length);

  const IssuesList = data
    .reduce(function (total, item) {
      return [...total, ...item];
    }, [])
    .filter((item) => !item.pull_request)
    .map((item) => ({
      created_time: item.created_at.split("T")[0],
      html_url: item.html_url,
      title: item.title,
      repo: item.repository_url.split("Tencent/")[1],
      created_at: item.created_at.split("T")[0].replaceAll("-", ""),
    }))
    .sort((a, b) => a.created_at - b.created_at)
    .slice(0, 10);

  const PullList = data
    .reduce(function (total, item) {
      return [...total, ...item];
    }, [])
    .filter((item) => item.pull_request)
    .map((item) => ({
      created_time: item.created_at.split("T")[0],
      html_url: item.html_url,
      title: item.title,
      repo: item.repository_url.split("Tencent/")[1],
      created_at: item.created_at.split("T")[0].replaceAll("-", ""),
    }))
    .sort((a, b) => a.created_at - b.created_at)
    .slice(0, 10);

  return [
    `### Github 响应用户情况
${data
  .map(
    (repo, index) => `#### ${repo.repoName}
[未关闭 issue 数量：${repo.filter((n) => !n.pull_request).length}](https://github.com/Tencent/${
      repo.repoName
    }/issues?q=is%3Aopen+is%3Aissue) | [未认领 issue 数量：${
      repo.filter((n) => !n.pull_request && !n.assignee).length
    }](https://github.com/Tencent/${repo.repoName}/issues?q=is%3Aopen+is%3Aissue+no%3Aassignee) ｜ [未关闭 pr 数量：${
      repo.filter((n) => n.pull_request).length
    }](https://github.com/Tencent/${repo.repoName}/pulls?q=is%3Aopen+is%3Apr)
`
  )
  .join("\n")}`,
    `#### Issues 未关闭时长 Top10
${IssuesList.map((item) => `- **${item.repo}**：[${item.title}](${item.html_url}) ${item.created_time}创建`).join(
  "\n"
)}`,
    `#### Pull Request 未关闭时长 Top10
${PullList.map((item) => `- **${item.repo}**：[${item.title}](${item.html_url}) ${item.created_time}创建`).join("\n")}`,
  ];
}

async function getRepoIssuesInfo(repo) {
  // open 数量
  // open 且 未指定 assignees 数量 以及 issue 标题 链接 列表
  // open 各仓库时长排序top 汇总 再取top10

  return octokit.rest.issues
    .listForRepo({
      owner: "Tencent",
      repo: repo,
      state: "open",
      sort: "created",
      direction: "asc",
    })
    .then((res) => {
      res.data.repoName = repo;
      return res.data;
    });
}

async function main() {
  // 调取 参数指定的 ReposEnum 的issue 情况
  // 形成 infoData
  // 灌入模版 生成图表

  const promises = ReposEnum.map((repo) => {
    return getRepoIssuesInfo(repo);
  });

  const resultArr = await Promise.all(promises);

  const markdownStringArr = renderMark(resultArr);

  markdownStringArr.forEach((markdownString) => {
    exec(
      `curl ${wxhook} \
     -H 'Content-Type: application/json' \
     -d '
     {
          "msgtype": "markdown",
          "markdown": {
              "content": "${markdownString}"
          }
     }'`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error:${wxhook} | ${token} | ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  });
}

try {
  core.setOutput("time", wxhook + "|" + token);
  main();
} catch (error) {
  core.setFailed(error.message);
}
