type Rule = [RegExp, string];
export type RuleMap = Record<string, Rule>;

const MD_LINK_RULE: Rule = [/[，,。.]?\s*\[([^\]]+)\]\([^\)]+\)/g, ""];
const DANGLING_PUNCT_RULE: Rule = [/[，,]\s*[。.](?!\.)/g, "。"];
const ATTR_INLINE_STYLE_RULE: Rule = [/\s*:?style="([^"]*)"/g, ""];
const LINK_RULE: Rule = [/https?[^"]*/g, ""];
const SPACE_RULE: Rule = [/\s+/g, " "];
const SPACE_BETWEEN_TAG: Rule = [/\s*(<|>)\s*/g, "$1"];

const COMMON_RULE_MAP: RuleMap = {
  extraLine: [/^\s*\n\s*\n/gm, "\n"],
  blankHeadTail: [/^(\s*\n)+|(\s*\n)+$/g, ""]
};

export const API_RULE_MAP: RuleMap = {
  // 只提取 ## API 后面的段落
  base: [/^[\s\S]*?^## API\s*\n?/m, ""],
  mdLink: MD_LINK_RULE,
  danglingPunct: DANGLING_PUNCT_RULE,
  ...COMMON_RULE_MAP
};

export const DEMO_RULE_MAP: RuleMap = {
  meta: [/---\n([\s\S]*?)\n---/, ""],
  style: [/\s<style\b[^>]*>[\s\S]*?<\/style>/gi, ""],
  jsxInlineStyle: [/\s*style={{([^}]*)*}}/g, ""],
  attrInlineStyle: ATTR_INLINE_STYLE_RULE,
  selfClosingDiv: [/^\s*<div\s*(\/>|>\s*<\/div>)[\n]?/gm, ""],
  comment: [/<!--[\s\S]*?\n[\s\S]*?-->/g, ""],
  log: [/^\s*console\.log\([\s\S]*?\);\s*$/gm, ""],
  ...COMMON_RULE_MAP
};

export const MOBILE_DEMO_RULE_MAP: RuleMap = {
  styleImport: [/^\s*import\s+['"][^'"]*\.(less|css|scss|sass)['"]\s*;?\s*\n?/gm, ""],
  demoBlockImport: [/^\s*import\s+TDemoBlock\s+from\s+['"][^'"]*['"]\s*;?\s*\n?/gm, ""],
  demoBlockTag: [/\s*<\/?TDemoBlock[^>]*>\s*\n?/g, ""]
};

export const DOM_RULE_MAP: RuleMap = {
  outerDiv: [/^<div>\s*([\s\S]*?)\s*<\/div>$/gm, "$1"],
  emptyDiv: [/\n?\s*<div\s*\/>/g, ""],
  shadowRoot: [/#shadow-root \(open\)/g, ""],
  attrInlineStyle: ATTR_INLINE_STYLE_RULE,
  link: LINK_RULE,
  linkTag: [/<link\s[^>]*\/?>/g, ""],
  svgPathData: [/<path([^>]*)\sd="[^"]*"([^>]*)>/g, '<path$1 d=""$2>'],
  allNewLines: [/\n/g, ""],
  space: SPACE_RULE,
  spaceBetweenTag: [/\s*(<|>)\s*/g, "$1"]
};

export const MINIPROGRAM_DOM_RULE_MAP: RuleMap = {
  // 移除事件绑定属性：bind:tap="xxx"、catch:tap="xxx"、mut-bind:tap="xxx"、bind:collapsed-item-click="xxx"
  eventBinding: [/\s*(?:bind|catch|mut-bind|capture-bind|capture-catch):[\w-]+="[^"]*"/g, ""],
  attrInlineStyle: ATTR_INLINE_STYLE_RULE,
  // 移除无障碍相关属性：ariaRole、ariaLabel、ariaHidden、ariaDescribedby、ariaLabelledby 等
  ariaAttr: [/\s*aria[A-Za-z]*="[^"]*"/g, ""],
  // 移除 id 属性：id="xxx"
  idAttr: [/\s*id="[^"]*"/g, ""],
  // 移除值为空的属性：xxx=""
  emptyAttr: [/\s*[\w-]+=""/g, ""],
  allNewLines: [/\n/g, ""],
  link: LINK_RULE,
  space: SPACE_RULE,
  spaceBetweenTag: SPACE_BETWEEN_TAG
};
/**
 * UniApp DOM 清洗规则
 * 基于小程序 DOM 产物进行标签替换和属性清洗，生成接近 uniapp H5 的 DOM 结构
 */
export const UNIAPP_DOM_RULE_MAP: RuleMap = {
  // ---- 第一步：替换小程序标签为 HTML 标签 ----
  // wx-view → div（开标签和闭标签都替换）
  wxView: [/<(\/?)wx-view(?=[\s>])/g, "<$1div"],
  // wx-text → span
  wxText: [/<(\/?)wx-text(?=[\s>])/g, "<$1span"],
  // wx-label → label
  wxLabel: [/<(\/?)wx-label(?=[\s>])/g, "<$1label"],
  // wx-button → button
  wxButton: [/<(\/?)wx-button(?=[\s>])/g, "<$1button"],
  // wx-input → input
  wxInput: [/<(\/?)wx-input(?=[\s>])/g, "<$1input"],
  // wx-textarea → textarea
  wxTextarea: [/<(\/?)wx-textarea(?=[\s>])/g, "<$1textarea"],
  // wx-form → form
  wxForm: [/<(\/?)wx-form(?=[\s>])/g, "<$1form"],
  // wx-image → img
  wxImage: [/<(\/?)wx-image(?=[\s>])/g, "<$1img"],
  // wx-canvas → canvas
  wxCanvas: [/<(\/?)wx-canvas(?=[\s>])/g, "<$1canvas"],
  // wx-navigator → a
  wxNavigator: [/<(\/?)wx-navigator(?=[\s>])/g, "<$1a"],
  // wx-scroll-view → div
  wxScrollView: [/<(\/?)wx-scroll-view(?=[\s>])/g, "<$1div"],
  // wx-swiper-item → div（先替换 swiper-item，防止被 swiper 规则覆盖）
  wxSwiperItem: [/<(\/?)wx-swiper-item(?=[\s>])/g, "<$1div"],
  // wx-swiper → div
  wxSwiper: [/<(\/?)wx-swiper(?=[\s>])/g, "<$1div"],
  // wx-rich-text → div
  wxRichText: [/<(\/?)wx-rich-text(?=[\s>])/g, "<$1div"],
  // 其他 wx-* 标签兜底替换为 div
  wxFallback: [/<(\/?)wx-[\w-]+(?=[\s>])/g, "<$1div"],

  // ---- 第二步：移除小程序特有属性 ----
  // 移除 hover 相关属性：hoverClass、hoverStartTime、hoverStayTime、hoverStopPropagation
  hoverAttr: [/\s*hover(?:Class|StartTime|StayTime|StopPropagation)="[^"]*"/g, ""],
  // 移除微信小程序特有属性：sendMessage*、showMessageCard、needShowEntrance、openType、sessionFrom、appParameter
  wxSpecialAttr: [
    /\s*(?:sendMessage\w*|showMessageCard|needShowEntrance|openType|sessionFrom|appParameter)="[^"]*"/g,
    ""
  ],
  // 移除 data-* 属性（含模板语法）
  dataAttr: [/\s*data-[\w-]+="[^"]*"/g, ""],
  // 移除 tClass 及其所有变体属性（tClassLoad、tClassText、tClassImage、tClassContent 等外部样式类传递）
  tClassAttr: [/\s*tClass\w*="[^"]*"/g, ""],
  // 移除 wx-image 相关属性：lazyLoad、mode、showMenuByLongpress、webp、src
  wxImageAttr: [/\s*(?:lazyLoad|mode|showMenuByLongpress|webp|src)="[^"]*"/g, ""],
  // 移除 wx-input/wx-textarea 相关属性
  wxInputAttr: [
    /\s*(?:placeholderClass|placeholderStyle|cursorSpacing|adjustPosition|confirmType|confirmHold|disableDefaultPadding|enhanced)="[^"]*"/g,
    ""
  ],
  // 移除 wx-scroll-view 相关属性
  wxScrollAttr: [
    /\s*(?:scrollTop|scrollLeft|scrollIntoView|scrollWithAnimation|scrollAnchoring|enablePassive|scrollX|scrollY|enableFlex|refresher\w*)="[^"]*"/g,
    ""
  ],
  // 移除 wx-swiper 相关属性
  wxSwiperAttr: [
    /\s*(?:current|autoplay|circular|vertical|interval|duration|easingFunction|displayMultipleItems|previousMargin|nextMargin|snapToEdge|indicatorDots|indicatorColor|indicatorActiveColor)="[^"]*"/g,
    ""
  ],
  // 移除 nodes 属性（wx-rich-text）
  wxNodesAttr: [/\s*nodes="[^"]*"/g, ""],
  // 移除 reportSubmit 属性（wx-form）
  wxFormAttr: [/\s*reportSubmit="[^"]*"/g, ""],
  // 移除 $gdc="xxx"、$wxs:change:xxx="xxx" 等 WXS 相关属性（含有值和无值两种格式）
  wxsAttr: [/\s*\$(?:gdc|wxs:[\w:]*)(?:="[^"]*")?/g, ""],
  // 移除 tabindex 属性
  tabindexAttr: [/\s*tabindex="[^"]*"/g, ""],

  // ---- 第三步（前置）：先移除换行符，确保后续 class 值清洗的 lookbehind 正则能正确匹配 ----
  preAllNewLines: [/\n/g, ""],

  // ---- 第三步：清洗 class 值中的小程序占位 class ----
  // 移除 class 值中独立的 "class" 和 "t-class" / "t-class-*" 占位词（支持开头、中间、末尾位置）
  classPlaceholder: [
    /(?<=class=")\s*\bclass\b\s*|\s+\bclass\b(?=\s|")|\s+\bt-class(?:-[\w-]+)?\b(?=\s|")|(?<=class=")\s*\bt-class(?:-[\w-]+)?\b\s*/g,
    ""
  ],
  // 清理 class 值中开头和结尾的多余空格
  classTrailingSpace: [/\s+(?=")/g, ""],
  classLeadingSpace: [/class="\s+/g, 'class="'],
  // 清理 class 值中多余的连续空格
  classInnerSpace: [/\s{2,}/g, " "],

  // ---- 第四步：复用 MINIPROGRAM_DOM_RULE_MAP 的通用清洗 ----
  eventBinding: MINIPROGRAM_DOM_RULE_MAP.eventBinding,
  attrInlineStyle: MINIPROGRAM_DOM_RULE_MAP.attrInlineStyle,
  ariaAttr: MINIPROGRAM_DOM_RULE_MAP.ariaAttr,
  idAttr: MINIPROGRAM_DOM_RULE_MAP.idAttr,
  emptyAttr: MINIPROGRAM_DOM_RULE_MAP.emptyAttr,
  allNewLines: MINIPROGRAM_DOM_RULE_MAP.allNewLines,
  link: MINIPROGRAM_DOM_RULE_MAP.link,
  space: MINIPROGRAM_DOM_RULE_MAP.space,
  spaceBetweenTag: MINIPROGRAM_DOM_RULE_MAP.spaceBetweenTag
};

export const CHANGELOG_RULE_MAP: RuleMap = {
  mdLink: MD_LINK_RULE,
  danglingPunct: DANGLING_PUNCT_RULE,
  user: [/(?<!`)\B@[\w-]+(?!`)/g, ""],
  emptyBrackets: [/\(\s*\)/g, ""]
};

export const cleanText = (text: string, cleaningRules: RuleMap) => {
  return Object.values(cleaningRules).reduce((acc, [regex, replacement]) => {
    return acc.replace(regex, replacement);
  }, text);
};

/**
 * 只保留 HTML 标签中的特定属性，移除其他所有属性
 * @param html HTML 字符串
 * @param attrs 要保留的属性名列表
 */
export const keepOnlyAttrs = (html: string, attrs: string[]) => {
  // 匹配开始标签：<tagName ...attrs>
  return html.replace(/<([a-zA-Z][\w-]*)((?:\s+[^>]*)?)\/?>/g, (match, tagName, attrsStr) => {
    if (!attrsStr || !attrsStr.trim()) {
      return match;
    }

    // Extract all attributes, supporting template syntax with nested quotes like:
    // class="{{ Array ["t-chat-actionbar","start", ] }}"
    // For double-quoted values: match {{ ... }} blocks (which may contain inner quotes) or non-quote chars
    const attrRegex = /\s+([\w:-]+)(?:="((?:\{\{[\s\S]*?\}\}|[^"])*)"|='([^']*)'|=([^\s>]+)|(?=\s|\/?>))/g;
    const keptAttrs: string[] = [];
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

      if (attrs.includes(attrName)) {
        keptAttrs.push(`${attrName}="${attrValue}"`);
      }
    }

    const isSelfClosing = match.endsWith("/>");
    const attrsOutput = keptAttrs.length > 0 ? " " + keptAttrs.join(" ") : "";
    return `<${tagName}${attrsOutput}${isSelfClosing ? "/>" : ">"}`;
  });
};
