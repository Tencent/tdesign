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

    <h2>概述</h2>
    <p>
      静态元素传递信息，动效则在其之上增强信息的传递与感知，赋予更多的功能。动效在中后台系统中往往被忽视，但好的动效可以帮助用户理解界面、明确逻辑、提升效率。TDesign
      动效系统的搭建延续了 TDesign
      包容、多元、进化、连接的价值观，在满足中后台场景高效的使用需求下，根据不同元素、不同设备、不同类型的运动制定了动态适应的运动系统，用户可在不同条件下感知统一的品牌体验。
    </p>
    <h2>原则</h2>
    <p>
      TDesign 动效系统的搭建延续了 TDesign
      包容、多元、进化、连接的价值观，并将其延展为动效三个原则「理解、聚焦、共情」。
    </p>
    <h3>理解</h3>
    <p>
      动效第一原则是辅助用户理解内容，完成操作。生硬的闪现总是让人不明所以，元素将带有生命性的动作融入界面，不会产生反人类感知运动。运动的动线引导用户视觉焦点的转移，为原本生硬的元素转场补间。
    </p>
    <h3>聚焦</h3>
    <p>
      动态内容总是更容易比静态内容吸引用户注意力，将重点信息动态化呈现，既可以自然地表现元素运动始末轨迹，又可以引导用户注意焦点。
    </p>
    <h3>共情</h3>
    <p>
      动态的演绎更贴合人类对生命的感知，动效将静态元素连贯叙事演绎，还可以在界面上表达出情绪，不论是跳动的通知还是优雅的下拉，元素都可以与用户产生共情，拉近人与操作界面的距离，更有代入感，符合自然世界认知一致性。
    </p>
    <br />
    <p>这一切的目标回归到「增强感知」的设计原点。在静态元素之外的助推手。</p>
    <h3>衡量动效意义</h3>
    <p>
      中后台系统动效的添加不是全加，感知不是须知。适量的动效可以增强用户感知，过量的动效造成负担和干扰。我们建立了
      <a href="#header-66">动效自查表</a> 方便自查，在为界面添加动效时可供检查是否合理并符合渲染性能。
    </p>
    <h2>运动模式</h2>
    <p>
      TDesign
      动效的运动模式将一切会动的元素划分为微观与宏观两种。元素的微动效和组件宏观的运动由点及面地组成一个运动的世界。
    </p>
    <h3>定义</h3>
    <p>
      微观内容往往是组件或元素本身微小交互，一般是 icon 或组件内部的动效，如警告、点赞、删除等 icon 动效，或是 Checkbox
      勾选、按钮点击状态、输入框抖动等组件动效，他们都是通过运动加强含义的表达。
    </p>
    <p>
      在此之外都属于宏观内容。它是组件层面及以上的运动。我们将宏观运动归类为三大运动模式：「轴运动、容器转换、淡入淡出」。
    </p>
    <h3>如何选定运动模式</h3>
    <p>运动模式的选择由元素的空间关系或与其他元素的联系性决定。</p>
    <ul>
      <li><b>轴运动</b> 当有空间关系触发时</li>
      <li><b>容器转换</b> 有共享内容时</li>
      <li><b>淡入淡出</b> 前后无逻辑递进性，关联性不大。</li>
    </ul>
    <h3>轴运动</h3>
    <p>
      轴运动用来表现具有空间关系元素的过渡，用来增强元素在空间上的指向性以及起终点关联性。包含三个轴向上的位移、缩放、透明度。
    </p>
    <p>
      轴运动的方向取决于元素与元素间的空间关系。首先可以作为页面类切换的运动，X 轴多用于具有横向关系的 Tab 切换，Y
      轴多用于具有纵向关系的 Tab 切换，Z
      轴多用于具有上下层级关系的切换；其次还可用于增强元素与元素或元素与屏幕空间关系的暗示，XY
      轴向运动具体根据关联性决定，Z 轴运动多用于弹窗、气泡通知、对话框等。
    </p>

    <div class="axis-motion">
      <t-radio-group variant="default-filled" :value="axisValue" @change="changeAxis">
        <t-radio-button value="x">X轴</t-radio-button>
        <t-radio-button value="y">Y轴</t-radio-button>
        <t-radio-button value="z">Z轴</t-radio-button>
      </t-radio-group>

      <div v-show="axisValue === 'x'" ref="axisX" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'x'" ref="axisXDark" class="axis-motion-stage dark"></div>

      <div v-show="axisValue === 'y'" ref="axisY" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'y'" ref="axisYDark" class="axis-motion-stage dark"></div>

      <div v-show="axisValue === 'z'" ref="axisZ" class="axis-motion-stage"></div>
      <div v-show="axisValue === 'z'" ref="axisZDark" class="axis-motion-stage dark"></div>
    </div>

    <h3>容器转换</h3>
    <p>容器转换用来表现具有共用容器时的过渡，通过顺滑衔接的形变来增强元素过渡前后的关联性。</p>

    <div ref="containerMotion" class="container-motion"></div>
    <div ref="containerMotionDark" class="container-motion dark"></div>

    <p>
      容器转换的共用容器不一定过渡前后是完全形似的，可能出现过渡后为其子级或关系递进的内容，此时视原元素形变是否保持原状及位置关联，若演变为新元素使用容器转换模式，若保持原状原位请参考轴运动模式。
    </p>

    <div ref="containerMotionSample" class="container-motion"></div>
    <div ref="containerMotionSampleDark" class="container-motion dark"></div>

    <h3>淡入淡出</h3>
    <p>
      淡入淡出用来表现元素运动前后缺乏空间、容器关系时作为个体的过渡，通过渐变来提供操作后的关联性反馈，减少观看的生硬感，与无关联性的静态元素作区分。
    </p>

    <div ref="fadeMotion" class="fade-motion"></div>
    <div ref="fadeMotionDark" class="fade-motion dark"></div>

    <h2>运动时长</h2>
    <p>
      为了平衡不同设备观看距离下的感知差异，TDesign
      出于包容的价值观，建议在台式设备和移动设备上区分两套时长以提供一致的感官体验。
    </p>
    <p>
      根据桌面端和移动端的目视范围，保持统一的知觉恒常性，移动端对比桌面端动画效果需要缩短时效性，目视距离越近则运动感知越强。视力持续时间约为100ms，结合移动端的屏幕尺寸大小特性，从100ms开始计算。桌面端结合目视距离影响，对比移动端接近1倍数的差值，可适当增加动画时长效果，从200ms开始计算。由此可以定义桌面端的峰值时长与移动端峰值时长关系：
    </p>

    <pre class="sport-code"><code>桌面端（Laptop和Desktop）= 移动端（Mobile和Pad）× 2</code></pre>

    <h3>固定时值</h3>
    <p>
      针对桌面端（ Laptop 和 Desktop ）200～600ms 是合适的元素运动时长；针对移动端（ Mobile 和 Pad ）100～400ms
      是合适的元素运动时长。
    </p>
    <p>
      研究和调研表明，100ms的动画时长是基础认知的开始，低于100ms用户是无法感知运动实效性的，而1000ms则到达用户感知的极限。我们划定了几类观感的运动时长区间。划分的区间遵循等比例增加的规则，符合自然界运动的规律，增加节奏感，类似音乐的时值。
    </p>
    <p>对应不同元素尺寸与适合的运动观感，我们设定了最基本的动效时长 token 。</p>
    <table class="motion-table">
      <thead>
        <th>Token</th>
        <th>Usage</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr>
          <td>@duration-mobile-base</td>
          <td>微观变换和淡入淡出变化</td>
          <td>100ms</td>
        </tr>
        <tr>
          <td>@duration-mobile-moderate</td>
          <td>折叠面板、弹出框、消息</td>
          <td>120ms</td>
        </tr>
        <tr>
          <td>@duration-mobile-slow</td>
          <td>选择器、下拉菜单、抽屉、选项卡、弹出层</td>
          <td>140ms</td>
        </tr>
        <tr>
          <td>@duration-desktop-base</td>
          <td>微观变换和淡入淡出变化</td>
          <td>200ms</td>
        </tr>
        <tr>
          <td>@duration-desktop-moderate</td>
          <td>锚点、选项卡、下拉菜单、列表click、树</td>
          <td>240ms</td>
        </tr>
        <tr>
          <td>@duration-desktop-slow</td>
          <td>抽屉、消息通知、全局提示</td>
          <td>280ms</td>
        </tr>
      </tbody>
    </table>

    <h3>动态时值</h3>
    <p>
      只有针对元素尺寸及运动距离计算当前元素的时长，才是最适合该元素的运动观感。所以我们为不同尺寸的元素运动都设定了时长计算器。
    </p>
    <div></div>

    <h2>缓动曲线</h2>
    <p>
      TDesign 的基础缓动函数都为<code>Cubic</code>，仅卡通插图等非UI元素下使用
      <code>Elastic</code> 弹性缓动曲线。对于运动中含有的快速 fading 渐变使用 <code>Linear</code> 线性函数。
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
          <td>元素在画面内运动</td>
          <td>cubic-bezier(.38,0,.24,1)</td>
        </tr>
        <tr>
          <td>@ease out</td>
          <td>元素入画</td>
          <td>cubic-bezier(0,0,.15,1)</td>
        </tr>
        <tr>
          <td>@ease in</td>
          <td>元素出画</td>
          <td>cubic-bezier(0.82,0,1,.9)</td>
        </tr>
        <tr>
          <td>@linear</td>
          <td>与其他运动同时进行的渐变</td>
          <td>N/A</td>
        </tr>
      </tbody>
    </table>

    <div class="slow-motion">
      <t-radio-group variant="default-filled" :value="slowValue" @change="changeSlow">
        <t-radio-button value="easing">标准缓动</t-radio-button>
        <t-radio-button value="ease-out">缓出</t-radio-button>
        <t-radio-button value="ease-in">缓入</t-radio-button>
        <t-radio-button value="linear">线性</t-radio-button>
      </t-radio-group>

      <div v-show="slowValue === 'easing'" class="slow-motion-stage easing">
        <img class="preview" src="./assets/motion/easing.svg" />
        <div class="detail"><div class="ball"></div></div>
      </div>
      <div v-show="slowValue === 'ease-out'" class="slow-motion-stage ease-out">
        <img class="preview" src="./assets/motion/ease-out.svg" />
        <div class="detail"><div class="ball"></div></div>
      </div>
      <div v-show="slowValue === 'ease-in'" class="slow-motion-stage ease-in">
        <img class="preview" src="./assets/motion/ease-in.svg" />
        <div class="detail"><div class="ball"></div></div>
      </div>
      <div v-show="slowValue === 'linear'" class="slow-motion-stage linear">
        <img class="preview" src="./assets/motion/linear.svg" />
        <div class="detail"><div class="ball"></div></div>
      </div>
    </div>

    <h2>品牌语言的融入</h2>
    <p>
      TDesign
      置入腾讯的前瞻与科技感的驱动力特征，将前进感与速度感表达在动效中，缓动函数的运动态势体现了速度感，前进感由品牌特色的斜
      8 度动画体现。设计师提炼腾讯品牌的斜 8
      度特征，将其运用在鼠标点击触发时的动画反馈，在不影响中后台组件功能性的情况下，生动地带入品牌感知，塑造一体化的品牌体验。
    </p>
    <div class="motion-board">
      <t-button>主要按钮</t-button>
      <t-select style="width: 240px" v-model="value" :options="options" placeholder="请选择云解决方案" />
    </div>

    <h2>运动编排</h2>
    <p>
      运动物体的顺序性暗示了元素之间的组织关系，大量同时进行的动画会对信息获取产生干扰，良好的编排可以将元素的运动时序展现出来，表达界面的秩序与逻辑。
    </p>

    <h3>路径秩序化</h3>
    <p>
      如在容器转换中，内容分为延续性与非延续性。延续性内容的运动路径需要体现平稳的观感，使其符合自然世界物体运动需要克服重力的特征。
    </p>

    <h4>XY双轴变化运动</h4>
    <p>
      双轴变化运动请不要使用直线行进，而要使用曲线行进。为了克服重力，y轴变化往往以平缓的角度开始加速，以较陡的角度结束运动。
    </p>

    <h4>XY单轴变化运动</h4>
    <p>非卡通类单轴运动请不要使用elastic动画或增加运动轴向。</p>

    <h4>XY双轴组合运动</h4>
    <p>九宫格类元素排序时，元素以直线路径补位运动，且层次满足真实整理排列顺序感，不以出画再入画的方式运动</p>

    <h3>减少不必要的编排</h3>
    <p>
      在页面加载的过程中，我们提供骨架屏组件（开发中）来表示加载，我们处于中后台场景的特性，不建议在页面第一次载入时使用顺序动画来表示内容的顺序性，而是直接将页面呈现，或给予淡入淡出动画，以减少页面加载的时长和过多运动带来的注意力分散。
    </p>

    <h2>动效自查表</h2>
    <p>为界面添加动效时，请参考本表对动效必要性作出自查筛选，保证动效合理性与必要性，符合 TDesign 价值观。</p>

    <table ref="tableCheck" class="table-check">
      <thead>
        <th></th>
        <th>我的动效对于界面的意义是？</th>
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
          <td>动效解决了什么问题？是否符合一个或多个价值目标？</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>是否降低了用户理解成本？</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>是否未造成系统的熵增？</td>
          <td></td>
        </tr>
      </tbody>
      <thead>
        <th></th>
        <th>我的动效能够被明确感知吗？</th>
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
          <td>是否属于微观或宏观中的一类？</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>是否符合各端基本时长区间？</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>是否在各端上都可以被察觉？</td>
          <td class="desc">时长或曲线搭配我的元素尺寸若感知不明确，请加强</td>
        </tr>
      </tbody>
      <thead>
        <th></th>
        <th>我的动效优雅而平凡吗？</th>
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
          <td>是否选用了适当的缓动曲线？</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>我的动效平凡吗？</td>
          <td class="desc">B端场景如果出现过于吸睛的动效，请考虑削弱</td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>我的动效是否过度编排？</td>
          <td></td>
        </tr>
        <tr>
          <td>
            <label>
              <input type="checkbox" />
              <t-icon name="check-circle-filled" />
            </label>
          </td>
          <td>如果删除动效是否能静态地传递必要信息？</td>
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
import lottie from 'lottie-web'
import anchorMixin from '../mixins/anchor'

