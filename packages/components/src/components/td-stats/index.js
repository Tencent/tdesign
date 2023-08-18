import { html, define } from "hybrids";

function initStats(statsId, scriptAttrs, statsCallback) {
  if (document.getElementById(statsId)) return;

  const script = document.createElement("script");
  script.async = true;
  script.id = statsId;
  script.type = "text/javascript";
  Object.keys(scriptAttrs).forEach((key) => {
    script.setAttribute(key, scriptAttrs[key]);
  });
  script.onload = () => {
    statsCallback && statsCallback();
  };
  document.head.appendChild(script);
}

export default define({
  tag: "td-stats",
  dataAccount: "tdesign",
  track: {
    get() {
      return () => {
        window._horizon && window._horizon.track();
      };
    },
  },
  stats: {
    get: (_host, lastValue) => lastValue || undefined,
    set: (_host, value) => value,
    connect: (host) => {
      function registerStats() {
        // horizon
        initStats("horizon-tracker", {
          "data-account": host.dataAccount,
          src: "https://horizon-assets.qq.com/analytics.js",
        });

        // tcss
        initStats(
          "__td_tcss__",
          {
            src: "https://pingjs.qq.com/tcss.ping.https.js",
          },
          () => {
            window.pgvMain && window.pgvMain();
          }
        );
      }

      function handleRouterTrack() {
        requestAnimationFrame(() => {
          window._horizon && window._horizon.track();
        });
      }

      window.addEventListener("load", registerStats);
      window.addEventListener("popstate", handleRouterTrack);

      return () => {
        window.removeEventListener("load", registerStats);
        window.removeEventListener("popstate", handleRouterTrack);
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
