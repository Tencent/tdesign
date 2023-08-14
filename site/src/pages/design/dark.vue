<template>
  <div ref="article" name="DOC" class="doc-mode">
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
      Dark mode is a night-friendly color theme that focuses on minimum color contrast required for the readability of
      each element in the UI interface, to ensure an excellent reading experience.
    </p>

    <img class="starter" src="./assets/mode/starter.png" />

    <h2>Principle</h2>
    <h3>Content First</h3>
    <p>
      It is necessary to prioritize content legibility in a dark mode. Text content should be ensured to be easy to
      read, rather than needlessly flashy.
    </p>

    <h3>Reading Comfort</h3>
    <p>
      Try to avoid using highly saturated colors, as they can cause a visual "vibration" effect when viewed on darker
      surfaces. Instead, using low saturation or slightly softer colors can reduce visual fatigue and ensure reading
      comfort.
    </p>

    <h3>Maintain Consistency in Information</h3>
    <p>To maintain consistency in information hierarchy when switching between light mode and dark mode</p>

    <h3>Meeting WCAG2.0 Standard</h3>
    <p>
      According to WCAG2.0 Design Standard, visual presentation of text and the contrast ratio between text and
      background should be at least 1:4.5 to ensure that all text content is clear and easily readable with sufficient
      contrast.
    </p>

    <h2>Text</h2>
    <p>
      When light-colored text appears on a dark background, the contrast ratio between the body text and the background
      should be at least 1:4.5 (AA standard). In TDesign, in addition to ensuring text legibility, we also hope that
      text of different gradients will have consistent visual perception after switching between light and dark modes.
      Therefore, the opacity has been adjusted accordingly for the transition.
    </p>

    <t-table style="margin: 16px 0" bordered :data="dataSource" :columns="columns" rowKey="index" size="small" />

    <h2>Color</h2>
    <p>
      In the TDesign color system, the color palette for the dark mode is derived through calculations based on the
      light color algorithm. The establishment of color gradients also adopts a method that combines the CIElab and HSL
      color spaces with interpolation to ensure uniform color changes and equal brightness among multiple colors.
    </p>
    <p>
      TDesign provides 8 sets of commonly used basic color palettes, with each extended color having 10 levels of color
      gradients.
    </p>

    <h3>Basic Palette</h3>

    <div class="color-board">
      <div class="color-board-lists" v-for="(item, index) in colorList" :key="index">
        <div
          class="color-board-list"
          @click="copyColor(listLi.rightTxt)"
          v-for="(listLi, itemIndex) in item"
          :key="itemIndex"
          :style="{ background: listLi.rightTxt }"
        >
          <p class="color-board-bottomTxt" v-if="listLi.topTitle">{{ listLi.topTitle }}</p>
          <p class="color-board-topTxt">
            <span>{{ listLi.leftTxt }}</span>
            <span>{{ listLi.rightTxt }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor'

export default {
  mixins: [anchorMixin],

  data () {
    return {
      dataSource: [
        {
          index: 0,
          token: '@text-color-primary',
          name: 'Title',
          color: '#ffffff 90%'
        },
        {
          index: 1,
          token: '@text-color-secondary',
          name: 'Secondary Text',
          color: '#ffffff 60%'
        },
        {
          index: 2,
          token: '@text-color-placeholder',
          name: 'Placeholder Text',
          color: '#ffffff 40%'
        },
        {
          index: 3,
          token: '@text-color-disabled',
          name: 'Disabled Text',
          color: '#ffffff 26%'
        }
      ],
      columns: [
        { ellipsis: true, colKey: 'token', title: 'token' },
        { ellipsis: true, colKey: 'name', title: 'name' },
        { ellipsis: true, colKey: 'color', title: 'value' }
      ],
      colorList: {
        list: [
          {
            topTitle: 'Blue',
            leftTxt: 'Blue6',
            rightTxt: '#2174FF'
          },
          { leftTxt: 'Blue1', rightTxt: '#1E2C60' },
          { leftTxt: 'Blue2', rightTxt: '#062E9A' },
          { leftTxt: 'Blue3', rightTxt: '#073AB5' },
          { leftTxt: 'Blue4', rightTxt: '#084DCD' },
          { leftTxt: 'Blue5', rightTxt: '#0957D9' },
          { leftTxt: 'Blue6', rightTxt: '#2174FF' },
          { leftTxt: 'Blue7', rightTxt: '#478DFF' },
          { leftTxt: 'Blue8', rightTxt: '#69A1FF' },
          { leftTxt: 'Blue9', rightTxt: '#8CB8FF' },
          { leftTxt: 'Blue10', rightTxt: '#ABCAFF' }
        ],
        list1: [
          {
            topTitle: 'Cyan',
            leftTxt: 'Cyan6',
            rightTxt: '#3CB1FB'
          },
          { leftTxt: 'Cyan1', rightTxt: '#05437D' },
          { leftTxt: 'Cyan2', rightTxt: '#06579E' },
          { leftTxt: 'Cyan3', rightTxt: '#086CC0' },
          { leftTxt: 'Cyan4', rightTxt: '#0B83DF' },
          { leftTxt: 'Cyan5', rightTxt: '#0F98FA' },
          { leftTxt: 'Cyan6', rightTxt: '#3CB1FB' },
          { leftTxt: 'Cyan7', rightTxt: '#67C9FC' },
          { leftTxt: 'Cyan8', rightTxt: '#8FDDFF' },
          { leftTxt: 'Cyan9', rightTxt: '#BDEFFF' },
          { leftTxt: 'Cyan10', rightTxt: '#E0F9FF' }
        ],
        list2: [
          {
            topTitle: 'Purple',
            leftTxt: 'Purple6',
            rightTxt: '#B382F0'
          },
          { leftTxt: 'Purple1', rightTxt: '#451981' },
          { leftTxt: 'Purple2', rightTxt: '#5A2D96' },
          { leftTxt: 'Purple3', rightTxt: '#7141AC' },
          { leftTxt: 'Purple4', rightTxt: '#8755C2' },
          { leftTxt: 'Purple5', rightTxt: '#9E6CD8' },
          { leftTxt: 'Purple6', rightTxt: '#B382F0' },
          { leftTxt: 'Purple7', rightTxt: '#CB96FF' },
          { leftTxt: 'Purple8', rightTxt: '#DDB5FF' },
          { leftTxt: 'Purple9', rightTxt: '#EACFFF' },
          { leftTxt: 'Purple10', rightTxt: '#F7EBFF' }
        ],
        list3: [
          {
            topTitle: 'Pink',
            leftTxt: 'Pink6',
            rightTxt: '#FF70CF'
          },
          { leftTxt: 'Pink1', rightTxt: '#7B0554' },
          { leftTxt: 'Pink2', rightTxt: '#9B066D' },
          { leftTxt: 'Pink3', rightTxt: '#BC088A' },
          { leftTxt: 'Pink4', rightTxt: '#D435A0' },
          { leftTxt: 'Pink5', rightTxt: '#ED53B7' },
          { leftTxt: 'Pink6', rightTxt: '#FF70CF' },
          { leftTxt: 'Pink7', rightTxt: '#FF99E4' },
          { leftTxt: 'Pink8', rightTxt: '#FFBDF4' },
          { leftTxt: 'Pink9', rightTxt: '#FFDBFD' },
          { leftTxt: 'Pink10', rightTxt: '#FFF2FF' }
        ],
        list4: [
          {
            topTitle: 'Red',
            leftTxt: 'Red6',
            rightTxt: '#FB6E77'
          },
          { leftTxt: 'Red1', rightTxt: '#730524' },
          { leftTxt: 'Red2', rightTxt: '#960627' },
          { leftTxt: 'Red3', rightTxt: '#B01C37' },
          { leftTxt: 'Red4', rightTxt: '#C9384A' },
          { leftTxt: 'Red5', rightTxt: '#E35661' },
          { leftTxt: 'Red6', rightTxt: '#FB6E77' },
          { leftTxt: 'Red7', rightTxt: '#FF9195' },
          { leftTxt: 'Red8', rightTxt: '#FFB5B8' },
          { leftTxt: 'Red9', rightTxt: '#FFD6D8' },
          { leftTxt: 'Red10', rightTxt: '#FFF2F2' }
        ],
        list5: [
          {
            topTitle: 'Orange',
            leftTxt: 'Orange6',
            rightTxt: '#ED8139'
          },
          { leftTxt: 'Orange1', rightTxt: '#692204' },
          { leftTxt: 'Orange2', rightTxt: '#873105' },
          { leftTxt: 'Orange3', rightTxt: '#A24006' },
          { leftTxt: 'Orange4', rightTxt: '#C25110' },
          { leftTxt: 'Orange5', rightTxt: '#D66724' },
          { leftTxt: 'Orange6', rightTxt: '#ED8139' },
          { leftTxt: 'Orange7', rightTxt: '#FF9852' },
          { leftTxt: 'Orange8', rightTxt: '#FFB97D' },
          { leftTxt: 'Orange9', rightTxt: '#FFD8AD' },
          { leftTxt: 'Orange10', rightTxt: '#FFF4E5' }
        ],
        list6: [
          {
            topTitle: 'Yellow',
            leftTxt: 'Yellow6',
            rightTxt: '#D29E08'
          },
          { leftTxt: 'Yellow1', rightTxt: '#5E3B04' },
          { leftTxt: 'Yellow2', rightTxt: '#754E05' },
          { leftTxt: 'Yellow3', rightTxt: '#8C6106' },
          { leftTxt: 'Yellow4', rightTxt: '#A37407' },
          { leftTxt: 'Yellow5', rightTxt: '#BA8907' },
          { leftTxt: 'Yellow6', rightTxt: '#D29E08' },
          { leftTxt: 'Yellow7', rightTxt: '#EBB30E' },
          { leftTxt: 'Yellow8', rightTxt: '#FBCC30' },
          { leftTxt: 'Yellow9', rightTxt: '#FFE682' },
          { leftTxt: 'Yellow10', rightTxt: '#FFF9C2' }
        ],
        list7: [
          {
            topTitle: 'Green',
            leftTxt: 'Green6',
            rightTxt: '#07A872'
          },
          { leftTxt: 'Green1', rightTxt: '#034116' },
          { leftTxt: 'Green2', rightTxt: '#035428' },
          { leftTxt: 'Green3', rightTxt: '#046939' },
          { leftTxt: 'Green4', rightTxt: '#057E4C' },
          { leftTxt: 'Green5', rightTxt: '#06935F' },
          { leftTxt: 'Green6', rightTxt: '#07A872' },
          { leftTxt: 'Green7', rightTxt: '#37BF8E' },
          { leftTxt: 'Green8', rightTxt: '#71D5AE' },
          { leftTxt: 'Green9', rightTxt: '#B3E8D1' },
          { leftTxt: 'Green10', rightTxt: '#E8F7F1' }
        ]
      }
    }
  },
  methods: {
    copyColor(color) {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(color)
        this.$message.success('复制成功')
        return;
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

<style lang="less">
.doc-mode {
  .starter {
    border-radius: 6px;
    border: 1px solid var(--component-border);
  }

  .color-card {
    display: flex;
    flex-direction: column;
    min-height: 40px;
  }

  .color-board {
    background: #242424;
    border-radius: 3px;
    padding: 16px;
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;

    .color-board-lists {
      margin-right: 16px;
      margin-bottom: 24px;
      width: calc((100% - 48px) / 4);

      &:last-of-type,
      &:nth-child(4) {
        margin-right: 0;
      }

      &:nth-child(n + 5) {
        margin-bottom: 0;
      }

      .color-board-list {
        height: 40px;
        color: rgba(0, 0, 0, 0.9);
        padding: 4px 8px;
        transition: all 0.2s var(--anim-time-fn-easing);
        cursor: pointer;

        &:hover {
          transform: scale(1.04);
          border-radius: 3px !important;
        }

        .color-board-topTxt {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
        }

        span {
          font-size: 12px;
          line-height: 20px;
        }

        &:nth-child(-n + 6) {
          color: #ffffff;
        }

        &:first-child {
          border-radius: 6px 6px 0 0;
          height: 56px;
          color: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-flow: column;
          justify-content: space-between;

          .color-board-bottomTxt {
            font-size: 12px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.9);
            font-weight: 500;
          }

          .color-board-topTxt {
            height: unset;
          }
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }
      }
    }
  }
}
</style>
