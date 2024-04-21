/* eslint-disable prettier/prettier */
import { html, define } from 'hybrids';
import logoIcon from '@images/logo.svg?raw';
import menuApplicationIcon from '@images/menu-application.svg?raw';
import { logoMenuSvgPrefix } from '@config';
import { getLang } from '@utils';

import style from './style.less';
import portalStyle from './portal.less';

const isEnglish = getLang() === 'en';

const navList = [
  {
    title: '腾讯设计',
    children: [
      {
        key: 'tdesign',
        title: 'TDesign',
        url: 'https://tdesign.tencent.com/?utm_source=tdc&utm_medium=tdc.nav',
        desc: '企业级设计体系',
      },
      {
        key: 'codesign',
        title: 'CoDesign',
        url: 'https://codesign.qq.com/?utm_source=tdc&utm_medium=tdc.nav',
        desc: '一站式设计协作平台',
      },
    ],
  },
  {
    title: '腾讯调研',
    children: [
      {
        key: 'wj',
        title: '腾讯问卷',
        url: 'https://wj.qq.com/?utm_source=tdc&utm_medium=tdc.nav',
        desc: '免费的问卷调查系统',
      },
      {
        key: 'txc',
        title: '兔小巢',
        url: 'https://txc.qq.com/?utm_source=tdc&utm_medium=tdc.nav',
        desc: '用户反馈服务平台',
      },
    ],
  },
];
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

function renderMenu() {
  const len = navList.length;
  return navList.map(
    (item, index) => html`
      <span class="title"> ${item.title} </span>
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
