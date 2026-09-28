import vitePluginTdoc from 'vite-plugin-tdoc';

import transforms from './transforms';

export default () =>
  vitePluginTdoc({
    transforms,
    markdown: {
      anchor: {
        tabIndex: false,
        config: (anchor) => ({
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
