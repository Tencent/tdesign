import { html, define } from 'hybrids';
import logoIcon from '@images/logo.svg?raw';
import menuApplicationIcon from '@images/menu-application.svg?raw';
import chevronRightIcon from '@images/chevron-right.svg?raw';
import {
  fetchEcosystemConfig,
  getEcosystemLinkTarget,
  type EcosystemCategory,
  type EcosystemItem,
} from '@config/ecosystem';
import { isEn } from '@utils';

import style from './style.less?inline';
import portalStyle from './portal.less?inline';

interface LogoProps {
  menuList: EcosystemCategory[];
}

function renderList(list: EcosystemItem[] = []) {
  return html` <div class="list">
    ${list.map(
      (item) =>
        html` <a class="item" href="${item.url}" target="${getEcosystemLinkTarget(item.url)}">
          <img class="icon" src="${item.logoSrc}" />
          <div class="details">
            <span class="name">${item.name}</span>
            <span class="desc">${item.description}</span>
          </div>
        </a>`,
    )}
  </div>`;
}

function renderMenu(list: EcosystemCategory[]) {
  const len = list.length;
  return list.map(
    (category, index) => html`
      ${
        category.categoryUrl && category.categoryUrl !== 'null'
          ? html`
              <a href="${category.categoryUrl}" class="title" target="${getEcosystemLinkTarget(category.categoryUrl)}">
                ${category.categoryTitle} <i innerHTML="${chevronRightIcon}"></i>
              </a>
            `
          : html` <span class="title"> ${category.categoryTitle} </span> `
      }
      ${renderList(category.items)} ${index < len - 1 ? html`<div class="line"></div>` : html``}
    `,
  );
}

export default define<LogoProps>({
  tag: 'td-logo',
  menuList: {
    value: (host, v) => v || [],
    connect: (host) => {
      fetchEcosystemConfig()
        .then((menuList) => {
          host.menuList = menuList;
        })
        .catch(console.error);
    },
  },
  render: ({ menuList }) => html`
    <style>
      ${style}
    </style>

    <div class="TDesign-header-logo">
      <td-doc-popup portalStyle="${portalStyle}" placement="bottom-start">
        <div class="TDesign-header-logo__menu" innerHTML=${menuApplicationIcon}></div>
        <div slot="content" class="TDesign-header-logo__content">${renderMenu(menuList)}</div>
      </td-doc-popup>
      <span class="divider"></span>
      <a class="home" href="${isEn() ? '/index-en' : '/'}" title="TDesign" innerHTML=${logoIcon}></a>
    </div>
  `,
});
