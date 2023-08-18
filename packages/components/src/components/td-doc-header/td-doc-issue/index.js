import { html, define } from "hybrids";
import style from "./style.less";
import infoIcon from "@images/info.svg?raw";
import checkIcon from "@images/check.svg?raw";
import addIcon from "@images/add.svg?raw";
import { isIntranet } from "@utils/index";

const getIssueHelper = (framework) =>
  `https://github.com/Tencent/tdesign-${framework}/issues/new/choose`;

// 已开源的不区分内外网 统一去外网 GitHub
const issueUrlMap = {
  vue: `https://github.com/Tencent/tdesign-vue/issues`,
  react: `https://github.com/Tencent/tdesign-react/issues`,
  "vue-next": `https://github.com/Tencent/tdesign-vue-next/issues`,
  "mobile-vue": `https://github.com/Tencent/tdesign-mobile-vue/issues`,
  "mobile-react": `https://github.com/Tencent/tdesign-mobile-react/issues`,
  miniprogram: `https://github.com/Tencent/tdesign-miniprogram/issues`,
  flutter: `https://github.com/TDesignOteam/tdesign-flutter/issues`,
};

function parseUrl() {
  let urlPath = location.pathname;
  // 预览站点为hash模式
  if (location.pathname === "/" && location.hash) {
    urlPath = location.hash.slice(1);
  }
  const matches = urlPath.match(/([\w-]+)\/components\/([\w-]+)/) || [];

  return matches;
}

function getCurrentIssueUrl() {
  const [, framework, componentName] = parseUrl();

  return {
    newUrl: isIntranet()
      ? `${issueUrlMap[framework]}/new`
      : getIssueHelper(framework),
    openUrl: isIntranet()
      ? `${issueUrlMap[framework]}?issue_search=${componentName}`
      : `${issueUrlMap[framework]}?q=is:issue+is:open+${componentName}`,
    closedUrl: isIntranet()
      ? `${issueUrlMap[framework]}?state=closed&issue_search=${componentName}`
      : `${issueUrlMap[framework]}?q=is:issue+is:closed+${componentName}`,
  };
}

function handleIssueClick(e, issueInfo, type) {
  e.preventDefault();
  const url = issueInfo[`${type}Url`];
  window.open(url, "_blank");
}

function renderIssue(host) {
  const { openNum, closedNum } = host;
  const [, , componentName] = parseUrl();

  const issueInfo = {
    openNum,
    closedNum,
    componentName,
    ...getCurrentIssueUrl(),
  };

  if (!componentName) return html``;

  return html`
    <section id="issue" class="TDesign-component-issue">
      <a
        onclick="${(host, e) => handleIssueClick(e, issueInfo, "new")}"
        class="item"
      >
        <i innerHTML=${addIcon}></i>
        <span>Issue</span>
      </a>
      <a
        onclick="${(host, e) => handleIssueClick(e, issueInfo, "open")}"
        class="item"
      >
        <i innerHTML=${infoIcon}></i>
        <span>${issueInfo?.openNum || ""} Open</span>
      </a>
      <a
        onclick="${(host, e) => handleIssueClick(e, issueInfo, "closed")}"
        class="item"
      >
        <i innerHTML=${checkIcon}></i>
        <span>${issueInfo?.closedNum || ""} Closed</span>
      </a>
    </section>
  `;
}

// 获取 github issue 数量
const getGithubIssueUrl = (name, state = "open", repo) =>
  `https://api.github.com/search/issues?q=is:issue+is:${state}+${name}+repo:Tencent/${repo}`;
function fetchGithubIssueNum(host, name, state = "open", framework) {
  const issueUrl = getGithubIssueUrl(name, state, `tdesign-${framework}`);
  const cacheKey = `__tdesign_${framework}_${name}_${state}__`;
  const cache = sessionStorage.getItem(cacheKey);

  if (cache) {
    const data = JSON.parse(cache);
    Object.assign(host, { [`${state}Num`]: data.total_count });
  } else {
    fetch(issueUrl)
      .then((res) => res.json())
      .then((data) => {
        Object.assign(host, { [`${state}Num`]: data.total_count });
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default define({
  tag: "td-doc-issue",
  openNum: {
    get: (_host, lastValue) => lastValue || "",
    set: (_host, value) => value,
    connect: (host) => {
      const [, framework, componentName] = parseUrl();
      if (!componentName) return;
      fetchGithubIssueNum(host, componentName, "open", framework);
    },
  },
  closedNum: {
    get: (_host, lastValue) => lastValue || "",
    set: (_host, value) => value,
    connect: (host) => {
      const [, framework, componentName] = parseUrl();
      if (!componentName) return;
      fetchGithubIssueNum(host, componentName, "closed", framework);
    },
  },
  render: (host) => html`${renderIssue(host)}`.css`${style}`,
});
