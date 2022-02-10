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
            res.data.repoName = repo;
            return res.data
              .filter((item) => item.closed_at.split("T")[0] === dateString)
              .map((item) => ({
                ...item,
                repo: item.repository_url.split("Tencent/")[1],
              }));
          })
      )
    );
    return allList.reduce(function (total, item) {
      return [...total, ...item];
    }, []);
  }
  async render(data) {
    if (!data.length) return "";
    return `## 昨天关闭的 ISSUE

${data
  .filter((item) => !item.pull_request)
  .map((item) => {
    return `- ${item.repo}：[${item.title}](${item.html_url}) @${item.user.login}`;
  })
  .join("\n")}

## 昨天合并的 PR

${data
  .filter((item) => item.pull_request)
  .map((item) => {
    return `- ${item.repo}：[${item.title}](${item.html_url}) @${item.user.login}`;
  })
  .join("\n")} 
`;
  }
  async run() {
    let res;
    try {
      res = await this.getData();
    } catch (error) {
      console.log(error, "error");
    }
    if (!res) return false;
    const template = await this.render(res);
    exec(
      `curl ${this.wxhook} \
       -H 'Content-Type: application/json' \
       -d '
       {
            "chatid": "wrkSFfCgAA-QNmuIjascLNFfmkFVQT5A|ww3027190586",
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
  }
}

module.exports = DailyClose;
