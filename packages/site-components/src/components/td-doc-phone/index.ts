import { html, define } from '@utils/hybrids';
import QRCode from 'qrcode';
import style from './style.less?inline';
import qrcodeIcon from '@images/qrcode.svg?raw';
import mobileIcon from '@images/mobile.svg?raw';
import closeIcon from '@images/close.svg?raw';
import jumpIcon from '@images/jump.svg?raw';

interface PhoneFixedStyle {
  position?: 'absolute' | 'fixed';
  top?: string;
}

interface DocPhoneProps {
  headless: boolean;
  href: string;
  QRCode: typeof QRCode;
  qrCanvas: HTMLCanvasElement | null;
  qrcodeUrl: string;
  fixedStyle: PhoneFixedStyle;
}

type DocPhoneHost = HTMLElement & DocPhoneProps;

const PHONE_FIXED_TOP = 152;
const PHONE_FOOTER_GAP = 60;

function toggleCollapsePhone(host: DocPhoneHost): void {
  const tdDocPhoneMask = host.shadowRoot?.querySelector<HTMLElement>('.TDesign-doc-phone-mask')?.classList;
  if (!tdDocPhoneMask) return;
  if (tdDocPhoneMask.contains('hide')) {
    tdDocPhoneMask.remove('hide');
    tdDocPhoneMask.add('show');
  } else {
    tdDocPhoneMask.remove('show');
    tdDocPhoneMask.add('hide');
  }
}

export default define<DocPhoneProps>({
  tag: 'td-doc-phone',
  headless: false,
  href: '',
  QRCode: () => QRCode,
  qrCanvas: (host) => host.shadowRoot?.querySelector<HTMLCanvasElement>('#qrcode') ?? null,
  qrcodeUrl: {
    value: (host, v) => v,
    connect: (host) => {
      requestAnimationFrame(() => {
        const qrcodeSlot = host.querySelector('[slot="qrcode"]');
        const contentSlot = host.shadowRoot?.querySelector<HTMLElement>('[slot="content"]');

        if (!qrcodeSlot || !contentSlot) return;
        contentSlot.innerHTML = qrcodeSlot.outerHTML;
      });
    },
    observe: (host, value) => {
      if (!host.qrCanvas) return;
      const options = { width: 96, height: 96 };
      QRCode.toCanvas(host.qrCanvas, value, options);
    },
  },
  fixedStyle: {
    value: (host, v) => v || {},
    connect: (host, key) => {
      function handleScroll() {
        const isMobileResponse = window.innerWidth < 960;
        if (isMobileResponse) return;

        const { scrollTop } = document.documentElement;

        const phone = host.shadowRoot?.querySelector<HTMLElement>('.TDesign-doc-phone');
        const footer = document.querySelector<HTMLElement>('td-doc-footer');
        const phoneTopBeforeFooter =
          phone && footer
            ? footer.getBoundingClientRect().top - phone.offsetHeight - PHONE_FOOTER_GAP
            : PHONE_FIXED_TOP;

        if (scrollTop >= 228) {
          Object.assign(host, {
            [key]: {
              ...host.fixedStyle,
              position: 'fixed',
              top: `${Math.min(PHONE_FIXED_TOP, phoneTopBeforeFooter)}px`,
            },
          });
        } else {
          Object.assign(host, {
            [key]: {
              ...host.fixedStyle,
              position: 'absolute',
              top: '316px',
            },
          });
        }
      }

      // 小屏幕下隐藏手机
      function responsePhone() {
        if (!host.shadowRoot) return;
        const isMobileResponse = window.innerWidth < 960;

        const tdDocPhoneMask = host.shadowRoot.querySelector<HTMLElement>('.TDesign-doc-phone-mask');
        if (!tdDocPhoneMask) return;
        if (isMobileResponse) {
          tdDocPhoneMask.classList.remove('show');
          tdDocPhoneMask.classList.add('hide');
        } else {
          tdDocPhoneMask.classList.remove('show');
          tdDocPhoneMask.classList.remove('hide');
        }

        handleScroll();
      }

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
  render: ({ fixedStyle, headless, href }) =>
    html`
      <div class="TDesign-doc-phone-mask" onclick="${toggleCollapsePhone}"></div>
      <div class="TDesign-doc-phone" style=${fixedStyle}>
        ${headless
          ? html``
          : html`
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
                  ${href &&
                  html`<a href="${href}" target="_blank"><span class="icon" innerHTML="${jumpIcon}"></span></a>`}
                </div>
              </div>
            `}
        <div class="TDesign-doc-phone__body">
          <slot></slot>
        </div>
        <div class="TDesign-doc-phone__close" innerHTML="${closeIcon}" onclick="${toggleCollapsePhone}"></div>
      </div>
      <div class="TDesign-doc-phone-collapse" onclick="${toggleCollapsePhone}">
        <i class="icon" innerHTML="${mobileIcon}"></i>
      </div>
    `.css`${style}`,
});
