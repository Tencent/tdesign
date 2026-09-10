/**
 * 递归序列化 DOM 结构，包含 Shadow DOM 内容
 * 用于在 happy-dom 等环境中获取 Web Components 的完整 DOM 结构
 */

export interface SerializeOptions {
  /**
   * 缩进字符
   * @default "  "
   */
  indent?: string;
  /**
   * 是否包含注释标记 shadow-root
   * @default true
   */
  includeShadowRootMarker?: boolean;
  /**
   * 忽略的属性列表
   * @default ["class", "style"]
   */
  ignoreAttributes?: string[];
  /**
   * 是否格式化输出
   * @default true
   */
  pretty?: boolean;
}

const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

const DEFAULT_IGNORE_ATTRIBUTES = ["class", "style"];

/**
 * 序列化元素的属性
 */
function serializeAttributes(element: Element, ignoreAttributes: string[]): string {
  const attrs = Array.from(element.attributes)
    .filter((attr) => !ignoreAttributes.includes(attr.name))
    .map((attr) => {
      // 处理布尔属性
      if (attr.value === "" || attr.value === attr.name) {
        return attr.name;
      }
      // 转义属性值中的特殊字符
      const escapedValue = attr.value.replace(/"/g, "&quot;");
      return `${attr.name}="${escapedValue}"`;
    });
  return attrs.length > 0 ? " " + attrs.join(" ") : "";
}

/**
 * 递归序列化 DOM 节点，包括 Shadow DOM
 */
function serializeNode(node: Node, depth: number, options: Required<SerializeOptions>): string {
  const { indent, includeShadowRootMarker, ignoreAttributes, pretty } = options;
  const indentStr = pretty ? indent.repeat(depth) : "";
  const newline = pretty ? "\n" : "";

  // 处理文本节点
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (!text) return "";
    return `${indentStr}${text}${newline}`;
  }

  // 处理注释节点
  if (node.nodeType === Node.COMMENT_NODE) {
    return `${indentStr}<!--${node.textContent}-->${newline}`;
  }

  // 只处理元素节点
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();
  const attrs = serializeAttributes(element, ignoreAttributes);

  // 自闭合标签
  if (SELF_CLOSING_TAGS.has(tagName) && !element.shadowRoot && element.childNodes.length === 0) {
    return `${indentStr}<${tagName}${attrs} />${newline}`;
  }

  let result = `${indentStr}<${tagName}${attrs}>${newline}`;

  // 处理 Shadow Root
  const shadowRoot = element.shadowRoot;
  if (shadowRoot) {
    if (includeShadowRootMarker) {
      result += `${indent.repeat(depth + 1)}#shadow-root (${shadowRoot.mode})${newline}`;
    }
    // 序列化 Shadow DOM 的子节点
    for (const child of shadowRoot.childNodes) {
      result += serializeNode(child, depth + 2, options);
    }
  }

  // 处理 Light DOM 子节点
  for (const child of element.childNodes) {
    result += serializeNode(child, depth + 1, options);
  }

  result += `${indentStr}</${tagName}>${newline}`;
  return result;
}

/**
 * Resolve user options with defaults
 */
function resolveDefaultOptions(
  options: SerializeOptions,
  overrides?: Partial<SerializeOptions>
): Required<SerializeOptions> {
  return {
    indent: options.indent ?? "  ",
    includeShadowRootMarker: options.includeShadowRootMarker ?? overrides?.includeShadowRootMarker ?? true,
    ignoreAttributes: options.ignoreAttributes ?? DEFAULT_IGNORE_ATTRIBUTES,
    pretty: options.pretty ?? true
  };
}

/**
 * 序列化 DOM 元素，包含 Shadow DOM 内容
 */
export function serializeWithShadowDom(element: Element, options: SerializeOptions = {}): string {
  return serializeNode(element, 0, resolveDefaultOptions(options)).trim();
}

/**
 * 仅序列化 Shadow DOM 的内部内容（不包括宿主元素）
 */
export function serializeShadowDomContent(element: Element, options: SerializeOptions = {}): string {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    return element.innerHTML;
  }

  const resolved = resolveDefaultOptions(options, { includeShadowRootMarker: false });

  let result = "";
  for (const child of shadowRoot.childNodes) {
    result += serializeNode(child, 0, resolved);
  }
  return result.trim();
}

/**
 * 获取第一个 Web Component 的 Shadow DOM 内容
 * 适用于测试场景，直接从 container 中找到第一个带 shadowRoot 的元素
 */
export function getFirstShadowContent(container: Element): string {
  // 递归查找第一个有 shadowRoot 的元素
  function findShadowHost(el: Element): Element | null {
    if (el.shadowRoot) return el;
    for (const child of el.children) {
      const found = findShadowHost(child);
      if (found) return found;
    }
    return null;
  }

  const shadowHost = findShadowHost(container);
  if (!shadowHost) {
    return container.innerHTML;
  }

  return serializeShadowDomContent(shadowHost);
}
