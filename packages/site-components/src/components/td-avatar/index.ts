import { html, define } from 'hybrids';
import { attribute } from '@utils';
import style from './style.less?inline';

interface AvatarProps {
  content: string;
  username: string;
  src: string;
  href: string;
}

export default define<AvatarProps>({
  tag: 'td-avatar',
  content: attribute(''),
  username: attribute(''),
  src: attribute(''),
  href: attribute(''),
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
