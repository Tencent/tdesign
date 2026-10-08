import { html, define } from 'hybrids';
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

function toggleCollapsePhone(host: DocPhoneHost): void {
  const tdDocPhoneMask = host.shadowRoot?.querySelector<HTMLElement>('.td-doc-phone-mask')?.classList;
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

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // 当底部出现时不要超过底部区域
        const FOOTER_HEIGHT = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--footer-height'),
        );
        const PHONE_HEIGHT = parseFloat(getComputedStyle(host).getPropertyValue('--phone-body-height'));
        const TD_HEIGHT = 64;
        const maxPhonePos = scrollHeight - FOOTER_HEIGHT - PHONE_HEIGHT - TD_HEIGHT - 64; // 预留底部 64 像素间距
        const canViewPhoneAndFooter = clientHeight <= FOOTER_HEIGHT + PHONE_HEIGHT + 64;

        if (scrollTop >= 228) {
          if (scrollTop + 88 >= maxPhonePos && canViewPhoneAndFooter) {
            Object.assign(host, {
              [key]: {
                ...host.fixedStyle,
                position: 'absolute',
                top: `${maxPhonePos}px`,
              },
            });
          } else {
            Object.assign(host, {
              [key]: {
                ...host.fixedStyle,
                position: 'fixed',
                top: '152px',
              },
            });
          }
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

        const tdDocPhoneMask = host.shadowRoot.querySelector<HTMLElement>('.td-doc-phone-mask');
        if (!tdDocPhoneMask) return;
        if (isMobileResponse) {
          tdDocPhoneMask.classList.remove('show');
          tdDocPhoneMask.classList.add('hide');
        } else {
          tdDocPhoneMask.classList.remove('show');
          tdDocPhoneMask.classList.remove('hide');
        }
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
      <div class="td-doc-phone-mask" onclick="${toggleCollapsePhone}"></div>
      <div class="td-doc-phone" style=${fixedStyle}>
        ${
          headless
            ? html``
            : html`
                <div class="td-doc-phone__header">
                  <div class="td-doc-phone__header-icons">
                    <td-doc-popup placement="left-start">
                      <span class="icon qrcode" innerHTML=${qrcodeIcon}></span>
                      <div slot="content" class="qrcode-wrapper">
                        <slot name="qrcode">
                          <canvas id="qrcode"></canvas>
                        </slot>
                      </div>
                    </td-doc-popup>
                    ${
                      href &&
                      html`<a href="${href}" target="_blank"><span class="icon" innerHTML="${jumpIcon}"></span></a>`
                    }
                  </div>
                </div>
              `
        }
        <div class="td-doc-phone__body">
          <slot></slot>
        </div>
        <div class="td-doc-phone__close" innerHTML="${closeIcon}" onclick="${toggleCollapsePhone}"></div>
      </div>
      <div class="td-doc-phone-collapse" onclick="${toggleCollapsePhone}">
        <i class="icon" innerHTML="${mobileIcon}"></i>
      </div>
    `.css`${style}`,
});
