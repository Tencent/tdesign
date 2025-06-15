import { html, define } from 'hybrids';
import { getLocale } from '@config/locale.js';
import closeIcon from '@images/close.svg?raw';
import { isComponentPage, isGlobalConfigPage } from '@utils';
import style from './style.less';

const classPrefix = 'TDesign-doc-changelog';
const logsPrefix = `${classPrefix}__logs`;

const locale = getLocale();

let changelogCache = null;

function getCompName() {
  if (isComponentPage()) {
    const pathSegments = window.location.pathname.split('/');
    let rawName = pathSegments[3] || '';
    // 去除结尾的 -en
    if (rawName.endsWith('-en')) rawName = rawName.slice(0, -3);
    // 转为帕斯卡命名
    const pascalCaseName = rawName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return pascalCaseName ? pascalCaseName[0].toUpperCase() + pascalCaseName.slice(1) : '';
  } else if (isGlobalConfigPage()) {
    return 'ConfigProvider';
  }
}

async function fetchChangelog(host) {
  const compName = getCompName();

  try {
    if (!changelogCache) {
      const response = await fetch(`${location.origin}/changelog.json`);
      changelogCache = await response.json();
    }

    const compChangelog = changelogCache[compName];
    const container = host.shadowRoot?.querySelector(`.${logsPrefix}`);
    if (container) {
      container.innerHTML = renderLog(compChangelog);
    }
  } catch (err) {
    console.error('Failed to load changelog:', err);
  }
}

function renderLog(list) {
  if (!Array.isArray(list)) {
    return `<div class="${logsPrefix}-empty">${locale.changelog.emptyInfo}</div>`;
  }

  return list
    .map((item) => {
      const sections = Object.keys(item)
        .filter((key) => Array.isArray(item[key]))
        .map((key) => renderLogSection(key, item[key]))
        .join('');

      // 一个版本
      return `
        <div class="${logsPrefix}-version">
          <h2 class="${logsPrefix}-version-header">
            <span>🌈 ${item.version}</span>
            <code>${item.date}</code>
          </h2>
          ${sections}
        </div>
      `;
    })
    .join('');
}

// 一种变更类型
function renderLogSection(title, items) {
  if (!items) return '';
  return `
    <div class="${logsPrefix}-version-section">
      <h3>${title}</h3>
      <ul>
        ${items.map((item) => renderLogDetails(item)).join('')}
      </ul>
    </div>
  `;
}

// 日志详情
function renderLogDetails(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  // Case 1: 存在多行子列表描述
  if (
    lines.length > 1 &&
    // 第一行开头是 @用户名
    /^@([a-zA-Z0-9-_]+)/.test(lines[0])
  ) {
    const [firstLine, ...rest] = lines;
    const restItems = rest.map((item) => `<li>${item}</li>`).join('');
    const html = `<li>${firstLine}</li><ul>${restItems}</ul>`;
    return replaceSpecialTags(html);
  }

  // Case 2：单独一行
  const html = lines.map((line) => `<li>${line}</li>`).join('');
  return replaceSpecialTags(html);
}

function replaceSpecialTags(html) {
  return (
    html
      // 行内 code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // @用户名
      .replace(/@([a-zA-Z0-9-_]+)/g, '<a href="https://github.com/$1" target="_blank">@$1</a>')
  );
}

export default define({
  tag: 'td-doc-changelog',

  visible: {
    value: false,
    observe: (host, value) => {
      if (value) {
        fetchChangelog(host);
      }
    },
  },

  connect: (host) => {
    const handleRouterChange = () => {
      if (host.visible) {
        fetchChangelog(host);
      }

      const container = host.shadowRoot?.querySelector(`.${classPrefix}__drawer-body`);
      if (container) {
        // 重置滚动位置
        container.scrollTop = 0;
      }
    };
    window.addEventListener('popstate', handleRouterChange);
    return () => {
      window.removeEventListener('popstate', handleRouterChange);
    };
  },

  render: (host) => {
    const closeChangelogDrawer = () => {
      host.visible = false;
    };

    return html`
      <div class="${host.visible ? 'visible' : 'hidden'}">
        <div class="${classPrefix}__overlay" onclick="${closeChangelogDrawer}"></div>
        <div class="${classPrefix}__drawer">
          <div class="${classPrefix}__drawer-header">
            <p>${locale.changelog.title}</p>
            <button onclick="${closeChangelogDrawer}" innerHTML="${closeIcon}"></button>
          </div>
          <div class="${classPrefix}__drawer-body">
            <div class="${logsPrefix}"></div>
          </div>
          <div></div>
        </div>
      </div>
    `.css`${style}`;
  },
});