import xAxis from './assets/motion/X_Axis.json'
import xAxisDark from './assets/motion/X_Axis_dark.json'
import yAxis from './assets/motion/Y_Axis.json'
import yAxisDark from './assets/motion/Y_Axis_dark.json'
import zAxis from './assets/motion/Z_Axis.json'
import zAxisDark from './assets/motion/Z_Axis_dark.json'
import containerTrans from './assets/motion/container_trans.json'
import containerTransDark from './assets/motion/container_trans_dark.json'
import containerTransSample from './assets/motion/container_trans_sample.json'
import containerTransSampleDark from './assets/motion/container_trans_sample_dark.json'
import fadeInOut from './assets/motion/fade_in_out.json'
import fadeInOutDark from './assets/motion/fade_in_out_dark.json'

const lottieProps = {
  renderer: 'svg',
  loop: true,
  autoplay: true
}

export default {
  mixins: [anchorMixin],
  data () {
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
        }
      ]
    }
  },

  mounted () {
    this.loadAxisMotion()
    this.loadContainerMotion()
    this.loadFadeMotion()
    this.initDownloadTable()
  },

  methods: {
    changeAxis (value) {
      this.axisValue = value
    },
    loadAxisMotion () {
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisX,
        animationData: xAxis
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisXDark,
        animationData: xAxisDark
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisY,
        animationData: yAxis
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisYDark,
        animationData: yAxisDark
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisZ,
        animationData: zAxis
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.axisZDark,
        animationData: zAxisDark
      })
    },
    loadContainerMotion () {
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotion,
        animationData: containerTrans
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotionDark,
        animationData: containerTransDark
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotionSample,
        animationData: containerTransSample
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.containerMotionSampleDark,
        animationData: containerTransSampleDark
      })
    },
    loadFadeMotion () {
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.fadeMotion,
        animationData: fadeInOut
      })
      lottie.loadAnimation({
        ...lottieProps,
        container: this.$refs.fadeMotionDark,
        animationData: fadeInOutDark
      })
    },

    changeSlow (value) {
      this.slowValue = value
    },

    initDownloadTable () {
      const tableContent = this.$refs.tableCheck.outerHTML
      const html = `<html><head><meta charset='utf-8' /></head><body>${tableContent}</body></html>`

      const blob = new Blob([html], {
        type: 'application/vnd.ms-excel'
      })

      this.$refs.downloadBtn.href = URL.createObjectURL(blob)
    }
  }
}
</script>
