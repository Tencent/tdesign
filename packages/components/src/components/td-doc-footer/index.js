import { html, define } from 'hybrids';
import { getFooterConfig } from '@config/footer.js';
import { getLocale } from '@config/locale.js';
import style from './style.less';
import { patchShadowDomIntoDom, mobileBodyStyle } from '@utils';
import tencentCloudIcon from '@images/tencentcloud-logo.svg?raw';
import committeeIcon from '@images/committee-logo.svg?raw';
import qrcodeIcon from '@images/tdesign-qrcode.svg?raw';

const footerLinks = getFooterConfig();
const locale = getLocale();
const currentYear = new Date().getFullYear();

export default define({
  tag: 'td-doc-footer',
  mobileBodyStyle,
  platform: 'web',
  patchDom: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value) => value,
    connect: patchShadowDomIntoDom,
  },
  render: (host) => {
    const mobileBodyStyle = { ...host.mobileBodyStyle };

    return html`
      <div class="TDesign-doc-footer" style="${mobileBodyStyle}">
        <div class="TDesign-doc-footer__inner">
          <div class="TDesign-doc-footer__content">
            <div class="TDesign-doc-footer__qrcode">
              <i innerHTML="${qrcodeIcon}"></i>
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
