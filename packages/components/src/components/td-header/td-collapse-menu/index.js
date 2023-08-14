import { html, define } from 'hybrids';
import style from './style.less';
import portalStyle from './portal.less';
import bulletpointIcon  from '@images/bulletpoint.svg?raw';
import { isIntranet } from '@utils/index';
import { gitPath, renderTag, handleLinkClick } from '../index';

function renderLinks({headerList, baseComponentsLinks, platform, framework}) {
  const gitLink = html`
    <a class="link" href="${gitPath(platform, framework)}" id="${platform}" target="_blank">
      <span>${isIntranet() ? '工蜂' : 'Github'}</span>
    </a>
  `;
  const isActive = (path) => location.pathname.includes(path);

  let baseLinks = [html`<div class="divider"></div>`];

  const renderNavs = headerList.map((item) => {
    if (item.type === 'base') {
      const webLinks = baseComponentsLinks.web.links.map((item) => html`
        <a
          href="${item.path}"
          class="link ${isActive(item.path) ? 'active' : ''}"
          onclick=${(host, e) => handleLinkClick(host, e, item)}
        >
          <img class="icon" src="${item.icon}" />
          ${item.name}
          ${renderTag(item.status)}
        </a>
      `);
      baseLinks.push(html`<div class="title">Web 桌面端组件</div>`);
      baseLinks.push(...webLinks);

      const mobileLinks = baseComponentsLinks.mobile.links.map((item) => html`
        <a
          href="${item.path}"
          class="link ${isActive(item.path) ? 'active' : ''}"
          onclick=${(host, e) => handleLinkClick(host, e, item)}
        >
          <img class="icon" src="${item.icon}" />
          ${item.name}
          ${renderTag(item.status)}
        </a>
      `);
      baseLinks.push(html`<div class="title">Mobile 移动端组件</div>`);
      baseLinks.push(...mobileLinks);
      baseLinks.push(html`<div class="divider"></div>`);

      return html``;
    }
    return html`<a class="link ${isActive(item.path) ? 'active' : ''}" href="${item.path}">${item.name}</a>`;
  }).concat(gitLink);

  renderNavs.splice(1, 0, ...baseLinks);
  return renderNavs;
}

export default define({
  tag: 'td-collapse-menu',
  headerList: {
    get: (_host, lastValue) => lastValue || [],
    set: (_host, value) => value,
  },
  baseComponentsLinks: {
    get: (_host, lastValue) => lastValue || [],
    set: (_host, value) => value,
  },
  platform: 'web',
  framework: 'vue',
  disabledTheme: false,
  render: (host) => html`
    <div class="TDesign-collapse-menu">
      <td-doc-popup portalStyle="${portalStyle}" trigger-type="click">
        <div class="collapse-icon" innerHTML="${bulletpointIcon}"></div>
        <div slot="content" class="TDesign-collapse-menu__list">
          ${renderLinks(host)}
          ${host.disabledTheme ? html`` : html`<td-theme-tabs></td-theme-tabs>`}
        </div>
      </td-doc-popup>
    </div>
  `.css`${style}`,
});
