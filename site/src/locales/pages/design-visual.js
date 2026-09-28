const image = (name) => ({ type: 'img', image: name });
const text = (type, value, className) => ({ type, text: value, class: className });
const rule = { type: 'hr' };
const table = { type: 'table' };

const tokenContent = [
  { color: '#366ef4', colorTxt: 'blue-6' },
  { color: '#0052D9', colorTxt: 'blue-7' },
  { color: '#003cab', colorTxt: 'blue-8' },
  { color: '#FFFFFF', colorTxt: 'white' },
  { color: '#F3F3F3', colorTxt: 'gray-1' },
  { color: '#E7E7E7', colorTxt: 'gray-3' },
  { color: 'rgba(0,0,0,.9)', colorTxt: 'fontgray-1' },
  { color: 'rgba(0,0,0,.6)', colorTxt: 'fontgray-2' },
];
const globalTokenContent = [
  ['brand-color-hover:', '@blue-color-6'],
  ['brand-color:', '@blue-color-7'],
  ['brand-color-active:', '@blue-color-8'],
  ['bg-color-container:', '@white-color'],
  ['bg-color-container-hover:', '@gray-color-1'],
  ['bg-color-container-active:', '@gray-color-3'],
  ['text-color-primary:', '@font-gray-1'],
  ['text-color-secondary:', '@font-gray-2'],
].map(([colorN, colorTxt]) => ({ colorN, colorTxt }));
const componentTokenContent = [
  ['button-bg-hover:', '@brand-color-hover'],
  ['button-bg:', '@brand-color'],
  ['button-bg-active:', '@brand-color-active'],
  ['table-bg:', '@bg-color-container'],
  ['table-bg-hover:', '@bg-color-container-hover'],
  ['table-bg-active:', '@bg-color-container-active'],
  ['menu-tabstext-select:', '@text-color-primary'],
  ['menu-tabstext:', '@text-color-secondary'],
].map(([colorN, colorTxt]) => ({ colorN, colorTxt }));

