import { html, define } from 'hybrids';
import style from './style.less?inline';

interface AvatarProps {
  content: string;
  username: string;
  src: string;
  href: string;
}

export default define<AvatarProps>({
  tag: 'td-avatar',
  content: '',
  username: '',
  src: '',
  href: '',
  render: ({ content, username, src, href }) => {
    const defaultSrc = `https://avatars.githubusercontent.com/${username}`;
    const defaultHref = `https://github.com/${username}`;

    return html`
      <div class="td-avatar">
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
