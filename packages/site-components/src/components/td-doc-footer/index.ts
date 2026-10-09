import { html, define } from 'hybrids';
import { getFooterConfig } from '@config/footer';
import { getLocale } from '@config/locale';
import { patchShadowDomIntoDom, mobileBodyStyle } from '@utils';
import tencentCloudIcon from '@images/tencentcloud-logo.svg?raw';
import committeeIcon from '@images/committee-logo.svg?raw';
import tdesignLogo from '@images/logo.svg?raw';

import flutterLogo from '@images/groups/flutter-logo.svg?raw';
import vueLogo from '@images/groups/vue-logo.svg?raw';
import reactLogo from '@images/groups/react-logo.svg?raw';
import wxLogo from '@images/groups/wx-logo.svg?raw';
import uniappLogo from './uniapp-logo.svg?raw';
import figmaLogo from './figma-logo.svg?raw';

import designGroup from '@images/groups/design-group.png';
import flutterGroup from '@images/groups/flutter-group.png';
import vueGroup from '@images/groups/vue-group.png';
import reactGroup from '@images/groups/react-group.png';
import wxGroup from '@images/groups/wx-group.png';

import style from './style.less?inline';
import portalStyle from './portal.less?inline';

const footerLinks = getFooterConfig();
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
  { type: 'react', name: 'React', icon: reactLogo },
  { type: 'vue', name: 'Vue', icon: vueLogo },
  { type: 'wx', name: 'MiniProgram', icon: wxLogo },
  { type: 'uniapp', name: 'UniApp', icon: uniappLogo },
  { type: 'flutter', name: 'Flutter', icon: flutterLogo },
  { type: 'design', name: 'Figma', icon: figmaLogo },
];

interface FooterHost {
  mobileBodyStyle: BodyStyle;
  platform: string;
  displayQrCode: string;
  patchDom: boolean;
}

export default define<FooterHost>({
  tag: 'td-doc-footer',
  mobileBodyStyle,
  platform: 'web',
  displayQrCode: '',
  patchDom: {
    value: (_host, v) => v || false,
    connect: patchShadowDomIntoDom,
  },
  render: (host) => {
    const mobileBodyStyle = { ...host.mobileBodyStyle };

    return html`
      <footer class="TDesign-doc-footer" style="${mobileBodyStyle}" data-screenshot-root>
        <div class="TDesign-doc-footer__inner">
          <section class="TDesign-doc-footer__main">
            <div class="TDesign-doc-footer__brand">
              <span class="TDesign-doc-footer__brand-logo" aria-label="TDesign" innerHTML="${tdesignLogo}"></span>
              <p>为腾讯业务打造的一站式企业级设计体系，连接设计与开发，助力高效构建一致的产品体验。</p>
            </div>
            <nav class="TDesign-doc-footer__links" aria-label="页脚导航">
              ${footerLinks.map(
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
            <p>加入社群实时交流，答疑解惑分享经验。</p>
            <div class="TDesign-doc-footer__community-actions">
              <strong>扫描二维码：</strong>
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
                        <img width="120" height="120" src="${groupCodeMap[item.type]}" alt="${item.name} 社群二维码" />
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
                aria-label="腾讯云"
                innerHTML="${tencentCloudIcon}"
              ></a>
            </div>
          </section>
        </div>
      </footer>
    `.css`${style}`;
  },
});
