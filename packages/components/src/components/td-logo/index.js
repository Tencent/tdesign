/* eslint-disable prettier/prettier */
import { html, define } from 'hybrids';
import logoIcon from '@images/logo.svg?raw';
import menuApplicationIcon from '@images/menu-application.svg?raw';
import chevronRightIcon from '@images/chevron-right.svg?raw';
import { isIntranet } from '@utils/index';
import { logoMenuConfigCdn, logoMenuConfigWoaCdn, logoMenuSvgPrefix } from '@config';
import { getLang } from '@utils';

import style from './style.less';
import portalStyle from './portal.less';

const isEnglish = getLang() === 'en';

function renderList(list = []) {
  return html` <div class="list">
    ${list.map(
      (item) =>
        html` <a class="item" href="${item.url}" target="${item.target}">
          <img class="icon" src="${logoMenuSvgPrefix}/${item.key}.svg" />
          <div class="details">
            <span class="name">${item.title}</span>
            <span class="desc">${item.desc}</span>
          </div>
        </a>`,
    )}
  </div>`;
}

function renderMenu(list) {
  const len = list.length;
  return list.map(
    (item, index) => html`
      ${item.category_url
        ? html`
            <a href="${item.category_url}" class="title" target="${item.target}">
              ${item.category_title} <i innerHTML="${chevronRightIcon}"></i>
            </a>
          `
        : html` <span class="title"> ${item.category_title} </span> `}
      ${renderList(item.children)} ${index < len - 1 ? html`<div class="line"></div>` : html``}
    `,
  );
}

export default define({
  tag: 'td-logo',
  menuList: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value) => value,
  },
  isIntranet: {
    get: () => isIntranet(),
    set: (value) => value,
    connect: (host) => {
      const menuCdn = isIntranet() ? logoMenuConfigWoaCdn : logoMenuConfigCdn;
      fetch(menuCdn)
        .then((res) => res.json())
        .then((menuList) => {
          // 整理 menu 字段
          menuList.forEach((menu) => {
            menu.target = '_blank';
            menu.children.forEach((child) => {
              if (child.url.includes('tdesign')) {
                child.target = '_self';
              } else {
                child.target = '_blank';
              }
            });
          });
          Object.assign(host, { menuList });
        });
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
      <a class="home" href="${isEnglish ? '/index-en' : '/'}" title="TDesign" innerHTML=${logoIcon}></a>
    </div>
  `,
});