const enLayoutContent = [
  text('h2', 'Summary'),
  text(
    'p',
    'Layout is one of the basic and important modes of page composition, and it also serves as the foundation for the unified interaction and visual style of the entire backend system.',
  ),
  text('h2', 'Specification'),
  text('h3', 'Board Size'),
  text(
    'p',
    'In order to reduce the communication and splitting calculation costs during layout design, based on the mainstream screen sizes, we have set the standard board width for the design team as 1440px or 1920px.',
  ),
  text('h3', 'Layout'),
  text('p', 'Layouts include the following 4 areas:'),
  text('p', 'Content: usually used for placing the main content'),
  text('p', 'Header: located at the top of the page, usually used for placing the top navigation'),
  text('p', 'Sider: located on both sides of the main content, usually used for placing the side navigation'),
  text('p', 'Footer: located at the bottom of the page, usually used for placing auxiliary information.'),
  image('l-1.jpg'),
  text('h2', 'Category of Navigation'),
  text(
    'p',
    "Navigation is used to organize the product's functions and content and guide users to move between pages.",
  ),
  text('p', 'TDesign contains the following 3 types of navigation layout:'),
  text('h3', 'Side-layout Navigation'),
  text(
    'p',
    'Side-layout navigation includes side area and content area. Under this layout, the efficiency of switching between pages is quite high, but the horizontal space of the content area is compressed. It is suitable for pages with deep navigation hierarchy and high navigation efficiency requirements.',
  ),
  image('l-2.jpg'),
  text('h3', 'Top-layout Navigation'),
  text(
    'p',
    'Side-layout navigation includes top area and content area. Under this layout, the display efficiency of horizontal space is high, but the navigation space is lost, which reduces the efficiency of page navigation switching. It is suitable for pages where the main operating area is in the content area and the page stacking efficiency is not high. For this type of page, to ensure the stability of information layout, the width of the content area is often set to a fixed width.',
  ),
  image('l-3.jpg'),
  text('h3', 'Mixed-layout Navigation'),
  text(
    'p',
    'Mixed-layout Navigation includes top area, side area, and content area. The combination of top navigation and side navigation improves navigation efficiency. It is commonly used in application-type websites with complex information architecture and certain navigation efficiency requirements.',
  ),
  rule,
  text(
    'p',
    'Note: when the top area needs to carry important functions, the top area and bottom area can be fixed. When the content area is too high, the side area can be fixed.',
  ),
  image('l-4.jpg'),
  image('l-5.jpg'),
  text('h2', 'Grid System'),
  text(
    'p',
    'Grid is a layout that guides and standardizes the layout and information distribution in web pages through a regular grid array, improving the consistency of the layout within the interface and saving costs.',
  ),
  text('h3', 'Grid Base'),
  text(
    'p',
    'The grid base is the basic unit in the grid system. It is particularly important to define the grid base before griding. On the one hand, it standardizes the design, guides the layout design and content layout, and assists in aligning page elements and setting spacing. On the other hand, it saves time for communication between design and development. The current grid system uses 8 points as the grid base, which is suitable in granularity size and can match most mainstream screens. In TDesign, the grid base is 8px.',
  ),
  image('l-6.jpg'),
  text('h3', 'Composition of Grid'),
  text('p', 'Grid consists of column、gutter and margin'),
  text('h4', 'Columns'),
  text(
    'p',
    'Columns are imaginary vertical blocks used to align content. The width of the columns is usually defined by a percentage or fixed value. When the width of the grid changes, the width of the columns will increase or decrease accordingly if the width of the columns is not a fixed value.',
  ),
  text('h4', 'Gutters'),
  text(
    'p',
    'Gutters are the gaps between columns and are used to separate content. The width of the gutters is usually a fixed value. In TDesign, it is set as a default of 16px.',
  ),
  text('h4', 'Margins'),
  text(
    'p',
    'Safe margins are the gaps between content and screen edges. They are usually of a fixed width and are used to define the minimum breathing space on all sizes of screens. In TDesign, the default value of the margins is 24px, and the value should be determined based on actual needs, preferably in multiples of 8.',
  ),
  image('l-7.jpg'),
  text('h3', 'Layout Grid'),
  text(
    'p',
    'The number of columns used to form the grid is called the column structure. 8, 12, 16, and 24 are the most common column structures in responsive layouts. When placing content blocks in the grid, the position of the content block should start from the column and end at the column.',
  ),
  text('p', 'To balance flexibility and complexity, we adopt a 12-column grid system for the content area.'),
  image('l-8.jpg'),
  rule,
  text(
    'p',
    'According to different layouts, different grid layouts are used. TDesign includes the following 3 grid layouts:',
  ),
  text('h4', 'No-sidebar-layout Grid'),
  text('p', 'The content area occupies the full width of the page.'),
  image('l-9.jpg'),
  text('h4', 'Fixed-width Sidebar Layout Grid'),
  text(
    'p',
    'The width of the sidebar is fixed within a range of breakpoints, and the remaining space is allocated to the content area. In TDesign, the default width of the expanded sidebar is 232px.',
  ),
  image('l-10.jpg'),
  text('h4', 'Fixed-width Sidebar Layout Grid'),
  text('p', 'In TDesign, the default width of the collapsed sidebar is 64px.'),
  image('l-11.jpg'),
  rule,
  text(
    'p',
    'Note: The sidebar area can be set to a responsive layout. When the browser width is less than the configured breakpoint value (992px by default in TDesign), the sidebar navigation automatically switches from expanded to collapsed state.',
  ),
  image('l-12.jpg'),
  text('h3', 'Margin'),
  text(
    'p',
    'For consistency in page layout, regular spacing should be maintained when placing content elements in different areas. We recommend a set of rhythmic spacing values that add two small spacing values, 4 and 12, on top of the 8-multiple principle for flexible use in different scenarios.',
  ),
  image('l-13.jpg'),
  text('h2', 'Responsive Layout'),
  text('h3', 'Breakpoint System'),
  text(
    'p',
    'In grid layouts, using only one content layout may not adapt well to various display devices of different sizes. In this case, a responsive grid can be used to switch layouts by setting a series of breakpoints.',
  ),
  image('l-14.jpg'),
  rule,
  text(
    'p',
    'TDesign has set 3 breakpoints based on different display devices. This breakpoint system considers the characteristics of different browsers and subdivides breakpoints for PC devices while considering the characteristics of tablet devices (note 1). This makes the grid system better adapted to mainstream computer displays and browsers. In actual use, you can select some of these breakpoints based on business needs or use custom breakpoints appropriately.',
  ),
  table,
  text('h2', 'Grid Behavior'),
  text('p', 'System has different grid modes in different ranges of breakpoints'),
  text('h3', 'Fixed Grid'),
  text(
    'p',
    'Fixed grid has fixed column width, fixed gutter width, and fixed safe margins. The fixed grid has a fixed content width and does not change in specific breakpoint ranges, and the value can be determined based on actual situations.',
  ),
  text('h4', 'in TDesign'),
  text(
    'p',
    'no-sidebar layout: The fixed grid has a minimum width of 768px (minimum breakpoint value). When the browser width is less than the configured minimum breakpoint value, the page will not shrink any further, and a horizontal scrolling bar will appear in the browser.',
  ),
  image('l-15.jpg'),
  rule,
  text(
    'p',
    'Sidebar layout: The fixed grid has a minimum width of 704px (the minimum page width in TDesign is 768px, and the width of the collapsed sidebar is 64px). When the content area is smaller than 704px, the page will not shrink any further, and a horizontal scrolling bar will appear in the browser.',
  ),
  image('l-16.jpg'),
  text('h3', 'Fluid Grid'),
  text(
    'p',
    'Fluid grid has fluid column width, fixed gutter width, and fixed safe margins. The fluid grid has flexible content width, and the width will increase or decrease in response to changes in browser width.',
  ),
  text(
    'p',
    'In TDesign, when the browser width is greater than the minimum breakpoint value of 768px, the content area will increase or decrease in response to changes in browser width.',
  ),
  image('l-17.jpg'),
];

