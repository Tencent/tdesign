<template>
  <div ref="article" name="DOC" class="doc-fonts">
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
    <p>网页文字将与网页中的界面系统相结合，从而形成一个可供用户操作的产品系统，用户除了阅读，还需要完成一系列与界面系统产生的交互行为。因此，在网页设计中，文字系统是影响产品可用性的重要因素。</p>
    <p>TDesign 秉承包容、多元、进化和连接的价值观，这将指引文字系统制定「好用」、「好记」和「美观」的字体设计原则，希望字体是有规律和韵律、实现像素对齐、可以拉开清晰明确的层次关系、 具有和谐美观的大小对比效果。</p>

    <h2>字体样式</h2>
    <p>字体定义每个系统中所使用的字体，给到统一的字体规范，在 TDesign 当中，需要通过字体、字阶、行高、字重、字色、几个维度去制定文字系统。</p>

    <h3>字体</h3>
    <p>font-family 是用于某个元素的字体族名称或/及类族名称的一个优先表。如果浏览器不支持第一个字体，则会尝试优先表中的下一个。不同主流的操作系统及浏览器的默认字体不尽相同。从西文到中文，分别对个平台做一个基础的降级，这是针对系统字体规范 font-family 的基本思路。</p>
    <p>这里需要注意的是，不声明字体时，浏览器渲染的是「默认字体」，不一定是「系统字体」例如：Windows7 浏览器默认渲染的是中易宋体（SImsun），而非系统字体微软雅黑（Microsoft YaHei）。</p>

    <h4>中文 @font-family</h4>
    <pre><code>-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol</code></pre>

    <h4>其他文字 @font-family</h4>
    <pre><code>-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol</code></pre>

    <h4>数字字体</h4>
    <p>
      在展示表格数据时，应该使用等距的表格数字。表格数字相比普通字体的数字能实现更好的对齐，在获取数据时用户能更快速便捷的扫描和对比。表格数字可以说是特殊字体，使用腾讯云数字字体，可以满足在缩放中保持稳定可见的粗细。
      <a class="download-link" :href="fontDownloadUrl" target="_blank">TCloud Number</a>
    </p>
    <div class="fonts-block tcloud">
      <font>%*+,-./0123456789:</font>
    </div>

    <h3>字阶</h3>
    <p>字阶定义一级字阶和二级字阶，一级字阶常用于基础组件的设计中，二级字阶用于标题及特殊场景的应用。</p>
    <p>第一字阶，每个字号的增长的步数差距为 2px。桌面端中，Body 字号我们设置为 14px，Base 取 12px，桌面端的最小字号是 12px，而 10px 则作为移动端的 Base 字号，将桌面端与移动端字阶统一处理，让两端文字与设计系统更一致，更标准地调控。</p>
    <p>第二字阶，为了减少字阶区间里的步数，在这个范围中的文字，多为模块超大标题，展示型文案，以数字数据展示为主。通过 +4，+8，+12，+16 的步数增长规律，满足这个范围的字阶中，文字层级跨度大的展示诉求，也减少没有必要的小步数字号。</p>
    <div class="fonts-block font-steps">
      <div>
        <span class="step title">字阶</span>
        <span class="title">字号</span>
      </div>
      <template v-for="(item, i) in fontList">
        <div :key="i" v-if="item.type === 'divider'" class="divider"></div>
        <div v-else :key="i" :class="['font-' + item.fontSize]">
          <span class="step">{{ item.step }}</span>
          <span>{{ item.size }}</span>
          <span v-if="item.desc" class="desc">{{ item.desc }}</span>
        </div>
      </template>
    </div>

    <h3>行高</h3>
    <p>关于文字的行高，css 属性当中的 line-height，在国际无障碍网页使用标准中给出了明确的指引 line-height=font size*1.5</p>
    <p>在验证过程中发现，固定 1.5 倍的行高比例，在当字号越大的时候，行高就会越大，在大号文字的展示上信息的连贯明显得出现割裂，尤其在多种字号及元素混排的场景中。</p>
    <p>行高是为了让上一行的文字和下一行的文字之间有呼吸的空间，基于呼吸空间一致，让不同字号之间的间距都保持相同，通过逻辑得到这样一个公式：「 行高 = 字号 + n 」，8 作为变量正好同时满足与 1.5 倍的「 14px & 16px 」常用字号行高保持一致，总体文字间隙稳定呼吸，行高空间较一致得出计算公式：「line-height = font size+8」</p>
    <div class="fonts-block font-size">
      <div class="ctrl">
        <t-select
          v-model="fontSize"
          :bordered="false"
          style="width: 146px;"
          placeholder="-请选择-"
          :options="fontSelectList"
        />
        <t-slider v-model="fontSize" :min="10" :max="64" :step="2" :inputNumberProps="false" />
      </div>
      <p :class="['font-' + fontSize]">欢迎使用 TDesign</p>
      <div class="divider"></div>
      <p class="line-height">line-height: {{ Number(fontSize) + 8 }}px</p>
    </div>

    <pre><code>line-height = font size + n</code><br /><code>n = 8</code></pre>

    <h3>字重</h3>
    <p>字重是重要排版的变量，可以增强层次结构和重要内容区分。</p>
    <p>面对复杂的中后台场景，在 Windows 系统下 font-weight 如果使用小于 600 默认显示为常规体，而在macOS 系统中可以使用400、500、600区分，综合考虑复杂场景显示效果，TDesign 共提供两种字重配置效果。</p>
    <p>font-weight: 400 和 font-weight: 600。字重 400 等于 Windows 和 macOS 系统下的 Regular 显示效果，字重 600 等于 Windows 系统下的 Bold 显示效果和 macOS 系统下的 Semibold 显示效果。</p>
    <div class="fonts-block font-weight">
      <span class="weight-600">欢迎使用 TDesign (600)</span>
      <span>欢迎使用 TDesign (400)</span>
    </div>

    <h3>字体颜色</h3>
    <p>TDesign 文字和图标色彩系统采用透明度方向，期望更好的适配亮暗模式。让整个文字和图标色彩都更加具备包容性。</p>
    <p>根据字体样式的设计原则，制定了简易好记的透明度数值区间并且将该字色与界面系统的色彩系统结合，文字显示色彩对比满足至少1:4.5( AA级别）。且验证了其中的实用性，共分为亮暗两种模式，4 个色阶。</p>
    <p>注意：因为黑底白字的 Web AIM 值的曲线和白底黑字不同，加了透明度之后辨识度是比白底黑字高的，保证一致的通用文字阅读舒适性，暗色模式平衡了 AIM 值略微降低了透明度，确保 AIM 差值曲线是均衡的。</p>
    <p>不同的字体色彩有不同功能用法，具体可以参考 Design Token 示意查看</p>
    <div class="fonts-block-wrapper">
      <div class="fonts-block">
        <ul class="color-list">
          <li class="item" @click="copyColor(item.background)" v-for="item in fontColorListLeft" :key="item.text" :style="{background: item.background, color: item.color}">
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
      <div class="fonts-block black">
        <ul class="color-list">
          <li class="item" @click="copyColor(item.background)" v-for="item in fontColorListRight" :key="item.text" :style="{background: item.background, color: item.color}">
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor'

const fontDownloadUrl = 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/design-source/TCloudNumber.zip'

function genFontSize (num) {
  const result = []
  for (let i = 10; i <= num; i += 2) {
    result.push({ label: `${i}px`, value: i })
  }
  return result
}

export default {
  mixins: [anchorMixin],
  data () {
    return {
      dialogVisible: false,
      fontDownloadUrl,
      fontList: [
        { step: 'base', size: '10px 移动端最小', fontSize: 10, desc: '第一字阶' },
        { step: '+2', size: '12px 桌面端最小', fontSize: 12 },
        { step: '+2', size: '14px 正文', fontSize: 14 },
        { step: '+2', size: '16px TDesign', fontSize: 16 },
        { type: 'divider' },
        { step: '+4', size: '20px TDesign', fontSize: 20, desc: '第二字阶' },
        { step: '+4', size: '24px TDesign', fontSize: 24 },
        { step: '+4', size: '28px TDesign', fontSize: 28 },
        { step: '+8', size: '36px TDesign', fontSize: 36 },
        { step: '+12', size: '48px TDesign', fontSize: 48 },
        { step: '+16', size: '64px TDesign', fontSize: 64 }
      ],
      fontSize: 48,
      fontSelectList: genFontSize(64),
      fontColorListLeft: [
        { background: 'rgba(0, 0, 0, 0.9)', color: '#fff', text: 'Font Gy1', style: '#000000 90%' },
        { background: 'rgba(0, 0, 0, 0.6)', color: '#fff', text: 'Font Gy2', style: '#000000 60%' },
        { background: 'rgba(0, 0, 0, 0.4)', color: '#fff', text: 'Font Gy3', style: '#000000 40%' },
        { background: 'rgba(0, 0, 0, 0.26)', color: '#fff', text: 'Font Gy4', style: '#000000 26%' }
      ],
      fontColorListRight: [
        { background: 'rgba(255, 255, 255, 1)', color: 'rgba(0,0,0,.9)', text: 'Font Wh1', style: '#ffffff 100%' },
        { background: 'rgba(255, 255, 255, 0.55)', color: '#fff', text: 'Font Wh2', style: '#ffffff 55%' },
        { background: 'rgba(255, 255, 255, 0.35)', color: '#fff', text: 'Font Wh3', style: '#ffffff 35%' },
        { background: 'rgba(255, 255, 255, 0.22)', color: '#fff', text: 'Font Wh4', style: '#ffffff 22%' }
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

<style lang="less">
.download-link {
  color: var(--brand-main);
  text-decoration: underline;
  cursor: pointer;
}
</style>
