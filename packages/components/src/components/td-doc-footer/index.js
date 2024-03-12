import { html, define } from 'hybrids';
import { getFooterConfig } from '@config/footer.js';
import { getLocale } from '@config/locale.js';
import { patchShadowDomIntoDom, mobileBodyStyle } from '@utils';
import tencentCloudIcon from '@images/tencentcloud-logo.svg?raw';
import committeeIcon from '@images/committee-logo.svg?raw';

import designLogo from '@images/groups/design-logo.svg?raw';
import flutterLogo from '@images/groups/flutter-logo.svg?raw';
import vueLogo from '@images/groups/vue-logo.svg?raw';
import reactLogo from '@images/groups/react-logo.svg?raw';
import wxLogo from '@images/groups/wx-logo.svg?raw';

import designQrcodeIcon from '@images/groups/design-group.png';
import flutterQrcodeIcon from '@images/groups/flutter-group.png';
import vue2QrcodeIcon from '@images/groups/vue2-group.png';
import vue3QrcodeIcon from '@images/groups/vue3-group.png';
import reactQrcodeIcon from '@images/groups/react-group.png';
import wxQrcodeIcon from '@images/groups/wx-group.png';

import style from './style.less';
import portalStyle from './portal.less';

const footerLinks = getFooterConfig();
const locale = getLocale();
const currentYear = new Date().getFullYear();

const qrcodeMap = {
  vue2: vue2QrcodeIcon,
  vue3: vue3QrcodeIcon,
  react: reactQrcodeIcon,
  wx: wxQrcodeIcon,
  design: designQrcodeIcon,
  flutter: flutterQrcodeIcon,
};
export default define({
  tag: 'td-doc-footer',
  mobileBodyStyle,
  platform: 'web',
  displayQrCode: '',
  patchDom: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value) => value,
    connect: patchShadowDomIntoDom,
  },
  render: (host) => {
    const mobileBodyStyle = { ...host.mobileBodyStyle };
    const { displayQrCode } = host;

    const handleHoverLogo = (type) => {
      host.displayQrCode = qrcodeMap[type];
    };

    return html`
      <div class="TDesign-doc-footer" style="${mobileBodyStyle}">
        <div class="TDesign-doc-footer__inner">
          <div class="TDesign-doc-footer__content">
            <div class="TDesign-doc-footer__qrcode">
              <td-doc-popup
                placement="left-start"
                portal-class="TDesign-doc__qrcode-popup"
                portal-style="${portalStyle}"
              >
                <div class="TDesign-doc-footer__qrcode-trigger">
                  <div>
                    <div class="qrcode" onmouseenter="${() => handleHoverLogo('vue2')}">
                      <i innerHTML="${vueLogo}"></i>
                      <span>Vue 2</span>
                    </div>
                    <div class="qrcode" onmouseenter="${() => handleHoverLogo('vue3')}">
                      <i innerHTML="${vueLogo}"></i>
                      <span>Vue 3</span>
                    </div>
                    <div class="qrcode" onmouseenter="${() => handleHoverLogo('react')}">
                      <i innerHTML="${reactLogo}"></i>
                      <span>React</span>
                    </div>
                  </div>
                  <div>
                    <div class="qrcode" onmouseenter="${() => handleHoverLogo('flutter')}">
                      <i innerHTML="${flutterLogo}"></i>
                      <span>Flutter</span>
                    </div>
                    <div class="qrcode" onmouseenter="${() => handleHoverLogo('design')}">
                      <i innerHTML="${designLogo}"></i>
                      <span>Design</span>
                    </div>
                  </div>
                  <div>
                    <div class="qrcode" onmouseenter="${() => handleHoverLogo('wx')}">
                      <i innerHTML="${wxLogo}"></i>
                      <span>MiniProgram</span>
                    </div>
                  </div>
                </div>
                <div slot="content" class="TDesign-doc__qrcode-inner">
                  <img width="120" height="120" src="${displayQrCode}" />
                </div>
              </td-doc-popup>
              <h4 class="TDesign-doc-footer__qrcode-title">${locale.footer.weComGroup}</h4>
              <p class="TDesign-doc-footer__qrcode-desc">${locale.footer.weComGroupDesc}</p>
            </div>

            ${footerLinks.map(
              (item) => html`
                <div class="TDesign-doc-footer__content-block">
                  <p class="title">${item.title}</p>
                  ${item.links.map(
                    (link) => html`
                      <a class="link" href="${link.url}" target="${link.target}">
                        <span>${link.name}</span>
                      </a>
                    `,
                  )}
                </div>
              `,
            )}
          </div>
        </div>
      </div>
      <div class="TDesign-doc-footer__bottom" style="${mobileBodyStyle}">
        <div class="TDesign-doc-footer__inner">
          <p class="copyright">
            Copyright &copy; 1998 - ${currentYear} Tencent. All Rights Reserved. ${locale.footer.copyright}
          </p>
          <div class="TDesign-doc-footer__logos">
            <i class="logo" innerHTML="${committeeIcon}"></i>
            <a class="logo" href="https://cloud.tencent.com/" target="_blank" innerHTML="${tencentCloudIcon}"></a>
          </div>
        </div>
      </div>
    `.css`${style}`;
  },
});
