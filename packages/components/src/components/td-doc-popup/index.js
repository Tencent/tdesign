import { html, define, dispatch } from "hybrids";
import style from "./style.less";
import { createPopper } from "@popperjs/core";

function handleMouseEvent(host, type) {
  if (host.triggerType !== "hover") return;
  if (type === "enter") {
    host.visible = true;
  } else {
    host.visible = false;
  }

  dispatch(host, "visible-change", { detail: { visible: host.visible } });
}

function handleClick(host, e) {
  if (host.triggerType !== "click") return;
  host.visible = !host.visible;

  dispatch(host, "visible-change", { detail: { visible: host.visible } });
}

export default define({
  tag: "td-doc-popup",
  reference: ({ render }) => render().querySelector(".TDesign-doc-popup"),
  portalClass: "",
  portalStyle: "",
  placement: "bottom-end",
  triggerType: "hover",
  visible: {
    get: (host, lastValue) => lastValue || false,
    set: (host, value) => value,
    connect: (host) => {
      const { reference, placement } = host;

      requestAnimationFrame(() => {
        host.portals = document.getElementById('__td_portals__');
        if (!host.portals) {
          host.portals = document.createElement('div');
          host.portals.id = '__td_portals__';
          document.body.appendChild(host.portals);
        }
        const contentSlot = host.querySelector('[slot="content"]');
        const portalStyleStr = `<style>${host.portalStyle}</style>`;

        host.portal = document.createElement("td-portal");
        host.portal.className = host.portalClass;
        host.portal.innerHTML = portalStyleStr;
        host.portal.appendChild(contentSlot);

        host.portal.addEventListener("click", (e) => handleClick(host, e));
        host.portal.addEventListener("mouseenter", () =>handleMouseEvent(host, "enter"));
        host.portal.addEventListener("mouseleave", () => handleMouseEvent(host, "leave"));
        host.portals.appendChild(host.portal);
        
        requestAnimationFrame(() => {
          const isVertical = ["top", "bottom"].some((p) => placement.includes(p));
          host.popper = createPopper(reference, host.portal, {
            placement,
            modifiers: [
              { name: "offset", options: { offset: isVertical ? [0, 8] : [0, 16] } }
            ],
          });
          if (isVertical) host.popper.state.styles.popper.minWidth = `${reference.offsetWidth}px`;
        });
      });

      function clickOutside(e) {
        const eventPath = e.composedPath?.() || e.path || [];
        if (!reference || host.contains(eventPath[0])) return;
        host.visible = false;
        dispatch(host, "visible-change", { detail: { visible: host.visible } });
      }

      document.addEventListener("click", clickOutside);

      return () => {
        host.portals?.removeChild?.(host.portal);
        document.removeEventListener("click", clickOutside);
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
        onmouseenter="${(host) => handleMouseEvent(host, "enter")}"
        onmouseleave="${(host) => handleMouseEvent(host, "leave")}"
      >
        <slot></slot>
      </div>
    `.css`${style}`;
  },
});
