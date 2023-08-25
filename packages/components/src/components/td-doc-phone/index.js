import { html, define } from 'hybrids';
import QRCode from 'qrcode';
import style from './style.less';
import qrcodeIcon from '@images/qrcode.svg?raw';
import mobileIcon from '@images/mobile.svg?raw';
import closeIcon from '@images/close.svg?raw';

function toggleCollapsePhone(host) {
  if (!host.shadowRoot) return;
  const aisdeClassList = host.shadowRoot.querySelector('.TDesign-doc-phone').classList;
  if (aisdeClassList.contains('hide')) {
    aisdeClassList.remove('hide');
    aisdeClassList.add('show');
  } else {
    aisdeClassList.remove('show');
    aisdeClassList.add('hide');
  }
}

export default define({
  tag: 'td-doc-phone',
  headless: false,
  QRCode: () => QRCode,
  qrCanvas: ({ render }) => render().querySelector("#qrcode"),
  qrcodeUrl: {
    get: (host, lastValue) => lastValue,
    set: (host, value) => value,
    connect: (host) => {
      requestAnimationFrame(() => {
        const qrcodeSlot = host.querySelector('[slot="qrcode"]');
        const contentSlot = host.shadowRoot.querySelector('[slot="content"]');

        if (!qrcodeSlot || !contentSlot) return;
        contentSlot.innerHTML = qrcodeSlot.outerHTML;
      });
    },
    observe: (host, value) => {
      if (!host.qrCanvas) return;
      QRCode.toCanvas(host.qrCanvas, value, { width: 96, height: 96 });
    },
  },
  fixedStyle: {
    get: (host, lastValue) => lastValue || {},
    set: (host, value) => value,
    connect: (host, key) => {
      function handleScroll() {
        const isMobileResponse = window.innerWidth < 960;
        if (isMobileResponse) return;

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // 当底部出现时不要超过底部区域
        const FOOTER_HEIGHT = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footer-height'));
        const PHONE_HEIGHT = parseFloat(getComputedStyle(host).getPropertyValue('--phone-body-height'));
        const TD_HEIGHT = 64;
        const maxPhonePos = scrollHeight - FOOTER_HEIGHT - PHONE_HEIGHT - TD_HEIGHT - 64; // 预留底部 64 像素间距
        const canViewPhoneAndFooter = clientHeight <= (FOOTER_HEIGHT + PHONE_HEIGHT + 64);

        if (scrollTop >= 228) {
          if ((scrollTop + 88) >= maxPhonePos && canViewPhoneAndFooter) {
            Object.assign(host, {
              [key]: {
                ...host.fixedStyle, position: 'absolute', top: `${maxPhonePos}px`,
              },
            });
          } else {
            Object.assign(host, {
              [key]: {
                ...host.fixedStyle, position: 'fixed', top: '152px',
              },
            });
          }
        } else {
          Object.assign(host, {
            [key]: {
              ...host.fixedStyle, position: 'absolute', top: '316px',
            },
          });
        }
      }

      // 小屏幕下隐藏手机
      function responsePhone() {
        if (!host.shadowRoot) return;
        const isMobileResponse = window.innerWidth < 960;

        const tdDocPhone = host.shadowRoot.querySelector('.TDesign-doc-phone');
        if (isMobileResponse) {
          tdDocPhone.classList.remove('show');
          tdDocPhone.classList.add('hide');
        } else {
          tdDocPhone.classList.remove('show');
          tdDocPhone.classList.remove('hide');
        }
      };

      document.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', responsePhone);
      window.addEventListener('load', responsePhone);
      
      return () => {
        document.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', responsePhone);
        window.removeEventListener('load', responsePhone);
      };
    },
  },
  render: ({ fixedStyle, headless }) => html`
    <div class="TDesign-doc-phone" style=${fixedStyle}>
      ${headless ? html`` : html`
        <div class="TDesign-doc-phone__header">
          <div class="TDesign-doc-phone__header-icons">
            <td-doc-popup placement="left-start">
              <span class="icon qrcode" innerHTML=${qrcodeIcon}></span>
              <div slot="content" class="qrcode-wrapper">
                <slot name="qrcode">
                  <canvas id="qrcode"></canvas>
                </slot>
              </div>
            </td-doc-popup>
          </div>
        </div>
      `}
      <div class="TDesign-doc-phone__body">
        <slot></slot>
      </div>
      <div class="TDesign-doc-phone__close" innerHTML="${closeIcon}" onclick="${toggleCollapsePhone}"></div>
    </div>
    <div class="TDesign-doc-phone-mask" onclick="${toggleCollapsePhone}"></div>
    <div class="TDesign-doc-phone-collapse" onclick="${toggleCollapsePhone}">
      <i class="icon" innerHTML="${mobileIcon}"></i>
    </div>
  `.css`${style}`,
});
