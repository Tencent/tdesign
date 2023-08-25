import { html, define } from "hybrids";
import style from "./style.less";
import portalStyle from "./portal.less";
import githubIcon from "@images/github.svg?raw";
import gitIcon from "@images/git.svg?raw";
import fakeArrowIcon from "@images/fake-arrow.svg?raw";
import translateIcon from "@images/translate.svg?raw";
import { isIntranet, getLang } from "@utils/index";
import closeIcon from "@images/close.svg?raw";
import { getHeaderConfig } from "@config/header.js";

const headerConfig = getHeaderConfig();
const { headerList, baseComponentsLinks, baseComponentPrefix } = headerConfig;

const allComponentsNpmUrl = [
  ...baseComponentsLinks.web.links.filter((l) => l.status).map((l) => l.npm),
  ...baseComponentsLinks.mobile.links.filter((l) => l.status).map((l) => l.npm),
];

export function handleLinkClick(host, e, item) {
  e.preventDefault();
  if (!item.status) return;
  location.href = item.path;
}

export function renderTag(status) {
  if (status === 0) return html`<span class="disable-tag">待上线</span>`;
  if (status === 1) return html`<span class="stable-tag">Stable</span>`;
  if (status === 2) return html`<span class="alpha-tag">Alpha</span>`;
  if (status === 3) return html`<span class="beta-tag">Beta</span>`;
  if (status === 4) return html`<span class="rc-tag">Rc</span>`;
}

function isActive(path) {
  if (/^https?:/.test(path)) return location.href.includes(path);
  return location.pathname.includes(path);
}

// 渲染公告
function renderNotice(host) {
  if (
    location.host !== "tdesign.tencent.com" &&
    !localStorage.getItem("TDesign_notice")
  )
    return html``;
  const { notice } = host;

  let currentSite = location.pathname.split("/")[1] || "site";
  if (["design", "source", "about"].includes(currentSite)) currentSite = "site";

  let noticeOption = notice[currentSite];
  // 无当前站点公告时，使用全站公告
  if (!noticeOption?.title) noticeOption = notice["all"];
  if (!noticeOption?.title) return html``;

  // 已关闭公告不再提醒
  if (localStorage.getItem("TDesign_notice_closed") === noticeOption?.title)
    return html``;

  const changeAsideElTop = (top = "96px") => {
    // 左侧栏适配
    const asideEl = document.querySelector("td-doc-aside");
    if (asideEl) {
      asideEl.style.setProperty("--aside-top", top);
      asideEl.shadowRoot.querySelector(".TDesign-doc-aside").style.top = top;
    }
  };

  const closeNotice = () => {
    if (!host.shadowRoot) return;
    host.shadowRoot.querySelector(".TDesign-header-notice").style.display =
      "none";
    changeAsideElTop("64px");
    localStorage.setItem("TDesign_notice_closed", noticeOption?.title);
  };

  const handleNoticeAction = () => {
    if (!noticeOption?.actionUrl) return;
    location.href = noticeOption.actionUrl;
  };

  changeAsideElTop();

  return html`
    <div class="TDesign-header-notice ${noticeOption.type}">
      <div
        class="TDesign-header-notice__content"
        onclick="${handleNoticeAction}"
      >
        ${noticeOption.title}
      </div>
      ${noticeOption.closeable &&
      html`<i
        class="TDesign-header-notice__close"
        innerHTML="${closeIcon}"
        onclick="${closeNotice}"
      ></i>`}
    </div>
  `;
}

function renderLinksPopup(host, trigger) {
  return html`
    <td-doc-popup placement="bottom" portalStyle="${portalStyle}">
      ${trigger}
      <div slot="content" class="TDesign-base-components-links">
        <div class="TDesign-base-components-links__web">
          <p class="title">${baseComponentsLinks.web.name}</p>
          <div class="TDesign-base-components-links__list">
            ${baseComponentsLinks.web.links.map(
              (item) => html`
                <a
                  href="${item.path}"
                  class="link ${isActive(item.path)
                    ? "active"
                    : ""} ${!item.status ? "disabled" : ""}"
                  onclick=${(host, e) => handleLinkClick(host, e, item)}
                >
                  <img class="icon" src="${item.icon}" />
                  <div class="details">
                    <span class="name">
                      ${item.name} ${renderTag(item.status)}
                    </span>
                    <span class="version">
                      ${item.status
                        ? `Version：${host.npmVersions[item.npm]}`
                        : "敬请期待"}
                    </span>
                  </div>
                </a>
              `
            )}
          </div>
        </div>

        <div class="TDesign-base-components-links__mobile">
          <p class="title">${baseComponentsLinks.mobile.name}</p>
          <div class="TDesign-base-components-links__list">
            ${baseComponentsLinks.mobile.links.map(
              (item) => html`
                <a
                  href="${item.path}"
                  class="link ${isActive(item.path)
                    ? "active"
                    : ""} ${!item.status ? "disabled" : ""}"
                  onclick=${(host, e) => handleLinkClick(host, e, item)}
                >
                  <img class="icon" src="${item.icon}" />
                  <div class="details">
                    <span class="name">
                      ${item.name} ${renderTag(item.status)}
                    </span>
                    <span class="version">
                      ${item.status
                        ? `Version：${host.npmVersions[item.npm] || "alpha"}`
                        : "敬请期待"}
                    </span>
                  </div>
                </a>
              `
            )}
          </div>
        </div>
      </div>
    </td-doc-popup>
  `;
}

