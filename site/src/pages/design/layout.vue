<template>
  <div ref="article" name="DOC" class="doc-layout">
    <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
      <ol class="tdesign-toc_list">
        <li class="tdesign-toc_list_item" v-for="anchor in catalog" :key="anchor.id">
          <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
          <ol class="tdesign-toc_list" v-if="anchor.children.length">
            <li class="tdesign-toc_list_item" v-for="subAnchor in anchor.children" :key="subAnchor.id">
              <a class="tdesign-toc_list_item_a" :href="'#' + subAnchor.id">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <h2>Summary</h2>
    <p>
      Layout is one of the basic and important modes of page composition, and it also serves as the foundation for the
      unified interaction and visual style of the entire backend system.
    </p>

    <h2>Specification</h2>
    <h3>Board Size</h3>
    <p>
      In order to reduce the communication and splitting calculation costs during layout design, based on the mainstream
      screen sizes, we have set the standard board width for the design team as 1440px or 1920px.
    </p>

    <h3>Layout</h3>
    <p>Layouts include the following 4 areas:</p>
    <p>Content: usually used for placing the main content</p>
    <p>Header: located at the top of the page, usually used for placing the top navigation</p>
    <p>Sider: located on both sides of the main content, usually used for placing the side navigation</p>
    <p>Footer: located at the bottom of the page, usually used for placing auxiliary information.</p>
    <img src="./assets/layout/l-1.jpg" />

    <h2>Category of Navigation</h2>
    <p>Navigation is used to organize the product's functions and content and guide users to move between pages.</p>
    <p>TDesign contains the following 3 types of navigation layout:</p>

    <h3>Side-layout Navigation</h3>
    <p>
      Side-layout navigation includes side area and content area. Under this layout, the efficiency of switching between
      pages is quite high, but the horizontal space of the content area is compressed. It is suitable for pages with
      deep navigation hierarchy and high navigation efficiency requirements.
    </p>
    <img src="./assets/layout/l-2.jpg" />

    <h3>Top-layout Navigation</h3>
    <p>
      Side-layout navigation includes top area and content area. Under this layout, the display efficiency of horizontal
      space is high, but the navigation space is lost, which reduces the efficiency of page navigation switching. It is
      suitable for pages where the main operating area is in the content area and the page stacking efficiency is not
      high. For this type of page, to ensure the stability of information layout, the width of the content area is often
      set to a fixed width.
    </p>
    <img src="./assets/layout/l-3.jpg" />

    <h3>Mixed-layout Navigation</h3>
    <p>
      Mixed-layout Navigatio includes top area, side area, and content area. The combination of top navigation and side
      navigation improves navigation efficiency. It is commonly used in application-type websites with complex
      information architecture and certain navigation efficiency requirements.
    </p>
    <hr />
    <p>
      Note: when the top area needs to carry important functions, the top area and bottom area can be fixed. When the
      content area is too high, the side area can be fixed.
    </p>
    <img src="./assets/layout/l-4.jpg" />
    <img src="./assets/layout/l-5.jpg" />

    <h2>Grid System</h2>
    <p>
      Grid is a layout that guides and standardizes the layout and information distribution in web pages through a
      regular grid array, improving the consistency of the layout within the interface and saving costs.
    </p>

    <h3>Grid Base</h3>
    <p>
      The grid base is the basic unit in the grid system. It is particularly important to define the grid base before
      griding. On the one hand, it standardizes the design, guides the layout design and content layout, and assists in
      aligning page elements and setting spacing. On the other hand, it saves time for communication between design and
      development. The current grid system uses 8 points as the grid base, which is suitable in granularity size and can
      match most mainstream screens. In TDesign, the grid base is 8px.
    </p>
    <img src="./assets/layout/l-6.jpg" />

    <h3>Composition of Grid</h3>
    <p>Grid consists of column、gutter and margin</p>

    <h4>Columns</h4>
    <p>
      Columns are imaginary vertical blocks used to align content. The width of the columns is usually defined by a
      percentage or fixed value. When the width of the grid changes, the width of the columns will increase or decrease
      accordingly if the width of the columns is not a fixed value.
    </p>

    <h4>Gutters</h4>
    <p>
      Gutters are the gaps between columns and are used to separate content. The width of the gutters is usually a fixed
      value. In TDesign, it is set as a default of 16px.
    </p>

    <h4>Margins</h4>
    <p>
      Safe margins are the gaps between content and screen edges. They are usually of a fixed width and are used to
      define the minimum breathing space on all sizes of screens. In TDesign, the default value of the margins is 24px,
      and the value should be determined based on actual needs, preferably in multiples of 8.
    </p>
    <img src="./assets/layout/l-7.jpg" />

    <h3>Layout Grid</h3>
    <p>
      The number of columns used to form the grid is called the column structure. 8, 12, 16, and 24 are the most common
      column structures in responsive layouts. When placing content blocks in the grid, the position of the content
      block should start from the column and end at the column.
    </p>
    <p>To balance flexibility and complexity, we adopt a 12-column grid system for the content area.</p>
    <img src="./assets/layout/l-8.jpg" />
    <hr />

    <p>
      According to different layouts, different grid layouts are used. TDesign includes the following 3 grid layouts:
    </p>

    <h4>No-sidebar-layout Grid</h4>
    <p>The content area occupies the full width of the page.</p>
    <img src="./assets/layout/l-9.jpg" />

    <h4>Fixed-width Sidebar Layout Grid</h4>
    <p>
      The width of the sidebar is fixed within a range of breakpoints, and the remaining space is allocated to the
      content area. In TDesign, the default width of the expanded sidebar is 232px.
    </p>
    <img src="./assets/layout/l-10.jpg" />

    <h4>Fixed-width Sidebar Layout Grid</h4>
    <p>In TDesign, the default width of the collapsed sidebar is 64px.</p>
    <img src="./assets/layout/l-11.jpg" />
    <hr />

    <p>
      Note: The sidebar area can be set to a responsive layout. When the browser width is less than the configured
      breakpoint value (992px by default in TDesign), the sidebar navigation automatically switches from expanded to
      collapsed state.
    </p>
    <img src="./assets/layout/l-12.jpg" />

    <h3>Margin</h3>
    <p>
      For consistency in page layout, regular spacing should be maintained when placing content elements in different
      areas. We recommend a set of rhythmic spacing values that add two small spacing values, 4 and 12, on top of the
      8-multiple principle for flexible use in different scenarios.
    </p>
    <img src="./assets/layout/l-13.jpg" />

    <h2>Responsive Layout</h2>
    <h3>Breakpoint System</h3>
    <p>
      In grid layouts, using only one content layout may not adapt well to various display devices of different sizes.
      In this case, a responsive grid can be used to switch layouts by setting a series of breakpoints.
    </p>
    <img src="./assets/layout/l-14.jpg" />
    <hr />

    <p>
      TDesign has set 3 breakpoints based on different display devices. This breakpoint system considers the
      characteristics of different browsers and subdivides breakpoints for PC devices while considering the
      characteristics of tablet devices (note 1). This makes the grid system better adapted to mainstream computer
      displays and browsers. In actual use, you can select some of these breakpoints based on business needs or use
      custom breakpoints appropriately.
    </p>
    <t-table
      style="margin: 16px 0"
      :bordered="true"
      :data="dataSource"
      :columns="columns"
      :rowKey="rowKey"
      :size="size"
      :rowspanAndColspan="rowspanAndColspan"
    >
    </t-table>

    <h2>Grid Behavior</h2>
    <p>System has different grid modes in different ranges of breakpoints</p>

    <h3>Fixed Grid</h3>
    <p>
      Fixed grid has fixed column width, fixed gutter width, and fixed safe margins. The fixed grid has a fixed content
      width and does not change in specific breakpoint ranges, and the value can be determined based on actual
      situations.
    </p>

    <h4>in TDesign</h4>
    <p>
      no-sidebar layout: The fixed grid has a minimum width of 768px (minimum breakpoint value). When the browser width
      is less than the configured minimum breakpoint value, the page will not shrink any further, and a horizontal
      scrolling bar will appear in the browser.
    </p>
    <img src="./assets/layout/l-15.jpg" />
    <hr />

    <p>
      Sidebar layout: The fixed grid has a minimum width of 704px (the minimum page width in TDesign is 768px, and the
      width of the collapsed sidebar is 64px). When the content area is smaller than 704px, the page will not shrink any
      further, and a horizontal scrolling bar will appear in the browser.
    </p>
    <img src="./assets/layout/l-16.jpg" />

    <h3>Fluid Grid</h3>
    <p>
      Fluid grid has fluid column width, fixed gutter width, and fixed safe margins. The fluid grid has flexible content
      width, and the width will increase or decrease in response to changes in browser width.
    </p>
    <p>
      In TDesign, when the browser width is greater than the minimum breakpoint value of 768px, the content area will
      increase or decrease in response to changes in browser width.
    </p>
    <img src="./assets/layout/l-17.jpg" />
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor';

