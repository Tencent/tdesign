import { html, define } from 'hybrids';
import style from './style.less';

function handleClick(host) {
  if (host.triggerType !== 'click') return;

  Object.assign(host, { showTip: true });
  setTimeout(() => Object.assign(host, { showTip: false }), host.duration);
}

function handleEnter(host) {
  if (host.triggerType !== 'hover') return;

  Object.assign(host, { showTip: true });
}

function handleLeave(host) {
  if (host.triggerType !== 'hover') return;

  Object.assign(host, { showTip: false });
}

export default define({
  tag: 'td-tooltip',
  placement: 'top',
  showTip: false,
  duration: 1800,
  triggerType: 'click',
  render: (host) => {
    const { showTip, placement } = host;

    return html`
      <div class="TDesign-tooltip" data-placement="${placement}">
        <div onmouseover=${handleEnter} onmouseout=${handleLeave} onclick=${handleClick}>
          <slot></slot>
        </div>
        <div class="TDesign-tooltip__popup ${showTip ? 'show' : ''}" onmouseover=${handleEnter} onmouseout=${handleLeave}>
          <slot name="content"></slot>
        </div>
      </div>
    `.css`${style}`;
  },
});