const zhLayoutContent = [
  text('h2', '概述'),
  text('p', '布局作为页面的基本构成、重要模式之一，也作为中后台页面统一的基础，奠定了整个中后台交互和视觉风格。'),
  text('h2', '规范'),
  text('h3', '画板尺寸'),
  text(
    'p',
    '为了减少布局设定时的沟通与拆分计算成本，基于主流屏幕尺寸，我们将设计团队的标准画板宽度定为 1440px 或 1920px。',
  ),
  text('h3', '布局组成'),
  text('p', '布局中可以包含以下 4 种区域。'),
  text('p', '内容区域（Content）：通常用于放置主体内容。'),
  text('p', '顶部区域（Header）：位于页面顶部，通常用于放置顶部导航。'),
  text('p', '侧边区域（Sider）：位于主体内容两侧，通常用于放置侧边导航。'),
  text('p', '底部区域（Footer）：位于页面底部，通常用于放置辅助信息。'),
  image('l-1.jpg'),
  text('h2', '导航布局分类'),
  text('p', '导航用于组织产品的功能与内容，引导用户在页面间移动。'),
  text('p', '在 TDesign 中包含以下 3 种导航布局类型：'),
  text('h3', '侧边导航布局'),
  text(
    'p',
    '主要包含侧边区域、内容区域。该布局下，页面间切换的操作效率较高，但压缩了内容区域的横向空间。适用于导航层级较深，导航效率要求较高的页面。',
  ),
  image('l-2.jpg'),
  text('h3', '顶部导航布局'),
  text(
    'p',
    '主要包含顶部区域、内容区域。该布局下，横向空间的展示效率很高，但损失了导航空间，降低了页面导航的切换效率。适用于主要操作区域在内容区域，对页面叠好效率要求不高的页面。对于该类页面，为了保证信息布局的稳定性，内容区域的宽度常设置为固定宽度。',
  ),
  image('l-3.jpg'),
  text('h3', '混合导航布局'),
  text(
    'p',
    '主要包含顶部区域、侧边区域、内容区域。顶部导航和侧边导航的组合使用，提升了导航效率。多用于信息架构复杂、对导航效率有一定要求的应用型网站。',
  ),
  rule,
  text('p', '注意：当顶部需要承载重要功能时，可以将顶部区域、底部区域固定。当内容区域过高时，可以将侧边区域固定。'),
  image('l-4.jpg'),
  image('l-5.jpg'),
  text('h2', '栅格系统'),
  text('p', '栅格是以规则的网格阵列来指导和规范网页中的版面布局以及信息分布，提高界面内布局的一致性，节约成本。'),
  text('h3', '网格基数'),
  text(
    'p',
    '网格基数是栅格系统中的基本网格单位。栅格化之前先定义网格基数尤其重要，一方面规范设计，指导版式设计与内容布局，辅助规范页面元素对齐和间距设定；另一方面节省设计开发沟通的时间。目前栅格系统中以 8 点为网格基数，粒度大小合适，且能够匹配多数主流屏幕。在 TDesign 中，网格基数为 8px。',
  ),
  image('l-6.jpg'),
  text('h3', '栅格组成'),
  text('p', '栅格由列（column）、槽（gutter）、安全边距（margin）组成。'),
  text('h4', '列'),
  text(
    'p',
    '列是假象的垂直块，用于对齐内容。通常使用百分比(%)或固定值定义列的宽度。列的宽度不是一个固定值时，如果栅格的宽度发生变化，则列的宽度也会相应地增大或缩小。',
  ),
  text('h4', '槽'),
  text('p', '槽是列之间的间隔。槽用来分隔内容。通常槽的宽度为固定值。TDesign 中默认为 16px。'),
  text('h4', '安全边距'),
  text(
    'p',
    '安全边距是内容和屏幕边缘之间的间隔。通常为固定宽度，用来定义在所有尺寸屏幕下最小的呼吸空间。TDesign 中侧边距的默认值为 24px，也可根据实际情况确定取值，建议使用 8 的倍数。',
  ),
  image('l-7.jpg'),
  text('h3', '布局栅格'),
  text(
    'p',
    '用于组成栅格的列数称为列结构。8、12、16 和 24是响应式布局中最常见的列结构。在栅格中放置内容区块时，内容区块的位置应该从列开始，到列结束。',
  ),
  text('p', '为了平衡灵活性与复杂度，对于内容区域，我们采用 12 栅格系统。'),
  image('l-8.jpg'),
  rule,
  text('p', '根据布局的不同使用不同的栅格布局，在 TDesign 中包含以下 3 种布局栅格：'),
  text('h4', '无侧边栏布局栅格'),
  text('p', '内容区域占据页面全部宽度。'),
  image('l-9.jpg'),
  text('h4', '定宽侧边栏布局栅格-展开'),
  text('p', '侧边栏宽度在一组断点范围内固定，剩余空间分配给内容区域。在 TDesign 中默认展开侧边栏宽度为 232px。'),
  image('l-10.jpg'),
  text('h4', '定宽侧边栏布局栅格-收起'),
  text('p', '在 TDesign 中默认收起侧边栏宽度为 64px。'),
  image('l-11.jpg'),
  rule,
  text(
    'p',
    '注意：侧边栏区域可设置为响应式布局，当浏览器宽度小于配置的断点值，侧边导航自动从展开态变为收起态（TDesign 中该断点值默认为 992px）。',
  ),
  image('l-12.jpg'),
  text('h3', '间距'),
  text(
    'p',
    '为了页面布局的一致性，在不同区域中放置内容元素时，应当保持间距的规律性。我们推荐了一组具有韵律的间距值，在遵循 8 倍数原则的基础上，增加了 4、12 两档小间距，以灵活满足不同的应用场景。',
  ),
  image('l-13.jpg'),
  text('h2', '响应式布局'),
  text('h3', '断点系统'),
  text(
    'p',
    '在栅格中，如果只使用一种内容布局方式，有时无法较好地适配各种尺寸的显示设备。此时可以使用响应式栅格，通过设置一系列断点（即布局变化的临界点）实现布局的切换。',
  ),
  image('l-14.jpg'),
  rule,
  text(
    'p',
    'TDesign 基于不同显示设备，共设置了 3 个断点。该断点系统在兼顾平板端设备的同时，对 PC 端的断点进行细分，并考虑不同浏览器的特性差异（注1），使栅格系统更好地适配主流的电脑显示器和浏览器。实际使用中，可依据业务需求选取其中的部分断点，也可以适当使用自定义断点。',
  ),
  table,
  text(
    'p',
    '注意：在 Safari 浏览器中，纵向滚动条的出现和消失，会导致相应式判断所依据的宽度值发生变化，如果此时宽度值恰好在断点附近，可能会导致布局出现非预期的改变。因此，对于 PC 端，TDesign 中并没有直接将主流的屏幕宽度用作断点值，而是下调了一定宽度，以规避滚动条的影响。',
    'desc',
  ),
  text('h2', '栅格行为'),
  text('p', '在不同的断点范围内，系统存在不同的栅格方式。'),
  text('h3', '固定栅格'),
  text(
    'p',
    '固定栅格具有固定列宽、固定槽宽和固定安全边距。固定栅格具有固定的内容宽度，在特定的断点范围内不发生变化，取值可根据实际情况决定。',
  ),
  text('h4', '在 TDesign中：'),
  text(
    'p',
    '1）无侧边栏布局：固定栅格最小宽度为 768px（最小断点值）；当浏览器宽度小于配置的最小断点值时，页面不再缩小，浏览器出现横向滚动条。',
  ),
  image('l-15.jpg'),
  rule,
  text(
    'p',
    '2）侧边栏布局：固定栅格最小宽度为 704px（TDesign 中页面最小宽度为 768px，侧边栏宽度为 64px）；内容区域小于 704px 时页面不再缩小，浏览器出现横向滚动条。',
  ),
  image('l-16.jpg'),
  text('h3', '流式栅格'),
  text(
    'p',
    '流式栅格具有流式列宽、固定槽宽和固定安全边距。流式栅格具有弹性的内容宽度，其宽度将随着浏览器宽度的变化而相应地增大或缩小。',
  ),
  text('p', '在 TDesign 中，当浏览器宽度大于最小断点值 768px 时，内容区域随着浏览器宽度的变化而相应地增大或缩小。'),
  image('l-17.jpg'),
];

