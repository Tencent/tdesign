<template>
  <div ref="article" name="DESIGN" class="doc-icon">
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
    <p>Icon 作为 UI 构成中重要的元素，它一定程度上影响整体 UI 界面呈现出的风格，TDesign 初期提供一套适用于中后台场景的线性 Icon，以普适、通用的标准进行设计，风格契合默认 TDesign 的风格，线性、圆角。</p>

    <h2>原则</h2>
    <h3>从简</h3>
    <p>制作时保证参数的简化，尽量消除小数点以及非整数的角度。处理线条以及轮廓时删除多余的锚点，输出时应避免出现不必要的装饰，保持图标的简洁。</p>
    <img src="./assets/icon/Simplify.png" alt="">

    <h3>精确</h3>
    <p>在设计时避免使用那些含义模糊的图形，当同个事物存在多个图形表述时，应选取最为流通的样式，必要时进行针对性的强化。在图标输出时也应遵守命名规范，精确的文字描述便于他人查找。</p>
    <img src="./assets/icon/accurate.png" alt="">

    <h3>适度</h3>
    <p>单个图标作为一个独立的视觉个体，在线条的疏密以及图形的搭配上要呈现适度感。在处理一些必要的高密度图标时也要考虑线条的节奏感，让其舒适不压迫。系列图标要遵守适度原则，将变化控制在一定范围内。</p>
    <img src="./assets/icon/Moderate.png" alt="">

    <h2>规范</h2>
    <h3>栅格规范</h3>
    <p>栅格作为图表绘制的底层结构，是一切属性设计的基础。线条的长短粗细、图标的大小比例等关键因素均在其基础上制定。图标常见尺寸为16*16；20*20；24*24；32*32这四种输出尺寸。这些尺寸均可以清晰的显示在常规的显示器上。TDesign 最终选择以16*16px 的尺寸作为图标绘制的统一栅格尺寸。</p>
    <img src="./assets/icon/grid-1.png" alt="">
    <hr />

    <p>由于屏幕像素的特性，非整数像素将会以灰度显示，那样将影响图标的清晰度以及整体的含义表达，所以在栅格内绘制时应尽量对齐像素点，最大程度上保证图标的清晰度。</p>
    <img src="./assets/icon/grid-2.png" alt="">

    <hr />
    <p>在处理一些对称图形时居中处理，不应为了对齐栅格而打破画面平衡</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/grid-3-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/grid-3-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <h3>画布与辅助线</h3>
    <p>画布作为图标设计的实际操作区域起到了控制画面、限制大小、调整间距等作用。在 TDesign 图标的设计上实际画布应控制在栅格中心14*14px的区域，周围留有1px的出血。在一些特殊情况下如 icon 过长或者有突出的边角等，允许内容适当延展，以确保图标视觉重量上的统一（ 超出部分建议为多边形的边角，并不宜超过 0.5px ）</p>
    <img src="./assets/icon/canvas-1.png" alt="">
    <hr />

    <p>辅助线有助于约束图标的大小以及一些线条的走向，在制作时应尽量根据辅助线进行绘制以保持各图标间视觉重量的统一。我们对栅格内的圆形、方形、斜线等路径进行了规范并生成了一套辅助线系统。在图标设计的过程中应根据设计对象的特性选取相应的辅助线来控制图形样式。</p>
    <img src="./assets/icon/canvas-2.png" alt="">
    <hr />

    <p>根据绘制对象的形象特征去选择辅助线，在必要时，可以将内容扩展到辅助线之外</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/canvas-3-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/canvas-3-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>
    <hr />

    <p>在绘制一些具有指向性的图标时，建议在其指引的方向多预留 0.25px 的空间，以便平衡画面</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/canvas-4-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/canvas-4-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <div class="legend">
      <div class="item">
        <img src="./assets/icon/canvas-4-left-bottom.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/canvas-4-right-bottom.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <h3>线条</h3>
    <p>绘制时建议使用1px宽度的笔画，这样以便在小尺寸的栅格内保证更多的样式可能性，在 16px 时为 1px， 24px 时等比加粗</p>
    <img src="./assets/icon/line-1.png" alt="">
    <hr />

    <p>在特殊情况下如复合图形，由于该类图标结构更为复杂，线条的粗细可以适当调整</p>
    <img src="./assets/icon/line-2.png" alt="">
    <hr />

    <p>在处理长线线条的长度时建议使用 2 的倍数，这样更易进行对称处理。而短线上建议使用 3 个像素</p>
    <img src="./assets/icon/line-3.png" alt="">
    <hr />

    <p>线段末端直角处理，但在表现一些文字类图形或带有三维空间的透视图形时应与栅格相切</p>
    <img src="./assets/icon/line-4.png" alt="">

    <h3>圆角</h3>
    <p>保持 1px 的外圆角，内角无圆角，外柔内刚。</p>
    <img src="./assets/icon/round-1.png" alt="">
    <p>在处理“箭头”等具有方向性的标记时，在其顶端应采用 0.5px 的圆角，以便于突出其指向性</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/round-2-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/round-2-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <h3>角度</h3>
    <p>线条如需倾斜最好与栅格内 45° 辅助线相平行，或使用 15° 的倍数。以便在低分辨率的情况下仍有较高的线条清晰度</p>
    <img src="./assets/icon/angle-1.png" alt="">
    <hr />

    <p>不仅要注意图形部分的夹角，也要特别关注一些负形的夹角度数</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/angle-2-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/angle-2-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>
    </div>

    <h3>断口</h3>
    <p>断口多存在于复合图标上，其宽度根据具体图标的样式进行具体分析，需起到平衡视觉重量的作用 （最大宽度 ≤ 2px 且为 0.5px 的倍数）</p>
    <img src="./assets/icon/fracture.png" alt="">

    <h3>繁简度</h3>
    <p>在确保高识别度的情况下，寻求内部结构以及外部轮廓上的最简</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/easy-1-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/easy-1-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <div class="legend">
      <div class="item">
        <img src="./assets/icon/easy-1-left-bottom.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/easy-1-right-bottom.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <h3>弧线</h3>
    <p>弧线处理优先遵循正圆/正圆局部拼接</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/arc-1-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/arc-1-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>

    <h3>下载 Icon</h3>
    <all-icons />
  </div>
</template>

<script>
import AllIcons from '@/components/all-icons.vue'
import anchorMixin from '../mixins/anchor'

export default {
  components: { AllIcons },
  mixins: [anchorMixin]
}
</script>
