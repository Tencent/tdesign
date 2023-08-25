import { html, define, dispatch } from "hybrids";
import style from "./style.less";

function handleChange(host) {
  host.value = !host.value;
  dispatch(host, "change", { detail: { value: host.value } });
}

export default define({
  tag: "td-switch",
  value: false,
  size: "medium",
  render: (host) => {
    const { value, size } = host;

    const switchClass = {
      'TDesign-switch': true,
      'is-checked': value,
      [`size-${size}`]: size
    };

    return html`
      <button
        type="button"
        class="${switchClass}"
        onclick="${handleChange}"
      >
        <span class="TDesign-switch__handle"></span>
      </button>
    `.css`${style}`;
  },
});
