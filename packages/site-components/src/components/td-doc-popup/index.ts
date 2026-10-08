import { html, define, dispatch } from 'hybrids';
import { createPopper, type Instance, type Placement } from '@popperjs/core';
import { parseBoolean } from '@utils';
import style from './style.less?inline';

interface PortalElement extends HTMLElement {
  visible: boolean;
}

interface LegacyPathEvent extends Event {
  path?: EventTarget[];
}

interface DocPopupProps {
  render: () => ShadowRoot;
  reference: HTMLElement;
  portalClass: string;
  portalStyle: string;
  placement: Placement;
  triggerType: 'hover' | 'click';
  equalWidth: boolean;
  visible: boolean;
  portals: HTMLElement | null;
  portal: PortalElement | null;
  popper: Instance | null;
}

type DocPopupHost = HTMLElement & DocPopupProps;
type HoverEventType = 'enter' | 'leave';

function handleMouseEvent(host: DocPopupHost, type: HoverEventType): void {
  if (host.triggerType !== 'hover') return;
  if (type === 'enter') {
    host.visible = true;
  } else {
    host.visible = false;
  }

  dispatch(host, 'visible-change', { detail: { visible: host.visible } });
}

function handleClick(host: DocPopupHost): void {
  if (host.triggerType !== 'click') return;
  host.visible = !host.visible;

  dispatch(host, 'visible-change', { detail: { visible: host.visible } });
}

export default define<DocPopupProps>({
  tag: 'td-doc-popup',
  reference: ({ render }) => render().querySelector<HTMLElement>('.TDesign-doc-popup') as HTMLElement,
  portalClass: '',
  portalStyle: '',
  placement: 'bottom-end',
  triggerType: 'hover',
  portals: null,
  portal: null,
  popper: null,
  equalWidth: {
    value: (_host, v) => parseBoolean(v, false),
  },
  visible: {
    value: (host, v) => v || false,
    connect: (host) => {
      const { reference, placement } = host;
      let resizeObserver: ResizeObserver | undefined;
      let popperFrameId: number | undefined;
      let isConnected = true;

      const portalFrameId = requestAnimationFrame(() => {
        if (!isConnected) return;

        host.portals = document.getElementById('__td_portals__');
        if (!host.portals) {
          host.portals = document.createElement('div');
          host.portals.id = '__td_portals__';
          document.body.appendChild(host.portals);
        }

        const contentSlot = host.querySelector('[slot="content"]');
        if (!contentSlot) return;

        const portalStyleStr = `<style>${host.portalStyle}</style>`;

        host.portal = document.createElement('td-portal') as PortalElement;
        host.portal.className = host.portalClass;
        host.portal.innerHTML = portalStyleStr;
        host.portal.appendChild(contentSlot);

        host.portal.addEventListener('click', () => handleClick(host));
        host.portal.addEventListener('mouseenter', () => handleMouseEvent(host, 'enter'));
        host.portal.addEventListener('mouseleave', () => handleMouseEvent(host, 'leave'));
        host.portals.appendChild(host.portal);

        popperFrameId = requestAnimationFrame(() => {
          if (!isConnected) return;
          const portal = host.portal;
          if (!portal) return;

          const isVertical = ['top', 'bottom'].some((p) => placement.includes(p));
          host.popper = createPopper(reference, portal, {
            placement,
            modifiers: [{ name: 'offset', options: { offset: isVertical ? [0, 8] : [0, 16] } }],
          });

          if (isVertical) {
            if (host.equalWidth) {
              host.popper.state.styles.popper.width = `${reference.offsetWidth}px`;
            } else {
              host.popper.state.styles.popper.minWidth = `${reference.offsetWidth}px`;
            }
          }

          // 监听 reference 宽度变化
          resizeObserver = new window.ResizeObserver(() => {
            if (!host.popper) return;
            if (isVertical) {
              if (host.equalWidth) {
                host.popper.state.styles.popper.width = `${reference.offsetWidth}px`;
              } else {
                host.popper.state.styles.popper.minWidth = `${reference.offsetWidth}px`;
              }
              host.popper.update();
            }
          });
          resizeObserver.observe(reference);
        });
      });

      function clickOutside(event: Event): void {
        const legacyEvent = event as LegacyPathEvent;
        const eventPath = event.composedPath?.() || legacyEvent.path || [];
        const eventTarget = eventPath[0];
        if (!reference || (eventTarget instanceof Node && host.contains(eventTarget))) return;
        host.visible = false;
        dispatch(host, 'visible-change', { detail: { visible: host.visible } });
      }

      document.addEventListener('click', clickOutside);

      return () => {
        isConnected = false;
        if (portalFrameId != null) cancelAnimationFrame(portalFrameId);
        if (popperFrameId != null) cancelAnimationFrame(popperFrameId);
        host.popper?.destroy?.();
        host.portal?.remove?.();
        document.removeEventListener('click', clickOutside);
        resizeObserver?.disconnect?.();
      };
    },
    observe: (host, value) => {
      if (!host.portal) return;
      host.portal.visible = value;
      host.popper?.update?.();
    },
  },
  render: (host) => {
    const { placement } = host;

    return html`
      <div
        class="TDesign-doc-popup"
        data-placement="${placement}"
        onclick="${handleClick}"
        onmouseenter="${(host: DocPopupHost) => handleMouseEvent(host, 'enter')}"
        onmouseleave="${(host: DocPopupHost) => handleMouseEvent(host, 'leave')}"
      >
        <slot></slot>
      </div>
    `.css`${style}`;
  },
});
