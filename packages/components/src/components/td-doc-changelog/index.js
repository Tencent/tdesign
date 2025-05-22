import { html, define } from 'hybrids';
import { getLocale } from '@config/locale.js';
import { isComponentPage, isGlobalConfigPage } from '@utils';
import style from './style.less';

let changelogCache = null;
const classPrefix = 'TDesign-doc-changelog';
const locale = getLocale();

function getCompName() {
  if (isComponentPage()) {
    const pathSegments = window.location.pathname.split('/');
    let rawName = pathSegments[3] || '';
    // 去除结尾的 -en
    if (rawName.endsWith('-en')) rawName = rawName.slice(0, -3);
    // 转为驼峰并首字母大写
    const camelCaseName = rawName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return camelCaseName ? camelCaseName[0].toUpperCase() + camelCaseName.slice(1) : '';
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
    const container = host.shadowRoot?.querySelector(`.${classPrefix}__drawer-body`);
    if (container) {
      container.innerHTML = renderChangelog(compChangelog);
    }
  } catch (err) {
    console.error('Failed to load changelog:', err);
  }
}

function renderChangelog(list) {
  if (!Array.isArray(list)) {
    return `<div class="${classPrefix}__log-empty">${locale.changelog.emptyInfo}</div>`;
  }

  return list
    .map(
      (item) => `
        <div class="${classPrefix}__log-item">
          <div class="${classPrefix}__log-header">
            <span class="${classPrefix}__log-header-version">🌈 ${item.version}</span>
            <span class="${classPrefix}__log-header-date">${item.date}</span>
          </div>
          ${renderLogSection('🚀 Features', item.features)}
          ${renderLogSection('🐞 Bug Fixes', item.bugfixes)}
        </div>
      `,
    )
    .join('');
}

function renderLogSection(title, items) {
  if (!items) return '';
  return `
    <div class="${classPrefix}__log-section">
      <div class="${classPrefix}__log-section-title">${title}</div>
      <ul class="${classPrefix}__log-list">
        ${items.map((item) => renderChangelogList(item)).join('')}
      </ul>
    </div>
  `;
}

function renderChangelogList(text) {
  // 行内 code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 链接
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // @用户名
  text = text.replace(/@([a-zA-Z0-9-_]+)/g, '<a href="https://github.com/$1" target="_blank">@$1</a>');

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  // Case 1: 存在多行子列表描述
  if (lines.length > 1 && !lines[0].startsWith('-')) {
    const [firstLine, ...rest] = lines;
    const restItems = rest
      .map((line) => line.replace(/^- /, ''))
      .map((item) => `<li>${item}</li>`)
      .join('');
    return `<li>${firstLine}</li><ul>${restItems}</ul>`;
  }

  // Case 2
  return lines
    .map((line) => {
      const content = line.replace(/^- /, '');
      return `<li>${content}</li>`;
    })
    .join('');
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
    const handler = () => {
      if (host.visible) {
        fetchChangelog(host);
      }

      const container = host.shadowRoot?.querySelector(`.${classPrefix}__drawer-body`);
      if (container) {
        container.scrollTop = 0;
      }
    };
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  },

  render: (host) => {
    const closeChangelogDrawer = () => {
      host.visible = false;
    };

    return html`
      <div style="visibility: ${host.visible ? 'visibility' : 'hidden'}">
        <div class="${classPrefix}__drawer-overlay" onclick="${closeChangelogDrawer}"></div>
        <div class="${classPrefix}__drawer-container">
          <div class="${classPrefix}__drawer-header">
            <button class="${classPrefix}__drawer-header-close-button" onclick="${closeChangelogDrawer}">×</button>
          </div>
          <div class="${classPrefix}__drawer-body"></div>
        </div>
        <div></div>
      </div>
    `.css`${style}`;
  },
});