export function gitPath(platform, framework) {
  const isStarter = /starter/.test(location.pathname);
  if (isStarter) {
    const [, starterFramework] =
      location.pathname.match(/starter\/docs\/([\w-]+)/) || [];
    if (!starterFramework)
      return "https://github.com/Tencent/?q=tdesign+starter";
    return `https://github.com/Tencent/tdesign-${starterFramework}-starter`;
  }

  if (framework === "site") {
    return isIntranet()
      ? "https://git.woa.com/groups/TDesign/-/projects/list"
      : "https://github.com/Tencent/tdesign";
  } else if (platform === "mobile") {
    return isIntranet()
      ? `https://git.woa.com/Tdesign/Tdesign-${platform}-${framework}`
      : `https://github.com/Tencent/tdesign-${platform}-${framework}`;
  } else if (framework === "flutter") {
    // 等待 flutter 仓库迁移到 Tencent Group 下后可以删除
    return "https://github.com/TDesignOteam/tdesign-flutter";
  } else {
    return isIntranet()
      ? `https://git.woa.com/Tdesign/Tdesign-${platform}-${framework}`
      : `https://github.com/Tencent/tdesign-${framework}`;
  }
}

function renderLinks(host, headerList, platform, framework) {
  const gitLink = html`
    <a
      class="TDesign-header-nav__git"
      href="${gitPath(platform, framework)}"
      id="${platform}"
      target="_blank"
    >
      <span
        class="TDesign-header-nav__git-icon"
        innerHTML="${isIntranet() ? gitIcon : githubIcon}"
      ></span>
    </a>
  `;

  function handleTranslate() {
    const lang = getLang();
    const nextLang = lang === "zh" ? "en" : "zh";
    document.dispatchEvent(
      new CustomEvent("tdesign_site_lang", { detail: nextLang })
    );
  }

  const translateLink = host.enabledLocale
    ? html`
        <div class="TDesign-header-nav__translate" onclick="${handleTranslate}">
          <span
            class="TDesign-header-nav__translate-icon"
            innerHTML="${translateIcon}"
          ></span>
        </div>
      `
    : html``;

  const isBaseActive = () => {
    const [, basePath] = location.pathname.split("/");
    return baseComponentPrefix.includes(basePath);
  };

  return headerList
    .map((item) => {
      if (item.type === "base") {
        const trigger = html`
          <span
            class="TDesign-header-nav__link ${isBaseActive() ? "active" : ""}"
          >
            ${item.name} <i class="icon" innerHTML="${fakeArrowIcon}"></i>
          </span>
        `;
        return renderLinksPopup(host, trigger);
      }
      return html`
        <a
          class="TDesign-header-nav__link ${isActive(item.path)
            ? "active"
            : ""}"
          href="${item.path}"
          target="${item.target}"
          >${item.name}</a
        >
      `;
    })
    .concat(translateLink)
    .concat(gitLink);
}

export default define({
  tag: "td-header",
  platform: "web",
  framework: "vue",
  disabledTheme: false,
  enabledLocale: true,
  notice: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value) => value,
    connect: (host, key) => {
      fetch(import.meta.env.VITE_SITE_NOTICE_URL)
        .then((res) => res.json())
        .then((res) => {
          host.notice = res;
        })
        .catch(console.error);
    },
  },
  npmVersions: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value) => value,
    connect: (host, key) => {
      allComponentsNpmUrl.forEach((item) => {
        fetch(`https://mirrors.tencent.com/npm/${item}`)
          .then((res) => res.json())
          .then((res) => {
            const latestVersion = res?.["dist-tags"]?.["latest"];
            host.npmVersions = {
              ...host.npmVersions,
              [item]: latestVersion,
            };
          })
          .catch(console.error);
      });
    },
  },
  collapseMenu: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value) => value,
    connect: (host, key) => {
      function handleResize() {
        const isMobileResponse = window.innerWidth < 960;
        Object.assign(host, { [key]: isMobileResponse });
      }

      requestAnimationFrame(() => handleResize());

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
  },
  render: (host) => {
    const { platform, framework, disabledTheme, collapseMenu } = host;

    return html`
      ${renderNotice(host)}
      <header class="TDesign-header">
        <div class="TDesign-header-inner">
          <div class="TDesign-header-left">
            <td-logo></td-logo>
          </div>
          <div class="TDesign-header-nav">
            ${collapseMenu
              ? html`
                  <td-collapse-menu
                    disabledTheme="${disabledTheme}"
                    platform="${platform}"
                    framework="${framework}"
                    headerList="${headerList}"
                    baseComponentsLinks="${baseComponentsLinks}"
                  >
                  </td-collapse-menu>
                `
              : html`
                  <div class="slot-search">
                    <slot name="search"></slot>
                  </div>
                  ${renderLinks(host, headerList, platform, framework)}
                  ${disabledTheme
                    ? html``
                    : html`<td-theme-tabs></td-theme-tabs>`}
                `}
          </div>
        </div>
      </header>
    `.css`${style}`;
  },
});
