<template>
  <div class="doc-color-wrapper">
    <div ref="article" name="DOC" class="doc-color">
      <nav class="tdesign-toc_container" style="position: absolute; top: 328px;">
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

      <h2>概述</h2>
      <p>
        TDesign 的色彩体系搭建遵循了 TDesign
        包容、多元、进化、连接的价值观，充分考虑色彩的应用需求，符合无障碍标准，提供了一套定义完整、开箱即用的官方色板。
      </p>
      <h2>TDesign 官方色板</h2>
      <p>TDesign 官方色板是一套广泛适用于中后台业务场景的默认配色。包含了主题色、功能色、中性色、扩展色4部分。</p>
      <h3>主题色</h3>
      <p>
        主题色是产品中最核心、最高频使用的颜色，它常用于强调信息、引导操作，并在很大程度上决定了产品整体的基调和风格。TDesign
        以腾讯蓝（Tencent
        Blue）作为默认主题色，蕴含了科技创新、开放共享的品牌特质和生态理念，其稳健、中性的气质，在中后台设计中也具有广泛的普适性。
      </p>
      <div class="tdesign-color-theme">
        <p>Tencent Blue</p>
        <div class="tdesign-color-theme-b">
          <p>rgba(0, 82, 217, 1)</p>
          <p>#0052d9</p>
        </div>
      </div>
      <h3>功能色</h3>
      <p>
        功能色是指用于特定场景、表达特殊语义的颜色，例如成功、失败、告警、链接等状态。我们定义了4种功能色，在遵循色彩通用含义选取色相的基础上，从视觉一致性的角度选取了与品牌色更具一致关系的色调，并结合WCAG2.0标准综合考量，使其达到可用性标准。
      </p>
      <p>
        在 TDesign 色彩系统中，每个功能色扩展10级色阶，足够覆盖界面设计中各需求场景。色阶的制定采用了 HCT 色彩空间，结合不同色相下饱和度及亮度插值拟合出优化曲线，保证色彩变化均匀，多色之间亮度均等。
      </p>

      <div class="tdesign-color-features">
        <div class="tdesign-color-features-lists" v-for="(item, index) in listFeatures" :key="index">
          <div
            class="tdesign-color-features-list"
            @click="copyColor(listLi.rightTxt)"
            v-for="(listLi, itemIndex) in item"
            :key="itemIndex"
            :style="{ background: listLi.rightTxt }"
          >
            <p class="tdesign-color-features-bottomTxt" v-if="listLi.topTitle">{{ listLi.topTitle }}</p>
            <p class="tdesign-color-features-topTxt">
              <span>{{ listLi.leftTxt }}</span>
              <span>{{ listLi.rightTxt }}</span>
            </p>
          </div>
        </div>
      </div>
      <h3>中性色</h3>
      <p>
        中性色包含一系列灰黑色，同时考虑到在暗黑模式下需要通过中性色来区界面分层级关系，所以在 CIELab 中根据亮度将中性色扩展至14个。并且常用文字与其色彩对比度均大于4.5，满足
        WCAG2.0 标准。
      </p>
      <div class="tdesign-color-neutral">
        <div class="tdesign-color-neutral-l">
          <div class="tdesign-color-neutral-l-lists">
            <div
              class="tdesign-color-neutral-l-list"
              @click="copyColor(item.rightTxt)"
              v-for="(item, index) in listNeutralLeft"
              :key="index"
              :style="{ background: item.rightTxt }"
            >
              <span>{{ item.leftTxt }}</span>
              <span>{{ item.rightTxt }}</span>
            </div>
          </div>
        </div>
        <div class="tdesign-color-neutral-r">
          <div class="tdesign-color-neutral-r-item" v-for="(list, index) in listNeutralRight" :key="index">
            <ul>
              <li>
                <p>
                  <span>{{ list.color }}</span>
                  <span class="tdesign-color-neutral-r-item-checkbox"></span>
                </p>
              </li>
              <li v-for="(item, indexItem) in list.column" :key="indexItem">
                <div>
                  <span class="round" :style="{ background: item.roundBg }"></span>
                  <p>{{ item.font }}</p>
                  <p>{{ item.fontColor }}</p>
                </div>
                <div>
                  <p>{{ item.text }}</p>
                  <p>{{ item.size }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <h3>带有品牌色倾向的中性色</h3>
      <p>
        此外在页面模版等应用场景中，需要在各层级的灰黑色中加入颜色倾向，以突出品牌氛围。过程中使用了 RGB 混色模型，经过多次的尝试最终确定了品牌色的混合比例为 8%-12%，运用规则同普通中性色一致。
      </p>
      <div class="tdesign-color-neutral-brand">
        <div class="tdesign-color-neutral-brand-l">
          <div class="tdesign-color-neutral-brand-l-lists">
            <div
              class="tdesign-color-neutral-brand-l-list"
              @click="copyColor(item.color)"
              v-for="(item, index) in listBrandLeft"
              :key="index"
              :style="{ background: item.color }"
            >
              <span>{{ item.colorName }}</span>
              <span v-if="item.colorTxt">{{ item.colorTxt }}</span>
            </div>
          </div>
          <p class="tag">12%</p>
        </div>
        <div class="tdesign-color-neutral-brand-m">
          <div class="tdesign-color-neutral-brand-m-lists">
            <div
              class="tdesign-color-neutral-brand-m-list"
              @click="copyColor(item.rightTxt)"
              v-for="(item, index) in listNeutralLeft.slice(1)"
              :key="index"
              :style="{ background: item.rightTxt }"
            >
              <span>{{ item.leftTxt }}</span>
              <span>{{ item.rightTxt }}</span>
            </div>
          </div>
          <p class="tag">100%</p>
        </div>
        <div class="tdesign-color-neutral-brand-arr"></div>
        <div class="tdesign-color-neutral-brand-r">
          <div class="tdesign-color-neutral-brand-r-lists">
            <div
              class="tdesign-color-neutral-brand-r-list"
              @click="copyColor(item.colorTxt)"
              v-for="(item, index) in listBrandRight"
              :key="index"
              :style="{ background: item.colorTxt }"
            >
              <span>{{ item.colorName }}</span>
              <span>{{ item.colorTxt }}</span>
            </div>
          </div>
          <p class="tag">Average(r,g,b) = 0.12*(r1,b1,g1) + 0.88*(r2,b2,g2)</p>
        </div>
      </div>
      <h3>扩展色</h3>
      <p>
        扩展色是一系列由功能色扩展而成的颜色。在有更多颜色需求的场景中（如数据可视化场景、插画场景）。同样采用了 HCT 及插值拟合曲线的方法，除了功能色蓝、红、黄、绿之外，TDesign 色彩体系扩展至
        8 种主要颜色，另外有紫色，天蓝色、黄色、粉红色扩展色。每个扩展色均为 10
        级色阶，保证色彩变化均匀，多色之间亮度均等。
      </p>
      <div class="tdesign-color-expand tdesign-color-features">
        <div class="tdesign-color-features-lists" v-for="(item, index) in listExpand" :key="index">
          <div
            class="tdesign-color-features-list"
            @click="copyColor(listLi.rightTxt)"
            v-for="(listLi, itemIndex) in item"
            :key="itemIndex"
            :style="{ background: listLi.rightTxt }"
          >
            <p class="tdesign-color-expand-item">
              <span>{{ listLi.leftTxt }}</span>
              <span>{{ listLi.rightTxt }}</span>
            </p>
          </div>
        </div>
      </div>
      <h2>应用指南</h2>
      <h3>UI 应用指南</h3>
      <p>
        在 TDesign 中，腾讯蓝是主要的交互颜色，并且因为组件实际情况的复杂性，我们使用 Design Token 规范了颜色运用规则。
        为了方便进行管理和阅读，我们定义了全局语义 Token 和组件 Token，这样只需要理解了全局语义 Token
        的规则后，就可以了解 TDesign 中组件的颜色运用规则（可参考下图）。
      </p>
      <div class="tdesign-guide-ui-box">
        <div class="tdesign-guide-ui">
          <div class="tdesign-guide-ui-item" v-for="(item, index) in listGuideUi" :key="index">
            <div class="tdesign-guide-ui-item-lists">
              <div class="tdesign-guide-ui-item-list name">{{ item.name }}</div>
              <div class="tdesign-guide-ui-item-list title">{{ item.title }}</div>
              <div class="tdesign-guide-ui-item-list" v-for="(itemCon, index) in item.content" :key="index">
                <span class="color-txt-l" :style="{ background: itemCon.color }">{{ itemCon.colorN }}</span>
                <span class="color-txt-r">{{ itemCon.colorTxt }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tdesign-guide-ui-arr"></div>
        <div class="tdesign-guide-ui-arr tdesign-guide-ui-arr--position"></div>
      </div>

      <h3>数据可视化应用指南</h3>
      <p>
        在前端通用设计体系中，图表也是常见的应用场景，因此 TDesign
        的色彩体系也充分考虑到数据可视化的色彩应用，力图成为一套具有兼容性的色彩体系。 前端数据可视化组件库
        TVision，作为设计体系的重要组成部分一部分，其配色基于 TDesign 官方色板中的扩展色进行应用，保证了图表与 UI
        的统一性和品牌延续性。其中最常用的定性色板、连续色板如下图所示，均经过 CIE ΔE 2000 结合 contrast ratio 的辨识度验证。TVision
        未来会对外开放，届时为大家提供更完整的可视化色彩指引。
      </p>
      <img src="./assets/color/board.svg" />
      <!-- <div class="tdesign-color-data">
        <div class="tdesign-color-data-lists" v-for="(item, index) in listFeatures" :key="index + 'color-data'">
          <div
            class="tdesign-color-data-list"
            v-for="(item, index) in item"
            :key="index"
            :style="{ background: item.rightTxt }"
          ></div>
        </div>
        <div class="tdesign-color-data-lists" v-for="(item, index) in listExpand" :key="index + 'color-data2'">
          <div
            class="tdesign-color-data-list"
            v-for="(item, index) in item"
            :key="index"
            :style="{ background: item.rightTxt }"
          ></div>
        </div>
      </div> -->
      <!-- <h2>TDesign 智能色板</h2>
      <p>如果需要定制化自己的色板，TDesign 提供了 <a class="link" target="_blank" href="https://tvision.oa.com/t7/">基于CIELab的色板生成工具</a>，可以方便的生成完整的色板。
        目前工具还处于内测阶段，欢迎体验反馈。</p> -->
    </div>
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor'

export default {
  mixins: [anchorMixin],
  data () {
    return {
      listFeatures: {
        list: [
          {
            topTitle: 'Contrast Ratio 6.54:1',
            leftTxt: 'Blue7 品牌色',
            rightTxt: '#0052d9'
          },
          {
            leftTxt: 'Blue1',
            rightTxt: '#f2f3ff'
          },
          {
            leftTxt: 'Blue2',
            rightTxt: '#d9e1ff'
          },
          {
            leftTxt: 'Blue3',
            rightTxt: '#b5c7ff'
          },
          {
            leftTxt: 'Blue4',
            rightTxt: '#8eabff'
          },
          {
            leftTxt: 'Blue5',
            rightTxt: '#618dff'
          },
          {
            leftTxt: 'Blue6',
            rightTxt: '#366ef4'
          },
          {
            leftTxt: 'Blue7',
            rightTxt: '#0052d9'
          },
          {
            leftTxt: 'Blue8',
            rightTxt: '#003cab'
          },
          {
            leftTxt: 'Blue9',
            rightTxt: '#002a7c'
          },
          {
            leftTxt: 'Blue10',
            rightTxt: '#001a57'
          }
        ],
        list1: [
          {
            topTitle: 'Contrast Ratio 4.32:1',
            leftTxt: 'Red6 错误色',
            rightTxt: '#d54941'
          },
          {
            leftTxt: 'Red1',
            rightTxt: '#fff0ed'
          },
          {
            leftTxt: 'Red2',
            rightTxt: '#ffd8d2'
          },
          {
            leftTxt: 'Red3',
            rightTxt: '#ffb9b0'
          },
          {
            leftTxt: 'Red4',
            rightTxt: '#ff9285'
          },
          {
            leftTxt: 'Red5',
            rightTxt: '#f6685d'
          },
          {
            leftTxt: 'Red6',
            rightTxt: '#d54941'
          },
          {
            leftTxt: 'Red7',
            rightTxt: '#ad352f'
          },
          {
            leftTxt: 'Red8',
            rightTxt: '#881f1c'
          },
          {
            leftTxt: 'Red9',
            rightTxt: '#68070a'
          },
          {
            leftTxt: 'Red10',
            rightTxt: '#490002'
          }
        ],
        list2: [
          {
            topTitle: 'Contrast Ratio 3.12:1',
            leftTxt: 'Orange5 告警色',
            rightTxt: '#e37318'
          },
          {
            leftTxt: 'Orange1',
            rightTxt: '#fff1e9'
          },
          {
            leftTxt: 'Orange2',
            rightTxt: '#ffd9c2'
          },
          {
            leftTxt: 'Orange3',
            rightTxt: '#ffb98c'
          },
          {
            leftTxt: 'Orange4',
            rightTxt: '#fa9550'
          },
          {
            leftTxt: 'Orange5',
            rightTxt: '#e37318'
          },
          {
            leftTxt: 'Orange6',
            rightTxt: '#be5a00'
          },
          {
            leftTxt: 'Orange7',
            rightTxt: '#954500'
          },
          {
            leftTxt: 'Orange8',
            rightTxt: '#713300'
          },
          {
            leftTxt: 'Orange9',
            rightTxt: '#532300'
          },
          {
            leftTxt: 'Orange10',
            rightTxt: '#3b1700'
          }
        ],
        list3: [
          {
            topTitle: 'Contrast Ratio 3.16:1',
            leftTxt: 'Green5 成功色',
            rightTxt: '#2ba471'
          },
          {
            leftTxt: 'Green1',
            rightTxt: '#e3f9e9'
          },
          {
            leftTxt: 'Green2',
            rightTxt: '#c6f3d7'
          },
          {
            leftTxt: 'Green3',
            rightTxt: '#92dab2'
          },
          {
            leftTxt: 'Green4',
            rightTxt: '#56c08d'
          },
          {
            leftTxt: 'Green5',
            rightTxt: '#2ba471'
          },
          {
            leftTxt: 'Green6',
            rightTxt: '#008858'
          },
          {
            leftTxt: 'Green7',
            rightTxt: '#006c45'
          },
          {
            leftTxt: 'Green8',
            rightTxt: '#005334'
          },
          {
            leftTxt: 'Green9',
            rightTxt: '#003b23'
          },
          {
            leftTxt: 'Green10',
            rightTxt: '#002515'
          }
        ]
      },
      listNeutralLeft: [
        {
          leftTxt: 'White',
          rightTxt: '#ffffff'
        },
        {
          leftTxt: 'Gray1  L96',
          rightTxt: '#f3f3f3'
        },
        {
          leftTxt: 'Gray2  L94',
          rightTxt: '#eeeeee'
        },
        {
          leftTxt: 'Gray3  L92',
          rightTxt: '#e8e8e8'
        },
        {
          leftTxt: 'Gray4  L88',
          rightTxt: '#dddddd'
        },
        {
          leftTxt: 'Gray5  L80',
          rightTxt: '#c6c6c6'
        },
        {
          leftTxt: 'Gray6  L68',
          rightTxt: '#a6a6a6'
        },
        {
          leftTxt: 'Gray7  L58',
          rightTxt: '#8b8b8b'
        },
        {
          leftTxt: 'Gray8  L50',
          rightTxt: '#777777'
        },
        {
          leftTxt: 'Gray9  L40',
          rightTxt: '#5e5e5e'
        },
        {
          leftTxt: 'Gray10  L32',
          rightTxt: '#4b4b4b'
        },
        {
          leftTxt: 'Gray11  L24',
          rightTxt: '#393939'
        },
        {
          leftTxt: 'Gray12  L18',
          rightTxt: '#2c2c2c'
        },
        {
          leftTxt: 'Gray13  L14',
          rightTxt: '#242424'
        },
        {
          leftTxt: 'Gray14  L8',
          rightTxt: '#181818'
        }
      ],
      listNeutralRight: [
        {
          color: 'White',
          icon: '',
          column: [
            {
              roundBg: 'rgba(0, 0, 0, 0.9)',
              font: 'Font Gy1',
              fontColor: '#000000 90%',
              text: 'Text',
              size: 'AAA 17.5'
            },
            { roundBg: 'rgba(0, 0, 0, 0.6)', font: 'Font Gy2', fontColor: '#000000 60%', text: 'Text', size: 'AA 5.7' }
          ]
        },
        {
          color: 'Gray1',
          icon: '',
          column: [
            {
              roundBg: 'rgba(0, 0, 0, 0.9)',
              font: 'Font Gy1',
              fontColor: '#000000 90%',
              text: 'Text',
              size: 'AAA 15.8'
            },
            { roundBg: 'rgba(0, 0, 0, 0.6)', font: 'Font Gy2', fontColor: '#000000 60%', text: 'Text', size: 'AA 5.1' }
          ]
        },
        {
          color: 'Gray2',
          icon: '',
          column: [
            {
              roundBg: 'rgba(0, 0, 0, 0.9)',
              font: 'Font Gy1',
              fontColor: '#000000 90%',
              text: 'Text',
              size: 'AAA 15.1'
            },
            { roundBg: 'rgba(0, 0, 0, 0.6)', font: 'Font Gy2', fontColor: '#000000 60%', text: 'Text', size: 'AA 4.9' }
          ]
        }
      ],
      listBrandLeft: [
        { colorName: 'L96', color: '#f2f3ff' },
        { colorName: 'L94', color: '#ebedff' },
        { colorName: 'L92', color: '#e3e7ff' },
        { colorName: 'L88', color: '#d3dcff' },
        { colorName: 'L80', color: '#b4c5ff' },
        { colorName: 'L68', color: '#84a2ff' },
        { colorName: 'L58', color: '#5885ff' },
        { colorName: 'L50', color: '#366ef4' },
        { colorName: 'L40', color: '#0052D9', colorTxt: '#0052d9' },
        { colorName: 'L32', color: '#0042b2' },
        { colorName: 'L24', color: '#00328b' },
        { colorName: 'L18', color: '#00266e' },
        { colorName: 'L14', color: '#001e5c' },
        { colorName: 'L8', color: '#001442' }
      ],
      listBrandRight: [
        { colorName: 'BlueGray1  L96', colorTxt: '#f3f3f4' },
        { colorName: 'BlueGray2  L94', colorTxt: '#eeeef0' },
        { colorName: 'BlueGray3  L92', colorTxt: '#e7e8eb' },
        { colorName: 'BlueGray4  L88', colorTxt: '#dcdde1' },
        { colorName: 'BlueGray5  L80', colorTxt: '#c4c6cd' },
        { colorName: 'BlueGray6  L68', colorTxt: '#a2a6b1' },
        { colorName: 'BlueGray7  L58', colorTxt: '#858a99' },
        { colorName: 'BlueGray8  L50', colorTxt: '#6f7686' },
        { colorName: 'BlueGray9  L40', colorTxt: '#535d6d' },
        { colorName: 'BlueGray10  L32', colorTxt: '#424a57' },
        { colorName: 'BlueGray11  L24', colorTxt: '#323843' },
        { colorName: 'BlueGray12  L18', colorTxt: '#272b34' },
        { colorName: 'BlueGray13  L14', colorTxt: '#20232b' },
        { colorName: 'BlueGray14  L8', colorTxt: '#15181d' }
      ],
      listExpand: {
        list: [
          {
            leftTxt: 'Cyan5',
            rightTxt: '#029cd4'
          },
          {
            leftTxt: 'Cyan1',
            rightTxt: '#e8f5ff'
          },
          {
            leftTxt: 'Cyan2',
            rightTxt: '#c4e8ff'
          },
          {
            leftTxt: 'Cyan3',
            rightTxt: '#85d3ff'
          },
          {
            leftTxt: 'Cyan4',
            rightTxt: '#41b8f2'
          },
          {
            leftTxt: 'Cyan5',
            rightTxt: '#029cd4'
          },
          {
            leftTxt: 'Cyan6',
            rightTxt: '#0080b0'
          },
          {
            leftTxt: 'Cyan7',
            rightTxt: '#00668e'
          },
          {
            leftTxt: 'Cyan8',
            rightTxt: '#004e6d'
          },
          {
            leftTxt: 'Cyan9',
            rightTxt: '#003850'
          },
          {
            leftTxt: 'Cyan10',
            rightTxt: '#002536'
          }
        ],
        list1: [
          {
            leftTxt: 'Purple6',
            rightTxt: '#8e56dd'
          },
          {
            leftTxt: 'Purple1',
            rightTxt: '#fbf0ff'
          },
          {
            leftTxt: 'Purple2',
            rightTxt: '#eedcff'
          },
          {
            leftTxt: 'Purple3',
            rightTxt: '#dcbfff'
          },
          {
            leftTxt: 'Purple4',
            rightTxt: '#c69cff'
          },
          {
            leftTxt: 'Purple5',
            rightTxt: '#ad75fe'
          },
          {
            leftTxt: 'Purple6',
            rightTxt: '#8e56dd'
          },
          {
            leftTxt: 'Purple7',
            rightTxt: '#7137bf'
          },
          {
            leftTxt: 'Purple8',
            rightTxt: '#5610a4'
          },
          {
            leftTxt: 'Purple9',
            rightTxt: '#3b007b'
          },
          {
            leftTxt: 'Purple10',
            rightTxt: '#280057'
          }
        ],
        list2: [
          {
            leftTxt: 'Yellow4',
            rightTxt: '#f5ba18'
          },
          {
            leftTxt: 'Yellow1',
            rightTxt: '#fff5e4'
          },
          {
            leftTxt: 'Yellow2',
            rightTxt: '#ffe7b5'
          },
          {
            leftTxt: 'Yellow3',
            rightTxt: '#ffd36d'
          },
          {
            leftTxt: 'Yellow4',
            rightTxt: '#f5ba18'
          },
          {
            leftTxt: 'Yellow5',
            rightTxt: '#d8a100'
          },
          {
            leftTxt: 'Yellow6',
            rightTxt: '#b38500'
          },
          {
            leftTxt: 'Yellow7',
            rightTxt: '#8b6600'
          },
          {
            leftTxt: 'Yellow8',
            rightTxt: '#654900'
          },
          {
            leftTxt: 'Yellow9',
            rightTxt: '#443000'
          },
          {
            leftTxt: 'Yellow10',
            rightTxt: '#2b1d00'
          }
        ],
        list3: [
          {
            leftTxt: 'Pink5',
            rightTxt: '#e851b3'
          },
          {
            leftTxt: 'Pink1',
            rightTxt: '#fff0f6'
          },
          {
            leftTxt: 'Pink2',
            rightTxt: '#ffd8eb'
          },
          {
            leftTxt: 'Pink3',
            rightTxt: '#ffaedc'
          },
          {
            leftTxt: 'Pink4',
            rightTxt: '#ff79cd'
          },
          {
            leftTxt: 'Pink5',
            rightTxt: '#e851b3'
          },
          {
            leftTxt: 'Pink6',
            rightTxt: '#c43695'
          },
          {
            leftTxt: 'Pink7',
            rightTxt: '#a12279'
          },
          {
            leftTxt: 'Pink8',
            rightTxt: '#800a5f'
          },
          {
            leftTxt: 'Pink9',
            rightTxt: '#610046'
          },
          {
            leftTxt: 'Pink10',
            rightTxt: '#43002f'
          }
        ]
      },
      listGuideUi: [
        {
          name: '色板',
          title: '颜色 - 色阶',
          content: [
            { color: '#366ef4', colorTxt: 'blue-6' },
            { color: '#0052D9', colorTxt: 'blue-7' },
            { color: '#003cab', colorTxt: 'blue-8' },
            { color: '#FFFFFF', colorTxt: 'white' },
            { color: '#F3F3F3', colorTxt: 'gray-1' },
            { color: '#E7E7E7', colorTxt: 'gray-3' },
            { color: 'rgba(0,0,0,.9)', colorTxt: 'fontgray-1' },
            { color: 'rgba(0,0,0,.6)', colorTxt: 'fontgray-2' }
          ]
        },
        {
          name: '全局语义 Token',
          title: '主题容器文字 - 色彩 - 交互层级: @色板',
          content: [
            { colorN: 'brand-color-hover:', colorTxt: '@blue-color-6' },
            { colorN: 'brand-color:', colorTxt: '@blue-color-7' },
            { colorN: 'brand-color-active:', colorTxt: '@blue-color-8' },
            { colorN: 'bg-color-container:', colorTxt: '@white-color' },
            { colorN: 'bg-color-container-hover:', colorTxt: '@gray-color-1' },
            { colorN: 'bg-color-container-active:', colorTxt: '@gray-color-3' },
            { colorN: 'text-color-primary:', colorTxt: '@font-gray-1' },
            { colorN: 'text-color-secondary:', colorTxt: '@font-gray-2' }
          ]
        },
        {
          name: '组件 Token',
          title: '组件 - 背景文字描边 - 交互层级: @全局语义Token',
          content: [
            { colorN: 'button-bg-hover:', colorTxt: '@brand-color-hover' },
            { colorN: 'button-bg:', colorTxt: '@brand-color' },
            { colorN: 'button-bg-active:', colorTxt: '@brand-color-active' },
            { colorN: 'table-bg:', colorTxt: '@bg-color-container' },
            { colorN: 'table-bg-hover:', colorTxt: '@bg-color-container-hover' },
            { colorN: 'table-bg-active:', colorTxt: '@bg-color-container-active' },
            { colorN: 'menu-tabstext-select:', colorTxt: '@text-color-primary' },
            { colorN: 'menu-tabstext:', colorTxt: '@text-color-secondary' }
          ]
        }
      ]
    }
  },

  methods: {
    copyColor (color) {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(color)
        this.$message.success('复制成功')
        return
      }

      const textarea = document.createElement('textarea')
      textarea.textContent = color
      textarea.style.width = 0
      textarea.style.height = 0
      document.body.appendChild(textarea)

      const selection = document.getSelection()
      const range = document.createRange()
      range.selectNode(textarea)
      selection.removeAllRanges()
      selection.addRange(range)

      document.execCommand('copy')
      selection.removeAllRanges()
      document.body.removeChild(textarea)

      this.$message.success('复制成功')
    }
  }
}
</script>
