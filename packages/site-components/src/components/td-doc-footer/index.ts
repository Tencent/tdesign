import { html, define } from 'hybrids';
import { getFooterConfig } from '@config/footer';
import { getLocale } from '@config/locale';
import { attribute, patchShadowDomIntoDom, mobileBodyStyle } from '@utils';
import { fetchEcosystemConfig, getEcosystemLinkTarget } from '@config/ecosystem';
import type { FooterGroup } from '@config/types';
import tencentCloudIcon from '@images/tencentcloud-logo.svg?raw';
import committeeIcon from '@images/committee-logo.svg?raw';
import tdesignLogo from '@images/logo.svg?raw';

import flutterLogo from '@images/flutter-logo.svg?raw';
import vueLogo from '@images/vue-logo.svg?raw';
import reactLogo from '@images/react-logo.svg?raw';
import wxLogo from '@images/miniprogram-logo.svg?raw';
import uniappLogo from '@images/uniapp-logo.svg?raw';
import figmaLogo from '@images/figma-logo.svg?raw';

import designGroup from '@images/groups/design-group.png';
import flutterGroup from '@images/groups/flutter-group.png';
import vueGroup from '@images/groups/vue-group.png';
import reactGroup from '@images/groups/react-group.png';
import wxGroup from '@images/groups/wx-group.png';

import style from './style.less?inline';
import portalStyle from './portal.less?inline';

const locale = getLocale();
const currentYear = new Date().getFullYear();

type GroupType = 'vue' | 'react' | 'wx' | 'uniapp' | 'flutter' | 'design';
interface BodyStyle {
  paddingRight?: string;
}

const groupCodeMap = {
  vue: vueGroup,
  react: reactGroup,
  wx: wxGroup,
  uniapp: wxGroup,
  flutter: flutterGroup,
  design: designGroup,
} satisfies Record<GroupType, string>;

const communityPlatforms: Array<{ type: GroupType; name: string; icon: string }> = [
  { type: 'vue', name: 'Vue', icon: vueLogo },
  { type: 'wx', name: 'MiniProgram', icon: wxLogo },
  { type: 'react', name: 'React', icon: reactLogo },
  { type: 'uniapp', name: 'UniApp', icon: uniappLogo },
  { type: 'flutter', name: 'Flutter', icon: flutterLogo },
  { type: 'design', name: 'Figma', icon: figmaLogo },
];

interface FooterHost {
  mobileBodyStyle: BodyStyle;
  platform: string;
  displayQrCode: string;
  patchDom: boolean;
  footerLinks: FooterGroup[];
}

export default define<FooterHost>({
  tag: 'td-doc-footer',
  platform: attribute('web'),
  mobileBodyStyle,
  displayQrCode: '',
  footerLinks: {
    value: (_host, value) => value || getFooterConfig(),
    connect: (host) => {
      fetchEcosystemConfig()
        .then((categories) => {
          const links = categories.flatMap((category) =>
            category.items.map((item) => ({
              name: item.name,
              url: item.url,
              target: getEcosystemLinkTarget(item.url),
            })),
          );
          host.footerLinks = host.footerLinks.map((group) => (group.desktopOnly ? { ...group, links } : group));
        })
        .catch(console.error);
    },
  },
  patchDom: {
    value: (_host, v) => v || false,
    connect: patchShadowDomIntoDom,
  },
  render: (host) => {
    const mobileBodyStyle = { ...host.mobileBodyStyle };

    return html`
      <footer class="TDesign-doc-footer" style="${mobileBodyStyle}">
        <div class="TDesign-doc-footer__inner">
          <section class="TDesign-doc-footer__main">
            <div class="TDesign-doc-footer__brand">
              <span class="TDesign-doc-footer__brand-logo" aria-label="TDesign" innerHTML="${tdesignLogo}"></span>
              <p>${locale.footer.brandDescription}</p>
            </div>
            <nav class="TDesign-doc-footer__links" aria-label="${locale.footer.navigationLabel}">
              ${host.footerLinks.map(
                (item) => html`
                  <div class="TDesign-doc-footer__links-group ${item.desktopOnly ? 'is-desktop-only' : ''}">
                    <p class="title">${item.title}</p>
                    <div class="links">
                      ${item.links.map(
                        (link) => html`
                          <a class="link" href="${link.url}" target="${link.target}">
                            <span>${link.name}</span>
                          </a>
                        `,
                      )}
                    </div>
                  </div>
                `,
              )}
            </nav>
          </section>

          <section class="TDesign-doc-footer__community">
            <p>${locale.footer.communityDescription}</p>
            <div class="TDesign-doc-footer__community-actions">
              <strong>${locale.footer.scanQrCode}</strong>
              <div class="TDesign-doc-footer__platforms">
                ${communityPlatforms.map(
                  (item) => html`
                    <td-doc-popup
                      placement="top"
                      portal-class="TDesign-doc__qrcode-popup"
                      portal-style="${portalStyle}"
                    >
                      <button
                        class="platform platform-${item.type}"
                        type="button"
                        aria-label="${item.name}"
                        title="${item.name}"
                      >
                        <i innerHTML="${item.icon}"></i>
                      </button>
                      <div slot="content" class="TDesign-doc__qrcode-inner">
                        <img
                          width="120"
                          height="120"
                          src="${groupCodeMap[item.type]}"
                          alt="${item.name} ${locale.footer.communityQrCode}"
                        />
                      </div>
                    </td-doc-popup>
                  `,
                )}
              </div>
            </div>
          </section>

          <section class="TDesign-doc-footer__legal">
            <p class="copyright">
              Copyright &copy; 1998 - ${currentYear} Tencent. All Rights Reserved. ${locale.footer.copyright}
            </p>
            <div class="TDesign-doc-footer__company-logos">
              <i class="company-logo committee" innerHTML="${committeeIcon}"></i>
              <a
                class="company-logo cloud"
                href="https://cloud.tencent.com/"
                target="_blank"
                aria-label="${locale.footer.tencentCloud}"
                innerHTML="${tencentCloudIcon}"
              ></a>
            </div>
          </section>
        </div>
      </footer>
    `.css`${style}`;
  },
});
