<template>
  <div ref="articleRef" name="DESIGN" class="doc-icon">
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
      Icon 作为 UI 构成中重要的元素，它一定程度上影响整体 UI 界面呈现出的风格，TDesign 提供一套适用于中后台场景的线性
      Icon，以普适通用的标准进行设计，契合 TDesign 设计系统的整体风格。
    </p>

    <h2>原则</h2>
    <h3>从简</h3>
    <p>
      制作时保证参数的简化，尽量消除小数点以及非整数的角度。处理线条以及轮廓时删除多余的锚点，输出时应避免出现不必要的装饰，保持图标的简洁。
    </p>
    <img src="./assets/icon/simplify-1.png" alt="" />

    <h3>精确</h3>
    <p>
      在设计时避免使用那些含义模糊的图形，当同个事物存在多个图形表述时，应选取最为流通的样式，必要时进行针对性的强化。在图标输出时也应遵守命名规范，精确的文字描述便于他人查找。
    </p>
    <img src="./assets/icon/accurate-1.png" alt="" />

    <h3>适度</h3>
    <p>
      单个图标作为一个独立的视觉个体，在线条的疏密以及图形的搭配上要呈现适度感。在处理一些必要的高密度图标时也要考虑线条的节奏感，让其舒适不压迫。系列图标要遵守适度原则，将变化控制在一定范围内。
    </p>
    <img src="./assets/icon/moderate-1.png" alt="" />

    <h2>规范</h2>
    <h3>栅格规范</h3>
    <p>
      栅格作为图表绘制的底层结构，是一切属性设计的基础。线条的长短粗细、图标的大小比例等关键因素均在其基础上制定。图标常见尺寸为16*16；20*20；24*24；32*32这四种输出尺寸。这些尺寸均可以清晰的显示在常规的显示器上。TDesign
      最终选择以 24*24px 的尺寸作为图标绘制的统一栅格尺寸，经矢量转曲后等比缩放到 16*16px 交付。此方案旨在兼容 1.0
      版本组件的默认调用尺寸，避免了额外调整图标大小的问题。
    </p>
    <img src="./assets/icon/grid-1.png" alt="" />
    <hr />

    <p>
      受屏幕像素栅格化特性影响，非整数像素描边会因抗锯齿处理产生半透明灰度，导致图标边缘模糊、表意失真。因此，绘制时应严格对齐像素网格，以最大化保证图标的清晰度。
    </p>
    <img src="./assets/icon/grid-2.png" alt="" />

    <hr />
    <p>在处理一些对称图形时居中处理，不应为了对齐栅格而打破画面平衡。</p>
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
    <p>
      画布作为图标设计的实际操作区域起到了控制画面、限制大小、调整间距等作用。在 TDesign
      图标的设计上实际画布应控制在栅格中心20*20px 的区域。在一些特殊情况下如 icon
      过长或者有突出的边角等，允许内容适当延展，以确保图标视觉重量上的统一。
    </p>
    <img src="./assets/icon/canvas-1.png" alt="" />
    <hr />

    <p>
      辅助线有助于约束图标的大小以及一些线条的走向，在制作时应尽量根据辅助线进行绘制以保持各图标间视觉重量的统一。我们对栅格内的圆形、方形、斜线等路径进行了规范并生成了一套辅助线系统。在图标设计的过程中应根据设计对象的特性选取相应的辅助线来控制图形样式。
    </p>
    <img src="./assets/icon/canvas-2.png" alt="" />
    <hr />

    <p>根据绘制对象的形象特征去选择辅助线，在必要时，可以将内容扩展到辅助线之外，不应为了对齐辅助线而妥协图形设计。</p>
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

    <p>在绘制一些具有指向性的图标时，建议在其指引的反方向延伸微量（ 0.25px 倍数）的视觉内容，以便平衡画面。</p>
    <img src="./assets/icon/canvas-4.png" alt="" />

    <h3>线条</h3>
    <p>
      考虑通用普适性，本套系统中所有图标均设置为 2px 宽度的描边，并支持在<t-link
        theme="primary"
        href="/icons"
        target="blank"
        >🔗 TDesign 图标独立站点</t-link
      >上进行全量化调节。
    </p>
    <img src="./assets/icon/line-1.png" alt="" />
    <img src="./assets/icon/line-2.png" alt="" style="margin-top: 16px" />

    <hr />

    <p>在处理长线线条的长度时建议使用 2 的倍数，这样更易进行对称处理。</p>
    <img src="./assets/icon/line-3.png" alt="" />
    <hr />

    <p>线段末端直角处理，但在表现一些文字类图形或带有三维空间的透视图形时应与栅格相切。</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/line-4-left.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/line-4-right.png" />
        <img class="tag" src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png" />
      </div>
    </div>
    <hr />

    <h3>圆角</h3>
    <p>在处理拐角时，需结合图形表意，恰当的圆角能强化视觉语言，而不是生硬地全部处理为尖角。</p>
    <img src="./assets/icon/round-1.png" alt="" />
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
    <p>线条如需倾斜最好与栅格内 45° 辅助线相平行，或使用 15° 的倍数。以便在低分辨率的情况下仍有较高的线条清晰度。</p>
    <img src="./assets/icon/angle-1.png" alt="" />
    <hr />

    <p>不仅要注意图形部分的夹角，也要特别关注一些负形的夹角度数。</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/angle-2-left.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/angle-2-right.png" />
      </div>
    </div>

    <h3>断口</h3>
    <p>
      断口多存在于复合图标上，其宽度根据具体图标的样式进行具体分析，需起到平衡视觉重量的作用 （最大宽度 ≤ 2px 且为 0.5px
      的倍数）。
    </p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/fracture-1-left.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/fracture-1-right.png" />
      </div>
    </div>

    <h3>叠加型通用挂件</h3>
    <p>为在统一规范下适配多样的主图形，提供了中、小两套通用挂件。</p>
    <img src="./assets/icon/variety-1.png" alt="" />
    <hr />
    <p>使用时，需依据主图形的具体形态，选择合适尺寸并确定摆放位置。</p>
    <img src="./assets/icon/variety-2.png" alt="" />

    <h3>繁简度</h3>
    <p>在确保高识别度的基础上，寻求内部结构以及外部轮廓的最简化。</p>
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
    <p>弧线处理优先遵循正圆/正圆局部拼接。</p>
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

    <t-divider>
      <div class="icons-page-btn" @click="handleClickBtn">
        <link-1-icon style="margin-right: 8px" :size="20" />打开 TDesign 图标独立站点
      </div>
    </t-divider>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Link1Icon } from 'tdesign-icons-vue';
import { genAnchor } from './utils';

// Template refs
const articleRef = ref(null);

// Data (from mixin)
const catalog = ref([]);

// Methods
const handleClickBtn = () => {
  window.open('/icons', '_blank');
};

// Lifecycle hooks
onMounted(() => {
  genAnchor(articleRef, catalog);
});
</script>
