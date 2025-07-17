import { define, html } from 'hybrids';
import { getLocale } from '@config/locale.js';
import splineConfig from '@config/spline';
import historyIcon from '@images/history.svg?raw';
import { isComponentPage, isGlobalConfigPage, mobileBodyStyle, parseBoolean, watchHtmlMode } from '@utils';
import style from './style.less';

let timer = null;
let observeTimer = null;
const locale = getLocale();

function handleModeChange(themeMode, host) {
  if (!host.shadowRoot) return;
  const splineEl = host.shadowRoot.getElementById('__iframe__');
  let splineUrl = '';
  if (themeMode === 'dark') {
    splineUrl = splineConfig[`${host.spline}-dark`];
  } else {
    splineUrl = splineConfig[host.spline];
  }
  if (splineEl && splineUrl && splineUrl !== splineEl.src) {
    clearTimeout(timer);
    splineEl.style = 'max-height: 0;';
    splineEl.src = splineUrl;
  }
}

function iframeOnload(host) {
  if (!host.shadowRoot) return;
  const iframeEl = host.shadowRoot.getElementById('__iframe__');
  clearTimeout(timer);
  timer = setTimeout(() => {
    iframeEl &&
      (iframeEl.style = `
      max-height: 280px;
      transition: max-height .25s .2s var(--anim-time-fn-easing);
      -webkit-transition: max-height .25s .2s var(--anim-time-fn-easing);
    `);
  }, 600);
}

export default define({
  tag: 'td-doc-header',
  spline: {
    get: (_host, lastValue) => lastValue || '',
    set: (_host, value) => value,
    connect: (host) => {
      const observer = watchHtmlMode((themeMode) => handleModeChange(themeMode, host));

      return () => observer.disconnect();
    },
    observe: (host) => {
      clearTimeout(observeTimer);
      const themeMode = localStorage.getItem('--tdesign-theme') || 'light';
      observeTimer = setTimeout(() => {
        handleModeChange(themeMode, host);
      }, 600);
    },
  },
  platform: 'web',
  changelog: {
    get: (_host, lastValue) => parseBoolean(lastValue, true),
    set: (_host, value) => parseBoolean(value, true),
  },
  mobileBodyStyle,
  docInfo: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    observe: (host, value) => {
      if (document.getElementById('__td_doc_title__') || !value) return;

      const titleElement = document.createElement('h1');
      titleElement.id = '__td_doc_title__';
      titleElement.innerText = value.title;
      host.appendChild(titleElement);
    },
  },
  fixedTitle: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    connect: (host) => {
      const mediaQuery = window.matchMedia('(max-width: 1200px)');

      function changeTitlePos() {
        if (!host.shadowRoot) return;

        const { shadowRoot } = host;
        const { scrollTop } = document.documentElement;
        // 吸顶效果
        const background = shadowRoot.querySelector('.TDesign-doc-header__background') || { style: {} };
        const title = shadowRoot.querySelector('.TDesign-doc-header__info-title') || { style: {} };
        const describe = shadowRoot.querySelector('.TDesign-doc-header__info-describe') || { style: {} };
        const thumb = shadowRoot.querySelector('.TDesign-doc-header__thumb') || { style: {} };
        const issue = shadowRoot.querySelector('td-doc-issue') || { style: {} };
        const tabs = document.querySelector('td-doc-tabs');

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
            Object.assign(background.style, { position: 'fixed', top: '0', left: asideWidth });
            tabs &&
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
            Object.assign(thumb.style, { opacity: 0, visibility: 'hidden' });
            Object.assign(describe.style, { opacity: 0, visibility: 'hidden' });

            Object.assign(background.style, { position: 'absolute', top: 'unset', left: '0' });
            tabs && Object.assign(tabs.style, { position: 'absolute', top: '228px' });
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
            Object.assign(describe.style, { opacity: 1, visibility: 'visible' });
            Object.assign(background.style, { position: 'absolute', top: 'unset', left: '0' });
            tabs && Object.assign(tabs.style, { position: 'absolute', top: '228px' });
            Object.assign(issue.style, { position: 'absolute', top: 'calc(100% - 48px - 12px)' });
            Object.assign(thumb.style, { opacity: 1, visibility: 'visible' });
          }
        }
      }

      changeTitlePos();

      mediaQuery.addEventListener('change', changeTitlePos);
      window.addEventListener('resize', changeTitlePos);
      document.addEventListener('scroll', changeTitlePos);

      return () => {
        mediaQuery.removeEventListener('change', changeTitlePos);
        window.removeEventListener('resize', changeTitlePos);
        document.removeEventListener('scroll', changeTitlePos);
      };
    },
  },
  render: (host) => {
    const { changelog, docInfo, spline } = host;
    const mobileBodyStyle = { ...host.mobileBodyStyle };
    const splineUrl = splineConfig[spline];
    const isChangelogComponentRegistered = customElements.get('td-doc-changelog'); // 检查td-doc-changelog组件是否已注册
    const openChangelogDrawer = () => {
      let changelogEl = document.querySelector('td-doc-changelog');
      if (!changelogEl) {
        changelogEl = document.createElement('td-doc-changelog');
        document.body.appendChild(changelogEl);
      }
      // 为了触发动画，下一帧再切换为显示状态
      requestAnimationFrame(() => {
        changelogEl.visible = true;
      });
    };

    return html`
      ${splineUrl
        ? html` <iframe id="__iframe__" class="TDesign-doc-header__thumb" onload="${iframeOnload}"></iframe>`
        : html``}
      <div class="TDesign-doc-header" style="${mobileBodyStyle}">
        <div class="TDesign-doc-header__inner">
          <div class="TDesign-doc-header__badge">
            <slot name="badge"></slot>
          </div>
          <div class="TDesign-doc-header__content">
            <div class="TDesign-doc-header__info">
              ${docInfo
                ? html`
                    <div>
                      <h1 class="TDesign-doc-header__info-title">${docInfo.title}</h1>
                      ${changelog && isChangelogComponentRegistered && (isComponentPage() || isGlobalConfigPage())
                        ? html`
                            <button id="TDesign-doc-changelog__entry" onclick="${openChangelogDrawer}">
                              <i innerHTML="${historyIcon}"></i>
                              <span>${locale.changelog.title}</span>
                            </button>
                          `
                        : html``}
                    </div>
                    <div class="TDesign-doc-header__info-describe">
                      <div innerHTML="${docInfo.desc}"></div>
                    </div>
                  `
                : html``}
            </div>
          </div>
        </div>
      </div>
      <div class="TDesign-doc-header__background"></div>
      <td-doc-issue></td-doc-issue>
    `.css`${style}`;
  },
});
