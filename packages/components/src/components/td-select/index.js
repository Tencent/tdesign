import { html, define, dispatch } from "hybrids";
import style from "./style.less";
import portalStyle from "./portal.less";
import fakeArrowIcon from "@images/fake-arrow.svg?raw";

function renderOptions(host) {
  const { options = [] } = host;

  function handleItemClick(host, item) {
    host.value = item.value;
    requestAnimationFrame(() => {
      host.visible = false;
    });
    dispatch(host, 'change', { detail: { value: host.value } })
  }

  return html`
    <ul class="TDesign-select-list">
      ${options.map((item) => {
        const isActive = item.value == host.value;
        return html`
          <li
            onclick="${(host) => handleItemClick(host, item)}"
            class="TDesign-select-list__item ${isActive ? "is-active" : ""}"
          >
            ${item.label}
          </li>
        `;
      })}
    </ul>
  `;
}

export default define({
  tag: "td-select",
  borderless: false,
  value: "",
  visible: false,
  options: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value) => value,
  },
  render: (host) => {
    const { options, value, visible, borderless } = host;

    const activeItem = options.find((item) => item.value == value) || {};
    const inputValue = activeItem.label || "";

    const selectInputClass = {
      'focus': visible,
      'TDesign-select-input': true,
      'TDesign-select-input--borderless': borderless,
    };

    return html`
      <td-doc-popup
        visible="${visible}"
        placement="bottom-start"
        trigger-type="click"
        portal-class="td-select-portal"
        portalStyle="${portalStyle}"
        onvisible-change="${(host, e) => (host.visible = e.detail.visible)}"
      >
        <div class="${selectInputClass}">
          <input
            class="TDesign-select-input__inner"
            readonly
            value="${inputValue}"
          />
          <i
            class="suffix-icon ${visible ? "up" : ""}"
            innerHTML="${fakeArrowIcon}"
          ></i>
        </div>
        <div slot="content" class="TDesign-select-dropdown">${renderOptions(host)}</div>
      </td-doc-popup>
    `.css`${style}`;
  },
});
