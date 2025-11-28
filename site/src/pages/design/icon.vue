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

    <h2>Overview</h2>
    <p>
      Icon, as an important element in UI design, significantly influences the overall style of a UI interface. TDesign
      offers a set of linear Icons designed for mid-backend scenarios, created with universally applicable standards
      that align with the overall style of the TDesign design system.
    </p>

    <h2>Principles</h2>
    <h3>Simplicity</h3>
    <p>
      When creating, ensure that parameters are simplified and try to eliminate decimal points as well as non-integer
      angles. When handling lines and outlines, remove redundant anchor points. During output, unnecessary decorations
      should be avoided to keep the icons clean.
    </p>
    <img src="./assets/icon/simplify-1.png" alt="" />

    <h3>Accuracy</h3>
    <p>
      Avoid using graphics with ambiguous meanings during design. When the same object has multiple graphical
      representations, choose the most widely recognized style and emphasize it when necessary. When outputting icons,
      also follow naming conventions—accurate text descriptions make it easier for others to find.
    </p>
    <img src="./assets/icon/accurate-1.png" alt="" />

    <h3>Moderation</h3>
    <p>
      Each icon, as an independent visual entity, should present a sense of moderation in terms of line density and
      graphic combination. When dealing with necessary high-density icons, the rhythm of the lines should still be
      considered to ensure comfort without feeling oppressive. A series of icons should follow the principle of
      moderation, keeping variations within a certain range.
    </p>
    <img src="./assets/icon/moderate-1.png" alt="" />

    <h2>Specification</h2>
    <h3>Grid Specification</h3>
    <p>
      The grid serves as the underlying framework for chart and icon drawing, forming the foundation for all attribute
      design. Key elements such as the length and weight of lines, and the size and proportion of icons, are all defined
      based on this structure. Icons are commonly output in four sizes: 16x16px, 20x20px, 24x24px, and 32x32px. These
      sizes ensure clear display on standard screens. TDesign has ultimately selected the 24x24px size as the unified
      grid size for icon creation. Icons are designed at this size and then scaled down proportionally to 16x16px after
      vector outlining for final delivery. This approach aims to maintain compatibility with the default sizing of
      components from version 1.0, avoiding the need for additional icon size adjustments.
    </p>
    <img src="./assets/icon/grid-1.png" alt="" />
    <hr />

    <p>
      Due to the pixel grid's nature, strokes with non-integer pixel values undergo anti-aliasing, producing
      semi-transparent gray pixels. This results in blurred edges and compromised visual clarity. Therefore, all strokes
      must be strictly aligned to the pixel grid during creation to maximize icon sharpness.
    </p>
    <img src="./assets/icon/grid-2.png" alt="" />

    <hr />
    <p>When centering symmetrical graphics, visual balance should not be compromised for strict grid alignment.</p>
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
      The canvas serves as the practical work area for icon design, controlling composition, limiting size, and
      adjusting spacing. In TDesign, the active canvas should be confined to the central 20x20px area of the grid. In
      specific cases, such as elongated icons or those with protruding corners, content extension is permitted to ensure
      a unified visual weight.
    </p>
    <img src="./assets/icon/canvas-1.png" alt="" />
    <hr />

    <p>
      Auxiliary lines help standardize icon dimensions and dictate the paths of lines. Icons should be drawn according
      to these guidelines as much as possible to maintain a unified visual weight across the entire set. We have
      standardized the paths for basic shapes—such as circles, squares, and diagonals—within the grid, forming a
      comprehensive auxiliary line system. During the design process, the appropriate guidelines should be selected
      based on the characteristics of the graphic to control its form.
    </p>
    <img src="./assets/icon/canvas-2.png" alt="" />
    <hr />

    <p>
      The choice of auxiliary lines should be guided by the form of the graphic. When necessary, elements may extend
      beyond these lines; never compromise the design solely to conform to the guidelines.
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
      When creating directional icons, it is advisable to extend a minimal visual element (in multiples of 0.25px) in
      the opposite direction of the pointer to balance the composition.
    </p>
    <img src="./assets/icon/canvas-4.png" alt="" />

    <h3>Line</h3>
    <p>
      To ensure universality, all icons in this system use a 2px stroke width,which is configurable on
      <t-link theme="primary" href="/icons" target="blank">🔗 TDesign Icons </t-link>
    </p>
    <img src="./assets/icon/line-1.png" alt="" />
    <img src="./assets/icon/line-2.png" alt="" style="margin-top: 16px" />

    <hr />

    <p>
      When determining the length of long lines, it is recommended to use multiples of 2. This simplifies the process of
      creating symmetrical layouts.
    </p>
    <img src="./assets/icon/line-3.png" alt="" />
    <hr />

    <p>
      As a general rule, line ends should have square (90-degree) caps. However, when depicting typographic graphics or
      those with three-dimensional perspective, they should align tangentially to the grid.
    </p>
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

    <h3>Corners</h3>
    <p>
      When treating corners, the rounding should be determined by the graphic's meaning. Appropriate rounding enhances
      the visual message, rather than defaulting to sharp angles.
    </p>
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

    <h3>Angle</h3>
    <p>
      If a line needs to be slanted, it is advisable to align it with the 45° guide or use a multiple of 15° within the
      grid. This ensures higher line clarity in low-resolution scenarios.
    </p>
    <img src="./assets/icon/angle-1.png" alt="" />
    <hr />

    <p>Consider not only the angles of the positive shapes but also those of the negative spaces.</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/angle-2-left.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/angle-2-right.png" />
      </div>
    </div>

    <h3>Breaks</h3>
    <p>
      Breaks, often used in composite icons, require case-by-case width analysis to balance visual weight. Max. width: ≤
      2px, in multiples of 0.5px.
    </p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/fracture-1-left.png" />
      </div>

      <div class="item">
        <img src="./assets/icon/fracture-1-right.png" />
      </div>
    </div>

    <h3>Stackable Universal Accessory</h3>
    <p>
      To accommodate diverse main graphics under unified standards, medium and small universal accessories are provided.
    </p>
    <img src="./assets/icon/variety-1.png" alt="" />
    <hr />
    <p>
      When using, it is necessary to select the appropriate size and determine the placement based on the specific form
      of the main graphic.
    </p>
    <img src="./assets/icon/variety-2.png" alt="" />

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
    <p>Arc line processing prioritizes using full circles where possible.</p>
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
        <link-1-icon style="margin-right: 8px" :size="20" />Visit TDesign Icons
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
