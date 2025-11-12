import { html, define } from 'hybrids';

export default define({
  tag: 'td-aegis',
  aegisId: 'rDISNMyXgKnpdSRvul',
  stats: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    connect: (host) => {
      function registerStats() {
        if (document.getElementById('__td_aegis__')) return;

        const script = document.createElement('script');
        script.async = true;
        script.id = '__td_aegis__';
        script.type = 'text/javascript';
        script.src = 'https://cdn-go.cn/aegis/aegis-sdk/latest/aegis.min.js';
        script.onload = () => {
          window.aegis = new Aegis({
            id: host.aegisId,
            reportAssetSpeed: true, // 静态资源测速
            reportApiSpeed: true, // 接口测速
            spa: true, // spa 页面需要开启，页面切换的时候上报pv
          });
        }
        document.body.appendChild(script);
      }
      window.addEventListener('DOMContentLoaded', registerStats)

      return () => {
        window.removeEventListener('DOMContentLoaded', registerStats)
      };
    },
  },
  render: () => html`<style>:host { display: none; }</style>`,
});
