import { html, define } from "hybrids";
import style from "./style.less";

export default define({
  tag: "td-avatar",
  content: "",
  username: "",
  src: "",
  href: "",
  render: ({ content, username, src, href }) => {
    const defaultSrc = `https://avatars.githubusercontent.com/${username}`;
    const defaultHref = `https://github.com/${username}`;

    return html`
      <div class="TDesign-avatar">
        <td-tooltip trigger-type="hover">
          <a class="avatar" target="_blank" href="${href || defaultHref}">
            <img src="${src || defaultSrc}" />
          </a>
          <div slot="content">${content || username}</div>
        </td-tooltip>
      </div>
    `.css`${style}`;
  },
});
