import { html, define } from 'hybrids';
import NProgress from 'nprogress';
import style from './style.less';

export default define({
  tag: 'td-doc-layout',
  loaded: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value) => value,
    connect: (host, key) => {
      function onLoad() {
        Object.assign(host, { [key]: true });
        NProgress.done();
      }

      setTimeout(() => NProgress.done(), 3500);

      window.NProgress = NProgress;
      window.addEventListener('load', onLoad);
      !host.loaded && NProgress.start();

      return () => window.removeEventListener('load', onLoad);
    },
  },
  direction: 'row', // row column
  render: ({ direction }) => html`
      <div class="TDesign-page-doc">
        <slot name="header"></slot>
        <div class="TDesign-body ${direction}">
          <slot></slot>
        </div>
      </div>
    `.css`${style}`,
});
