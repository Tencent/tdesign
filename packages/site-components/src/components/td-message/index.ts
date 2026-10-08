import { html, define } from 'hybrids';
import InfoCircleFilled from 'tdesign-icons-svg/src/info-circle-filled.svg?raw';
import ErrorCircleFilled from 'tdesign-icons-svg/src/error-circle-filled.svg?raw';
import CheckCircleFilled from 'tdesign-icons-svg/src/check-circle-filled.svg?raw';
import HelpCircleFilled from 'tdesign-icons-svg/src/help-circle-filled.svg?raw';

import style from './style.less?inline';

type MessageTheme = 'info' | 'success' | 'warning' | 'error' | 'question';

interface MessageOptions {
  content: string;
  duration?: number;
  theme?: MessageTheme;
}

interface MessageProps {
  theme: MessageTheme;
  duration: number;
  zIndex: number;
  content: string;
  showMessage: boolean;
  show: (options: MessageOptions) => void;
}

type MessageElement = HTMLElement & MessageProps;

function isMessageTheme(value: string | undefined): value is MessageTheme {
  return value === 'info' || value === 'success' || value === 'warning' || value === 'error' || value === 'question';
}

function renderIcon(theme: MessageTheme): string | undefined {
  if (theme === 'info') return InfoCircleFilled;
  if (theme === 'success') return CheckCircleFilled;
  if (['warning', 'error'].includes(theme)) return ErrorCircleFilled;
  if (theme === 'question') return HelpCircleFilled;
}

export default define<MessageProps>({
  tag: 'td-message',
  theme: 'info',
  duration: 3000,
  zIndex: 5000,
  content: '',
  showMessage: false,
  show:
    (host) =>
    ({ content, theme, duration }) => {
      Object.assign(host, {
        showMessage: true,
        content,
        theme: theme || host.theme,
      });
      setTimeout(() => {
        Object.assign(host, {
          showMessage: false,
        });
      }, duration || host.duration);
    },
  render: (host) => {
    const { theme, zIndex, content, showMessage } = host;

    const icon = renderIcon(theme);
    const finalContent = `${icon}${content}`;
    const styles = {
      zIndex: zIndex,
    };
    const className = ['t-message', `t-is-${theme}`].concat(showMessage ? 't-message-enter' : 't-message-leave');
    return html`
      <div class="TDesign-message">
        <div style=${styles} class="${className}" innerHTML=${finalContent}></div>
      </div>
    `.css`${style}`;
  },
});

window.showTdMessage = function ({ content, duration, theme }) {
  const instanceId = '__tdesign_message__';
  if (!document.getElementById(instanceId)) {
    const messageInstance = document.createElement('td-message');
    messageInstance.setAttribute('id', instanceId);
    document.body.appendChild(messageInstance);
  }
  setTimeout(() => {
    const instance = document.getElementById(instanceId) as MessageElement | null;
    instance?.show({ content, duration, theme: isMessageTheme(theme) ? theme : undefined });
  });
};
