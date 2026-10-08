import { html, dispatch, define, type Component } from 'hybrids';
import menuFoldIcon from '@images/menu-fold.svg?raw';
import menuUnfoldIcon from '@images/menu-unfold.svg?raw';
import { patchShadowDomIntoDom } from '@utils';
import style from './style.less?inline';

const replaceStateEvent = new CustomEvent('replaceState');

interface NavItem {
  title: string;
  path?: string;
  customTag?: string;
  children?: NavItem[];
}

interface AsideHost {
  routerList: NavItem[];
  title: string;
  patchDom: boolean;
  updateNotice: Record<string, string[]>;
  asideStyle: string | undefined;
  collapse: boolean;
}

// proxy replaceState event
const originHistoryEvent = window.history.replaceState;
window.history.replaceState = (...args) => {
  originHistoryEvent.apply(window.history, args);
  window.dispatchEvent(replaceStateEvent);
};

function handleLinkClick(host: AsideHost & HTMLElement, e: Event, path: string | undefined): void {
  e.preventDefault();
  const eventTarget = e.target;
  if (!(eventTarget instanceof HTMLElement)) return;
  const shadowRoot = eventTarget.getRootNode();
  if (!(shadowRoot instanceof ShadowRoot || shadowRoot instanceof Document)) return;
  const target = eventTarget.classList.contains('td-doc-sidenav-link') ? eventTarget : eventTarget.parentElement;
  if (!target) return;
  const prevActiveNodes = shadowRoot.querySelectorAll('.active');
  prevActiveNodes.forEach((node) => node.classList.remove('active'));
  target.classList.toggle('active');
  requestAnimationFrame(() => dispatch(host, 'change', { detail: path }));
}

function scrollToActiveLink(host: AsideHost & HTMLElement): void {
  if (!host.shadowRoot) return;

  const sidenav = host.shadowRoot.querySelector<HTMLElement>('.td-doc-sidenav');
  const activeLink = host.shadowRoot.querySelector<HTMLElement>('.td-doc-sidenav-link.active');

  if (sidenav && activeLink) {
    const sidenavRect = sidenav.getBoundingClientRect();
    const activeLinkRect = activeLink.getBoundingClientRect();

    const offsetTop = activeLinkRect.top - sidenavRect.top + sidenav.scrollTop;
    const sidenavHeight = sidenav.clientHeight;
    const activeLinkHeight = activeLink.clientHeight;

    // 滚动到可视范围的中间
    const targetScrollTop = offsetTop - sidenavHeight / 2 + activeLinkHeight / 2;
    sidenav.scrollTop = targetScrollTop;
  }
}

type RenderedNav = ReturnType<typeof html> | RenderedNav[];

function hasUpdateNotice(updateNotice: Record<string, string[]>, site: string, title: string): boolean {
  return updateNotice[site]?.some((item) => title.includes(item)) ?? false;
}

function renderNav(host: AsideHost & HTMLElement, nav: NavItem | NavItem[], deep = 0): RenderedNav {
  if (Array.isArray(nav)) return nav.map((item) => renderNav(host, item, deep));

  const isActive = location.pathname === nav.path || location.hash.slice(1) === nav.path;
  scrollToActiveLink(host);

  const hasUpdate = () => {
    const currentSite = location.pathname.split('/')[1];
    if (!currentSite) return false;

    return hasUpdateNotice(host.updateNotice, currentSite, nav.title);
  };

  if (nav.children) {
    return html`
      <div class="td-doc-sidenav-group td-doc-sidenav-group--deep${deep}">
        <span class="td-doc-sidenav-group__title">${nav.title}</span>
        <div class="td-doc-sidenav-group__children">${renderNav(host, nav.children, deep + 1)}</div>
      </div>
    `;
  }

  return html`
    <div class="td-doc-sidenav-item">
      <a
        href="${nav.path}"
        class="td-doc-sidenav-link ${isActive ? 'active' : ''}"
        onclick=${(eventHost: AsideHost & HTMLElement, e?: Event) => e && handleLinkClick(eventHost, e, nav.path)}
      >
        ${nav.title} ${hasUpdate() ? html`<span class="td-doc-sidenav-link__tag">Update</span>` : null}
        ${nav.customTag ? html`<span class="td-doc-sidenav-link__tag">${nav.customTag}</span>` : null}
      </a>
    </div>
  `;
}

function toggleCollapseAside(host: AsideHost & HTMLElement): void {
  if (!host.shadowRoot) return;
  const aside = host.shadowRoot.querySelector<HTMLElement>('.td-doc-aside');
  if (!aside) return;
  const asideClassList = aside.classList;
  if (asideClassList.contains('hide')) {
    asideClassList.remove('hide');
    asideClassList.add('show');
  } else {
    asideClassList.remove('show');
    asideClassList.add('hide');
  }
  Object.assign(host, { collapse: !host.collapse });
}

function isUpdateNotice(value: unknown): value is Record<string, string[]> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((entry) => Array.isArray(entry) && entry.every((item) => typeof item === 'string'));
}

