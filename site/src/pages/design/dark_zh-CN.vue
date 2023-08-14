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

    <h2>概述</h2>
    <p>
      暗黑模式是一种夜间友好的颜色主题，主要侧重于UI界面中每个元素可读性所需的最小色彩对比度，以保证出色的阅读体验。
    </p>

    <img class="starter" src="./assets/mode/starter.png" />

    <h2>原则</h2>
    <h3>内容优先</h3>
    <p>暗黑模式下应优先保证内容识别度。需要确保文本内容易于阅读，而不是无缘无故的花哨。</p>

    <h3>阅读舒适度</h3>
    <p>
      尽量避免使用高饱和度的颜色，因为在较暗的表面上观看时，高饱和度颜色具有视觉“抖动”效果。相反，使用低饱和度或稍微柔和的颜色会减少人眼的视觉疲劳，保证阅读舒适性。
    </p>

    <h3>信息层级一致性</h3>
    <p>浅色模式和深色模式下转换时应该保持信息层级一致性。</p>

    <h3>符合 WCAG2.0 标准</h3>
    <p>
      依据 WCAG2.0 设计标准，文本的视觉呈现以及文本图像至少要有 1:4.5 的对比度，以确保所有的文字内容清晰易读，对比度足够。
    </p>

    <h2>文字</h2>
    <p>
      浅色文本出现在深色背景上时，正文文字和背景的对比度至少要有 1:4.5(AA 标准）在 TDesign
      中，除了保证文字识别度之外，希望不同梯度的文字在深浅模式切换后的视觉感知也能趋于一致。所以针对转换后的透明度进行了微调。
    </p>

    <t-table style="margin: 16px 0" bordered :data="dataSource" :columns="columns" rowKey="index" size="small" />

    <h2>色彩</h2>
    <p>
      在 TDesign 色彩系统中，在亮色的色彩算法基础上，经过运算得到暗黑模式的色板。色阶的制定同样采用了 CIElab、HSL
      色彩空间结合插值的方法，保证色彩变化均匀，多色之间亮度均等。
    </p>
    <p>色彩中提供了 8 套常用的基础色板，每个扩展色均为 10 级色阶。</p>

    <h3>基础色板</h3>

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
          name: '标题',
          color: '#ffffff 90%'
        },
        {
          index: 1,
          token: '@text-color-secondary',
          name: '次要文字',
          color: '#ffffff 60%'
        },
        {
          index: 2,
          token: '@text-color-placeholder',
          name: '占位符文字',
          color: '#ffffff 40%'
        },
        {
          index: 3,
          token: '@text-color-disabled',
          name: '禁用状态文字',
          color: '#ffffff 26%'
        }
      ],
      columns: [
        { ellipsis: true, colKey: 'token', title: 'token' },
        { ellipsis: true, colKey: 'name', title: '名称' },
        { ellipsis: true, colKey: 'color', title: '色值' }
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

      &:last-of-type, &:nth-child(4) {
        margin-right: 0;
      }
      &:nth-child(n + 5) {
        margin-bottom: 0;
      }
      .color-board-list {
        height: 40px;
        color: rgba(0,0,0,.9);
        padding: 4px 8px;
        transition: all .2s var(--anim-time-fn-easing);
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
          color: rgba(0,0,0,.9);
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .color-board-bottomTxt {
            font-size: 12px;
            line-height: 20px;
            color: rgba(0,0,0,0.9);
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