export default {
  'en-US': {
    color: {
      summary: {
        title: 'Summary',
        description:
          "TDesign's color system follows the values of inclusiveness, diversity, evolution and connectivity, taking into account the application needs of color and complying with accessibility standards. TDesign also provides a complete and easy-to-use set of official color palettes.",
      },
      palette: {
        title: 'TDesign Official Palette',
        description:
          'TDesign official palette a default palette widely applicable to mid-to-back-end business scenarios. It consists of four parts: theme colors, functional colors, neutral colors, and extended colors.',
      },
      theme: {
        title: 'Theme colors',
        name: 'Tencent Blue',
        description:
          "The theme color is the most core and frequently used color in a product. It is often used to emphasize information, guide operations, and largely determines the overall tone and style of a product. TDesign uses Tencent Blue as the default theme color, which embodies the brand's characteristics and ecological concept of technological innovation and open sharing. Its stable and neutral temperament also has broad applicability in mid-to-back-end design.",
      },
      functional: {
        title: 'Functional Colors',
        description: [
          'Functional colors refer to colors used for specific scenarios and to express special semantics, such as success, failure, warning, links, etc. We have defined four functional colors, selecting hues based on the general meaning of colors and from a perspective of visual consistency with the brand color. They are also evaluated based on comprehensive consideration of WCAG 2.0 standards to meet usability standards.',
          "In TDesign's color system, each functional color extends to 10 levels, which is enough to cover various design scenarios. The color levels are developed using the HCT color space, combined with the interpolation of saturation and brightness under different hues to optimize the curve, ensuring a uniform change in color and equal brightness among multiple colors.",
        ],
      },
      neutral: {
        title: 'Neutral Colors',
        description:
          'Neutral colors consist of a range of gray and black colors. Considering that neutral colors are also used to distinguish interface layering in dark mode, they are expanded to 14 in CIELab based on brightness. The contrast between commonly used text and their color is greater than 4.5, meeting the WCAG 2.0 standard.',
      },
      brandNeutral: {
        title: 'Brand-color-bias Neutral colors',
        formula: 'Average(r,g,b) = 0.12*(r1,b1,g1) + 0.88*(r2,b2,g2)',
        description:
          'In addition, in application scenarios such as page templates, color bias is added to the gray and black colors at various levels to highlight the brand atmosphere. The RGB color mixing model is used in the process, and after many attempts, the ratio of brand color blending is determined to be 8%-12%, and the same rules as ordinary neutral colors are applied.',
      },
      extended: {
        title: 'Extended Colors',
        description:
          'Extended colors are a series of colors extended from functional colors. In scenarios that require more colors such as data visualization and illustration scenes, the same method of HCT and interpolation fitting curves is used. In addition to the functional colors of blue, red, yellow, and green, the TDesign color system is expanded to 8 main colors, including purple, sky blue, yellow, and pink extended colors. Each extended color has 10 levels to ensure uniform color changes and equal brightness among multiple colors.',
      },
      application: {
        title: 'Application Guidelines',
        uiTitle: 'UI Application Guidelines',
        uiDescription:
          'In TDesign, Tencent Blue is the main interactive color, and because of the complexity of component implementation, we have standardized the color usage rules using Design Tokens. For ease of management and readability, we have defined global semantic tokens and component tokens. Once you understand the rules of global semantic tokens, you can understand the color usage rules of components in TDesign.',
        dataTitle: 'Data Visualization Application Guidelines',
        dataDescription:
          'In a design system, data visualization in chart form is also a common application scenario, so the TDesign color system fully considers the color application in data visualization, striving to become a compatible color system. TVision, as an important part of the design system library, uses the extended colors from the TDesign official color palette as the basis for its coloring, ensuring the consistency and brand continuity of charts and UI. The most commonly used qualitative and continuous color palettes are shown in the figure below, and the recognition degrees have been verified using CIE ΔE 2000 combined with the contrast ratio. TVision will be made available in the future, providing more complete visual color guidance for everyone.',
      },
      paletteLabels: {
        blueContrast: 'Contrast Ratio 6.54:1',
        redContrast: 'Contrast Ratio 4.32:1',
        orangeContrast: 'Contrast Ratio 3.12:1',
        greenContrast: 'Contrast Ratio 3.16:1',
        brand: 'Blue7 Brand Color',
        error: 'Red6 Error Color',
        warning: 'Orange5 Warning Color',
        success: 'Green5 Success Color',
      },
      copySuccess: 'Copied',
      guideTokens: [
        { name: 'Palette', title: 'Color - Levels', content: tokenContent },
        { name: 'Global Token', title: 'Container Text - Color - layout: @palette', content: globalTokenContent },
        {
          name: 'Component Token',
          title: 'Component - Background, Text and Border - Interaction Level: @Global Semantic Token',
          content: componentTokenContent,
        },
      ],
    },
    layout: {
      content: enLayoutContent,
      table: {
        rows: [
          {
            cut: 'sm',
            cutValue: '768px',
            range: '768px-991px',
            colWidth: '16px',
            grid: 'Content blocks stack or scale based on different breakpoints',
            device: 'Pad',
          },
          {
            cut: 'md',
            cutValue: '992px',
            range: '992px-1199px',
            colWidth: '16px',
            grid: 'Content blocks stack or scale based on different breakpoints',
            device: 'Super small size laptop',
          },
          {
            cut: 'lg',
            cutValue: '1200px',
            range: 'Greater than 1200px',
            colWidth: '16px',
            grid: 'When the viewport width is greater than the breakpoint value, it always stays arranged horizontally',
            device: 'Small size laptop',
          },
        ],
        columns: [
          { width: 104, ellipsis: true, colKey: 'cut', title: 'Breakpoint' },
          { width: 140, ellipsis: true, colKey: 'cutValue', title: 'Breakpoint Value' },
          { width: 144, ellipsis: true, colKey: 'range', title: 'Responsive Range' },
          { width: 104, colKey: 'colWidth', title: 'Gutter Width' },
          { colKey: 'grid', title: 'Grid' },
          { width: 200, ellipsis: true, colKey: 'device', title: 'Reference Display Device' },
        ],
      },
    },
  },
  'zh-CN': {
    color: {
      summary: {
        title: '概述',
        description:
          'TDesign 的色彩体系搭建遵循了 TDesign 包容、多元、进化、连接的价值观，充分考虑色彩的应用需求，符合无障碍标准，提供了一套定义完整、开箱即用的官方色板。',
      },
      palette: {
        title: 'TDesign 官方色板',
        description:
          'TDesign 官方色板是一套广泛适用于中后台业务场景的默认配色。包含了主题色、功能色、中性色、扩展色4部分。',
      },
      theme: {
        title: '主题色',
        name: '腾讯蓝（Tencent Blue）',
        description:
          '主题色是产品中最核心、最高频使用的颜色，它常用于强调信息、引导操作，并在很大程度上决定了产品整体的基调和风格。TDesign 以腾讯蓝（Tencent Blue）作为默认主题色，蕴含了科技创新、开放共享的品牌特质和生态理念，其稳健、中性的气质，在中后台设计中也具有广泛的普适性。',
      },
      functional: {
        title: '功能色',
        description: [
          '功能色是指用于特定场景、表达特殊语义的颜色，例如成功、失败、告警、链接等状态。我们定义了4种功能色，在遵循色彩通用含义选取色相的基础上，从视觉一致性的角度选取了与品牌色更具一致关系的色调，并结合WCAG2.0标准综合考量，使其达到可用性标准。',
          '在 TDesign 色彩系统中，每个功能色扩展10级色阶，足够覆盖界面设计中各需求场景。色阶的制定采用了 HCT 色彩空间，结合不同色相下饱和度及亮度插值拟合出优化曲线，保证色彩变化均匀，多色之间亮度均等。',
        ],
      },
      neutral: {
        title: '中性色',
        description:
          '中性色包含一系列灰黑色，同时考虑到在深色模式下需要通过中性色来区界面分层级关系，所以在 CIELab 中根据亮度将中性色扩展至14个。并且常用文字与其色彩对比度均大于4.5，满足 WCAG2.0 标准。',
      },
      brandNeutral: {
        title: '带有品牌色倾向的中性色',
        formula: 'Average(r,g,b) = 0.12*(r1,b1,g1) + 0.88*(r2,b2,g2)',
        description:
          '此外在页面模版等应用场景中，需要在各层级的灰黑色中加入颜色倾向，以突出品牌氛围。过程中使用了 RGB 混色模型，经过多次的尝试最终确定了品牌色的混合比例为 8%-12%，运用规则同普通中性色一致。',
      },
      extended: {
        title: '扩展色',
        description:
          '扩展色是一系列由功能色扩展而成的颜色。在有更多颜色需求的场景中（如数据可视化场景、插画场景）。同样采用了 HCT 及插值拟合曲线的方法，除了功能色蓝、红、黄、绿之外，TDesign 色彩体系扩展至 8 种主要颜色，另外有紫色，天蓝色、黄色、粉红色扩展色。每个扩展色均为 10 级色阶，保证色彩变化均匀，多色之间亮度均等。',
      },
      application: {
        title: '应用指南',
        uiTitle: 'UI 应用指南',
        uiDescription:
          '在 TDesign 中，腾讯蓝是主要的交互颜色，并且因为组件实际情况的复杂性，我们使用 Design Token 规范了颜色运用规则。为了方便进行管理和阅读，我们定义了全局语义 Token 和组件 Token，这样只需要理解了全局语义 Token 的规则后，就可以了解 TDesign 中组件的颜色运用规则（可参考下图）。',
        dataTitle: '数据可视化应用指南',
        dataDescription:
          '在前端通用设计体系中，图表也是常见的应用场景，因此 TDesign 的色彩体系也充分考虑到数据可视化的色彩应用，力图成为一套具有兼容性的色彩体系。前端数据可视化组件库 TVision，作为设计体系的重要组成部分一部分，其配色基于 TDesign 官方色板中的扩展色进行应用，保证了图表与 UI 的统一性和品牌延续性。其中最常用的定性色板、连续色板如下图所示，均经过 CIE ΔE 2000 结合 contrast ratio 的辨识度验证。TVision 未来会对外开放，届时为大家提供更完整的可视化色彩指引。',
      },
      paletteLabels: {
        blueContrast: '对比度 6.54:1',
        redContrast: '对比度 4.32:1',
        orangeContrast: '对比度 3.12:1',
        greenContrast: '对比度 3.16:1',
        brand: 'Blue7 品牌色',
        error: 'Red6 错误色',
        warning: 'Orange5 告警色',
        success: 'Green5 成功色',
      },
      copySuccess: '复制成功',
      guideTokens: [
        { name: '色板', title: '颜色 - 色阶', content: tokenContent },
        { name: '全局语义 Token', title: '主题容器文字 - 色彩 - 交互层级: @色板', content: globalTokenContent },
        {
          name: '组件 Token',
          title: '组件 - 背景文字描边 - 交互层级: @全局语义Token',
          content: componentTokenContent,
        },
      ],
    },
    layout: {
      content: zhLayoutContent,
      table: {
        rows: [
          {
            cut: 'sm',
            cutValue: '768px',
            range: '768px-991px',
            colWidth: '16px',
            grid: '内容区块根据不同的断点进行堆叠或缩放',
            device: '平板',
          },
          {
            cut: 'md',
            cutValue: '992px',
            range: '992px-1199px',
            colWidth: '16px',
            grid: '内容区块根据不同的断点进行堆叠或缩放',
            device: '超小尺寸电脑',
          },
          {
            cut: 'lg',
            cutValue: '1200px',
            range: '大于 1200px',
            colWidth: '16px',
            grid: '大于断点值时，始终保持水平排列',
            device: '小尺寸电脑',
          },
        ],
        columns: [
          { width: 104, ellipsis: true, colKey: 'cut', title: '断点' },
          { width: 104, ellipsis: true, colKey: 'cutValue', title: '断点值' },
          { width: 144, ellipsis: true, colKey: 'range', title: '响应区间' },
          { width: 104, colKey: 'colWidth', title: '槽宽' },
          { colKey: 'grid', title: '栅格' },
          { width: 160, ellipsis: true, colKey: 'device', title: '显示设备参考' },
        ],
      },
    },
  },
};
