import { getLocale } from '@config/locale';
import historyIcon from '@images/history.svg?raw';
import { isComponentPage, isGlobalConfigPage, mobileBodyStyle, parseBoolean } from '@utils';
import { define, html } from 'hybrids';
import style from './style.less?inline';

interface DocInfo {
  title: string;
  desc: string | string[];
}

interface HeaderHost {
  platform: string;
  changelog: boolean;
  changelogEn: boolean;
  mobileBodyStyle: { paddingRight?: string };
  shouldShowPopup: boolean;
  docInfo: DocInfo | undefined;
  fixedTitle: boolean | undefined;
  showIssue: boolean;
}

interface ChangelogElement extends HTMLElement {
  changelogEn: boolean;
  visible: boolean;
}

let popupCheckTimer: ReturnType<typeof setTimeout> | undefined;
const locale = getLocale();

function checkDescribeLineOverflow(host: HeaderHost & HTMLElement): void {
  if (popupCheckTimer) clearTimeout(popupCheckTimer);
  popupCheckTimer = setTimeout(() => {
    requestAnimationFrame(() => {
      const describeLine = host.shadowRoot?.querySelector<HTMLElement>('.td-doc-header__info-describe-line');
      if (describeLine) {
        const computedStyle = getComputedStyle(describeLine);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const maxHeight = lineHeight * 2;
        host.shouldShowPopup = describeLine.scrollHeight > maxHeight;
      }
    });
  }, 100);
}

