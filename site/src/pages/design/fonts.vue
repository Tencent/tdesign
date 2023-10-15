<template>
  <div ref="article" name="DOC" class="doc-fonts">
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
      Webpage text is integrated with the webpage's interface system, forming a product system that users can interact
      with in addition to reading. Therefore, in web design, the text system is an important factor that affects the
      usability of the product.
    </p>
    <p>
      TDesign adheres to the values of inclusiveness, diversity, evolution, and connection, which will guide the
      development of "easy-to-use", "easy-to-remember", and "beautiful" font design principles. The font should be
      regular and rhythmic, achieve pixel alignment, create clear hierarchical relationships, and have a harmonious and
      beautiful size contrast effect.
    </p>

    <h2>Font Style</h2>
    <p>
      Font definition specifies the font used in each system and provides a unified font specification. In TDesign, the
      text system needs to be established through font, font size, line height, font weight, font color, and other
      dimensions.
    </p>

    <h3>Font</h3>
    <p>
      Font-family is a priority table of font family names or/and class family names used for an element. If the browser
      does not support the first font, it will try the next font in the priority table. The default font for different
      mainstream operating systems and browsers is not the same. From English to Chinese, a basic degradation is done
      for each platform, which is the basic idea for system font specification with "font-family".
    </p>
    <p>
      It should be noted that when fonts are not declared, the browser renders the "default font," which is not
      necessarily the "system font." For example, Windows 7 browser defaults to render in Simsun, not the system font
      Microsoft YaHei.
    </p>

    <h4>Chinese @font-family</h4>
    <pre><code>-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol</code></pre>

    <h4>Other Text @font-family</h4>
    <pre><code>-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol</code></pre>

    <h4>Number Font</h4>
    <p>
      When displaying tabular data, it is recommended to use tabular figures. In comparison to standard numerals,
      tabular figures provide greater alignment, allowing users to quickly and efficiently scan and compare data.
      Tabular figures are a special typeface and using Tencent's digital font can ensure stability in maintaining the
      thickness and visibility during scaling.
      <a class="download-link" :href="fontDownloadUrl" target="_blank">TCloud Number</a>
    </p>
    <div class="fonts-block tcloud">
      <font>%*+,-./0123456789:</font>
    </div>

    <h3>Font Size</h3>
    <p>
      Font size hierarchy is divided into first and second levels. Primary font sizes are commonly used in basic
      component designs, while secondary font sizes are used for titles and special scenarios.
    </p>
    <p>
      For the first level font size, each increase in font size steps by 2px. For the desktop version, the body font
      size is set at 14px, while the base size is 12px. The minimum font size for desktops is 12px, while the base size
      for mobile devices is 10px, unifying font size hierarchy across different platforms to ensure consistency and
      standardization.
    </p>
    <p>
      For the secondary level font size, font size intervals are reduced to accommodate larger module titles,
      display text, and digital data. To meet the display needs of this font size range, font sizes increase at
      intervals of +4, +8, +12, and +16. This growth pattern ensures that font size hierarchy has larger steps that meet
      the display requirements of texts with significant differences in levels, and reduces unnecessary font size
      increments.
    </p>
    <div class="fonts-block font-steps">
      <div>
        <span class="step title">Font Size</span>
        <span class="title">Size</span>
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

    <h3>Line Height</h3>
    <p>
      Regarding line height of text, the CSS attribute "line-height" is specifically defined as "line-height = font size
      * 1.5" in the international web accessibility standard.
    </p>
    <p>
      In the verification process, it was found that a fixed line-height ratio of 1.5 caused the line height to increase
      as the font size increased. In the display of large fonts, the continuity of information appeared to be clearly
      fragmented, especially in scenarios involving multiple font sizes and mixed elements.
    </p>
    <p>
      Line height is intended to allow breathing space between the text of the previous and next lines. Based on
      consistent breathing space, the spacing between different font sizes is kept the same. Through logic, a formula is
      derived: "line height = font size + n". By setting the variable "n" to 8, it exactly matches the commonly used
      "14px & 16px" line height of 1.5 times. The overall text spacing maintains a stable breathing rhythm, and the line
      height is more consistent with the formula: "line-height = font size+8".
    </p>
    <div class="fonts-block font-size">
      <div class="ctrl">
        <t-select
          v-model="fontSize"
          :bordered="false"
          style="width: 146px"
          placeholder="-请选择-"
          :options="fontSelectList"
        />
        <t-slider v-model="fontSize" :min="10" :max="64" :step="2" :inputNumberProps="false" />
      </div>
      <p :class="['font-' + fontSize]">Welcome to use TDesign</p>
      <div class="divider"></div>
      <p class="line-height">line-height: {{ Number(fontSize) + 8 }}px</p>
    </div>

    <pre><code>line-height = font size + n</code><br /><code>n = 8</code></pre>

    <h3>Font Weight</h3>
    <p>
      Font weight is an important variable in typography that enhances the hierarchy structure and emphasizes important
      content, improving readability and visual aesthetics.
    </p>
    <p>
      In complex backend scenarios, font weight may default to regular weight if it's less than 600 on Windows systems,
      while macOS systems can distinguish between 400, 500, and 600 font weight. Considering the overall display effect
      in complex scenarios, TDesign provides two font weight configurations.
    </p>
    <p>
      font-weight: 400 and font-weight: 600. Font weight 400 is equivalent to the Regular effect in Windows and macOS
      system, while font weight 600 is similar to the Bold effect in Windows and the Semibold effect in macOS.
    </p>
    <div class="fonts-block font-weight">
      <span class="weight-600">Welcome to use TDesign (600)</span>
      <span>Welcome to use TDesign (400)</span>
    </div>

    <h3>Font Color</h3>
    <p>
      TDesign uses an opacity-based color system for its fonts and icons to better adapt to light and dark modes. This
      approach makes the entire color palette more inclusive.
    </p>
    <p>
      To meet the design principles of font styles, TDesign has established a simple and easily remembered opacity value
      range while considering the interactive interface and visual color system of the overall interface. The color
      contrast of the displayed text should satisfy the 1:4.5 AA grade, and the system is divided into four color grades
      for light and dark modes.
    </p>
    <p>
      Note that the Web AIM values for black background and white font curves differ from that of white background and
      black font. Adding opacity results in higher visibility for black background and white font. To ensure universal
      text readability and comfort, dark mode slightly reduces the AIM value and opacity to maintain a balanced AIM
      difference curve.
    </p>
    <p>
      Different font colors serve different functional purposes. For specific usage applications, refer to Design Token
      illustrations.
    </p>
    <div class="fonts-block-wrapper">
      <div class="fonts-block">
        <ul class="color-list">
          <li
            class="item"
            @click="copyColor(item.background)"
            v-for="item in fontColorListLeft"
            :key="item.text"
            :style="{ background: item.background, color: item.color }"
          >
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
      <div class="fonts-block black">
        <ul class="color-list">
          <li
            class="item"
            @click="copyColor(item.background)"
            v-for="item in fontColorListRight"
            :key="item.text"
            :style="{ background: item.background, color: item.color }"
          >
            <span>{{ item.text }}</span>
            <span>{{ item.style }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor';

const fontDownloadUrl = 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/design-source/TCloudNumber%20v1.010.zip';

function genFontSize(num) {
  const result = [];
  for (let i = 10; i <= num; i += 2) {
    result.push({ label: `${i}px`, value: i });
  }
  return result;
}

export default {
  mixins: [anchorMixin],
  data() {
    return {
      dialogVisible: false,
      fontDownloadUrl,
      fontList: [
        { step: 'base', size: '10px minimum in mobile', fontSize: 10, desc: 'first font size' },
        { step: '+2', size: '12px minimum in desktop', fontSize: 12 },
        { step: '+2', size: '14px content', fontSize: 14 },
        { step: '+2', size: '16px TDesign', fontSize: 16 },
        { type: 'divider' },
        { step: '+4', size: '20px TDesign', fontSize: 20, desc: 'second font size' },
        { step: '+4', size: '24px TDesign', fontSize: 24 },
        { step: '+4', size: '28px TDesign', fontSize: 28 },
        { step: '+8', size: '36px TDesign', fontSize: 36 },
        { step: '+12', size: '48px TDesign', fontSize: 48 },
        { step: '+16', size: '64px TDesign', fontSize: 64 },
      ],
      fontSize: 48,
      fontSelectList: genFontSize(64),
      fontColorListLeft: [
        { background: 'rgba(0, 0, 0, 0.9)', color: '#fff', text: 'Font Gy1', style: '#000000 90%' },
        { background: 'rgba(0, 0, 0, 0.6)', color: '#fff', text: 'Font Gy2', style: '#000000 60%' },
        { background: 'rgba(0, 0, 0, 0.4)', color: '#fff', text: 'Font Gy3', style: '#000000 40%' },
        { background: 'rgba(0, 0, 0, 0.26)', color: '#fff', text: 'Font Gy4', style: '#000000 26%' },
      ],
      fontColorListRight: [
        { background: 'rgba(255, 255, 255, 1)', color: 'rgba(0,0,0,.9)', text: 'Font Wh1', style: '#ffffff 100%' },
        { background: 'rgba(255, 255, 255, 0.55)', color: '#fff', text: 'Font Wh2', style: '#ffffff 55%' },
        { background: 'rgba(255, 255, 255, 0.35)', color: '#fff', text: 'Font Wh3', style: '#ffffff 35%' },
        { background: 'rgba(255, 255, 255, 0.22)', color: '#fff', text: 'Font Wh4', style: '#ffffff 22%' },
      ],
    };
  },

  methods: {
    copyColor(color) {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(color);
        this.$message.success('Copied');
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.textContent = color;
      textarea.style.width = 0;
      textarea.style.height = 0;
      document.body.appendChild(textarea);

      const selection = document.getSelection();
      const range = document.createRange();
      range.selectNode(textarea);
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy');
      selection.removeAllRanges();
      document.body.removeChild(textarea);

      this.$message.success('Copied');
    },
  },
};
</script>

<style lang="less">
.download-link {
  color: var(--brand-main);
  text-decoration: underline;
  cursor: pointer;
}
</style>
