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
        listClass: 'tdesign-toc_list',
        itemClass: 'tdesign-toc_list_item',
        linkClass: 'tdesign-toc_list_item_a',
        containerClass: 'tdesign-toc_container',
      },
    },
  });
