// 收集每个仓库的close，找到昨天完成的。
// 渲染
// 机器人推送 id
const { Octokit } = require("@octokit/rest");
const { exec } = require("child_process");
const { ReposEnum } = require("./const");
const dayjs = require("dayjs");

class DailyClose {
  constructor({ wxhook, token, octokit }) {
    this.wxhook = wxhook;
    this.octokit = octokit || new Octokit({ auth: token });
    this.title = "昨天关闭的 ISSUE/PR";
    this.chatid = "";
  }
  async getData() {
    const dateString = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const allList = await Promise.all(
      ReposEnum.map((repo) =>
        this.octokit.rest.issues
          .listForRepo({
            owner: "Tencent",
            repo: repo,
            state: "closed",
            sort: "updated",
          })
          .then((res) => {
            const arr = res.data
              .filter((item) => item.closed_at.split("T")[0] === dateString && item.user.login !== "dependabot[bot]")
              .map((item) => ({
                ...item,
                repo: item.repository_url.split("Tencent/")[1],
              }));
            arr.repoName = repo;
            return arr;
          })
      )
    );
    return allList;
  }
  async render(data) {
    if (data.every((li) => !li.length)) return "";
    return [
      `## 昨天关闭的 ISSUE

${data
  .filter((repo) => repo.filter((item) => !item.pull_request).length)
  .map((repo) => {
    return `#### ${repo.repoName}
${repo
  .filter((item) => !item.pull_request)
  .map((item) => {
    return `- ${item.title} [@${item.user.login}](${item.html_url})`;
  })
  .sort()
  .join("\n")}`;
  })
  .join("\n \n")}`,
      `## 昨天合并的 PR

${data
  .filter((repo) => repo.filter((item) => item.pull_request).length)
  .map((repo) => {
    return `#### ${repo.repoName}
${repo
  .filter((item) => item.pull_request)
  .map((item) => {
    return `- ${item.title} [@${item.user.login}](${item.html_url})`;
  })
  .sort()
  .join("\n")}`;
  })
  .join("\n \n")}`,
    ];
  }
  async run() {
    let res;
    try {
      res = await this.getData();
    } catch (error) {
      console.log(error, "error");
    }

    if (!res) return false;
    const templates = await this.render(res);
    templates.forEach((template) => {
      exec(
        `curl ${this.wxhook} \
         -H 'Content-Type: application/json' \
         -d '
         {
              "msgtype": "markdown",
              "markdown": {
                  "content": "${template.replaceAll('"', "'")}"
              }
         }'`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        }
      );
    });
  }
}

module.exports = DailyClose;
