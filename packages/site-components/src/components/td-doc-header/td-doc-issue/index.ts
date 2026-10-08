import { html, define } from 'hybrids';
import style from './style.less?inline';
import infoIcon from '@images/info.svg?raw';
import checkIcon from '@images/check.svg?raw';
import addIcon from '@images/add.svg?raw';

// 已开源的不区分内外网 统一去外网 GitHub
const issueUrlMap = {
  vue: `https://github.com/Tencent/tdesign-vue/issues`,
  react: `https://github.com/Tencent/tdesign-react/issues`,
  'vue-next': `https://github.com/Tencent/tdesign-vue-next/issues`,
  'mobile-vue': `https://github.com/Tencent/tdesign-mobile-vue/issues`,
  'mobile-react': `https://github.com/Tencent/tdesign-mobile-react/issues`,
  miniprogram: `https://github.com/Tencent/tdesign-miniprogram/issues`,
  'miniprogram-chat': `https://github.com/Tencent/tdesign-miniprogram/issues`,
  uniapp: `https://github.com/Tencent/tdesign-miniprogram/issues`,
  'uniapp-chat': `https://github.com/Tencent/tdesign-miniprogram/issues`,
  flutter: `https://github.com/Tencent/tdesing-flutter/issues`,
  chat: `https://github.com/Tencent/tdesign-vue-next/issues`,
  'react-chat': `https://github.com/Tencent/tdesign-react/issues`,
};

type Framework = keyof typeof issueUrlMap;
type IssueState = 'open' | 'closed';

interface IssueHost {
  openNum: number | '';
  closedNum: number | '';
}

interface IssueUrls {
  newUrl: string;
  openUrl: string;
  closedUrl: string;
}

interface GithubSearchResponse {
  total_count: number;
}

function parseUrl(): RegExpMatchArray | [] {
  let urlPath = location.pathname;
  // 预览站点为hash模式
  if (location.pathname === '/' && location.hash) {
    urlPath = location.hash.slice(1);
  }
  const matches = urlPath.match(/([\w-]+)\/components\/([\w-]+)/) || [];

  return matches;
}

function isFramework(value: string | undefined): value is Framework {
  return Boolean(value && Object.prototype.hasOwnProperty.call(issueUrlMap, value));
}

function getCurrentIssueUrl(): IssueUrls {
  const [, framework, componentName] = parseUrl();
  const issueBaseUrl = isFramework(framework) ? issueUrlMap[framework] : '';

  return {
    newUrl: `${issueBaseUrl}/new/choose`,
    openUrl: `${issueBaseUrl}?q=is:issue+is:open+${componentName}`,
    closedUrl: `${issueBaseUrl}?q=is:issue+is:closed+${componentName}`,
  };
}

function handleIssueClick(e: Event, issueInfo: IssueUrls, type: 'new' | IssueState): void {
  e.preventDefault();
  const url = type === 'new' ? issueInfo.newUrl : type === 'open' ? issueInfo.openUrl : issueInfo.closedUrl;
  window.open(url, '_blank');
}

function renderIssue(host: IssueHost & HTMLElement) {
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
    <section id="issue" class="td-component-issue">
      <a
        onclick="${(_host: IssueHost & HTMLElement, e?: Event) => e && handleIssueClick(e, issueInfo, 'new')}"
        class="item"
      >
        <i innerHTML=${addIcon}></i>
        <span>Issue</span>
      </a>
      <a
        onclick="${(_host: IssueHost & HTMLElement, e?: Event) => e && handleIssueClick(e, issueInfo, 'open')}"
        class="item"
      >
        <i innerHTML=${infoIcon}></i>
        <span>${issueInfo?.openNum || ''} Open</span>
      </a>
      <a
        onclick="${(_host: IssueHost & HTMLElement, e?: Event) => e && handleIssueClick(e, issueInfo, 'closed')}"
        class="item"
      >
        <i innerHTML=${checkIcon}></i>
        <span>${issueInfo?.closedNum || ''} Closed</span>
      </a>
    </section>
  `;
}

// 获取 github issue 数量
const getGithubIssueUrl = (name: string, state: IssueState, repo: string): string =>
  `https://api.github.com/search/issues?q=is:issue+is:${state}+${name}+repo:Tencent/${repo}`;
function isGithubSearchResponse(value: unknown): value is GithubSearchResponse {
  if (typeof value !== 'object' || value === null) return false;
  return Object.entries(value).some(([key, field]) => key === 'total_count' && typeof field === 'number');
}

function fetchGithubIssueNum(host: IssueHost & HTMLElement, name: string, state: IssueState, framework: string): void {
  const issueUrl = getGithubIssueUrl(name, state, `tdesign-${framework}`);
  const cacheKey = `__tdesign_${framework}_${name}_${state}__`;
  const cache = sessionStorage.getItem(cacheKey);

  if (cache) {
    const data: unknown = JSON.parse(cache);
    if (isGithubSearchResponse(data)) Object.assign(host, { [`${state}Num`]: data.total_count });
  } else {
    fetch(issueUrl)
      .then((res) => res.json() as Promise<unknown>)
      .then((data) => {
        if (!isGithubSearchResponse(data)) throw new TypeError('Invalid GitHub issue response');
        Object.assign(host, { [`${state}Num`]: data.total_count });
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default define<IssueHost>({
  tag: 'td-doc-issue',
  openNum: {
    value: (_host, v) => v || '',
    connect: (host) => {
      const [, framework, componentName] = parseUrl();
      if (!componentName || !framework) return;
      fetchGithubIssueNum(host, componentName, 'open', framework);
    },
  },
  closedNum: {
    value: (_host, v) => v || '',
    connect: (host) => {
      const [, framework, componentName] = parseUrl();
      if (!componentName || !framework) return;
      fetchGithubIssueNum(host, componentName, 'closed', framework);
    },
  },
  render: (host) => html`${renderIssue(host)}`.css`${style}`,
});