const asideComponent = {
  tag: 'td-doc-aside',
  routerList: {
    value: (_host: AsideHost & HTMLElement, v?: NavItem[]) => v || [],
  },
  title: '',
  patchDom: {
    value: (_host: AsideHost & HTMLElement, v?: boolean) => v || false,
    connect: patchShadowDomIntoDom,
  },
  updateNotice: {
    value: (_host: AsideHost & HTMLElement, value?: unknown) => (isUpdateNotice(value) ? value : {}),
    connect: (host: AsideHost & HTMLElement) => {
      fetch(import.meta.env.VITE_SLIDER_NOTICE_URL)
        .then((res) => res.json() as Promise<unknown>)
        .then((res) => {
          if (isUpdateNotice(res)) host.updateNotice = res;
        })
        .catch(console.error);
    },
  },
  asideStyle: {
    value: (_host: AsideHost & HTMLElement, v?: string) => v || undefined,
    connect: (host: AsideHost & HTMLElement) => {
      function setFixed() {
        if (!host.shadowRoot) return;
        const { shadowRoot } = host;
        const { scrollTop } = document.documentElement;
        // 吸顶效果
        const aside = shadowRoot.querySelector<HTMLElement>('.td-doc-aside');
        if (!aside) return;

        const top = getComputedStyle(host).getPropertyValue('--aside-top') || '64px';

        if (scrollTop >= parseFloat(top)) {
          Object.assign(aside.style, { position: 'fixed', top: '0' });
        } else {
          Object.assign(aside.style, { position: 'absolute', top });
        }
      }

      function handleResize() {
        if (!host.shadowRoot) return;
        const isMobileResponse = window.innerWidth < 1200;
        const aside = host.shadowRoot.querySelector<HTMLElement>('.td-doc-aside');
        if (!aside) return;
        const asideClassList = aside.classList;
        if (isMobileResponse) {
          // safari 上下滑动也会触发 resize
          if (asideClassList.contains('show')) return;
          asideClassList.remove('show');
          asideClassList.remove('hide');
          asideClassList.add('hide');
        } else {
          asideClassList.remove('hide');
          asideClassList.remove('show');
        }
      }

      // 确保初次加载路由变更后侧边栏高亮判断失效
      function refreshAside() {
        Object.assign(host, { routerList: host.routerList.slice() });
      }

      // 监听路由变化
      function handleRouterChange() {
        if (!host.shadowRoot) return;

        const { shadowRoot } = host;

        requestAnimationFrame(() => {
          let currentRoute = location.pathname;
          // hash mode
          if (location.pathname === '/' && location.hash) {
            currentRoute = location.hash.slice(1);
          }

          const linkNodes = Array.from(shadowRoot.querySelectorAll<HTMLAnchorElement>('.td-doc-sidenav-link'));
          const prevActiveNodes = Array.from(
            shadowRoot.querySelectorAll<HTMLAnchorElement>('.td-doc-sidenav-link.active'),
          );
          const nextActiveNode = linkNodes.find((node) => {
            const urlObj = new URL(node.href);
            // host & pathname isSame
            return urlObj.host === location.host && urlObj.pathname === currentRoute;
          });

          if (!nextActiveNode) return;

          if (prevActiveNodes.length === 1 && prevActiveNodes.some((node) => node.href === nextActiveNode.href)) return;
          prevActiveNodes.forEach((node) => node.classList.remove('active'));
          nextActiveNode.classList.toggle('active');
        });
      }

      requestAnimationFrame(() => {
        handleResize();
      });

      window.addEventListener('load', refreshAside);
      window.addEventListener('resize', handleResize);
      document.addEventListener('scroll', setFixed);

      window.addEventListener('popstate', handleRouterChange);
      window.addEventListener('pushState', handleRouterChange);
      window.addEventListener('replaceState', handleRouterChange);

      return () => {
        window.removeEventListener('load', refreshAside);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('scroll', setFixed);

        window.removeEventListener('popstate', handleRouterChange);
        window.removeEventListener('pushState', handleRouterChange);
        window.removeEventListener('replaceState', handleRouterChange);
      };
    },
  },
  collapse: false,
  render: (host: AsideHost & HTMLElement) => {
    const { routerList, title, collapse } = host;

    return html`
      <aside class="td-doc-aside">
        <div class="td-doc-aside-collapse" onclick="${toggleCollapseAside}">
          <i class="icon" innerHTML="${collapse ? menuUnfoldIcon : menuFoldIcon}"></i>
        </div>
        <div class="td-doc-sidenav">
          ${title && html`<h2 class="td-doc-aside__title">${title}</h2>`}
          <slot class="td-doc-aside__extra" name="extra"></slot>
          ${renderNav(host, routerList)}
        </div>
      </aside>
      <div class="td-doc-aside-mask" onclick="${toggleCollapseAside}"></div>
    `.css`${style}`;
  },
};

export default define<AsideHost>(asideComponent as Component<AsideHost>);
