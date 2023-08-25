<template>
  <div ref="article" name="DOC" class="doc-motion">
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
      Static elements convey information, while motion graphics enhance the conveyance and perception of information
      above them, endowing them with additional functions. Although motion graphics are often overlooked in backend
      systems, good motion graphics can help users understand the interface, clarify logic, and improve efficiency. The
      construction of the TDesign motion graphics system reflects the values of inclusivity, diversity, evolution, and
      connectivity, meeting the high-efficiency usage demands of backend scenarios. Based on different elements,
      devices, and types of motion, a dynamic adaptable motion system has been developed that allows users to perceive a
      unified brand experience under different conditions.
    </p>
    <h2>Principle</h2>
    <p>
      The construction of the TDesign animation system continues the values of inclusiveness, diversity, evolution, and
      connectivity of TDesign, and extends them into three animation principles: 「understanding, focusing, empathy」.
    </p>
    <h3>Understanding</h3>
    <p>
      The first principle of animation is to assist users in understanding the content and completing operations. Abrupt
      flashes always leave people confused, so adding lifelike movements to elements in the interface can help avoid a
      sense of unnatural motion. By guiding the visual focus of users through motion trajectory, the animation can
      provide smooth and seamless transitions for otherwise static elements.
    </p>
    <h3>Focusing</h3>
    <p>
      Dynamic content is always more attention-grabbing than static content. Presenting important information in a
      dynamic way can not only naturally express the beginning and end trajectory of elements but also guide users'
      focus.
    </p>
    <h3>Empathy</h3>
    <p>
      Dynamic presentation is more in line with human perception of life. The animation can smoothly convey a narrative
      that connects static elements and even express emotions in the interface. Whether it's a jumping notification or
      an elegant dropdown, elements can establish empathy with users, bridging the gap and achieving a more immersive,
      natural, and consistent understanding of the virtual world.
    </p>
    <br />
    <p>
      The ultimate goal of this is to return to the original design concept of "enhancing perception" and the design of
      propulsion beyond static elements.
    </p>
    <h3>Measuring the significance of motion effects</h3>
    <p>
      Adding motion effects to the middle-end and back-end systems is not a must. Appropriate motion effects can enhance
      user perception, while excessive motion effects can cause burden and interference. We have established a
      <a href="#header-66">Motion Self-check Form</a>
      for self-check, enabling the interface to check whether the motion effects are reasonable and meet the rendering
      performance when adding motion effects.
    </p>
    <h2>Motion Mode</h2>
    <p>
      The motion modes of TDesign classify all moving elements into two types: micro and macro. Micro motion effects of
      elements and the macro motion of components are combined from point to surface to form a world of motion.
    </p>
    <h3>Definition</h3>
    <p>
      Micro content is often tiny interactions between components or elements themselves, generally icon or component
      internal motion effects, such as warning, like, delete, and other icon motion effects, or component motion effects
      such as checkbox selection, button click state, input box shaking, etc. They all enhance the expression of meaning
      through motion.
    </p>
    <p>
      Anything beyond this is classified as macro content. These are the movements at the component level and above. We
      classify macro-movements into three major motion modes: 「axis movement, container conversion, fade in and out」.
    </p>
    <h3>How to Choose Motion Mode</h3>
    <p>
      The selection of motion modes is determined by the spatial relationship of the elements or their connection with
      other elements.
    </p>
    <ul>
      <li><b>Axis movement</b></li>
      <li><b>Container conversion</b></li>
      <li><b>Fade-in and fade-out</b></li>
    </ul>
    <h3>Axis Movement</h3>
    <p>
      Axis movement is used to represent the transition of elements with spatial relation and to enhance the
      directionality and relationship between the start and end points in space. It includes three-axis displacement,
      scaling, and transparency.
    </p>
    <p>
      The direction of axis movement depends on the spatial relationship between the elements. First, it can be used as
      the motion of page switching. The X-axis is mostly used for tab switching with horizontal relation, the Y-axis is
      mostly used for tab switching with vertical relation, and the Z-axis is mostly used for switching with
      hierarchical relation. Secondly, it can also be used to enhance the implication of the spatial relationship
      between elements or between elements and the screen. The XY-axis movement is determined specifically based on the
      association, and the Z-axis movement is mostly used for pop-ups, bubble notifications, dialog boxes, etc.
    </p>

    <div class="axis-motion">
      <t-radio-group variant="default-filled" :value="axisValue" @change="changeAxis">
        <t-radio-button value="x">X-axis</t-radio-button>
        <t-radio-button value="y">Y-axis</t-radio-button>
        <t-radio-button value="z">Z-axis</t-radio-button>
      </t-radio-group>

      <div v-show="axisValue === 'x'" ref="axisX" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'x'" ref="axisXDark" class="axis-motion-stage dark"></div>

      <div v-show="axisValue === 'y'" ref="axisY" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'y'" ref="axisYDark" class="axis-motion-stage dark"></div>

      <div v-show="axisValue === 'z'" ref="axisZ" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'z'" ref="axisZDark" class="axis-motion-stage dark"></div>
    </div>

    <h3>Container Conversion</h3>
    <p>
      Container conversion is used to represent the transition of shared containers. By smoothly transitioning the
      shape, it enhances the continuity between elements before and after the transition.
    </p>

    <div ref="containerMotion" class="container-motion"></div>
    <div ref="containerMotionDark" class="container-motion dark"></div>

    <p>
      The shared containers in container conversion may not be completely similar before and after the transition, and
      may instead contain sub-elements or related content. In this case, depending on whether the original element has
      maintained its original shape and position, if it has changed, the new element can be created using the container
      conversion mode, while if it remains unchanged, please refer to the Axis Motion mode.
    </p>

    <div ref="containerMotionSample" class="container-motion"></div>
    <div ref="containerMotionSampleDark" class="container-motion dark"></div>

    <h3>Fade-in and Fade-out</h3>
    <p>
      Fade-in and fade-out is used to represent the transition of independent elements before and after movement,
      providing feedback on the continuity of operation and reducing any rigidity in viewing. This distinguishes it from
      unrelated static elements.
    </p>

    <div ref="fadeMotion" class="fade-motion"></div>
    <div ref="fadeMotionDark" class="fade-motion dark"></div>

    <h2>Motion Time</h2>
    <p>
      To balance the perceptual differences under different viewing distances on different devices, TDesign, based on
      its inclusive values, recommends distinguishing two sets of durations on desktop and mobile devices to provide a
      consistent sensory experience.
    </p>
    <p>
      According to the visual range of desktop and mobile devices and keeping a unified perceptual constancy, the
      animation effect on mobile devices should be shortened compared to that on desktop devices. The closer the viewing
      distance, the stronger the perception of motion. Based on the duration of the human visual cycle of about 100ms
      and the characteristics of the mobile screen size, we can start to calculate from 100ms. Taking into account the
      impact of the viewing distance on desktop devices, the animation duration can be appropriately increased compared
      to mobile devices, starting from 200ms. Therefore, we can define the relationship between the peak duration on
      desktop and mobile devices:
    </p>

    <pre class="sport-code"><code>Desktop Client = Mobile Client × 2</code></pre>

    <h3>Fixed Duration</h3>
    <p>
      For desktop devices (laptops and desktops), a duration of 200-600ms is suitable for element movement. For mobile
      devices (mobile phones and tablets), a duration of 100-400ms is a better duration for element movement.
    </p>
    <p>
      Research and surveys have shown that an animation duration of 100ms is the beginning of basic cognitive
      recognition. A duration of less than 100ms is imperceptible to users, while a duration of 1000ms is the limit of
      user perception. We have divided the duration of motion into several intervals according to the cognitive
      processing. The intervals are divided in proportion, following the rules of natural movement, to increase the
      rhythm and resemble rhythm in music.
    </p>
    <p>We have set the basic duration 'token' for different element sizes and suitable motion perceptions.</p>
    <table class="motion-table">
      <thead>
        <th>Token</th>
        <th>Usage</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr>
          <td>@duration-mobile-base</td>
          <td>Micro conversion and fade-in-out</td>
          <td>100ms</td>
        </tr>
        <tr>
          <td>@duration-mobile-moderate</td>
          <td>Collapse、Popup、Message</td>
          <td>120ms</td>
        </tr>
        <tr>
          <td>@duration-mobile-slow</td>
          <td>Select、Dropdown、Drawer、Tabs、Popup</td>
          <td>140ms</td>
        </tr>
        <tr>
          <td>@duration-desktop-base</td>
          <td>Micro conversion and fade-in-out</td>
          <td>200ms</td>
        </tr>
        <tr>
          <td>@duration-desktop-moderate</td>
          <td>Anchor、Tabs、Dropdown、List click、Tree</td>
          <td>240ms</td>
        </tr>
        <tr>
          <td>@duration-desktop-slow</td>
          <td>Drawer、Message、Notification</td>
          <td>280ms</td>
        </tr>
      </tbody>
    </table>

    <h3>Dynamic Duration</h3>
    <p>
      The dynamic duration value is the most suitable motion perception for an element, and is calculated based on the
      size of the element and the distance of the motion. Therefore, we have set a duration calculator for element
      movement for different sizes of elements.
    </p>
    <div></div>

    <h2>Easing Curve</h2>
    <p>
      The basic easing functions of TDesign are all <code>Cubic</code>. Only <code>Elastic</code> easing curve is used
      for non-UI elements such as cartoon illustrations. <code>Linear</code> function is used for fast fading
      transitions in motion.
    </p>
    <table class="motion-table">
      <thead>
        <th>Token</th>
        <th>Usage</th>
        <th>CSS Value</th>
      </thead>
      <tbody>
        <tr>
          <td>@standard easing</td>
          <td>Element moving on the screen</td>
          <td>cubic-bezier(.38,0,.24,1)</td>
        </tr>
        <tr>
          <td>@ease out</td>
          <td>Element entering the screen</td>
          <td>cubic-bezier(0,0,.15,1)</td>
        </tr>
        <tr>
          <td>@ease in</td>
          <td>Element leaving the screen</td>
          <td>cubic-bezier(0.82,0,1,.9)</td>
        </tr>
        <tr>
          <td>@linear</td>
          <td>Gradients performed simultaneously with other movements</td>
          <td>N/A</td>
        </tr>
      </tbody>
    </table>

    <div class="slow-motion">
      <t-radio-group variant="default-filled" :value="slowValue" @change="changeSlow">
        <t-radio-button value="easing">standard easing</t-radio-button>
        <t-radio-button value="ease-out">ease out</t-radio-button>
        <t-radio-button value="ease-in">ease in</t-radio-button>
        <t-radio-button value="linear">linear</t-radio-button>
      </t-radio-group>

      <div v-show="slowValue === 'easing'" class="slow-motion-stage easing">
        <img class="preview" src="./assets/motion/easing.svg" />
        <div class="detail">
          <div class="ball"></div>
        </div>
      </div>
      <div v-show="slowValue === 'ease-out'" class="slow-motion-stage ease-out">
        <img class="preview" src="./assets/motion/ease-out.svg" />
        <div class="detail">
          <div class="ball"></div>
        </div>
      </div>
      <div v-show="slowValue === 'ease-in'" class="slow-motion-stage ease-in">
        <img class="preview" src="./assets/motion/ease-in.svg" />
        <div class="detail">
          <div class="ball"></div>
        </div>
      </div>
      <div v-show="slowValue === 'linear'" class="slow-motion-stage linear">
        <img class="preview" src="./assets/motion/linear.svg" />
        <div class="detail">
          <div class="ball"></div>
        </div>
      </div>
    </div>

    <h2>Integration of Brand Language</h2>
    <p>
      TDesign incorporates Tencent's forward-looking and futuristic driving features to express a sense of progress and
      speed in the motion effects. The motion dynamics of easing functions reflect the sense of speed, while the sense
      of progress is embodied in the brand's distinctive diagonal animation of the number 8. Designers have refined
      Tencent's characteristic diagonal 8-degree feature and applied it to animated feedback triggered by mouse clicks.
      Vividly incorporating brand perception without affecting the functionality of mid-to-backstage components, shaping
      an integrated brand experience.
    </p>
    <div class="motion-board">
      <t-button>Main Button</t-button>
      <t-select style="width: 240px" v-model="value" :options="options" placeholder="Please select" />
    </div>

    <h2>Motion Arrangement</h2>
    <p>
      The sequentiality of moving objects implies the organizational relationship between elements. A large number of
      animations taking place simultaneously can cause interference with information acquisition. Good arrangement can
      present the motion sequence of elements, expressing the order and logic of the interface.
    </p>

    <h3>Path Order</h3>
    <p>
      In container transitions, content is divided into continuity and non-continuity. The motion path of continuous
      content needs to reflect a smooth visual impression to conform to the characteristic of object motion in the
      natural world that needs to overcome gravity.
    </p>

    <h4>XY Bi-Axial Motion</h4>
    <p>
      Bi-Axial Motion Avoid using straight-line motion for bi-axial motion, but use curved motion instead. To overcome
      gravity, the y-axis change often starts with a gentle angle and ends with a steeper angle.
    </p>

    <h4>XY Single-Axial Motion</h4>
    <p>For non-cartoon single-axis motion, do not use elastic animation or increase motion axes.</p>

    <h4>Bi-Axial Combination Motion</h4>
    <p>
      When sorting nine-grid elements, the elements move to fill positions along a straight-line path with a hierarchy
      that satisfies a real sorting order. Do not use motion that exits and re-enters the screen.
    </p>

    <h3>Reduce Unnecessary Arrangements</h3>
    <p>
      During page loading, we provide a Skeleton component to indicate loading. Considering the characteristics of
      mid-to-backstage scenes, it is not recommended to use sequential animation to indicate the order of content on the
      first load of the page, but rather directly present the page or use fade-in and fade-out animation to reduce the
      duration of page loading and the distraction caused by excessive motion.
    </p>

    <h2>Motion Self-check</h2>
    <p>
      When adding animations to the interface, please refer to the following table to conduct a self-check on the
      necessity of the animation, ensuring that the animation is reasonable and necessary, and in line with TDesign
      values.
    </p>

    <table ref="tableCheck" class="table-check">
      <thead>
        <th></th>
        <th>What is the meaning of my animation for the interface?</th>
        <th></th>
      </thead>
      <tbody>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>What problem does it solve? Does it meet one or more goals?</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Does my animation help user to understand?</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Has it not caused an increase in system entropy?</td>
          <td></td>
        </tr>
      </tbody>
      <thead>
        <th></th>
        <th> Can my animation be clearly perceived?</th>
        <th></th>
      </thead>
      <tbody>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Is it one of the micro or macro categories?</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Does it meet the basic duration range of each end? Is it perceptible on all ends?</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Is it perceptible on all ends?</td>
        </tr>
      </tbody>
      <thead>
        <th></th>
        <th>Is animation elegant and simple?</th>
        <th></th>
      </thead>
      <tbody>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Has an appropriate easing curve been selected?</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Is animation simple?</td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>Is my animation excessively arrangement?</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td> Can necessary information still be conveyed statically if the animation is deleted?</td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <a ref="downloadBtn" href="" download="动效自查表.xls">
      <t-button class="download-btn" shape="circle" theme="default">
        <img width="16" src="./assets/motion/download.svg" slot="icon" />
      </t-button>
    </a>
  </div>
