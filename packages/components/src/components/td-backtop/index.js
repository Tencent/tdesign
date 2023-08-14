import { html, define } from 'hybrids';
import style from './style.less';
import backTopIcon from '@images/backtop.svg?raw';

function handleBacktop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default define({
  tag: 'td-backtop',
  backtopShow: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value) => value,
    connect: (host, key, invalidate) => {
      function toggleVisible() {
        const { scrollTop } = document.documentElement;
        if (scrollTop > 0) {
          Object.assign(host, { [key]: true });
        } else {
          Object.assign(host, { [key]: false });
        }
        invalidate();
      }
      document.addEventListener('scroll', toggleVisible);

      return () => document.removeEventListener('scroll', toggleVisible);
    },
  },

  render: ({ backtopShow }) => html`
    <div class="TDesign-backtop ${backtopShow ? 'show' : ''}" onclick="${handleBacktop}">
      <div class="TDesign-backtop__inner" innerHTML=${backTopIcon}></div>
    </div>
  `.css`${style}`,
});
