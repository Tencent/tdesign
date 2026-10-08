import { html, define } from 'hybrids';
import style from './style.less?inline';

type TooltipTrigger = 'click' | 'hover';

interface TooltipProps {
  placement: string;
  showTip: boolean;
  duration: number;
  triggerType: TooltipTrigger;
}

type TooltipHost = TooltipProps & HTMLElement;

function handleClick(host: TooltipHost) {
  if (host.triggerType !== 'click') return;

  Object.assign(host, { showTip: true });
  setTimeout(() => Object.assign(host, { showTip: false }), host.duration);
}

function handleEnter(host: TooltipHost) {
  if (host.triggerType !== 'hover') return;

  Object.assign(host, { showTip: true });
}

function handleLeave(host: TooltipHost) {
  if (host.triggerType !== 'hover') return;

  Object.assign(host, { showTip: false });
}

export default define<TooltipProps>({
  tag: 'td-tooltip',
  placement: 'top',
  showTip: false,
  duration: 1800,
  triggerType: 'click',
  render: (host) => {
    const { showTip, placement } = host;

    return html`
      <div class="td-tooltip" data-placement="${placement}">
        <div onmouseover=${handleEnter} onmouseout=${handleLeave} onclick=${handleClick}>
          <slot></slot>
        </div>
        <div class="td-tooltip__popup ${showTip ? 'show' : ''}" onmouseover=${handleEnter} onmouseout=${handleLeave}>
          <slot name="content"></slot>
        </div>
      </div>
    `.css`${style}`;
  },
});
