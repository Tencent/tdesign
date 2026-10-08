// @ts-ignore vite-plugin-tdoc has no type declarations
import vitePluginTdoc from 'vite-plugin-tdoc';

import transforms from './transforms';

interface AnchorPlugin {
  permalink: {
    linkInsideHeader: (options: { symbol: string }) => unknown;
  };
}

export default () =>
  vitePluginTdoc({
    transforms,
    markdown: {
      anchor: {
        tabIndex: false,
        config: (anchor: AnchorPlugin) => ({
          permalink: anchor.permalink.linkInsideHeader({ symbol: '' }),
        }),
      },
      toc: {
        listClass: 'td-toc-list',
        itemClass: 'td-toc-list-item',
        linkClass: 'td-toc-link',
        containerClass: 'td-toc-container',
      },
    },
  });
