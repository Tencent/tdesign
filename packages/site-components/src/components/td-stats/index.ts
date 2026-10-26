import { html, define } from 'hybrids';

interface ScriptAttributes {
  src: string;
  'data-account'?: string;
}

interface StatsProps {
  dataAccount: string;
  track: () => void;
  stats: undefined;
}

function initStats(statsId: string, scriptAttrs: ScriptAttributes, statsCallback?: () => void) {
  if (document.getElementById(statsId)) return;

  const script = document.createElement('script');
  script.async = true;
  script.id = statsId;
  script.type = 'text/javascript';
  Object.keys(scriptAttrs).forEach((key) => {
    const value = scriptAttrs[key as keyof ScriptAttributes];
    if (value !== undefined) script.setAttribute(key, value);
  });
  script.onload = () => {
    if (statsCallback) statsCallback();
  };
  document.head.appendChild(script);
}

export default define<StatsProps>({
  tag: 'td-stats',
  dataAccount: 'tdesign',
  track: {
    value() {
      return () => {
        if (window._horizon) window._horizon.track();
      };
    },
  },
  stats: {
    value: (_host, v) => v || undefined,
    connect: (host) => {
      function registerStats() {
        // horizon
        initStats('horizon-tracker', {
          'data-account': host.dataAccount,
          src: 'https://static.codesign.qq.com/analytics.js',
        });

        // tcss
        initStats(
          '__td_tcss__',
          {
            src: 'https://pingjs.qq.com/tcss.ping.https.js',
          },
          () => {
            if (window.pgvMain) window.pgvMain();
          },
        );
      }

      function handleRouterTrack() {
        requestAnimationFrame(() => {
          if (window._horizon) window._horizon.track();
        });
      }

      window.addEventListener('load', registerStats);
      window.addEventListener('popstate', handleRouterTrack);

      return () => {
        window.removeEventListener('load', registerStats);
        window.removeEventListener('popstate', handleRouterTrack);
      };
    },
  },
  render: () =>
    html`<style>
      :host {
        display: none;
      }
    </style>`,
});