export default {
  mixins: [anchorMixin],
  data() {
    return {
      dataSource: [
        {
          cut: 'sm',
          cutValue: '768px',
          range: '768px-991px',
          colWidth: '16px',
          grid: '内容区块根据不同的断点进行堆叠或缩放',
          device: 'Pad',
        },
        {
          cut: 'md',
          cutValue: '992px',
          range: '992px-1199px',
          colWidth: '16px',
          grid: '内容区块根据不同的断点进行堆叠或缩放',
          device: 'super small size laptop',
        },
        {
          cut: 'lg',
          cutValue: '1200px',
          range: '大于 1200px',
          colWidth: '16px',
          grid: '大于断点值时，始终保持水平排列',
          device: 'small size laptop',
        },
      ],
      columns: [
        { width: 104, ellipsis: true, colKey: 'cut', title: 'break point' },
        { width: 104, ellipsis: true, colKey: 'cutValue', title: 'break point value' },
        { width: 144, ellipsis: true, colKey: 'range', title: '响应区间' },
        { width: 104, colKey: 'colWidth', title: 'gutter width' },
        { colKey: 'grid', title: 'grid' },
        { width: 160, ellipsis: true, colKey: 'device', title: '显示设备参考' },
      ],
      rowKey: 'default',
      size: 'small',
    };
  },
  methods: {
    rowspanAndColspan({ col, rowIndex }) {
      if (col.colKey === 'colWidth' && rowIndex === 0) {
        return {
          rowspan: 3,
        };
      }
      if (col.colKey === 'grid' && rowIndex === 0) {
        return {
          rowspan: 2,
        };
      }
    },
  },
};
</script>

<style lang="less">
.doc-layout {
  .desc {
    color: var(--text-placeholder);
  }

  img {
    border-radius: 6px;
    border: 1px solid var(--component-border);
  }
}
</style>