</template>

<script lang="jsx">
import lottie from 'lottie-web';
import anchorMixin from '../mixins/anchor';

import xAxis from './assets/motion/X_Axis.json';
import xAxisDark from './assets/motion/X_Axis_dark.json';
import yAxis from './assets/motion/Y_Axis.json';
import yAxisDark from './assets/motion/Y_Axis_dark.json';
import zAxis from './assets/motion/Z_Axis.json';
import zAxisDark from './assets/motion/Z_Axis_dark.json';
import containerTrans from './assets/motion/container_trans.json';
import containerTransDark from './assets/motion/container_trans_dark.json';
import containerTransSample from './assets/motion/container_trans_sample.json';
import containerTransSampleDark from './assets/motion/container_trans_sample_dark.json';
import fadeInOut from './assets/motion/fade_in_out.json';
import fadeInOutDark from './assets/motion/fade_in_out_dark.json';

const lottieProps = {
  renderer: 'svg',
  loop: true,
  autoplay: true,
};

export default {
  mixins: [anchorMixin],
  data() {
    return {
      axisValue: 'x',
      slowValue: 'easing',
      value: '',
      options: [
        { label: '架构云', value: '1' },
        { label: '大数据', value: '2' },
        { label: '区块链', value: '3' },
        { label: '物联网', value: '4', disabled: true },
        { label: '人工智能', value: '5' },
        // 可以使用渲染函数自定义下拉选项内容和样式
        {
          label: '计算场景',
          value: '6',
          // eslint-disable-next-line
          content: (h) => <span>计算场景（高性能计算）</span>,
        },
      ],
    };
  },

  mounted() {
    this.loadAxisMotion();
    this.loadContainerMotion();
    this.loadFadeMotion();
    this.initDownloadTable();
  },

  methods: {
    changeAxis(value) {
      this.axisValue = value;
    },
    loadAxisMotion() {
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisX,
        animationData: xAxis,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisXDark,
        animationData: xAxisDark,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisY,
        animationData: yAxis,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisYDark,
        animationData: yAxisDark,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisZ,
        animationData: zAxis,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisZDark,
        animationData: zAxisDark,
      });
    },
    loadContainerMotion() {
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotion,
        animationData: containerTrans,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotionDark,
        animationData: containerTransDark,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotionSample,
        animationData: containerTransSample,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotionSampleDark,
        animationData: containerTransSampleDark,
      });
    },
    loadFadeMotion() {
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.fadeMotion,
        animationData: fadeInOut,
      });
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.fadeMotionDark,
        animationData: fadeInOutDark,
      });
    },

    changeSlow(value) {
      this.slowValue = value;
    },

    initDownloadTable() {
      const tableContent = this.$refs.tableCheck.outerHTML;
      const html = `<html><head><meta charset='utf-8' /></head><body>${tableContent}</body></html>`;

      const blob = new Blob([html], {
        type: 'application/vnd.ms-excel',
      });

      this.$refs.downloadBtn.href = URL.createObjectURL(blob);
    },
  },
};
</script>
