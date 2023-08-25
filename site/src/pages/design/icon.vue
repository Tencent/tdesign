<template>
  <div ref="article" name="DESIGN" class="doc-icon">
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
      Icons are an important element of UI design, and to some extent, they affect the style of the entire UI interface.
      In the early stage of TDesign, a set of linear icons is provided for use in middle and back-end scenarios. These
      icons are designed with a universal standard, which fits the default TDesign style - linear and rounded.
    </p>

    <h2>Principle</h2>
    <h3>Simplicity</h3>
    <p>
      Ensure parameters are simplified during production, avoid decimals and non-integer angles wherever possible.
      Remove excess anchor points when processing lines and outlines, and avoid unnecessary embellishments when
      outputting icons to maintain simplicity.
    </p>
    <img src="./assets/icon/Simplify.png" alt="" />

    <h3>Accuracy</h3>
    <p>
      Avoid using graphics with vague meanings in designs. When representing the same thing with multiple graphics,
      choose the most common style and adapt as needed. Follow naming conventions when outputting, and use precise
      descriptions to make it easier for others to find them.
    </p>
    <img src="./assets/icon/accurate.png" alt="" />

    <h3>Moderation</h3>
    <p>
      As a standalone visual entity, individual icons should have a reasonable sense of line density and graphical
      compatibility. When dealing with necessary high-density icons, rhythm should be considered, and they should be
      comfortable and non-oppressive. Icon series should follow the principles of moderation, keeping changes within a
      certain range.
    </p>
    <img src="./assets/icon/Moderate.png" alt="" />

    <h2>Specification</h2>
    <h3>Grid Specification</h3>
    <p>
      The grid is the underlying structure of chart drawing and is the basis for all attribute designs. Key factors such
      as line length, thickness and icon size ratios are based on it. The common icon output sizes are 1616, 2020, 2424,
      and 3232. TDesign selects 16*16 px as the unified grid size for icon creation.
    </p>
    <img src="./assets/icon/grid-1.png" alt="" />
    <hr />

    <p>
      Due to the characteristics of screen pixels, non-integer pixels will be displayed in grayscale, which will affect
      the clarity and overall meaning of icons, so it is necessary to align pixels in the grid to ensure the clarity of
      the icon to the greatest extent possible.
    </p>
    <img src="./assets/icon/grid-2.png" alt="" />

    <hr />
    <p>
      When processing symmetrical graphics, align the center, but do not break the visual balance of the image for the
      sake of grid alignment.
    </p>
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

    <h3>Canvas and Guidelines</h3>
    <p>
      The canvas serves as the actual operational area of icon designs and controls the screen, size limits, and spacing
      adjustments. The actual canvas used in TDesign icon design should be controlled within the central 14*14 px area
      of the grid, with a 1px bleed around it. In some special cases, such as when an icon is too long or has prominent
      corners, content extension is allowed to ensure visual unity.
    </p>
    <img src="./assets/icon/canvas-1.png" alt="" />
    <hr />

    <p>
      Guidelines help to restrict the size of icons and the orientation of some lines. While designing, follow the
      guidelines as closely as possible to maintain visual consistency across all icons. We have standardized circle,
      square, and oblique paths within the grid and created a set of guideline systems. When designing icons, select the
      appropriate guidelines based on the characteristics of the design object to control the graphic style.
    </p>
    <img src="./assets/icon/canvas-2.png" alt="" />
    <hr />

    <p>
      According to the image characteristics of the drawing object, choose auxiliary lines. If necessary, the content
      can be extended beyond the auxiliary lines.
    </p>
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

    <p>
      When drawing some directional icons, it is recommended to reserve a space of 0.25px in the direction it points to
      balance the picture.
    </p>
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

    <h3>Line</h3>
    <p>
      It is recommended to use a stroke width of 1px during drawing, which ensures more style possibilities in small
      grid sizes. For example, 1px at 16px and proportionally thicker at 24px.
    </p>
    <img src="./assets/icon/line-1.png" alt="" />
    <hr />

    <p>
      In special cases such as composite graphics, the thickness of the lines can be adjusted appropriately because this
      type of icon has a more complex structure.
    </p>
    <img src="./assets/icon/line-2.png" alt="" />
    <hr />

    <p>
      When dealing with the length of long line segments, it is recommended to use multiples of 2. This makes it easier
      to achieve symmetry. For short line segments, it is recommended to use 3 pixels.
    </p>
    <img src="./assets/icon/line-3.png" alt="" />
    <hr />

    <p>
      The line end should be a straight corner, but when depicting some text graphics or those with three-dimensional
      perspective, it should be aligned with the grid.
    </p>
    <img src="./assets/icon/line-4.png" alt="" />

    <h3>Corners</h3>
    <p>Maintain a 1px outer round corner and no inner round corners.</p>
    <img src="./assets/icon/round-1.png" alt="" />
    <p>
      When dealing with directional markers such as "arrows," a 0.5px rounded corner should be used at the top to
      highlight its directionality.
    </p>
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

    <h3>Angle</h3>
    <p>
      If the line segment needs to be inclined, it is better to be parallel to the 45° auxiliary line within the grid or
      use multiples of 15°. This ensures higher line clarity even at low resolutions.
    </p>
    <img src="./assets/icon/angle-1.png" alt="" />
    <hr />

    <p>Not only should the angles of the graphics be considered, but also the angles of some negative shapes.</p>
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

    <h3>Breaks</h3>
    <p>
      Breaks mostly appear on composite icons, and their width should be analyzed according to the specific style of the icon and aim to balance the visual weight.</p>
    <img src="./assets/icon/fracture.png" alt="" />

    <h3>Simplicity</h3>
    <p>Seek simplicity in the internal structure and external outline while ensuring high recognition.</p>
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

    <h3>Arc</h3>
    <p>Arc line processing prioritizes using full circles where possible</p>
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

    <h3>Download Icon</h3>
    <all-icons />
  </div>
</template>

<script>
import AllIcons from '@/components/all-icons.vue';
import anchorMixin from '../mixins/anchor';

export default {
  components: { AllIcons },
  mixins: [anchorMixin],
};
</script>