export default define<HeaderHost>({
  tag: 'td-doc-header',
  platform: 'web',
  changelog: {
    value: (_host, v) => parseBoolean(v, true),
  },
  changelogEn: {
    value: (_host, v) => parseBoolean(v, true),
  },
  mobileBodyStyle,
  shouldShowPopup: {
    value: (_host, v) => v || false,
  },
  docInfo: {
    value: (_host, v) => v || undefined,
    observe: (host, value) => {
      if (document.getElementById('__td_doc_title__') || !value) return;

      const titleElement = document.createElement('h1');
      titleElement.id = '__td_doc_title__';
      titleElement.innerText = value.title;
      host.appendChild(titleElement);

      // 检查描述是否被省略
      checkDescribeLineOverflow(host);
    },
  },
  fixedTitle: {
    value: (_host, v) => v || undefined,
    connect: (host) => {
      const mediaQuery = window.matchMedia('(max-width: 1200px)');
      let lastWidth = window.innerWidth;

      function changeTitlePos() {
        if (!host.shadowRoot) return;

        const { shadowRoot } = host;
        const { scrollTop } = document.documentElement;
        // 吸顶效果
        const background =
          shadowRoot.querySelector<HTMLElement>('.td-doc-header__background') ?? document.createElement('div');
        const changelogEntry =
          shadowRoot.querySelector<HTMLElement>('.td-doc-changelog__entry') ?? document.createElement('div');
        const title =
          shadowRoot.querySelector<HTMLElement>('.td-doc-header__info-title') ?? document.createElement('div');
        const describe =
          shadowRoot.querySelector<HTMLElement>('.td-doc-header__info-describe') ?? document.createElement('div');
        const issue = shadowRoot.querySelector<HTMLElement>('td-doc-issue') ?? document.createElement('div');
        const tabs = document.querySelector<HTMLElement>('td-doc-tabs');

        // 适配移动端
        const isMobileResponse = mediaQuery.matches;
        const asideWidth = isMobileResponse ? 0 : '260px';
        const titleFontSize = isMobileResponse ? '32px' : '48px';

        if (scrollTop >= 228) {
          if (title.style.position !== 'fixed') {
            Object.assign(title.style, {
              position: 'fixed',
              top: tabs ? '16px' : '28px',
              fontSize: '24px',
              opacity: 1,
              visibility: 'visible',
            });
            Object.assign(changelogEntry.style, { opacity: 1, visibility: 'visible' });
            Object.assign(background.style, { position: 'fixed', top: '0', left: asideWidth });
            if (tabs)
              Object.assign(tabs.style, {
                position: 'fixed',
                top: '64px',
                zIndex: 500,
              });
            Object.assign(issue.style, { position: 'fixed', top: '24px', right: '24px' });
          }
        } else if (scrollTop > 192 && scrollTop < 228) {
          if (title.style.visibility !== 'hidden') {
            Object.assign(title.style, { opacity: 0, visibility: 'hidden' });
            Object.assign(changelogEntry.style, { opacity: 0, visibility: 'hidden' });
            Object.assign(describe.style, { opacity: 0, visibility: 'hidden' });

            Object.assign(background.style, { position: 'absolute', top: 'unset', left: '0' });
            if (tabs) Object.assign(tabs.style, { position: 'absolute', top: '228px' });
            Object.assign(issue.style, { position: 'absolute', top: 'calc(100% - 48px - 12px)' });
          }
        } else {
          if (title.style.position === 'fixed' || title.style.visibility === 'hidden') {
            Object.assign(title.style, {
              position: 'unset',
              fontSize: titleFontSize,
              opacity: 1,
              visibility: 'visible',
            });
            Object.assign(changelogEntry.style, { opacity: 1, visibility: 'visible' });
            Object.assign(describe.style, { opacity: 1, visibility: 'visible' });
            Object.assign(background.style, { position: 'absolute', top: 'unset', left: '0' });
            if (tabs) Object.assign(tabs.style, { position: 'absolute', top: '228px' });
            Object.assign(issue.style, { position: 'absolute', top: 'calc(100% - 48px - 12px)' });
          }
        }
      }

      function handleMediaChange() {
        changeTitlePos();
        checkDescribeLineOverflow(host);
      }

      function handleResize() {
        changeTitlePos();
        const currentWidth = window.innerWidth;
        if (currentWidth !== lastWidth) {
          lastWidth = currentWidth;
          checkDescribeLineOverflow(host);
        }
      }

      changeTitlePos();

      mediaQuery.addEventListener('change', handleMediaChange);
      window.addEventListener('resize', handleResize);
      document.addEventListener('scroll', changeTitlePos);

      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('scroll', changeTitlePos);
      };
    },
  },
  showIssue: {
    value: (_host, v) => parseBoolean(v, true),
  },

  render: (host) => {
    const { changelog, changelogEn, docInfo, showIssue } = host;
    const mobileBodyStyle = { ...host.mobileBodyStyle };
    const isChangelogComponentRegistered = customElements.get('td-doc-changelog'); // 检查td-doc-changelog组件是否已注册
    const openChangelogDrawer = () => {
      let changelogEl = document.querySelector<ChangelogElement>('td-doc-changelog');
      if (!changelogEl) {
        changelogEl = document.createElement('td-doc-changelog') as ChangelogElement;
        changelogEl.changelogEn = changelogEn;
        document.body.appendChild(changelogEl);
      }
      // 为了触发动画，下一帧再切换为显示状态
      requestAnimationFrame(() => {
        changelogEl.visible = true;
      });
    };

    return html`
      <div class="td-doc-header" style="${mobileBodyStyle}">
        <div class="td-doc-header__inner">
          <div class="td-doc-header__badge">
            <slot name="badge"></slot>
          </div>
          <div class="td-doc-header__content">
            <div class="td-doc-header__info">
              ${
                docInfo
                  ? html`
                      <div>
                        <h1 class="td-doc-header__info-title">${docInfo.title}</h1>
                        ${
                          changelog && isChangelogComponentRegistered && (isComponentPage() || isGlobalConfigPage())
                            ? html`
                                <button class="td-doc-changelog__entry" onclick="${openChangelogDrawer}">
                                  <i innerHTML="${historyIcon}"></i>
                                  <span>${locale.changelog.title}</span>
                                </button>
                              `
                            : html``
                        }
                      </div>
                      <div class="td-doc-header__info-describe">
                        ${
                          host.shouldShowPopup
                            ? html`
                                <td-doc-popup placement="top-end" equal-width="true">
                                  <div class="td-doc-header__info-describe-line" innerHTML="${docInfo.desc}"></div>
                                  <div slot="content" innerHTML="${docInfo.desc}"></div>
                                </td-doc-popup>
                              `
                            : html` <div class="td-doc-header__info-describe-line" innerHTML="${docInfo.desc}"></div> `
                        }
                      </div>
                    `
                  : html``
              }
            </div>
          </div>
        </div>
      </div>
      <div class="td-doc-header__background"></div>
      ${showIssue ? html`<td-doc-issue />` : html``}
    `.css`${style}`;
  },
});
