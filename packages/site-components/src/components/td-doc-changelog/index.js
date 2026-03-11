import { define, html } from 'hybrids';
import { getLocale } from '@config/locale.js';
import closeIcon from '@images/close.svg?raw';
import { convert2PascalCase, isComponentPage, isEn, isGlobalConfigPage, parseBoolean } from '@utils';
import style from './style.less?inline';

const changelogCache = new Map();

const classPrefix = 'TDesign-doc-changelog';
const logsPrefix = `${classPrefix}__logs`;

const locale = getLocale();

const OFFICIAL_DOMAINS = ['tencent.com', 'woa.com'];
// 静态资源统一的地址，支持tencent.com 和 woa.com的跨域请求
const OFFICIAL_STATIC_DOMAINS = 'https://static.tdesign.tencent.com';

const SPECIAL_NAME_MAP = {
  qrcode: 'QRCode',
};

function parseUrl() {
  const { pathname, hostname, origin } = window.location;

  const segments = pathname.split('/').filter(Boolean);
  const framework = segments[0];
  const isOfficial = OFFICIAL_DOMAINS.some((domain) => hostname.includes(domain));

  return {
    origin,
    segments,
    framework,
    isOfficial,
  };
}

function getLogUrlPrefix() {
  const { isOfficial, framework, origin } = parseUrl();
  if (isOfficial) {
    return `${OFFICIAL_STATIC_DOMAINS}/${framework}`;
  }
  return origin;
}

function getCompName() {
  const { segments } = parseUrl();

  if (isComponentPage()) {
    let rawName = segments[2] || '';
    if (rawName.endsWith('-en')) {
      rawName = rawName.slice(0, -3);
    }
    return SPECIAL_NAME_MAP[rawName] || convert2PascalCase(rawName);
  }

  if (isGlobalConfigPage()) {
    return 'ConfigProvider';
  }
}

async function fetchChangelog(host) {
  const compName = getCompName();
  const jsonName = isEn() && host.changelogEn ? 'changelog.en-US.json' : 'changelog.json';
  const url = `${getLogUrlPrefix()}/${jsonName}`;

  try {
    if (!changelogCache.has(jsonName)) {
      const response = await fetch(url);
      const json = await response.json();
      changelogCache.set(jsonName, json);
    }

    const data = changelogCache.get(jsonName);

    // 移除 loading
    host.shadowRoot?.querySelector(`.${logsPrefix}__loading`)?.remove();

    // 滚动重置
    const drawerBody = host.shadowRoot?.querySelector(`.${classPrefix}__drawer-body`);
    if (drawerBody) drawerBody.scrollTop = 0;

    const compChangelog = data?.[compName];
    const logsContainer = host.shadowRoot?.querySelector(`.${logsPrefix}`);

    if (logsContainer) {
      logsContainer.innerHTML = renderLog(compChangelog);
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
  if (lines.length > 1) {
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
      // 链接
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // @用户名 (且不在反引号内)
      .replace(/(?<!`)@([a-zA-Z0-9-_]+)(?!`)/g, '<a href="https://github.com/$1" target="_blank">@$1</a>')
      // 行内 code
      .replace(
        /`([^`]+)`/g,
        (_, param) => `<td-code text="${param.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></td-code>`,
      )
  );
}

export default define({
  tag: 'td-doc-changelog',
  changelogEn: {
    get: (_host, lastValue) => parseBoolean(lastValue, false),
    set: (_host, value) => value,
  },
  visible: {
    value: false,
    observe: (host, value) => {
      if (value) {
        fetchChangelog(host);
      }
    },
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
            <div class="${logsPrefix}__loading">
              <svg
                class="${logsPrefix}__loading-icon"
                viewBox="0 0 12 12"
                width="1em"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </div>
            <div class="${logsPrefix}"></div>
          </div>
        </div>
      </div>
    `.css`${style}`;
  },
});
