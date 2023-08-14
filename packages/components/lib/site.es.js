var main$1 = "";
function polyfill(global2) {
  global2 = Object.create(global2);
  if (!("HTMLElement" in global2)) {
    Object.defineProperty(global2, "HTMLElement", {
      value: class HTMLElement {
        constructor() {
          throw Error(
            "Current context does not support defining custom elements"
          );
        }
      }
    });
  }
  if (!("document" in global2)) {
    Object.defineProperty(global2, "document", {
      value: {
        importNode: () => {
          throw Error("Current context does not support importing nodes");
        }
      }
    });
  }
  return global2;
}
var global$1 = typeof window === "object" ? window : polyfill(globalThis);
const camelToDashMap = /* @__PURE__ */ new Map();
function camelToDash(str) {
  let result = camelToDashMap.get(str);
  if (result === void 0) {
    result = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    camelToDashMap.set(str, result);
  }
  return result;
}
function dispatch$1(host, eventType, options = {}) {
  return host.dispatchEvent(
    new global$1.CustomEvent(eventType, { bubbles: false, ...options })
  );
}
function stringifyElement(target) {
  return `<${String(target.tagName).toLowerCase()}>`;
}
function walkInShadow(target, cb) {
  if (target.nodeType === global$1.Node.ELEMENT_NODE) {
    cb(target);
    if (target.shadowRoot) {
      walkInShadow(target.shadowRoot, cb);
    }
  }
  const walker = global$1.document.createTreeWalker(
    target,
    global$1.NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  while (walker.nextNode()) {
    const el = walker.currentNode;
    cb(el);
    if (el.shadowRoot) {
      walkInShadow(el.shadowRoot, cb);
    }
  }
}
const deferred = Promise.resolve();
const storePointer = /* @__PURE__ */ new WeakMap();
const probablyDevMode = walkInShadow.name === "walkInShadow";
const queue = /* @__PURE__ */ new Set();
function add(fn2) {
  if (!queue.size)
    deferred.then(execute);
  queue.add(fn2);
}
function clear(fn2) {
  queue.delete(fn2);
}
function execute() {
  for (const fn2 of queue) {
    try {
      fn2();
    } catch (e) {
      console.error(e);
    }
  }
  queue.clear();
}
const entries = /* @__PURE__ */ new WeakMap();
const stack = /* @__PURE__ */ new Set();
function dispatch(entry) {
  const contexts = /* @__PURE__ */ new Set();
  const iterator = contexts.values();
  while (entry) {
    entry.resolved = false;
    if (entry.deps) {
      for (const depEntry of entry.deps) {
        depEntry.contexts.delete(entry);
      }
      entry.deps.clear();
    }
    if (entry.contexts) {
      for (const context2 of entry.contexts) {
        if (!stack.has(context2)) {
          contexts.add(context2);
          entry.contexts.delete(context2);
        }
      }
    }
    if (entry.observe) {
      add(entry.observe);
    }
    entry = iterator.next().value;
  }
}
function getEntry(target, key2) {
  let map = entries.get(target);
  if (!map) {
    map = /* @__PURE__ */ new Map();
    entries.set(target, map);
  }
  let entry = map.get(key2);
  if (!entry) {
    entry = {
      key: key2,
      target,
      value: void 0,
      lastValue: void 0,
      resolved: false,
      contexts: void 0,
      deps: void 0,
      observe: void 0
    };
    map.set(key2, entry);
  }
  return entry;
}
let context = null;
function get$1(target, key2, getter) {
  const entry = getEntry(target, key2);
  if (context) {
    if (!entry.contexts)
      entry.contexts = /* @__PURE__ */ new Set();
    if (!context.deps)
      context.deps = /* @__PURE__ */ new Set();
    entry.contexts.add(context);
    context.deps.add(entry);
  }
  if (entry.resolved)
    return entry.value;
  const lastContext = context;
  try {
    if (stack.has(entry)) {
      throw Error(`Circular get invocation is forbidden: '${key2}'`);
    }
    context = entry;
    stack.add(entry);
    entry.value = getter(target, entry.value);
    entry.resolved = true;
    context = lastContext;
    stack.delete(entry);
  } catch (e) {
    context = lastContext;
    stack.delete(entry);
    if (context) {
      context.deps.delete(entry);
      entry.contexts.delete(context);
    }
    throw e;
  }
  return entry.value;
}
function set$1(target, key2, setter, value2) {
  const entry = getEntry(target, key2);
  const newValue = setter(target, value2, entry.value);
  if (newValue !== entry.value) {
    entry.value = newValue;
    dispatch(entry);
  }
}
function observe(target, key2, getter, fn2) {
  const entry = getEntry(target, key2);
  entry.observe = () => {
    const value2 = get$1(target, key2, getter);
    if (value2 !== entry.lastValue) {
      fn2(target, value2, entry.lastValue);
      entry.lastValue = value2;
    }
  };
  add(entry.observe);
  return () => {
    clear(entry.observe);
    entry.observe = void 0;
    entry.lastValue = void 0;
  };
}
const gc = /* @__PURE__ */ new Set();
function deleteEntry(entry) {
  if (!gc.size) {
    setTimeout(() => {
      for (const e of gc) {
        if (!e.contexts || e.contexts.size === 0) {
          if (e.deps) {
            for (const depEntry of e.deps) {
              depEntry.contexts.delete(e);
            }
          }
          const targetMap = entries.get(e.target);
          targetMap.delete(e.key);
        }
      }
      gc.clear();
    });
  }
  gc.add(entry);
}
function invalidateEntry(entry, options) {
  dispatch(entry);
  if (options.clearValue) {
    entry.value = void 0;
    entry.lastValue = void 0;
  }
  if (options.deleteEntry) {
    deleteEntry(entry);
  }
}
function invalidate(target, key2, options = {}) {
  const entry = getEntry(target, key2);
  invalidateEntry(entry, options);
}
function invalidateAll(target, options = {}) {
  const targetMap = entries.get(target);
  if (targetMap) {
    for (const entry of targetMap.values()) {
      invalidateEntry(entry, options);
    }
  }
}
function render(fn2, useShadow) {
  return {
    get: useShadow ? (host) => {
      const updateDOM = fn2(host);
      const target = host.shadowRoot || host.attachShadow({
        mode: "open",
        delegatesFocus: fn2.delegatesFocus || false
      });
      return () => {
        updateDOM(host, target);
        return target;
      };
    } : (host) => {
      const updateDOM = fn2(host);
      return () => {
        updateDOM(host, host);
        return host;
      };
    },
    observe(host, flush) {
      flush();
    }
  };
}
function string(desc, attrName) {
  const defaultValue = desc.value;
  return {
    get: (host, value2) => value2 === void 0 ? host.getAttribute(attrName) || defaultValue : value2,
    set: (host, value2) => {
      value2 = String(value2);
      if (value2) {
        host.setAttribute(attrName, value2);
      } else {
        host.removeAttribute(attrName);
      }
      return value2;
    },
    connect: defaultValue !== "" ? (host, key2, invalidate2) => {
      if (!host.hasAttribute(attrName) && host[key2] === defaultValue) {
        host.setAttribute(attrName, defaultValue);
      }
      return desc.connect && desc.connect(host, key2, invalidate2);
    } : desc.connect,
    observe: desc.observe
  };
}
function number(desc, attrName) {
  const defaultValue = desc.value;
  return {
    get: (host, value2) => value2 === void 0 ? Number(host.getAttribute(attrName) || defaultValue) : value2,
    set: (host, value2) => {
      value2 = Number(value2);
      host.setAttribute(attrName, value2);
      return value2;
    },
    connect: (host, key2, invalidate2) => {
      if (!host.hasAttribute(attrName) && host[key2] === defaultValue) {
        host.setAttribute(attrName, defaultValue);
      }
      return desc.connect && desc.connect(host, key2, invalidate2);
    },
    observe: desc.observe
  };
}
function boolean(desc, attrName) {
  const defaultValue = desc.value;
  return {
    get: (host, value2) => value2 === void 0 ? host.hasAttribute(attrName) || defaultValue : value2,
    set: (host, value2) => {
      value2 = Boolean(value2);
      if (value2) {
        host.setAttribute(attrName, "");
      } else {
        host.removeAttribute(attrName);
      }
      return value2;
    },
    connect: defaultValue === true ? (host, key2, invalidate2) => {
      if (!host.hasAttribute(attrName) && host[key2] === defaultValue) {
        host.setAttribute(attrName, "");
      }
      return desc.connect && desc.connect(host, key2, invalidate2);
    } : desc.connect,
    observe: desc.observe
  };
}
function undef(desc, attrName) {
  const defaultValue = desc.value;
  return {
    get: (host, value2) => value2 === void 0 ? host.getAttribute(attrName) || defaultValue : value2,
    set: (host, value2) => value2,
    connect: desc.connect,
    observe: desc.observe
  };
}
function value(key2, desc) {
  const type = typeof desc.value;
  const attrName = camelToDash(key2);
  switch (type) {
    case "string":
      return string(desc, attrName);
    case "number":
      return number(desc, attrName);
    case "boolean":
      return boolean(desc, attrName);
    case "undefined":
      return undef(desc, attrName);
    default:
      throw TypeError(
        `Invalid default value for '${key2}' property - it must be a string, number, boolean or undefined: ${type}`
      );
  }
}
const disconnects = /* @__PURE__ */ new WeakMap();
function compile$1(hybrids, HybridsElement) {
  if (HybridsElement) {
    if (hybrids === HybridsElement.hybrids)
      return HybridsElement;
    for (const key2 of Object.keys(HybridsElement.hybrids)) {
      delete HybridsElement.prototype[key2];
    }
  } else {
    HybridsElement = class extends global$1.HTMLElement {
      connectedCallback() {
        for (const key2 of Object.keys(this)) {
          const value2 = this[key2];
          delete this[key2];
          this[key2] = value2;
        }
        const set2 = /* @__PURE__ */ new Set();
        disconnects.set(this, set2);
        add(() => {
          if (set2 === disconnects.get(this)) {
            for (const fn2 of this.constructor.connects)
              set2.add(fn2(this));
            for (const fn2 of this.constructor.observers)
              set2.add(fn2(this));
          }
        });
      }
      disconnectedCallback() {
        const callbacks2 = disconnects.get(this);
        for (const fn2 of callbacks2) {
          if (fn2)
            fn2();
        }
        disconnects.delete(this);
        invalidateAll(this);
      }
    };
  }
  HybridsElement.hybrids = hybrids;
  const connects = /* @__PURE__ */ new Set();
  const observers = /* @__PURE__ */ new Set();
  for (const key2 of Object.keys(hybrids)) {
    if (key2 === "tag")
      continue;
    let desc = hybrids[key2];
    const type = typeof desc;
    if (type === "function") {
      if (key2 === "render") {
        desc = render(desc, true);
      } else if (key2 === "content") {
        desc = render(desc);
      } else {
        desc = { get: desc };
      }
    } else if (type !== "object" || desc === null) {
      desc = { value: desc };
    } else if (desc.set) {
      if (hasOwnProperty.call(desc, "value")) {
        throw TypeError(
          `Invalid property descriptor for '${key2}' property - it must not have 'value' and 'set' properties at the same time.`
        );
      }
      const attrName = camelToDash(key2);
      const get2 = desc.get || ((host, value2) => value2);
      desc.get = (host, value2) => {
        if (value2 === void 0) {
          value2 = desc.set(host, host.getAttribute(attrName) || value2);
        }
        return get2(host, value2);
      };
    }
    if (hasOwnProperty.call(desc, "value")) {
      desc = value(key2, desc);
    } else if (!desc.get) {
      throw TypeError(
        `Invalid descriptor for '${key2}' property - it must contain 'value' or 'get' option`
      );
    }
    Object.defineProperty(HybridsElement.prototype, key2, {
      get: function get2() {
        return get$1(this, key2, desc.get);
      },
      set: desc.set && function set2(newValue) {
        set$1(this, key2, desc.set, newValue);
      },
      enumerable: true,
      configurable: true
    });
    if (desc.connect) {
      connects.add(
        (host) => desc.connect(host, key2, () => {
          invalidate(host, key2);
        })
      );
    }
    if (desc.observe) {
      observers.add((host) => observe(host, key2, desc.get, desc.observe));
    }
  }
  HybridsElement.connects = connects;
  HybridsElement.observers = observers;
  return HybridsElement;
}
const updateQueue = /* @__PURE__ */ new Map();
function update(HybridsElement) {
  if (!updateQueue.size) {
    deferred.then(() => {
      walkInShadow(global$1.document.body, (node) => {
        if (updateQueue.has(node.constructor)) {
          const prevHybrids = updateQueue.get(node.constructor);
          const hybrids = node.constructor.hybrids;
          node.disconnectedCallback();
          for (const key2 of Object.keys(hybrids)) {
            const type = typeof hybrids[key2];
            const clearValue = type !== "object" && type !== "function" && hybrids[key2] !== prevHybrids[key2];
            invalidate(node, key2, { clearValue });
          }
          node.connectedCallback();
        }
      });
      updateQueue.clear();
    });
  }
  updateQueue.set(HybridsElement, HybridsElement.hybrids);
}
function define$1(hybrids) {
  if (!hybrids.tag) {
    throw TypeError(
      "Error while defining hybrids: 'tag' property with dashed tag name is required"
    );
  }
  const HybridsElement = global$1.customElements.get(hybrids.tag);
  if (HybridsElement) {
    if (HybridsElement.hybrids) {
      update(HybridsElement);
      compile$1(hybrids, HybridsElement);
      return Object.freeze(hybrids);
    }
    throw TypeError(
      `Custom element with '${hybrids.tag}' tag name already defined outside of the hybrids context`
    );
  }
  global$1.customElements.define(hybrids.tag, compile$1(hybrids));
  return Object.freeze(hybrids);
}
function from(components, options = {}) {
  const { root = "", prefix } = options;
  const keys = Object.keys(components);
  if (keys.length === 0)
    return components;
  for (const key2 of keys) {
    const hybrids = components[key2];
    if (!hybrids.tag) {
      const tag = camelToDash(
        [].concat(root).reduce((acc, root2) => acc.replace(root2, ""), key2).replace(/^[./]+/, "").replace(/\//g, "-").replace(/\.[a-zA-Z]+$/, "")
      );
      hybrids.tag = prefix ? `${prefix}-${tag}` : tag;
    }
    define$1(hybrids);
  }
  return components;
}
var define$2 = Object.freeze(
  Object.assign(define$1, {
    compile: (hybrids) => compile$1(hybrids),
    from
  })
);
const metaMap = /* @__PURE__ */ new WeakMap();
function getMeta(key2) {
  let value2 = metaMap.get(key2);
  if (value2)
    return value2;
  metaMap.set(key2, value2 = {});
  return value2;
}
function getTemplateEnd(node) {
  let meta;
  while (node && (meta = getMeta(node)) && meta.endNode) {
    node = meta.endNode;
  }
  return node;
}
function removeTemplate(target) {
  const data = getMeta(target);
  if (data.styles)
    data.styles();
  if (target.nodeType === global$1.Node.TEXT_NODE) {
    if (data.startNode) {
      const endNode = getTemplateEnd(data.endNode);
      let node = data.startNode;
      const lastNextSibling = endNode.nextSibling;
      while (node) {
        const nextSibling = node.nextSibling;
        node.parentNode.removeChild(node);
        node = nextSibling !== lastNextSibling && nextSibling;
      }
    }
  } else {
    let child = target.childNodes[0];
    while (child) {
      target.removeChild(child);
      child = target.childNodes[0];
    }
  }
  metaMap.delete(target);
}
const TIMESTAMP = Date.now();
const getPlaceholder = (id = 0) => `H-${TIMESTAMP}-${id}`;
const hasAdoptedStylesheets = !!global$1.document.adoptedStyleSheets;
const NUMBER_REGEXP = /^\d+$/;
const rules = {
  block: (props, align) => ({
    display: "block",
    "text-align": align
  }),
  inline: ({ display }) => ({
    display: `inline${display ? `-${display}` : ""}`
  }),
  contents: { display: "contents" },
  hidden: { display: "none" },
  ...["row", "row-reverse", "column", "column-reverse"].reduce((acc, type) => {
    acc[type] = (props, wrap = "nowrap") => ({
      display: "flex",
      "flex-flow": `${type} ${wrap}`
    });
    return acc;
  }, {}),
  grow: (props, value2 = 1) => ({ "flex-grow": value2 }),
  shrink: (props, value2 = 1) => ({ "flex-shrink": value2 }),
  basis: (props, value2) => ({ "flex-basis": dimension(value2) }),
  order: (props, value2 = 0) => ({ order: value2 }),
  grid: (props, columns = "1", rows = "", autoFlow = "", dense = "") => ({
    display: "grid",
    ...["columns", "rows"].reduce((acc, type) => {
      const value2 = type === "columns" ? columns : rows;
      acc[`grid-template-${type}`] = value2 && value2.split("|").map(
        (v) => v.match(NUMBER_REGEXP) ? `repeat(${v}, minmax(0, 1fr))` : dimension(v)
      ).join(" ");
      return acc;
    }, {}),
    "grid-auto-flow": `${autoFlow} ${dense && "dense"}`
  }),
  area: (props, column = "", row = "") => ({
    "grid-column": column.match(NUMBER_REGEXP) ? `span ${column}` : column,
    "grid-row": row.match(NUMBER_REGEXP) ? `span ${row}` : row
  }),
  gap: (props, column = 1, row = "") => ({
    "column-gap": dimension(column),
    "row-gap": dimension(row || column)
  }),
  items: (props, v1 = "start", v2 = "") => ({
    "place-items": `${v1} ${v2}`
  }),
  content: (props, v1 = "start", v2 = "") => ({
    "place-content": `${v1} ${v2}`
  }),
  self: (props, v1 = "start", v2 = "") => ({
    "place-self": `${v1} ${v2}`
  }),
  center: { "place-items": "center", "place-content": "center" },
  size: (props, width, height = width) => ({
    width: dimension(width),
    height: dimension(height),
    "box-sizing": "border-box"
  }),
  width: (props, base, min2, max2) => ({
    width: dimension(base),
    "min-width": dimension(min2),
    "max-width": dimension(max2),
    "box-sizing": "border-box"
  }),
  height: (props, base, min2, max2) => ({
    height: dimension(base),
    "min-height": dimension(min2),
    "max-height": dimension(max2),
    "box-sizing": "border-box"
  }),
  ratio: (props, v1) => ({ "aspect-ratio": v1 }),
  overflow: (props, v1 = "hidden", v2 = "") => {
    const type = v2 ? `-${v1}` : "";
    const value2 = v2 ? v2 : v1;
    return {
      [`overflow${type}`]: value2,
      ...value2 === "scroll" ? {
        "flex-grow": props["flex-grow"] || 1,
        "flex-basis": 0,
        "overscroll-behavior": "contain",
        "--webkit-overflow-scrolling": "touch"
      } : {}
    };
  },
  margin: (props, v1 = "1", v2, v3, v4) => {
    if (v1.match(/top|bottom|left|right/)) {
      return {
        [`margin-${v1}`]: dimension(v2 || "1")
      };
    }
    return {
      margin: `${dimension(v1)} ${dimension(v2)} ${dimension(v3)} ${dimension(
        v4
      )}`
    };
  },
  padding: (props, v1 = "1", v2, v3, v4) => {
    if (v1.match(/top|bottom|left|right/)) {
      return {
        [`padding-${v1}`]: dimension(v2 || "1")
      };
    }
    return {
      padding: `${dimension(v1)} ${dimension(v2)} ${dimension(v3)} ${dimension(
        v4
      )}`
    };
  },
  absolute: { position: "absolute" },
  relative: { position: "relative" },
  fixed: { position: "fixed" },
  sticky: { position: "sticky" },
  static: { position: "static" },
  inset: (props, value2 = 0) => {
    const d = dimension(value2);
    return { top: d, right: d, bottom: d, left: d };
  },
  top: (props, value2 = 0) => ({ top: dimension(value2) }),
  bottom: (props, value2 = 0) => ({ bottom: dimension(value2) }),
  left: (props, value2 = 0) => ({ left: dimension(value2) }),
  right: (props, value2 = 0) => ({ right: dimension(value2) }),
  layer: (props, value2 = 1) => ({ "z-index": value2 })
};
const dimensions = {
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
  full: "100%"
};
const queries = {
  portrait: "orientation: portrait",
  landscape: "orientation: landscape"
};
function dimension(value2) {
  value2 = dimensions[value2] || value2;
  if (/^-?\d+(\.\d+)*$/.test(String(value2))) {
    return `${value2 * 8}px`;
  }
  return value2 || "";
}
let globalSheet;
function getCSSStyleSheet() {
  if (globalSheet)
    return globalSheet;
  if (hasAdoptedStylesheets) {
    globalSheet = new global$1.CSSStyleSheet();
  } else {
    const el = global$1.document.createElement("style");
    el.appendChild(global$1.document.createTextNode(""));
    global$1.document.head.appendChild(el);
    globalSheet = el.sheet;
  }
  globalSheet.insertRule(":host([hidden]) { display: none; }");
  return globalSheet;
}
const styleElements = /* @__PURE__ */ new WeakMap();
let injectedTargets = /* @__PURE__ */ new WeakSet();
function inject(target) {
  const root = target.getRootNode();
  if (injectedTargets.has(root))
    return;
  const sheet = getCSSStyleSheet();
  if (hasAdoptedStylesheets) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  } else {
    if (root === global$1.document)
      return;
    let el = styleElements.get(root);
    if (!el) {
      el = global$1.document.createElement("style");
      root.appendChild(el);
      styleElements.set(root, el);
    }
    let result = "";
    for (let i = 0; i < sheet.cssRules.length; i++) {
      result += sheet.cssRules[i].cssText;
    }
    el.textContent = result;
  }
  injectedTargets.add(root);
}
const classNames = /* @__PURE__ */ new Map();
function insertRule(node, query, tokens, hostMode) {
  let className = classNames.get(node);
  if (!className) {
    className = `l-${Math.random().toString(36).substr(2, 5)}`;
    classNames.set(node, className);
  }
  if (!hasAdoptedStylesheets)
    injectedTargets = /* @__PURE__ */ new WeakSet();
  const sheet = getCSSStyleSheet();
  const [selectors, mediaQueries = ""] = query.split("@");
  const cssRules = Object.entries(
    tokens.replace(/\s+/g, " ").trim().split(" ").reduce((acc, token) => {
      const [id, ...args] = token.split(":");
      const rule = rules[id];
      if (!rule) {
        throw TypeError(`Unsupported layout rule: '${id}'`);
      }
      return Object.assign(
        acc,
        typeof rule === "function" ? rule(acc, ...args.map((v) => v.match(/--.*/) ? `var(${v})` : v)) : rule
      );
    }, {})
  ).reduce(
    (acc, [key2, value2]) => value2 !== void 0 && value2 !== "" ? acc + `${key2}: ${value2};` : acc,
    ""
  );
  const mediaSelector = mediaQueries.split(":").reduce((acc, query2) => {
    if (query2 === "")
      return acc;
    return acc + ` and (${queries[query2] || `min-width: ${query2}`})`;
  }, "@media screen");
  if (hostMode) {
    const shadowSelector = `:host(.${className}-s${selectors})`;
    const contentSelector = `:where(.${className}-c${selectors})`;
    [shadowSelector, contentSelector].forEach((selector) => {
      sheet.insertRule(
        mediaQueries ? `${mediaSelector} { ${selector} { ${cssRules} } }` : `${selector} { ${cssRules} }`,
        sheet.cssRules.length
      );
    });
  } else {
    const selector = `.${className}${selectors}`;
    sheet.insertRule(
      mediaQueries ? `${mediaSelector} { ${selector} { ${cssRules} } }` : `${selector} { ${cssRules} }`,
      sheet.cssRules.length
    );
  }
  return className;
}
const arrayMap = /* @__PURE__ */ new WeakMap();
function movePlaceholder(target, previousSibling) {
  const meta = getMeta(target);
  const startNode = meta.startNode;
  const endNode = getTemplateEnd(meta.endNode);
  previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);
  let prevNode = target;
  let node = startNode;
  while (node) {
    const nextNode = node.nextSibling;
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    prevNode = node;
    node = nextNode !== endNode.nextSibling && nextNode;
  }
}
function resolveArray(host, target, value2, resolveValue2, useLayout) {
  let lastEntries = arrayMap.get(target);
  const entries2 = value2.map((item, index) => ({
    id: hasOwnProperty.call(item, "id") ? item.id : index,
    value: item,
    placeholder: null,
    available: true
  }));
  arrayMap.set(target, entries2);
  if (lastEntries) {
    const ids = /* @__PURE__ */ new Set();
    for (const entry of entries2) {
      ids.add(entry.id);
    }
    lastEntries = lastEntries.filter((entry) => {
      if (!ids.has(entry.id)) {
        removeTemplate(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
        return false;
      }
      return true;
    });
  }
  let previousSibling = target;
  const lastIndex = value2.length - 1;
  const meta = getMeta(target);
  for (let index = 0; index < entries2.length; index += 1) {
    const entry = entries2[index];
    let matchedEntry;
    if (lastEntries) {
      for (let i = 0; i < lastEntries.length; i += 1) {
        if (lastEntries[i].available && lastEntries[i].id === entry.id) {
          matchedEntry = lastEntries[i];
          break;
        }
      }
    }
    if (matchedEntry) {
      matchedEntry.available = false;
      entry.placeholder = matchedEntry.placeholder;
      if (entry.placeholder.previousSibling !== previousSibling) {
        movePlaceholder(entry.placeholder, previousSibling);
      }
      if (matchedEntry.value !== entry.value) {
        resolveValue2(
          host,
          entry.placeholder,
          entry.value,
          matchedEntry.value,
          useLayout
        );
      }
    } else {
      entry.placeholder = global$1.document.createTextNode("");
      previousSibling.parentNode.insertBefore(
        entry.placeholder,
        previousSibling.nextSibling
      );
      resolveValue2(host, entry.placeholder, entry.value, void 0, useLayout);
    }
    previousSibling = getTemplateEnd(
      getMeta(entry.placeholder).endNode || entry.placeholder
    );
    if (index === 0)
      meta.startNode = entry.placeholder;
    if (index === lastIndex)
      meta.endNode = previousSibling;
  }
  if (lastEntries) {
    for (const entry of lastEntries) {
      if (entry.available) {
        removeTemplate(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
      }
    }
  }
}
function resolveNode(host, target, value2) {
  removeTemplate(target);
  const meta = getMeta(target);
  meta.startNode = meta.endNode = value2;
  target.parentNode.insertBefore(value2, target.nextSibling);
}
function typeOf(value2) {
  const type = typeof value2;
  if (type === "object") {
    if (Array.isArray(value2))
      return "array";
    if (value2 instanceof global$1.Node)
      return "node";
  }
  return type;
}
function resolveValue$1(host, target, value2, lastValue, useLayout) {
  const type = typeOf(value2);
  const lastType = typeOf(lastValue);
  if (lastType !== "undefined" && type !== lastType) {
    if (type !== "function")
      removeTemplate(target);
    if (lastType === "array") {
      arrayMap.delete(target);
    } else if (lastType !== "node" && lastType !== "function") {
      target.textContent = "";
    }
  }
  switch (type) {
    case "array":
      resolveArray(host, target, value2, resolveValue$1, useLayout);
      break;
    case "node":
      resolveNode(host, target, value2);
      break;
    case "function":
      if (useLayout)
        value2.useLayout = true;
      value2(host, target);
      break;
    default:
      target.textContent = type === "number" || value2 ? value2 : "";
  }
}
const targets = /* @__PURE__ */ new WeakMap();
function resolveEventListener(eventType) {
  return (host, target, value2, lastValue) => {
    if (lastValue) {
      const eventMap = targets.get(target);
      if (eventMap) {
        target.removeEventListener(
          eventType,
          eventMap.get(lastValue),
          lastValue.options !== void 0 ? lastValue.options : false
        );
      }
    }
    if (value2) {
      if (typeof value2 !== "function") {
        throw Error(`Event listener must be a function: ${typeof value2}`);
      }
      let eventMap = targets.get(target);
      if (!eventMap) {
        eventMap = /* @__PURE__ */ new WeakMap();
        targets.set(target, eventMap);
      }
      const callback = value2.bind(null, host);
      eventMap.set(value2, callback);
      target.addEventListener(
        eventType,
        callback,
        value2.options !== void 0 ? value2.options : false
      );
    }
  };
}
function normalizeValue(value2, set2 = /* @__PURE__ */ new Set()) {
  if (Array.isArray(value2)) {
    for (const className of value2) {
      if (className)
        set2.add(className);
    }
  } else if (value2 !== null && typeof value2 === "object") {
    for (const [className, condition] of Object.entries(value2)) {
      if (className && condition)
        set2.add(className);
    }
  } else {
    if (value2)
      set2.add(value2);
  }
  return set2;
}
const classMap = /* @__PURE__ */ new WeakMap();
function resolveClassList(host, target, value2) {
  const previousList = classMap.get(target) || /* @__PURE__ */ new Set();
  const list = normalizeValue(value2);
  classMap.set(target, list);
  for (const className of list) {
    target.classList.add(className);
    previousList.delete(className);
  }
  for (const className of previousList) {
    target.classList.remove(className);
  }
}
const styleMap = /* @__PURE__ */ new WeakMap();
function resolveStyle(host, target, value2) {
  if (value2 === null || typeof value2 !== "object") {
    throw TypeError(
      `Style value must be an object in ${stringifyElement(target)}:`,
      value2
    );
  }
  const previousMap = styleMap.get(target) || /* @__PURE__ */ new Map();
  const nextMap = /* @__PURE__ */ new Map();
  for (const key2 of Object.keys(value2)) {
    const dashKey = camelToDash(key2);
    const styleValue = value2[key2];
    if (!styleValue && styleValue !== 0) {
      target.style.removeProperty(dashKey);
    } else {
      target.style.setProperty(dashKey, styleValue);
    }
    nextMap.set(dashKey, styleValue);
    previousMap.delete(dashKey);
  }
  for (const key2 of previousMap.keys()) {
    target.style[key2] = "";
  }
  styleMap.set(target, nextMap);
}
function resolveProperty(attrName, propertyName, isSVG) {
  if (propertyName.substr(0, 2) === "on") {
    const eventType = propertyName.substr(2);
    return resolveEventListener(eventType);
  }
  switch (attrName) {
    case "class":
      return resolveClassList;
    case "style":
      return resolveStyle;
    default: {
      let isProp = false;
      return (host, target, value2) => {
        isProp = isProp || !isSVG && !(target instanceof global$1.SVGElement) && propertyName in target;
        if (isProp) {
          target[propertyName] = value2;
        } else if (value2 === false || value2 === void 0 || value2 === null) {
          target.removeAttribute(attrName);
        } else {
          const attrValue = value2 === true ? "" : String(value2);
          target.setAttribute(attrName, attrValue);
        }
      };
    }
  }
}
const PLACEHOLDER_REGEXP_TEXT = getPlaceholder("(\\d+)");
const PLACEHOLDER_REGEXP_EQUAL = new RegExp(`^${PLACEHOLDER_REGEXP_TEXT}$`);
const PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, "g");
const PLACEHOLDER_REGEXP_ONLY = /^[^A-Za-z]+$/;
function createSignature(parts) {
  let signature = parts[0];
  let tableMode = false;
  for (let index = 1; index < parts.length; index += 1) {
    tableMode = tableMode || parts[index - 1].match(
      /<\s*(table|tr|thead|tbody|tfoot|colgroup)([^<>]|"[^"]*"|'[^']*')*>\s*$/
    );
    signature += (tableMode ? `<!--${getPlaceholder(index - 1)}-->` : getPlaceholder(index - 1)) + parts[index];
    tableMode = tableMode && !parts[index].match(/<\/\s*(table|tr|thead|tbody|tfoot|colgroup)\s*>/);
  }
  return signature;
}
function getPropertyName(string2) {
  return string2.replace(/\s*=\s*['"]*$/g, "").split(/\s+/).pop();
}
function createWalker(context2) {
  return global$1.document.createTreeWalker(
    context2,
    global$1.NodeFilter.SHOW_ELEMENT | global$1.NodeFilter.SHOW_TEXT | global$1.NodeFilter.SHOW_COMMENT,
    null,
    false
  );
}
function normalizeWhitespace(input, startIndent = 0) {
  input = input.replace(/(^[\n\s\t ]+)|([\n\s\t ]+$)+/g, "");
  let i = input.indexOf("\n");
  if (i > -1) {
    let indent = 0 - startIndent - 2;
    for (i += 1; input[i] === " " && i < input.length; i += 1) {
      indent += 1;
    }
    return input.replace(
      /\n +/g,
      (t) => t.substr(0, Math.max(t.length - indent, 1))
    );
  }
  return input;
}
function beautifyTemplateLog(input, index) {
  const placeholder = getPlaceholder(index);
  const output = normalizeWhitespace(input).split("\n").filter((i) => i).map((line) => {
    const startIndex = line.indexOf(placeholder);
    if (startIndex > -1) {
      return `| ${line}
--${"-".repeat(startIndex)}${"^".repeat(6)}`;
    }
    return `| ${line}`;
  }).join("\n").replace(PLACEHOLDER_REGEXP_ALL, "${...}");
  return `${output}`;
}
const styleSheetsMap = /* @__PURE__ */ new Map();
function setupStyleUpdater(target) {
  if (target.adoptedStyleSheets) {
    let prevStyleSheets;
    return (styleSheets) => {
      const adoptedStyleSheets = target.adoptedStyleSheets;
      if (styleSheets) {
        styleSheets = styleSheets.map((style2) => {
          let styleSheet = style2;
          if (!(styleSheet instanceof global$1.CSSStyleSheet)) {
            styleSheet = styleSheetsMap.get(style2);
            if (!styleSheet) {
              styleSheet = new global$1.CSSStyleSheet();
              styleSheet.replaceSync(style2);
              styleSheetsMap.set(style2, styleSheet);
            }
          }
          return styleSheet;
        });
        if (!prevStyleSheets || prevStyleSheets.some((styleSheet, i) => styleSheet !== styleSheets[i])) {
          target.adoptedStyleSheets = (prevStyleSheets ? adoptedStyleSheets.filter(
            (styleSheet) => !prevStyleSheets.includes(styleSheet)
          ) : adoptedStyleSheets).concat(styleSheets);
        }
      } else if (prevStyleSheets) {
        target.adoptedStyleSheets = adoptedStyleSheets.filter(
          (styleSheet) => !prevStyleSheets.includes(styleSheet)
        );
      }
      prevStyleSheets = styleSheets;
    };
  }
  let styleEl;
  return (styleSheets) => {
    if (styleSheets) {
      if (!styleEl) {
        styleEl = global$1.document.createElement("style");
        target = getTemplateEnd(target);
        if (target.nodeType === global$1.Node.TEXT_NODE) {
          target.parentNode.insertBefore(styleEl, target.nextSibling);
        } else {
          target.appendChild(styleEl);
        }
      }
      const result = [...styleSheets].join("\n/*------*/\n");
      if (styleEl.textContent !== result) {
        styleEl.textContent = result;
      }
    } else if (styleEl) {
      styleEl.parentNode.removeChild(styleEl);
      styleEl = null;
    }
  };
}
function compileTemplate(rawParts, isSVG, isMsg, useLayout) {
  let template = global$1.document.createElement("template");
  const parts = {};
  const signature = isMsg ? rawParts : createSignature(rawParts);
  template.innerHTML = isSVG ? `<svg>${signature}</svg>` : signature;
  if (isSVG) {
    const svgRoot = template.content.firstChild;
    template.content.removeChild(svgRoot);
    for (const node of Array.from(svgRoot.childNodes)) {
      template.content.appendChild(node);
    }
  }
  let hostLayout;
  const layoutTemplate = template.content.children[0];
  if (layoutTemplate instanceof global$1.HTMLTemplateElement) {
    for (const attr of Array.from(layoutTemplate.attributes)) {
      const value2 = attr.value.trim();
      if (attr.name.startsWith("layout") && value2) {
        if (value2.match(PLACEHOLDER_REGEXP_ALL)) {
          throw Error("Layout attribute cannot contain expressions");
        }
        hostLayout = insertRule(
          layoutTemplate,
          attr.name.substr(6),
          value2,
          true
        );
      }
    }
    if (hostLayout !== void 0 && template.content.children.length > 1) {
      throw Error(
        "Template, which uses layout system must have only the '<template>' root element"
      );
    }
    useLayout = true;
    template = layoutTemplate;
  }
  const compileWalker = createWalker(template.content);
  const notDefinedElements = [];
  let compileIndex = 0;
  let noTranslate = null;
  while (compileWalker.nextNode()) {
    let node = compileWalker.currentNode;
    if (noTranslate && !noTranslate.contains(node)) {
      noTranslate = null;
    }
    if (node.nodeType === global$1.Node.COMMENT_NODE) {
      if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
        node.parentNode.insertBefore(
          global$1.document.createTextNode(node.textContent),
          node.nextSibling
        );
        compileWalker.nextNode();
        node.parentNode.removeChild(node);
        node = compileWalker.currentNode;
      }
    }
    if (node.nodeType === global$1.Node.TEXT_NODE) {
      let text = node.textContent;
      const equal = text.match(PLACEHOLDER_REGEXP_EQUAL);
      if (equal) {
        node.textContent = "";
        parts[equal[1]] = [compileIndex, resolveValue$1];
      } else {
        if (isLocalizeEnabled() && !isMsg && !noTranslate && !text.match(/^\s*$/)) {
          let offset2;
          const key2 = text.trim();
          const localizedKey = key2.replace(/\s+/g, " ").replace(PLACEHOLDER_REGEXP_ALL, (_, index) => {
            index = Number(index);
            if (offset2 === void 0)
              offset2 = index;
            return `\${${index - offset2}}`;
          });
          if (!localizedKey.match(PLACEHOLDER_REGEXP_ONLY)) {
            let context2 = node.previousSibling && node.previousSibling.nodeType === global$1.Node.COMMENT_NODE ? node.previousSibling : "";
            if (context2) {
              context2.parentNode.removeChild(context2);
              compileIndex -= 1;
              context2 = (context2.textContent.split("|")[1] || "").trim().replace(/\s+/g, " ");
            }
            const resultKey = get(localizedKey, context2).replace(
              /\${(\d+)}/g,
              (_, index) => getPlaceholder(Number(index) + offset2)
            );
            text = text.replace(key2, resultKey);
            node.textContent = text;
          }
        }
        const results = text.match(PLACEHOLDER_REGEXP_ALL);
        if (results) {
          let currentNode = node;
          results.reduce(
            (acc, placeholder) => {
              const [before, next] = acc.pop().split(placeholder);
              if (before)
                acc.push(before);
              acc.push(placeholder);
              if (next)
                acc.push(next);
              return acc;
            },
            [text]
          ).forEach((part, index) => {
            if (index === 0) {
              currentNode.textContent = part;
            } else {
              currentNode = currentNode.parentNode.insertBefore(
                global$1.document.createTextNode(part),
                currentNode.nextSibling
              );
              compileWalker.currentNode = currentNode;
              compileIndex += 1;
            }
            const equal2 = currentNode.textContent.match(
              PLACEHOLDER_REGEXP_EQUAL
            );
            if (equal2) {
              currentNode.textContent = "";
              parts[equal2[1]] = [compileIndex, resolveValue$1];
            }
          });
        }
      }
    } else {
      if (node.nodeType === global$1.Node.ELEMENT_NODE) {
        if (!noTranslate && (node.getAttribute("translate") === "no" || node.tagName.toLowerCase() === "script" || node.tagName.toLowerCase() === "style")) {
          noTranslate = node;
        }
        if (probablyDevMode) {
          const tagName = node.tagName.toLowerCase();
          if (tagName.match(/.+-.+/) && !global$1.customElements.get(tagName) && !notDefinedElements.includes(tagName)) {
            notDefinedElements.push(tagName);
          }
        }
        for (const attr of Array.from(node.attributes)) {
          const value2 = attr.value.trim();
          const name = attr.name;
          if (useLayout && name.startsWith("layout") && value2) {
            if (value2.match(PLACEHOLDER_REGEXP_ALL)) {
              throw Error("Layout attribute cannot contain expressions");
            }
            const className = insertRule(node, name.substr(6), value2);
            node.removeAttribute(name);
            node.classList.add(className);
            continue;
          }
          const equal = value2.match(PLACEHOLDER_REGEXP_EQUAL);
          if (equal) {
            const propertyName = getPropertyName(rawParts[equal[1]]);
            parts[equal[1]] = [
              compileIndex,
              resolveProperty(name, propertyName, isSVG)
            ];
            node.removeAttribute(attr.name);
          } else {
            const results = value2.match(PLACEHOLDER_REGEXP_ALL);
            if (results) {
              const partialName = `attr__${name}`;
              for (const [index, placeholder] of results.entries()) {
                const [, id] = placeholder.match(PLACEHOLDER_REGEXP_EQUAL);
                let isProp = false;
                parts[id] = [
                  compileIndex,
                  (host, target, attrValue) => {
                    const meta = getMeta(target);
                    meta[partialName] = (meta[partialName] || value2).replace(
                      placeholder,
                      attrValue == null ? "" : attrValue
                    );
                    if (results.length === 1 || index + 1 === results.length) {
                      isProp = isProp || !isSVG && !(target instanceof global$1.SVGElement) && name in target;
                      if (isProp) {
                        target[name] = meta[partialName];
                      } else {
                        target.setAttribute(name, meta[partialName]);
                      }
                      meta[partialName] = void 0;
                    }
                  }
                ];
              }
              attr.value = "";
            }
          }
        }
      }
    }
    compileIndex += 1;
  }
  if (probablyDevMode && notDefinedElements.length) {
    console.warn(
      `Not defined ${notDefinedElements.map((e) => `<${e}>`).join(", ")} element${notDefinedElements.length > 1 ? "s" : ""} found in the template:
${beautifyTemplateLog(signature, -1)}`
    );
  }
  const partsKeys = Object.keys(parts);
  return function updateTemplateInstance(host, target, args, styles) {
    let meta = getMeta(target);
    if (template !== meta.template) {
      const fragment = global$1.document.importNode(template.content, true);
      const renderWalker = createWalker(fragment);
      const markers = [];
      let renderIndex = 0;
      let keyIndex = 0;
      let currentPart = parts[partsKeys[keyIndex]];
      while (renderWalker.nextNode()) {
        const node = renderWalker.currentNode;
        while (currentPart && currentPart[0] === renderIndex) {
          markers.push({
            index: partsKeys[keyIndex],
            node,
            fn: currentPart[1]
          });
          keyIndex += 1;
          currentPart = parts[partsKeys[keyIndex]];
        }
        renderIndex += 1;
      }
      if (meta.hostLayout) {
        host.classList.remove(meta.hostLayout);
      }
      removeTemplate(target);
      meta = getMeta(target);
      meta.template = template;
      meta.markers = markers;
      meta.styles = setupStyleUpdater(target);
      if (target.nodeType === global$1.Node.TEXT_NODE) {
        meta.startNode = fragment.childNodes[0];
        meta.endNode = fragment.childNodes[fragment.childNodes.length - 1];
        let previousChild = target;
        let child = fragment.childNodes[0];
        while (child) {
          target.parentNode.insertBefore(child, previousChild.nextSibling);
          previousChild = child;
          child = fragment.childNodes[0];
        }
      } else {
        if (useLayout) {
          const className = `${hostLayout}-${host === target ? "c" : "s"}`;
          host.classList.add(className);
          meta.hostLayout = className;
        }
        target.appendChild(fragment);
      }
      if (useLayout)
        inject(target);
    }
    meta.styles(styles);
    for (const marker of meta.markers) {
      const value2 = args[marker.index];
      const prevValue = meta.prevArgs && meta.prevArgs[marker.index];
      if (meta.prevArgs && value2 === prevValue)
        continue;
      try {
        marker.fn(host, marker.node, value2, prevValue, useLayout);
      } catch (error) {
        console.error(
          `Following error was thrown when updating a template expression in ${stringifyElement(
            host
          )}
${beautifyTemplateLog(signature, marker.index)}`
        );
        throw error;
      }
    }
    meta.prevArgs = args;
  };
}
function resolveValue({ target, detail }, setter) {
  let value2;
  switch (target.type) {
    case "radio":
    case "checkbox":
      value2 = target.checked && target.value;
      break;
    case "file":
      value2 = target.files;
      break;
    default:
      value2 = detail && hasOwnProperty.call(detail, "value") ? detail.value : target.value;
  }
  setter(value2);
}
function getPartialObject(name, value2) {
  return name.split(".").reverse().reduce((acc, key2) => {
    if (!acc)
      return { [key2]: value2 };
    return { [key2]: acc };
  }, null);
}
const stringCache = /* @__PURE__ */ new Map();
function set(property, valueOrPath) {
  if (!property) {
    throw Error(
      `The first argument must be a property name or an object instance: ${property}`
    );
  }
  if (typeof property === "object") {
    if (valueOrPath === void 0) {
      throw Error(
        "For model instance property the second argument must be defined"
      );
    }
    const store = storePointer.get(property);
    if (!store) {
      throw Error("Provided object must be a model instance of the store");
    }
    if (valueOrPath === null) {
      return () => {
        store.set(property, null);
      };
    }
    return (host, event) => {
      resolveValue(event, (value2) => {
        store.set(property, getPartialObject(valueOrPath, value2));
      });
    };
  }
  if (arguments.length === 2) {
    return (host) => {
      host[property] = valueOrPath;
    };
  }
  let fn2 = stringCache.get(property);
  if (!fn2) {
    fn2 = (host, event) => {
      resolveValue(event, (value2) => {
        host[property] = value2;
      });
    };
    stringCache.set(property, fn2);
  }
  return fn2;
}
const promiseMap = /* @__PURE__ */ new WeakMap();
function resolve(promise, placeholder, delay = 200) {
  return function fn2(host, target) {
    const useLayout = fn2.useLayout;
    let timeout;
    if (placeholder) {
      timeout = setTimeout(() => {
        timeout = void 0;
        resolveValue$1(host, target, placeholder, void 0, useLayout);
      }, delay);
    }
    promiseMap.set(target, promise);
    promise.then((value2) => {
      if (timeout)
        clearTimeout(timeout);
      if (promiseMap.get(target) === promise) {
        resolveValue$1(
          host,
          target,
          value2,
          placeholder && !timeout ? placeholder : void 0,
          useLayout
        );
        promiseMap.set(target, null);
      }
    });
  };
}
var helpers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  set,
  resolve
}, Symbol.toStringTag, { value: "Module" }));
const PLACEHOLDER = getPlaceholder();
const PLACEHOLDER_SVG = getPlaceholder("svg");
const PLACEHOLDER_MSG = getPlaceholder("msg");
const PLACEHOLDER_LAYOUT = getPlaceholder("layout");
const methods = {
  key(id) {
    this.id = id;
    return this;
  },
  style(...styles) {
    this.styleSheets = this.styleSheets || [];
    this.styleSheets.push(...styles);
    return this;
  },
  css(parts, ...args) {
    this.styleSheets = this.styleSheets || [];
    let result = parts[0];
    for (let index = 1; index < parts.length; index++) {
      result += (args[index - 1] !== void 0 ? args[index - 1] : "") + parts[index];
    }
    this.styleSheets.push(result);
    return this;
  }
};
const templates = /* @__PURE__ */ new Map();
function compile(parts, args, isSVG, isMsg) {
  function template(host, target = host) {
    let id = isMsg ? parts + PLACEHOLDER_MSG : parts.join(PLACEHOLDER);
    if (isSVG)
      id += PLACEHOLDER_SVG;
    const useLayout = template.useLayout;
    if (useLayout)
      id += PLACEHOLDER_LAYOUT;
    let render3 = templates.get(id);
    if (!render3) {
      render3 = compileTemplate(parts, isSVG, isMsg, useLayout);
      templates.set(id, render3);
    }
    render3(host, target, args, template.styleSheets);
  }
  return Object.assign(template, methods);
}
function html(parts, ...args) {
  return compile(parts, args, false, false);
}
Object.freeze(Object.assign(html, helpers));
const dictionary = /* @__PURE__ */ new Map();
const cache = /* @__PURE__ */ new Map();
let translate = null;
const languages = (() => {
  let list;
  try {
    list = global$1.navigator.languages || [global$1.navigator.language];
  } catch (e) {
    list = [];
  }
  return list.reduce((set2, code) => {
    const codeWithoutRegion = code.split("-")[0];
    set2.add(code);
    if (code !== codeWithoutRegion)
      set2.add(codeWithoutRegion);
    return set2;
  }, /* @__PURE__ */ new Set());
})();
function isLocalizeEnabled() {
  return translate !== null || dictionary.size;
}
const pluralRules = /* @__PURE__ */ new Map();
function get(key2, context2, args = []) {
  key2 = key2.trim().replace(/\s+/g, " ");
  context2 = context2.trim();
  const cacheKey = `${key2} | ${context2}`;
  let msg = cache.get(cacheKey);
  if (!msg) {
    if (dictionary.size) {
      for (const lang2 of languages) {
        const msgs = dictionary.get(lang2);
        if (msgs) {
          msg = msgs[cacheKey] || msgs[key2];
          if (msg) {
            msg = msg.message;
            if (typeof msg === "object") {
              let rules2 = pluralRules.get(lang2);
              if (!rules2) {
                rules2 = new Intl.PluralRules(lang2);
                pluralRules.set(lang2, rules2);
              }
              const pluralForms = msg;
              msg = (number2) => number2 === 0 && pluralForms.zero || pluralForms[rules2.select(number2)] || pluralForms.other || "";
            }
            break;
          }
        }
      }
    }
    if (!msg) {
      if (!msg) {
        msg = key2;
        if ((dictionary.size || translate) && probablyDevMode) {
          console.warn(
            `Missing translation: "${key2}"${context2 ? ` [${context2}]` : ""}`
          );
        }
      }
    }
    cache.set(cacheKey, msg);
  }
  return typeof msg === "function" ? msg(args[0]) : msg;
}
var style$t = ':host{position:relative;--header-inner-max-width: 100%;--header-inner-padding: 0 24px;--search-display: block}@media screen and (max-width: 1200px){:host{--search-display: none}}.TDesign-header-notice{width:100%;height:32px;padding:8px 24px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;position:relative}.TDesign-header-notice.primary{background-color:var(--brand-main)}.TDesign-header-notice__content{cursor:pointer;color:#ffffffe6;transition:all .2s}.TDesign-header-notice__content:hover{color:#fff}.TDesign-header-notice__close{display:inline-flex;align-items:center;position:absolute;right:24px;top:8px;cursor:pointer;transition:all .2s;color:#ffffffe6}.TDesign-header-notice__close:hover{color:#fff}.TDesign-header-notice__close svg{width:16px;height:16px}.TDesign-header{height:var(--header-height);background-color:var(--bg-color-container);color:var(--text-secondary);position:relative;z-index:1400;box-shadow:var(--header-box-shadow)}.TDesign-header-inner{padding:var(--header-inner-padding);height:100%;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;max-width:var(--header-inner-max-width);margin:auto;transition:all .25s var(--anim-time-fn-easing)}.TDesign-header-left{display:flex;align-items:center}.TDesign-header .slot-search{display:var(--search-display)}.TDesign-header-nav{display:flex;align-items:center;justify-content:flex-start;column-gap:8px}.TDesign-header-nav__link{cursor:pointer;padding:4px 16px;box-sizing:border-box;height:32px;line-height:24px;color:var(--text-primary);text-decoration:none;border-radius:var(--border-radius);transition:all .1s;display:inline-block;vertical-align:middle;word-break:keep-all;flex-shrink:0}.TDesign-header-nav__link:hover{background:var(--bg-color-container-hover)}.TDesign-header-nav__link:hover .icon svg path{d:path("M3.75 10.2002L7.99274 5.7998L12.2361 10.0425")}.TDesign-header-nav__link.active{color:var(--text-primary);background:var(--bg-color-container-select)}.TDesign-header-nav__link .icon{width:16px;height:16px;display:inline-block;vertical-align:middle;margin-top:-4px;margin-left:4px}.TDesign-header-nav__link .icon svg path{transition:d .2s;stroke:currentColor}.TDesign-header-nav__git,.TDesign-header-nav__translate{display:inline-flex;color:var(--text-primary);border-radius:var(--border-radius);transition:all .2s linear;width:32px;height:32px;align-items:center;justify-content:center;cursor:pointer}.TDesign-header-nav__git:hover,.TDesign-header-nav__translate:hover{background:var(--bg-color-container-hover)}.TDesign-header-nav__git-icon,.TDesign-header-nav__translate-icon{width:24px;height:24px;display:inline-block}.TDesign-header-nav td-theme-tabs{margin-left:8px}\n';
var portalStyle$3 = "@media screen and (max-width: 960px){:host .TDesign-base-components-link{display:none}}.TDesign-base-components-links{display:flex;flex-direction:column;padding:16px;width:832px;box-sizing:border-box;row-gap:16px}.TDesign-base-components-links__web,.TDesign-base-components-links__mobile{display:flex;flex-direction:column;row-gap:8px}.TDesign-base-components-links__list{display:flex;flex-wrap:wrap;gap:4px}.TDesign-base-components-links .title{color:var(--text-placeholder);margin:0 8px;font-size:14px;line-height:22px}.TDesign-base-components-links .link{border-radius:6px;transition:all .2s linear;color:var(--text-secondary);text-decoration:none;padding:8px;display:inline-flex;align-items:center;width:264px;box-sizing:border-box}.TDesign-base-components-links .link:not(.disabled):hover{color:var(--text-primary);background:var(--bg-color-container-hover)}.TDesign-base-components-links .link .details{display:flex;flex-direction:column}.TDesign-base-components-links .link .name{font-size:14px;line-height:24px;height:24px}.TDesign-base-components-links .link .version{font-size:14px;line-height:22px;color:var(--text-placeholder)}.TDesign-base-components-links .link .icon{max-width:40px;max-height:40px;margin-right:8px}.TDesign-base-components-links .link.active{color:var(--text-primary);background:var(--bg-color-container-select)}.TDesign-base-components-links .link.disabled{cursor:no-drop}.TDesign-base-components-links .link .disable-tag,.TDesign-base-components-links .link .alpha-tag,.TDesign-base-components-links .link .beta-tag,.TDesign-base-components-links .link .rc-tag,.TDesign-base-components-links .link .stable-tag{font-size:12px;border-radius:var(--border-radius);padding:2px 4px;margin-left:4px;vertical-align:bottom}.TDesign-base-components-links .link .disable-tag{color:var(--text-secondary);background:var(--bg-color-tag)}.TDesign-base-components-links .link .alpha-tag{color:var(--brand-main);background:var(--brand-main-light);font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}.TDesign-base-components-links .link .beta-tag,.TDesign-base-components-links .link .rc-tag{color:var(--success-main);background:var(--success-main-light);font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}.TDesign-base-components-links .link .stable-tag{color:#029cd4;background:rgba(2,156,212,.1);font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}\n";
var githubIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill-rule="evenodd" clip-rule="evenodd"\n    d="M12 2.23999C6.475 2.23999 2 6.71499 2 12.24C2 16.665 4.8625 20.4025 8.8375 21.7275C9.3375 21.815 9.525 21.515 9.525 21.2525C9.525 21.015 9.5125 20.2275 9.5125 19.39C7 19.8525 6.35 18.7775 6.15 18.215C6.0375 17.9275 5.55 17.04 5.125 16.8025C4.775 16.615 4.275 16.1525 5.1125 16.14C5.9 16.1275 6.4625 16.865 6.65 17.165C7.55 18.6775 8.9875 18.2525 9.5625 17.99C9.65 17.34 9.9125 16.9025 10.2 16.6525C7.975 16.4025 5.65 15.54 5.65 11.715C5.65 10.6275 6.0375 9.72749 6.675 9.02749C6.575 8.77749 6.225 7.75249 6.775 6.37749C6.775 6.37749 7.6125 6.11499 9.525 7.40249C10.325 7.17749 11.175 7.06499 12.025 7.06499C12.875 7.06499 13.725 7.17749 14.525 7.40249C16.4375 6.10249 17.275 6.37749 17.275 6.37749C17.825 7.75249 17.475 8.77749 17.375 9.02749C18.0125 9.72749 18.4 10.615 18.4 11.715C18.4 15.5525 16.0625 16.4025 13.8375 16.6525C14.2 16.965 14.5125 17.565 14.5125 18.5025C14.5125 19.84 14.5 20.915 14.5 21.2525C14.5 21.515 14.6875 21.8275 15.1875 21.7275C17.1727 21.0573 18.8977 19.7815 20.1198 18.0795C21.3419 16.3776 21.9995 14.3352 22 12.24C22 6.71499 17.525 2.23999 12 2.23999Z"\n    fill="currentColor" />\n</svg>';
var gitIcon = '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">\n    <g id="\u9875\u9762-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g id="\u7EC4\u4EF6\u4EE3\u7801\u4E00\u884C\u4E00\u4E2A3" transform="translate(-1358.000000, -93.000000)" fill="currentColor" fill-rule="nonzero">\n            <g id="\u7F16\u7EC4-3" transform="translate(1358.000000, 93.000000)">\n                <g id="logo.10e09b95" transform="translate(1.000000, 2.000000)">\n                    <path d="M4.26530612,1.61632653 L12.8902041,1.61632653 L12.8902041,0 L5.18122449,0 L4.26530612,1.61632653 Z M2.18877551,5.26428571 L19.7326531,5.26428571 L18.7965306,3.64795918 L3.10469388,3.64795918 L2.18877551,5.26428571 Z M19.7685714,14.564898 L2.11244898,14.564898 L3.04632653,16.1812245 L18.8526531,16.1812245 L19.7685714,14.564898 L19.7685714,14.564898 Z" id="\u5F62\u72B6"></path>\n                    <polygon id="\u8DEF\u5F84" points="16.6885714 0 14.0822449 0 14.0822449 1.61632653 17.6381633 1.61632653"></polygon>\n                    <polygon id="\u8DEF\u5F84" points="21.9034694 10.9304082 17.2183673 10.9304082 17.2183673 12.5467347 20.987551 12.5467347 21.9034694 10.9304082"></polygon>\n                    <polygon id="\u8DEF\u5F84" points="0.949591837 12.5467347 5.76938776 12.5467347 5.76938776 10.9304082 0 10.9304082"></polygon>\n                    <polygon id="\u8DEF\u5F84" points="7.07142857 10.9304082 16.0802041 10.9304082 16.0802041 12.5467347 7.07142857 12.5467347"></polygon>\n                    <polygon id="\u8DEF\u5F84" points="17.7032653 18.1836735 6.92102041 18.1836735 6.92102041 19.8 16.7873469 19.8"></polygon>\n                    <path d="M5.13183673,19.8 L5.7155102,19.8 L5.7155102,18.1836735 L4.1822449,18.1836735 L5.13183673,19.8 L5.13183673,19.8 Z M0.0853061224,8.9122449 L9.57897959,8.9122449 L9.57897959,7.29591837 L1.00122449,7.29591837 L0.0853061224,8.9122449 Z" id="\u5F62\u72B6"></path>\n                    <polygon id="\u8DEF\u5F84" points="20.8842857 7.29591837 10.8832653 7.29591837 10.8832653 8.9122449 21.8338776 8.9122449 20.8842857 7.29591837"></polygon>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>';
var fakeArrowIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M3.75 5.7998L7.99274 10.0425L12.2361 5.79921" stroke="currentColor" />\n</svg>\n';
var translateIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5C2 3.34315 3.34315 2 5 2H7C8.65685 2 10 3.34315 10 5V11H8V8.5H4V11H2V5ZM4 6.5H8V5C8 4.44772 7.55228 4 7 4H5C4.44772 4 4 4.44772 4 5V6.5ZM12 3.5H18C19.6569 3.5 21 4.84315 21 6.5V9H19V6.5C19 5.94772 18.5523 5.5 18 5.5H12V3.5ZM18 11.5V13H22V15H20.9381C20.7182 16.7638 19.9241 18.3492 18.7488 19.5634C19.4441 19.845 20.2041 20 21 20H22V22H21C19.5425 22 18.1765 21.6102 17.0001 20.9297C15.8234 21.6104 14.4572 22 13 22H12V20H13C13.7962 20 14.5562 19.8449 15.2514 19.5633C14.6487 18.9407 14.1463 18.2205 13.7704 17.4291L13.3413 16.5258L15.1478 15.6676L15.5769 16.5709C15.9219 17.2971 16.4081 17.9427 16.9999 18.4723C17.9921 17.5843 18.687 16.371 18.917 15H12V13H16V11.5H18ZM6 13V19C6 19.5523 6.44772 20 7 20H9.5V22H7C5.34315 22 4 20.6569 4 19V13H6Z" fill="currentColor"/>\n</svg>\n';
function patchShadowDomIntoDom(host) {
  if (!host)
    return;
  function patchNode() {
    requestAnimationFrame(() => {
      if (!host || !host.shadowRoot || host.patchDom)
        return;
      const slotElement = document.createElement("div");
      slotElement.setAttribute("slot", "__render_content__");
      slotElement.innerHTML = host.shadowRoot.innerHTML;
      host.appendChild(slotElement);
    });
  }
  window.addEventListener("load", patchNode);
  return () => window.removeEventListener("load", patchNode);
}
const mobileBodyStyle = {
  get: (host, lastValue) => lastValue || {},
  set: (host, value2) => value2,
  connect: (host, key2) => {
    const handleResize = () => {
      const mobileBodyStyle2 = {};
      if (host.platform === "mobile") {
        const isComponentPage = /\/components\//.test(location.pathname);
        const isMobileResponse = window.innerWidth < 960;
        if (isMobileResponse) {
          mobileBodyStyle2.paddingRight = "0px";
        } else {
          mobileBodyStyle2.paddingRight = isComponentPage ? "400px" : "";
        }
      }
      host.mobileBodyStyle = mobileBodyStyle2;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }
};
function isIntranet() {
  return location.host.includes("oa.com");
}
function watchHtmlMode(callback = () => {
}) {
  const targetNode = document.documentElement;
  const config = { attributes: true };
  const observerCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === "theme-mode") {
        const themeMode = mutation.target.getAttribute("theme-mode") || "light";
        if (themeMode)
          callback(themeMode);
      }
    }
  };
  const observer = new MutationObserver(observerCallback);
  observer.observe(targetNode, config);
  return observer;
}
function getLang() {
  const isEn = /-en$/.test(location.pathname);
  return isEn ? "en" : "zh";
}
var closeIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path\n    d="M16 17.8385L22.1518 23.9903L23.9903 22.1518L17.8385 16L23.9903 9.84817L22.1518 8.0097L16 14.1615L9.84812 8.00964L8.00964 9.84812L14.1615 16L8.00964 22.1518L9.84812 23.9903L16 17.8385Z"\n    fill="currentColor" />\n</svg>';
var vueIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0LjAxMzMgNS4wNjY0MUwxOS45ODMzIDEyLjA0NjVMMTUuOTUzNSA1LjA2NjQxSDIuNTMzMkwxOS45ODM1IDM1LjI5MTVMMzcuNDMzNyA1LjA2NjQxSDI0LjAxMzNaIiBmaWxsPSIjNDJCOTgzIi8+CjxwYXRoIGQ9Ik0yNC4wMTM3IDUuMDY2NDFMMTkuOTgzNyAxMi4wNDY1TDE1Ljk1MzggNS4wNjY0MUg5LjUxMzY3TDE5Ljk4MzggMjMuMjAxMUwzMC40NTM5IDUuMDY2NDFIMjQuMDEzN1oiIGZpbGw9IiMzNTQ5NUUiLz4KPC9zdmc+Cg==";
var reactIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yOC4xMTc1IDUuOTE4OTVDMjguNTIxIDYuMTUxOTIgMjguOTAxOCA2LjY1MjE3IDI5LjEwOTIgNy42MjE2QzI5LjMxNjUgOC41OTA4NyAyOS4zMTYgOS44OTcwNiAyOS4wNjIxIDExLjQ4MThDMjguOTgzMSAxMS45NzQ5IDI4Ljg4MDUgMTIuNDg4OCAyOC43NTQ4IDEzLjAyMDVDMjcuMzk1MSAxMi43Mjk1IDI1LjkzNCAxMi41MDUyIDI0LjQwMDUgMTIuMzU2OUMyMy41MDUzIDExLjEwMyAyMi41ODA1IDkuOTQ5ODcgMjEuNjQ4NyA4LjkxNzc4QzIyLjA0NjIgOC41NDMwNyAyMi40NCA4LjE5NzMzIDIyLjgyNzYgNy44ODIzM0MyNC4wNzMxIDYuODcwMDcgMjUuMjA0IDYuMjE2NTQgMjYuMTQ3MSA1LjkxMTQ1QzI3LjA5MDMgNS42MDYzMSAyNy43MTM5IDUuNjg1OTcgMjguMTE3NSA1LjkxODk1Wk0xOC4zMjcyIDguOTE3NzhDMTcuOTI5NyA4LjU0MzA3IDE3LjUzNTkgOC4xOTczNCAxNy4xNDgzIDcuODgyMzVDMTUuOTAyOSA2Ljg3MDA5IDE0Ljc3MTkgNi4yMTY1NiAxMy44Mjg4IDUuOTExNDdDMTIuODg1NiA1LjYwNjMzIDEyLjI2MiA1LjY4NTk5IDExLjg1ODUgNS45MTg5NkMxMS40NTQ5IDYuMTUxOTQgMTEuMDc0MSA2LjY1MjE5IDEwLjg2NjggNy42MjE2MkMxMC42NTk1IDguNTkwODggMTAuNjYgOS44OTcwOCAxMC45MTM4IDExLjQ4MThDMTAuOTkyOSAxMS45NzUgMTEuMDk1NCAxMi40ODg4IDExLjIyMTEgMTMuMDIwNUMxMi41ODA5IDEyLjcyOTUgMTQuMDQxOSAxMi41MDUyIDE1LjU3NTUgMTIuMzU2OUMxNi40NzA2IDExLjEwMyAxNy4zOTU0IDkuOTQ5ODcgMTguMzI3MiA4LjkxNzc4Wk0xOS45ODggNy4yMTM0NUMxOS41Mzk0IDYuNzg5MzggMTkuMDkyMiA2LjM5NjEyIDE4LjY0OSA2LjAzNTkxQzE3LjI3MTYgNC45MTY0MiAxNS44ODE2IDQuMDc0NzkgMTQuNTYxMiAzLjY0NzYyQzEzLjI0MDkgMy4yMjA1IDExLjg1ODUgMy4xNzE0OCAxMC42Njg4IDMuODU4MzdDOS40NzkwNSA0LjU0NTI2IDguODMwMjcgNS43NjcwMSA4LjU0MDAzIDcuMTIzOTVDOC4yNDk3NiA4LjQ4MTA2IDguMjgzNjUgMTAuMTA1NiA4LjU2NDQ0IDExLjg1ODJDOC42NTQ3OSAxMi40MjIyIDguNzcxOCAxMy4wMDYgOC45MTQ3NSAxMy42MDY1QzguMzIzMjIgMTMuNzgzIDcuNzU5MDggMTMuOTczNiA3LjIyNTU0IDE0LjE3NzNDNS41NjczMiAxNC44MTA0IDQuMTQzNDcgMTUuNTkzNCAzLjExMzMyIDE2LjUyMzNDMi4wODMyOSAxNy40NTMxIDEuMzQ5NjEgMTguNjI1OSAxLjM0OTYxIDE5Ljk5OTZDMS4zNDk2MSAyMS4zNzM0IDIuMDgzMjkgMjIuNTQ2MSAzLjExMzMyIDIzLjQ3NkM0LjE0MzQ3IDI0LjQwNTkgNS41NjczMiAyNS4xODg4IDcuMjI1NTQgMjUuODIyQzcuNzU5MDkgMjYuMDI1NyA4LjMyMzI0IDI2LjIxNjMgOC45MTQ3OCAyNi4zOTI3QzguNzcxODIgMjYuOTkzMyA4LjY1NDgxIDI3LjU3NzIgOC41NjQ0NSAyOC4xNDExQzguMjgzNjYgMjkuODkzNyA4LjI0OTc2IDMxLjUxODMgOC41NDAwNCAzMi44NzU0QzguODMwMjggMzQuMjMyMyA5LjQ3OTA1IDM1LjQ1NDEgMTAuNjY4OCAzNi4xNDFDMTEuODU4NSAzNi44Mjc5IDEzLjI0MSAzNi43Nzg4IDE0LjU2MTIgMzYuMzUxN0MxNS44ODE2IDM1LjkyNDYgMTcuMjcxNiAzNS4wODI5IDE4LjY0OSAzMy45NjM0QzE5LjA5MjIgMzMuNjAzMiAxOS41Mzk0IDMzLjIxIDE5Ljk4OCAzMi43ODU5QzIwLjQzNjUgMzMuMjEgMjAuODgzNyAzMy42MDMyIDIxLjMyNjkgMzMuOTYzNUMyMi43MDQzIDM1LjA4MjkgMjQuMDk0MyAzNS45MjQ2IDI1LjQxNDcgMzYuMzUxN0MyNi43MzUgMzYuNzc4OSAyOC4xMTc0IDM2LjgyNzkgMjkuMzA3MSAzNi4xNDFDMzAuNDk2OSAzNS40NTQxIDMxLjE0NTYgMzQuMjMyNCAzMS40MzU5IDMyLjg3NTRDMzEuNzI2MiAzMS41MTgzIDMxLjY5MjMgMjkuODkzNyAzMS40MTE1IDI4LjE0MTFDMzEuMzIxMSAyNy41NzcyIDMxLjIwNDEgMjYuOTkzMyAzMS4wNjExIDI2LjM5MjhDMzEuNjUyNyAyNi4yMTYzIDMyLjIxNjkgMjYuMDI1NyAzMi43NTA0IDI1LjgyMkMzNC40MDg3IDI1LjE4ODggMzUuODMyNSAyNC40MDU5IDM2Ljg2MjcgMjMuNDc2QzM3Ljg5MjcgMjIuNTQ2MSAzOC42MjY0IDIxLjM3MzQgMzguNjI2NCAxOS45OTk2QzM4LjYyNjQgMTguNjI1OSAzNy44OTI3IDE3LjQ1MzEgMzYuODYyNyAxNi41MjMzQzM1LjgzMjUgMTUuNTkzNCAzNC40MDg3IDE0LjgxMDQgMzIuNzUwNCAxNC4xNzczQzMyLjIxNjkgMTMuOTczNiAzMS42NTI3IDEzLjc4MyAzMS4wNjEyIDEzLjYwNjVDMzEuMjA0MSAxMy4wMDYgMzEuMzIxMSAxMi40MjIxIDMxLjQxMTUgMTEuODU4MkMzMS42OTIzIDEwLjEwNTYgMzEuNzI2MiA4LjQ4MTA0IDMxLjQzNTkgNy4xMjM5M0MzMS4xNDU3IDUuNzY2OTkgMzAuNDk2OSA0LjU0NTI0IDI5LjMwNzIgMy44NTgzNUMyOC4xMTc0IDMuMTcxNDcgMjYuNzM1IDMuMjIwNDkgMjUuNDE0NyAzLjY0NzZDMjQuMDk0MyA0LjA3NDc3IDIyLjcwNDMgNC45MTY0IDIxLjMyNjkgNi4wMzU4OUMyMC44ODM3IDYuMzk2MSAyMC40MzY1IDYuNzg5MzggMTkuOTg4IDcuMjEzNDVaTTI4LjEwMjcgMTUuMzE0NkMyNy40Njk1IDE1LjE4MjQgMjYuODA5NyAxNS4wNjQ5IDI2LjEyNjggMTQuOTYzN0MyNi4zNTA0IDE1LjMyNzcgMjYuNTcwOSAxNS42OTc5IDI2Ljc4NzkgMTYuMDczN0MyNy4wMDQ5IDE2LjQ0OTYgMjcuMjE1MiAxNi44MjU2IDI3LjQxODYgMTcuMjAxM0MyNy42NzI0IDE2LjU1OTIgMjcuOTAwNiAxNS45MjkxIDI4LjEwMjcgMTUuMzE0NlpNMjguODEzIDE5Ljk5OTdDMjkuNDUxNCAxOC41OTc0IDI5Ljk4NzYgMTcuMjIgMzAuNDE1NSAxNS44OTY5QzMwLjkzODggMTYuMDUzOCAzMS40MzUxIDE2LjIyMiAzMS45MDE3IDE2LjQwMDFDMzMuNDAxMSAxNi45NzI2IDM0LjUzMjYgMTcuNjI1MyAzNS4yNjgzIDE4LjI4OTVDMzYuMDA0MiAxOC45NTM4IDM2LjI0NyAxOS41MzM3IDM2LjI0NyAxOS45OTk2QzM2LjI0NyAyMC40NjU2IDM2LjAwNDIgMjEuMDQ1NSAzNS4yNjgzIDIxLjcwOThDMzQuNTMyNiAyMi4zNzQgMzMuNDAxMSAyMy4wMjY2IDMxLjkwMTcgMjMuNTk5MUMzMS40MzUxIDIzLjc3NzMgMzAuOTM4OCAyMy45NDU0IDMwLjQxNTUgMjQuMTAyNEMyOS45ODc2IDIyLjc3OTMgMjkuNDUxMyAyMS40MDE5IDI4LjgxMyAxOS45OTk3Wk0yNi4xODMgMTkuOTk5N0MyNS43NDMxIDE5LjA5NyAyNS4yNTc2IDE4LjE4MTkgMjQuNzI3MyAxNy4yNjM0QzI0LjE5NyAxNi4zNDQ5IDIzLjY0NzMgMTUuNDY2OSAyMy4wODU0IDE0LjYzNDZDMjIuMDgzNyAxNC41NjQxIDIxLjA0ODUgMTQuNTI3MSAxOS45ODggMTQuNTI3MUMxOC45Mjc0IDE0LjUyNzEgMTcuODkyMiAxNC41NjQxIDE2Ljg5MDUgMTQuNjM0NkMxNi4zMjg2IDE1LjQ2NjkgMTUuNzc4OSAxNi4zNDQ5IDE1LjI0ODYgMTcuMjYzNEMxNC43MTgzIDE4LjE4MTkgMTQuMjMyOCAxOS4wOTY5IDEzLjc5MjkgMTkuOTk5N0MxNC4yMzI4IDIwLjkwMjQgMTQuNzE4MyAyMS44MTc1IDE1LjI0ODYgMjIuNzM2QzE1Ljc3ODkgMjMuNjU0NCAxNi4zMjg2IDI0LjUzMjQgMTYuODkwNCAyNS4zNjQ3QzE3Ljg5MjEgMjUuNDM1MSAxOC45Mjc0IDI1LjQ3MjIgMTkuOTg4IDI1LjQ3MjJDMjEuMDQ4NSAyNS40NzIyIDIyLjA4MzggMjUuNDM1MSAyMy4wODU1IDI1LjM2NDdDMjMuNjQ3NCAyNC41MzI0IDI0LjE5NzEgMjMuNjU0NCAyNC43MjczIDIyLjczNTlDMjUuMjU3NiAyMS44MTc1IDI1Ljc0MzEgMjAuOTAyNCAyNi4xODMgMTkuOTk5N1pNMjYuMTI2OCAyNS4wMzU2QzI2LjM1MDQgMjQuNjcxNiAyNi41NzA5IDI0LjMwMTUgMjYuNzg3OSAyMy45MjU2QzI3LjAwNDkgMjMuNTQ5OCAyNy4yMTUyIDIzLjE3MzggMjcuNDE4NiAyMi43OTgxQzI3LjY3MjQgMjMuNDQwMSAyNy45MDA2IDI0LjA3MDIgMjguMTAyNyAyNC42ODQ3QzI3LjQ2OTUgMjQuODE2OSAyNi44MDk3IDI0LjkzNDMgMjYuMTI2OCAyNS4wMzU2Wk0yMS4yNzk4IDI3LjgzNEMyMC44NTI4IDI3Ljg0NTYgMjAuNDIyIDI3Ljg1MTUgMTkuOTg4IDI3Ljg1MTVDMTkuNTU0IDI3Ljg1MTUgMTkuMTIzMiAyNy44NDU2IDE4LjY5NjEgMjcuODM0QzE5LjEyNTIgMjguMzc0OCAxOS41NTY4IDI4Ljg4NzUgMTkuOTg4IDI5LjM2OThDMjAuNDE5MSAyOC44ODc1IDIwLjg1MDcgMjguMzc0OCAyMS4yNzk4IDI3LjgzNFpNMjEuNjQ4NyAzMS4wODE2QzIyLjU4MDUgMzAuMDQ5NSAyMy41MDUzIDI4Ljg5NjMgMjQuNDAwNSAyNy42NDI0QzI1LjkzNCAyNy40OTQxIDI3LjM5NTEgMjcuMjY5OCAyOC43NTQ4IDI2Ljk3ODhDMjguODgwNSAyNy41MTA1IDI4Ljk4MzEgMjguMDI0NCAyOS4wNjIxIDI4LjUxNzVDMjkuMzE2IDMwLjEwMjMgMjkuMzE2NSAzMS40MDg1IDI5LjEwOTEgMzIuMzc3N0MyOC45MDE4IDMzLjM0NzIgMjguNTIxIDMzLjg0NzQgMjguMTE3NSAzNC4wODA0QzI3LjcxMzkgMzQuMzEzNCAyNy4wOTAzIDM0LjM5MyAyNi4xNDcxIDM0LjA4NzlDMjUuMjA0IDMzLjc4MjggMjQuMDczMSAzMy4xMjkzIDIyLjgyNzYgMzIuMTE3QzIyLjQ0IDMxLjgwMiAyMi4wNDYyIDMxLjQ1NjMgMjEuNjQ4NyAzMS4wODE2Wk0xOC4zMjcyIDMxLjA4MTZDMTcuMzk1NCAzMC4wNDk1IDE2LjQ3MDYgMjguODk2MyAxNS41NzU0IDI3LjY0MjRDMTQuMDQxOSAyNy40OTQgMTIuNTgwOSAyNy4yNjk4IDExLjIyMTEgMjYuOTc4OEMxMS4wOTU0IDI3LjUxMDUgMTAuOTkyOSAyOC4wMjQ0IDEwLjkxMzkgMjguNTE3NUMxMC42NiAzMC4xMDIzIDEwLjY1OTUgMzEuNDA4NSAxMC44NjY4IDMyLjM3NzdDMTEuMDc0MSAzMy4zNDcyIDExLjQ1NDkgMzMuODQ3NCAxMS44NTg1IDM0LjA4MDRDMTIuMjYyIDM0LjMxMzQgMTIuODg1NiAzNC4zOTMgMTMuODI4OCAzNC4wODc5QzE0Ljc3MTkgMzMuNzgyOCAxNS45MDI5IDMzLjEyOTMgMTcuMTQ4MyAzMi4xMTdDMTcuNTM1OSAzMS44MDIgMTcuOTI5NyAzMS40NTYzIDE4LjMyNzIgMzEuMDgxNlpNMTEuODczMiAyNC42ODQ3QzEyLjUwNjQgMjQuODE2OSAxMy4xNjYyIDI0LjkzNDMgMTMuODQ5MSAyNS4wMzU2QzEzLjYyNTUgMjQuNjcxNiAxMy40MDUgMjQuMzAxNSAxMy4xODggMjMuOTI1NkMxMi45NzEgMjMuNTQ5OCAxMi43NjA3IDIzLjE3MzggMTIuNTU3MyAyMi43OTgxQzEyLjMwMzUgMjMuNDQwMSAxMi4wNzU0IDI0LjA3MDIgMTEuODczMiAyNC42ODQ3Wk0xMi41NTczIDE3LjIwMTJDMTIuNzYwNyAxNi44MjU2IDEyLjk3MSAxNi40NDk2IDEzLjE4OCAxNi4wNzM3QzEzLjQwNSAxNS42OTc4IDEzLjYyNTUgMTUuMzI3NyAxMy44NDkxIDE0Ljk2MzdDMTMuMTY2MiAxNS4wNjQ5IDEyLjUwNjQgMTUuMTgyNCAxMS44NzMyIDE1LjMxNDZDMTIuMDc1MyAxNS45MjkxIDEyLjMwMzUgMTYuNTU5MiAxMi41NTczIDE3LjIwMTJaTTExLjE2MjkgMTkuOTk5N0MxMC41MjQ2IDIxLjQwMTkgOS45ODgzMSAyMi43NzkzIDkuNTYwNDIgMjQuMTAyM0M5LjAzNzEzIDIzLjk0NTQgOC41NDA4MyAyMy43NzczIDguMDc0MjYgMjMuNTk5MUM2LjU3NDg4IDIzLjAyNjYgNS40NDM0MyAyMi4zNzQgNC43MDc2OCAyMS43MDk4QzMuOTcxOCAyMS4wNDU1IDMuNzI4OTggMjAuNDY1NiAzLjcyODk4IDE5Ljk5OTZDMy43Mjg5OCAxOS41MzM3IDMuOTcxOCAxOC45NTM4IDQuNzA3NjggMTguMjg5NUM1LjQ0MzQzIDE3LjYyNTMgNi41NzQ4OCAxNi45NzI2IDguMDc0MjYgMTYuNDAwMUM4LjU0MDgyIDE2LjIyMiA5LjAzNzExIDE2LjA1MzkgOS41NjAzOCAxNS44OTY5QzkuOTg4MjggMTcuMjIgMTAuNTI0NiAxOC41OTc0IDExLjE2MjkgMTkuOTk5N1pNMTguNjk2MiAxMi4xNjUzQzE5LjEyMzIgMTIuMTUzNiAxOS41NTQgMTIuMTQ3NyAxOS45ODggMTIuMTQ3N0MyMC40MjIgMTIuMTQ3NyAyMC44NTI3IDEyLjE1MzYgMjEuMjc5NyAxMi4xNjUyQzIwLjg1MDYgMTEuNjI0NSAyMC40MTkgMTEuMTExOSAxOS45ODggMTAuNjI5NUMxOS41NTY5IDExLjExMTkgMTkuMTI1MyAxMS42MjQ1IDE4LjY5NjIgMTIuMTY1M1pNMjMuMjM5MyAxOS45OTk3QzIzLjIzOTMgMjEuNzk1NiAyMS43ODM0IDIzLjI1MTUgMTkuOTg3NSAyMy4yNTE1QzE4LjE5MTYgMjMuMjUxNSAxNi43MzU3IDIxLjc5NTYgMTYuNzM1NyAxOS45OTk3QzE2LjczNTcgMTguMjAzOCAxOC4xOTE2IDE2Ljc0NzkgMTkuOTg3NSAxNi43NDc5QzIxLjc4MzQgMTYuNzQ3OSAyMy4yMzkzIDE4LjIwMzggMjMuMjM5MyAxOS45OTk3WiIgZmlsbD0iIzYxREFGQiIvPgo8L3N2Zz4K";
var wxIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzIyNTM5XzEzOTYzNyIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMjI1MzlfMTM5NjM3KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzIuNDk3MiA0Ljk1NDM0QzM1LjE0ODYgNi4yNTMwNiAzNi43OTUxIDguODE0NzUgMzcuMzc3NyAxMi4xOTM0QzM3Ljk0MzIgMTUuNDczIDM2LjQ3ODIgMTguMDg5NyAzNC44MTU3IDE5LjgxNzFDMzMuMTkwNyAyMS41MDU1IDMxLjE0MDEgMjIuNjE4OCAyOS43MDQgMjMuMDUwNkMyOC4zODE4IDIzLjQ0ODIgMjYuOTg3NiAyMi42OTg3IDI2LjU5IDIxLjM3NjRDMjYuMTkyNCAyMC4wNTQyIDI2Ljk0MiAxOC42NiAyOC4yNjQyIDE4LjI2MjRDMjguODk2NyAxOC4wNzIyIDMwLjE5NzEgMTcuNDA1NiAzMS4yMTMxIDE2LjM0OTlDMzIuMTkxNSAxNS4zMzMzIDMyLjY1NzIgMTQuMjQxOSAzMi40NTA0IDEzLjA0M0MzMi4wNjc3IDEwLjgyMzUgMzEuMTYyOSA5Ljg2ODM5IDMwLjI5NzggOS40NDQ2QzI5LjMyOTggOC45NzA0NyAyNy44MTUxIDguODY4MTEgMjUuNzYyMiA5LjUzOTY3QzIzLjIwMjkgMTAuMzc2OSAyMi43MjYyIDEyLjEwNzQgMjIuNjU4NSAxMi43MjYzVjI4LjMyNzFMMjIuNjI0NiAyOC41MzA4QzIyLjMwOTYgMzAuNDI1NiAyMS4wMDYyIDMyLjc5MDUgMTguOTE0NSAzNC40MzUzQzE2LjY4ODMgMzYuMTg1NyAxMy41Mjg5IDM3LjE0NjEgOS43NTU0NCAzNS45NjAzQzUuOTY0IDM0Ljc2ODkgMy45ODAwNyAzMi4xNjY2IDMuMjM0NzggMjkuNDQwOEMyLjUzNzEzIDI2Ljg4OTIgMi45MjU1NyAyNC4yNjkxIDMuNjg0MDcgMjIuNjI0MUM0LjE0MzYzIDIxLjYyNzQgNS4xMzcxNiAyMC4zMzQxIDYuMzk4NDggMTkuMjcxOEM3LjY3NDk0IDE4LjE5NjggOS41MzY2OCAxNy4wOTY4IDExLjc4NzYgMTcuMDEwMUMxMy4xNjczIDE2Ljk1NjkgMTQuMzI4OSAxOC4wMzIyIDE0LjM4MjEgMTkuNDExOUMxNC40MzUzIDIwLjc5MTYgMTMuMzU5OSAyMS45NTMyIDExLjk4MDIgMjIuMDA2M0MxMS4yNTIzIDIyLjAzNDQgMTAuNDI1MSAyMi40MTc3IDkuNjE5MzUgMjMuMDk2MkM4Ljc5ODQ5IDIzLjc4NzYgOC4zMTY2NCAyNC41MTgyIDguMjI0NjQgMjQuNzE3N0M3Ljk0MTI2IDI1LjMzMjMgNy42ODE0NCAyNi43NDU4IDguMDU3NzYgMjguMTIyMUM4LjM4NjQ0IDI5LjMyNDMgOS4xOTg3MSAzMC41NDQzIDExLjI1NDMgMzEuMTkwM0MxMy4zMjc5IDMxLjg0MTkgMTQuNzg4NSAzMS4zMTkgMTUuODIzOSAzMC41MDQ4QzE2Ljg5OTEgMjkuNjU5NCAxNy40OTI4IDI4LjUwOSAxNy42NTg1IDI3Ljg2NzdWMTIuNTI5M0wxNy42NjQ4IDEyLjQ0MDdDMTcuODA5NyAxMC40MDQyIDE5LjE0NzYgNi40NDI4MSAyNC4yMDc2IDQuNzg3NUMyNi45ODE0IDMuODgwMSAyOS45NDg2IDMuNzA1OTYgMzIuNDk3MiA0Ljk1NDM0WiIgZmlsbD0iIzAwQTg3MCIvPgo8L2c+Cjwvc3ZnPgo=";
var flutterIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjE4NjEgMy4zMzMwMUw2LjUgMTkuOTk5N0wxMS42Mzg5IDI1LjEzODZMMzMuNDIyMiAzLjM0OTY3SDIzLjIwNDJMMjMuMTg2MSAzLjMzMzAxWk0yMy4yMDU2IDE4LjcxMDhMMTQuMjE4MSAyNy42Nzg4TDIzLjIwNDIgMzYuNjY1SDMzLjQ0NDRMMjQuNDcyMiAyNy42ODE2TDMzLjQ0NDQgMTguNzA5NEwyMy4yMDU2IDE4LjcxMDhaIiBmaWxsPSIjNDREMUZEIi8+Cjwvc3ZnPgo=";
const callbacks = [];
function defaultChangeCallBack() {
  const lang2 = getLang();
  if (lang2 === "en") {
    const zhPathname = location.pathname.slice(0, -3);
    location.pathname = zhPathname;
  } else {
    if (location.pathname === "/") {
      location.pathname = "index-en";
    } else {
      location.pathname = `${location.pathname}-en`;
    }
  }
}
function registerLocaleChange(cb = defaultChangeCallBack) {
  if (callbacks.includes(cb))
    return;
  callbacks.push(cb);
  document.addEventListener("tdesign_site_lang", cb);
}
function jumpLocation(url) {
  const lang2 = getLang();
  return lang2 === "en" ? `${url}-en` : url;
}
[
  {
    name: "\u8BBE\u8BA1",
    path: jumpLocation("/design"),
    type: "main",
    target: "_self"
  },
  {
    name: "\u57FA\u7840\u7EC4\u4EF6",
    type: "base",
    target: "_self"
  },
  {
    name: "\u884C\u4E1A\u7EC4\u4EF6",
    path: "/trade",
    type: "main",
    target: "_self"
  },
  {
    name: "\u9875\u9762\u6A21\u677F",
    path: "https://tdesign.tencent.com/starter/",
    type: "main",
    target: "_self"
  },
  {
    name: "\u8D44\u6E90",
    path: jumpLocation("/source"),
    type: "main",
    target: "_self"
  },
  {
    name: "\u5173\u4E8E",
    path: jumpLocation("/about"),
    type: "main",
    target: "_self"
  }
];
({
  web: {
    name: "Web \u684C\u9762\u7AEF",
    links: [
      {
        name: "Vue",
        icon: vueIcon,
        path: jumpLocation("/vue/overview"),
        npm: "tdesign-vue",
        status: 1
      },
      {
        name: "Vue Next",
        icon: vueIcon,
        path: jumpLocation("/vue-next/overview"),
        npm: "tdesign-vue-next",
        status: 1
      },
      {
        name: "React",
        icon: reactIcon,
        path: jumpLocation("/react/overview"),
        npm: "tdesign-react",
        status: 1
      }
    ]
  },
  mobile: {
    name: "Mobile \u79FB\u52A8\u7AEF",
    links: [
      {
        name: "Vue Next",
        icon: vueIcon,
        path: jumpLocation("/mobile-vue/overview"),
        npm: "tdesign-mobile-vue",
        status: 3
      },
      {
        name: "React",
        icon: reactIcon,
        path: jumpLocation("/mobile-react/overview"),
        npm: "tdesign-mobile-react",
        status: 2
      },
      {
        name: "Flutter",
        icon: flutterIcon,
        path: jumpLocation("/flutter/overview"),
        npm: "tdesign-flutter",
        status: 2
      },
      {
        name: "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F",
        icon: wxIcon,
        path: jumpLocation("/miniprogram/overview"),
        npm: "tdesign-miniprogram",
        status: 1
      },
      {
        name: "QQ \u5C0F\u7A0B\u5E8F",
        icon: wxIcon,
        path: jumpLocation("/qq-miniprogram/overview"),
        npm: "tdesign-qq-miniprogram",
        status: 2
      },
      {
        name: "Taro",
        icon: wxIcon,
        path: jumpLocation("/taro/overview"),
        npm: "tdesign-taro",
        status: 0
      }
    ]
  }
});
const getHeaderConfig = () => {
  const intranet = isIntranet();
  const lang2 = getLang();
  const isEnglish = lang2 === "en";
  const headerList2 = [
    { name: isEnglish ? "Design" : "\u8BBE\u8BA1", path: jumpLocation("/design"), type: "main", target: "_self" },
    { name: isEnglish ? "Components" : "\u57FA\u7840\u7EC4\u4EF6", path: jumpLocation("/vue/overview"), type: "base", target: "_self" },
    intranet ? { name: isEnglish ? "Industry component" : "\u884C\u4E1A\u7EC4\u4EF6", path: "/trade", type: "main", target: "_self" } : null,
    { name: isEnglish ? "Templates" : "\u9875\u9762\u6A21\u677F", path: "https://tdesign.tencent.com/starter/", type: "main", target: "_self" },
    { name: isEnglish ? "Resources" : "\u8D44\u6E90", path: jumpLocation("/source"), type: "main", target: "_self" },
    { name: isEnglish ? "About" : "\u5173\u4E8E", path: jumpLocation("/about/introduce"), type: "main", target: "_self" }
  ].filter((item) => item);
  const baseComponentsLinks2 = {
    web: {
      name: isEnglish ? "Web PC" : "Web \u684C\u9762\u7AEF",
      links: [
        {
          name: "Vue",
          icon: vueIcon,
          path: jumpLocation("/vue/overview"),
          npm: "tdesign-vue",
          status: 1
        },
        {
          name: "Vue Next",
          icon: vueIcon,
          path: jumpLocation("/vue-next/overview"),
          npm: "tdesign-vue-next",
          status: 1
        },
        {
          name: "React",
          icon: reactIcon,
          path: jumpLocation("/react/overview"),
          npm: "tdesign-react",
          status: 1
        }
      ]
    },
    mobile: {
      name: isEnglish ? "Mobile" : "Mobile \u79FB\u52A8\u7AEF",
      links: [
        {
          name: "Vue Next",
          icon: vueIcon,
          path: jumpLocation("/mobile-vue/overview"),
          npm: "tdesign-mobile-vue",
          status: 3
        },
        {
          name: "React",
          icon: reactIcon,
          path: jumpLocation("/mobile-react/overview"),
          npm: "tdesign-mobile-react",
          status: 2
        },
        {
          name: "Flutter",
          icon: flutterIcon,
          path: jumpLocation("/flutter/overview"),
          npm: "tdesign-flutter",
          status: 2
        },
        {
          name: isEnglish ? "WeChat-Miniprogram" : "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F",
          icon: wxIcon,
          path: jumpLocation("/miniprogram/overview"),
          npm: "tdesign-miniprogram",
          status: 1
        },
        {
          name: isEnglish ? "QQ-Miniprogram" : "QQ \u5C0F\u7A0B\u5E8F",
          icon: wxIcon,
          path: jumpLocation("/qq-miniprogram/overview"),
          npm: "tdesign-qq-miniprogram",
          status: 2
        },
        {
          name: "Taro",
          icon: wxIcon,
          path: jumpLocation("/taro/overview"),
          npm: "tdesign-taro",
          status: 0
        }
      ]
    }
  };
  const baseComponentPrefix2 = ["vue", "react", "mobile-vue", "mobile-react", "vue-next", "flutter", "miniprogram"];
  return {
    headerList: headerList2,
    baseComponentsLinks: baseComponentsLinks2,
    baseComponentPrefix: baseComponentPrefix2
  };
};
const headerConfig = getHeaderConfig();
const { headerList, baseComponentsLinks, baseComponentPrefix } = headerConfig;
const allComponentsNpmUrl = [
  ...baseComponentsLinks.web.links.filter((l) => l.status).map((l) => l.npm),
  ...baseComponentsLinks.mobile.links.filter((l) => l.status).map((l) => l.npm)
];
function handleLinkClick$1(host, e, item) {
  e.preventDefault();
  if (!item.status)
    return;
  location.href = item.path;
}
function renderTag(status) {
  if (status === 0)
    return html`<span class="disable-tag">待上线</span>`;
  if (status === 1)
    return html`<span class="stable-tag">Stable</span>`;
  if (status === 2)
    return html`<span class="alpha-tag">Alpha</span>`;
  if (status === 3)
    return html`<span class="beta-tag">Beta</span>`;
  if (status === 4)
    return html`<span class="rc-tag">Rc</span>`;
}
function isActive(path) {
  if (/^https?:/.test(path))
    return location.href.includes(path);
  return location.pathname.includes(path);
}
function renderNotice(host) {
  if (location.host !== "tdesign.tencent.com" && !localStorage.getItem("TDesign_notice"))
    return html``;
  const { notice } = host;
  let currentSite = location.pathname.split("/")[1] || "site";
  if (["design", "source", "about"].includes(currentSite))
    currentSite = "site";
  let noticeOption = notice[currentSite];
  if (!(noticeOption == null ? void 0 : noticeOption.title))
    noticeOption = notice["all"];
  if (!(noticeOption == null ? void 0 : noticeOption.title))
    return html``;
  if (localStorage.getItem("TDesign_notice_closed") === (noticeOption == null ? void 0 : noticeOption.title))
    return html``;
  const changeAsideElTop = (top2 = "96px") => {
    const asideEl = document.querySelector("td-doc-aside");
    if (asideEl) {
      asideEl.style.setProperty("--aside-top", top2);
      asideEl.shadowRoot.querySelector(".TDesign-doc-aside").style.top = top2;
    }
  };
  const closeNotice = () => {
    if (!host.shadowRoot)
      return;
    host.shadowRoot.querySelector(".TDesign-header-notice").style.display = "none";
    changeAsideElTop("64px");
    localStorage.setItem("TDesign_notice_closed", noticeOption == null ? void 0 : noticeOption.title);
  };
  const handleNoticeAction = () => {
    if (!(noticeOption == null ? void 0 : noticeOption.actionUrl))
      return;
    location.href = noticeOption.actionUrl;
  };
  changeAsideElTop();
  return html`
    <div class="TDesign-header-notice ${noticeOption.type}">
      <div
        class="TDesign-header-notice__content"
        onclick="${handleNoticeAction}"
      >
        ${noticeOption.title}
      </div>
      ${noticeOption.closeable && html`<i
        class="TDesign-header-notice__close"
        innerHTML="${closeIcon}"
        onclick="${closeNotice}"
      ></i>`}
    </div>
  `;
}
function renderLinksPopup(host, trigger) {
  return html`
    <td-doc-popup placement="bottom" portalStyle="${portalStyle$3}">
      ${trigger}
      <div slot="content" class="TDesign-base-components-links">
        <div class="TDesign-base-components-links__web">
          <p class="title">${baseComponentsLinks.web.name}</p>
          <div class="TDesign-base-components-links__list">
            ${baseComponentsLinks.web.links.map(
    (item) => html`
                <a
                  href="${item.path}"
                  class="link ${isActive(item.path) ? "active" : ""} ${!item.status ? "disabled" : ""}"
                  onclick=${(host2, e) => handleLinkClick$1(host2, e, item)}
                >
                  <img class="icon" src="${item.icon}" />
                  <div class="details">
                    <span class="name">
                      ${item.name} ${renderTag(item.status)}
                    </span>
                    <span class="version">
                      ${item.status ? `Version\uFF1A${host.npmVersions[item.npm]}` : "\u656C\u8BF7\u671F\u5F85"}
                    </span>
                  </div>
                </a>
              `
  )}
          </div>
        </div>

        <div class="TDesign-base-components-links__mobile">
          <p class="title">${baseComponentsLinks.mobile.name}</p>
          <div class="TDesign-base-components-links__list">
            ${baseComponentsLinks.mobile.links.map(
    (item) => html`
                <a
                  href="${item.path}"
                  class="link ${isActive(item.path) ? "active" : ""} ${!item.status ? "disabled" : ""}"
                  onclick=${(host2, e) => handleLinkClick$1(host2, e, item)}
                >
                  <img class="icon" src="${item.icon}" />
                  <div class="details">
                    <span class="name">
                      ${item.name} ${renderTag(item.status)}
                    </span>
                    <span class="version">
                      ${item.status ? `Version\uFF1A${host.npmVersions[item.npm] || "alpha"}` : "\u656C\u8BF7\u671F\u5F85"}
                    </span>
                  </div>
                </a>
              `
  )}
          </div>
        </div>
      </div>
    </td-doc-popup>
  `;
}
function gitPath(platform, framework) {
  const isStarter = /starter/.test(location.pathname);
  if (isStarter) {
    const [, starterFramework] = location.pathname.match(/starter\/docs\/([\w-]+)/) || [];
    if (!starterFramework)
      return "https://github.com/Tencent/?q=tdesign+starter";
    return `https://github.com/Tencent/tdesign-${starterFramework}-starter`;
  }
  if (framework === "site") {
    return isIntranet() ? "https://git.woa.com/groups/TDesign/-/projects/list" : "https://github.com/Tencent/tdesign";
  } else if (platform === "mobile") {
    return isIntranet() ? `https://git.woa.com/Tdesign/Tdesign-${platform}-${framework}` : `https://github.com/Tencent/tdesign-${platform}-${framework}`;
  } else if (framework === "flutter") {
    return "https://github.com/TDesignOteam/tdesign-flutter";
  } else {
    return isIntranet() ? `https://git.woa.com/Tdesign/Tdesign-${platform}-${framework}` : `https://github.com/Tencent/tdesign-${framework}`;
  }
}
function renderLinks$1(host, headerList2, platform, framework) {
  const gitLink = html`
    <a
      class="TDesign-header-nav__git"
      href="${gitPath(platform, framework)}"
      id="${platform}"
      target="_blank"
    >
      <span
        class="TDesign-header-nav__git-icon"
        innerHTML="${isIntranet() ? gitIcon : githubIcon}"
      ></span>
    </a>
  `;
  function handleTranslate() {
    const lang2 = getLang();
    const nextLang = lang2 === "zh" ? "en" : "zh";
    document.dispatchEvent(new CustomEvent("tdesign_site_lang", { detail: nextLang }));
  }
  const translateLink = host.enabledLocale ? html`
    <div class="TDesign-header-nav__translate" onclick="${handleTranslate}">
      <span
        class="TDesign-header-nav__translate-icon"
        innerHTML="${translateIcon}"
      ></span>
    </div>
  ` : html``;
  const isBaseActive = () => {
    const [, basePath] = location.pathname.split("/");
    return baseComponentPrefix.includes(basePath);
  };
  return headerList2.map((item) => {
    if (item.type === "base") {
      const trigger = html`
          <span
            class="TDesign-header-nav__link ${isBaseActive() ? "active" : ""}"
          >
            ${item.name} <i class="icon" innerHTML="${fakeArrowIcon}"></i>
          </span>
        `;
      return renderLinksPopup(host, trigger);
    }
    return html`
        <a
          class="TDesign-header-nav__link ${isActive(item.path) ? "active" : ""}"
          href="${item.path}"
          target="${item.target}"
          >${item.name}</a
        >
      `;
  }).concat(translateLink).concat(gitLink);
}
define$2({
  tag: "td-header",
  platform: "web",
  framework: "vue",
  disabledTheme: false,
  enabledLocale: true,
  notice: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value2) => value2,
    connect: (host, key2) => {
      fetch("https://tdesign-site-services.surge.sh/notice.json").then((res) => res.json()).then((res) => {
        host.notice = res;
      }).catch(console.error);
    }
  },
  npmVersions: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value2) => value2,
    connect: (host, key2) => {
      allComponentsNpmUrl.forEach((item) => {
        fetch(`https://mirrors.tencent.com/npm/${item}`).then((res) => res.json()).then((res) => {
          var _a;
          const latestVersion = (_a = res == null ? void 0 : res["dist-tags"]) == null ? void 0 : _a["latest"];
          host.npmVersions = {
            ...host.npmVersions,
            [item]: latestVersion
          };
        }).catch(console.error);
      });
    }
  },
  collapseMenu: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value2) => value2,
    connect: (host, key2) => {
      function handleResize() {
        const isMobileResponse = window.innerWidth < 960;
        Object.assign(host, { [key2]: isMobileResponse });
      }
      requestAnimationFrame(() => handleResize());
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  },
  render: (host) => {
    const { platform, framework, disabledTheme, collapseMenu } = host;
    return html`
      ${renderNotice(host)}
      <header class="TDesign-header">
        <div class="TDesign-header-inner">
          <div class="TDesign-header-left">
            <td-logo></td-logo>
          </div>
          <div class="TDesign-header-nav">
            ${collapseMenu ? html`
                  <td-collapse-menu
                    disabledTheme="${disabledTheme}"
                    platform="${platform}"
                    framework="${framework}"
                    headerList="${headerList}"
                    baseComponentsLinks="${baseComponentsLinks}"
                  >
                  </td-collapse-menu>
                ` : html`
                  <div class="slot-search">
                    <slot name="search"></slot>
                  </div>
                  ${renderLinks$1(host, headerList, platform, framework)}
                  ${disabledTheme ? html`` : html`<td-theme-tabs></td-theme-tabs>`}
                `}
          </div>
        </div>
      </header>
    `.css`${style$t}`;
  }
});
var style$s = ".TDesign-collapse-menu{position:relative;display:flex;align-items:center;height:var(--header-height)}.TDesign-collapse-menu .collapse-icon{width:24px;height:24px;cursor:pointer}.TDesign-collapse-menu .collapse-icon svg{color:var(--text-primary)}\n";
var portalStyle$2 = ".TDesign-collapse-menu__list{min-height:32px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;padding:8px;width:254px;box-sizing:border-box;flex-direction:column;transition:all .2s var(--anim-time-fn-easing)}.TDesign-collapse-menu__list .link+.link{margin-top:4px}.TDesign-collapse-menu__list .link{display:flex;align-items:center;height:32px;box-sizing:border-box;padding:8px;text-decoration:none;color:var(--text-secondary);font-size:14px;border-radius:3px;transition:all .2s linear}.TDesign-collapse-menu__list .link:hover{color:var(--text-primary);background:var(--bg-color-container-hover)}.TDesign-collapse-menu__list .link .icon{max-width:16px;max-height:16px;margin-right:8px}.TDesign-collapse-menu__list .link svg{width:16px;height:16px}.TDesign-collapse-menu__list .link.active{color:var(--text-primary);background:var(--bg-color-container-select)}.TDesign-collapse-menu__list .link.disabled{cursor:no-drop}.TDesign-collapse-menu__list .link .disable-tag,.TDesign-collapse-menu__list .link .alpha-tag,.TDesign-collapse-menu__list .link .beta-tag,.TDesign-collapse-menu__list .link .stable-tag{font-size:12px;border-radius:var(--border-radius);padding:2px 4px;margin-left:8px}.TDesign-collapse-menu__list .link .disable-tag{color:var(--text-secondary);background:var(--bg-color-tag)}.TDesign-collapse-menu__list .link .alpha-tag{color:var(--brand-main);background:var(--brand-main-light);font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}.TDesign-collapse-menu__list .link .beta-tag{color:var(--success-main);background:var(--success-main-light);font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}.TDesign-collapse-menu__list .link .stable-tag{color:#029cd4;background:rgba(2,156,212,.1);font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}.TDesign-collapse-menu__list .divider{width:100%;height:1px;margin:8px 0;background-color:var(--component-stroke)}.TDesign-collapse-menu__list .divider+.title{margin-top:0}.TDesign-collapse-menu__list .title{font-size:12px;margin:8px 8px 4px;color:var(--text-placeholder)}.TDesign-collapse-menu__list td-theme-tabs{margin-top:4px}\n";
var bulletpointIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M21.0001 4.50004L7.50007 4.5L7.50006 6L21.0001 6.00004V4.50004Z" fill="currentColor" />\n  <path d="M5.25007 4.5L3.00098 4.5L3.00098 6L5.25007 6V4.5Z" fill="currentColor" />\n  <path d="M7.50007 11.2501L21.0001 11.2501V12.7501L7.50006 12.7501L7.50007 11.2501Z" fill="currentColor" />\n  <path d="M3.00098 11.2501H5.25007V12.7501H3.00098L3.00098 11.2501Z" fill="currentColor" />\n  <path d="M7.50007 18L21.0001 18V19.5L7.50006 19.5L7.50007 18Z" fill="currentColor" />\n  <path d="M3.00098 18H5.25007V19.5H3.00098L3.00098 18Z" fill="currentColor" />\n</svg>';
function renderLinks({ headerList: headerList2, baseComponentsLinks: baseComponentsLinks2, platform, framework }) {
  const gitLink = html`
    <a class="link" href="${gitPath(platform, framework)}" id="${platform}" target="_blank">
      <span>${isIntranet() ? "\u5DE5\u8702" : "Github"}</span>
    </a>
  `;
  const isActive2 = (path) => location.pathname.includes(path);
  let baseLinks = [html`<div class="divider"></div>`];
  const renderNavs = headerList2.map((item) => {
    if (item.type === "base") {
      const webLinks = baseComponentsLinks2.web.links.map((item2) => html`
        <a
          href="${item2.path}"
          class="link ${isActive2(item2.path) ? "active" : ""}"
          onclick=${(host, e) => handleLinkClick$1(host, e, item2)}
        >
          <img class="icon" src="${item2.icon}" />
          ${item2.name}
          ${renderTag(item2.status)}
        </a>
      `);
      baseLinks.push(html`<div class="title">Web 桌面端组件</div>`);
      baseLinks.push(...webLinks);
      const mobileLinks = baseComponentsLinks2.mobile.links.map((item2) => html`
        <a
          href="${item2.path}"
          class="link ${isActive2(item2.path) ? "active" : ""}"
          onclick=${(host, e) => handleLinkClick$1(host, e, item2)}
        >
          <img class="icon" src="${item2.icon}" />
          ${item2.name}
          ${renderTag(item2.status)}
        </a>
      `);
      baseLinks.push(html`<div class="title">Mobile 移动端组件</div>`);
      baseLinks.push(...mobileLinks);
      baseLinks.push(html`<div class="divider"></div>`);
      return html``;
    }
    return html`<a class="link ${isActive2(item.path) ? "active" : ""}" href="${item.path}">${item.name}</a>`;
  }).concat(gitLink);
  renderNavs.splice(1, 0, ...baseLinks);
  return renderNavs;
}
define$2({
  tag: "td-collapse-menu",
  headerList: {
    get: (_host, lastValue) => lastValue || [],
    set: (_host, value2) => value2
  },
  baseComponentsLinks: {
    get: (_host, lastValue) => lastValue || [],
    set: (_host, value2) => value2
  },
  platform: "web",
  framework: "vue",
  disabledTheme: false,
  render: (host) => html`
    <div class="TDesign-collapse-menu">
      <td-doc-popup portalStyle="${portalStyle$2}" trigger-type="click">
        <div class="collapse-icon" innerHTML="${bulletpointIcon}"></div>
        <div slot="content" class="TDesign-collapse-menu__list">
          ${renderLinks(host)}
          ${host.disabledTheme ? html`` : html`<td-theme-tabs></td-theme-tabs>`}
        </div>
      </td-doc-popup>
    </div>
  `.css`${style$s}`
});
var style$r = ".TDesign-header-logo{height:32px;display:inline-flex;align-items:center}.TDesign-header-logo .home{color:var(--text-primary);text-decoration:none}.TDesign-header-logo .home svg{display:block;height:32px}.TDesign-header-logo .divider{width:1px;height:16px;background:var(--component-stroke);margin:0 16px}.TDesign-header-logo__menu{height:32px;cursor:pointer}.TDesign-header-logo__menu svg{border-radius:var(--border-radius);padding:4px;width:32px;height:32px;box-sizing:border-box;transition:all .2s linear;color:var(--text-secondary)}.TDesign-header-logo__menu svg:hover{background-color:var(--bg-color-container-hover)}\n";
var portalStyle$1 = ".TDesign-header-logo__content{--menu-list-width: 400px;--list-direction: row;padding:16px;border-radius:6px;width:var(--menu-list-width);box-sizing:border-box}@media screen and (max-width: 750px){.TDesign-header-logo__content{--list-direction: column;--menu-list-width: 212px}}.TDesign-header-logo__content span.title:hover{cursor:auto;color:var(--text-primary);font-family:TencentSansW7}.TDesign-header-logo__content .title{color:var(--text-primary);display:inline-flex;align-items:flex-end;margin:0 16px 8px;line-height:22px;transition:color .2s linear;text-decoration:none;font-family:TencentSansW7}.TDesign-header-logo__content .title:hover{color:var(--brand-main)}.TDesign-header-logo__content .title i{width:16px;height:16px;margin-left:4px;margin-bottom:2px}.TDesign-header-logo__content .list{display:flex;flex-wrap:wrap;flex-direction:var(--list-direction);row-gap:8px;column-gap:8px}.TDesign-header-logo__content .list .item{text-decoration:none;padding:8px;width:180px;border-radius:var(--border-radius);box-sizing:border-box;display:flex;align-items:center;row-gap:8px;column-gap:8px;transition:all .2s linear}.TDesign-header-logo__content .list .item:hover{color:var(--text-primary);background:var(--bg-color-container-hover)}.TDesign-header-logo__content .list .item.active{color:var(--text-primary);background:var(--bg-color-container-select)}.TDesign-header-logo__content .list .item .icon{width:40px;height:40px}.TDesign-header-logo__content .list .item .details{display:flex;justify-content:center;flex-direction:column}.TDesign-header-logo__content .list .item .details .name{color:var(--text-primary);font-family:TencentSansW7}.TDesign-header-logo__content .list .item .details .desc{font-size:12px;line-height:20px;color:var(--text-secondary)}.TDesign-header-logo__content .line{width:100%;height:1px;margin:16px 0;background-color:var(--component-stroke)}\n";
var logoIcon = '<svg width="122" height="32" viewBox="0 0 122 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g clip-path="url(#clip0_16025_26913)">\n    <path\n      d="M42.1876 8.78706H37.2302L34.1354 26.2045H30.52L33.5916 8.78706H28.6111L29.1491 5.79641H42.7256L42.1876 8.78706Z"\n      fill="currentColor" />\n    <path\n      d="M58.4307 10.9505C58.4187 12.1155 58.3026 13.277 58.0837 14.4213L57.5052 17.8458C56.2789 24.8278 54.3815 26.2045 48.9787 26.2045H40.6777L44.2642 5.80798H51.3504C56.4929 5.80798 58.4307 7.09795 58.4307 10.9505ZM54.8211 11.4943C54.8211 9.18041 53.7163 8.79863 50.8066 8.79863H47.3358L44.8253 23.2139H48.2498C52.299 23.2139 53.1262 22.4041 53.9072 17.8516L54.4856 14.4271C54.6807 13.4608 54.793 12.4796 54.8211 11.4943Z"\n      fill="currentColor" />\n    <path\n      d="M72.2269 13.756C72.2256 14.1538 72.1889 14.5507 72.117 14.9419L71.7352 17.0706C71.3071 19.4655 70.4163 20.3042 68.1777 20.3042H62.26L62.1212 21.1372C62.047 21.5188 62.0025 21.9056 61.9881 22.2941C61.9881 23.237 62.474 23.4511 64.0359 23.4511H69.4503L68.3454 26.1756H63.388C59.9172 26.1756 58.6504 25.2848 58.6504 23.104C58.664 22.4716 58.7259 21.8412 58.8355 21.2182L59.8883 15.1791C60.5362 11.4653 62.098 10.7076 66.0547 10.7076H67.8884C70.7171 10.7365 72.2269 11.4943 72.2269 13.756ZM68.8602 14.242C68.8602 13.5941 68.4553 13.4321 67.2174 13.4321H65.3027C64.0648 13.4321 63.469 13.5941 63.174 15.208L62.7459 17.6896H67.3215C67.4654 17.7123 67.6125 17.7034 67.7526 17.6634C67.8927 17.6234 68.0223 17.5533 68.1325 17.458C68.2427 17.3627 68.3307 17.2445 68.3905 17.1116C68.4502 16.9788 68.4803 16.8345 68.4785 16.6888L68.7735 14.9535C68.8153 14.7185 68.8386 14.4806 68.8429 14.242H68.8602Z"\n      fill="currentColor" />\n    <path\n      d="M72.4121 23.48H78.7752C79.828 23.48 80.0189 23.318 80.204 22.271L80.4469 20.8422C80.4911 20.6385 80.5182 20.4315 80.5279 20.2233C80.5279 19.8704 80.337 19.8183 79.7181 19.8183H76.6233C74.2516 19.8183 73.4707 19.3613 73.4707 17.8226C73.496 17.0722 73.585 16.3252 73.7368 15.5898L73.9566 14.375C74.4946 11.2744 75.2986 10.9042 78.3471 10.9042H85.1614L84.0045 13.623H78.324C77.2712 13.623 77.0803 13.785 76.8952 14.8378L76.6812 16.0468C76.6341 16.25 76.607 16.4573 76.6002 16.6657C76.6002 17.0186 76.7853 17.0706 77.4042 17.0706H80.6378C83.0095 17.0706 83.7905 17.5276 83.7905 19.0663C83.7648 19.8187 83.6758 20.5676 83.5244 21.305L83.2236 22.9999C82.7434 25.7996 81.9336 26.1814 78.7521 26.1814H72.8922L72.4121 23.48Z"\n      fill="currentColor" />\n    <path\n      d="M87.9843 10.9274H91.3278L88.6611 26.2045H85.3176L87.9843 10.9274ZM88.9851 4.97499H92.4559L91.8369 8.44576H88.3661L88.9851 4.97499Z"\n      fill="currentColor" />\n    <path\n      d="M105.986 14.2651C105.946 15.2371 105.828 16.2043 105.633 17.1574L103.961 26.6037C103.313 30.2711 101.729 31 98.6279 31H92.8086L92.3227 28.2465H97.8759C99.9758 28.2465 100.381 28.0903 100.768 25.7186L100.953 24.6658H97.0777C93.6532 24.6658 92.2244 23.7229 92.2244 21.1372C92.2638 20.1652 92.3818 19.1979 92.5772 18.2449L92.9821 16.0063C93.7631 11.6967 94.758 10.7249 99.2585 10.7249H101.115C104.557 10.7365 105.986 11.6794 105.986 14.2651ZM101.457 21.9471L102.29 17.1227C102.462 16.3618 102.571 15.5878 102.614 14.8088C102.614 13.6519 102.035 13.4379 100.3 13.4379H99.0907C97.043 13.4379 96.719 14.0568 96.3662 16.0236L95.9612 18.2623C95.7993 19.025 95.691 19.7982 95.6373 20.5761C95.6373 21.733 96.2158 21.9529 97.9859 21.9529L101.457 21.9471Z"\n      fill="currentColor" />\n    <path\n      d="M121.367 13.6751C121.306 14.7796 121.161 15.878 120.934 16.9607L119.32 26.2161H115.976L117.619 16.9607C117.766 16.2594 117.857 15.5476 117.891 14.832C117.891 13.8891 117.486 13.6751 116.219 13.6751H112.286L110.105 26.1814H106.767L109.434 10.9042H116.855C120.286 10.9274 121.367 11.7314 121.367 13.6751Z"\n      fill="currentColor" />\n    <path\n      d="M7.97158 26.1814H3.28026C3.20254 26.1813 3.12575 26.1646 3.05505 26.1323C2.98435 26.1001 2.92139 26.053 2.87041 25.9944C2.81943 25.9357 2.78162 25.8668 2.75952 25.7923C2.73741 25.7178 2.73154 25.6394 2.74229 25.5625L3.65626 20.4026H9.44088L8.49798 25.7476C8.47291 25.8691 8.40703 25.9784 8.31127 26.0573C8.21552 26.1362 8.09566 26.18 7.97158 26.1814V26.1814Z"\n      fill="#009BFF" />\n    <path\n      d="M21.1779 8.78706H5.69824L6.71634 3.00244H21.9877C22.0714 2.99445 22.1557 3.00616 22.234 3.03663C22.3123 3.06709 22.3823 3.11547 22.4386 3.17789C22.4948 3.2403 22.5356 3.31502 22.5578 3.39605C22.58 3.47709 22.5828 3.56219 22.5662 3.64453L21.7101 8.35321C21.6869 8.47672 21.6207 8.58803 21.5233 8.66744C21.4259 8.74684 21.3035 8.78922 21.1779 8.78706Z"\n      fill="url(#paint0_linear_16025_26913)" />\n    <path\n      d="M5.69814 8.78706H0.549824C0.471061 8.78794 0.393048 8.77169 0.321181 8.73945C0.249315 8.70721 0.185311 8.65974 0.133598 8.60033C0.081885 8.54091 0.0436979 8.47097 0.0216786 8.39534C-0.000340748 8.31972 -0.00566652 8.24021 0.00606973 8.16232L0.84484 3.44785C0.867754 3.32323 0.933469 3.21053 1.03064 3.12921C1.1278 3.04788 1.25032 3.00304 1.37702 3.00244H6.71623L5.69814 8.78706Z"\n      fill="#0064FF" />\n    <path d="M9.44658 20.3852H3.65039L5.69815 8.79863H11.4943L9.44658 20.3852Z"\n      fill="url(#paint1_linear_16025_26913)" />\n  </g>\n  <defs>\n    <linearGradient id="paint0_linear_16025_26913" x1="6.19468" y1="5.90053" x2="21.6312" y2="8.6791"\n      gradientUnits="userSpaceOnUse">\n      <stop offset="0.03" stop-color="#E9FFFF" />\n      <stop offset="0.17" stop-color="#C4FAC9" />\n      <stop offset="0.33" stop-color="#A0F694" />\n      <stop offset="0.48" stop-color="#82F269" />\n      <stop offset="0.63" stop-color="#6AEF47" />\n      <stop offset="0.76" stop-color="#5AED2F" />\n      <stop offset="0.89" stop-color="#4FEB20" />\n      <stop offset="1" stop-color="#4CEB1B" />\n    </linearGradient>\n    <linearGradient id="paint1_linear_16025_26913" x1="8.58918" y1="8.37635" x2="8.69869" y2="19.278"\n      gradientUnits="userSpaceOnUse">\n      <stop stop-color="#009BFF" />\n      <stop offset="0.35" stop-color="#0081FE" />\n      <stop offset="0.75" stop-color="#006AFD" />\n      <stop offset="1" stop-color="#0062FD" />\n    </linearGradient>\n    <clipPath id="clip0_16025_26913">\n      <rect width="121.367" height="32" fill="white" />\n    </clipPath>\n  </defs>\n</svg>';
var menuApplicationIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M6 4.5C6 5.32846 5.32846 6 4.5 6C3.67154 6 3 5.32846 3 4.5C3 3.67154 3.67154 3 4.5 3C5.32846 3 6 3.67154 6 4.5Z" fill="currentColor" />\n<path d="M6 12C6 12.8285 5.32846 13.5 4.5 13.5C3.67154 13.5 3 12.8285 3 12C3 11.1715 3.67154 10.5 4.5 10.5C5.32846 10.5 6 11.1715 6 12Z" fill="currentColor" />\n<path d="M4.5 21C5.32846 21 6 20.3285 6 19.5C6 18.6715 5.32846 18 4.5 18C3.67154 18 3 18.6715 3 19.5C3 20.3285 3.67154 21 4.5 21Z" fill="currentColor" />\n<path d="M13.5 4.5C13.5 5.32846 12.8285 6 12 6C11.1715 6 10.5 5.32846 10.5 4.5C10.5 3.67154 11.1715 3 12 3C12.8285 3 13.5 3.67154 13.5 4.5Z" fill="currentColor" />\n<path d="M12 13.5C12.8285 13.5 13.5 12.8285 13.5 12C13.5 11.1715 12.8285 10.5 12 10.5C11.1715 10.5 10.5 11.1715 10.5 12C10.5 12.8285 11.1715 13.5 12 13.5Z" fill="currentColor" />\n<path d="M13.5 19.5C13.5 20.3285 12.8285 21 12 21C11.1715 21 10.5 20.3285 10.5 19.5C10.5 18.6715 11.1715 18 12 18C12.8285 18 13.5 18.6715 13.5 19.5Z" fill="currentColor" />\n<path d="M19.5 6C20.3285 6 21 5.32846 21 4.5C21 3.67154 20.3285 3 19.5 3C18.6715 3 18 3.67154 18 4.5C18 5.32846 18.6715 6 19.5 6Z" fill="currentColor" />\n<path d="M21 12C21 12.8285 20.3285 13.5 19.5 13.5C18.6715 13.5 18 12.8285 18 12C18 11.1715 18.6715 10.5 19.5 10.5C20.3285 10.5 21 11.1715 21 12Z" fill="currentColor" />\n<path d="M19.5 21C20.3285 21 21 20.3285 21 19.5C21 18.6715 20.3285 18 19.5 18C18.6715 18 18 18.6715 18 19.5C18 20.3285 18.6715 21 19.5 21Z" fill="currentColor" />\n</svg>\n';
var chevronRightIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M6.46042 12.4592L5.54119 11.54L9.08157 7.99961L5.54119 4.45923L6.46042 3.53999L10.92 7.99961L6.46042 12.4592Z" fill="currentColor" />\n</svg>\n';
const logoMenuConfigCdn = "https://cdc.cdn-go.cn/tdc/latest/menu.json";
const logoMenuConfigWoaCdn = "https://cdc.cdn-go.cn/tdc/latest/menu.woa.json";
const logoMenuSvgPrefix = "https://cdc.cdn-go.cn/tdc/latest/images";
function renderList(list = []) {
  return html`
    <div class="list">
      ${list.map((item) => html`
        <a class="item" href="${item.url}" target="${item.target}">
          <img class="icon" src="${logoMenuSvgPrefix}/${item.key}.svg" />
          <div class="details">
            <span class="name">${item.title}</span>
            <span class="desc">${item.desc}</span>
          </div>
        </a>`)}
    </div>`;
}
function renderMenu(list) {
  const len = list.length;
  return list.map((item, index) => html`
    ${item.category_url ? html`
        <a href="${item.category_url}" class="title" target="${item.target}">
          ${item.category_title} <i innerHTML="${chevronRightIcon}"></i>
        </a>
      ` : html`
        <span class="title">
          ${item.category_title}
        </span>
      `}
    ${renderList(item.children)}
    ${index < len - 1 ? html`<div class="line"></div>` : html``}
  `);
}
define$2({
  tag: "td-logo",
  menuList: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value2) => value2
  },
  isIntranet: {
    get: () => isIntranet(),
    set: (value2) => value2,
    connect: (host) => {
      const menuCdn = isIntranet() ? logoMenuConfigWoaCdn : logoMenuConfigCdn;
      fetch(menuCdn).then((res) => res.json()).then((menuList) => {
        menuList.forEach((menu) => {
          menu.target = "_blank";
          menu.children.forEach((child) => {
            if (child.url.includes("tdesign")) {
              child.target = "_self";
            } else {
              child.target = "_blank";
            }
          });
        });
        Object.assign(host, { menuList });
      });
    }
  },
  render: ({ menuList }) => html`
    <style>${style$r}</style>

    <div class="TDesign-header-logo">
      <td-doc-popup portalStyle="${portalStyle$1}" placement="bottom-start">
        <div class="TDesign-header-logo__menu" innerHTML=${menuApplicationIcon}></div>
        <div slot="content" class="TDesign-header-logo__content">
          ${renderMenu(menuList)}
        </div>
      </td-doc-popup>
      <span class="divider"></span>
      <a class="home" href="/" title="TDesign" innerHTML=${logoIcon}></a>
    </div>
  `
});
var style$q = ":host{position:fixed;right:24px;bottom:80px;z-index:300}:host .TDesign-backtop{width:48px;height:48px;display:flex;justify-content:center;align-items:center;border-radius:6px;box-sizing:border-box;backdrop-filter:blur(10px);background-color:var(--component-border);cursor:pointer;transition:all .2s ease;opacity:0;visibility:hidden;color:var(--text-secondary)}:host .TDesign-backtop.show{opacity:1;visibility:visible}:host .TDesign-backtop:hover{color:var(--text-primary)}:host .TDesign-backtop:hover .TDesign-backtop__inner{transform:scale(.95)}:host .TDesign-backtop__inner{width:calc(100% - 2px);height:calc(100% - 2px);border-radius:5px;display:flex;justify-content:center;align-items:center;background-color:var(--bg-color-container-transparent);box-sizing:border-box;transition:all .2s ease}:host .TDesign-backtop__inner svg{width:20px;height:20px}\n";
var backTopIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M1.73734 0.5V1.75H14.2373V0.5H1.73734Z" />\n  <path fill="currentColor" d="M15.0669 8.86364L14.1831 9.74752L8.62087 4.18534V15.5426H7.37087V4.18534L1.80869 9.74752L0.924805 8.86364L7.99587 1.79257L15.0669 8.86364Z" />\n</svg>';
function handleBacktop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
define$2({
  tag: "td-backtop",
  backtopShow: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value2) => value2,
    connect: (host, key2, invalidate2) => {
      function toggleVisible() {
        const { scrollTop } = document.documentElement;
        if (scrollTop > 0) {
          Object.assign(host, { [key2]: true });
        } else {
          Object.assign(host, { [key2]: false });
        }
        invalidate2();
      }
      document.addEventListener("scroll", toggleVisible);
      return () => document.removeEventListener("scroll", toggleVisible);
    }
  },
  render: ({ backtopShow }) => html`
    <div class="TDesign-backtop ${backtopShow ? "show" : ""}" onclick="${handleBacktop}">
      <div class="TDesign-backtop__inner" innerHTML=${backTopIcon}></div>
    </div>
  `.css`${style$q}`
});
var style$p = ".TDesign-avatar{margin-right:8px;display:inline-flex;align-items:center;justify-content:center}.TDesign-avatar .avatar{width:40px;height:40px;display:inline-block}.TDesign-avatar .avatar img{width:40px;height:40px;border-radius:100%}\n";
define$2({
  tag: "td-avatar",
  content: "",
  username: "",
  src: "",
  href: "",
  render: ({ content, username, src, href }) => {
    const defaultSrc = `https://avatars.githubusercontent.com/${username}`;
    const defaultHref = `https://github.com/${username}`;
    return html`
        <div class="TDesign-avatar">
          <td-tooltip trigger-type="hover">
            <a class="avatar" target="_blank" href="${href || defaultHref}">
              <img src="${src || defaultSrc}" />
            </a>
            <div slot="content">${content || username}</div>
          </td-tooltip>
        </div>
      `.css`${style$p}`;
  }
});
var style$o = ".TDesign-contributors .title{font-weight:700;font-size:20px;line-height:28px;margin:48px 0 16px}.TDesign-contributors__content{display:flex;flex-wrap:wrap}.TDesign-contributors__content td-tooltip{margin-right:8px}.TDesign-contributors__content img{width:40px;height:40px;border-radius:100%}.TDesign-contributors__content .avatar{width:40px;height:40px;display:inline-block}\n";
const apiUrl = "https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/list";
function renderContributors(list) {
  if (!list.length)
    return html``;
  const contributors = list.filter((item) => typeof item === "object" && item !== null);
  return html`
    <section class="TDesign-contributors">
      <h3 class="title">Contributors</h3>
      <div class="TDesign-contributors__content">
        ${contributors.map((item) => html`
          <td-avatar username="${item == null ? void 0 : item.username}" content="${item == null ? void 0 : item.roleNames} ${item == null ? void 0 : item.username}"></td-avatar>
        `)}
      </div>
    </section>
  `;
}
function getContributors(platform, framework, componentName, contributorsData) {
  const taskReg = new RegExp(`api|interaction|design|ui|^${framework}$|${framework}-test`);
  if (!platform || !framework || !componentName || !contributorsData[platform])
    return [];
  const componentInfo = contributorsData[platform].find((item) => item.name === componentName);
  if (!componentInfo)
    return [];
  let { tasks } = componentInfo;
  tasks = tasks.filter((item) => item.name.search(taskReg) !== -1 && item.contributors.length > 0);
  const members = {};
  tasks.forEach((c) => {
    ["contributors", "pmcs"].forEach((key2) => {
      c[key2].forEach((m) => {
        if (members[m]) {
          members[m].role.push(c.name);
          members[m].roleName.push(c.fullName);
        } else {
          members[m] = { role: [c.name], roleName: [c.fullName] };
        }
      });
    });
  });
  return Object.keys(members).map((username) => {
    return {
      username,
      roleNames: [...new Set(members[username].roleName)].join("/"),
      ...members[username]
    };
  });
}
define$2({
  tag: "td-contributors",
  platform: "",
  framework: "",
  componentName: "",
  contributorsData: {
    get: (host, lastValue) => lastValue || {},
    set: (host, value2) => value2,
    connect: (host, key2, invalidate2) => {
      const cache2 = sessionStorage.getItem("__tdesign_contributors__");
      if (cache2) {
        const data = JSON.parse(cache2);
        Object.assign(host, { [key2]: data });
        invalidate2();
      } else {
        fetch(apiUrl).then((res) => res.json()).then((data) => {
          Object.assign(host, { [key2]: data });
          sessionStorage.setItem("__tdesign_contributors__", JSON.stringify(data));
          invalidate2();
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  },
  render: (host) => {
    const { platform, framework, componentName } = host;
    const contributors = getContributors(platform, framework, componentName, host.contributorsData);
    return renderContributors(contributors).css`${style$o}`;
  }
});
var style$n = '.TDesign-tooltip{position:relative}.TDesign-tooltip[data-placement=top] .TDesign-tooltip__popup{top:-36px}.TDesign-tooltip[data-placement=top] .TDesign-tooltip__popup:after{bottom:-12px;border-top-color:var(--bg-color-container)}.TDesign-tooltip[data-placement=bottom] .TDesign-tooltip__popup{bottom:-36px}.TDesign-tooltip[data-placement=bottom] .TDesign-tooltip__popup:after{top:-12px;border-bottom-color:var(--bg-color-container)}.TDesign-tooltip__popup{position:absolute;left:50%;transform:translate(-50%);color:var(--text-primary);border-radius:var(--border-radius);padding:4px 8px;white-space:nowrap;line-height:22px;visibility:hidden;opacity:0;z-index:900;transition:all .2s linear;background-color:var(--bg-color-container);box-shadow:0 3px 14px 2px #0000000d,0 8px 10px 1px #0000000f,0 5px 5px -3px #0000001a}.TDesign-tooltip__popup:after{content:"";z-index:2;width:0;height:0;border-style:solid;border-width:6px;border-color:transparent;left:50%;position:absolute;margin-left:-6px}.TDesign-tooltip__popup.show{opacity:1;visibility:visible}\n';
function handleClick$1(host) {
  if (host.triggerType !== "click")
    return;
  Object.assign(host, { showTip: true });
  setTimeout(() => Object.assign(host, { showTip: false }), host.duration);
}
function handleEnter(host) {
  if (host.triggerType !== "hover")
    return;
  Object.assign(host, { showTip: true });
}
function handleLeave(host) {
  if (host.triggerType !== "hover")
    return;
  Object.assign(host, { showTip: false });
}
define$2({
  tag: "td-tooltip",
  placement: "top",
  showTip: false,
  duration: 1800,
  triggerType: "click",
  render: (host) => {
    const { showTip, placement } = host;
    return html`
      <div class="TDesign-tooltip" data-placement="${placement}">
        <div onmouseover=${handleEnter} onmouseout=${handleLeave} onclick=${handleClick$1}>
          <slot></slot>
        </div>
        <div class="TDesign-tooltip__popup ${showTip ? "show" : ""}" onmouseover=${handleEnter} onmouseout=${handleLeave}>
          <slot name="content"></slot>
        </div>
      </div>
    `.css`${style$n}`;
  }
});
var style$m = ":host{flex-shrink:0}.TDesign-theme-tabs{min-width:60px;width:100%;height:32px;padding:2px;box-sizing:border-box;border-radius:var(--border-radius);background:var(--bg-color-component);position:relative;display:flex;justify-content:space-between}.TDesign-theme-tabs__block{background-color:var(--bg-color-tab-select);box-shadow:0 2px 4px #00000026;position:absolute;height:calc(100% - 4px);transition:all var(--anim-time-fn-easing) var(--anim-duration-moderate);border-radius:var(--border-radius)}.TDesign-theme-tabs .item{width:50%;height:28px;padding:4px;display:inline-flex;justify-content:center;align-items:center;box-sizing:border-box;color:var(--text-disabled);position:relative;cursor:pointer}.TDesign-theme-tabs .item svg{width:16px;height:16px;pointer-events:none;transition:all .2s linear}.TDesign-theme-tabs .item:hover:not(.active){color:var(--text-secondary)}.TDesign-theme-tabs .item.active.sun{color:#ffbd2e}.TDesign-theme-tabs .item.active.moon{color:#fff}\n";
var moonIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M9.99993 3.12494C6.20294 3.12494 3.12488 6.203 3.12488 10C3.12488 13.797 6.20294 16.8751 9.99993 16.8751C13.7969 16.8751 16.875 13.797 16.875 10C16.875 9.52352 16.8264 9.0577 16.7337 8.6075C16.6752 8.32295 16.4282 8.11628 16.1378 8.10872C15.8474 8.10117 15.5901 8.29473 15.5168 8.57585C15.1411 10.0167 13.8302 11.0795 12.2727 11.0795C10.4212 11.0795 8.92039 9.57869 8.92039 7.72726C8.92039 6.16969 9.98319 4.85879 11.4241 4.48312C11.7052 4.40983 11.8988 4.15249 11.8912 3.86207C11.8836 3.57165 11.677 3.32473 11.3924 3.26616C10.9422 3.1735 10.4764 3.12494 9.99993 3.12494Z" />\n</svg>\n';
var sunIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M9.99996 3.15217C10.5252 3.15217 10.951 2.72636 10.951 2.20109C10.951 1.67582 10.5252 1.25 9.99996 1.25C9.47469 1.25 9.04887 1.67582 9.04887 2.20109C9.04887 2.72636 9.47469 3.15217 9.99996 3.15217Z" />\n  <path fill="currentColor" d="M9.99992 4.29348C6.84829 4.29348 4.2934 6.84838 4.2934 10C4.2934 13.1516 6.84829 15.7065 9.99992 15.7065C13.1515 15.7065 15.7064 13.1516 15.7064 10C15.7064 6.84838 13.1515 4.29348 9.99992 4.29348Z" />\n  <path fill="currentColor" d="M16.4673 4.4837C16.4673 5.00896 16.0415 5.43478 15.5162 5.43478C14.991 5.43478 14.5652 5.00896 14.5652 4.4837C14.5652 3.95843 14.991 3.53261 15.5162 3.53261C16.0415 3.53261 16.4673 3.95843 16.4673 4.4837Z" />\n  <path fill="currentColor" d="M17.7989 10.9511C18.3241 10.9511 18.75 10.5253 18.75 10C18.75 9.47474 18.3241 9.04891 17.7989 9.04891C17.2736 9.04891 16.8478 9.47474 16.8478 10C16.8478 10.5253 17.2736 10.9511 17.7989 10.9511Z" />\n  <path fill="currentColor" d="M16.4673 15.5163C16.4673 16.0416 16.0415 16.4674 15.5162 16.4674C14.991 16.4674 14.5652 16.0416 14.5652 15.5163C14.5652 14.991 14.991 14.5652 15.5162 14.5652C16.0415 14.5652 16.4673 14.991 16.4673 15.5163Z" />\n  <path fill="currentColor" d="M9.99996 18.75C10.5252 18.75 10.951 18.3242 10.951 17.7989C10.951 17.2736 10.5252 16.8478 9.99996 16.8478C9.47469 16.8478 9.04887 17.2736 9.04887 17.7989C9.04887 18.3242 9.47469 18.75 9.99996 18.75Z" />\n  <path fill="currentColor" d="M5.43469 15.5163C5.43469 16.0416 5.00887 16.4674 4.4836 16.4674C3.95833 16.4674 3.53252 16.0416 3.53252 15.5163C3.53252 14.991 3.95833 14.5652 4.4836 14.5652C5.00887 14.5652 5.43469 14.991 5.43469 15.5163Z" />\n  <path fill="currentColor" d="M2.20096 10.9511C2.72623 10.9511 3.15205 10.5253 3.15205 10C3.15205 9.47474 2.72623 9.04891 2.20096 9.04891C1.67569 9.04891 1.24988 9.47474 1.24988 10C1.24988 10.5253 1.67569 10.9511 2.20096 10.9511Z" />\n  <path fill="currentColor" d="M5.43469 4.4837C5.43469 5.00896 5.00887 5.43478 4.4836 5.43478C3.95833 5.43478 3.53252 5.00896 3.53252 4.4837C3.53252 3.95843 3.95833 3.53261 4.4836 3.53261C5.00887 3.53261 5.43469 3.95843 5.43469 4.4837Z" />\n</svg>\n';
const storageChangeEvent = new CustomEvent("storageChange");
function handleTabClick$1(host, currentTheme) {
  document.documentElement.removeAttribute("theme-mode");
  Object.assign(host, { theme: currentTheme });
  document.documentElement.setAttribute("theme-mode", currentTheme);
}
function initBlockStyleMap(host) {
  requestAnimationFrame(() => {
    const { shadowRoot } = host;
    const items = shadowRoot.querySelectorAll(".item");
    let styleMap2 = {};
    items.forEach((item) => {
      if (!item.offsetWidth) {
        styleMap2 = null;
      } else {
        const { theme } = item.dataset;
        styleMap2[theme] = {
          width: `${item.offsetWidth}px`,
          left: `${item.offsetLeft}px`
        };
      }
    });
    Object.assign(host, { blockStyleMap: styleMap2 });
  });
}
define$2({
  tag: "td-theme-tabs",
  theme: {
    get: (_host, lastValue) => lastValue || "light",
    set: (_host, value2) => {
      if (value2) {
        sessionStorage.setItem("--tdesign-theme", value2);
        window.dispatchEvent(storageChangeEvent);
      }
      return value2;
    },
    connect: (host, key2, invalidate2) => {
      const lastTheme = sessionStorage.getItem("--tdesign-theme");
      if (lastTheme) {
        document.documentElement.removeAttribute("theme-mode");
        Object.assign(host, { [key2]: lastTheme });
        document.documentElement.setAttribute("theme-mode", lastTheme);
        invalidate2();
      }
      const observer = watchHtmlMode((themeMode) => Object.assign(host, { [key2]: themeMode }));
      return () => observer.disconnect();
    }
  },
  blockStyleMap: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2
  },
  render: (host) => {
    const { theme, blockStyleMap } = host;
    if (!blockStyleMap)
      initBlockStyleMap(host);
    const blockStyle = blockStyleMap ? blockStyleMap[theme] : {};
    return html`
      <div class="TDesign-theme-tabs">
        <div class="TDesign-theme-tabs__block" style=${blockStyle || {}}></div>
        <div onclick=${(host2) => handleTabClick$1(host2, "light")} data-theme="light" class="item sun ${theme === "light" ? "active" : ""}" innerHTML=${sunIcon}></div>
        <div onclick=${(host2) => handleTabClick$1(host2, "dark")} data-theme="dark" class="item moon ${theme === "dark" ? "active" : ""}" innerHTML=${moonIcon}></div>
      </div>
    `.css`${style$m}`;
  }
});
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var nprogress = { exports: {} };
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */
(function(module2, exports2) {
  (function(root, factory) {
    {
      module2.exports = factory();
    }
  })(commonjsGlobal, function() {
    var NProgress2 = {};
    NProgress2.version = "0.2.0";
    var Settings = NProgress2.settings = {
      minimum: 0.08,
      easing: "ease",
      positionUsing: "",
      speed: 200,
      trickle: true,
      trickleRate: 0.02,
      trickleSpeed: 800,
      showSpinner: true,
      barSelector: '[role="bar"]',
      spinnerSelector: '[role="spinner"]',
      parent: "body",
      template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    };
    NProgress2.configure = function(options) {
      var key2, value2;
      for (key2 in options) {
        value2 = options[key2];
        if (value2 !== void 0 && options.hasOwnProperty(key2))
          Settings[key2] = value2;
      }
      return this;
    };
    NProgress2.status = null;
    NProgress2.set = function(n) {
      var started = NProgress2.isStarted();
      n = clamp(n, Settings.minimum, 1);
      NProgress2.status = n === 1 ? null : n;
      var progress = NProgress2.render(!started), bar = progress.querySelector(Settings.barSelector), speed = Settings.speed, ease = Settings.easing;
      progress.offsetWidth;
      queue2(function(next) {
        if (Settings.positionUsing === "")
          Settings.positionUsing = NProgress2.getPositioningCSS();
        css(bar, barPositionCSS(n, speed, ease));
        if (n === 1) {
          css(progress, {
            transition: "none",
            opacity: 1
          });
          progress.offsetWidth;
          setTimeout(function() {
            css(progress, {
              transition: "all " + speed + "ms linear",
              opacity: 0
            });
            setTimeout(function() {
              NProgress2.remove();
              next();
            }, speed);
          }, speed);
        } else {
          setTimeout(next, speed);
        }
      });
      return this;
    };
    NProgress2.isStarted = function() {
      return typeof NProgress2.status === "number";
    };
    NProgress2.start = function() {
      if (!NProgress2.status)
        NProgress2.set(0);
      var work = function() {
        setTimeout(function() {
          if (!NProgress2.status)
            return;
          NProgress2.trickle();
          work();
        }, Settings.trickleSpeed);
      };
      if (Settings.trickle)
        work();
      return this;
    };
    NProgress2.done = function(force) {
      if (!force && !NProgress2.status)
        return this;
      return NProgress2.inc(0.3 + 0.5 * Math.random()).set(1);
    };
    NProgress2.inc = function(amount) {
      var n = NProgress2.status;
      if (!n) {
        return NProgress2.start();
      } else {
        if (typeof amount !== "number") {
          amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
        }
        n = clamp(n + amount, 0, 0.994);
        return NProgress2.set(n);
      }
    };
    NProgress2.trickle = function() {
      return NProgress2.inc(Math.random() * Settings.trickleRate);
    };
    (function() {
      var initial = 0, current = 0;
      NProgress2.promise = function($promise) {
        if (!$promise || $promise.state() === "resolved") {
          return this;
        }
        if (current === 0) {
          NProgress2.start();
        }
        initial++;
        current++;
        $promise.always(function() {
          current--;
          if (current === 0) {
            initial = 0;
            NProgress2.done();
          } else {
            NProgress2.set((initial - current) / initial);
          }
        });
        return this;
      };
    })();
    NProgress2.render = function(fromStart) {
      if (NProgress2.isRendered())
        return document.getElementById("nprogress");
      addClass(document.documentElement, "nprogress-busy");
      var progress = document.createElement("div");
      progress.id = "nprogress";
      progress.innerHTML = Settings.template;
      var bar = progress.querySelector(Settings.barSelector), perc = fromStart ? "-100" : toBarPerc(NProgress2.status || 0), parent = document.querySelector(Settings.parent), spinner;
      css(bar, {
        transition: "all 0 linear",
        transform: "translate3d(" + perc + "%,0,0)"
      });
      if (!Settings.showSpinner) {
        spinner = progress.querySelector(Settings.spinnerSelector);
        spinner && removeElement(spinner);
      }
      if (parent != document.body) {
        addClass(parent, "nprogress-custom-parent");
      }
      parent.appendChild(progress);
      return progress;
    };
    NProgress2.remove = function() {
      removeClass(document.documentElement, "nprogress-busy");
      removeClass(document.querySelector(Settings.parent), "nprogress-custom-parent");
      var progress = document.getElementById("nprogress");
      progress && removeElement(progress);
    };
    NProgress2.isRendered = function() {
      return !!document.getElementById("nprogress");
    };
    NProgress2.getPositioningCSS = function() {
      var bodyStyle = document.body.style;
      var vendorPrefix = "WebkitTransform" in bodyStyle ? "Webkit" : "MozTransform" in bodyStyle ? "Moz" : "msTransform" in bodyStyle ? "ms" : "OTransform" in bodyStyle ? "O" : "";
      if (vendorPrefix + "Perspective" in bodyStyle) {
        return "translate3d";
      } else if (vendorPrefix + "Transform" in bodyStyle) {
        return "translate";
      } else {
        return "margin";
      }
    };
    function clamp(n, min2, max2) {
      if (n < min2)
        return min2;
      if (n > max2)
        return max2;
      return n;
    }
    function toBarPerc(n) {
      return (-1 + n) * 100;
    }
    function barPositionCSS(n, speed, ease) {
      var barCSS;
      if (Settings.positionUsing === "translate3d") {
        barCSS = { transform: "translate3d(" + toBarPerc(n) + "%,0,0)" };
      } else if (Settings.positionUsing === "translate") {
        barCSS = { transform: "translate(" + toBarPerc(n) + "%,0)" };
      } else {
        barCSS = { "margin-left": toBarPerc(n) + "%" };
      }
      barCSS.transition = "all " + speed + "ms " + ease;
      return barCSS;
    }
    var queue2 = function() {
      var pending = [];
      function next() {
        var fn2 = pending.shift();
        if (fn2) {
          fn2(next);
        }
      }
      return function(fn2) {
        pending.push(fn2);
        if (pending.length == 1)
          next();
      };
    }();
    var css = function() {
      var cssPrefixes = ["Webkit", "O", "Moz", "ms"], cssProps = {};
      function camelCase(string2) {
        return string2.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(match, letter) {
          return letter.toUpperCase();
        });
      }
      function getVendorProp(name) {
        var style2 = document.body.style;
        if (name in style2)
          return name;
        var i = cssPrefixes.length, capName = name.charAt(0).toUpperCase() + name.slice(1), vendorName;
        while (i--) {
          vendorName = cssPrefixes[i] + capName;
          if (vendorName in style2)
            return vendorName;
        }
        return name;
      }
      function getStyleProp(name) {
        name = camelCase(name);
        return cssProps[name] || (cssProps[name] = getVendorProp(name));
      }
      function applyCss(element, prop, value2) {
        prop = getStyleProp(prop);
        element.style[prop] = value2;
      }
      return function(element, properties) {
        var args = arguments, prop, value2;
        if (args.length == 2) {
          for (prop in properties) {
            value2 = properties[prop];
            if (value2 !== void 0 && properties.hasOwnProperty(prop))
              applyCss(element, prop, value2);
          }
        } else {
          applyCss(element, args[1], args[2]);
        }
      };
    }();
    function hasClass(element, name) {
      var list = typeof element == "string" ? element : classList(element);
      return list.indexOf(" " + name + " ") >= 0;
    }
    function addClass(element, name) {
      var oldList = classList(element), newList = oldList + name;
      if (hasClass(oldList, name))
        return;
      element.className = newList.substring(1);
    }
    function removeClass(element, name) {
      var oldList = classList(element), newList;
      if (!hasClass(element, name))
        return;
      newList = oldList.replace(" " + name + " ", " ");
      element.className = newList.substring(1, newList.length - 1);
    }
    function classList(element) {
      return (" " + (element.className || "") + " ").replace(/\s+/gi, " ");
    }
    function removeElement(element) {
      element && element.parentNode && element.parentNode.removeChild(element);
    }
    return NProgress2;
  });
})(nprogress);
var NProgress = nprogress.exports;
var style$l = ":host{--content-margin-left: var(--aside-width)}@media screen and (max-width: 1200px){:host{--content-margin-left: 0}}.TDesign-page-doc{min-height:100vh;max-width:100vw;overflow-x:hidden}.TDesign-page-doc .TDesign-body{min-height:100vh;transition:all .2s var(--anim-time-fn-easing)}.TDesign-page-doc .TDesign-body.row{margin-left:var(--content-margin-left)}\n";
define$2({
  tag: "td-doc-layout",
  loaded: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value2) => value2,
    connect: (host, key2) => {
      function onLoad() {
        Object.assign(host, { [key2]: true });
        NProgress.done();
      }
      setTimeout(() => NProgress.done(), 3500);
      window.NProgress = NProgress;
      window.addEventListener("load", onLoad);
      !host.loaded && NProgress.start();
      return () => window.removeEventListener("load", onLoad);
    }
  },
  direction: "row",
  render: ({ direction }) => html`
      <div class="TDesign-page-doc">
        <slot name="header"></slot>
        <div class="TDesign-body ${direction}">
          <slot></slot>
        </div>
      </div>
    `.css`${style$l}`
});
var style$k = ':host{--collapse-display: none;--aside-top: 64px}@media screen and (max-width: 1200px){:host{--collapse-display: flex}}.TDesign-doc-aside{position:absolute;left:0;top:var(--aside-top);height:100vh;width:var(--aside-width, 260px);z-index:1300;box-sizing:border-box;padding-bottom:32px;background-color:var(--bg-color-container);color:var(--text-secondary);box-shadow:var(--aside-box-shadow);transition:transform .2s var(--anim-time-fn-easing),outline .2s var(--anim-time-fn-easing);outline:9999px solid transparent}.TDesign-doc-aside.hide{transform:translate3d(calc(-1 * var(--aside-width)),0,0)}.TDesign-doc-aside.show{transform:translateZ(0);outline-color:var(--text-disabled)}.TDesign-doc-aside.show+.TDesign-doc-aside-mask{display:block}.TDesign-doc-aside:after{content:"";width:100%;height:100px;position:absolute;left:0;bottom:-100px;background-color:var(--bg-color-container)}.TDesign-doc-aside__title{margin:8px 12px;font-size:16px;height:40px;line-height:40px;font-family:TencentSansW7}.TDesign-doc-aside__extra{max-width:calc(var(--aside-width) - 24px);position:relative;padding:0 12px;display:block}.TDesign-doc-aside-mask{content:"";position:fixed;left:0;top:0;width:100%;height:100%;z-index:600;display:none}.TDesign-doc-aside-collapse{position:fixed;left:var(--aside-width);top:160px;border-radius:0 3px 3px 0;box-shadow:2px 0 8px #00000042;width:40px;height:40px;align-items:center;justify-content:center;background-color:var(--bg-color-container);transition:all .2s var(--anim-time-fn-easing);display:var(--collapse-display)}.TDesign-doc-aside-collapse .icon svg{width:24px;height:24px;color:var(--text-primary)}.TDesign-doc-sidenav{height:100%;padding:0 0 0 12px;overflow:auto}.TDesign-doc-sidenav:hover::-webkit-scrollbar-thumb{background-color:var(--bg-color-scroll)}.TDesign-doc-sidenav::-webkit-scrollbar{width:12px;background:transparent}.TDesign-doc-sidenav::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:transparent}.TDesign-doc-sidenav-group__title{display:flex;align-items:center;font-size:12px;color:var(--text-placeholder);padding:14px 12px 4px;height:40px;box-sizing:border-box;position:relative;margin-top:8px;border-radius:var(--border-radius)}.TDesign-doc-sidenav-group__children{overflow:hidden}.TDesign-doc-sidenav-item{position:relative;margin-top:4px;max-width:calc(var(--aside-width) - 24px)}.TDesign-doc-sidenav-item .TDesign-doc-sidenav-link{display:block;height:40px;padding:0 12px;line-height:40px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-secondary);text-decoration:none;border-radius:var(--border-radius);transition:all .2s linear;gap:8px}.TDesign-doc-sidenav-item .TDesign-doc-sidenav-link:hover{color:var(--text-primary);background:var(--bg-color-container-hover)}.TDesign-doc-sidenav-item .TDesign-doc-sidenav-link.active{color:var(--text-anti);background-color:var(--brand-main)}.TDesign-doc-sidenav-item .TDesign-doc-sidenav-link.active .TDesign-doc-sidenav-link__tag{background:rgba(255,255,255,.22);color:#ffffff8c}.TDesign-doc-sidenav-item .TDesign-doc-sidenav-link__tag{font-size:12px;padding:2px 4px;color:#f5ba18;border-radius:3px;transition:.2s linear;background:rgba(245,186,24,.1)}\n';
var menuFoldIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M3.99902 7.97265L27.9978 8.00026L28.0001 6.00026L4.00132 5.97266L3.99902 7.97265Z" fill="currentColor" />\n  <path d="M15.0002 17.0003H27.999V15.0003H15.0002V17.0003Z" fill="currentColor" />\n  <path d="M3.99902 25.9727L27.9978 26.0003L28.0001 24.0003L4.00132 23.9727L3.99902 25.9727Z" fill="currentColor" />\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9335 15.1864C12.4668 15.5864 12.4668 16.3864 11.9335 16.7864L5.60017 21.5364C4.94094 22.0308 4.00017 21.5604 4.00017 20.7364L4.00017 11.2364C4.00017 10.4124 4.94094 9.94197 5.60017 10.4364L11.9335 15.1864ZM6.00017 13.2364L9.66684 15.9864L6.00017 18.7364L6.00017 13.2364Z" fill="currentColor" />\n</svg>\n';
var menuUnfoldIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M28.0011 24.0276L4.0023 24L4 26L27.9988 26.0276L28.0011 24.0276Z" fill="currentColor" />\n  <path d="M16.9999 15L4.00115 15L4.00115 17L16.9999 17V15Z" fill="currentColor" />\n  <path d="M28.0011 6.02761L4.0023 6L4 8L27.9988 8.02761L28.0011 6.02761Z" fill="currentColor" />\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0666 16.8139C19.5333 16.4139 19.5333 15.6139 20.0666 15.2139L26.3999 10.4639C27.0592 9.96944 27.9999 10.4398 27.9999 11.2639L27.9999 20.7639C27.9999 21.5879 27.0592 22.0583 26.3999 21.5639L20.0666 16.8139ZM25.9999 18.7639L22.3333 16.0139L25.9999 13.2639L25.9999 18.7639Z" fill="currentColor" />\n</svg>';
const replaceStateEvent = new CustomEvent("replaceState");
const originHistoryEvent = window.history.replaceState;
window.history.replaceState = (...args) => {
  originHistoryEvent.apply(window.history, args);
  window.dispatchEvent(replaceStateEvent);
};
function handleLinkClick(host, e, path) {
  e.preventDefault();
  const shadowRoot = e.target.getRootNode();
  const prevActiveNodes = shadowRoot.querySelectorAll(".active");
  prevActiveNodes.forEach((node) => node.classList.remove("active"));
  e.target.classList.toggle("active");
  requestAnimationFrame(() => dispatch$1(host, "change", { detail: path }));
}
function renderNav(host, nav, deep = 0) {
  if (Array.isArray(nav))
    return nav.map((item) => renderNav(host, item, deep));
  const isActive2 = location.pathname === nav.path || location.hash.slice(1) === nav.path;
  const hasUpdate = () => {
    const currentSite = location.pathname.split("/")[1];
    if (!currentSite)
      return false;
    const { updateNotice } = host;
    const { [currentSite]: siteUpdateNotice } = updateNotice;
    if (!siteUpdateNotice)
      return false;
    return siteUpdateNotice.some((item) => nav.title.includes(item));
  };
  if (nav.children) {
    return html`
      <div class="TDesign-doc-sidenav-group TDesign-doc-sidenav-group--deep${deep}">
        <span class="TDesign-doc-sidenav-group__title">${nav.title}</span>
        <div class="TDesign-doc-sidenav-group__children">${renderNav(host, nav.children, deep + 1)}</div>
      </div>
    `;
  }
  return html`
    <div class="TDesign-doc-sidenav-item">
      <a
        href="${nav.path}"
        class="TDesign-doc-sidenav-link ${isActive2 ? "active" : ""}"
        onclick=${(host2, e) => handleLinkClick(host2, e, nav.path)}
      >
        ${nav.title}
        ${hasUpdate() ? html`<span class="TDesign-doc-sidenav-link__tag">Update</span>` : null}
      </a>
    </div>
  `;
}
function toggleCollapseAside(host) {
  if (!host.shadowRoot)
    return;
  const asideClassList = host.shadowRoot.querySelector(".TDesign-doc-aside").classList;
  if (asideClassList.contains("hide")) {
    asideClassList.remove("hide");
    asideClassList.add("show");
  } else {
    asideClassList.remove("show");
    asideClassList.add("hide");
  }
  Object.assign(host, { collapse: !host.collapse });
}
define$2({
  tag: "td-doc-aside",
  routerList: {
    get: (_host, lastValue) => lastValue || [],
    set: (_host, value2) => value2
  },
  title: "",
  patchDom: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value2) => value2,
    connect: patchShadowDomIntoDom
  },
  updateNotice: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value2) => value2,
    connect: (host) => {
      fetch("https://tdesign-site-services.surge.sh/components-notice.json").then((res) => res.json()).then((res) => {
        host.updateNotice = res;
      }).catch(console.error);
    }
  },
  asideStyle: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2,
    connect: (host) => {
      function setFixed() {
        if (!host.shadowRoot)
          return;
        const { shadowRoot } = host;
        const { scrollTop } = document.documentElement;
        const aside = shadowRoot.querySelector(".TDesign-doc-aside") || { style: {} };
        const top2 = getComputedStyle(host).getPropertyValue("--aside-top") || "64px";
        if (scrollTop >= parseFloat(top2)) {
          Object.assign(aside.style, { position: "fixed", top: "0" });
        } else {
          Object.assign(aside.style, { position: "absolute", top: top2 });
        }
      }
      function handleResize() {
        if (!host.shadowRoot)
          return;
        const isMobileResponse = window.innerWidth < 1200;
        const asideClassList = host.shadowRoot.querySelector(".TDesign-doc-aside").classList;
        if (isMobileResponse) {
          if (asideClassList.contains("show"))
            return;
          asideClassList.remove("show");
          asideClassList.remove("hide");
          asideClassList.add("hide");
        } else {
          asideClassList.remove("hide");
          asideClassList.remove("show");
        }
      }
      function refreshAside() {
        Object.assign(host, { routerList: host.routerList.slice() });
      }
      function handleRouterChange(e) {
        if (!host.shadowRoot)
          return;
        const { shadowRoot } = host;
        requestAnimationFrame(() => {
          let currentRoute = location.pathname;
          if (location.pathname === "/" && location.hash) {
            currentRoute = location.hash.slice(1);
          }
          const linkNodes = Array.from(shadowRoot.querySelectorAll(".TDesign-doc-sidenav-link"));
          const prevActiveNodes = Array.from(shadowRoot.querySelectorAll(".TDesign-doc-sidenav-link.active"));
          const nextActiveNode = linkNodes.find((node) => {
            const urlObj = new URL(node.href);
            return urlObj.host === location.host && urlObj.pathname === currentRoute;
          });
          if (!nextActiveNode)
            return;
          if (prevActiveNodes.length === 1 && prevActiveNodes.some((node) => node.href === nextActiveNode.href))
            return;
          prevActiveNodes.forEach((node) => node.classList.remove("active"));
          nextActiveNode.classList.toggle("active");
        });
      }
      requestAnimationFrame(() => {
        handleResize();
      });
      window.addEventListener("load", refreshAside);
      window.addEventListener("resize", handleResize);
      document.addEventListener("scroll", setFixed);
      window.addEventListener("popstate", handleRouterChange);
      window.addEventListener("pushState", handleRouterChange);
      window.addEventListener("replaceState", handleRouterChange);
      return () => {
        window.removeEventListener("load", refreshAside);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("scroll", setFixed);
        window.removeEventListener("popstate", handleRouterChange);
        window.removeEventListener("pushState", handleRouterChange);
        window.removeEventListener("replaceState", handleRouterChange);
      };
    }
  },
  collapse: false,
  render: (host) => {
    const { routerList, title, collapse } = host;
    return html`
      <aside class="TDesign-doc-aside">
        <div class="TDesign-doc-aside-collapse" onclick="${toggleCollapseAside}">
          <i class="icon" innerHTML="${collapse ? menuUnfoldIcon : menuFoldIcon}"></i>
        </div>
        <div class="TDesign-doc-sidenav">
          ${title && html`<h2 class="TDesign-doc-aside__title">${title}</h2>`}
          <slot class="TDesign-doc-aside__extra" name="extra"></slot>
          ${renderNav(host, routerList)}
        </div>
      </aside>
      <div class="TDesign-doc-aside-mask" onclick="${toggleCollapseAside}"></div>
    `.css`${style$k}`;
  }
});
var style$j = ".TDesign-doc-search{position:relative;width:200px;height:32px;box-sizing:border-box;display:inline-flex;align-items:center}.TDesign-doc-search__icon{position:absolute;right:8px;top:50%;width:20px;height:20px;margin-top:-10px;color:var(--text-secondary)}.TDesign-doc-search__inner{width:100%;height:100%;padding:4px 36px 4px 8px;box-sizing:border-box;color:var(--text-secondary);border-radius:var(--border-radius);line-height:22px;font-size:14px;border:1px solid var(--component-border);transition:all .2s linear;outline:none;background:transparent}.TDesign-doc-search__inner::placeholder{line-height:22px}.TDesign-doc-search__inner:hover{border-color:var(--brand-main)}.TDesign-doc-search__inner:focus{border-color:var(--brand-main);box-shadow:0 0 0 2px var(--brand-main-focus)}\n";
var searchIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M8.125 2.5C5.0184 2.5 2.5 5.0184 2.5 8.125C2.5 11.2316 5.0184 13.75 8.125 13.75C9.22568 13.75 10.2525 13.4339 11.1197 12.8874L15.8839 17.6517L16.7678 16.7678L12.1025 12.1025C13.1204 11.0846 13.75 9.6783 13.75 8.125C13.75 5.0184 11.2316 2.5 8.125 2.5ZM8.125 3.75C10.5412 3.75 12.5 5.70875 12.5 8.125C12.5 10.5412 10.5412 12.5 8.125 12.5C5.70875 12.5 3.75 10.5412 3.75 8.125C3.75 5.70875 5.70875 3.75 8.125 3.75Z" />\n</svg>\n';
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd)
    define([], factory);
  else if (typeof exports === "object")
    exports["docsearch"] = factory();
  root["docsearch"] = factory();
})(typeof window !== "undefined" ? window : globalThis, function() {
  return function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module2 = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(
        module2.exports,
        module2,
        module2.exports,
        __webpack_require__
      );
      module2.l = true;
      return module2.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports2, name, getter) {
      if (!__webpack_require__.o(exports2, name)) {
        Object.defineProperty(exports2, name, {
          configurable: false,
          enumerable: true,
          get: getter
        });
      }
    };
    __webpack_require__.n = function(module2) {
      var getter = module2 && module2.__esModule ? function getDefault() {
        return module2["default"];
      } : function getModuleExports() {
        return module2;
      };
      __webpack_require__.d(getter, "a", getter);
      return getter;
    };
    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 22);
  }([
    function(module2, exports2, __webpack_require__) {
      var DOM = __webpack_require__(1);
      function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }
      module2.exports = {
        isArray: null,
        isFunction: null,
        isObject: null,
        bind: null,
        each: null,
        map: null,
        mixin: null,
        isMsie: function(agentString) {
          if (agentString === void 0) {
            agentString = navigator.userAgent;
          }
          if (/(msie|trident)/i.test(agentString)) {
            var match = agentString.match(/(msie |rv:)(\d+(.\d+)?)/i);
            if (match) {
              return match[2];
            }
          }
          return false;
        },
        escapeRegExChars: function(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        isNumber: function(obj) {
          return typeof obj === "number";
        },
        toStr: function toStr(s) {
          return s === void 0 || s === null ? "" : s + "";
        },
        cloneDeep: function cloneDeep(obj) {
          var clone = this.mixin({}, obj);
          var self2 = this;
          this.each(clone, function(value2, key2) {
            if (value2) {
              if (self2.isArray(value2)) {
                clone[key2] = [].concat(value2);
              } else if (self2.isObject(value2)) {
                clone[key2] = self2.cloneDeep(value2);
              }
            }
          });
          return clone;
        },
        error: function(msg) {
          throw new Error(msg);
        },
        every: function(obj, test) {
          var result = true;
          if (!obj) {
            return result;
          }
          this.each(obj, function(val, key2) {
            if (result) {
              result = test.call(null, val, key2, obj) && result;
            }
          });
          return !!result;
        },
        any: function(obj, test) {
          var found = false;
          if (!obj) {
            return found;
          }
          this.each(obj, function(val, key2) {
            if (test.call(null, val, key2, obj)) {
              found = true;
              return false;
            }
          });
          return found;
        },
        getUniqueId: function() {
          var counter = 0;
          return function() {
            return counter++;
          };
        }(),
        templatify: function templatify(obj) {
          if (this.isFunction(obj)) {
            return obj;
          }
          var $template = DOM.element(obj);
          if ($template.prop("tagName") === "SCRIPT") {
            return function template() {
              return $template.text();
            };
          }
          return function template() {
            return String(obj);
          };
        },
        defer: function(fn2) {
          setTimeout(fn2, 0);
        },
        noop: function() {
        },
        formatPrefix: function(prefix, noPrefix) {
          return noPrefix ? "" : prefix + "-";
        },
        className: function(prefix, clazz, skipDot) {
          return (skipDot ? "" : ".") + prefix + clazz;
        },
        escapeHighlightedString: function(str, highlightPreTag, highlightPostTag) {
          highlightPreTag = highlightPreTag || "<em>";
          var pre = document.createElement("div");
          pre.appendChild(document.createTextNode(highlightPreTag));
          highlightPostTag = highlightPostTag || "</em>";
          var post = document.createElement("div");
          post.appendChild(document.createTextNode(highlightPostTag));
          var div = document.createElement("div");
          div.appendChild(document.createTextNode(str));
          return div.innerHTML.replace(RegExp(escapeRegExp(pre.innerHTML), "g"), highlightPreTag).replace(
            RegExp(escapeRegExp(post.innerHTML), "g"),
            highlightPostTag
          );
        }
      };
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = { element: null };
    },
    function(module2, exports2) {
      var hasOwn = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      module2.exports = function forEach(obj, fn2, ctx) {
        if (toString.call(fn2) !== "[object Function]") {
          throw new TypeError("iterator must be a function");
        }
        var l = obj.length;
        if (l === +l) {
          for (var i = 0; i < l; i++) {
            fn2.call(ctx, obj[i], i, obj);
          }
        } else {
          for (var k in obj) {
            if (hasOwn.call(obj, k)) {
              fn2.call(ctx, obj[k], k, obj);
            }
          }
        }
      };
    },
    function(module2, exports2) {
      module2.exports = function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
      };
    },
    function(module2, exports2) {
      var g;
      g = function() {
        return this;
      }();
      try {
        g = g || Function("return this")() || (1, eval)("this");
      } catch (e) {
        if (typeof window === "object")
          g = window;
      }
      module2.exports = g;
    },
    function(module2, exports2, __webpack_require__) {
      var inherits = __webpack_require__(12);
      function AlgoliaSearchError(message, extraProperties) {
        var forEach = __webpack_require__(2);
        var error = this;
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, this.constructor);
        } else {
          error.stack = new Error().stack || "Cannot get a stacktrace, browser is too old";
        }
        this.name = "AlgoliaSearchError";
        this.message = message || "Unknown error";
        if (extraProperties) {
          forEach(extraProperties, function addToErrorObject(value2, key2) {
            error[key2] = value2;
          });
        }
      }
      inherits(AlgoliaSearchError, Error);
      function createCustomError(name, message) {
        function AlgoliaSearchCustomError() {
          var args = Array.prototype.slice.call(arguments, 0);
          if (typeof args[0] !== "string") {
            args.unshift(message);
          }
          AlgoliaSearchError.apply(this, args);
          this.name = "AlgoliaSearch" + name + "Error";
        }
        inherits(AlgoliaSearchCustomError, AlgoliaSearchError);
        return AlgoliaSearchCustomError;
      }
      module2.exports = {
        AlgoliaSearchError,
        UnparsableJSON: createCustomError(
          "UnparsableJSON",
          "Could not parse the incoming response as JSON, see err.more for details"
        ),
        RequestTimeout: createCustomError(
          "RequestTimeout",
          "Request timedout before getting a response"
        ),
        Network: createCustomError(
          "Network",
          "Network issue, see err.more for details"
        ),
        JSONPScriptFail: createCustomError(
          "JSONPScriptFail",
          "<script> was loaded but did not call our provided callback"
        ),
        JSONPScriptError: createCustomError(
          "JSONPScriptError",
          "<script> unable to load due to an `error` event on it"
        ),
        Unknown: createCustomError("Unknown", "Unknown error occured")
      };
    },
    function(module2, exports2) {
      var toString = {}.toString;
      module2.exports = Array.isArray || function(arr) {
        return toString.call(arr) == "[object Array]";
      };
    },
    function(module2, exports2, __webpack_require__) {
      var foreach = __webpack_require__(2);
      module2.exports = function map(arr, fn2) {
        var newArr = [];
        foreach(arr, function(item, itemIndex) {
          newArr.push(fn2(item, itemIndex, arr));
        });
        return newArr;
      };
    },
    function(module2, exports2, __webpack_require__) {
      (function(process) {
        exports2 = module2.exports = __webpack_require__(39);
        exports2.log = log2;
        exports2.formatArgs = formatArgs;
        exports2.save = save;
        exports2.load = load;
        exports2.useColors = useColors;
        exports2.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
        exports2.colors = [
          "lightseagreen",
          "forestgreen",
          "goldenrod",
          "dodgerblue",
          "darkorchid",
          "crimson"
        ];
        function useColors() {
          if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
            return true;
          }
          return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
        }
        exports2.formatters.j = function(v) {
          try {
            return JSON.stringify(v);
          } catch (err) {
            return "[UnexpectedJSONParseError]: " + err.message;
          }
        };
        function formatArgs(args) {
          var useColors2 = this.useColors;
          args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports2.humanize(this.diff);
          if (!useColors2)
            return;
          var c = "color: " + this.color;
          args.splice(1, 0, c, "color: inherit");
          var index = 0;
          var lastC = 0;
          args[0].replace(/%[a-zA-Z%]/g, function(match) {
            if ("%%" === match)
              return;
            index++;
            if ("%c" === match) {
              lastC = index;
            }
          });
          args.splice(lastC, 0, c);
        }
        function log2() {
          return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
        }
        function save(namespaces) {
          try {
            if (null == namespaces) {
              exports2.storage.removeItem("debug");
            } else {
              exports2.storage.debug = namespaces;
            }
          } catch (e) {
          }
        }
        function load() {
          var r;
          try {
            r = exports2.storage.debug;
          } catch (e) {
          }
          if (!r && typeof process !== "undefined" && "env" in process) {
            r = Object({ NODE_ENV: "production" }).DEBUG;
          }
          return r;
        }
        exports2.enable(load());
        function localstorage() {
          try {
            return window.localStorage;
          } catch (e) {
          }
        }
      }).call(exports2, __webpack_require__(9));
    },
    function(module2, exports2) {
      var process = module2.exports = {};
      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
      }
      function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
      }
      (function() {
        try {
          if (typeof setTimeout === "function") {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === "function") {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
        }
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
        }
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            return cachedClearTimeout.call(null, marker);
          } catch (e2) {
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue2 = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue2 = currentQueue.concat(queue2);
        } else {
          queueIndex = -1;
        }
        if (queue2.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue2.length;
        while (len) {
          currentQueue = queue2;
          queue2 = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue2.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue2.push(new Item(fun, args));
        if (queue2.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process.title = "browser";
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = "";
      process.versions = {};
      function noop() {
      }
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function(name) {
        return [];
      };
      process.binding = function(name) {
        throw new Error("process.binding is not supported");
      };
      process.cwd = function() {
        return "/";
      };
      process.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
      };
      process.umask = function() {
        return 0;
      };
    },
    function(module2, exports2, __webpack_require__) {
      var immediate = __webpack_require__(53);
      var splitter = /\s+/;
      module2.exports = {
        onSync,
        onAsync,
        off,
        trigger
      };
      function on(method, types, cb, context2) {
        var type;
        if (!cb) {
          return this;
        }
        types = types.split(splitter);
        cb = context2 ? bindContext(cb, context2) : cb;
        this._callbacks = this._callbacks || {};
        while (type = types.shift()) {
          this._callbacks[type] = this._callbacks[type] || {
            sync: [],
            async: []
          };
          this._callbacks[type][method].push(cb);
        }
        return this;
      }
      function onAsync(types, cb, context2) {
        return on.call(this, "async", types, cb, context2);
      }
      function onSync(types, cb, context2) {
        return on.call(this, "sync", types, cb, context2);
      }
      function off(types) {
        var type;
        if (!this._callbacks) {
          return this;
        }
        types = types.split(splitter);
        while (type = types.shift()) {
          delete this._callbacks[type];
        }
        return this;
      }
      function trigger(types) {
        var type;
        var callbacks2;
        var args;
        var syncFlush;
        var asyncFlush;
        if (!this._callbacks) {
          return this;
        }
        types = types.split(splitter);
        args = [].slice.call(arguments, 1);
        while ((type = types.shift()) && (callbacks2 = this._callbacks[type])) {
          syncFlush = getFlush(callbacks2.sync, this, [type].concat(args));
          asyncFlush = getFlush(callbacks2.async, this, [type].concat(args));
          if (syncFlush()) {
            immediate(asyncFlush);
          }
        }
        return this;
      }
      function getFlush(callbacks2, context2, args) {
        return flush;
        function flush() {
          var cancelled;
          for (var i = 0, len = callbacks2.length; !cancelled && i < len; i += 1) {
            cancelled = callbacks2[i].apply(context2, args) === false;
          }
          return !cancelled;
        }
      }
      function bindContext(fn2, context2) {
        return fn2.bind ? fn2.bind(context2) : function() {
          fn2.apply(context2, [].slice.call(arguments, 0));
        };
      }
    },
    function(module2, exports2, __webpack_require__) {
      var _ = __webpack_require__(0);
      var css = {
        wrapper: { position: "relative", display: "inline-block" },
        hint: {
          position: "absolute",
          top: "0",
          left: "0",
          borderColor: "transparent",
          boxShadow: "none",
          opacity: "1"
        },
        input: {
          position: "relative",
          verticalAlign: "top",
          backgroundColor: "transparent"
        },
        inputWithNoHint: { position: "relative", verticalAlign: "top" },
        dropdown: {
          position: "absolute",
          top: "100%",
          left: "0",
          zIndex: "100",
          display: "none"
        },
        suggestions: { display: "block" },
        suggestion: { whiteSpace: "nowrap", cursor: "pointer" },
        suggestionChild: { whiteSpace: "normal" },
        ltr: { left: "0", right: "auto" },
        rtl: { left: "auto", right: "0" },
        defaultClasses: {
          root: "algolia-autocomplete",
          prefix: "aa",
          noPrefix: false,
          dropdownMenu: "dropdown-menu",
          input: "input",
          hint: "hint",
          suggestions: "suggestions",
          suggestion: "suggestion",
          cursor: "cursor",
          dataset: "dataset",
          empty: "empty"
        },
        appendTo: {
          wrapper: { position: "absolute", zIndex: "100", display: "none" },
          input: {},
          inputWithNoHint: {},
          dropdown: { display: "block" }
        }
      };
      if (_.isMsie()) {
        _.mixin(css.input, {
          backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
        });
      }
      if (_.isMsie() && _.isMsie() <= 7) {
        _.mixin(css.input, { marginTop: "-1px" });
      }
      module2.exports = css;
    },
    function(module2, exports2) {
      if (typeof Object.create === "function") {
        module2.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        module2.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = buildSearchMethod;
      var errors = __webpack_require__(5);
      function buildSearchMethod(queryParam, url) {
        return function search(query, args, callback) {
          if (typeof query === "function" && typeof args === "object" || typeof callback === "object") {
            throw new errors.AlgoliaSearchError(
              "index.search usage is index.search(query, params, cb)"
            );
          }
          if (arguments.length === 0 || typeof query === "function") {
            callback = query;
            query = "";
          } else if (arguments.length === 1 || typeof args === "function") {
            callback = args;
            args = void 0;
          }
          if (typeof query === "object" && query !== null) {
            args = query;
            query = void 0;
          } else if (query === void 0 || query === null) {
            query = "";
          }
          var params = "";
          if (query !== void 0) {
            params += queryParam + "=" + encodeURIComponent(query);
          }
          var additionalUA;
          if (args !== void 0) {
            if (args.additionalUA) {
              additionalUA = args.additionalUA;
              delete args.additionalUA;
            }
            params = this.as._getSearchParams(args, params);
          }
          return this._search(params, url, callback, additionalUA);
        };
      }
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = function omit(obj, test) {
        var keys = __webpack_require__(36);
        var foreach = __webpack_require__(2);
        var filtered = {};
        foreach(keys(obj), function doFilter(keyName) {
          if (test(keyName) !== true) {
            filtered[keyName] = obj[keyName];
          }
        });
        return filtered;
      };
    },
    function(module2, exports2) {
      (function(global2, factory) {
        module2.exports = factory(global2);
      })(window, function(window2) {
        var Zepto = function() {
          var undefined$1, key2, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice, document2 = window2.document, elementDisplay = {}, classCache = {}, cssNumber = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
          }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, capitalRE = /([A-Z])/g, methodAttributes = [
            "val",
            "css",
            "html",
            "text",
            "data",
            "width",
            "height",
            "offset"
          ], adjacencyOperators = ["after", "prepend", "before", "append"], table = document2.createElement("table"), tableRow = document2.createElement("tr"), containers = {
            tr: document2.createElement("tbody"),
            tbody: table,
            thead: table,
            tfoot: table,
            td: tableRow,
            th: tableRow,
            "*": document2.createElement("div")
          }, readyRE = /complete|loaded|interactive/, simpleSelectorRE = /^[\w-]*$/, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq, tempParent = document2.createElement("div"), propMap = {
            tabindex: "tabIndex",
            readonly: "readOnly",
            for: "htmlFor",
            class: "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
          }, isArray = Array.isArray || function(object) {
            return object instanceof Array;
          };
          zepto.matches = function(element, selector) {
            if (!selector || !element || element.nodeType !== 1)
              return false;
            var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector)
              return matchesSelector.call(element, selector);
            var match, parent = element.parentNode, temp = !parent;
            if (temp)
              (parent = tempParent).appendChild(element);
            match = ~zepto.qsa(parent, selector).indexOf(element);
            temp && tempParent.removeChild(element);
            return match;
          };
          function type(obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
          }
          function isFunction(value2) {
            return type(value2) == "function";
          }
          function isWindow(obj) {
            return obj != null && obj == obj.window;
          }
          function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
          }
          function isObject(obj) {
            return type(obj) == "object";
          }
          function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
          }
          function likeArray(obj) {
            var length = !!obj && "length" in obj && obj.length, type2 = $.type(obj);
            return "function" != type2 && !isWindow(obj) && ("array" == type2 || length === 0 || typeof length == "number" && length > 0 && length - 1 in obj);
          }
          function compact(array) {
            return filter.call(array, function(item) {
              return item != null;
            });
          }
          function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array;
          }
          camelize = function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
              return chr ? chr.toUpperCase() : "";
            });
          };
          function dasherize(str) {
            return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
          }
          uniq = function(array) {
            return filter.call(array, function(item, idx) {
              return array.indexOf(item) == idx;
            });
          };
          function classRE(name) {
            return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
          }
          function maybeAddPx(name, value2) {
            return typeof value2 == "number" && !cssNumber[dasherize(name)] ? value2 + "px" : value2;
          }
          function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
              element = document2.createElement(nodeName);
              document2.body.appendChild(element);
              display = getComputedStyle(element, "").getPropertyValue(
                "display"
              );
              element.parentNode.removeChild(element);
              display == "none" && (display = "block");
              elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
          }
          function children(element) {
            return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
              if (node.nodeType == 1)
                return node;
            });
          }
          function Z(dom, selector) {
            var i, len = dom ? dom.length : 0;
            for (i = 0; i < len; i++)
              this[i] = dom[i];
            this.length = len;
            this.selector = selector || "";
          }
          zepto.fragment = function(html2, name, properties) {
            var dom, nodes, container;
            if (singleTagRE.test(html2))
              dom = $(document2.createElement(RegExp.$1));
            if (!dom) {
              if (html2.replace)
                html2 = html2.replace(tagExpanderRE, "<$1></$2>");
              if (name === undefined$1)
                name = fragmentRE.test(html2) && RegExp.$1;
              if (!(name in containers))
                name = "*";
              container = containers[name];
              container.innerHTML = "" + html2;
              dom = $.each(slice.call(container.childNodes), function() {
                container.removeChild(this);
              });
            }
            if (isPlainObject(properties)) {
              nodes = $(dom);
              $.each(properties, function(key3, value2) {
                if (methodAttributes.indexOf(key3) > -1)
                  nodes[key3](value2);
                else
                  nodes.attr(key3, value2);
              });
            }
            return dom;
          };
          zepto.Z = function(dom, selector) {
            return new Z(dom, selector);
          };
          zepto.isZ = function(object) {
            return object instanceof zepto.Z;
          };
          zepto.init = function(selector, context2) {
            var dom;
            if (!selector)
              return zepto.Z();
            else if (typeof selector == "string") {
              selector = selector.trim();
              if (selector[0] == "<" && fragmentRE.test(selector))
                dom = zepto.fragment(selector, RegExp.$1, context2), selector = null;
              else if (context2 !== undefined$1)
                return $(context2).find(selector);
              else
                dom = zepto.qsa(document2, selector);
            } else if (isFunction(selector))
              return $(document2).ready(selector);
            else if (zepto.isZ(selector))
              return selector;
            else {
              if (isArray(selector))
                dom = compact(selector);
              else if (isObject(selector))
                dom = [selector], selector = null;
              else if (fragmentRE.test(selector))
                dom = zepto.fragment(selector.trim(), RegExp.$1, context2), selector = null;
              else if (context2 !== undefined$1)
                return $(context2).find(selector);
              else
                dom = zepto.qsa(document2, selector);
            }
            return zepto.Z(dom, selector);
          };
          $ = function(selector, context2) {
            return zepto.init(selector, context2);
          };
          function extend(target, source, deep) {
            for (key2 in source)
              if (deep && (isPlainObject(source[key2]) || isArray(source[key2]))) {
                if (isPlainObject(source[key2]) && !isPlainObject(target[key2]))
                  target[key2] = {};
                if (isArray(source[key2]) && !isArray(target[key2]))
                  target[key2] = [];
                extend(target[key2], source[key2], deep);
              } else if (source[key2] !== undefined$1)
                target[key2] = source[key2];
          }
          $.extend = function(target) {
            var deep, args = slice.call(arguments, 1);
            if (typeof target == "boolean") {
              deep = target;
              target = args.shift();
            }
            args.forEach(function(arg) {
              extend(target, arg, deep);
            });
            return target;
          };
          zepto.qsa = function(element, selector) {
            var found, maybeID = selector[0] == "#", maybeClass = !maybeID && selector[0] == ".", nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = simpleSelectorRE.test(nameOnly);
            return element.getElementById && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : slice.call(
              isSimple && !maybeID && element.getElementsByClassName ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector)
            );
          };
          function filtered(nodes, selector) {
            return selector == null ? $(nodes) : $(nodes).filter(selector);
          }
          $.contains = document2.documentElement.contains ? function(parent, node) {
            return parent !== node && parent.contains(node);
          } : function(parent, node) {
            while (node && (node = node.parentNode))
              if (node === parent)
                return true;
            return false;
          };
          function funcArg(context2, arg, idx, payload) {
            return isFunction(arg) ? arg.call(context2, idx, payload) : arg;
          }
          function setAttribute(node, name, value2) {
            value2 == null ? node.removeAttribute(name) : node.setAttribute(name, value2);
          }
          function className(node, value2) {
            var klass = node.className || "", svg = klass && klass.baseVal !== undefined$1;
            if (value2 === undefined$1)
              return svg ? klass.baseVal : klass;
            svg ? klass.baseVal = value2 : node.className = value2;
          }
          function deserializeValue(value2) {
            try {
              return value2 ? value2 == "true" || (value2 == "false" ? false : value2 == "null" ? null : +value2 + "" == value2 ? +value2 : /^[\[\{]/.test(value2) ? $.parseJSON(value2) : value2) : value2;
            } catch (e) {
              return value2;
            }
          }
          $.type = type;
          $.isFunction = isFunction;
          $.isWindow = isWindow;
          $.isArray = isArray;
          $.isPlainObject = isPlainObject;
          $.isEmptyObject = function(obj) {
            var name;
            for (name in obj)
              return false;
            return true;
          };
          $.isNumeric = function(val) {
            var num = Number(val), type2 = typeof val;
            return val != null && type2 != "boolean" && (type2 != "string" || val.length) && !isNaN(num) && isFinite(num) || false;
          };
          $.inArray = function(elem, array, i) {
            return emptyArray.indexOf.call(array, elem, i);
          };
          $.camelCase = camelize;
          $.trim = function(str) {
            return str == null ? "" : String.prototype.trim.call(str);
          };
          $.uuid = 0;
          $.support = {};
          $.expr = {};
          $.noop = function() {
          };
          $.map = function(elements, callback) {
            var value2, values = [], i, key3;
            if (likeArray(elements))
              for (i = 0; i < elements.length; i++) {
                value2 = callback(elements[i], i);
                if (value2 != null)
                  values.push(value2);
              }
            else
              for (key3 in elements) {
                value2 = callback(elements[key3], key3);
                if (value2 != null)
                  values.push(value2);
              }
            return flatten(values);
          };
          $.each = function(elements, callback) {
            var i, key3;
            if (likeArray(elements)) {
              for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false)
                  return elements;
            } else {
              for (key3 in elements)
                if (callback.call(elements[key3], key3, elements[key3]) === false)
                  return elements;
            }
            return elements;
          };
          $.grep = function(elements, callback) {
            return filter.call(elements, callback);
          };
          if (window2.JSON)
            $.parseJSON = JSON.parse;
          $.each(
            "Boolean Number String Function Array Date RegExp Object Error".split(
              " "
            ),
            function(i, name) {
              class2type["[object " + name + "]"] = name.toLowerCase();
            }
          );
          $.fn = {
            constructor: zepto.Z,
            length: 0,
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            splice: emptyArray.splice,
            indexOf: emptyArray.indexOf,
            concat: function() {
              var i, value2, args = [];
              for (i = 0; i < arguments.length; i++) {
                value2 = arguments[i];
                args[i] = zepto.isZ(value2) ? value2.toArray() : value2;
              }
              return concat.apply(
                zepto.isZ(this) ? this.toArray() : this,
                args
              );
            },
            map: function(fn2) {
              return $(
                $.map(this, function(el, i) {
                  return fn2.call(el, i, el);
                })
              );
            },
            slice: function() {
              return $(slice.apply(this, arguments));
            },
            ready: function(callback) {
              if (readyRE.test(document2.readyState) && document2.body)
                callback($);
              else
                document2.addEventListener(
                  "DOMContentLoaded",
                  function() {
                    callback($);
                  },
                  false
                );
              return this;
            },
            get: function(idx) {
              return idx === undefined$1 ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
            },
            toArray: function() {
              return this.get();
            },
            size: function() {
              return this.length;
            },
            remove: function() {
              return this.each(function() {
                if (this.parentNode != null)
                  this.parentNode.removeChild(this);
              });
            },
            each: function(callback) {
              emptyArray.every.call(this, function(el, idx) {
                return callback.call(el, idx, el) !== false;
              });
              return this;
            },
            filter: function(selector) {
              if (isFunction(selector))
                return this.not(this.not(selector));
              return $(
                filter.call(this, function(element) {
                  return zepto.matches(element, selector);
                })
              );
            },
            add: function(selector, context2) {
              return $(uniq(this.concat($(selector, context2))));
            },
            is: function(selector) {
              return this.length > 0 && zepto.matches(this[0], selector);
            },
            not: function(selector) {
              var nodes = [];
              if (isFunction(selector) && selector.call !== undefined$1)
                this.each(function(idx) {
                  if (!selector.call(this, idx))
                    nodes.push(this);
                });
              else {
                var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                this.forEach(function(el) {
                  if (excludes.indexOf(el) < 0)
                    nodes.push(el);
                });
              }
              return $(nodes);
            },
            has: function(selector) {
              return this.filter(function() {
                return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
              });
            },
            eq: function(idx) {
              return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
            },
            first: function() {
              var el = this[0];
              return el && !isObject(el) ? el : $(el);
            },
            last: function() {
              var el = this[this.length - 1];
              return el && !isObject(el) ? el : $(el);
            },
            find: function(selector) {
              var result, $this = this;
              if (!selector)
                result = $();
              else if (typeof selector == "object")
                result = $(selector).filter(function() {
                  var node = this;
                  return emptyArray.some.call($this, function(parent) {
                    return $.contains(parent, node);
                  });
                });
              else if (this.length == 1)
                result = $(zepto.qsa(this[0], selector));
              else
                result = this.map(function() {
                  return zepto.qsa(this, selector);
                });
              return result;
            },
            closest: function(selector, context2) {
              var nodes = [], collection = typeof selector == "object" && $(selector);
              this.each(function(_, node) {
                while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
                  node = node !== context2 && !isDocument(node) && node.parentNode;
                if (node && nodes.indexOf(node) < 0)
                  nodes.push(node);
              });
              return $(nodes);
            },
            parents: function(selector) {
              var ancestors = [], nodes = this;
              while (nodes.length > 0)
                nodes = $.map(nodes, function(node) {
                  if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                    ancestors.push(node);
                    return node;
                  }
                });
              return filtered(ancestors, selector);
            },
            parent: function(selector) {
              return filtered(uniq(this.pluck("parentNode")), selector);
            },
            children: function(selector) {
              return filtered(
                this.map(function() {
                  return children(this);
                }),
                selector
              );
            },
            contents: function() {
              return this.map(function() {
                return this.contentDocument || slice.call(this.childNodes);
              });
            },
            siblings: function(selector) {
              return filtered(
                this.map(function(i, el) {
                  return filter.call(children(el.parentNode), function(child) {
                    return child !== el;
                  });
                }),
                selector
              );
            },
            empty: function() {
              return this.each(function() {
                this.innerHTML = "";
              });
            },
            pluck: function(property) {
              return $.map(this, function(el) {
                return el[property];
              });
            },
            show: function() {
              return this.each(function() {
                this.style.display == "none" && (this.style.display = "");
                if (getComputedStyle(this, "").getPropertyValue("display") == "none")
                  this.style.display = defaultDisplay(this.nodeName);
              });
            },
            replaceWith: function(newContent) {
              return this.before(newContent).remove();
            },
            wrap: function(structure) {
              var func = isFunction(structure);
              if (this[0] && !func)
                var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
              return this.each(function(index) {
                $(this).wrapAll(
                  func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom
                );
              });
            },
            wrapAll: function(structure) {
              if (this[0]) {
                $(this[0]).before(structure = $(structure));
                var children2;
                while ((children2 = structure.children()).length)
                  structure = children2.first();
                $(structure).append(this);
              }
              return this;
            },
            wrapInner: function(structure) {
              var func = isFunction(structure);
              return this.each(function(index) {
                var self2 = $(this), contents = self2.contents(), dom = func ? structure.call(this, index) : structure;
                contents.length ? contents.wrapAll(dom) : self2.append(dom);
              });
            },
            unwrap: function() {
              this.parent().each(function() {
                $(this).replaceWith($(this).children());
              });
              return this;
            },
            clone: function() {
              return this.map(function() {
                return this.cloneNode(true);
              });
            },
            hide: function() {
              return this.css("display", "none");
            },
            toggle: function(setting) {
              return this.each(function() {
                var el = $(this);
                (setting === undefined$1 ? el.css("display") == "none" : setting) ? el.show() : el.hide();
              });
            },
            prev: function(selector) {
              return $(this.pluck("previousElementSibling")).filter(
                selector || "*"
              );
            },
            next: function(selector) {
              return $(this.pluck("nextElementSibling")).filter(
                selector || "*"
              );
            },
            html: function(html2) {
              return 0 in arguments ? this.each(function(idx) {
                var originHtml = this.innerHTML;
                $(this).empty().append(funcArg(this, html2, idx, originHtml));
              }) : 0 in this ? this[0].innerHTML : null;
            },
            text: function(text) {
              return 0 in arguments ? this.each(function(idx) {
                var newText = funcArg(this, text, idx, this.textContent);
                this.textContent = newText == null ? "" : "" + newText;
              }) : 0 in this ? this.pluck("textContent").join("") : null;
            },
            attr: function(name, value2) {
              var result;
              return typeof name == "string" && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined$1 : this.each(function(idx) {
                if (this.nodeType !== 1)
                  return;
                if (isObject(name))
                  for (key2 in name)
                    setAttribute(this, key2, name[key2]);
                else
                  setAttribute(
                    this,
                    name,
                    funcArg(this, value2, idx, this.getAttribute(name))
                  );
              });
            },
            removeAttr: function(name) {
              return this.each(function() {
                this.nodeType === 1 && name.split(" ").forEach(function(attribute) {
                  setAttribute(this, attribute);
                }, this);
              });
            },
            prop: function(name, value2) {
              name = propMap[name] || name;
              return 1 in arguments ? this.each(function(idx) {
                this[name] = funcArg(this, value2, idx, this[name]);
              }) : this[0] && this[0][name];
            },
            removeProp: function(name) {
              name = propMap[name] || name;
              return this.each(function() {
                delete this[name];
              });
            },
            data: function(name, value2) {
              var attrName = "data-" + name.replace(capitalRE, "-$1").toLowerCase();
              var data = 1 in arguments ? this.attr(attrName, value2) : this.attr(attrName);
              return data !== null ? deserializeValue(data) : undefined$1;
            },
            val: function(value2) {
              if (0 in arguments) {
                if (value2 == null)
                  value2 = "";
                return this.each(function(idx) {
                  this.value = funcArg(this, value2, idx, this.value);
                });
              } else {
                return this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
                  return this.selected;
                }).pluck("value") : this[0].value);
              }
            },
            offset: function(coordinates) {
              if (coordinates)
                return this.each(function(index) {
                  var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
                    top: coords.top - parentOffset.top,
                    left: coords.left - parentOffset.left
                  };
                  if ($this.css("position") == "static")
                    props["position"] = "relative";
                  $this.css(props);
                });
              if (!this.length)
                return null;
              if (document2.documentElement !== this[0] && !$.contains(document2.documentElement, this[0]))
                return { top: 0, left: 0 };
              var obj = this[0].getBoundingClientRect();
              return {
                left: obj.left + window2.pageXOffset,
                top: obj.top + window2.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
              };
            },
            css: function(property, value2) {
              if (arguments.length < 2) {
                var element = this[0];
                if (typeof property == "string") {
                  if (!element)
                    return;
                  return element.style[camelize(property)] || getComputedStyle(element, "").getPropertyValue(property);
                } else if (isArray(property)) {
                  if (!element)
                    return;
                  var props = {};
                  var computedStyle = getComputedStyle(element, "");
                  $.each(property, function(_, prop) {
                    props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
                  });
                  return props;
                }
              }
              var css = "";
              if (type(property) == "string") {
                if (!value2 && value2 !== 0)
                  this.each(function() {
                    this.style.removeProperty(dasherize(property));
                  });
                else
                  css = dasherize(property) + ":" + maybeAddPx(property, value2);
              } else {
                for (key2 in property)
                  if (!property[key2] && property[key2] !== 0)
                    this.each(function() {
                      this.style.removeProperty(dasherize(key2));
                    });
                  else
                    css += dasherize(key2) + ":" + maybeAddPx(key2, property[key2]) + ";";
              }
              return this.each(function() {
                this.style.cssText += ";" + css;
              });
            },
            index: function(element) {
              return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
            },
            hasClass: function(name) {
              if (!name)
                return false;
              return emptyArray.some.call(
                this,
                function(el) {
                  return this.test(className(el));
                },
                classRE(name)
              );
            },
            addClass: function(name) {
              if (!name)
                return this;
              return this.each(function(idx) {
                if (!("className" in this))
                  return;
                classList = [];
                var cls = className(this), newName = funcArg(this, name, idx, cls);
                newName.split(/\s+/g).forEach(function(klass) {
                  if (!$(this).hasClass(klass))
                    classList.push(klass);
                }, this);
                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
              });
            },
            removeClass: function(name) {
              return this.each(function(idx) {
                if (!("className" in this))
                  return;
                if (name === undefined$1)
                  return className(this, "");
                classList = className(this);
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                  classList = classList.replace(classRE(klass), " ");
                });
                className(this, classList.trim());
              });
            },
            toggleClass: function(name, when) {
              if (!name)
                return this;
              return this.each(function(idx) {
                var $this = $(this), names = funcArg(this, name, idx, className(this));
                names.split(/\s+/g).forEach(function(klass) {
                  (when === undefined$1 ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
                });
              });
            },
            scrollTop: function(value2) {
              if (!this.length)
                return;
              var hasScrollTop = "scrollTop" in this[0];
              if (value2 === undefined$1)
                return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
              return this.each(
                hasScrollTop ? function() {
                  this.scrollTop = value2;
                } : function() {
                  this.scrollTo(this.scrollX, value2);
                }
              );
            },
            scrollLeft: function(value2) {
              if (!this.length)
                return;
              var hasScrollLeft = "scrollLeft" in this[0];
              if (value2 === undefined$1)
                return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
              return this.each(
                hasScrollLeft ? function() {
                  this.scrollLeft = value2;
                } : function() {
                  this.scrollTo(value2, this.scrollY);
                }
              );
            },
            position: function() {
              if (!this.length)
                return;
              var elem = this[0], offsetParent = this.offsetParent(), offset2 = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();
              offset2.top -= parseFloat($(elem).css("margin-top")) || 0;
              offset2.left -= parseFloat($(elem).css("margin-left")) || 0;
              parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
              parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
              return {
                top: offset2.top - parentOffset.top,
                left: offset2.left - parentOffset.left
              };
            },
            offsetParent: function() {
              return this.map(function() {
                var parent = this.offsetParent || document2.body;
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
                  parent = parent.offsetParent;
                return parent;
              });
            }
          };
          $.fn.detach = $.fn.remove;
          ["width", "height"].forEach(function(dimension2) {
            var dimensionProperty = dimension2.replace(/./, function(m) {
              return m[0].toUpperCase();
            });
            $.fn[dimension2] = function(value2) {
              var offset2, el = this[0];
              if (value2 === undefined$1)
                return isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset2 = this.offset()) && offset2[dimension2];
              else
                return this.each(function(idx) {
                  el = $(this);
                  el.css(dimension2, funcArg(this, value2, idx, el[dimension2]()));
                });
            };
          });
          function traverseNode(node, fun) {
            fun(node);
            for (var i = 0, len = node.childNodes.length; i < len; i++)
              traverseNode(node.childNodes[i], fun);
          }
          adjacencyOperators.forEach(function(operator, operatorIndex) {
            var inside = operatorIndex % 2;
            $.fn[operator] = function() {
              var argType, nodes = $.map(arguments, function(arg) {
                var arr = [];
                argType = type(arg);
                if (argType == "array") {
                  arg.forEach(function(el) {
                    if (el.nodeType !== undefined$1)
                      return arr.push(el);
                    else if ($.zepto.isZ(el))
                      return arr = arr.concat(el.get());
                    arr = arr.concat(zepto.fragment(el));
                  });
                  return arr;
                }
                return argType == "object" || arg == null ? arg : zepto.fragment(arg);
              }), parent, copyByClone = this.length > 1;
              if (nodes.length < 1)
                return this;
              return this.each(function(_, target) {
                parent = inside ? target : target.parentNode;
                target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
                var parentInDocument = $.contains(
                  document2.documentElement,
                  parent
                );
                nodes.forEach(function(node) {
                  if (copyByClone)
                    node = node.cloneNode(true);
                  else if (!parent)
                    return $(node).remove();
                  parent.insertBefore(node, target);
                  if (parentInDocument)
                    traverseNode(node, function(el) {
                      if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || el.type === "text/javascript") && !el.src) {
                        var target2 = el.ownerDocument ? el.ownerDocument.defaultView : window2;
                        target2["eval"].call(target2, el.innerHTML);
                      }
                    });
                });
              });
            };
            $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html2) {
              $(html2)[operator](this);
              return this;
            };
          });
          zepto.Z.prototype = Z.prototype = $.fn;
          zepto.uniq = uniq;
          zepto.deserializeValue = deserializeValue;
          $.zepto = zepto;
          return $;
        }();
        (function($) {
          var _zid = 1, undefined$1, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function(obj) {
            return typeof obj == "string";
          }, handlers = {}, specialEvents = {}, focusinSupported = "onfocusin" in window2, focus = { focus: "focusin", blur: "focusout" }, hover = { mouseenter: "mouseover", mouseleave: "mouseout" };
          specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
          function zid(element) {
            return element._zid || (element._zid = _zid++);
          }
          function findHandlers(element, event, fn2, selector) {
            event = parse(event);
            if (event.ns)
              var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function(handler) {
              return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn2 || zid(handler.fn) === zid(fn2)) && (!selector || handler.sel == selector);
            });
          }
          function parse(event) {
            var parts = ("" + event).split(".");
            return { e: parts[0], ns: parts.slice(1).sort().join(" ") };
          }
          function matcherFor(ns) {
            return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
          }
          function eventCapture(handler, captureSetting) {
            return handler.del && !focusinSupported && handler.e in focus || !!captureSetting;
          }
          function realEvent(type) {
            return hover[type] || focusinSupported && focus[type] || type;
          }
          function add2(element, events, fn2, data, selector, delegator, capture) {
            var id = zid(element), set2 = handlers[id] || (handlers[id] = []);
            events.split(/\s/).forEach(function(event) {
              if (event == "ready")
                return $(document).ready(fn2);
              var handler = parse(event);
              handler.fn = fn2;
              handler.sel = selector;
              if (handler.e in hover)
                fn2 = function(e) {
                  var related = e.relatedTarget;
                  if (!related || related !== this && !$.contains(this, related))
                    return handler.fn.apply(this, arguments);
                };
              handler.del = delegator;
              var callback = delegator || fn2;
              handler.proxy = function(e) {
                e = compatible(e);
                if (e.isImmediatePropagationStopped())
                  return;
                try {
                  var dataPropDescriptor = Object.getOwnPropertyDescriptor(
                    e,
                    "data"
                  );
                  if (!dataPropDescriptor || dataPropDescriptor.writable)
                    e.data = data;
                } catch (e2) {
                }
                var result = callback.apply(
                  element,
                  e._args == undefined$1 ? [e] : [e].concat(e._args)
                );
                if (result === false)
                  e.preventDefault(), e.stopPropagation();
                return result;
              };
              handler.i = set2.length;
              set2.push(handler);
              if ("addEventListener" in element)
                element.addEventListener(
                  realEvent(handler.e),
                  handler.proxy,
                  eventCapture(handler, capture)
                );
            });
          }
          function remove(element, events, fn2, selector, capture) {
            var id = zid(element);
            (events || "").split(/\s/).forEach(function(event) {
              findHandlers(element, event, fn2, selector).forEach(function(handler) {
                delete handlers[id][handler.i];
                if ("removeEventListener" in element)
                  element.removeEventListener(
                    realEvent(handler.e),
                    handler.proxy,
                    eventCapture(handler, capture)
                  );
              });
            });
          }
          $.event = { add: add2, remove };
          $.proxy = function(fn2, context2) {
            var args = 2 in arguments && slice.call(arguments, 2);
            if (isFunction(fn2)) {
              var proxyFn = function() {
                return fn2.apply(
                  context2,
                  args ? args.concat(slice.call(arguments)) : arguments
                );
              };
              proxyFn._zid = zid(fn2);
              return proxyFn;
            } else if (isString(context2)) {
              if (args) {
                args.unshift(fn2[context2], fn2);
                return $.proxy.apply(null, args);
              } else {
                return $.proxy(fn2[context2], fn2);
              }
            } else {
              throw new TypeError("expected function");
            }
          };
          $.fn.bind = function(event, data, callback) {
            return this.on(event, data, callback);
          };
          $.fn.unbind = function(event, callback) {
            return this.off(event, callback);
          };
          $.fn.one = function(event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1);
          };
          var returnTrue = function() {
            return true;
          }, returnFalse = function() {
            return false;
          }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/, eventMethods = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
          };
          function compatible(event, source) {
            if (source || !event.isDefaultPrevented) {
              source || (source = event);
              $.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                  this[predicate] = returnTrue;
                  return sourceMethod && sourceMethod.apply(source, arguments);
                };
                event[predicate] = returnFalse;
              });
              event.timeStamp || (event.timeStamp = Date.now());
              if (source.defaultPrevented !== undefined$1 ? source.defaultPrevented : "returnValue" in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault())
                event.isDefaultPrevented = returnTrue;
            }
            return event;
          }
          function createProxy(event) {
            var key2, proxy = { originalEvent: event };
            for (key2 in event)
              if (!ignoreProperties.test(key2) && event[key2] !== undefined$1)
                proxy[key2] = event[key2];
            return compatible(proxy, event);
          }
          $.fn.delegate = function(selector, event, callback) {
            return this.on(event, selector, callback);
          };
          $.fn.undelegate = function(selector, event, callback) {
            return this.off(event, selector, callback);
          };
          $.fn.live = function(event, callback) {
            $(document.body).delegate(this.selector, event, callback);
            return this;
          };
          $.fn.die = function(event, callback) {
            $(document.body).undelegate(this.selector, event, callback);
            return this;
          };
          $.fn.on = function(event, selector, data, callback, one) {
            var autoRemove, delegator, $this = this;
            if (event && !isString(event)) {
              $.each(event, function(type, fn2) {
                $this.on(type, selector, data, fn2, one);
              });
              return $this;
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false)
              callback = data, data = selector, selector = undefined$1;
            if (callback === undefined$1 || data === false)
              callback = data, data = undefined$1;
            if (callback === false)
              callback = returnFalse;
            return $this.each(function(_, element) {
              if (one)
                autoRemove = function(e) {
                  remove(element, e.type, callback);
                  return callback.apply(this, arguments);
                };
              if (selector)
                delegator = function(e) {
                  var evt, match = $(e.target).closest(selector, element).get(0);
                  if (match && match !== element) {
                    evt = $.extend(createProxy(e), {
                      currentTarget: match,
                      liveFired: element
                    });
                    return (autoRemove || callback).apply(
                      match,
                      [evt].concat(slice.call(arguments, 1))
                    );
                  }
                };
              add2(
                element,
                event,
                callback,
                data,
                selector,
                delegator || autoRemove
              );
            });
          };
          $.fn.off = function(event, selector, callback) {
            var $this = this;
            if (event && !isString(event)) {
              $.each(event, function(type, fn2) {
                $this.off(type, selector, fn2);
              });
              return $this;
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false)
              callback = selector, selector = undefined$1;
            if (callback === false)
              callback = returnFalse;
            return $this.each(function() {
              remove(this, event, callback, selector);
            });
          };
          $.fn.trigger = function(event, args) {
            event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
            event._args = args;
            return this.each(function() {
              if (event.type in focus && typeof this[event.type] == "function")
                this[event.type]();
              else if ("dispatchEvent" in this)
                this.dispatchEvent(event);
              else
                $(this).triggerHandler(event, args);
            });
          };
          $.fn.triggerHandler = function(event, args) {
            var e, result;
            this.each(function(i, element) {
              e = createProxy(isString(event) ? $.Event(event) : event);
              e._args = args;
              e.target = element;
              $.each(
                findHandlers(element, event.type || event),
                function(i2, handler) {
                  result = handler.proxy(e);
                  if (e.isImmediatePropagationStopped())
                    return false;
                }
              );
            });
            return result;
          };
          "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(event) {
            $.fn[event] = function(callback) {
              return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
            };
          });
          $.Event = function(type, props) {
            if (!isString(type))
              props = type, type = props.type;
            var event = document.createEvent(specialEvents[type] || "Events"), bubbles = true;
            if (props)
              for (var name in props)
                name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true);
            return compatible(event);
          };
        })(Zepto);
        (function($) {
          var cache2 = [], timeout;
          $.fn.remove = function() {
            return this.each(function() {
              if (this.parentNode) {
                if (this.tagName === "IMG") {
                  cache2.push(this);
                  this.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
                  if (timeout)
                    clearTimeout(timeout);
                  timeout = setTimeout(function() {
                    cache2 = [];
                  }, 6e4);
                }
                this.parentNode.removeChild(this);
              }
            });
          };
        })(Zepto);
        (function($) {
          var data = {}, dataAttr = $.fn.data, camelize = $.camelCase, exp2 = $.expando = "Zepto" + +new Date(), emptyArray = [];
          function getData(node, name) {
            var id = node[exp2], store = id && data[id];
            if (name === void 0)
              return store || setData(node);
            else {
              if (store) {
                if (name in store)
                  return store[name];
                var camelName = camelize(name);
                if (camelName in store)
                  return store[camelName];
              }
              return dataAttr.call($(node), name);
            }
          }
          function setData(node, name, value2) {
            var id = node[exp2] || (node[exp2] = ++$.uuid), store = data[id] || (data[id] = attributeData(node));
            if (name !== void 0)
              store[camelize(name)] = value2;
            return store;
          }
          function attributeData(node) {
            var store = {};
            $.each(node.attributes || emptyArray, function(i, attr) {
              if (attr.name.indexOf("data-") == 0)
                store[camelize(attr.name.replace("data-", ""))] = $.zepto.deserializeValue(attr.value);
            });
            return store;
          }
          $.fn.data = function(name, value2) {
            return value2 === void 0 ? $.isPlainObject(name) ? this.each(function(i, node) {
              $.each(name, function(key2, value3) {
                setData(node, key2, value3);
              });
            }) : 0 in this ? getData(this[0], name) : void 0 : this.each(function() {
              setData(this, name, value2);
            });
          };
          $.data = function(elem, name, value2) {
            return $(elem).data(name, value2);
          };
          $.hasData = function(elem) {
            var id = elem[exp2], store = id && data[id];
            return store ? !$.isEmptyObject(store) : false;
          };
          $.fn.removeData = function(names) {
            if (typeof names == "string")
              names = names.split(/\s+/);
            return this.each(function() {
              var id = this[exp2], store = id && data[id];
              if (store)
                $.each(names || store, function(key2) {
                  delete store[names ? camelize(this) : key2];
                });
            });
          };
          ["remove", "empty"].forEach(function(methodName) {
            var origFn = $.fn[methodName];
            $.fn[methodName] = function() {
              var elements = this.find("*");
              if (methodName === "remove")
                elements = elements.add(this);
              elements.removeData();
              return origFn.call(this);
            };
          });
        })(Zepto);
        return Zepto;
      });
    },
    function(module2, exports2, __webpack_require__) {
      var namespace = "autocomplete:";
      var _ = __webpack_require__(0);
      var DOM = __webpack_require__(1);
      function EventBus(o) {
        if (!o || !o.el) {
          _.error("EventBus initialized without el");
        }
        this.$el = DOM.element(o.el);
      }
      _.mixin(EventBus.prototype, {
        trigger: function(type, suggestion, dataset, context2) {
          var event = _.Event(namespace + type);
          this.$el.trigger(event, [suggestion, dataset, context2]);
          return event;
        }
      });
      module2.exports = EventBus;
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = {
        wrapper: '<span class="%ROOT%"></span>',
        dropdown: '<span class="%PREFIX%%DROPDOWN_MENU%"></span>',
        dataset: '<div class="%PREFIX%%DATASET%-%CLASS%"></div>',
        suggestions: '<span class="%PREFIX%%SUGGESTIONS%"></span>',
        suggestion: '<div class="%PREFIX%%SUGGESTION%"></div>'
      };
    },
    function(module2, exports2) {
      module2.exports = "0.36.0";
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = function parseAlgoliaClientVersion(agent) {
        var parsed = agent.match(
          /Algolia for vanilla JavaScript (\d+\.)(\d+\.)(\d+)/
        );
        if (parsed)
          return [parsed[1], parsed[2], parsed[3]];
        return void 0;
      };
    },
    function(module2, exports2, __webpack_require__) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _zepto = __webpack_require__(15);
      var _zepto2 = _interopRequireDefault(_zepto);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      exports2.default = _zepto2.default;
    },
    function(module2, exports2, __webpack_require__) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = "2.6.3";
    },
    function(module2, exports2, __webpack_require__) {
      var _main = __webpack_require__(23);
      var _main2 = _interopRequireDefault(_main);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      module2.exports = _main2.default;
    },
    function(module2, exports2, __webpack_require__) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _toFactory = __webpack_require__(24);
      var _toFactory2 = _interopRequireDefault(_toFactory);
      var _DocSearch = __webpack_require__(25);
      var _DocSearch2 = _interopRequireDefault(_DocSearch);
      var _version = __webpack_require__(21);
      var _version2 = _interopRequireDefault(_version);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var docsearch = (0, _toFactory2.default)(_DocSearch2.default);
      docsearch.version = _version2.default;
      exports2.default = docsearch;
    },
    function(module2, exports2, __webpack_require__) {
      var _bind = Function.prototype.bind;
      function toFactory(Class) {
        var Factory = function Factory2() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return new (_bind.apply(Class, [null].concat(args)))();
        };
        Factory.__proto__ = Class;
        Factory.prototype = Class.prototype;
        return Factory;
      }
      module2.exports = toFactory;
    },
    function(module2, exports2, __webpack_require__) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      var _hogan = __webpack_require__(26);
      var _hogan2 = _interopRequireDefault(_hogan);
      var _lite = __webpack_require__(29);
      var _lite2 = _interopRequireDefault(_lite);
      var _autocomplete = __webpack_require__(49);
      var _autocomplete2 = _interopRequireDefault(_autocomplete);
      var _templates = __webpack_require__(64);
      var _templates2 = _interopRequireDefault(_templates);
      var _utils = __webpack_require__(65);
      var _utils2 = _interopRequireDefault(_utils);
      var _version = __webpack_require__(21);
      var _version2 = _interopRequireDefault(_version);
      var _zepto = __webpack_require__(20);
      var _zepto2 = _interopRequireDefault(_zepto);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var usage = "Usage:\n  documentationSearch({\n  apiKey,\n  indexName,\n  inputSelector,\n  [ appId ],\n  [ algoliaOptions.{hitsPerPage} ]\n  [ autocompleteOptions.{hint,debug} ]\n})";
      var DocSearch = function() {
        function DocSearch2(_ref) {
          var apiKey = _ref.apiKey, indexName = _ref.indexName, inputSelector = _ref.inputSelector, _ref$appId = _ref.appId, appId = _ref$appId === void 0 ? "BH4D9OD16A" : _ref$appId, _ref$debug = _ref.debug, debug = _ref$debug === void 0 ? false : _ref$debug, _ref$algoliaOptions = _ref.algoliaOptions, algoliaOptions = _ref$algoliaOptions === void 0 ? {} : _ref$algoliaOptions, _ref$queryDataCallbac = _ref.queryDataCallback, queryDataCallback = _ref$queryDataCallbac === void 0 ? null : _ref$queryDataCallbac, _ref$autocompleteOpti = _ref.autocompleteOptions, autocompleteOptions = _ref$autocompleteOpti === void 0 ? { debug: false, hint: false, autoselect: true } : _ref$autocompleteOpti, _ref$transformData = _ref.transformData, transformData = _ref$transformData === void 0 ? false : _ref$transformData, _ref$queryHook = _ref.queryHook, queryHook = _ref$queryHook === void 0 ? false : _ref$queryHook, _ref$handleSelected = _ref.handleSelected, handleSelected = _ref$handleSelected === void 0 ? false : _ref$handleSelected, _ref$enhancedSearchIn = _ref.enhancedSearchInput, enhancedSearchInput = _ref$enhancedSearchIn === void 0 ? false : _ref$enhancedSearchIn, _ref$layout = _ref.layout, layout = _ref$layout === void 0 ? "collumns" : _ref$layout;
          _classCallCheck(this, DocSearch2);
          DocSearch2.checkArguments({
            apiKey,
            indexName,
            inputSelector,
            debug,
            algoliaOptions,
            queryDataCallback,
            autocompleteOptions,
            transformData,
            queryHook,
            handleSelected,
            enhancedSearchInput,
            layout
          });
          this.apiKey = apiKey;
          this.appId = appId;
          this.indexName = indexName;
          this.input = DocSearch2.getInputFromSelector(inputSelector);
          this.algoliaOptions = _extends({ hitsPerPage: 5 }, algoliaOptions);
          this.queryDataCallback = queryDataCallback || null;
          var autocompleteOptionsDebug = autocompleteOptions && autocompleteOptions.debug ? autocompleteOptions.debug : false;
          autocompleteOptions.debug = debug || autocompleteOptionsDebug;
          this.autocompleteOptions = autocompleteOptions;
          this.autocompleteOptions.cssClasses = this.autocompleteOptions.cssClasses || {};
          this.autocompleteOptions.cssClasses.prefix = this.autocompleteOptions.cssClasses.prefix || "ds";
          var inputAriaLabel = this.input && typeof this.input.attr === "function" && this.input.attr("aria-label");
          this.autocompleteOptions.ariaLabel = this.autocompleteOptions.ariaLabel || inputAriaLabel || "search input";
          this.isSimpleLayout = layout === "simple";
          this.client = (0, _lite2.default)(this.appId, this.apiKey);
          this.client.addAlgoliaAgent("docsearch.js " + _version2.default);
          if (enhancedSearchInput) {
            this.input = DocSearch2.injectSearchBox(this.input);
          }
          this.autocomplete = (0, _autocomplete2.default)(
            this.input,
            autocompleteOptions,
            [
              {
                source: this.getAutocompleteSource(transformData, queryHook),
                templates: {
                  suggestion: DocSearch2.getSuggestionTemplate(
                    this.isSimpleLayout
                  ),
                  footer: _templates2.default.footer,
                  empty: DocSearch2.getEmptyTemplate()
                }
              }
            ]
          );
          var customHandleSelected = handleSelected;
          this.handleSelected = customHandleSelected || this.handleSelected;
          if (customHandleSelected) {
            (0, _zepto2.default)(".algolia-autocomplete").on(
              "click",
              ".ds-suggestions a",
              function(event) {
                event.preventDefault();
              }
            );
          }
          this.autocomplete.on(
            "autocomplete:selected",
            this.handleSelected.bind(null, this.autocomplete.autocomplete)
          );
          this.autocomplete.on(
            "autocomplete:shown",
            this.handleShown.bind(null, this.input)
          );
          if (enhancedSearchInput) {
            DocSearch2.bindSearchBoxEvent();
          }
        }
        _createClass(
          DocSearch2,
          [
            {
              key: "getAutocompleteSource",
              value: function getAutocompleteSource(transformData, queryHook) {
                var _this = this;
                return function(query, callback) {
                  if (queryHook) {
                    query = queryHook(query) || query;
                  }
                  _this.client.search([
                    {
                      indexName: _this.indexName,
                      query,
                      params: _this.algoliaOptions
                    }
                  ]).then(function(data) {
                    if (_this.queryDataCallback && typeof _this.queryDataCallback == "function") {
                      _this.queryDataCallback(data);
                    }
                    var hits = data.results[0].hits;
                    if (transformData) {
                      hits = transformData(hits) || hits;
                    }
                    callback(DocSearch2.formatHits(hits));
                  });
                };
              }
            },
            {
              key: "handleSelected",
              value: function handleSelected(input, event, suggestion, datasetNumber) {
                var context2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {};
                if (context2.selectionMethod === "click") {
                  return;
                }
                input.setVal("");
                window.location.assign(suggestion.url);
              }
            },
            {
              key: "handleShown",
              value: function handleShown(input) {
                var middleOfInput = input.offset().left + input.width() / 2;
                var middleOfWindow = (0, _zepto2.default)(document).width() / 2;
                if (isNaN(middleOfWindow)) {
                  middleOfWindow = 900;
                }
                var alignClass = middleOfInput - middleOfWindow >= 0 ? "algolia-autocomplete-right" : "algolia-autocomplete-left";
                var otherAlignClass = middleOfInput - middleOfWindow < 0 ? "algolia-autocomplete-right" : "algolia-autocomplete-left";
                var autocompleteWrapper = (0, _zepto2.default)(
                  ".algolia-autocomplete"
                );
                if (!autocompleteWrapper.hasClass(alignClass)) {
                  autocompleteWrapper.addClass(alignClass);
                }
                if (autocompleteWrapper.hasClass(otherAlignClass)) {
                  autocompleteWrapper.removeClass(otherAlignClass);
                }
              }
            }
          ],
          [
            {
              key: "checkArguments",
              value: function checkArguments(args) {
                if (!args.apiKey || !args.indexName) {
                  throw new Error(usage);
                }
                if (typeof args.inputSelector !== "string") {
                  throw new Error(
                    "Error: inputSelector:" + args.inputSelector + "  must be a string. Each selector must match only one element and separated by ','"
                  );
                }
                if (!DocSearch2.getInputFromSelector(args.inputSelector)) {
                  throw new Error(
                    "Error: No input element in the page matches " + args.inputSelector
                  );
                }
              }
            },
            {
              key: "injectSearchBox",
              value: function injectSearchBox(input) {
                input.before(_templates2.default.searchBox);
                var newInput = input.prev().prev().find("input");
                input.remove();
                return newInput;
              }
            },
            {
              key: "bindSearchBoxEvent",
              value: function bindSearchBoxEvent() {
                (0, _zepto2.default)('.searchbox [type="reset"]').on(
                  "click",
                  function() {
                    (0, _zepto2.default)("input#docsearch").focus();
                    (0, _zepto2.default)(this).addClass("hide");
                    _autocomplete2.default.autocomplete.setVal("");
                  }
                );
                (0, _zepto2.default)("input#docsearch").on(
                  "keyup",
                  function() {
                    var searchbox = document.querySelector("input#docsearch");
                    var reset = document.querySelector(
                      '.searchbox [type="reset"]'
                    );
                    reset.className = "searchbox__reset";
                    if (searchbox.value.length === 0) {
                      reset.className += " hide";
                    }
                  }
                );
              }
            },
            {
              key: "getInputFromSelector",
              value: function getInputFromSelector(selector) {
                var input = (0, _zepto2.default)(selector).filter("input");
                return input.length ? (0, _zepto2.default)(input[0]) : null;
              }
            },
            {
              key: "formatHits",
              value: function formatHits(receivedHits) {
                var clonedHits = _utils2.default.deepClone(receivedHits);
                var hits = clonedHits.map(function(hit) {
                  if (hit._highlightResult) {
                    hit._highlightResult = _utils2.default.mergeKeyWithParent(
                      hit._highlightResult,
                      "hierarchy"
                    );
                  }
                  return _utils2.default.mergeKeyWithParent(hit, "hierarchy");
                });
                var groupedHits = _utils2.default.groupBy(hits, "lvl0");
                _zepto2.default.each(groupedHits, function(level, collection) {
                  var groupedHitsByLvl1 = _utils2.default.groupBy(
                    collection,
                    "lvl1"
                  );
                  var flattenedHits = _utils2.default.flattenAndFlagFirst(
                    groupedHitsByLvl1,
                    "isSubCategoryHeader"
                  );
                  groupedHits[level] = flattenedHits;
                });
                groupedHits = _utils2.default.flattenAndFlagFirst(
                  groupedHits,
                  "isCategoryHeader"
                );
                return groupedHits.map(function(hit) {
                  var url = DocSearch2.formatURL(hit);
                  var category = _utils2.default.getHighlightedValue(
                    hit,
                    "lvl0"
                  );
                  var subcategory = _utils2.default.getHighlightedValue(hit, "lvl1") || category;
                  var displayTitle = _utils2.default.compact([
                    _utils2.default.getHighlightedValue(hit, "lvl2") || subcategory,
                    _utils2.default.getHighlightedValue(hit, "lvl3"),
                    _utils2.default.getHighlightedValue(hit, "lvl4"),
                    _utils2.default.getHighlightedValue(hit, "lvl5"),
                    _utils2.default.getHighlightedValue(hit, "lvl6")
                  ]).join(
                    '<span class="aa-suggestion-title-separator" aria-hidden="true"> \u203A </span>'
                  );
                  var text = _utils2.default.getSnippetedValue(hit, "content");
                  var isTextOrSubcategoryNonEmpty = subcategory && subcategory !== "" || displayTitle && displayTitle !== "";
                  var isLvl1EmptyOrDuplicate = !subcategory || subcategory === "" || subcategory === category;
                  var isLvl2 = displayTitle && displayTitle !== "" && displayTitle !== subcategory;
                  var isLvl1 = !isLvl2 && subcategory && subcategory !== "" && subcategory !== category;
                  var isLvl0 = !isLvl1 && !isLvl2;
                  return {
                    isLvl0,
                    isLvl1,
                    isLvl2,
                    isLvl1EmptyOrDuplicate,
                    isCategoryHeader: hit.isCategoryHeader,
                    isSubCategoryHeader: hit.isSubCategoryHeader,
                    isTextOrSubcategoryNonEmpty,
                    category,
                    subcategory,
                    title: displayTitle,
                    text,
                    url
                  };
                });
              }
            },
            {
              key: "formatURL",
              value: function formatURL(hit) {
                var url = hit.url, anchor = hit.anchor;
                if (url) {
                  var containsAnchor = url.indexOf("#") !== -1;
                  if (containsAnchor)
                    return url;
                  else if (anchor)
                    return hit.url + "#" + hit.anchor;
                  return url;
                } else if (anchor)
                  return "#" + hit.anchor;
                console.warn("no anchor nor url for : ", JSON.stringify(hit));
                return null;
              }
            },
            {
              key: "getEmptyTemplate",
              value: function getEmptyTemplate() {
                return function(args) {
                  return _hogan2.default.compile(_templates2.default.empty).render(args);
                };
              }
            },
            {
              key: "getSuggestionTemplate",
              value: function getSuggestionTemplate(isSimpleLayout) {
                var stringTemplate = isSimpleLayout ? _templates2.default.suggestionSimple : _templates2.default.suggestion;
                var template = _hogan2.default.compile(stringTemplate);
                return function(suggestion) {
                  return template.render(suggestion);
                };
              }
            }
          ]
        );
        return DocSearch2;
      }();
      exports2.default = DocSearch;
    },
    function(module2, exports2, __webpack_require__) {
      var Hogan = __webpack_require__(27);
      Hogan.Template = __webpack_require__(28).Template;
      Hogan.template = Hogan.Template;
      module2.exports = Hogan;
    },
    function(module2, exports2, __webpack_require__) {
      (function(Hogan) {
        var rIsWhitespace = /\S/, rQuot = /\"/g, rNewline = /\n/g, rCr = /\r/g, rSlash = /\\/g, rLineSep = /\u2028/, rParagraphSep = /\u2029/;
        Hogan.tags = {
          "#": 1,
          "^": 2,
          "<": 3,
          $: 4,
          "/": 5,
          "!": 6,
          ">": 7,
          "=": 8,
          _v: 9,
          "{": 10,
          "&": 11,
          _t: 12
        };
        Hogan.scan = function scan(text, delimiters) {
          var len = text.length, IN_TEXT = 0, IN_TAG_TYPE = 1, IN_TAG = 2, state = IN_TEXT, tagType = null, tag = null, buf = "", tokens = [], seenTag = false, i = 0, lineStart = 0, otag = "{{", ctag = "}}";
          function addBuf() {
            if (buf.length > 0) {
              tokens.push({ tag: "_t", text: new String(buf) });
              buf = "";
            }
          }
          function lineIsWhitespace() {
            var isAllWhitespace = true;
            for (var j = lineStart; j < tokens.length; j++) {
              isAllWhitespace = Hogan.tags[tokens[j].tag] < Hogan.tags["_v"] || tokens[j].tag == "_t" && tokens[j].text.match(rIsWhitespace) === null;
              if (!isAllWhitespace) {
                return false;
              }
            }
            return isAllWhitespace;
          }
          function filterLine(haveSeenTag, noNewLine) {
            addBuf();
            if (haveSeenTag && lineIsWhitespace()) {
              for (var j = lineStart, next; j < tokens.length; j++) {
                if (tokens[j].text) {
                  if ((next = tokens[j + 1]) && next.tag == ">") {
                    next.indent = tokens[j].text.toString();
                  }
                  tokens.splice(j, 1);
                }
              }
            } else if (!noNewLine) {
              tokens.push({ tag: "\n" });
            }
            seenTag = false;
            lineStart = tokens.length;
          }
          function changeDelimiters(text2, index) {
            var close = "=" + ctag, closeIndex = text2.indexOf(close, index), delimiters2 = trim(
              text2.substring(text2.indexOf("=", index) + 1, closeIndex)
            ).split(" ");
            otag = delimiters2[0];
            ctag = delimiters2[delimiters2.length - 1];
            return closeIndex + close.length - 1;
          }
          if (delimiters) {
            delimiters = delimiters.split(" ");
            otag = delimiters[0];
            ctag = delimiters[1];
          }
          for (i = 0; i < len; i++) {
            if (state == IN_TEXT) {
              if (tagChange(otag, text, i)) {
                --i;
                addBuf();
                state = IN_TAG_TYPE;
              } else {
                if (text.charAt(i) == "\n") {
                  filterLine(seenTag);
                } else {
                  buf += text.charAt(i);
                }
              }
            } else if (state == IN_TAG_TYPE) {
              i += otag.length - 1;
              tag = Hogan.tags[text.charAt(i + 1)];
              tagType = tag ? text.charAt(i + 1) : "_v";
              if (tagType == "=") {
                i = changeDelimiters(text, i);
                state = IN_TEXT;
              } else {
                if (tag) {
                  i++;
                }
                state = IN_TAG;
              }
              seenTag = i;
            } else {
              if (tagChange(ctag, text, i)) {
                tokens.push({
                  tag: tagType,
                  n: trim(buf),
                  otag,
                  ctag,
                  i: tagType == "/" ? seenTag - otag.length : i + ctag.length
                });
                buf = "";
                i += ctag.length - 1;
                state = IN_TEXT;
                if (tagType == "{") {
                  if (ctag == "}}") {
                    i++;
                  } else {
                    cleanTripleStache(tokens[tokens.length - 1]);
                  }
                }
              } else {
                buf += text.charAt(i);
              }
            }
          }
          filterLine(seenTag, true);
          return tokens;
        };
        function cleanTripleStache(token) {
          if (token.n.substr(token.n.length - 1) === "}") {
            token.n = token.n.substring(0, token.n.length - 1);
          }
        }
        function trim(s) {
          if (s.trim) {
            return s.trim();
          }
          return s.replace(/^\s*|\s*$/g, "");
        }
        function tagChange(tag, text, index) {
          if (text.charAt(index) != tag.charAt(0)) {
            return false;
          }
          for (var i = 1, l = tag.length; i < l; i++) {
            if (text.charAt(index + i) != tag.charAt(i)) {
              return false;
            }
          }
          return true;
        }
        var allowedInSuper = { _t: true, "\n": true, $: true, "/": true };
        function buildTree(tokens, kind, stack2, customTags) {
          var instructions = [], opener = null, tail = null, token = null;
          tail = stack2[stack2.length - 1];
          while (tokens.length > 0) {
            token = tokens.shift();
            if (tail && tail.tag == "<" && !(token.tag in allowedInSuper)) {
              throw new Error("Illegal content in < super tag.");
            }
            if (Hogan.tags[token.tag] <= Hogan.tags["$"] || isOpener(token, customTags)) {
              stack2.push(token);
              token.nodes = buildTree(tokens, token.tag, stack2, customTags);
            } else if (token.tag == "/") {
              if (stack2.length === 0) {
                throw new Error("Closing tag without opener: /" + token.n);
              }
              opener = stack2.pop();
              if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
                throw new Error(
                  "Nesting error: " + opener.n + " vs. " + token.n
                );
              }
              opener.end = token.i;
              return instructions;
            } else if (token.tag == "\n") {
              token.last = tokens.length == 0 || tokens[0].tag == "\n";
            }
            instructions.push(token);
          }
          if (stack2.length > 0) {
            throw new Error("missing closing tag: " + stack2.pop().n);
          }
          return instructions;
        }
        function isOpener(token, tags) {
          for (var i = 0, l = tags.length; i < l; i++) {
            if (tags[i].o == token.n) {
              token.tag = "#";
              return true;
            }
          }
        }
        function isCloser(close, open, tags) {
          for (var i = 0, l = tags.length; i < l; i++) {
            if (tags[i].c == close && tags[i].o == open) {
              return true;
            }
          }
        }
        function stringifySubstitutions(obj) {
          var items = [];
          for (var key2 in obj) {
            items.push(
              '"' + esc(key2) + '": function(c,p,t,i) {' + obj[key2] + "}"
            );
          }
          return "{ " + items.join(",") + " }";
        }
        function stringifyPartials(codeObj) {
          var partials = [];
          for (var key2 in codeObj.partials) {
            partials.push(
              '"' + esc(key2) + '":{name:"' + esc(codeObj.partials[key2].name) + '", ' + stringifyPartials(codeObj.partials[key2]) + "}"
            );
          }
          return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
        }
        Hogan.stringify = function(codeObj, text, options) {
          return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}";
        };
        var serialNo = 0;
        Hogan.generate = function(tree, text, options) {
          serialNo = 0;
          var context2 = { code: "", subs: {}, partials: {} };
          Hogan.walk(tree, context2);
          if (options.asString) {
            return this.stringify(context2, text, options);
          }
          return this.makeTemplate(context2, text, options);
        };
        Hogan.wrapMain = function(code) {
          return 'var t=this;t.b(i=i||"");' + code + "return t.fl();";
        };
        Hogan.template = Hogan.Template;
        Hogan.makeTemplate = function(codeObj, text, options) {
          var template = this.makePartials(codeObj);
          template.code = new Function(
            "c",
            "p",
            "i",
            this.wrapMain(codeObj.code)
          );
          return new this.template(template, text, this, options);
        };
        Hogan.makePartials = function(codeObj) {
          var key2, template = {
            subs: {},
            partials: codeObj.partials,
            name: codeObj.name
          };
          for (key2 in template.partials) {
            template.partials[key2] = this.makePartials(template.partials[key2]);
          }
          for (key2 in codeObj.subs) {
            template.subs[key2] = new Function(
              "c",
              "p",
              "t",
              "i",
              codeObj.subs[key2]
            );
          }
          return template;
        };
        function esc(s) {
          return s.replace(rSlash, "\\\\").replace(rQuot, '\\"').replace(rNewline, "\\n").replace(rCr, "\\r").replace(rLineSep, "\\u2028").replace(rParagraphSep, "\\u2029");
        }
        function chooseMethod(s) {
          return ~s.indexOf(".") ? "d" : "f";
        }
        function createPartial(node, context2) {
          var prefix = "<" + (context2.prefix || "");
          var sym = prefix + node.n + serialNo++;
          context2.partials[sym] = { name: node.n, partials: {} };
          context2.code += 't.b(t.rp("' + esc(sym) + '",c,p,"' + (node.indent || "") + '"));';
          return sym;
        }
        Hogan.codegen = {
          "#": function(node, context2) {
            context2.code += "if(t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,0,' + node.i + "," + node.end + ',"' + node.otag + " " + node.ctag + '")){t.rs(c,p,function(c,p,t){';
            Hogan.walk(node.nodes, context2);
            context2.code += "});c.pop();}";
          },
          "^": function(node, context2) {
            context2.code += "if(!t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
            Hogan.walk(node.nodes, context2);
            context2.code += "};";
          },
          ">": createPartial,
          "<": function(node, context2) {
            var ctx = { partials: {}, code: "", subs: {}, inPartial: true };
            Hogan.walk(node.nodes, ctx);
            var template = context2.partials[createPartial(node, context2)];
            template.subs = ctx.subs;
            template.partials = ctx.partials;
          },
          $: function(node, context2) {
            var ctx = {
              subs: {},
              code: "",
              partials: context2.partials,
              prefix: node.n
            };
            Hogan.walk(node.nodes, ctx);
            context2.subs[node.n] = ctx.code;
            if (!context2.inPartial) {
              context2.code += 't.sub("' + esc(node.n) + '",c,p,i);';
            }
          },
          "\n": function(node, context2) {
            context2.code += write4('"\\n"' + (node.last ? "" : " + i"));
          },
          _v: function(node, context2) {
            context2.code += "t.b(t.v(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
          },
          _t: function(node, context2) {
            context2.code += write4('"' + esc(node.text) + '"');
          },
          "{": tripleStache,
          "&": tripleStache
        };
        function tripleStache(node, context2) {
          context2.code += "t.b(t.t(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
        }
        function write4(s) {
          return "t.b(" + s + ");";
        }
        Hogan.walk = function(nodelist, context2) {
          var func;
          for (var i = 0, l = nodelist.length; i < l; i++) {
            func = Hogan.codegen[nodelist[i].tag];
            func && func(nodelist[i], context2);
          }
          return context2;
        };
        Hogan.parse = function(tokens, text, options) {
          options = options || {};
          return buildTree(tokens, "", [], options.sectionTags || []);
        };
        Hogan.cache = {};
        Hogan.cacheKey = function(text, options) {
          return [
            text,
            !!options.asString,
            !!options.disableLambda,
            options.delimiters,
            !!options.modelGet
          ].join("||");
        };
        Hogan.compile = function(text, options) {
          options = options || {};
          var key2 = Hogan.cacheKey(text, options);
          var template = this.cache[key2];
          if (template) {
            var partials = template.partials;
            for (var name in partials) {
              delete partials[name].instance;
            }
            return template;
          }
          template = this.generate(
            this.parse(this.scan(text, options.delimiters), text, options),
            text,
            options
          );
          return this.cache[key2] = template;
        };
      })(exports2);
    },
    function(module2, exports2, __webpack_require__) {
      (function(Hogan) {
        Hogan.Template = function(codeObj, text, compiler, options) {
          codeObj = codeObj || {};
          this.r = codeObj.code || this.r;
          this.c = compiler;
          this.options = options || {};
          this.text = text || "";
          this.partials = codeObj.partials || {};
          this.subs = codeObj.subs || {};
          this.buf = "";
        };
        Hogan.Template.prototype = {
          r: function(context2, partials, indent) {
            return "";
          },
          v: hoganEscape,
          t: coerceToString,
          render: function render3(context2, partials, indent) {
            return this.ri([context2], partials || {}, indent);
          },
          ri: function(context2, partials, indent) {
            return this.r(context2, partials, indent);
          },
          ep: function(symbol, partials) {
            var partial = this.partials[symbol];
            var template = partials[partial.name];
            if (partial.instance && partial.base == template) {
              return partial.instance;
            }
            if (typeof template == "string") {
              if (!this.c) {
                throw new Error("No compiler available.");
              }
              template = this.c.compile(template, this.options);
            }
            if (!template) {
              return null;
            }
            this.partials[symbol].base = template;
            if (partial.subs) {
              if (!partials.stackText)
                partials.stackText = {};
              for (key in partial.subs) {
                if (!partials.stackText[key]) {
                  partials.stackText[key] = this.activeSub !== void 0 && partials.stackText[this.activeSub] ? partials.stackText[this.activeSub] : this.text;
                }
              }
              template = createSpecializedPartial(
                template,
                partial.subs,
                partial.partials,
                this.stackSubs,
                this.stackPartials,
                partials.stackText
              );
            }
            this.partials[symbol].instance = template;
            return template;
          },
          rp: function(symbol, context2, partials, indent) {
            var partial = this.ep(symbol, partials);
            if (!partial) {
              return "";
            }
            return partial.ri(context2, partials, indent);
          },
          rs: function(context2, partials, section) {
            var tail = context2[context2.length - 1];
            if (!isArray(tail)) {
              section(context2, partials, this);
              return;
            }
            for (var i = 0; i < tail.length; i++) {
              context2.push(tail[i]);
              section(context2, partials, this);
              context2.pop();
            }
          },
          s: function(val, ctx, partials, inverted, start2, end2, tags) {
            var pass;
            if (isArray(val) && val.length === 0) {
              return false;
            }
            if (typeof val == "function") {
              val = this.ms(val, ctx, partials, inverted, start2, end2, tags);
            }
            pass = !!val;
            if (!inverted && pass && ctx) {
              ctx.push(typeof val == "object" ? val : ctx[ctx.length - 1]);
            }
            return pass;
          },
          d: function(key2, ctx, partials, returnFound) {
            var found, names = key2.split("."), val = this.f(names[0], ctx, partials, returnFound), doModelGet = this.options.modelGet, cx = null;
            if (key2 === "." && isArray(ctx[ctx.length - 2])) {
              val = ctx[ctx.length - 1];
            } else {
              for (var i = 1; i < names.length; i++) {
                found = findInScope(names[i], val, doModelGet);
                if (found !== void 0) {
                  cx = val;
                  val = found;
                } else {
                  val = "";
                }
              }
            }
            if (returnFound && !val) {
              return false;
            }
            if (!returnFound && typeof val == "function") {
              ctx.push(cx);
              val = this.mv(val, ctx, partials);
              ctx.pop();
            }
            return val;
          },
          f: function(key2, ctx, partials, returnFound) {
            var val = false, v = null, found = false, doModelGet = this.options.modelGet;
            for (var i = ctx.length - 1; i >= 0; i--) {
              v = ctx[i];
              val = findInScope(key2, v, doModelGet);
              if (val !== void 0) {
                found = true;
                break;
              }
            }
            if (!found) {
              return returnFound ? false : "";
            }
            if (!returnFound && typeof val == "function") {
              val = this.mv(val, ctx, partials);
            }
            return val;
          },
          ls: function(func, cx, partials, text, tags) {
            var oldTags = this.options.delimiters;
            this.options.delimiters = tags;
            this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
            this.options.delimiters = oldTags;
            return false;
          },
          ct: function(text, cx, partials) {
            if (this.options.disableLambda) {
              throw new Error("Lambda features disabled.");
            }
            return this.c.compile(text, this.options).render(cx, partials);
          },
          b: function(s) {
            this.buf += s;
          },
          fl: function() {
            var r = this.buf;
            this.buf = "";
            return r;
          },
          ms: function(func, ctx, partials, inverted, start2, end2, tags) {
            var textSource, cx = ctx[ctx.length - 1], result = func.call(cx);
            if (typeof result == "function") {
              if (inverted) {
                return true;
              } else {
                textSource = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text;
                return this.ls(
                  result,
                  cx,
                  partials,
                  textSource.substring(start2, end2),
                  tags
                );
              }
            }
            return result;
          },
          mv: function(func, ctx, partials) {
            var cx = ctx[ctx.length - 1];
            var result = func.call(cx);
            if (typeof result == "function") {
              return this.ct(coerceToString(result.call(cx)), cx, partials);
            }
            return result;
          },
          sub: function(name, context2, partials, indent) {
            var f = this.subs[name];
            if (f) {
              this.activeSub = name;
              f(context2, partials, this, indent);
              this.activeSub = false;
            }
          }
        };
        function findInScope(key2, scope, doModelGet) {
          var val;
          if (scope && typeof scope == "object") {
            if (scope[key2] !== void 0) {
              val = scope[key2];
            } else if (doModelGet && scope.get && typeof scope.get == "function") {
              val = scope.get(key2);
            }
          }
          return val;
        }
        function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
          function PartialTemplate() {
          }
          PartialTemplate.prototype = instance;
          function Substitutions() {
          }
          Substitutions.prototype = instance.subs;
          var key2;
          var partial = new PartialTemplate();
          partial.subs = new Substitutions();
          partial.subsText = {};
          partial.buf = "";
          stackSubs = stackSubs || {};
          partial.stackSubs = stackSubs;
          partial.subsText = stackText;
          for (key2 in subs) {
            if (!stackSubs[key2])
              stackSubs[key2] = subs[key2];
          }
          for (key2 in stackSubs) {
            partial.subs[key2] = stackSubs[key2];
          }
          stackPartials = stackPartials || {};
          partial.stackPartials = stackPartials;
          for (key2 in partials) {
            if (!stackPartials[key2])
              stackPartials[key2] = partials[key2];
          }
          for (key2 in stackPartials) {
            partial.partials[key2] = stackPartials[key2];
          }
          return partial;
        }
        var rAmp = /&/g, rLt = /</g, rGt = />/g, rApos = /\'/g, rQuot = /\"/g, hChars = /[&<>\"\']/;
        function coerceToString(val) {
          return String(val === null || val === void 0 ? "" : val);
        }
        function hoganEscape(str) {
          str = coerceToString(str);
          return hChars.test(str) ? str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rGt, "&gt;").replace(rApos, "&#39;").replace(rQuot, "&quot;") : str;
        }
        var isArray = Array.isArray || function(a) {
          return Object.prototype.toString.call(a) === "[object Array]";
        };
      })(exports2);
    },
    function(module2, exports2, __webpack_require__) {
      var AlgoliaSearchCore = __webpack_require__(30);
      var createAlgoliasearch = __webpack_require__(41);
      module2.exports = createAlgoliasearch(AlgoliaSearchCore, "(lite) ");
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = AlgoliaSearchCore;
      var errors = __webpack_require__(5);
      var exitPromise = __webpack_require__(31);
      var IndexCore = __webpack_require__(32);
      var store = __webpack_require__(38);
      var MAX_API_KEY_LENGTH = 500;
      var RESET_APP_DATA_TIMER = Object({ NODE_ENV: "production" }).RESET_APP_DATA_TIMER && parseInt(
        Object({ NODE_ENV: "production" }).RESET_APP_DATA_TIMER,
        10
      ) || 60 * 2 * 1e3;
      function AlgoliaSearchCore(applicationID, apiKey, opts) {
        var debug = __webpack_require__(8)("algoliasearch");
        var clone = __webpack_require__(3);
        var isArray = __webpack_require__(6);
        var map = __webpack_require__(7);
        var usage = "Usage: algoliasearch(applicationID, apiKey, opts)";
        if (opts._allowEmptyCredentials !== true && !applicationID) {
          throw new errors.AlgoliaSearchError(
            "Please provide an application ID. " + usage
          );
        }
        if (opts._allowEmptyCredentials !== true && !apiKey) {
          throw new errors.AlgoliaSearchError(
            "Please provide an API key. " + usage
          );
        }
        this.applicationID = applicationID;
        this.apiKey = apiKey;
        this.hosts = { read: [], write: [] };
        opts = opts || {};
        this._timeouts = opts.timeouts || {
          connect: 1 * 1e3,
          read: 2 * 1e3,
          write: 30 * 1e3
        };
        if (opts.timeout) {
          this._timeouts.connect = this._timeouts.read = this._timeouts.write = opts.timeout;
        }
        var protocol = opts.protocol || "https:";
        if (!/:$/.test(protocol)) {
          protocol = protocol + ":";
        }
        if (protocol !== "http:" && protocol !== "https:") {
          throw new errors.AlgoliaSearchError(
            "protocol must be `http:` or `https:` (was `" + opts.protocol + "`)"
          );
        }
        this._checkAppIdData();
        if (!opts.hosts) {
          var defaultHosts = map(this._shuffleResult, function(hostNumber) {
            return applicationID + "-" + hostNumber + ".algolianet.com";
          });
          var mainSuffix = (opts.dsn === false ? "" : "-dsn") + ".algolia.net";
          this.hosts.read = [this.applicationID + mainSuffix].concat(
            defaultHosts
          );
          this.hosts.write = [this.applicationID + ".algolia.net"].concat(
            defaultHosts
          );
        } else if (isArray(opts.hosts)) {
          this.hosts.read = clone(opts.hosts);
          this.hosts.write = clone(opts.hosts);
        } else {
          this.hosts.read = clone(opts.hosts.read);
          this.hosts.write = clone(opts.hosts.write);
        }
        this.hosts.read = map(this.hosts.read, prepareHost(protocol));
        this.hosts.write = map(this.hosts.write, prepareHost(protocol));
        this.extraHeaders = {};
        this.cache = opts._cache || {};
        this._ua = opts._ua;
        this._useCache = opts._useCache === void 0 || opts._cache ? true : opts._useCache;
        this._useRequestCache = this._useCache && opts._useRequestCache;
        this._useFallback = opts.useFallback === void 0 ? true : opts.useFallback;
        this._setTimeout = opts._setTimeout;
        debug("init done, %j", this);
      }
      AlgoliaSearchCore.prototype.initIndex = function(indexName) {
        return new IndexCore(this, indexName);
      };
      AlgoliaSearchCore.prototype.setExtraHeader = function(name, value2) {
        this.extraHeaders[name.toLowerCase()] = value2;
      };
      AlgoliaSearchCore.prototype.getExtraHeader = function(name) {
        return this.extraHeaders[name.toLowerCase()];
      };
      AlgoliaSearchCore.prototype.unsetExtraHeader = function(name) {
        delete this.extraHeaders[name.toLowerCase()];
      };
      AlgoliaSearchCore.prototype.addAlgoliaAgent = function(algoliaAgent) {
        if (this._ua.indexOf(";" + algoliaAgent) === -1) {
          this._ua += ";" + algoliaAgent;
        }
      };
      AlgoliaSearchCore.prototype._jsonRequest = function(initialOpts) {
        this._checkAppIdData();
        var requestDebug = __webpack_require__(8)(
          "algoliasearch:" + initialOpts.url
        );
        var body;
        var cacheID;
        var additionalUA = initialOpts.additionalUA || "";
        var cache2 = initialOpts.cache;
        var client = this;
        var tries = 0;
        var usingFallback = false;
        var hasFallback = client._useFallback && client._request.fallback && initialOpts.fallback;
        var headers;
        if (this.apiKey.length > MAX_API_KEY_LENGTH && initialOpts.body !== void 0 && (initialOpts.body.params !== void 0 || initialOpts.body.requests !== void 0)) {
          initialOpts.body.apiKey = this.apiKey;
          headers = this._computeRequestHeaders({
            additionalUA,
            withApiKey: false,
            headers: initialOpts.headers
          });
        } else {
          headers = this._computeRequestHeaders({
            additionalUA,
            headers: initialOpts.headers
          });
        }
        if (initialOpts.body !== void 0) {
          body = safeJSONStringify(initialOpts.body);
        }
        requestDebug("request start");
        var debugData = [];
        function doRequest(requester, reqOpts) {
          client._checkAppIdData();
          var startTime = new Date();
          if (client._useCache && !client._useRequestCache) {
            cacheID = initialOpts.url;
          }
          if (client._useCache && !client._useRequestCache && body) {
            cacheID += "_body_" + reqOpts.body;
          }
          if (isCacheValidWithCurrentID(!client._useRequestCache, cache2, cacheID)) {
            requestDebug("serving response from cache");
            var responseText = cache2[cacheID];
            return client._promise.resolve({
              body: JSON.parse(responseText),
              responseText
            });
          }
          if (tries >= client.hosts[initialOpts.hostType].length) {
            if (!hasFallback || usingFallback) {
              requestDebug("could not get any response");
              return client._promise.reject(
                new errors.AlgoliaSearchError(
                  "Cannot connect to the AlgoliaSearch API. Send an email to support@algolia.com to report and resolve the issue. Application id was: " + client.applicationID,
                  { debugData }
                )
              );
            }
            requestDebug("switching to fallback");
            tries = 0;
            reqOpts.method = initialOpts.fallback.method;
            reqOpts.url = initialOpts.fallback.url;
            reqOpts.jsonBody = initialOpts.fallback.body;
            if (reqOpts.jsonBody) {
              reqOpts.body = safeJSONStringify(reqOpts.jsonBody);
            }
            headers = client._computeRequestHeaders({
              additionalUA,
              headers: initialOpts.headers
            });
            reqOpts.timeouts = client._getTimeoutsForRequest(
              initialOpts.hostType
            );
            client._setHostIndexByType(0, initialOpts.hostType);
            usingFallback = true;
            return doRequest(client._request.fallback, reqOpts);
          }
          var currentHost = client._getHostByType(initialOpts.hostType);
          var url = currentHost + reqOpts.url;
          var options = {
            body: reqOpts.body,
            jsonBody: reqOpts.jsonBody,
            method: reqOpts.method,
            headers,
            timeouts: reqOpts.timeouts,
            debug: requestDebug,
            forceAuthHeaders: reqOpts.forceAuthHeaders
          };
          requestDebug(
            "method: %s, url: %s, headers: %j, timeouts: %d",
            options.method,
            url,
            options.headers,
            options.timeouts
          );
          if (requester === client._request.fallback) {
            requestDebug("using fallback");
          }
          return requester.call(client, url, options).then(success, tryFallback);
          function success(httpResponse) {
            var status = httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status || httpResponse.statusCode || httpResponse && httpResponse.body && 200;
            requestDebug(
              "received response: statusCode: %s, computed statusCode: %d, headers: %j",
              httpResponse.statusCode,
              status,
              httpResponse.headers
            );
            var httpResponseOk = Math.floor(status / 100) === 2;
            var endTime = new Date();
            debugData.push({
              currentHost,
              headers: removeCredentials(headers),
              content: body || null,
              contentLength: body !== void 0 ? body.length : null,
              method: reqOpts.method,
              timeouts: reqOpts.timeouts,
              url: reqOpts.url,
              startTime,
              endTime,
              duration: endTime - startTime,
              statusCode: status
            });
            if (httpResponseOk) {
              if (client._useCache && !client._useRequestCache && cache2) {
                cache2[cacheID] = httpResponse.responseText;
              }
              return {
                responseText: httpResponse.responseText,
                body: httpResponse.body
              };
            }
            var shouldRetry = Math.floor(status / 100) !== 4;
            if (shouldRetry) {
              tries += 1;
              return retryRequest();
            }
            requestDebug("unrecoverable error");
            var unrecoverableError = new errors.AlgoliaSearchError(
              httpResponse.body && httpResponse.body.message,
              { debugData, statusCode: status }
            );
            return client._promise.reject(unrecoverableError);
          }
          function tryFallback(err) {
            requestDebug("error: %s, stack: %s", err.message, err.stack);
            var endTime = new Date();
            debugData.push({
              currentHost,
              headers: removeCredentials(headers),
              content: body || null,
              contentLength: body !== void 0 ? body.length : null,
              method: reqOpts.method,
              timeouts: reqOpts.timeouts,
              url: reqOpts.url,
              startTime,
              endTime,
              duration: endTime - startTime
            });
            if (!(err instanceof errors.AlgoliaSearchError)) {
              err = new errors.Unknown(err && err.message, err);
            }
            tries += 1;
            if (err instanceof errors.Unknown || err instanceof errors.UnparsableJSON || tries >= client.hosts[initialOpts.hostType].length && (usingFallback || !hasFallback)) {
              err.debugData = debugData;
              return client._promise.reject(err);
            }
            if (err instanceof errors.RequestTimeout) {
              return retryRequestWithHigherTimeout();
            }
            return retryRequest();
          }
          function retryRequest() {
            requestDebug("retrying request");
            client._incrementHostIndex(initialOpts.hostType);
            return doRequest(requester, reqOpts);
          }
          function retryRequestWithHigherTimeout() {
            requestDebug("retrying request with higher timeout");
            client._incrementHostIndex(initialOpts.hostType);
            client._incrementTimeoutMultipler();
            reqOpts.timeouts = client._getTimeoutsForRequest(
              initialOpts.hostType
            );
            return doRequest(requester, reqOpts);
          }
        }
        function isCacheValidWithCurrentID(useRequestCache, currentCache, currentCacheID) {
          return client._useCache && useRequestCache && currentCache && currentCache[currentCacheID] !== void 0;
        }
        function interopCallbackReturn(request2, callback) {
          if (isCacheValidWithCurrentID(client._useRequestCache, cache2, cacheID)) {
            request2.catch(function() {
              delete cache2[cacheID];
            });
          }
          if (typeof initialOpts.callback === "function") {
            request2.then(
              function okCb(content) {
                exitPromise(function() {
                  initialOpts.callback(null, callback(content));
                }, client._setTimeout || setTimeout);
              },
              function nookCb(err) {
                exitPromise(function() {
                  initialOpts.callback(err);
                }, client._setTimeout || setTimeout);
              }
            );
          } else {
            return request2.then(callback);
          }
        }
        if (client._useCache && client._useRequestCache) {
          cacheID = initialOpts.url;
        }
        if (client._useCache && client._useRequestCache && body) {
          cacheID += "_body_" + body;
        }
        if (isCacheValidWithCurrentID(client._useRequestCache, cache2, cacheID)) {
          requestDebug("serving request from cache");
          var maybePromiseForCache = cache2[cacheID];
          var promiseForCache = typeof maybePromiseForCache.then !== "function" ? client._promise.resolve({ responseText: maybePromiseForCache }) : maybePromiseForCache;
          return interopCallbackReturn(promiseForCache, function(content) {
            return JSON.parse(content.responseText);
          });
        }
        var request = doRequest(client._request, {
          url: initialOpts.url,
          method: initialOpts.method,
          body,
          jsonBody: initialOpts.body,
          timeouts: client._getTimeoutsForRequest(initialOpts.hostType),
          forceAuthHeaders: initialOpts.forceAuthHeaders
        });
        if (client._useCache && client._useRequestCache && cache2) {
          cache2[cacheID] = request;
        }
        return interopCallbackReturn(request, function(content) {
          return content.body;
        });
      };
      AlgoliaSearchCore.prototype._getSearchParams = function(args, params) {
        if (args === void 0 || args === null) {
          return params;
        }
        for (var key2 in args) {
          if (key2 !== null && args[key2] !== void 0 && args.hasOwnProperty(key2)) {
            params += params === "" ? "" : "&";
            params += key2 + "=" + encodeURIComponent(
              Object.prototype.toString.call(args[key2]) === "[object Array]" ? safeJSONStringify(args[key2]) : args[key2]
            );
          }
        }
        return params;
      };
      AlgoliaSearchCore.prototype._computeRequestHeaders = function(options) {
        var forEach = __webpack_require__(2);
        var ua = options.additionalUA ? this._ua + ";" + options.additionalUA : this._ua;
        var requestHeaders = {
          "x-algolia-agent": ua,
          "x-algolia-application-id": this.applicationID
        };
        if (options.withApiKey !== false) {
          requestHeaders["x-algolia-api-key"] = this.apiKey;
        }
        if (this.userToken) {
          requestHeaders["x-algolia-usertoken"] = this.userToken;
        }
        if (this.securityTags) {
          requestHeaders["x-algolia-tagfilters"] = this.securityTags;
        }
        forEach(this.extraHeaders, function addToRequestHeaders(value2, key2) {
          requestHeaders[key2] = value2;
        });
        if (options.headers) {
          forEach(options.headers, function addToRequestHeaders(value2, key2) {
            requestHeaders[key2] = value2;
          });
        }
        return requestHeaders;
      };
      AlgoliaSearchCore.prototype.search = function(queries2, opts, callback) {
        var isArray = __webpack_require__(6);
        var map = __webpack_require__(7);
        var usage = "Usage: client.search(arrayOfQueries[, callback])";
        if (!isArray(queries2)) {
          throw new Error(usage);
        }
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        } else if (opts === void 0) {
          opts = {};
        }
        var client = this;
        var postObj = {
          requests: map(queries2, function prepareRequest(query) {
            var params = "";
            if (query.query !== void 0) {
              params += "query=" + encodeURIComponent(query.query);
            }
            return {
              indexName: query.indexName,
              params: client._getSearchParams(query.params, params)
            };
          })
        };
        var JSONPParams = map(
          postObj.requests,
          function prepareJSONPParams(request, requestId) {
            return requestId + "=" + encodeURIComponent(
              "/1/indexes/" + encodeURIComponent(request.indexName) + "?" + request.params
            );
          }
        ).join("&");
        var url = "/1/indexes/*/queries";
        if (opts.strategy !== void 0) {
          postObj.strategy = opts.strategy;
        }
        return this._jsonRequest({
          cache: this.cache,
          method: "POST",
          url,
          body: postObj,
          hostType: "read",
          fallback: {
            method: "GET",
            url: "/1/indexes/*",
            body: { params: JSONPParams }
          },
          callback
        });
      };
      AlgoliaSearchCore.prototype.searchForFacetValues = function(queries2) {
        var isArray = __webpack_require__(6);
        var map = __webpack_require__(7);
        var usage = "Usage: client.searchForFacetValues([{indexName, params: {facetName, facetQuery, ...params}}, ...queries])";
        if (!isArray(queries2)) {
          throw new Error(usage);
        }
        var client = this;
        return client._promise.all(
          map(queries2, function performQuery(query) {
            if (!query || query.indexName === void 0 || query.params.facetName === void 0 || query.params.facetQuery === void 0) {
              throw new Error(usage);
            }
            var clone = __webpack_require__(3);
            var omit = __webpack_require__(14);
            var indexName = query.indexName;
            var params = query.params;
            var facetName = params.facetName;
            var filteredParams = omit(clone(params), function(keyName) {
              return keyName === "facetName";
            });
            var searchParameters = client._getSearchParams(filteredParams, "");
            return client._jsonRequest({
              cache: client.cache,
              method: "POST",
              url: "/1/indexes/" + encodeURIComponent(indexName) + "/facets/" + encodeURIComponent(facetName) + "/query",
              hostType: "read",
              body: { params: searchParameters }
            });
          })
        );
      };
      AlgoliaSearchCore.prototype.setSecurityTags = function(tags) {
        if (Object.prototype.toString.call(tags) === "[object Array]") {
          var strTags = [];
          for (var i = 0; i < tags.length; ++i) {
            if (Object.prototype.toString.call(tags[i]) === "[object Array]") {
              var oredTags = [];
              for (var j = 0; j < tags[i].length; ++j) {
                oredTags.push(tags[i][j]);
              }
              strTags.push("(" + oredTags.join(",") + ")");
            } else {
              strTags.push(tags[i]);
            }
          }
          tags = strTags.join(",");
        }
        this.securityTags = tags;
      };
      AlgoliaSearchCore.prototype.setUserToken = function(userToken) {
        this.userToken = userToken;
      };
      AlgoliaSearchCore.prototype.clearCache = function() {
        this.cache = {};
      };
      AlgoliaSearchCore.prototype.setRequestTimeout = function(milliseconds) {
        if (milliseconds) {
          this._timeouts.connect = this._timeouts.read = this._timeouts.write = milliseconds;
        }
      };
      AlgoliaSearchCore.prototype.setTimeouts = function(timeouts) {
        this._timeouts = timeouts;
      };
      AlgoliaSearchCore.prototype.getTimeouts = function() {
        return this._timeouts;
      };
      AlgoliaSearchCore.prototype._getAppIdData = function() {
        var data = store.get(this.applicationID);
        if (data !== null)
          this._cacheAppIdData(data);
        return data;
      };
      AlgoliaSearchCore.prototype._setAppIdData = function(data) {
        data.lastChange = new Date().getTime();
        this._cacheAppIdData(data);
        return store.set(this.applicationID, data);
      };
      AlgoliaSearchCore.prototype._checkAppIdData = function() {
        var data = this._getAppIdData();
        var now = new Date().getTime();
        if (data === null || now - data.lastChange > RESET_APP_DATA_TIMER) {
          return this._resetInitialAppIdData(data);
        }
        return data;
      };
      AlgoliaSearchCore.prototype._resetInitialAppIdData = function(data) {
        var newData = data || {};
        newData.hostIndexes = { read: 0, write: 0 };
        newData.timeoutMultiplier = 1;
        newData.shuffleResult = newData.shuffleResult || shuffle([1, 2, 3]);
        return this._setAppIdData(newData);
      };
      AlgoliaSearchCore.prototype._cacheAppIdData = function(data) {
        this._hostIndexes = data.hostIndexes;
        this._timeoutMultiplier = data.timeoutMultiplier;
        this._shuffleResult = data.shuffleResult;
      };
      AlgoliaSearchCore.prototype._partialAppIdDataUpdate = function(newData) {
        var foreach = __webpack_require__(2);
        var currentData = this._getAppIdData();
        foreach(newData, function(value2, key2) {
          currentData[key2] = value2;
        });
        return this._setAppIdData(currentData);
      };
      AlgoliaSearchCore.prototype._getHostByType = function(hostType) {
        return this.hosts[hostType][this._getHostIndexByType(hostType)];
      };
      AlgoliaSearchCore.prototype._getTimeoutMultiplier = function() {
        return this._timeoutMultiplier;
      };
      AlgoliaSearchCore.prototype._getHostIndexByType = function(hostType) {
        return this._hostIndexes[hostType];
      };
      AlgoliaSearchCore.prototype._setHostIndexByType = function(hostIndex, hostType) {
        var clone = __webpack_require__(3);
        var newHostIndexes = clone(this._hostIndexes);
        newHostIndexes[hostType] = hostIndex;
        this._partialAppIdDataUpdate({ hostIndexes: newHostIndexes });
        return hostIndex;
      };
      AlgoliaSearchCore.prototype._incrementHostIndex = function(hostType) {
        return this._setHostIndexByType(
          (this._getHostIndexByType(hostType) + 1) % this.hosts[hostType].length,
          hostType
        );
      };
      AlgoliaSearchCore.prototype._incrementTimeoutMultipler = function() {
        var timeoutMultiplier = Math.max(this._timeoutMultiplier + 1, 4);
        return this._partialAppIdDataUpdate({
          timeoutMultiplier
        });
      };
      AlgoliaSearchCore.prototype._getTimeoutsForRequest = function(hostType) {
        return {
          connect: this._timeouts.connect * this._timeoutMultiplier,
          complete: this._timeouts[hostType] * this._timeoutMultiplier
        };
      };
      function prepareHost(protocol) {
        return function prepare(host) {
          return protocol + "//" + host.toLowerCase();
        };
      }
      function safeJSONStringify(obj) {
        if (Array.prototype.toJSON === void 0) {
          return JSON.stringify(obj);
        }
        var toJSON = Array.prototype.toJSON;
        delete Array.prototype.toJSON;
        var out = JSON.stringify(obj);
        Array.prototype.toJSON = toJSON;
        return out;
      }
      function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
      function removeCredentials(headers) {
        var newHeaders = {};
        for (var headerName in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
            var value2;
            if (headerName === "x-algolia-api-key" || headerName === "x-algolia-application-id") {
              value2 = "**hidden for security purposes**";
            } else {
              value2 = headers[headerName];
            }
            newHeaders[headerName] = value2;
          }
        }
        return newHeaders;
      }
    },
    function(module2, exports2) {
      module2.exports = function exitPromise(fn2, _setTimeout) {
        _setTimeout(fn2, 0);
      };
    },
    function(module2, exports2, __webpack_require__) {
      var buildSearchMethod = __webpack_require__(13);
      var deprecate = __webpack_require__(33);
      var deprecatedMessage = __webpack_require__(34);
      module2.exports = IndexCore;
      function IndexCore(algoliasearch, indexName) {
        this.indexName = indexName;
        this.as = algoliasearch;
        this.typeAheadArgs = null;
        this.typeAheadValueOption = null;
        this.cache = {};
      }
      IndexCore.prototype.clearCache = function() {
        this.cache = {};
      };
      IndexCore.prototype.search = buildSearchMethod("query");
      IndexCore.prototype.similarSearch = buildSearchMethod("similarQuery");
      IndexCore.prototype.browse = function(query, queryParameters, callback) {
        var merge = __webpack_require__(35);
        var indexObj = this;
        var page;
        var hitsPerPage;
        if (arguments.length === 0 || arguments.length === 1 && typeof arguments[0] === "function") {
          page = 0;
          callback = arguments[0];
          query = void 0;
        } else if (typeof arguments[0] === "number") {
          page = arguments[0];
          if (typeof arguments[1] === "number") {
            hitsPerPage = arguments[1];
          } else if (typeof arguments[1] === "function") {
            callback = arguments[1];
            hitsPerPage = void 0;
          }
          query = void 0;
          queryParameters = void 0;
        } else if (typeof arguments[0] === "object") {
          if (typeof arguments[1] === "function") {
            callback = arguments[1];
          }
          queryParameters = arguments[0];
          query = void 0;
        } else if (typeof arguments[0] === "string" && typeof arguments[1] === "function") {
          callback = arguments[1];
          queryParameters = void 0;
        }
        queryParameters = merge({}, queryParameters || {}, {
          page,
          hitsPerPage,
          query
        });
        var params = this.as._getSearchParams(queryParameters, "");
        return this.as._jsonRequest({
          method: "POST",
          url: "/1/indexes/" + encodeURIComponent(indexObj.indexName) + "/browse",
          body: { params },
          hostType: "read",
          callback
        });
      };
      IndexCore.prototype.browseFrom = function(cursor, callback) {
        return this.as._jsonRequest({
          method: "POST",
          url: "/1/indexes/" + encodeURIComponent(this.indexName) + "/browse",
          body: { cursor },
          hostType: "read",
          callback
        });
      };
      IndexCore.prototype.searchForFacetValues = function(params, callback) {
        var clone = __webpack_require__(3);
        var omit = __webpack_require__(14);
        var usage = "Usage: index.searchForFacetValues({facetName, facetQuery, ...params}[, callback])";
        if (params.facetName === void 0 || params.facetQuery === void 0) {
          throw new Error(usage);
        }
        var facetName = params.facetName;
        var filteredParams = omit(clone(params), function(keyName) {
          return keyName === "facetName";
        });
        var searchParameters = this.as._getSearchParams(filteredParams, "");
        return this.as._jsonRequest({
          method: "POST",
          url: "/1/indexes/" + encodeURIComponent(this.indexName) + "/facets/" + encodeURIComponent(facetName) + "/query",
          hostType: "read",
          body: { params: searchParameters },
          callback
        });
      };
      IndexCore.prototype.searchFacet = deprecate(function(params, callback) {
        return this.searchForFacetValues(params, callback);
      }, deprecatedMessage(
        "index.searchFacet(params[, callback])",
        "index.searchForFacetValues(params[, callback])"
      ));
      IndexCore.prototype._search = function(params, url, callback, additionalUA) {
        return this.as._jsonRequest({
          cache: this.cache,
          method: "POST",
          url: url || "/1/indexes/" + encodeURIComponent(this.indexName) + "/query",
          body: { params },
          hostType: "read",
          fallback: {
            method: "GET",
            url: "/1/indexes/" + encodeURIComponent(this.indexName),
            body: { params }
          },
          callback,
          additionalUA
        });
      };
      IndexCore.prototype.getObject = function(objectID, attrs, callback) {
        var indexObj = this;
        if (arguments.length === 1 || typeof attrs === "function") {
          callback = attrs;
          attrs = void 0;
        }
        var params = "";
        if (attrs !== void 0) {
          params = "?attributes=";
          for (var i = 0; i < attrs.length; ++i) {
            if (i !== 0) {
              params += ",";
            }
            params += attrs[i];
          }
        }
        return this.as._jsonRequest({
          method: "GET",
          url: "/1/indexes/" + encodeURIComponent(indexObj.indexName) + "/" + encodeURIComponent(objectID) + params,
          hostType: "read",
          callback
        });
      };
      IndexCore.prototype.getObjects = function(objectIDs, attributesToRetrieve, callback) {
        var isArray = __webpack_require__(6);
        var map = __webpack_require__(7);
        var usage = "Usage: index.getObjects(arrayOfObjectIDs[, callback])";
        if (!isArray(objectIDs)) {
          throw new Error(usage);
        }
        var indexObj = this;
        if (arguments.length === 1 || typeof attributesToRetrieve === "function") {
          callback = attributesToRetrieve;
          attributesToRetrieve = void 0;
        }
        var body = {
          requests: map(objectIDs, function prepareRequest(objectID) {
            var request = { indexName: indexObj.indexName, objectID };
            if (attributesToRetrieve) {
              request.attributesToRetrieve = attributesToRetrieve.join(",");
            }
            return request;
          })
        };
        return this.as._jsonRequest({
          method: "POST",
          url: "/1/indexes/*/objects",
          hostType: "read",
          body,
          callback
        });
      };
      IndexCore.prototype.as = null;
      IndexCore.prototype.indexName = null;
      IndexCore.prototype.typeAheadArgs = null;
      IndexCore.prototype.typeAheadValueOption = null;
    },
    function(module2, exports2) {
      module2.exports = function deprecate(fn2, message) {
        var warned = false;
        function deprecated() {
          if (!warned) {
            console.warn(message);
            warned = true;
          }
          return fn2.apply(this, arguments);
        }
        return deprecated;
      };
    },
    function(module2, exports2) {
      module2.exports = function deprecatedMessage(previousUsage, newUsage) {
        var githubAnchorLink = previousUsage.toLowerCase().replace(/[\.\(\)]/g, "");
        return "algoliasearch: `" + previousUsage + "` was replaced by `" + newUsage + "`. Please see https://github.com/algolia/algoliasearch-client-javascript/wiki/Deprecated#" + githubAnchorLink;
      };
    },
    function(module2, exports2, __webpack_require__) {
      var foreach = __webpack_require__(2);
      module2.exports = function merge(destination) {
        var sources = Array.prototype.slice.call(arguments);
        foreach(sources, function(source) {
          for (var keyName in source) {
            if (source.hasOwnProperty(keyName)) {
              if (typeof destination[keyName] === "object" && typeof source[keyName] === "object") {
                destination[keyName] = merge(
                  {},
                  destination[keyName],
                  source[keyName]
                );
              } else if (source[keyName] !== void 0) {
                destination[keyName] = source[keyName];
              }
            }
          }
        });
        return destination;
      };
    },
    function(module2, exports2, __webpack_require__) {
      var has = Object.prototype.hasOwnProperty;
      var toStr = Object.prototype.toString;
      var slice = Array.prototype.slice;
      var isArgs = __webpack_require__(37);
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
      var hasProtoEnumBug = isEnumerable.call(function() {
      }, "prototype");
      var dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor"
      ];
      var equalsConstructorPrototype = function(o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
      };
      var excludedKeys = {
        $applicationCache: true,
        $console: true,
        $external: true,
        $frame: true,
        $frameElement: true,
        $frames: true,
        $innerHeight: true,
        $innerWidth: true,
        $outerHeight: true,
        $outerWidth: true,
        $pageXOffset: true,
        $pageYOffset: true,
        $parent: true,
        $scrollLeft: true,
        $scrollTop: true,
        $scrollX: true,
        $scrollY: true,
        $self: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $window: true
      };
      var hasAutomationEqualityBug = function() {
        if (typeof window === "undefined") {
          return false;
        }
        for (var k in window) {
          try {
            if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
              try {
                equalsConstructorPrototype(window[k]);
              } catch (e) {
                return true;
              }
            }
          } catch (e) {
            return true;
          }
        }
        return false;
      }();
      var equalsConstructorPrototypeIfNotBuggy = function(o) {
        if (typeof window === "undefined" || !hasAutomationEqualityBug) {
          return equalsConstructorPrototype(o);
        }
        try {
          return equalsConstructorPrototype(o);
        } catch (e) {
          return false;
        }
      };
      var keysShim = function keys(object) {
        var isObject = object !== null && typeof object === "object";
        var isFunction = toStr.call(object) === "[object Function]";
        var isArguments = isArgs(object);
        var isString = isObject && toStr.call(object) === "[object String]";
        var theKeys = [];
        if (!isObject && !isFunction && !isArguments) {
          throw new TypeError("Object.keys called on a non-object");
        }
        var skipProto = hasProtoEnumBug && isFunction;
        if (isString && object.length > 0 && !has.call(object, 0)) {
          for (var i = 0; i < object.length; ++i) {
            theKeys.push(String(i));
          }
        }
        if (isArguments && object.length > 0) {
          for (var j = 0; j < object.length; ++j) {
            theKeys.push(String(j));
          }
        } else {
          for (var name in object) {
            if (!(skipProto && name === "prototype") && has.call(object, name)) {
              theKeys.push(String(name));
            }
          }
        }
        if (hasDontEnumBug) {
          var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
          for (var k = 0; k < dontEnums.length; ++k) {
            if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
              theKeys.push(dontEnums[k]);
            }
          }
        }
        return theKeys;
      };
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = function() {
            return (Object.keys(arguments) || "").length === 2;
          }(1, 2);
          if (!keysWorksWithArguments) {
            var originalKeys = Object.keys;
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              } else {
                return originalKeys(object);
              }
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module2.exports = keysShim;
    },
    function(module2, exports2, __webpack_require__) {
      var toStr = Object.prototype.toString;
      module2.exports = function isArguments(value2) {
        var str = toStr.call(value2);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value2 !== null && typeof value2 === "object" && typeof value2.length === "number" && value2.length >= 0 && toStr.call(value2.callee) === "[object Function]";
        }
        return isArgs;
      };
    },
    function(module2, exports2, __webpack_require__) {
      (function(global2) {
        var debug = __webpack_require__(8)(
          "algoliasearch:src/hostIndexState.js"
        );
        var localStorageNamespace = "algoliasearch-client-js";
        var store;
        var moduleStore = {
          state: {},
          set: function(key2, data) {
            this.state[key2] = data;
            return this.state[key2];
          },
          get: function(key2) {
            return this.state[key2] || null;
          }
        };
        var localStorageStore = {
          set: function(key2, data) {
            moduleStore.set(key2, data);
            try {
              var namespace = JSON.parse(
                global2.localStorage[localStorageNamespace]
              );
              namespace[key2] = data;
              global2.localStorage[localStorageNamespace] = JSON.stringify(namespace);
              return namespace[key2];
            } catch (e) {
              return localStorageFailure(key2, e);
            }
          },
          get: function(key2) {
            try {
              return JSON.parse(global2.localStorage[localStorageNamespace])[key2] || null;
            } catch (e) {
              return localStorageFailure(key2, e);
            }
          }
        };
        function localStorageFailure(key2, e) {
          debug("localStorage failed with", e);
          cleanup();
          store = moduleStore;
          return store.get(key2);
        }
        store = supportsLocalStorage() ? localStorageStore : moduleStore;
        module2.exports = {
          get: getOrSet,
          set: getOrSet,
          supportsLocalStorage
        };
        function getOrSet(key2, data) {
          if (arguments.length === 1) {
            return store.get(key2);
          }
          return store.set(key2, data);
        }
        function supportsLocalStorage() {
          try {
            if ("localStorage" in global2 && global2.localStorage !== null) {
              if (!global2.localStorage[localStorageNamespace]) {
                global2.localStorage.setItem(
                  localStorageNamespace,
                  JSON.stringify({})
                );
              }
              return true;
            }
            return false;
          } catch (_) {
            return false;
          }
        }
        function cleanup() {
          try {
            global2.localStorage.removeItem(localStorageNamespace);
          } catch (_) {
          }
        }
      }).call(exports2, __webpack_require__(4));
    },
    function(module2, exports2, __webpack_require__) {
      exports2 = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
      exports2.coerce = coerce;
      exports2.disable = disable;
      exports2.enable = enable;
      exports2.enabled = enabled;
      exports2.humanize = __webpack_require__(40);
      exports2.names = [];
      exports2.skips = [];
      exports2.formatters = {};
      var prevTime;
      function selectColor(namespace) {
        var hash2 = 0, i;
        for (i in namespace) {
          hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i);
          hash2 |= 0;
        }
        return exports2.colors[Math.abs(hash2) % exports2.colors.length];
      }
      function createDebug(namespace) {
        function debug() {
          if (!debug.enabled)
            return;
          var self2 = debug;
          var curr = +new Date();
          var ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          args[0] = exports2.coerce(args[0]);
          if ("string" !== typeof args[0]) {
            args.unshift("%O");
          }
          var index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
            if (match === "%%")
              return match;
            index++;
            var formatter = exports2.formatters[format];
            if ("function" === typeof formatter) {
              var val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          exports2.formatArgs.call(self2, args);
          var logFn = debug.log || exports2.log || console.log.bind(console);
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.enabled = exports2.enabled(namespace);
        debug.useColors = exports2.useColors();
        debug.color = selectColor(namespace);
        if ("function" === typeof exports2.init) {
          exports2.init(debug);
        }
        return debug;
      }
      function enable(namespaces) {
        exports2.save(namespaces);
        exports2.names = [];
        exports2.skips = [];
        var split = (typeof namespaces === "string" ? namespaces : "").split(
          /[\s,]+/
        );
        var len = split.length;
        for (var i = 0; i < len; i++) {
          if (!split[i])
            continue;
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            exports2.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            exports2.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        exports2.enable("");
      }
      function enabled(name) {
        var i, len;
        for (i = 0, len = exports2.skips.length; i < len; i++) {
          if (exports2.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = exports2.names.length; i < len; i++) {
          if (exports2.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error)
          return val.stack || val.message;
        return val;
      }
    },
    function(module2, exports2) {
      var s = 1e3;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var y = d * 365.25;
      module2.exports = function(val, options) {
        options = options || {};
        var type = typeof val;
        if (type === "string" && val.length > 0) {
          return parse(val);
        } else if (type === "number" && isNaN(val) === false) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error(
          "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
        );
      };
      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
          str
        );
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || "ms").toLowerCase();
        switch (type) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return n * y;
          case "days":
          case "day":
          case "d":
            return n * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return n * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return n * m;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return n * s;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return n;
          default:
            return void 0;
        }
      }
      function fmtShort(ms) {
        if (ms >= d) {
          return Math.round(ms / d) + "d";
        }
        if (ms >= h) {
          return Math.round(ms / h) + "h";
        }
        if (ms >= m) {
          return Math.round(ms / m) + "m";
        }
        if (ms >= s) {
          return Math.round(ms / s) + "s";
        }
        return ms + "ms";
      }
      function fmtLong(ms) {
        return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
      }
      function plural(ms, n, name) {
        if (ms < n) {
          return;
        }
        if (ms < n * 1.5) {
          return Math.floor(ms / n) + " " + name;
        }
        return Math.ceil(ms / n) + " " + name + "s";
      }
    },
    function(module2, exports2, __webpack_require__) {
      var global2 = __webpack_require__(42);
      var Promise2 = global2.Promise || __webpack_require__(43).Promise;
      module2.exports = function createAlgoliasearch(AlgoliaSearch, uaSuffix) {
        var inherits = __webpack_require__(12);
        var errors = __webpack_require__(5);
        var inlineHeaders = __webpack_require__(44);
        var jsonpRequest = __webpack_require__(46);
        var places = __webpack_require__(47);
        uaSuffix = uaSuffix || "";
        function algoliasearch(applicationID, apiKey, opts) {
          var cloneDeep = __webpack_require__(3);
          opts = cloneDeep(opts || {});
          opts._ua = opts._ua || algoliasearch.ua;
          return new AlgoliaSearchBrowser(applicationID, apiKey, opts);
        }
        algoliasearch.version = __webpack_require__(48);
        algoliasearch.ua = "Algolia for vanilla JavaScript " + uaSuffix + algoliasearch.version;
        algoliasearch.initPlaces = places(algoliasearch);
        global2.__algolia = {
          debug: __webpack_require__(8),
          algoliasearch
        };
        var support = {
          hasXMLHttpRequest: "XMLHttpRequest" in global2,
          hasXDomainRequest: "XDomainRequest" in global2
        };
        if (support.hasXMLHttpRequest) {
          support.cors = "withCredentials" in new XMLHttpRequest();
        }
        function AlgoliaSearchBrowser() {
          AlgoliaSearch.apply(this, arguments);
        }
        inherits(AlgoliaSearchBrowser, AlgoliaSearch);
        AlgoliaSearchBrowser.prototype._request = function request(url, opts) {
          return new Promise2(function wrapRequest(resolve2, reject) {
            if (!support.cors && !support.hasXDomainRequest) {
              reject(new errors.Network("CORS not supported"));
              return;
            }
            url = inlineHeaders(url, opts.headers);
            var body = opts.body;
            var req = support.cors ? new XMLHttpRequest() : new XDomainRequest();
            var reqTimeout;
            var timedOut;
            var connected = false;
            reqTimeout = setTimeout(onTimeout, opts.timeouts.connect);
            req.onprogress = onProgress;
            if ("onreadystatechange" in req)
              req.onreadystatechange = onReadyStateChange;
            req.onload = onLoad;
            req.onerror = onError;
            if (req instanceof XMLHttpRequest) {
              req.open(opts.method, url, true);
              if (opts.forceAuthHeaders) {
                req.setRequestHeader(
                  "x-algolia-application-id",
                  opts.headers["x-algolia-application-id"]
                );
                req.setRequestHeader(
                  "x-algolia-api-key",
                  opts.headers["x-algolia-api-key"]
                );
              }
            } else {
              req.open(opts.method, url);
            }
            if (support.cors) {
              if (body) {
                if (opts.method === "POST") {
                  req.setRequestHeader(
                    "content-type",
                    "application/x-www-form-urlencoded"
                  );
                } else {
                  req.setRequestHeader("content-type", "application/json");
                }
              }
              req.setRequestHeader("accept", "application/json");
            }
            if (body) {
              req.send(body);
            } else {
              req.send();
            }
            function onLoad() {
              if (timedOut) {
                return;
              }
              clearTimeout(reqTimeout);
              var out;
              try {
                out = {
                  body: JSON.parse(req.responseText),
                  responseText: req.responseText,
                  statusCode: req.status,
                  headers: req.getAllResponseHeaders && req.getAllResponseHeaders() || {}
                };
              } catch (e) {
                out = new errors.UnparsableJSON({ more: req.responseText });
              }
              if (out instanceof errors.UnparsableJSON) {
                reject(out);
              } else {
                resolve2(out);
              }
            }
            function onError(event) {
              if (timedOut) {
                return;
              }
              clearTimeout(reqTimeout);
              reject(new errors.Network({ more: event }));
            }
            function onTimeout() {
              timedOut = true;
              req.abort();
              reject(new errors.RequestTimeout());
            }
            function onConnect() {
              connected = true;
              clearTimeout(reqTimeout);
              reqTimeout = setTimeout(onTimeout, opts.timeouts.complete);
            }
            function onProgress() {
              if (!connected)
                onConnect();
            }
            function onReadyStateChange() {
              if (!connected && req.readyState > 1)
                onConnect();
            }
          });
        };
        AlgoliaSearchBrowser.prototype._request.fallback = function requestFallback(url, opts) {
          url = inlineHeaders(url, opts.headers);
          return new Promise2(function wrapJsonpRequest(resolve2, reject) {
            jsonpRequest(url, opts, function jsonpRequestDone(err, content) {
              if (err) {
                reject(err);
                return;
              }
              resolve2(content);
            });
          });
        };
        AlgoliaSearchBrowser.prototype._promise = {
          reject: function rejectPromise(val) {
            return Promise2.reject(val);
          },
          resolve: function resolvePromise(val) {
            return Promise2.resolve(val);
          },
          delay: function delayPromise(ms) {
            return new Promise2(function resolveOnTimeout(resolve2) {
              setTimeout(resolve2, ms);
            });
          },
          all: function all(promises) {
            return Promise2.all(promises);
          }
        };
        return algoliasearch;
      };
    },
    function(module2, exports2, __webpack_require__) {
      (function(global2) {
        var win;
        if (typeof window !== "undefined") {
          win = window;
        } else if (typeof global2 !== "undefined") {
          win = global2;
        } else if (typeof self !== "undefined") {
          win = self;
        } else {
          win = {};
        }
        module2.exports = win;
      }).call(exports2, __webpack_require__(4));
    },
    function(module2, exports2, __webpack_require__) {
      (function(process, global2) {
        (function(global3, factory) {
          module2.exports = factory();
        })(this, function() {
          function objectOrFunction(x) {
            var type = typeof x;
            return x !== null && (type === "object" || type === "function");
          }
          function isFunction(x) {
            return typeof x === "function";
          }
          var _isArray = void 0;
          if (Array.isArray) {
            _isArray = Array.isArray;
          } else {
            _isArray = function(x) {
              return Object.prototype.toString.call(x) === "[object Array]";
            };
          }
          var isArray = _isArray;
          var len = 0;
          var vertxNext = void 0;
          var customSchedulerFn = void 0;
          var asap = function asap2(callback, arg) {
            queue2[len] = callback;
            queue2[len + 1] = arg;
            len += 2;
            if (len === 2) {
              if (customSchedulerFn) {
                customSchedulerFn(flush);
              } else {
                scheduleFlush();
              }
            }
          };
          function setScheduler(scheduleFn) {
            customSchedulerFn = scheduleFn;
          }
          function setAsap(asapFn) {
            asap = asapFn;
          }
          var browserWindow = typeof window !== "undefined" ? window : void 0;
          var browserGlobal = browserWindow || {};
          var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
          var isNode = typeof self === "undefined" && typeof process !== "undefined" && {}.toString.call(process) === "[object process]";
          var isWorker = typeof Uint8ClampedArray !== "undefined" && typeof importScripts !== "undefined" && typeof MessageChannel !== "undefined";
          function useNextTick() {
            return function() {
              return process.nextTick(flush);
            };
          }
          function useVertxTimer() {
            if (typeof vertxNext !== "undefined") {
              return function() {
                vertxNext(flush);
              };
            }
            return useSetTimeout();
          }
          function useMutationObserver() {
            var iterations = 0;
            var observer = new BrowserMutationObserver(flush);
            var node = document.createTextNode("");
            observer.observe(node, { characterData: true });
            return function() {
              node.data = iterations = ++iterations % 2;
            };
          }
          function useMessageChannel() {
            var channel = new MessageChannel();
            channel.port1.onmessage = flush;
            return function() {
              return channel.port2.postMessage(0);
            };
          }
          function useSetTimeout() {
            var globalSetTimeout = setTimeout;
            return function() {
              return globalSetTimeout(flush, 1);
            };
          }
          var queue2 = new Array(1e3);
          function flush() {
            for (var i = 0; i < len; i += 2) {
              var callback = queue2[i];
              var arg = queue2[i + 1];
              callback(arg);
              queue2[i] = void 0;
              queue2[i + 1] = void 0;
            }
            len = 0;
          }
          function attemptVertx() {
            try {
              var vertx = Function("return this")().require("vertx");
              vertxNext = vertx.runOnLoop || vertx.runOnContext;
              return useVertxTimer();
            } catch (e) {
              return useSetTimeout();
            }
          }
          var scheduleFlush = void 0;
          if (isNode) {
            scheduleFlush = useNextTick();
          } else if (BrowserMutationObserver) {
            scheduleFlush = useMutationObserver();
          } else if (isWorker) {
            scheduleFlush = useMessageChannel();
          } else if (browserWindow === void 0 && true) {
            scheduleFlush = attemptVertx();
          } else {
            scheduleFlush = useSetTimeout();
          }
          function then(onFulfillment, onRejection) {
            var parent = this;
            var child = new this.constructor(noop);
            if (child[PROMISE_ID] === void 0) {
              makePromise(child);
            }
            var _state = parent._state;
            if (_state) {
              var callback = arguments[_state - 1];
              asap(function() {
                return invokeCallback(_state, child, callback, parent._result);
              });
            } else {
              subscribe(parent, child, onFulfillment, onRejection);
            }
            return child;
          }
          function resolve$1(object) {
            var Constructor = this;
            if (object && typeof object === "object" && object.constructor === Constructor) {
              return object;
            }
            var promise = new Constructor(noop);
            resolve2(promise, object);
            return promise;
          }
          var PROMISE_ID = Math.random().toString(36).substring(2);
          function noop() {
          }
          var PENDING = void 0;
          var FULFILLED = 1;
          var REJECTED = 2;
          var TRY_CATCH_ERROR = { error: null };
          function selfFulfillment() {
            return new TypeError("You cannot resolve a promise with itself");
          }
          function cannotReturnOwn() {
            return new TypeError(
              "A promises callback cannot return that same promise."
            );
          }
          function getThen(promise) {
            try {
              return promise.then;
            } catch (error) {
              TRY_CATCH_ERROR.error = error;
              return TRY_CATCH_ERROR;
            }
          }
          function tryThen(then$$1, value2, fulfillmentHandler, rejectionHandler) {
            try {
              then$$1.call(value2, fulfillmentHandler, rejectionHandler);
            } catch (e) {
              return e;
            }
          }
          function handleForeignThenable(promise, thenable, then$$1) {
            asap(function(promise2) {
              var sealed = false;
              var error = tryThen(
                then$$1,
                thenable,
                function(value2) {
                  if (sealed) {
                    return;
                  }
                  sealed = true;
                  if (thenable !== value2) {
                    resolve2(promise2, value2);
                  } else {
                    fulfill(promise2, value2);
                  }
                },
                function(reason) {
                  if (sealed) {
                    return;
                  }
                  sealed = true;
                  reject(promise2, reason);
                },
                "Settle: " + (promise2._label || " unknown promise")
              );
              if (!sealed && error) {
                sealed = true;
                reject(promise2, error);
              }
            }, promise);
          }
          function handleOwnThenable(promise, thenable) {
            if (thenable._state === FULFILLED) {
              fulfill(promise, thenable._result);
            } else if (thenable._state === REJECTED) {
              reject(promise, thenable._result);
            } else {
              subscribe(
                thenable,
                void 0,
                function(value2) {
                  return resolve2(promise, value2);
                },
                function(reason) {
                  return reject(promise, reason);
                }
              );
            }
          }
          function handleMaybeThenable(promise, maybeThenable, then$$1) {
            if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
              handleOwnThenable(promise, maybeThenable);
            } else {
              if (then$$1 === TRY_CATCH_ERROR) {
                reject(promise, TRY_CATCH_ERROR.error);
                TRY_CATCH_ERROR.error = null;
              } else if (then$$1 === void 0) {
                fulfill(promise, maybeThenable);
              } else if (isFunction(then$$1)) {
                handleForeignThenable(promise, maybeThenable, then$$1);
              } else {
                fulfill(promise, maybeThenable);
              }
            }
          }
          function resolve2(promise, value2) {
            if (promise === value2) {
              reject(promise, selfFulfillment());
            } else if (objectOrFunction(value2)) {
              handleMaybeThenable(promise, value2, getThen(value2));
            } else {
              fulfill(promise, value2);
            }
          }
          function publishRejection(promise) {
            if (promise._onerror) {
              promise._onerror(promise._result);
            }
            publish(promise);
          }
          function fulfill(promise, value2) {
            if (promise._state !== PENDING) {
              return;
            }
            promise._result = value2;
            promise._state = FULFILLED;
            if (promise._subscribers.length !== 0) {
              asap(publish, promise);
            }
          }
          function reject(promise, reason) {
            if (promise._state !== PENDING) {
              return;
            }
            promise._state = REJECTED;
            promise._result = reason;
            asap(publishRejection, promise);
          }
          function subscribe(parent, child, onFulfillment, onRejection) {
            var _subscribers = parent._subscribers;
            var length = _subscribers.length;
            parent._onerror = null;
            _subscribers[length] = child;
            _subscribers[length + FULFILLED] = onFulfillment;
            _subscribers[length + REJECTED] = onRejection;
            if (length === 0 && parent._state) {
              asap(publish, parent);
            }
          }
          function publish(promise) {
            var subscribers = promise._subscribers;
            var settled = promise._state;
            if (subscribers.length === 0) {
              return;
            }
            var child = void 0, callback = void 0, detail = promise._result;
            for (var i = 0; i < subscribers.length; i += 3) {
              child = subscribers[i];
              callback = subscribers[i + settled];
              if (child) {
                invokeCallback(settled, child, callback, detail);
              } else {
                callback(detail);
              }
            }
            promise._subscribers.length = 0;
          }
          function tryCatch(callback, detail) {
            try {
              return callback(detail);
            } catch (e) {
              TRY_CATCH_ERROR.error = e;
              return TRY_CATCH_ERROR;
            }
          }
          function invokeCallback(settled, promise, callback, detail) {
            var hasCallback = isFunction(callback), value2 = void 0, error = void 0, succeeded = void 0, failed = void 0;
            if (hasCallback) {
              value2 = tryCatch(callback, detail);
              if (value2 === TRY_CATCH_ERROR) {
                failed = true;
                error = value2.error;
                value2.error = null;
              } else {
                succeeded = true;
              }
              if (promise === value2) {
                reject(promise, cannotReturnOwn());
                return;
              }
            } else {
              value2 = detail;
              succeeded = true;
            }
            if (promise._state !== PENDING)
              ;
            else if (hasCallback && succeeded) {
              resolve2(promise, value2);
            } else if (failed) {
              reject(promise, error);
            } else if (settled === FULFILLED) {
              fulfill(promise, value2);
            } else if (settled === REJECTED) {
              reject(promise, value2);
            }
          }
          function initializePromise(promise, resolver) {
            try {
              resolver(
                function resolvePromise(value2) {
                  resolve2(promise, value2);
                },
                function rejectPromise(reason) {
                  reject(promise, reason);
                }
              );
            } catch (e) {
              reject(promise, e);
            }
          }
          var id = 0;
          function nextId() {
            return id++;
          }
          function makePromise(promise) {
            promise[PROMISE_ID] = id++;
            promise._state = void 0;
            promise._result = void 0;
            promise._subscribers = [];
          }
          function validationError() {
            return new Error("Array Methods must be provided an Array");
          }
          var Enumerator = function() {
            function Enumerator2(Constructor, input) {
              this._instanceConstructor = Constructor;
              this.promise = new Constructor(noop);
              if (!this.promise[PROMISE_ID]) {
                makePromise(this.promise);
              }
              if (isArray(input)) {
                this.length = input.length;
                this._remaining = input.length;
                this._result = new Array(this.length);
                if (this.length === 0) {
                  fulfill(this.promise, this._result);
                } else {
                  this.length = this.length || 0;
                  this._enumerate(input);
                  if (this._remaining === 0) {
                    fulfill(this.promise, this._result);
                  }
                }
              } else {
                reject(this.promise, validationError());
              }
            }
            Enumerator2.prototype._enumerate = function _enumerate(input) {
              for (var i = 0; this._state === PENDING && i < input.length; i++) {
                this._eachEntry(input[i], i);
              }
            };
            Enumerator2.prototype._eachEntry = function _eachEntry(entry, i) {
              var c = this._instanceConstructor;
              var resolve$$1 = c.resolve;
              if (resolve$$1 === resolve$1) {
                var _then = getThen(entry);
                if (_then === then && entry._state !== PENDING) {
                  this._settledAt(entry._state, i, entry._result);
                } else if (typeof _then !== "function") {
                  this._remaining--;
                  this._result[i] = entry;
                } else if (c === Promise$1) {
                  var promise = new c(noop);
                  handleMaybeThenable(promise, entry, _then);
                  this._willSettleAt(promise, i);
                } else {
                  this._willSettleAt(
                    new c(function(resolve$$12) {
                      return resolve$$12(entry);
                    }),
                    i
                  );
                }
              } else {
                this._willSettleAt(resolve$$1(entry), i);
              }
            };
            Enumerator2.prototype._settledAt = function _settledAt(state, i, value2) {
              var promise = this.promise;
              if (promise._state === PENDING) {
                this._remaining--;
                if (state === REJECTED) {
                  reject(promise, value2);
                } else {
                  this._result[i] = value2;
                }
              }
              if (this._remaining === 0) {
                fulfill(promise, this._result);
              }
            };
            Enumerator2.prototype._willSettleAt = function _willSettleAt(promise, i) {
              var enumerator = this;
              subscribe(
                promise,
                void 0,
                function(value2) {
                  return enumerator._settledAt(FULFILLED, i, value2);
                },
                function(reason) {
                  return enumerator._settledAt(REJECTED, i, reason);
                }
              );
            };
            return Enumerator2;
          }();
          function all(entries2) {
            return new Enumerator(this, entries2).promise;
          }
          function race(entries2) {
            var Constructor = this;
            if (!isArray(entries2)) {
              return new Constructor(function(_, reject2) {
                return reject2(new TypeError("You must pass an array to race."));
              });
            } else {
              return new Constructor(function(resolve3, reject2) {
                var length = entries2.length;
                for (var i = 0; i < length; i++) {
                  Constructor.resolve(entries2[i]).then(resolve3, reject2);
                }
              });
            }
          }
          function reject$1(reason) {
            var Constructor = this;
            var promise = new Constructor(noop);
            reject(promise, reason);
            return promise;
          }
          function needsResolver() {
            throw new TypeError(
              "You must pass a resolver function as the first argument to the promise constructor"
            );
          }
          function needsNew() {
            throw new TypeError(
              "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
            );
          }
          var Promise$1 = function() {
            function Promise2(resolver) {
              this[PROMISE_ID] = nextId();
              this._result = this._state = void 0;
              this._subscribers = [];
              if (noop !== resolver) {
                typeof resolver !== "function" && needsResolver();
                this instanceof Promise2 ? initializePromise(this, resolver) : needsNew();
              }
            }
            Promise2.prototype.catch = function _catch(onRejection) {
              return this.then(null, onRejection);
            };
            Promise2.prototype.finally = function _finally(callback) {
              var promise = this;
              var constructor = promise.constructor;
              return promise.then(
                function(value2) {
                  return constructor.resolve(callback()).then(function() {
                    return value2;
                  });
                },
                function(reason) {
                  return constructor.resolve(callback()).then(function() {
                    throw reason;
                  });
                }
              );
            };
            return Promise2;
          }();
          Promise$1.prototype.then = then;
          Promise$1.all = all;
          Promise$1.race = race;
          Promise$1.resolve = resolve$1;
          Promise$1.reject = reject$1;
          Promise$1._setScheduler = setScheduler;
          Promise$1._setAsap = setAsap;
          Promise$1._asap = asap;
          function polyfill2() {
            var local = void 0;
            if (typeof global2 !== "undefined") {
              local = global2;
            } else if (typeof self !== "undefined") {
              local = self;
            } else {
              try {
                local = Function("return this")();
              } catch (e) {
                throw new Error(
                  "polyfill failed because global object is unavailable in this environment"
                );
              }
            }
            var P = local.Promise;
            if (P) {
              var promiseToString = null;
              try {
                promiseToString = Object.prototype.toString.call(P.resolve());
              } catch (e) {
              }
              if (promiseToString === "[object Promise]" && !P.cast) {
                return;
              }
            }
            local.Promise = Promise$1;
          }
          Promise$1.polyfill = polyfill2;
          Promise$1.Promise = Promise$1;
          return Promise$1;
        });
      }).call(exports2, __webpack_require__(9), __webpack_require__(4));
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = inlineHeaders;
      var encode2 = __webpack_require__(45);
      function inlineHeaders(url, headers) {
        if (/\?/.test(url)) {
          url += "&";
        } else {
          url += "?";
        }
        return url + encode2(headers);
      }
    },
    function(module2, exports2, __webpack_require__) {
      var stringifyPrimitive = function(v) {
        switch (typeof v) {
          case "string":
            return v;
          case "boolean":
            return v ? "true" : "false";
          case "number":
            return isFinite(v) ? v : "";
          default:
            return "";
        }
      };
      module2.exports = function(obj, sep, eq, name) {
        sep = sep || "&";
        eq = eq || "=";
        if (obj === null) {
          obj = void 0;
        }
        if (typeof obj === "object") {
          return map(objectKeys(obj), function(k) {
            var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
            if (isArray(obj[k])) {
              return map(obj[k], function(v) {
                return ks + encodeURIComponent(stringifyPrimitive(v));
              }).join(sep);
            } else {
              return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
            }
          }).join(sep);
        }
        if (!name)
          return "";
        return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
      };
      var isArray = Array.isArray || function(xs) {
        return Object.prototype.toString.call(xs) === "[object Array]";
      };
      function map(xs, f) {
        if (xs.map)
          return xs.map(f);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
          res.push(f(xs[i], i));
        }
        return res;
      }
      var objectKeys = Object.keys || function(obj) {
        var res = [];
        for (var key2 in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key2))
            res.push(key2);
        }
        return res;
      };
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = jsonpRequest;
      var errors = __webpack_require__(5);
      var JSONPCounter = 0;
      function jsonpRequest(url, opts, cb) {
        if (opts.method !== "GET") {
          cb(
            new Error(
              "Method " + opts.method + " " + url + " is not supported by JSONP."
            )
          );
          return;
        }
        opts.debug("JSONP: start");
        var cbCalled = false;
        var timedOut = false;
        JSONPCounter += 1;
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        var cbName = "algoliaJSONP_" + JSONPCounter;
        var done = false;
        window[cbName] = function(data) {
          removeGlobals();
          if (timedOut) {
            opts.debug("JSONP: Late answer, ignoring");
            return;
          }
          cbCalled = true;
          clean();
          cb(null, { body: data, responseText: JSON.stringify(data) });
        };
        url += "&callback=" + cbName;
        if (opts.jsonBody && opts.jsonBody.params) {
          url += "&" + opts.jsonBody.params;
        }
        var ontimeout = setTimeout(timeout, opts.timeouts.complete);
        script.onreadystatechange = readystatechange;
        script.onload = success;
        script.onerror = error;
        script.async = true;
        script.defer = true;
        script.src = url;
        head.appendChild(script);
        function success() {
          opts.debug("JSONP: success");
          if (done || timedOut) {
            return;
          }
          done = true;
          if (!cbCalled) {
            opts.debug(
              "JSONP: Fail. Script loaded but did not call the callback"
            );
            clean();
            cb(new errors.JSONPScriptFail());
          }
        }
        function readystatechange() {
          if (this.readyState === "loaded" || this.readyState === "complete") {
            success();
          }
        }
        function clean() {
          clearTimeout(ontimeout);
          script.onload = null;
          script.onreadystatechange = null;
          script.onerror = null;
          head.removeChild(script);
        }
        function removeGlobals() {
          try {
            delete window[cbName];
            delete window[cbName + "_loaded"];
          } catch (e) {
            window[cbName] = window[cbName + "_loaded"] = void 0;
          }
        }
        function timeout() {
          opts.debug("JSONP: Script timeout");
          timedOut = true;
          clean();
          cb(new errors.RequestTimeout());
        }
        function error() {
          opts.debug("JSONP: Script error");
          if (done || timedOut) {
            return;
          }
          clean();
          cb(new errors.JSONPScriptError());
        }
      }
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = createPlacesClient;
      var buildSearchMethod = __webpack_require__(13);
      function createPlacesClient(algoliasearch) {
        return function places(appID, apiKey, opts) {
          var cloneDeep = __webpack_require__(3);
          opts = opts && cloneDeep(opts) || {};
          opts.hosts = opts.hosts || [
            "places-dsn.algolia.net",
            "places-1.algolianet.com",
            "places-2.algolianet.com",
            "places-3.algolianet.com"
          ];
          if (arguments.length === 0 || typeof appID === "object" || appID === void 0) {
            appID = "";
            apiKey = "";
            opts._allowEmptyCredentials = true;
          }
          var client = algoliasearch(appID, apiKey, opts);
          var index = client.initIndex("places");
          index.search = buildSearchMethod("query", "/1/places/query");
          index.getObject = function(objectID, callback) {
            return this.as._jsonRequest({
              method: "GET",
              url: "/1/places/" + encodeURIComponent(objectID),
              hostType: "read",
              callback
            });
          };
          return index;
        };
      }
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = "3.30.0";
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = __webpack_require__(50);
    },
    function(module2, exports2, __webpack_require__) {
      var zepto = __webpack_require__(15);
      var DOM = __webpack_require__(1);
      DOM.element = zepto;
      var _ = __webpack_require__(0);
      _.isArray = zepto.isArray;
      _.isFunction = zepto.isFunction;
      _.isObject = zepto.isPlainObject;
      _.bind = zepto.proxy;
      _.each = function(collection, cb) {
        zepto.each(collection, reverseArgs);
        function reverseArgs(index, value2) {
          return cb(value2, index);
        }
      };
      _.map = zepto.map;
      _.mixin = zepto.extend;
      _.Event = zepto.Event;
      var typeaheadKey = "aaAutocomplete";
      var Typeahead = __webpack_require__(51);
      var EventBus = __webpack_require__(16);
      function autocomplete(selector, options, datasets, typeaheadObject) {
        datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 2);
        var inputs = zepto(selector).each(function(i, input) {
          var $input = zepto(input);
          var eventBus = new EventBus({ el: $input });
          var typeahead = typeaheadObject || new Typeahead({
            input: $input,
            eventBus,
            dropdownMenuContainer: options.dropdownMenuContainer,
            hint: options.hint === void 0 ? true : !!options.hint,
            minLength: options.minLength,
            autoselect: options.autoselect,
            autoselectOnBlur: options.autoselectOnBlur,
            tabAutocomplete: options.tabAutocomplete,
            openOnFocus: options.openOnFocus,
            templates: options.templates,
            debug: options.debug,
            clearOnSelected: options.clearOnSelected,
            cssClasses: options.cssClasses,
            datasets,
            keyboardShortcuts: options.keyboardShortcuts,
            appendTo: options.appendTo,
            autoWidth: options.autoWidth,
            ariaLabel: options.ariaLabel || input.getAttribute("aria-label")
          });
          $input.data(typeaheadKey, typeahead);
        });
        inputs.autocomplete = {};
        _.each(
          ["open", "close", "getVal", "setVal", "destroy", "getWrapper"],
          function(method) {
            inputs.autocomplete[method] = function() {
              var methodArguments = arguments;
              var result;
              inputs.each(function(j, input) {
                var typeahead = zepto(input).data(typeaheadKey);
                result = typeahead[method].apply(typeahead, methodArguments);
              });
              return result;
            };
          }
        );
        return inputs;
      }
      autocomplete.sources = Typeahead.sources;
      autocomplete.escapeHighlightedString = _.escapeHighlightedString;
      var wasAutocompleteSet = "autocomplete" in window;
      var oldAutocomplete = window.autocomplete;
      autocomplete.noConflict = function noConflict() {
        if (wasAutocompleteSet) {
          window.autocomplete = oldAutocomplete;
        } else {
          delete window.autocomplete;
        }
        return autocomplete;
      };
      module2.exports = autocomplete;
    },
    function(module2, exports2, __webpack_require__) {
      var attrsKey = "aaAttrs";
      var _ = __webpack_require__(0);
      var DOM = __webpack_require__(1);
      var EventBus = __webpack_require__(16);
      var Input = __webpack_require__(52);
      var Dropdown = __webpack_require__(59);
      var html2 = __webpack_require__(17);
      var css = __webpack_require__(11);
      function Typeahead(o) {
        var $menu;
        var $hint;
        o = o || {};
        if (!o.input) {
          _.error("missing input");
        }
        this.isActivated = false;
        this.debug = !!o.debug;
        this.autoselect = !!o.autoselect;
        this.autoselectOnBlur = !!o.autoselectOnBlur;
        this.openOnFocus = !!o.openOnFocus;
        this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
        this.autoWidth = o.autoWidth === void 0 ? true : !!o.autoWidth;
        this.clearOnSelected = !!o.clearOnSelected;
        this.tabAutocomplete = o.tabAutocomplete === void 0 ? true : !!o.tabAutocomplete;
        o.hint = !!o.hint;
        if (o.hint && o.appendTo) {
          throw new Error(
            "[autocomplete.js] hint and appendTo options can't be used at the same time"
          );
        }
        this.css = o.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
        this.cssClasses = o.cssClasses = _.mixin(
          {},
          css.defaultClasses,
          o.cssClasses || {}
        );
        this.cssClasses.prefix = o.cssClasses.formattedPrefix = _.formatPrefix(
          this.cssClasses.prefix,
          this.cssClasses.noPrefix
        );
        this.listboxId = o.listboxId = [
          this.cssClasses.root,
          "listbox",
          _.getUniqueId()
        ].join("-");
        var domElts = buildDom(o);
        this.$node = domElts.wrapper;
        var $input = this.$input = domElts.input;
        $menu = domElts.menu;
        $hint = domElts.hint;
        if (o.dropdownMenuContainer) {
          DOM.element(o.dropdownMenuContainer).css("position", "relative").append($menu.css("top", "0"));
        }
        $input.on("blur.aa", function($e) {
          var active = document.activeElement;
          if (_.isMsie() && ($menu[0] === active || $menu[0].contains(active))) {
            $e.preventDefault();
            $e.stopImmediatePropagation();
            _.defer(function() {
              $input.focus();
            });
          }
        });
        $menu.on("mousedown.aa", function($e) {
          $e.preventDefault();
        });
        this.eventBus = o.eventBus || new EventBus({ el: $input });
        this.dropdown = new Typeahead.Dropdown({
          appendTo: o.appendTo,
          wrapper: this.$node,
          menu: $menu,
          datasets: o.datasets,
          templates: o.templates,
          cssClasses: o.cssClasses,
          minLength: this.minLength
        }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onSync("shown", this._onShown, this).onSync("empty", this._onEmpty, this).onSync("redrawn", this._onRedrawn, this).onAsync("datasetRendered", this._onDatasetRendered, this);
        this.input = new Typeahead.Input({ input: $input, hint: $hint }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
        this._bindKeyboardShortcuts(o);
        this._setLanguageDirection();
      }
      _.mixin(Typeahead.prototype, {
        _bindKeyboardShortcuts: function(options) {
          if (!options.keyboardShortcuts) {
            return;
          }
          var $input = this.$input;
          var keyboardShortcuts = [];
          _.each(options.keyboardShortcuts, function(key2) {
            if (typeof key2 === "string") {
              key2 = key2.toUpperCase().charCodeAt(0);
            }
            keyboardShortcuts.push(key2);
          });
          DOM.element(document).keydown(function(event) {
            var elt = event.target || event.srcElement;
            var tagName = elt.tagName;
            if (elt.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA") {
              return;
            }
            var which = event.which || event.keyCode;
            if (keyboardShortcuts.indexOf(which) === -1) {
              return;
            }
            $input.focus();
            event.stopPropagation();
            event.preventDefault();
          });
        },
        _onSuggestionClicked: function onSuggestionClicked(type, $el) {
          var datum;
          var context2 = { selectionMethod: "click" };
          if (datum = this.dropdown.getDatumForSuggestion($el)) {
            this._select(datum, context2);
          }
        },
        _onCursorMoved: function onCursorMoved(event, updateInput) {
          var datum = this.dropdown.getDatumForCursor();
          var currentCursorId = this.dropdown.getCurrentCursor().attr("id");
          this.input.setActiveDescendant(currentCursorId);
          if (datum) {
            if (updateInput) {
              this.input.setInputValue(datum.value, true);
            }
            this.eventBus.trigger(
              "cursorchanged",
              datum.raw,
              datum.datasetName
            );
          }
        },
        _onCursorRemoved: function onCursorRemoved() {
          this.input.resetInputValue();
          this._updateHint();
          this.eventBus.trigger("cursorremoved");
        },
        _onDatasetRendered: function onDatasetRendered() {
          this._updateHint();
          this.eventBus.trigger("updated");
        },
        _onOpened: function onOpened() {
          this._updateHint();
          this.input.expand();
          this.eventBus.trigger("opened");
        },
        _onEmpty: function onEmpty() {
          this.eventBus.trigger("empty");
        },
        _onRedrawn: function onRedrawn() {
          this.$node.css("top", 0 + "px");
          this.$node.css("left", 0 + "px");
          var inputRect = this.$input[0].getBoundingClientRect();
          if (this.autoWidth) {
            this.$node.css("width", inputRect.width + "px");
          }
          var wrapperRect = this.$node[0].getBoundingClientRect();
          var top2 = inputRect.bottom - wrapperRect.top;
          this.$node.css("top", top2 + "px");
          var left2 = inputRect.left - wrapperRect.left;
          this.$node.css("left", left2 + "px");
          this.eventBus.trigger("redrawn");
        },
        _onShown: function onShown() {
          this.eventBus.trigger("shown");
          if (this.autoselect) {
            this.dropdown.cursorTopSuggestion();
          }
        },
        _onClosed: function onClosed() {
          this.input.clearHint();
          this.input.removeActiveDescendant();
          this.input.collapse();
          this.eventBus.trigger("closed");
        },
        _onFocused: function onFocused() {
          this.isActivated = true;
          if (this.openOnFocus) {
            var query = this.input.getQuery();
            if (query.length >= this.minLength) {
              this.dropdown.update(query);
            } else {
              this.dropdown.empty();
            }
            this.dropdown.open();
          }
        },
        _onBlurred: function onBlurred() {
          var cursorDatum;
          var topSuggestionDatum;
          cursorDatum = this.dropdown.getDatumForCursor();
          topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
          var context2 = { selectionMethod: "blur" };
          if (!this.debug) {
            if (this.autoselectOnBlur && cursorDatum) {
              this._select(cursorDatum, context2);
            } else if (this.autoselectOnBlur && topSuggestionDatum) {
              this._select(topSuggestionDatum, context2);
            } else {
              this.isActivated = false;
              this.dropdown.empty();
              this.dropdown.close();
            }
          }
        },
        _onEnterKeyed: function onEnterKeyed(type, $e) {
          var cursorDatum;
          var topSuggestionDatum;
          cursorDatum = this.dropdown.getDatumForCursor();
          topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
          var context2 = { selectionMethod: "enterKey" };
          if (cursorDatum) {
            this._select(cursorDatum, context2);
            $e.preventDefault();
          } else if (this.autoselect && topSuggestionDatum) {
            this._select(topSuggestionDatum, context2);
            $e.preventDefault();
          }
        },
        _onTabKeyed: function onTabKeyed(type, $e) {
          if (!this.tabAutocomplete) {
            this.dropdown.close();
            return;
          }
          var datum;
          var context2 = { selectionMethod: "tabKey" };
          if (datum = this.dropdown.getDatumForCursor()) {
            this._select(datum, context2);
            $e.preventDefault();
          } else {
            this._autocomplete(true);
          }
        },
        _onEscKeyed: function onEscKeyed() {
          this.dropdown.close();
          this.input.resetInputValue();
        },
        _onUpKeyed: function onUpKeyed() {
          var query = this.input.getQuery();
          if (this.dropdown.isEmpty && query.length >= this.minLength) {
            this.dropdown.update(query);
          } else {
            this.dropdown.moveCursorUp();
          }
          this.dropdown.open();
        },
        _onDownKeyed: function onDownKeyed() {
          var query = this.input.getQuery();
          if (this.dropdown.isEmpty && query.length >= this.minLength) {
            this.dropdown.update(query);
          } else {
            this.dropdown.moveCursorDown();
          }
          this.dropdown.open();
        },
        _onLeftKeyed: function onLeftKeyed() {
          if (this.dir === "rtl") {
            this._autocomplete();
          }
        },
        _onRightKeyed: function onRightKeyed() {
          if (this.dir === "ltr") {
            this._autocomplete();
          }
        },
        _onQueryChanged: function onQueryChanged(e, query) {
          this.input.clearHintIfInvalid();
          if (query.length >= this.minLength) {
            this.dropdown.update(query);
          } else {
            this.dropdown.empty();
          }
          this.dropdown.open();
          this._setLanguageDirection();
        },
        _onWhitespaceChanged: function onWhitespaceChanged() {
          this._updateHint();
          this.dropdown.open();
        },
        _setLanguageDirection: function setLanguageDirection() {
          var dir = this.input.getLanguageDirection();
          if (this.dir !== dir) {
            this.dir = dir;
            this.$node.css("direction", dir);
            this.dropdown.setLanguageDirection(dir);
          }
        },
        _updateHint: function updateHint() {
          var datum;
          var val;
          var query;
          var escapedQuery;
          var frontMatchRegEx;
          var match;
          datum = this.dropdown.getDatumForTopSuggestion();
          if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
            val = this.input.getInputValue();
            query = Input.normalizeQuery(val);
            escapedQuery = _.escapeRegExChars(query);
            frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
            match = frontMatchRegEx.exec(datum.value);
            if (match) {
              this.input.setHint(val + match[1]);
            } else {
              this.input.clearHint();
            }
          } else {
            this.input.clearHint();
          }
        },
        _autocomplete: function autocomplete(laxCursor) {
          var hint;
          var query;
          var isCursorAtEnd;
          var datum;
          hint = this.input.getHint();
          query = this.input.getQuery();
          isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
          if (hint && query !== hint && isCursorAtEnd) {
            datum = this.dropdown.getDatumForTopSuggestion();
            if (datum) {
              this.input.setInputValue(datum.value);
            }
            this.eventBus.trigger(
              "autocompleted",
              datum.raw,
              datum.datasetName
            );
          }
        },
        _select: function select(datum, context2) {
          if (typeof datum.value !== "undefined") {
            this.input.setQuery(datum.value);
          }
          if (this.clearOnSelected) {
            this.setVal("");
          } else {
            this.input.setInputValue(datum.value, true);
          }
          this._setLanguageDirection();
          var event = this.eventBus.trigger(
            "selected",
            datum.raw,
            datum.datasetName,
            context2
          );
          if (event.isDefaultPrevented() === false) {
            this.dropdown.close();
            _.defer(_.bind(this.dropdown.empty, this.dropdown));
          }
        },
        open: function open() {
          if (!this.isActivated) {
            var query = this.input.getInputValue();
            if (query.length >= this.minLength) {
              this.dropdown.update(query);
            } else {
              this.dropdown.empty();
            }
          }
          this.dropdown.open();
        },
        close: function close() {
          this.dropdown.close();
        },
        setVal: function setVal(val) {
          val = _.toStr(val);
          if (this.isActivated) {
            this.input.setInputValue(val);
          } else {
            this.input.setQuery(val);
            this.input.setInputValue(val, true);
          }
          this._setLanguageDirection();
        },
        getVal: function getVal() {
          return this.input.getQuery();
        },
        destroy: function destroy() {
          this.input.destroy();
          this.dropdown.destroy();
          destroyDomStructure(this.$node, this.cssClasses);
          this.$node = null;
        },
        getWrapper: function getWrapper() {
          return this.dropdown.$container[0];
        }
      });
      function buildDom(options) {
        var $input;
        var $wrapper;
        var $dropdown;
        var $hint;
        $input = DOM.element(options.input);
        $wrapper = DOM.element(
          html2.wrapper.replace("%ROOT%", options.cssClasses.root)
        ).css(options.css.wrapper);
        if (!options.appendTo && $input.css("display") === "block" && $input.parent().css("display") === "table") {
          $wrapper.css("display", "table-cell");
        }
        var dropdownHtml = html2.dropdown.replace("%PREFIX%", options.cssClasses.prefix).replace("%DROPDOWN_MENU%", options.cssClasses.dropdownMenu);
        $dropdown = DOM.element(dropdownHtml).css(options.css.dropdown).attr({ role: "listbox", id: options.listboxId });
        if (options.templates && options.templates.dropdownMenu) {
          $dropdown.html(_.templatify(options.templates.dropdownMenu)());
        }
        $hint = $input.clone().css(options.css.hint).css(getBackgroundStyles($input));
        $hint.val("").addClass(
          _.className(
            options.cssClasses.prefix,
            options.cssClasses.hint,
            true
          )
        ).removeAttr("id name placeholder required").prop("readonly", true).attr({
          "aria-hidden": "true",
          autocomplete: "off",
          spellcheck: "false",
          tabindex: -1
        });
        if ($hint.removeData) {
          $hint.removeData();
        }
        $input.data(attrsKey, {
          "aria-autocomplete": $input.attr("aria-autocomplete"),
          "aria-expanded": $input.attr("aria-expanded"),
          "aria-owns": $input.attr("aria-owns"),
          autocomplete: $input.attr("autocomplete"),
          dir: $input.attr("dir"),
          role: $input.attr("role"),
          spellcheck: $input.attr("spellcheck"),
          style: $input.attr("style"),
          type: $input.attr("type")
        });
        $input.addClass(
          _.className(
            options.cssClasses.prefix,
            options.cssClasses.input,
            true
          )
        ).attr({
          autocomplete: "off",
          spellcheck: false,
          role: "combobox",
          "aria-autocomplete": options.datasets && options.datasets[0] && options.datasets[0].displayKey ? "both" : "list",
          "aria-expanded": "false",
          "aria-label": options.ariaLabel,
          "aria-owns": options.listboxId
        }).css(options.hint ? options.css.input : options.css.inputWithNoHint);
        try {
          if (!$input.attr("dir")) {
            $input.attr("dir", "auto");
          }
        } catch (e) {
        }
        $wrapper = options.appendTo ? $wrapper.appendTo(DOM.element(options.appendTo).eq(0)).eq(0) : $input.wrap($wrapper).parent();
        $wrapper.prepend(options.hint ? $hint : null).append($dropdown);
        return {
          wrapper: $wrapper,
          input: $input,
          hint: $hint,
          menu: $dropdown
        };
      }
      function getBackgroundStyles($el) {
        return {
          backgroundAttachment: $el.css("background-attachment"),
          backgroundClip: $el.css("background-clip"),
          backgroundColor: $el.css("background-color"),
          backgroundImage: $el.css("background-image"),
          backgroundOrigin: $el.css("background-origin"),
          backgroundPosition: $el.css("background-position"),
          backgroundRepeat: $el.css("background-repeat"),
          backgroundSize: $el.css("background-size")
        };
      }
      function destroyDomStructure($node, cssClasses) {
        var $input = $node.find(
          _.className(cssClasses.prefix, cssClasses.input)
        );
        _.each($input.data(attrsKey), function(val, key2) {
          if (val === void 0) {
            $input.removeAttr(key2);
          } else {
            $input.attr(key2, val);
          }
        });
        $input.detach().removeClass(_.className(cssClasses.prefix, cssClasses.input, true)).insertAfter($node);
        if ($input.removeData) {
          $input.removeData(attrsKey);
        }
        $node.remove();
      }
      Typeahead.Dropdown = Dropdown;
      Typeahead.Input = Input;
      Typeahead.sources = __webpack_require__(61);
      module2.exports = Typeahead;
    },
    function(module2, exports2, __webpack_require__) {
      var specialKeyCodeMap;
      specialKeyCodeMap = {
        9: "tab",
        27: "esc",
        37: "left",
        39: "right",
        13: "enter",
        38: "up",
        40: "down"
      };
      var _ = __webpack_require__(0);
      var DOM = __webpack_require__(1);
      var EventEmitter = __webpack_require__(10);
      function Input(o) {
        var that = this;
        var onBlur;
        var onFocus;
        var onKeydown;
        var onInput;
        o = o || {};
        if (!o.input) {
          _.error("input is missing");
        }
        onBlur = _.bind(this._onBlur, this);
        onFocus = _.bind(this._onFocus, this);
        onKeydown = _.bind(this._onKeydown, this);
        onInput = _.bind(this._onInput, this);
        this.$hint = DOM.element(o.hint);
        this.$input = DOM.element(o.input).on("blur.aa", onBlur).on("focus.aa", onFocus).on("keydown.aa", onKeydown);
        if (this.$hint.length === 0) {
          this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
        }
        if (!_.isMsie()) {
          this.$input.on("input.aa", onInput);
        } else {
          this.$input.on(
            "keydown.aa keypress.aa cut.aa paste.aa",
            function($e) {
              if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                return;
              }
              _.defer(_.bind(that._onInput, that, $e));
            }
          );
        }
        this.query = this.$input.val();
        this.$overflowHelper = buildOverflowHelper(this.$input);
      }
      Input.normalizeQuery = function(str) {
        return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
      };
      _.mixin(Input.prototype, EventEmitter, {
        _onBlur: function onBlur() {
          this.resetInputValue();
          this.$input.removeAttr("aria-activedescendant");
          this.trigger("blurred");
        },
        _onFocus: function onFocus() {
          this.trigger("focused");
        },
        _onKeydown: function onKeydown($e) {
          var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
          this._managePreventDefault(keyName, $e);
          if (keyName && this._shouldTrigger(keyName, $e)) {
            this.trigger(keyName + "Keyed", $e);
          }
        },
        _onInput: function onInput() {
          this._checkInputValue();
        },
        _managePreventDefault: function managePreventDefault(keyName, $e) {
          var preventDefault;
          var hintValue;
          var inputValue;
          switch (keyName) {
            case "tab":
              hintValue = this.getHint();
              inputValue = this.getInputValue();
              preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
              break;
            case "up":
            case "down":
              preventDefault = !withModifier($e);
              break;
            default:
              preventDefault = false;
          }
          if (preventDefault) {
            $e.preventDefault();
          }
        },
        _shouldTrigger: function shouldTrigger(keyName, $e) {
          var trigger;
          switch (keyName) {
            case "tab":
              trigger = !withModifier($e);
              break;
            default:
              trigger = true;
          }
          return trigger;
        },
        _checkInputValue: function checkInputValue() {
          var inputValue;
          var areEquivalent;
          var hasDifferentWhitespace;
          inputValue = this.getInputValue();
          areEquivalent = areQueriesEquivalent(inputValue, this.query);
          hasDifferentWhitespace = areEquivalent && this.query ? this.query.length !== inputValue.length : false;
          this.query = inputValue;
          if (!areEquivalent) {
            this.trigger("queryChanged", this.query);
          } else if (hasDifferentWhitespace) {
            this.trigger("whitespaceChanged", this.query);
          }
        },
        focus: function focus() {
          this.$input.focus();
        },
        blur: function blur() {
          this.$input.blur();
        },
        getQuery: function getQuery() {
          return this.query;
        },
        setQuery: function setQuery(query) {
          this.query = query;
        },
        getInputValue: function getInputValue() {
          return this.$input.val();
        },
        setInputValue: function setInputValue(value2, silent) {
          if (typeof value2 === "undefined") {
            value2 = this.query;
          }
          this.$input.val(value2);
          if (silent) {
            this.clearHint();
          } else {
            this._checkInputValue();
          }
        },
        expand: function expand() {
          this.$input.attr("aria-expanded", "true");
        },
        collapse: function collapse() {
          this.$input.attr("aria-expanded", "false");
        },
        setActiveDescendant: function setActiveDescendant(activedescendantId) {
          this.$input.attr("aria-activedescendant", activedescendantId);
        },
        removeActiveDescendant: function removeActiveDescendant() {
          this.$input.removeAttr("aria-activedescendant");
        },
        resetInputValue: function resetInputValue() {
          this.setInputValue(this.query, true);
        },
        getHint: function getHint() {
          return this.$hint.val();
        },
        setHint: function setHint(value2) {
          this.$hint.val(value2);
        },
        clearHint: function clearHint() {
          this.setHint("");
        },
        clearHintIfInvalid: function clearHintIfInvalid() {
          var val;
          var hint;
          var valIsPrefixOfHint;
          var isValid2;
          val = this.getInputValue();
          hint = this.getHint();
          valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
          isValid2 = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
          if (!isValid2) {
            this.clearHint();
          }
        },
        getLanguageDirection: function getLanguageDirection() {
          return (this.$input.css("direction") || "ltr").toLowerCase();
        },
        hasOverflow: function hasOverflow() {
          var constraint = this.$input.width() - 2;
          this.$overflowHelper.text(this.getInputValue());
          return this.$overflowHelper.width() >= constraint;
        },
        isCursorAtEnd: function() {
          var valueLength;
          var selectionStart;
          var range;
          valueLength = this.$input.val().length;
          selectionStart = this.$input[0].selectionStart;
          if (_.isNumber(selectionStart)) {
            return selectionStart === valueLength;
          } else if (document.selection) {
            range = document.selection.createRange();
            range.moveStart("character", -valueLength);
            return valueLength === range.text.length;
          }
          return true;
        },
        destroy: function destroy() {
          this.$hint.off(".aa");
          this.$input.off(".aa");
          this.$hint = this.$input = this.$overflowHelper = null;
        }
      });
      function buildOverflowHelper($input) {
        return DOM.element('<pre aria-hidden="true"></pre>').css({
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          fontFamily: $input.css("font-family"),
          fontSize: $input.css("font-size"),
          fontStyle: $input.css("font-style"),
          fontVariant: $input.css("font-variant"),
          fontWeight: $input.css("font-weight"),
          wordSpacing: $input.css("word-spacing"),
          letterSpacing: $input.css("letter-spacing"),
          textIndent: $input.css("text-indent"),
          textRendering: $input.css("text-rendering"),
          textTransform: $input.css("text-transform")
        }).insertAfter($input);
      }
      function areQueriesEquivalent(a, b) {
        return Input.normalizeQuery(a) === Input.normalizeQuery(b);
      }
      function withModifier($e) {
        return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
      }
      module2.exports = Input;
    },
    function(module2, exports2, __webpack_require__) {
      var types = [
        __webpack_require__(54),
        __webpack_require__(55),
        __webpack_require__(56),
        __webpack_require__(57),
        __webpack_require__(58)
      ];
      var draining;
      var currentQueue;
      var queueIndex = -1;
      var queue2 = [];
      var scheduled = false;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue2 = currentQueue.concat(queue2);
        } else {
          queueIndex = -1;
        }
        if (queue2.length) {
          nextTick();
        }
      }
      function nextTick() {
        if (draining) {
          return;
        }
        scheduled = false;
        draining = true;
        var len2 = queue2.length;
        var timeout = setTimeout(cleanUpNextTick);
        while (len2) {
          currentQueue = queue2;
          queue2 = [];
          while (currentQueue && ++queueIndex < len2) {
            currentQueue[queueIndex].run();
          }
          queueIndex = -1;
          len2 = queue2.length;
        }
        currentQueue = null;
        queueIndex = -1;
        draining = false;
        clearTimeout(timeout);
      }
      var scheduleDrain;
      var i = -1;
      var len = types.length;
      while (++i < len) {
        if (types[i] && types[i].test && types[i].test()) {
          scheduleDrain = types[i].install(nextTick);
          break;
        }
      }
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        var fun = this.fun;
        var array = this.array;
        switch (array.length) {
          case 0:
            return fun();
          case 1:
            return fun(array[0]);
          case 2:
            return fun(array[0], array[1]);
          case 3:
            return fun(array[0], array[1], array[2]);
          default:
            return fun.apply(null, array);
        }
      };
      module2.exports = immediate;
      function immediate(task) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i2 = 1; i2 < arguments.length; i2++) {
            args[i2 - 1] = arguments[i2];
          }
        }
        queue2.push(new Item(task, args));
        if (!scheduled && !draining) {
          scheduled = true;
          scheduleDrain();
        }
      }
    },
    function(module2, exports2, __webpack_require__) {
      (function(process) {
        exports2.test = function() {
          return typeof process !== "undefined" && !process.browser;
        };
        exports2.install = function(func) {
          return function() {
            process.nextTick(func);
          };
        };
      }).call(exports2, __webpack_require__(9));
    },
    function(module2, exports2, __webpack_require__) {
      (function(global2) {
        var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
        exports2.test = function() {
          return Mutation;
        };
        exports2.install = function(handle) {
          var called = 0;
          var observer = new Mutation(handle);
          var element = global2.document.createTextNode("");
          observer.observe(element, { characterData: true });
          return function() {
            element.data = called = ++called % 2;
          };
        };
      }).call(exports2, __webpack_require__(4));
    },
    function(module2, exports2, __webpack_require__) {
      (function(global2) {
        exports2.test = function() {
          if (global2.setImmediate) {
            return false;
          }
          return typeof global2.MessageChannel !== "undefined";
        };
        exports2.install = function(func) {
          var channel = new global2.MessageChannel();
          channel.port1.onmessage = func;
          return function() {
            channel.port2.postMessage(0);
          };
        };
      }).call(exports2, __webpack_require__(4));
    },
    function(module2, exports2, __webpack_require__) {
      (function(global2) {
        exports2.test = function() {
          return "document" in global2 && "onreadystatechange" in global2.document.createElement("script");
        };
        exports2.install = function(handle) {
          return function() {
            var scriptEl = global2.document.createElement("script");
            scriptEl.onreadystatechange = function() {
              handle();
              scriptEl.onreadystatechange = null;
              scriptEl.parentNode.removeChild(scriptEl);
              scriptEl = null;
            };
            global2.document.documentElement.appendChild(scriptEl);
            return handle;
          };
        };
      }).call(exports2, __webpack_require__(4));
    },
    function(module2, exports2, __webpack_require__) {
      exports2.test = function() {
        return true;
      };
      exports2.install = function(t) {
        return function() {
          setTimeout(t, 0);
        };
      };
    },
    function(module2, exports2, __webpack_require__) {
      var _ = __webpack_require__(0);
      var DOM = __webpack_require__(1);
      var EventEmitter = __webpack_require__(10);
      var Dataset = __webpack_require__(60);
      var css = __webpack_require__(11);
      function Dropdown(o) {
        var that = this;
        var onSuggestionClick;
        var onSuggestionMouseEnter;
        var onSuggestionMouseLeave;
        o = o || {};
        if (!o.menu) {
          _.error("menu is required");
        }
        if (!_.isArray(o.datasets) && !_.isObject(o.datasets)) {
          _.error("1 or more datasets required");
        }
        if (!o.datasets) {
          _.error("datasets is required");
        }
        this.isOpen = false;
        this.isEmpty = true;
        this.minLength = o.minLength || 0;
        this.templates = {};
        this.appendTo = o.appendTo || false;
        this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
        this.cssClasses = o.cssClasses = _.mixin(
          {},
          css.defaultClasses,
          o.cssClasses || {}
        );
        this.cssClasses.prefix = o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
        onSuggestionClick = _.bind(this._onSuggestionClick, this);
        onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
        onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
        var cssClass = _.className(
          this.cssClasses.prefix,
          this.cssClasses.suggestion
        );
        this.$menu = DOM.element(o.menu).on("mouseenter.aa", cssClass, onSuggestionMouseEnter).on("mouseleave.aa", cssClass, onSuggestionMouseLeave).on("click.aa", cssClass, onSuggestionClick);
        this.$container = o.appendTo ? o.wrapper : this.$menu;
        if (o.templates && o.templates.header) {
          this.templates.header = _.templatify(o.templates.header);
          this.$menu.prepend(this.templates.header());
        }
        if (o.templates && o.templates.empty) {
          this.templates.empty = _.templatify(o.templates.empty);
          this.$empty = DOM.element(
            '<div class="' + _.className(this.cssClasses.prefix, this.cssClasses.empty, true) + '"></div>'
          );
          this.$menu.append(this.$empty);
          this.$empty.hide();
        }
        this.datasets = _.map(o.datasets, function(oDataset) {
          return initializeDataset(that.$menu, oDataset, o.cssClasses);
        });
        _.each(this.datasets, function(dataset) {
          var root = dataset.getRoot();
          if (root && root.parent().length === 0) {
            that.$menu.append(root);
          }
          dataset.onSync("rendered", that._onRendered, that);
        });
        if (o.templates && o.templates.footer) {
          this.templates.footer = _.templatify(o.templates.footer);
          this.$menu.append(this.templates.footer());
        }
        var self2 = this;
        DOM.element(window).resize(function() {
          self2._redraw();
        });
      }
      _.mixin(Dropdown.prototype, EventEmitter, {
        _onSuggestionClick: function onSuggestionClick($e) {
          this.trigger("suggestionClicked", DOM.element($e.currentTarget));
        },
        _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
          var elt = DOM.element($e.currentTarget);
          if (elt.hasClass(
            _.className(this.cssClasses.prefix, this.cssClasses.cursor, true)
          )) {
            return;
          }
          this._removeCursor();
          var suggestion = this;
          setTimeout(function() {
            suggestion._setCursor(elt, false);
          }, 0);
        },
        _onSuggestionMouseLeave: function onSuggestionMouseLeave($e) {
          if ($e.relatedTarget) {
            var elt = DOM.element($e.relatedTarget);
            if (elt.closest(
              "." + _.className(
                this.cssClasses.prefix,
                this.cssClasses.cursor,
                true
              )
            ).length > 0) {
              return;
            }
          }
          this._removeCursor();
          this.trigger("cursorRemoved");
        },
        _onRendered: function onRendered(e, query) {
          this.isEmpty = _.every(this.datasets, isDatasetEmpty);
          if (this.isEmpty) {
            if (query.length >= this.minLength) {
              this.trigger("empty");
            }
            if (this.$empty) {
              if (query.length < this.minLength) {
                this._hide();
              } else {
                var html2 = this.templates.empty({
                  query: this.datasets[0] && this.datasets[0].query
                });
                this.$empty.html(html2);
                this.$empty.show();
                this._show();
              }
            } else if (_.any(this.datasets, hasEmptyTemplate)) {
              if (query.length < this.minLength) {
                this._hide();
              } else {
                this._show();
              }
            } else {
              this._hide();
            }
          } else if (this.isOpen) {
            if (this.$empty) {
              this.$empty.empty();
              this.$empty.hide();
            }
            if (query.length >= this.minLength) {
              this._show();
            } else {
              this._hide();
            }
          }
          this.trigger("datasetRendered");
          function isDatasetEmpty(dataset) {
            return dataset.isEmpty();
          }
          function hasEmptyTemplate(dataset) {
            return dataset.templates && dataset.templates.empty;
          }
        },
        _hide: function() {
          this.$container.hide();
        },
        _show: function() {
          this.$container.css("display", "block");
          this._redraw();
          this.trigger("shown");
        },
        _redraw: function redraw() {
          if (!this.isOpen || !this.appendTo)
            return;
          this.trigger("redrawn");
        },
        _getSuggestions: function getSuggestions() {
          return this.$menu.find(
            _.className(this.cssClasses.prefix, this.cssClasses.suggestion)
          );
        },
        _getCursor: function getCursor() {
          return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.cursor)).first();
        },
        _setCursor: function setCursor($el, updateInput) {
          $el.first().addClass(
            _.className(this.cssClasses.prefix, this.cssClasses.cursor, true)
          ).attr("aria-selected", "true");
          this.trigger("cursorMoved", updateInput);
        },
        _removeCursor: function removeCursor() {
          this._getCursor().removeClass(
            _.className(this.cssClasses.prefix, this.cssClasses.cursor, true)
          ).removeAttr("aria-selected");
        },
        _moveCursor: function moveCursor(increment) {
          var $suggestions;
          var $oldCursor;
          var newCursorIndex;
          var $newCursor;
          if (!this.isOpen) {
            return;
          }
          $oldCursor = this._getCursor();
          $suggestions = this._getSuggestions();
          this._removeCursor();
          newCursorIndex = $suggestions.index($oldCursor) + increment;
          newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
          if (newCursorIndex === -1) {
            this.trigger("cursorRemoved");
            return;
          } else if (newCursorIndex < -1) {
            newCursorIndex = $suggestions.length - 1;
          }
          this._setCursor($newCursor = $suggestions.eq(newCursorIndex), true);
          this._ensureVisible($newCursor);
        },
        _ensureVisible: function ensureVisible($el) {
          var elTop;
          var elBottom;
          var menuScrollTop;
          var menuHeight;
          elTop = $el.position().top;
          elBottom = elTop + $el.height() + parseInt($el.css("margin-top"), 10) + parseInt($el.css("margin-bottom"), 10);
          menuScrollTop = this.$menu.scrollTop();
          menuHeight = this.$menu.height() + parseInt(this.$menu.css("padding-top"), 10) + parseInt(this.$menu.css("padding-bottom"), 10);
          if (elTop < 0) {
            this.$menu.scrollTop(menuScrollTop + elTop);
          } else if (menuHeight < elBottom) {
            this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
          }
        },
        close: function close() {
          if (this.isOpen) {
            this.isOpen = false;
            this._removeCursor();
            this._hide();
            this.trigger("closed");
          }
        },
        open: function open() {
          if (!this.isOpen) {
            this.isOpen = true;
            if (!this.isEmpty) {
              this._show();
            }
            this.trigger("opened");
          }
        },
        setLanguageDirection: function setLanguageDirection(dir) {
          this.$menu.css(dir === "ltr" ? this.css.ltr : this.css.rtl);
        },
        moveCursorUp: function moveCursorUp() {
          this._moveCursor(-1);
        },
        moveCursorDown: function moveCursorDown() {
          this._moveCursor(1);
        },
        getDatumForSuggestion: function getDatumForSuggestion($el) {
          var datum = null;
          if ($el.length) {
            datum = {
              raw: Dataset.extractDatum($el),
              value: Dataset.extractValue($el),
              datasetName: Dataset.extractDatasetName($el)
            };
          }
          return datum;
        },
        getCurrentCursor: function getCurrentCursor() {
          return this._getCursor().first();
        },
        getDatumForCursor: function getDatumForCursor() {
          return this.getDatumForSuggestion(this._getCursor().first());
        },
        getDatumForTopSuggestion: function getDatumForTopSuggestion() {
          return this.getDatumForSuggestion(this._getSuggestions().first());
        },
        cursorTopSuggestion: function cursorTopSuggestion() {
          this._setCursor(this._getSuggestions().first(), false);
        },
        update: function update2(query) {
          _.each(this.datasets, updateDataset);
          function updateDataset(dataset) {
            dataset.update(query);
          }
        },
        empty: function empty() {
          _.each(this.datasets, clearDataset);
          this.isEmpty = true;
          function clearDataset(dataset) {
            dataset.clear();
          }
        },
        isVisible: function isVisible() {
          return this.isOpen && !this.isEmpty;
        },
        destroy: function destroy() {
          this.$menu.off(".aa");
          this.$menu = null;
          _.each(this.datasets, destroyDataset);
          function destroyDataset(dataset) {
            dataset.destroy();
          }
        }
      });
      Dropdown.Dataset = Dataset;
      function initializeDataset($menu, oDataset, cssClasses) {
        return new Dropdown.Dataset(
          _.mixin({ $menu, cssClasses }, oDataset)
        );
      }
      module2.exports = Dropdown;
    },
    function(module2, exports2, __webpack_require__) {
      var datasetKey = "aaDataset";
      var valueKey = "aaValue";
      var datumKey = "aaDatum";
      var _ = __webpack_require__(0);
      var DOM = __webpack_require__(1);
      var html2 = __webpack_require__(17);
      var css = __webpack_require__(11);
      var EventEmitter = __webpack_require__(10);
      function Dataset(o) {
        o = o || {};
        o.templates = o.templates || {};
        if (!o.source) {
          _.error("missing source");
        }
        if (o.name && !isValidName(o.name)) {
          _.error("invalid dataset name: " + o.name);
        }
        this.query = null;
        this._isEmpty = true;
        this.highlight = !!o.highlight;
        this.name = typeof o.name === "undefined" || o.name === null ? _.getUniqueId() : o.name;
        this.source = o.source;
        this.displayFn = getDisplayFn(o.display || o.displayKey);
        this.debounce = o.debounce;
        this.cache = o.cache !== false;
        this.templates = getTemplates(o.templates, this.displayFn);
        this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
        this.cssClasses = o.cssClasses = _.mixin(
          {},
          css.defaultClasses,
          o.cssClasses || {}
        );
        this.cssClasses.prefix = o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
        var clazz = _.className(
          this.cssClasses.prefix,
          this.cssClasses.dataset
        );
        this.$el = o.$menu && o.$menu.find(clazz + "-" + this.name).length > 0 ? DOM.element(o.$menu.find(clazz + "-" + this.name)[0]) : DOM.element(
          html2.dataset.replace("%CLASS%", this.name).replace("%PREFIX%", this.cssClasses.prefix).replace("%DATASET%", this.cssClasses.dataset)
        );
        this.$menu = o.$menu;
        this.clearCachedSuggestions();
      }
      Dataset.extractDatasetName = function extractDatasetName(el) {
        return DOM.element(el).data(datasetKey);
      };
      Dataset.extractValue = function extractValue(el) {
        return DOM.element(el).data(valueKey);
      };
      Dataset.extractDatum = function extractDatum(el) {
        var datum = DOM.element(el).data(datumKey);
        if (typeof datum === "string") {
          datum = JSON.parse(datum);
        }
        return datum;
      };
      _.mixin(Dataset.prototype, EventEmitter, {
        _render: function render3(query, suggestions) {
          if (!this.$el) {
            return;
          }
          var that = this;
          var hasSuggestions;
          var renderArgs = [].slice.call(arguments, 2);
          this.$el.empty();
          hasSuggestions = suggestions && suggestions.length;
          this._isEmpty = !hasSuggestions;
          if (!hasSuggestions && this.templates.empty) {
            this.$el.html(getEmptyHtml.apply(this, renderArgs)).prepend(
              that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null
            ).append(
              that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null
            );
          } else if (hasSuggestions) {
            this.$el.html(getSuggestionsHtml.apply(this, renderArgs)).prepend(
              that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null
            ).append(
              that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null
            );
          } else if (suggestions && !Array.isArray(suggestions)) {
            throw new TypeError("suggestions must be an array");
          }
          if (this.$menu) {
            this.$menu.addClass(
              this.cssClasses.prefix + (hasSuggestions ? "with" : "without") + "-" + this.name
            ).removeClass(
              this.cssClasses.prefix + (hasSuggestions ? "without" : "with") + "-" + this.name
            );
          }
          this.trigger("rendered", query);
          function getEmptyHtml() {
            var args = [].slice.call(arguments, 0);
            args = [{ query, isEmpty: true }].concat(args);
            return that.templates.empty.apply(this, args);
          }
          function getSuggestionsHtml() {
            var args = [].slice.call(arguments, 0);
            var $suggestions;
            var nodes;
            var self2 = this;
            var suggestionsHtml = html2.suggestions.replace("%PREFIX%", this.cssClasses.prefix).replace("%SUGGESTIONS%", this.cssClasses.suggestions);
            $suggestions = DOM.element(suggestionsHtml).css(
              this.css.suggestions
            );
            nodes = _.map(suggestions, getSuggestionNode);
            $suggestions.append.apply($suggestions, nodes);
            return $suggestions;
            function getSuggestionNode(suggestion) {
              var $el;
              var suggestionHtml = html2.suggestion.replace("%PREFIX%", self2.cssClasses.prefix).replace("%SUGGESTION%", self2.cssClasses.suggestion);
              $el = DOM.element(suggestionHtml).attr({
                role: "option",
                id: ["option", Math.floor(Math.random() * 1e8)].join("-")
              }).append(
                that.templates.suggestion.apply(
                  this,
                  [suggestion].concat(args)
                )
              );
              $el.data(datasetKey, that.name);
              $el.data(valueKey, that.displayFn(suggestion) || void 0);
              $el.data(datumKey, JSON.stringify(suggestion));
              $el.children().each(function() {
                DOM.element(this).css(self2.css.suggestionChild);
              });
              return $el;
            }
          }
          function getHeaderHtml() {
            var args = [].slice.call(arguments, 0);
            args = [{ query, isEmpty: !hasSuggestions }].concat(args);
            return that.templates.header.apply(this, args);
          }
          function getFooterHtml() {
            var args = [].slice.call(arguments, 0);
            args = [{ query, isEmpty: !hasSuggestions }].concat(args);
            return that.templates.footer.apply(this, args);
          }
        },
        getRoot: function getRoot() {
          return this.$el;
        },
        update: function update2(query) {
          function handleSuggestions(suggestions) {
            if (!this.canceled && query === this.query) {
              var extraArgs = [].slice.call(arguments, 1);
              this.cacheSuggestions(query, suggestions, extraArgs);
              this._render.apply(this, [query, suggestions].concat(extraArgs));
            }
          }
          this.query = query;
          this.canceled = false;
          if (this.shouldFetchFromCache(query)) {
            handleSuggestions.apply(
              this,
              [this.cachedSuggestions].concat(this.cachedRenderExtraArgs)
            );
          } else {
            var that = this;
            var execSource = function() {
              if (!that.canceled) {
                that.source(query, handleSuggestions.bind(that));
              }
            };
            if (this.debounce) {
              var later = function() {
                that.debounceTimeout = null;
                execSource();
              };
              clearTimeout(this.debounceTimeout);
              this.debounceTimeout = setTimeout(later, this.debounce);
            } else {
              execSource();
            }
          }
        },
        cacheSuggestions: function cacheSuggestions(query, suggestions, extraArgs) {
          this.cachedQuery = query;
          this.cachedSuggestions = suggestions;
          this.cachedRenderExtraArgs = extraArgs;
        },
        shouldFetchFromCache: function shouldFetchFromCache(query) {
          return this.cache && this.cachedQuery === query && this.cachedSuggestions && this.cachedSuggestions.length;
        },
        clearCachedSuggestions: function clearCachedSuggestions() {
          delete this.cachedQuery;
          delete this.cachedSuggestions;
          delete this.cachedRenderExtraArgs;
        },
        cancel: function cancel() {
          this.canceled = true;
        },
        clear: function clear2() {
          this.cancel();
          this.$el.empty();
          this.trigger("rendered", "");
        },
        isEmpty: function isEmpty() {
          return this._isEmpty;
        },
        destroy: function destroy() {
          this.clearCachedSuggestions();
          this.$el = null;
        }
      });
      function getDisplayFn(display) {
        display = display || "value";
        return _.isFunction(display) ? display : displayFn;
        function displayFn(obj) {
          return obj[display];
        }
      }
      function getTemplates(templates2, displayFn) {
        return {
          empty: templates2.empty && _.templatify(templates2.empty),
          header: templates2.header && _.templatify(templates2.header),
          footer: templates2.footer && _.templatify(templates2.footer),
          suggestion: templates2.suggestion || suggestionTemplate
        };
        function suggestionTemplate(context2) {
          return "<p>" + displayFn(context2) + "</p>";
        }
      }
      function isValidName(str) {
        return /^[_a-zA-Z0-9-]+$/.test(str);
      }
      module2.exports = Dataset;
    },
    function(module2, exports2, __webpack_require__) {
      module2.exports = {
        hits: __webpack_require__(62),
        popularIn: __webpack_require__(63)
      };
    },
    function(module2, exports2, __webpack_require__) {
      var _ = __webpack_require__(0);
      var version2 = __webpack_require__(18);
      var parseAlgoliaClientVersion = __webpack_require__(19);
      module2.exports = function search(index, params) {
        var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
        if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
          params = params || {};
          params.additionalUA = "autocomplete.js " + version2;
        }
        return sourceFn;
        function sourceFn(query, cb) {
          index.search(query, params, function(error, content) {
            if (error) {
              _.error(error.message);
              return;
            }
            cb(content.hits, content);
          });
        }
      };
    },
    function(module2, exports2, __webpack_require__) {
      var _ = __webpack_require__(0);
      var version2 = __webpack_require__(18);
      var parseAlgoliaClientVersion = __webpack_require__(19);
      module2.exports = function popularIn(index, params, details, options) {
        var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
        if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
          params = params || {};
          params.additionalUA = "autocomplete.js " + version2;
        }
        if (!details.source) {
          return _.error("Missing 'source' key");
        }
        var source = _.isFunction(details.source) ? details.source : function(hit) {
          return hit[details.source];
        };
        if (!details.index) {
          return _.error("Missing 'index' key");
        }
        var detailsIndex = details.index;
        options = options || {};
        return sourceFn;
        function sourceFn(query, cb) {
          index.search(query, params, function(error, content) {
            if (error) {
              _.error(error.message);
              return;
            }
            if (content.hits.length > 0) {
              var first = content.hits[0];
              var detailsParams = _.mixin({ hitsPerPage: 0 }, details);
              delete detailsParams.source;
              delete detailsParams.index;
              var detailsAlgoliaVersion = parseAlgoliaClientVersion(
                detailsIndex.as._ua
              );
              if (detailsAlgoliaVersion && detailsAlgoliaVersion[0] >= 3 && detailsAlgoliaVersion[1] > 20) {
                params.additionalUA = "autocomplete.js " + version2;
              }
              detailsIndex.search(
                source(first),
                detailsParams,
                function(error2, content2) {
                  if (error2) {
                    _.error(error2.message);
                    return;
                  }
                  var suggestions = [];
                  if (options.includeAll) {
                    var label = options.allTitle || "All departments";
                    suggestions.push(
                      _.mixin(
                        { facet: { value: label, count: content2.nbHits } },
                        _.cloneDeep(first)
                      )
                    );
                  }
                  _.each(content2.facets, function(values, facet) {
                    _.each(values, function(count, value2) {
                      suggestions.push(
                        _.mixin(
                          {
                            facet: { facet, value: value2, count }
                          },
                          _.cloneDeep(first)
                        )
                      );
                    });
                  });
                  for (var i = 1; i < content.hits.length; ++i) {
                    suggestions.push(content.hits[i]);
                  }
                  cb(suggestions, content);
                }
              );
              return;
            }
            cb([]);
          });
        }
      };
    },
    function(module2, exports2, __webpack_require__) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var prefix = "algolia-docsearch";
      var suggestionPrefix = prefix + "-suggestion";
      var footerPrefix = prefix + "-footer";
      var templates2 = {
        suggestion: '\n  <a class="' + suggestionPrefix + "\n    {{#isCategoryHeader}}" + suggestionPrefix + "__main{{/isCategoryHeader}}\n    {{#isSubCategoryHeader}}" + suggestionPrefix + '__secondary{{/isSubCategoryHeader}}\n    "\n    aria-label="Link to the result"\n    href="{{{url}}}"\n    >\n    <div class="' + suggestionPrefix + '--category-header">\n        <span class="' + suggestionPrefix + '--category-header-lvl0">{{{category}}}</span>\n    </div>\n    <div class="' + suggestionPrefix + '--wrapper">\n      <div class="' + suggestionPrefix + '--subcategory-column">\n        <span class="' + suggestionPrefix + '--subcategory-column-text">{{{subcategory}}}</span>\n      </div>\n      {{#isTextOrSubcategoryNonEmpty}}\n      <div class="' + suggestionPrefix + '--content">\n        <div class="' + suggestionPrefix + '--subcategory-inline">{{{subcategory}}}</div>\n        <div class="' + suggestionPrefix + '--title">{{{title}}}</div>\n        {{#text}}<div class="' + suggestionPrefix + '--text">{{{text}}}</div>{{/text}}\n      </div>\n      {{/isTextOrSubcategoryNonEmpty}}\n    </div>\n  </a>\n  ',
        suggestionSimple: '\n  <div class="' + suggestionPrefix + "\n    {{#isCategoryHeader}}" + suggestionPrefix + "__main{{/isCategoryHeader}}\n    {{#isSubCategoryHeader}}" + suggestionPrefix + '__secondary{{/isSubCategoryHeader}}\n    suggestion-layout-simple\n  ">\n    <div class="' + suggestionPrefix + '--category-header">\n        {{^isLvl0}}\n        <span class="' + suggestionPrefix + "--category-header-lvl0 " + suggestionPrefix + '--category-header-item">{{{category}}}</span>\n          {{^isLvl1}}\n          {{^isLvl1EmptyOrDuplicate}}\n          <span class="' + suggestionPrefix + "--category-header-lvl1 " + suggestionPrefix + '--category-header-item">\n              {{{subcategory}}}\n          </span>\n          {{/isLvl1EmptyOrDuplicate}}\n          {{/isLvl1}}\n        {{/isLvl0}}\n        <div class="' + suggestionPrefix + "--title " + suggestionPrefix + '--category-header-item">\n            {{#isLvl2}}\n                {{{title}}}\n            {{/isLvl2}}\n            {{#isLvl1}}\n                {{{subcategory}}}\n            {{/isLvl1}}\n            {{#isLvl0}}\n                {{{category}}}\n            {{/isLvl0}}\n        </div>\n    </div>\n    <div class="' + suggestionPrefix + '--wrapper">\n      {{#text}}\n      <div class="' + suggestionPrefix + '--content">\n        <div class="' + suggestionPrefix + '--text">{{{text}}}</div>\n      </div>\n      {{/text}}\n    </div>\n  </div>\n  ',
        footer: '\n    <div class="' + footerPrefix + '">\n      Search by <a class="' + footerPrefix + '--logo" href="https://www.algolia.com/docsearch">Algolia</a>\n    </div>\n  ',
        empty: '\n  <div class="' + suggestionPrefix + '">\n    <div class="' + suggestionPrefix + '--wrapper">\n        <div class="' + suggestionPrefix + "--content " + suggestionPrefix + '--no-results">\n            <div class="' + suggestionPrefix + '--title">\n                <div class="' + suggestionPrefix + '--text">\n                    No results found for query <b>"{{query}}"</b>\n                </div>\n            </div>\n        </div>\n    </div>\n  </div>\n  ',
        searchBox: '\n  <form novalidate="novalidate" onsubmit="return false;" class="searchbox">\n    <div role="search" class="searchbox__wrapper">\n      <input id="docsearch" type="search" name="search" placeholder="Search the docs" autocomplete="off" required="required" class="searchbox__input"/>\n      <button type="submit" title="Submit your search query." class="searchbox__submit" >\n        <svg width=12 height=12 role="img" aria-label="Search">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-13"></use>\n        </svg>\n      </button>\n      <button type="reset" title="Clear the search query." class="searchbox__reset hide">\n        <svg width=12 height=12 role="img" aria-label="Reset">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-3"></use>\n        </svg>\n      </button>\n    </div>\n</form>\n\n<div class="svg-icons" style="height: 0; width: 0; position: absolute; visibility: hidden">\n  <svg xmlns="http://www.w3.org/2000/svg">\n    <symbol id="sbx-icon-clear-3" viewBox="0 0 40 40"><path d="M16.228 20L1.886 5.657 0 3.772 3.772 0l1.885 1.886L20 16.228 34.343 1.886 36.228 0 40 3.772l-1.886 1.885L23.772 20l14.342 14.343L40 36.228 36.228 40l-1.885-1.886L20 23.772 5.657 38.114 3.772 40 0 36.228l1.886-1.885L16.228 20z" fill-rule="evenodd"></symbol>\n    <symbol id="sbx-icon-search-13" viewBox="0 0 40 40"><path d="M26.806 29.012a16.312 16.312 0 0 1-10.427 3.746C7.332 32.758 0 25.425 0 16.378 0 7.334 7.333 0 16.38 0c9.045 0 16.378 7.333 16.378 16.38 0 3.96-1.406 7.593-3.746 10.426L39.547 37.34c.607.608.61 1.59-.004 2.203a1.56 1.56 0 0 1-2.202.004L26.807 29.012zm-10.427.627c7.322 0 13.26-5.938 13.26-13.26 0-7.324-5.938-13.26-13.26-13.26-7.324 0-13.26 5.936-13.26 13.26 0 7.322 5.936 13.26 13.26 13.26z" fill-rule="evenodd"></symbol>\n  </svg>\n</div>\n  '
      };
      exports2.default = templates2;
    },
    function(module2, exports2, __webpack_require__) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      var _zepto = __webpack_require__(20);
      var _zepto2 = _interopRequireDefault(_zepto);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var utils2 = {
        mergeKeyWithParent: function mergeKeyWithParent(object, property) {
          if (object[property] === void 0) {
            return object;
          }
          if (_typeof(object[property]) !== "object") {
            return object;
          }
          var newObject = _zepto2.default.extend({}, object, object[property]);
          delete newObject[property];
          return newObject;
        },
        groupBy: function groupBy(collection, property) {
          var newCollection = {};
          _zepto2.default.each(collection, function(index, item) {
            if (item[property] === void 0) {
              throw new Error("[groupBy]: Object has no key " + property);
            }
            var key2 = item[property];
            if (typeof key2 === "string") {
              key2 = key2.toLowerCase();
            }
            if (!Object.prototype.hasOwnProperty.call(newCollection, key2)) {
              newCollection[key2] = [];
            }
            newCollection[key2].push(item);
          });
          return newCollection;
        },
        values: function values(object) {
          return Object.keys(object).map(function(key2) {
            return object[key2];
          });
        },
        flatten: function flatten(array) {
          var results = [];
          array.forEach(function(value2) {
            if (!Array.isArray(value2)) {
              results.push(value2);
              return;
            }
            value2.forEach(function(subvalue) {
              results.push(subvalue);
            });
          });
          return results;
        },
        flattenAndFlagFirst: function flattenAndFlagFirst(object, flag) {
          var values = this.values(object).map(function(collection) {
            return collection.map(function(item, index) {
              item[flag] = index === 0;
              return item;
            });
          });
          return this.flatten(values);
        },
        compact: function compact(array) {
          var results = [];
          array.forEach(function(value2) {
            if (!value2) {
              return;
            }
            results.push(value2);
          });
          return results;
        },
        getHighlightedValue: function getHighlightedValue(object, property) {
          if (object._highlightResult && object._highlightResult.hierarchy_camel && object._highlightResult.hierarchy_camel[property] && object._highlightResult.hierarchy_camel[property].matchLevel && object._highlightResult.hierarchy_camel[property].matchLevel !== "none" && object._highlightResult.hierarchy_camel[property].value) {
            return object._highlightResult.hierarchy_camel[property].value;
          }
          if (object._highlightResult && object._highlightResult && object._highlightResult[property] && object._highlightResult[property].value) {
            return object._highlightResult[property].value;
          }
          return object[property];
        },
        getSnippetedValue: function getSnippetedValue(object, property) {
          if (!object._snippetResult || !object._snippetResult[property] || !object._snippetResult[property].value) {
            return object[property];
          }
          var snippet = object._snippetResult[property].value;
          if (snippet[0] !== snippet[0].toUpperCase()) {
            snippet = "\u2026" + snippet;
          }
          if ([".", "!", "?"].indexOf(snippet[snippet.length - 1]) === -1) {
            snippet = snippet + "\u2026";
          }
          return snippet;
        },
        deepClone: function deepClone(object) {
          return JSON.parse(JSON.stringify(object));
        }
      };
      exports2.default = utils2;
    }
  ]);
});
var docsearchStyle = `.algolia-autocomplete{width:100%;height:100%}.algolia-autocomplete .ds-dropdown-menu{width:480px;top:-6px;border-radius:6px;margin:8px 0 0;padding:0;text-align:left;height:auto;position:relative;border:0;z-index:999;max-width:600px;min-width:500px;box-shadow:var(--popup-box-shadow);backdrop-filter:blur(10px);background-color:var(--bg-color-container-transparent)}.algolia-autocomplete .ds-dropdown-menu .ds-suggestions{position:relative;z-index:1000;border-bottom:1px solid var(--component-stroke);padding:8px}.algolia-autocomplete .ds-dropdown-menu [class^=ds-dataset-]{position:relative;border-radius:6px;overflow:auto;border:1px solid var(--component-border)}.algolia-autocomplete .ds-dropdown-menu *{box-sizing:border-box}.algolia-autocomplete .algolia-docsearch-suggestion{display:block;position:relative;color:var(--text-primary);overflow:hidden}.algolia-autocomplete .algolia-docsearch-suggestion--category-header{display:none}.algolia-autocomplete .algolia-docsearch-suggestion--subcategory-column{float:left;width:30%;text-align:right;position:relative;padding:8px;color:var(--text-secondary);font-size:14px;word-wrap:break-word}.algolia-autocomplete .algolia-docsearch-suggestion--content{display:block;float:right;width:70%;position:relative;padding:8px 16px;cursor:pointer;border-radius:0 3px 3px 0}.algolia-autocomplete .algolia-docsearch-suggestion--content .algolia-docsearch-suggestion--subcategory-inline{display:none}.algolia-autocomplete .algolia-docsearch-suggestion--content:before{content:"";position:absolute;display:block;top:0;height:100%;width:1px;background:var(--component-border);left:-1px}.algolia-autocomplete .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion.suggestion-layout-simple,.algolia-autocomplete .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion:not(.suggestion-layout-simple) .algolia-docsearch-suggestion--content{background:var(--bg-color-container-hover);transition:all .2s linear}.algolia-autocomplete .algolia-docsearch-suggestion--title{font-weight:700;color:var(--text-primary);margin-bottom:0;font-size:16px;line-height:24px}.algolia-autocomplete .algolia-docsearch-suggestion--title+.algolia-docsearch-suggestion--text{margin-top:4px}.algolia-autocomplete .algolia-docsearch-suggestion--text{font-size:14px;line-height:22px;color:var(--text-secondary)}.algolia-autocomplete .algolia-docsearch-suggestion--highlight{padding:1px 4px;border-radius:3px;color:var(--brand-main);background-color:var(--brand-main-light);text-decoration:underline;text-decoration-color:var(--brand-main)}.algolia-autocomplete .algolia-docsearch-suggestion--no-results{width:100%;padding:8px 0;text-align:center;font-size:14px}.algolia-autocomplete .algolia-docsearch-footer{width:134px;height:26px;z-index:2000;margin:4px 8px;float:right;font-size:0;line-height:0}.algolia-autocomplete .algolia-docsearch-footer--logo{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='168' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M78.988.938h16.594a2.968 2.968 0 0 1 2.966 2.966V20.5a2.967 2.967 0 0 1-2.966 2.964H78.988a2.967 2.967 0 0 1-2.966-2.964V3.897A2.961 2.961 0 0 1 78.988.938zm41.937 17.866c-4.386.02-4.386-3.54-4.386-4.106l-.007-13.336 2.675-.424v13.254c0 .322 0 2.358 1.718 2.364v2.248zm-10.846-2.18c.821 0 1.43-.047 1.855-.129v-2.719a6.334 6.334 0 0 0-1.574-.199 5.7 5.7 0 0 0-.897.069 2.699 2.699 0 0 0-.814.24c-.24.116-.439.28-.582.491-.15.212-.219.335-.219.656 0 .628.219.991.616 1.23s.938.362 1.615.362zm-.233-9.7c.883 0 1.629.109 2.231.328.602.218 1.088.525 1.444.915.363.396.609.922.76 1.483.157.56.232 1.175.232 1.85v6.874a32.5 32.5 0 0 1-1.868.314c-.834.123-1.772.185-2.813.185-.69 0-1.327-.069-1.895-.198a4.001 4.001 0 0 1-1.471-.636 3.085 3.085 0 0 1-.951-1.134c-.226-.465-.343-1.12-.343-1.803 0-.656.13-1.073.384-1.525a3.24 3.24 0 0 1 1.047-1.106c.445-.287.95-.492 1.532-.615a8.8 8.8 0 0 1 1.82-.185 8.404 8.404 0 0 1 1.972.24v-.438c0-.307-.035-.6-.11-.874a1.88 1.88 0 0 0-.384-.73 1.784 1.784 0 0 0-.724-.493 3.164 3.164 0 0 0-1.143-.205c-.616 0-1.177.075-1.69.164a7.735 7.735 0 0 0-1.26.307l-.321-2.192c.335-.117.834-.233 1.478-.349a10.98 10.98 0 0 1 2.073-.178zm52.842 9.626c.822 0 1.43-.048 1.854-.13V13.7a6.347 6.347 0 0 0-1.574-.199c-.294 0-.595.021-.896.069a2.7 2.7 0 0 0-.814.24 1.46 1.46 0 0 0-.582.491c-.15.212-.218.335-.218.656 0 .628.218.991.615 1.23.404.245.938.362 1.615.362zm-.226-9.694c.883 0 1.629.108 2.231.327.602.219 1.088.526 1.444.915.355.39.609.923.759 1.483a6.8 6.8 0 0 1 .233 1.852v6.873c-.41.088-1.034.19-1.868.314-.834.123-1.772.184-2.813.184-.69 0-1.327-.068-1.895-.198a4.001 4.001 0 0 1-1.471-.635 3.085 3.085 0 0 1-.951-1.134c-.226-.465-.343-1.12-.343-1.804 0-.656.13-1.073.384-1.524.26-.45.608-.82 1.047-1.107.445-.286.95-.491 1.532-.614a8.803 8.803 0 0 1 2.751-.13c.329.034.671.096 1.04.185v-.437a3.3 3.3 0 0 0-.109-.875 1.873 1.873 0 0 0-.384-.731 1.784 1.784 0 0 0-.724-.492 3.165 3.165 0 0 0-1.143-.205c-.616 0-1.177.075-1.69.164a7.75 7.75 0 0 0-1.26.307l-.321-2.193c.335-.116.834-.232 1.478-.348a11.633 11.633 0 0 1 2.073-.177zm-8.034-1.271a1.626 1.626 0 0 1-1.628-1.62c0-.895.725-1.62 1.628-1.62.904 0 1.63.725 1.63 1.62 0 .895-.733 1.62-1.63 1.62zm1.348 13.22h-2.689V7.27l2.69-.423v11.956zm-4.714 0c-4.386.02-4.386-3.54-4.386-4.107l-.008-13.336 2.676-.424v13.254c0 .322 0 2.358 1.718 2.364v2.248zm-8.698-5.903c0-1.156-.253-2.119-.746-2.788-.493-.677-1.183-1.01-2.067-1.01-.882 0-1.574.333-2.065 1.01-.493.676-.733 1.632-.733 2.788 0 1.168.246 1.953.74 2.63.492.683 1.183 1.018 2.066 1.018.882 0 1.574-.342 2.067-1.019.492-.683.738-1.46.738-2.63zm2.737-.007c0 .902-.13 1.584-.397 2.33a5.52 5.52 0 0 1-1.128 1.906 4.986 4.986 0 0 1-1.752 1.223c-.685.286-1.739.45-2.265.45-.528-.006-1.574-.157-2.252-.45a5.096 5.096 0 0 1-1.744-1.223c-.487-.527-.863-1.162-1.137-1.906a6.345 6.345 0 0 1-.41-2.33c0-.902.123-1.77.397-2.508a5.554 5.554 0 0 1 1.15-1.892 5.133 5.133 0 0 1 1.75-1.216c.679-.287 1.425-.423 2.232-.423.808 0 1.553.142 2.237.423a4.88 4.88 0 0 1 1.753 1.216 5.644 5.644 0 0 1 1.135 1.892c.287.738.431 1.606.431 2.508zm-20.138 0c0 1.12.246 2.363.738 2.882.493.52 1.13.78 1.91.78.424 0 .828-.062 1.204-.178.377-.116.677-.253.917-.417V9.33a10.476 10.476 0 0 0-1.766-.226c-.971-.028-1.71.37-2.23 1.004-.513.636-.773 1.75-.773 2.788zm7.438 5.274c0 1.824-.466 3.156-1.404 4.004-.936.846-2.367 1.27-4.296 1.27-.705 0-2.17-.137-3.34-.396l.431-2.118c.98.205 2.272.26 2.95.26 1.074 0 1.84-.219 2.299-.656.459-.437.684-1.086.684-1.948v-.437a8.07 8.07 0 0 1-1.047.397c-.43.13-.93.198-1.492.198-.739 0-1.41-.116-2.018-.349a4.206 4.206 0 0 1-1.567-1.025c-.431-.45-.774-1.017-1.013-1.694-.24-.677-.363-1.885-.363-2.773 0-.834.13-1.88.384-2.577.26-.696.629-1.298 1.129-1.796.493-.498 1.095-.881 1.8-1.162a6.605 6.605 0 0 1 2.428-.457c.87 0 1.67.109 2.45.24.78.129 1.444.265 1.985.415V18.17z' fill='%235468FF'/%3E%3Cpath d='M6.972 6.677v1.627c-.712-.446-1.52-.67-2.425-.67-.585 0-1.045.13-1.38.391a1.24 1.24 0 0 0-.502 1.03c0 .425.164.765.494 1.02.33.256.835.532 1.516.83.447.192.795.356 1.045.495.25.138.537.332.862.582.324.25.563.548.718.894.154.345.23.741.23 1.188 0 .947-.334 1.691-1.004 2.234-.67.542-1.537.814-2.601.814-1.18 0-2.16-.229-2.936-.686v-1.708c.84.628 1.814.942 2.92.942.585 0 1.048-.136 1.388-.407.34-.271.51-.646.51-1.125 0-.287-.1-.55-.302-.79-.203-.24-.42-.42-.655-.542-.234-.123-.585-.29-1.053-.503a61.27 61.27 0 0 1-.582-.271 13.67 13.67 0 0 1-.55-.287 4.275 4.275 0 0 1-.567-.351 6.92 6.92 0 0 1-.455-.4c-.18-.17-.31-.34-.39-.51-.08-.17-.155-.37-.224-.598a2.553 2.553 0 0 1-.104-.742c0-.915.333-1.638.998-2.17.664-.532 1.523-.798 2.576-.798.968 0 1.793.17 2.473.51zm7.468 5.696v-.287c-.022-.607-.187-1.088-.495-1.444-.309-.357-.75-.535-1.324-.535-.532 0-.99.194-1.373.583-.382.388-.622.949-.717 1.683h3.909zm1.005 2.792v1.404c-.596.34-1.383.51-2.362.51-1.255 0-2.255-.377-3-1.132-.744-.755-1.116-1.744-1.116-2.968 0-1.297.34-2.316 1.021-3.055.68-.74 1.548-1.11 2.6-1.11 1.033 0 1.852.323 2.458.966.606.644.91 1.572.91 2.784 0 .33-.033.676-.096 1.038h-5.314c.107.702.405 1.239.894 1.611.49.372 1.106.558 1.85.558.862 0 1.58-.202 2.155-.606zm6.605-1.77h-1.212c-.596 0-1.045.116-1.349.35-.303.234-.454.532-.454.894 0 .372.117.664.35.877.235.213.575.32 1.022.32.51 0 .912-.142 1.204-.424.293-.281.44-.651.44-1.108v-.91zm-4.068-2.554V9.325c.627-.361 1.457-.542 2.489-.542 2.116 0 3.175 1.026 3.175 3.08V17h-1.548v-.957c-.415.68-1.143 1.02-2.186 1.02-.766 0-1.38-.22-1.843-.661-.462-.442-.694-1.003-.694-1.684 0-.776.293-1.38.878-1.81.585-.431 1.404-.647 2.457-.647h1.34V11.8c0-.554-.133-.971-.399-1.253-.266-.282-.707-.423-1.324-.423a4.07 4.07 0 0 0-2.345.718zm9.333-1.93v1.42c.394-1 1.101-1.5 2.123-1.5.148 0 .313.016.494.048v1.531a1.885 1.885 0 0 0-.75-.143c-.542 0-.989.24-1.34.718-.351.479-.527 1.048-.527 1.707V17h-1.563V8.91h1.563zm5.01 4.084c.022.82.272 1.492.75 2.019.479.526 1.15.79 2.01.79.639 0 1.235-.176 1.788-.527v1.404c-.521.319-1.186.479-1.995.479-1.265 0-2.276-.4-3.031-1.197-.755-.798-1.133-1.792-1.133-2.984 0-1.16.38-2.151 1.14-2.975.761-.825 1.79-1.237 3.088-1.237.702 0 1.346.149 1.93.447v1.436a3.242 3.242 0 0 0-1.77-.495c-.84 0-1.513.266-2.019.798-.505.532-.758 1.213-.758 2.042zM40.24 5.72v4.579c.458-1 1.293-1.5 2.505-1.5.787 0 1.42.245 1.899.734.479.49.718 1.17.718 2.042V17h-1.564v-5.106c0-.553-.14-.98-.422-1.284-.282-.303-.652-.455-1.11-.455-.531 0-1.002.202-1.411.606-.41.405-.615 1.022-.615 1.851V17h-1.563V5.72h1.563zm14.966 10.02c.596 0 1.096-.253 1.5-.758.404-.506.606-1.157.606-1.955 0-.915-.202-1.62-.606-2.114-.404-.495-.92-.742-1.548-.742-.553 0-1.05.224-1.491.67-.442.447-.662 1.133-.662 2.058 0 .958.212 1.67.638 2.138.425.469.946.703 1.563.703zM53.004 5.72v4.42c.574-.894 1.388-1.341 2.44-1.341 1.022 0 1.857.383 2.506 1.149.649.766.973 1.781.973 3.047 0 1.138-.309 2.109-.925 2.912-.617.803-1.463 1.205-2.537 1.205-1.075 0-1.894-.447-2.457-1.34V17h-1.58V5.72h1.58zm9.908 11.104l-3.223-7.913h1.739l1.005 2.632 1.26 3.415c.096-.32.48-1.458 1.15-3.415l.909-2.632h1.66l-2.92 7.866c-.777 2.074-1.963 3.11-3.559 3.11a2.92 2.92 0 0 1-.734-.079v-1.34c.17.042.351.064.543.064 1.032 0 1.755-.57 2.17-1.708z' fill='%235D6494'/%3E%3Cpath d='M89.632 5.967v-.772a.978.978 0 0 0-.978-.977h-2.28a.978.978 0 0 0-.978.977v.793c0 .088.082.15.171.13a7.127 7.127 0 0 1 1.984-.28c.65 0 1.295.088 1.917.259.082.02.164-.04.164-.13m-6.248 1.01l-.39-.389a.977.977 0 0 0-1.382 0l-.465.465a.973.973 0 0 0 0 1.38l.383.383c.062.061.15.047.205-.014.226-.307.472-.601.746-.874.281-.28.568-.526.883-.751.068-.042.075-.137.02-.2m4.16 2.453v3.341c0 .096.104.165.192.117l2.97-1.537c.068-.034.089-.117.055-.184a3.695 3.695 0 0 0-3.08-1.866c-.068 0-.136.054-.136.13m0 8.048a4.489 4.489 0 0 1-4.49-4.482 4.488 4.488 0 0 1 4.49-4.482 4.488 4.488 0 0 1 4.489 4.482 4.484 4.484 0 0 1-4.49 4.482m0-10.85a6.363 6.363 0 1 0 0 12.729 6.37 6.37 0 0 0 6.372-6.368 6.358 6.358 0 0 0-6.371-6.36' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E");background-repeat:no-repeat;background-position:50%;background-size:100%;overflow:hidden;text-indent:-9000px;width:100%;height:100%;display:block}
`;
function initDocSearch(docsearchInfo) {
  if (!docsearchInfo.indexName)
    return;
  const config = Object.assign({
    apiKey: "b27ded009670a12d2f36303309a7f50a",
    appId: "FK4VWYRY3Q",
    inputSelector: "#TDSearch",
    debug: false
  }, docsearchInfo);
  window.docsearch(config);
}
define$2({
  tag: "td-doc-search",
  docsearchInfo: {
    get: (_host, lastValue) => lastValue || {},
    set: (_host, value2) => value2,
    connect: (host) => {
      const innerDom = `
        <style>${style$j}</style>
        <style>${docsearchStyle}</style>
        <div class="TDesign-doc-search">
          <input id="TDSearch" class="TDesign-doc-search__inner" placeholder="\u641C\u7D22" type="text" />
          <span class="TDesign-doc-search__icon">${searchIcon}</span>
        </div>
      `;
      Object.assign(host, { innerHTML: innerDom });
    },
    observe(_host, value2) {
      initDocSearch(value2);
    }
  },
  render: () => html`
    <div>
      <slot></slot>
    </div>
  `
});
var style$i = ".TDesign-doc-content{display:flex;flex-direction:column;position:relative;background:var(--bg-color-docpage)}.TDesign-doc-content.hidden{opacity:0;visibility:hidden}.TDesign-doc-content.show{opacity:1;visibility:visible;transition:all .2s linear}.TDesign-doc-content .TDesign-doc-body{min-height:calc(100vh - var(--footer-height));color:var(--text-primary);padding-right:var(--content-padding-right)}.TDesign-doc-content .TDesign-doc-body__inner{width:100%;padding:64px var(--content-padding-left-right) 120px var(--content-padding-left-right);margin:0 auto;box-sizing:border-box;min-width:320px;max-width:var(--content-max-width)}.TDesign-doc-content__backtop{width:40px;height:40px;position:fixed;right:24px;bottom:40px;display:flex;justify-content:center;align-items:center;background-color:var(--bg-color-scroll);border-radius:100%;cursor:pointer;transition:all .2s linear;opacity:0;visibility:hidden;color:var(--text-secondary)}.TDesign-doc-content__backtop.show{opacity:1;visibility:visible}.TDesign-doc-content__backtop:hover{color:var(--text-primary);background-color:var(--text-disabled)}\n";
const FIXED_HEADER_TOP = 228;
function anchorHighlight() {
  const selectors = ['div[name="DEMO"]', 'div[name="API"]', 'div[name="DESIGN"]', 'div[name="DOC"]'];
  function getLinkTopList(anchorList) {
    const linkList = anchorList.map((anchor) => {
      const [, id] = decodeURIComponent(anchor.href).split("#");
      return document.getElementById(id);
    });
    return linkList.map((link) => {
      if (!link)
        return 0;
      const { top: top2 } = link.getBoundingClientRect();
      return top2 + document.documentElement.scrollTop;
    });
  }
  function highlightAnchor(anchorList, linkTopList) {
    const { scrollTop } = document.documentElement;
    for (let i = 0; i < linkTopList.length; i++) {
      if (scrollTop <= linkTopList[i]) {
        if (anchorList[i].classList.contains("active"))
          break;
        anchorList.forEach((anchor) => anchor.classList.remove("active"));
        anchorList[i].classList.add("active");
        break;
      }
    }
  }
  selectors.forEach((item) => {
    const wrapper = document.querySelector(item);
    if (!wrapper)
      return;
    const anchorList = Array.from(wrapper.querySelectorAll(".tdesign-toc_list_item_a")) || [];
    const linkTopList = getLinkTopList(anchorList);
    highlightAnchor(anchorList, linkTopList);
  });
}
define$2({
  tag: "td-doc-content",
  platform: "web",
  pageStatus: "show",
  mobileBodyStyle,
  fixedAnchor: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2,
    connect: () => {
      function changeTocHeight() {
        const { scrollTop } = document.documentElement;
        const containers = document.querySelectorAll(".tdesign-toc_container");
        if (scrollTop > FIXED_HEADER_TOP) {
          containers.forEach((container) => {
            Object.assign(container.style, { position: "fixed", top: "152px" });
          });
        } else {
          containers.forEach((container) => {
            Object.assign(container.style, { position: "absolute", top: "316px" });
          });
        }
        anchorHighlight();
      }
      function proxyTitleAnchor(e) {
        if (e.target.tagName !== "A")
          return;
        const { target } = e;
        const href = decodeURIComponent(target.href);
        if (!href.includes("#"))
          return;
        const [, id = ""] = href.split("#");
        if (target.classList.contains("tdesign-header-anchor") || target.classList.contains("tdesign-toc_list_item_a")) {
          const idTarget = document.getElementById(id);
          if (!idTarget)
            return;
          const { top: top2 } = idTarget.getBoundingClientRect();
          const offsetTop = top2 + document.documentElement.scrollTop;
          requestAnimationFrame(() => window.scrollTo({ top: offsetTop - 120, left: 0 }));
        }
      }
      function handleAnchorScroll() {
        const href = decodeURIComponent(location.href);
        if (!href.includes("#"))
          return;
        const [, id = ""] = href.split("#");
        const idTarget = document.getElementById(id);
        if (!idTarget)
          return;
        const { top: top2 } = idTarget.getBoundingClientRect();
        const offsetTop = top2 + document.documentElement.scrollTop;
        requestAnimationFrame(() => window.scrollTo({ top: offsetTop - 120, left: 0 }));
      }
      document.addEventListener("scroll", changeTocHeight);
      document.addEventListener("click", proxyTitleAnchor);
      window.addEventListener("load", handleAnchorScroll);
      return () => {
        document.removeEventListener("scroll", changeTocHeight);
        document.removeEventListener("click", proxyTitleAnchor);
        window.removeEventListener("load", handleAnchorScroll);
      };
    }
  },
  render: (host) => {
    return html`
      <style>${style$i}</style>
      <div class="TDesign-doc-content ${host.pageStatus}">
        <slot name="doc-header"></slot>

        <div class="TDesign-doc-body" style=${host.mobileBodyStyle}>
          <div class="TDesign-doc-body__inner">
            <slot></slot>
          </div>
        </div>

        <slot name="doc-footer"></slot>

        <td-backtop></td-backtop>
      </div>
    `;
  }
});
const BASE_URL = "https://tdesign.gtimg.com/site";
var splineConfig = {
  explain: `${BASE_URL}/spline/explain/index.html`,
  source: `${BASE_URL}/spline/source/index.html`,
  base: `${BASE_URL}/spline/base/index.html`,
  data: `${BASE_URL}/spline/data/index.html`,
  form: `${BASE_URL}/spline/form/index.html`,
  layout: `${BASE_URL}/spline/layout/index.html`,
  message: `${BASE_URL}/spline/message/index.html`,
  navigation: `${BASE_URL}/spline/navigation/index.html`,
  "design-mode": `${BASE_URL}/spline/design/mode_light/index.html`,
  "design-mode-dark": `${BASE_URL}/spline/design/mode_dark/index.html`,
  "design-layout": `${BASE_URL}/spline/design/layout_light/index.html`,
  "design-layout-dark": `${BASE_URL}/spline/design/layout_dark/index.html`,
  "design-motion": `${BASE_URL}/spline/design/motion_light/index.html`,
  "design-motion-dark": `${BASE_URL}/spline/design/motion_dark/index.html`,
  "design-color": `${BASE_URL}/spline/design/color_light/index.html`,
  "design-color-dark": `${BASE_URL}/spline/design/color_dark/index.html`,
  "design-value": `${BASE_URL}/spline/design/value_light/index.html`,
  "design-value-dark": `${BASE_URL}/spline/design/value_dark/index.html`,
  "design-icon": `${BASE_URL}/spline/design/icon_light/index.html`,
  "design-icon-dark": `${BASE_URL}/spline/design/icon_dark/index.html`,
  "design-font": `${BASE_URL}/spline/design/font_light/index.html`,
  "design-font-dark": `${BASE_URL}/spline/design/font_dark/index.html`
};
var style$h = ":host{width:100%;background-color:var(--bg-color-container);box-shadow:var(--header-box-shadow);position:relative}@media screen and (max-width: 960px){:host{--spline-visible: hidden;--issue-display: none;--title-font-size: 32px}}.TDesign-doc-header{height:var(--doc-header-height);padding-right:var(--content-padding-right)}.TDesign-doc-header__inner{padding:48px var(--content-padding-left-right);box-sizing:border-box;position:relative;display:flex;flex-direction:column;width:100%;height:100%;min-width:320px;max-width:var(--content-max-width);margin:0 auto}.TDesign-doc-header__thumb{position:absolute;height:calc(100% - 1px);width:1200px;max-width:100%;right:0;top:0;border:0;z-index:450;visibility:var(--spline-visible)}.TDesign-doc-header__thumb.light{display:var(--theme-block-light-display)}.TDesign-doc-header__thumb.dark{display:var(--theme-block-dark-display)}.TDesign-doc-header__badge{max-width:100%;display:flex}.TDesign-doc-header__badge img{margin-right:8px}.TDesign-doc-header__background{width:100%;position:absolute;left:0;bottom:0;height:88px;z-index:400;background:var(--bg-color-container);box-shadow:var(--header-box-shadow)}.TDesign-doc-header__content{display:flex;justify-content:flex-end;flex-direction:column;align-items:flex-end;margin-top:130px;flex:1;position:relative;z-index:500}.TDesign-doc-header__info{position:absolute;bottom:0;left:0}.TDesign-doc-header__info-title{font-size:var(--title-font-size, 48px);color:var(--text-primary);text-align:left;line-height:56px;margin:0;transition:top .2s var(--anim-time-fn-easing),opacity .2s linear,visibility .2s linear}.TDesign-doc-header__info-describe{margin-top:16px;font-size:14px;color:var(--text-secondary);line-height:22px;width:100%;box-sizing:border-box;transition:all .2s linear}\n";
let timer = null;
let observeTimer = null;
function handleModeChange(themeMode, host) {
  if (!host.shadowRoot)
    return;
  const splineEl = host.shadowRoot.getElementById("__iframe__");
  let splineUrl = "";
  if (themeMode === "dark") {
    splineUrl = splineConfig[`${host.spline}-dark`];
  } else {
    splineUrl = splineConfig[host.spline];
  }
  if (splineEl && splineUrl && splineUrl !== splineEl.src) {
    clearTimeout(timer);
    splineEl.style = "max-height: 0;";
    splineEl.src = splineUrl;
  }
}
function iframeOnload(host) {
  if (!host.shadowRoot)
    return;
  const iframeEl = host.shadowRoot.getElementById("__iframe__");
  clearTimeout(timer);
  timer = setTimeout(() => {
    iframeEl && (iframeEl.style = `
      max-height: 280px;
      transition: max-height .25s .2s var(--anim-time-fn-easing);
      -webkit-transition: max-height .25s .2s var(--anim-time-fn-easing);
    `);
  }, 600);
}
define$2({
  tag: "td-doc-header",
  spline: {
    get: (_host, lastValue) => lastValue || "",
    set: (_host, value2) => value2,
    connect: (host) => {
      const observer = watchHtmlMode((themeMode) => handleModeChange(themeMode, host));
      return () => observer.disconnect();
    },
    observe: (host) => {
      clearTimeout(observeTimer);
      const themeMode = document.documentElement.getAttribute("theme-mode") || "light";
      observeTimer = setTimeout(() => {
        handleModeChange(themeMode, host);
      }, 600);
    }
  },
  platform: "web",
  mobileBodyStyle,
  docInfo: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2,
    observe: (host, value2) => {
      if (document.getElementById("__td_doc_title__") || !value2)
        return;
      const titleElement = document.createElement("h1");
      titleElement.id = "__td_doc_title__";
      titleElement.innerText = value2.title;
      host.appendChild(titleElement);
    }
  },
  fixedTitle: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2,
    connect: (host) => {
      function changeTitlePos() {
        if (!host.shadowRoot)
          return;
        const { shadowRoot } = host;
        const { scrollTop } = document.documentElement;
        const background = shadowRoot.querySelector(".TDesign-doc-header__background") || { style: {} };
        const title = shadowRoot.querySelector(".TDesign-doc-header__info-title") || { style: {} };
        const describe = shadowRoot.querySelector(".TDesign-doc-header__info-describe") || { style: {} };
        const thumb = shadowRoot.querySelector(".TDesign-doc-header__thumb") || { style: {} };
        const issue = shadowRoot.querySelector("td-doc-issue") || { style: {} };
        const tabs = document.querySelector("td-doc-tabs");
        const isMobileResponse = window.innerWidth < 1200;
        const asideWidth = isMobileResponse ? 0 : "260px";
        if (scrollTop >= 228) {
          if (title.style.position !== "fixed") {
            Object.assign(title.style, {
              position: "fixed",
              top: tabs ? "16px" : "28px",
              fontSize: "24px",
              lineHeight: "32px",
              opacity: 1,
              visibility: "visible"
            });
            Object.assign(background.style, { position: "fixed", top: "0", left: asideWidth });
            tabs && Object.assign(tabs.style, {
              position: "fixed",
              top: "64px",
              zIndex: 500
            });
            Object.assign(issue.style, { position: "fixed", top: "24px", right: "24px" });
          }
        } else if (scrollTop > 192 && scrollTop < 228) {
          if (title.style.visibility !== "hidden") {
            Object.assign(title.style, { opacity: 0, visibility: "hidden" });
            Object.assign(thumb.style, { opacity: 0, visibility: "hidden" });
            Object.assign(describe.style, { opacity: 0, visibility: "hidden" });
            Object.assign(background.style, { position: "absolute", top: "unset", left: "0" });
            tabs && Object.assign(tabs.style, { position: "absolute", top: "228px" });
            Object.assign(issue.style, { position: "absolute", top: "calc(100% - 48px - 12px)" });
          }
        } else {
          if (title.style.position === "fixed" || title.style.visibility === "hidden") {
            Object.assign(title.style, {
              position: "unset",
              fontSize: "48px",
              lineHeight: "56px",
              opacity: 1,
              visibility: "visible"
            });
            Object.assign(describe.style, { opacity: 1, visibility: "visible" });
            Object.assign(background.style, { position: "absolute", top: "unset", left: "0" });
            tabs && Object.assign(tabs.style, { position: "absolute", top: "228px" });
            Object.assign(issue.style, { position: "absolute", top: "calc(100% - 48px - 12px)" });
            Object.assign(thumb.style, { opacity: 1, visibility: "visible" });
          }
        }
      }
      document.addEventListener("scroll", changeTitlePos);
      return () => document.removeEventListener("scroll", changeTitlePos);
    }
  },
  render: (host) => {
    const { docInfo, spline } = host;
    const mobileBodyStyle2 = { ...host.mobileBodyStyle };
    const splineUrl = splineConfig[spline];
    return html`
      ${splineUrl ? html`
        <iframe id="__iframe__"
          class="TDesign-doc-header__thumb"
          onload="${iframeOnload}"
        ></iframe>` : html``}
      <div class="TDesign-doc-header" style="${mobileBodyStyle2}">
        <div class="TDesign-doc-header__inner">
          <div class="TDesign-doc-header__badge">
            <slot name="badge"></slot>
          </div>
          <div class="TDesign-doc-header__content">
            <div class="TDesign-doc-header__info">
              ${docInfo ? html`
                <h1 class="TDesign-doc-header__info-title">${docInfo.title}</h1>
                <div class="TDesign-doc-header__info-describe">
                  <div innerHTML="${docInfo.desc}"></div>
                </div>
              ` : html``}
            </div>
          </div>
        </div>
      </div>
      <div class="TDesign-doc-header__background"></div>
      <td-doc-issue></td-doc-issue>
    `.css`${style$h}`;
  }
});
var style$g = ":host{position:absolute;right:24px;top:calc(100% - 60px);z-index:500}@media screen and (max-width: 750px){:host{--issue-display: none}}.TDesign-component-issue{display:var(--issue-display, flex);padding:4px;height:32px;background:var(--bg-color-component-transparent);backdrop-filter:blur(10px);border-radius:6px;color:var(--text-primary);align-items:center;box-shadow:var(--popup-box-shadow)}.TDesign-component-issue .item{border-radius:var(--border-radius);transition:all .2s;display:flex;align-items:center;padding:5px 8px;line-height:22px;color:var(--text-primary);cursor:pointer;text-decoration:none}.TDesign-component-issue .item:hover{background:var(--bg-color-component-hover)}.TDesign-component-issue i{width:16px;height:16px;margin-right:8px}\n";
var infoIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M8.5 10.5V11.5H7.5V10.5H8.5Z" />\n  <path fill="currentColor" d="M8.5 9.5V4.5H7.5V9.5H8.5Z" />\n  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5C11.5899 14.5 14.5 11.5899 14.5 8ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" />\n</svg>\n';
var checkIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M5.6577 11.8701L1.80908 8.01387L2.51619 7.30677L6.00156 10.799L12.9479 3.86154L13.655 4.56865L6.44074 11.7737C6.42006 11.8082 6.39487 11.8407 6.36516 11.8704C6.16976 12.0658 5.85291 12.0657 5.6577 11.8701Z" />\n</svg>\n';
var addIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M7.34998 8.64998V12.5H8.64998V8.64998H12.5V7.34998H8.64998V3.5H7.34998V7.34998H3.5V8.64998H7.34998Z" />\n</svg>\n';
const getIssueHelper = (framework) => `https://github.com/Tencent/tdesign-${framework}/issues/new/choose`;
const issueUrlMap = {
  vue: `https://github.com/Tencent/tdesign-vue/issues`,
  react: `https://github.com/Tencent/tdesign-react/issues`,
  "vue-next": `https://github.com/Tencent/tdesign-vue-next/issues`,
  "mobile-vue": `https://github.com/Tencent/tdesign-mobile-vue/issues`,
  "mobile-react": `https://github.com/Tencent/tdesign-mobile-react/issues`,
  miniprogram: `https://github.com/Tencent/tdesign-miniprogram/issues`,
  flutter: `https://github.com/TDesignOteam/tdesign-flutter/issues`
};
function parseUrl() {
  let urlPath = location.pathname;
  if (location.pathname === "/" && location.hash) {
    urlPath = location.hash.slice(1);
  }
  const matchs = urlPath.match(/([\w-]+)\/components\/([\w-]+)/) || [];
  return matchs;
}
function getCurrentIssueUrl() {
  const [, framework, componentName] = parseUrl();
  return {
    newUrl: isIntranet() ? `${issueUrlMap[framework]}/new` : getIssueHelper(framework),
    openUrl: isIntranet() ? `${issueUrlMap[framework]}?issue_search=${componentName}` : `${issueUrlMap[framework]}?q=is:issue+is:open+${componentName}`,
    closedUrl: isIntranet() ? `${issueUrlMap[framework]}?state=closed&issue_search=${componentName}` : `${issueUrlMap[framework]}?q=is:issue+is:closed+${componentName}`
  };
}
function handleIssueClick(e, issueInfo, type) {
  e.preventDefault();
  const url = issueInfo[`${type}Url`];
  window.open(url, "_blank");
}
function renderIssue(host) {
  const { openNum, closedNum } = host;
  const [, , componentName] = parseUrl();
  const issueInfo = {
    openNum,
    closedNum,
    componentName,
    ...getCurrentIssueUrl()
  };
  if (!componentName)
    return html``;
  return html`
    <section id="issue" class="TDesign-component-issue">
      <a
        onclick="${(host2, e) => handleIssueClick(e, issueInfo, "new")}"
        class="item"
      >
        <i innerHTML=${addIcon}></i>
        <span>Issue</span>
      </a>
      <a
        onclick="${(host2, e) => handleIssueClick(e, issueInfo, "open")}"
        class="item"
      >
        <i innerHTML=${infoIcon}></i>
        <span>${(issueInfo == null ? void 0 : issueInfo.openNum) || ""} Open</span>
      </a>
      <a
        onclick="${(host2, e) => handleIssueClick(e, issueInfo, "closed")}"
        class="item"
      >
        <i innerHTML=${checkIcon}></i>
        <span>${(issueInfo == null ? void 0 : issueInfo.closedNum) || ""} Closed</span>
      </a>
    </section>
  `;
}
const getGithubIssueUrl = (name, state = "open", repo) => `https://api.github.com/search/issues?q=is:issue+is:${state}+${name}+repo:Tencent/${repo}`;
function fetchGithubIssueNum(host, name, state = "open", framework) {
  const issueUrl = getGithubIssueUrl(name, state, `tdesign-${framework}`);
  const cacheKey = `__tdesign_${framework}_${name}_${state}__`;
  const cache2 = sessionStorage.getItem(cacheKey);
  if (cache2) {
    const data = JSON.parse(cache2);
    Object.assign(host, { [`${state}Num`]: data.total_count });
  } else {
    fetch(issueUrl).then((res) => res.json()).then((data) => {
      Object.assign(host, { [`${state}Num`]: data.total_count });
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    }).catch((err) => {
      console.error(err);
    });
  }
}
define$2({
  tag: "td-doc-issue",
  openNum: {
    get: (_host, lastValue) => lastValue || "",
    set: (_host, value2) => value2,
    connect: (host) => {
      const [, framework, componentName] = parseUrl();
      if (!componentName)
        return;
      fetchGithubIssueNum(host, componentName, "open", framework);
    }
  },
  closedNum: {
    get: (_host, lastValue) => lastValue || "",
    set: (_host, value2) => value2,
    connect: (host) => {
      const [, framework, componentName] = parseUrl();
      if (!componentName)
        return;
      fetchGithubIssueNum(host, componentName, "closed", framework);
    }
  },
  render: (host) => html`${renderIssue(host)}`.css`${style$g}`
});
const getFooterConfig = () => {
  const lang2 = getLang();
  const isEnglish = lang2 === "en";
  const footerLinks2 = [
    {
      title: isEnglish ? "Resource" : "\u8D44\u6E90",
      links: [
        { name: isEnglish ? "Design Resource" : "\u8BBE\u8BA1\u8D44\u6E90", url: jumpLocation("/source"), target: "_self" },
        { name: "TDesign Starter", url: jumpLocation("https://tdesign.tencent.com/starter/"), target: "_self" }
      ]
    },
    {
      title: isEnglish ? "Tencent Design" : "\u817E\u8BAF\u8BBE\u8BA1",
      links: [
        { name: "CoDesign", url: "https://codesign.qq.com/", target: "_blank" },
        { name: "ProWork", url: "https://prowork.qq.com/", target: "_blank" },
        { name: "TDesign", url: `https://tdesign.${isIntranet() ? "woa" : "tencent"}.com`, target: "_self" },
        isIntranet() ? { name: "TVision", url: "https://tvision.oa.com/", target: "_blank" } : null
      ].filter((item) => item)
    },
    {
      title: isEnglish ? "About" : "\u5173\u4E8E",
      links: [
        { name: isEnglish ? "About us" : "\u5173\u4E8E\u6211\u4EEC", url: jumpLocation("/about/introduce"), target: "_self" },
        { name: isEnglish ? "Contact us" : "\u8054\u7CFB\u6211\u4EEC", url: jumpLocation("/about/contact"), target: "_self" },
        { name: isEnglish ? "Feedback" : "\u610F\u89C1\u53CD\u9988", url: "//support.qq.com/products/293854", target: "_blank" }
      ]
    }
  ];
  return footerLinks2;
};
const getLocale = () => {
  const lang2 = getLang();
  const locale2 = {
    zh: {
      footer: {
        copyright: "\u817E\u8BAF\u516C\u53F8 \u7248\u6743\u6240\u6709",
        weComGroup: "\u4F01\u4E1A\u5FAE\u4FE1\u7FA4",
        weComGroupDesc: "\u6B22\u8FCE\u5FAE\u4FE1\u626B\u7801\u8054\u7CFB\u6211\u4EEC"
      }
    },
    en: {
      footer: {
        copyright: "Tencent Copyright",
        weComGroup: "WeCom Group",
        weComGroupDesc: "Welcome to contact us"
      }
    }
  };
  return locale2[lang2];
};
var style$f = ":host{font-size:14px;color:var(--text-secondary);min-height:var(--footer-height);box-sizing:border-box;--footer-logo-position: absolute;--footer-inner-position: static}.TDesign-doc-footer{position:relative;height:calc(var(--footer-height) - 56px);padding-right:var(--content-padding-right);background-color:var(--bg-color-footer);box-shadow:var(--footer-box-shadow)}.TDesign-doc-footer__inner{position:var(--footer-inner-position);margin:0 auto;padding:40px var(--content-padding-left-right);height:100%;box-sizing:border-box;display:flex;justify-content:space-between;max-width:var(--content-max-width)}.TDesign-doc-footer__content{display:flex;flex-direction:row;column-gap:24px;width:100%}.TDesign-doc-footer__content-block{display:flex;flex-direction:column;min-width:120px}.TDesign-doc-footer__content-block .title{font-size:14px;font-weight:400;line-height:22px;margin-top:0;margin-bottom:24px;color:var(--text-placeholder)}.TDesign-doc-footer__content-block .link{cursor:pointer;text-decoration:none;color:var(--text-primary);font-size:14px;line-height:22px;margin-bottom:16px;transition:all var(--anim-duration-base) linear}.TDesign-doc-footer__content-block .link:hover{color:var(--text-interactive)}.TDesign-doc-footer__logos{display:inline-flex;align-items:center;row-gap:32px;column-gap:32px}.TDesign-doc-footer__qrcode{width:192px;padding:24px;box-sizing:border-box;border-radius:9px;background:var(--bg-color-code);border:1px solid var(--component-border);display:flex;flex-direction:column;align-items:center;position:absolute;right:48px;top:40px}.TDesign-doc-footer__qrcode-title{margin:0 0 4px;font-size:16px;line-height:24px;font-weight:700;color:var(--text-primary)}.TDesign-doc-footer__qrcode-desc{margin:0;font-size:14px;line-height:22px;color:var(--text-secondary)}.TDesign-doc-footer__bottom{height:56px;overflow:hidden;color:var(--text-placeholder);padding-right:var(--content-padding-right);background:var(--bg-color-secondaryfooter)}.TDesign-doc-footer__bottom .TDesign-doc-footer__inner{padding:0 var(--content-padding-left-right);align-items:center;column-gap:24px}.TDesign-doc-footer__bottom .TDesign-doc-footer__logos{position:var(--footer-logo-position);right:48px;bottom:0;height:56px}.TDesign-doc-footer__bottom .logo{height:34px;display:inline-flex;align-items:center}.TDesign-doc-footer__bottom .logo svg{transition:color .2s linear;color:var(--text-placeholder)}.TDesign-doc-footer__bottom .logo:not(i):hover svg{color:var(--text-secondary)}.TDesign-doc-footer__bottom .copyright{margin:0}@media screen and (max-width: 960px){.TDesign-doc-footer{height:auto}.TDesign-doc-footer__qrcode{position:unset}.TDesign-doc-footer__content{flex-direction:column;align-items:center;text-align:center;row-gap:24px}.TDesign-doc-footer__content .title{color:var(--text-primary);margin-bottom:12px}.TDesign-doc-footer__content .link{color:var(--text-placeholder)}.TDesign-doc-footer__bottom{height:112px}.TDesign-doc-footer__bottom .TDesign-doc-footer__inner{flex-direction:column-reverse;padding-top:16px;padding-bottom:16px}.TDesign-doc-footer__bottom .TDesign-doc-footer__logos{position:unset;height:auto}.TDesign-doc-footer__bottom .copyright{text-align:center}}\n";
var tencentCloudIcon = '<svg width="105" height="28" viewBox="0 0 105 28" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g clip-path="url(#clip0_65_182)">\n    <path\n      d="M82.8701 4.73254H71.4558V6.38476H74.8911V12.4065H70.9536V14.0573H74.8911V24.1623H76.708V14.0573H81.0532V23.945H84.4832V22.2914H82.8634L82.8701 4.73254ZM76.708 12.4065V6.38476H81.0532V12.4065H76.708Z"\n      fill="currentColor" />\n    <path d="M60.2114 19.5378H51.2066V21.1901H60.2114V19.5378Z" fill="currentColor" />\n    <path\n      d="M45.0702 16.4803C45.0702 19.4838 44.8272 21.7637 44.3278 23.7844C44.2751 23.9707 44.3278 24.0206 44.4304 24.0206H46.0866C46.5188 21.7971 46.7313 19.5365 46.7211 17.2714H49.0361V22.4008H47.3919C47.3123 22.4008 47.257 22.4521 47.2921 22.5668L47.7443 24.0517H50.6842V4.77441H45.0702V16.4803ZM46.7224 15.7933V11.8341H49.0361V15.7933H46.7224ZM49.0361 6.43338V10.348H46.7224V6.43338H49.0361Z"\n      fill="currentColor" />\n    <path\n      d="M60.85 11.4737H63.0678V9.98888H56.606C56.8095 9.48642 56.9866 8.97368 57.1365 8.45274H62.6615V6.96791H61.0416C61.3116 6.05001 61.6288 4.96607 61.6477 4.90398C61.6801 4.79329 61.6221 4.75145 61.5505 4.75145H60.1467L59.4947 6.96791H57.5037C57.69 6.1094 57.8506 5.15775 57.9977 4.08867C58.0153 3.96583 57.9491 3.94019 57.8627 3.94019H56.2686C56.1052 5.07541 55.9338 6.05406 55.7151 6.96791H54.7392L54.0872 4.75145H52.682C52.6105 4.75145 52.547 4.79329 52.5848 4.90398C52.6037 4.96607 52.9209 6.05001 53.1909 6.96791H51.6143V8.45274H55.2953C55.1238 8.9761 54.9218 9.48902 54.6906 9.98888H51.2093V11.4737H53.824C53.133 12.4726 52.2359 13.3118 51.1931 13.9345V15.6353C51.1931 15.7204 51.2606 15.8108 51.5306 15.6583C52.0629 15.3631 52.5768 15.0358 53.0694 14.6783H59.2207L59.168 16.9042H54.3086L54.3815 15.5732C54.382 15.5599 54.3798 15.5466 54.375 15.5341C54.3702 15.5217 54.3629 15.5104 54.3535 15.5009C54.3442 15.4914 54.333 15.4839 54.3206 15.4789C54.3082 15.474 54.2949 15.4716 54.2816 15.472H52.7319L52.5754 18.2891C52.5748 18.3026 52.577 18.316 52.5819 18.3285C52.5868 18.3411 52.5942 18.3525 52.6037 18.362C52.6133 18.3715 52.6246 18.3789 52.6372 18.3838C52.6497 18.3887 52.6632 18.3909 52.6766 18.3904H61.0551V22.4075H57.2756C57.1959 22.4075 57.1338 22.4602 57.177 22.5749L57.6292 24.0597H62.8693V16.9055H60.8176L60.8864 14.0141C61.5709 14.6491 62.328 15.2009 63.142 15.6583C63.412 15.8108 63.4781 15.7204 63.4781 15.6353V13.9304C62.4371 13.3081 61.541 12.4705 60.85 11.4737ZM58.8252 11.4737C59.1941 12.082 59.616 12.6566 60.0859 13.1907H54.6865C55.1417 12.6596 55.5428 12.0844 55.8839 11.4737H58.8252Z"\n      fill="currentColor" />\n    <path\n      d="M72.6072 18.3891L69.543 20.7109V9.97278H65.2991V11.7897H67.7396V22.0783L66.7637 22.8126L67.7599 24.13L72.7705 20.3329V18.4674C72.7707 18.4484 72.7655 18.4297 72.7554 18.4135C72.7454 18.3974 72.731 18.3844 72.7138 18.3762C72.6966 18.368 72.6775 18.3648 72.6586 18.3671C72.6397 18.3694 72.6219 18.377 72.6072 18.3891Z"\n      fill="currentColor" />\n    <path\n      d="M67.9786 8.34619H69.9642C69.9822 8.34637 70 8.34167 70.0156 8.33259C70.0311 8.32351 70.0439 8.31039 70.0527 8.29462C70.0614 8.27884 70.0657 8.26101 70.0651 8.24299C70.0645 8.22498 70.059 8.20747 70.0493 8.1923L67.5453 4.36682H65.5596C65.542 4.36677 65.5247 4.37131 65.5094 4.37999C65.4941 4.38867 65.4813 4.40119 65.4723 4.41632C65.4634 4.43145 65.4585 4.44865 65.4581 4.46625C65.4578 4.48384 65.4621 4.50122 65.4706 4.51666L67.9786 8.34619Z"\n      fill="currentColor" />\n    <path d="M102.663 5.17407H88.3249V6.99097H102.663V5.17407Z" fill="currentColor" />\n    <path\n      d="M93.5245 13.8562H104.682V12.0393H86.3055V13.8562H91.4039C90.351 16.6221 87.708 23.5603 87.6904 23.6102C87.6841 23.6253 87.6816 23.6417 87.6833 23.658C87.6849 23.6743 87.6907 23.6898 87.6999 23.7033C87.7092 23.7168 87.7218 23.7277 87.7364 23.735C87.751 23.7423 87.7672 23.7458 87.7836 23.7452H103.633C103.651 23.7453 103.667 23.741 103.682 23.7328C103.697 23.7246 103.71 23.7127 103.719 23.6983C103.728 23.6839 103.734 23.6674 103.735 23.6503C103.736 23.6333 103.733 23.6162 103.725 23.6008C103.708 23.5576 101.362 17.3915 101.362 17.3915H99.3882C99.3721 17.3916 99.3563 17.3956 99.342 17.4031C99.3277 17.4106 99.3155 17.4214 99.3062 17.4347C99.297 17.4479 99.291 17.4631 99.2889 17.479C99.2867 17.495 99.2884 17.5113 99.2937 17.5265C99.3194 17.5913 100.966 21.9283 100.966 21.9283H90.4563L93.5245 13.8562Z"\n      fill="currentColor" />\n    <path\n      d="M36.1274 12.7332C35.2963 11.8813 34.3031 11.2043 33.2063 10.742C32.1096 10.2798 30.9314 10.0416 29.7412 10.0416C27.572 10.0416 25.7038 10.788 24.0719 12.1163C23.3605 12.6954 22.6154 13.3879 21.6772 14.299C21.3654 14.6027 15.2182 20.5677 11.1808 24.4836C10.6192 24.4836 9.81201 24.4742 9.09524 24.4499C7.07856 24.3811 5.8556 23.6076 5.16042 22.9259C4.38377 22.1682 3.85042 21.1963 3.62842 20.1342C3.40641 19.0721 3.50581 17.9679 3.91393 16.9625C4.32205 15.9571 5.02039 15.0961 5.91988 14.4893C6.81938 13.8824 7.87925 13.5572 8.96431 13.5552C9.9092 13.5552 11.2078 13.8252 12.667 15.0401C13.3635 15.6178 14.9104 16.9785 15.5894 17.5899C15.6048 17.6053 15.6257 17.6139 15.6474 17.6139C15.6692 17.6139 15.69 17.6053 15.7055 17.5899L18.1028 15.2534C18.1127 15.2451 18.1207 15.2348 18.1262 15.2231C18.1316 15.2115 18.1345 15.1987 18.1345 15.1859C18.1345 15.173 18.1316 15.1602 18.1262 15.1486C18.1207 15.1369 18.1127 15.1266 18.1028 15.1184C16.9514 14.0776 15.3181 12.6211 14.3354 11.8895C13.3401 11.1273 12.1981 10.5791 10.981 10.2791H11.0188C11.3852 8.52687 12.2952 6.93492 13.6193 5.73007C14.9433 4.52523 16.6138 3.76894 18.3928 3.56895C20.1717 3.36896 21.9685 3.73547 23.527 4.61626C25.0855 5.49706 26.3263 6.84721 27.0726 8.47439C27.0785 8.49358 27.0917 8.5097 27.1094 8.51928C27.127 8.52887 27.1477 8.53116 27.1671 8.52569C28.2707 8.21981 29.4177 8.10073 30.5606 8.17337C30.6753 8.18147 30.7199 8.11668 30.6821 8.01274C29.7894 5.48899 28.08 3.3353 25.8248 1.89291C23.5697 0.450524 20.8977 -0.198078 18.2322 0.0498744C15.5667 0.297826 13.0602 1.42815 11.1097 3.26176C9.15931 5.09537 7.87652 7.52739 7.46462 10.1725H7.47272C5.84132 10.4504 4.31849 11.1739 3.07241 12.2629C1.82634 13.3519 0.905516 14.7642 0.411655 16.3437C-0.0822067 17.9232 -0.129889 19.6084 0.273874 21.2133C0.677638 22.8182 1.51713 24.2802 2.69964 25.438C4.05827 26.7686 5.81442 27.619 7.70084 27.8596C8.54769 27.9568 9.3997 28.0018 10.2521 27.9946C11.062 27.9946 26.5853 27.9946 27.2359 27.9946C28.5439 27.9946 29.3957 27.9946 30.3082 27.9258C32.4045 27.7732 34.3847 27.0038 35.987 25.4326C36.8304 24.6081 37.503 23.6256 37.9666 22.541C38.4301 21.4565 38.6754 20.2913 38.6884 19.112C38.7014 17.9326 38.482 16.7623 38.0425 15.6678C37.6031 14.5733 36.9523 13.5761 36.1274 12.7332ZM33.5303 22.9259C32.8419 23.6008 31.6135 24.3811 29.5955 24.4499C28.6627 24.4809 27.5707 24.485 27.0753 24.485H16.236L24.0098 16.9339C24.3675 16.587 25.172 15.8176 25.8645 15.1926C27.3885 13.8225 28.7586 13.5458 29.7277 13.5552C30.8127 13.5575 31.8724 13.8829 32.7717 14.4898C33.6709 15.0968 34.3691 15.9578 34.777 16.9631C35.185 17.9685 35.2843 19.0725 35.0622 20.1345C34.8402 21.1965 34.3069 22.1683 33.5303 22.9259Z"\n      fill="currentColor" />\n  </g>\n  <defs>\n    <clipPath id="clip0_65_182">\n      <rect width="104.682" height="28" fill="currentColor" />\n    </clipPath>\n  </defs>\n</svg>';
var committeeIcon = '<svg width="169" height="34" viewBox="0 0 169 34" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path\n    d="M50.6977 5.8872L48.0412 20.4756H46.233L47.2822 14.8947H46.0545C45.6415 16.9485 45.1615 18.8683 44.6927 20.4756H42.8845C43.4203 18.7232 43.9002 16.8257 44.3132 14.7608C45.0387 11.2672 45.608 7.91864 46.1103 4.84916H49.4588C50.4298 4.84916 50.7759 5.00543 50.6977 5.8872ZM48.1305 10.5416H46.9027C46.7353 11.4904 46.5567 12.4726 46.3781 13.399H47.5948L48.1305 10.5416ZM48.4654 6.36716H47.5724L47.1148 9.09062H48.3426L48.7891 6.71317C48.8449 6.42297 48.7444 6.36716 48.4654 6.36716ZM55.7428 18.3214H49.5816L49.336 16.9261H56.033L55.7428 18.3214ZM60.5312 12.2717L60.0624 13.8455C59.2652 13.6668 58.5082 13.3413 57.8301 12.8856L57.3948 14.7943H58.2765C58.9016 14.7943 59.3369 14.9059 59.203 15.6537C58.9909 17.0154 58.6672 18.8794 58.3658 20.4756H53.4993L53.1756 19.0804H56.6581C56.8367 18.2879 57.0264 17.3615 57.1604 16.6136C57.1604 16.3569 57.1604 16.2676 56.9036 16.2676H50.6977L51.2558 13.3544C50.7037 13.5968 50.1276 13.7801 49.5369 13.9013L49.9164 12.1154C51.036 11.819 52.069 11.2604 52.9301 10.4858H50.2624L50.5526 9.09062H53.9011C54.0409 8.82317 54.1639 8.54732 54.2695 8.26465H50.6977L50.9768 6.80247H52.2157L51.8139 4.68174H53.7002C53.823 5.39609 53.9681 6.06579 54.1244 6.83595H54.7383C54.9326 6.03014 55.0521 5.20814 55.0954 4.38037H56.9929C56.9377 5.1973 56.8107 6.00779 56.6134 6.80247H57.3948C57.6949 6.11083 57.9558 5.40279 58.1761 4.68174H60.0513C59.7914 5.40561 59.4895 6.11373 59.1472 6.80247H60.4642L60.1294 8.23117H56.2116C56.1 8.49905 55.9884 8.78925 55.8656 9.05713H60.7433L60.3973 10.4523H57.5845C58.3406 11.371 59.3814 12.0113 60.5424 12.2717H60.5312ZM55.5531 14.7943L55.8433 13.4995C55.8433 13.2539 55.8433 13.1646 55.5977 13.1646H52.2492L53.0863 13.7339L52.8743 14.8501L55.5531 14.7943ZM55.0508 10.4858C54.6613 10.9647 54.2237 11.4023 53.7449 11.7918H56.5576C56.2115 11.4011 55.9256 10.9609 55.7093 10.4858H55.0508Z"\n    fill="currentColor" />\n  <path\n    d="M65.3532 16.7144C66.0898 16.1787 66.9381 15.4978 67.7194 14.8727L67.2953 17.1944C65.815 18.3602 64.2643 19.4338 62.652 20.409L64.4602 10.6424H62.6185L62.8864 9.03516H66.7149L65.3532 16.7144ZM65.3532 8.1199L64.6834 4.3584H66.5475L67.3065 8.1199H65.3532ZM77.8878 6.03266C77.1511 10.129 76.3475 14.75 75.6554 18.8128H77.8878L77.2516 20.4759H73.3226C73.8584 17.373 74.3272 14.6607 74.7625 12.2944H71.9051L70.4764 20.4759H68.4896L69.9183 12.2944H67.4404L67.7418 10.7764H70.1527L70.8336 6.93676L72.5748 8.23152L72.1283 10.7764H75.0304C75.2759 9.32537 75.5103 8.01944 75.7224 6.90327C75.8117 6.43448 75.6108 6.38983 75.209 6.38983H68.5566L68.1994 4.81603H76.7381C77.8766 4.81603 78.0552 5.12856 77.8878 6.03266Z"\n    fill="currentColor" />\n  <path\n    d="M84.1831 13.9229L83.279 20.4748H79.8188L79.3389 18.901H81.5712L82.1516 14.6149L80.3992 15.1507L79.5956 13.6773C80.522 13.4318 81.4708 13.1639 82.4083 12.896L82.8883 9.36888H80.522L80.7564 7.79508H83.1227L83.5692 4.56934H85.4778L85.0313 7.79508H86.7726L86.5382 9.36888H84.8193L84.4063 12.2709C85.0871 12.0477 85.7569 11.8356 86.3596 11.6236L86.114 13.2532C85.5225 13.4987 84.8751 13.6885 84.1831 13.9229ZM92.5878 8.56524L92.2641 11.0543H94.8983C95.4899 11.0543 95.6127 11.2552 95.6127 11.6347C95.6249 12.1644 95.4685 12.6842 95.1662 13.1192C94.1971 14.4731 93.0733 15.7093 91.8177 16.8026C92.9405 18.0871 94.129 19.3128 95.3783 20.4748H92.532C91.7882 19.6921 91.0841 18.8725 90.4225 18.0192C89.3241 18.9177 88.1641 19.7383 86.9512 20.4748H83.9598C85.8541 19.3306 87.6633 18.0511 89.3733 16.6463C88.5808 15.5302 87.8106 14.414 87.1409 13.2978H89.2058C89.6784 14.0478 90.1926 14.7708 90.7461 15.4632C91.6784 14.663 92.5138 13.7565 93.2352 12.762C93.3022 12.6504 93.2352 12.6169 93.1571 12.6169H86.7168L86.9512 11.0766H90.2997L90.6234 8.58756H87.0963L87.3307 7.01376H90.802L91.1368 4.49121H93.1124L92.7776 7.01376H96.7288L96.5168 8.58756L92.5878 8.56524Z"\n    fill="currentColor" />\n  <path\n    d="M103.895 10.151C102.736 13.2402 101.321 16.2271 99.6643 19.0804H97.0859C99.0203 16.3072 100.61 13.3086 101.819 10.151H103.895ZM114.666 7.56146L114.42 9.29153H107.544L106.015 20.4979H103.85L105.39 9.24688H98.6932L98.9723 7.51682H105.669L106.105 4.38037H108.214L107.79 7.51682L114.666 7.56146ZM110.603 10.151C111.351 13.1739 112.26 16.1546 113.326 19.0804H110.971C110.402 17.4619 109.051 12.0931 108.661 10.151H110.603ZM110.837 7.33823C110.58 6.62388 110.301 5.57468 110.067 4.63709H111.786C112.082 5.55597 112.428 6.45773 112.824 7.33823H110.837Z"\n    fill="currentColor" />\n  <path\n    d="M123.997 13.4214H131.565L131.375 14.9059H128.54C127.324 16.0119 126.033 17.0337 124.678 17.9642C126.732 18.8013 129.064 19.6943 131.141 20.4867H126.486C125.191 19.9621 124.064 19.3706 122.892 18.9241C121.776 19.4487 120.503 20.0403 119.309 20.4867H114.621C116.731 19.7836 118.874 19.0357 120.827 18.1763L117.858 16.982C118.639 16.2788 119.376 15.5979 120.09 14.917H115.994L116.206 13.4325H121.597C122.01 13.0195 122.401 12.6066 122.78 12.1936H125.147C124.745 12.6289 124.365 13.0307 123.997 13.4214ZM119.276 12.3833H116.117C117.609 11.5364 119.001 10.5256 120.269 9.36966H122.725C121.658 10.4652 120.504 11.473 119.276 12.3833ZM132.179 7.51682L131.967 8.91203H125.537L125.091 11.8476H123.026L123.517 8.91203H117.032L117.233 7.51682H123.752L123.964 6.25554C122.1 6.33367 120.146 6.40064 118.383 6.43413L118.572 5.00543C123.037 4.91613 127.792 4.70406 131.319 4.38037L131.062 5.8872C129.701 5.98766 127.904 6.09928 125.95 6.18857L125.761 7.51682H132.179ZM122.546 14.9059C121.999 15.4751 121.497 16.022 120.995 16.4797C121.363 16.6471 122.01 16.9261 122.725 17.2164C123.834 16.5215 124.893 15.7494 125.895 14.9059H122.546ZM131.888 12.3833H129.21C128.328 11.5685 127.234 10.4412 126.274 9.36966H128.596C129.633 10.4386 130.732 11.445 131.888 12.3833Z"\n    fill="currentColor" />\n  <path\n    d="M145.238 20.4754C143.879 19.5623 142.575 18.571 141.331 17.5064C140.125 18.8248 138.626 19.8417 136.956 20.4754H132.714C135.438 19.5601 139.166 18.098 140.17 15.821C140.466 15.0772 140.676 14.302 140.795 13.5105H142.872C142.743 14.6743 142.415 15.8072 141.9 16.859H143.017C144.868 18.2462 146.844 19.457 148.921 20.4754H145.238ZM137.213 17.5734H135.081L136.052 10.7759H146.934C148.051 10.7759 148.352 11.1777 148.184 12.1711L147.448 17.5734H145.327L146.041 12.6176C146.041 12.439 146.041 12.3497 145.807 12.3497H137.916L137.213 17.5734ZM147.827 9.76016H136.8L137.536 4.67041H147.202C148.318 4.67041 148.508 5.02758 148.318 6.14376L147.827 9.76016ZM146.019 6.22189H139.322L139.054 8.231H145.952L146.198 6.51209C146.254 6.33351 146.22 6.22189 146.019 6.22189Z"\n    fill="currentColor" />\n  <path\n    d="M154.636 11.1441H151.712C153.853 9.16979 155.769 6.965 157.426 4.56982H163.498C164.157 4.56982 164.358 4.89351 164.614 5.42928C165.732 7.4117 166.969 9.32392 168.32 11.1552H165.664C164.701 9.62053 163.818 8.03718 163.018 6.41151C162.929 6.23292 162.784 6.19944 162.572 6.19944H158.632C157.393 7.91834 155.853 9.78235 154.636 11.1441ZM152.404 12.9523H167.048L166.78 14.6154H159.235C158.175 15.9953 157.035 17.311 155.819 18.5555H162.46C161.869 17.5509 161.277 16.4905 160.719 15.4413H162.951C163.965 17.1783 165.083 18.852 166.3 20.453H163.543L162.773 19.2028L162.215 20.319H151.723C153.561 18.5724 155.239 16.6634 156.734 14.6154H152.169L152.404 12.9523ZM156.623 9.03451H164.179L163.978 10.6641H156.422L156.623 9.03451Z"\n    fill="currentColor" />\n  <path\n    d="M46.6572 24.6613H45.2731L44.4137 29.539H43.398L44.2574 24.6613H42.8845L43.0296 23.8242H46.8358L46.6572 24.6613Z"\n    fill="currentColor" />\n  <path\n    d="M50.8654 26.1012C50.8748 26.2126 50.8748 26.3246 50.8654 26.436L50.7649 27.0276C50.6421 27.6973 50.3854 27.9317 49.7603 27.9317H48.0749V28.1661C48.0655 28.2775 48.0655 28.3895 48.0749 28.5009C48.0749 28.7577 48.2089 28.8246 48.6442 28.8246H50.1622L49.8496 29.5836H48.3875C47.4052 29.5836 47.0592 29.3381 47.0592 28.7242C47.0439 28.5496 47.0439 28.3741 47.0592 28.1996L47.3494 26.503C47.3882 26.148 47.5409 25.8151 47.7847 25.5542C48.1674 25.3046 48.6259 25.1979 49.0795 25.2529H49.5929C50.4412 25.2529 50.8654 25.465 50.8654 26.1012ZM49.9166 26.2463C49.9166 26.0565 49.805 26.0119 49.459 26.0119H48.9232C48.5772 26.0119 48.4098 26.0119 48.3316 26.503L48.2089 27.195H49.4925C49.7045 27.195 49.7827 27.1169 49.8162 26.916L49.8943 26.436C49.9114 26.3743 49.9189 26.3103 49.9166 26.2463Z"\n    fill="currentColor" />\n  <path\n    d="M56.0111 26.0797C55.9946 26.3876 55.9536 26.6937 55.8883 26.995L55.4418 29.5845H54.5043L54.9507 27.062C54.9953 26.8447 55.0251 26.6247 55.04 26.4034C55.04 26.169 54.9172 26.0797 54.415 26.0797H53.4662L52.8635 29.5845H51.9259L52.6737 25.3096H54.7275C55.6762 25.3096 56.0111 25.5216 56.0111 26.0797Z"\n    fill="currentColor" />\n  <path\n    d="M57.395 28.5899C57.4029 28.3201 57.4328 28.0513 57.4843 27.7863L57.6629 26.8041C57.6792 26.3677 57.8447 25.95 58.1317 25.6209C58.5105 25.3618 58.9712 25.2506 59.4265 25.3084H60.8217L60.5091 26.0674H59.393C59.2942 26.0537 59.1937 26.0605 59.0976 26.0874C59.0016 26.1143 58.9122 26.1606 58.8349 26.2236C58.7148 26.387 58.6415 26.5799 58.6228 26.7817L58.4442 27.7863C58.3992 27.9997 58.3693 28.216 58.3549 28.4337C58.3549 28.7574 58.5224 28.8243 59.0246 28.8243H60.3417L60.018 29.5833H58.7679C57.808 29.5833 57.395 29.3154 57.395 28.5899Z"\n    fill="currentColor" />\n  <path\n    d="M65.6547 26.1011C65.6641 26.2126 65.6641 26.3246 65.6547 26.436L65.5542 27.0276C65.4314 27.6973 65.1859 27.9317 64.5608 27.9317H62.8642V28.1661C62.8555 28.2775 62.8555 28.3895 62.8642 28.5009C62.8642 28.7576 62.9982 28.8246 63.4446 28.8246H64.8733L64.572 29.5836H63.1768C62.1945 29.5836 61.8485 29.338 61.8485 28.7241C61.8332 28.5496 61.8332 28.3741 61.8485 28.1995L62.1387 26.503C62.1765 26.1455 62.3338 25.8112 62.5852 25.5542C62.9629 25.3026 63.4186 25.1956 63.8688 25.2529H64.3822C65.2082 25.2529 65.6547 25.4649 65.6547 26.1011ZM64.7059 26.2462C64.7059 26.0565 64.5943 26.0118 64.2483 26.0118H63.7125C63.3665 26.0118 63.1991 26.0118 63.121 26.503L62.9982 27.195H64.2818C64.4938 27.195 64.572 27.1169 64.6055 26.9159L64.6836 26.436C64.7007 26.3743 64.7082 26.3103 64.7059 26.2462Z"\n    fill="currentColor" />\n  <path\n    d="M70.789 26.0797C70.7716 26.3869 70.7343 26.6926 70.6774 26.995L70.2198 29.5845H69.2822L69.7287 27.062C69.779 26.8457 69.8089 26.6252 69.818 26.4034C69.818 26.169 69.6952 26.0797 69.1929 26.0797H68.2553L67.6414 29.5845H66.7039L67.4405 25.3096H69.4943C70.4765 25.3096 70.789 25.5216 70.789 26.0797Z"\n    fill="currentColor" />\n  <path\n    d="M73.5348 27.7855C73.4759 28.0273 73.4385 28.2738 73.4232 28.5222C73.4232 28.8124 73.6129 28.8235 74.1041 28.8235H74.6175L74.2938 29.5825H73.7469C72.8986 29.5825 72.4745 29.3593 72.4745 28.7008C72.4923 28.393 72.5333 28.0871 72.5972 27.7855L72.8986 26.0666H72.3293L72.4745 25.3076H73.0214L73.2446 24.0352H74.1822L73.959 25.3076H75.1533L75.0193 26.0666H73.8362L73.5348 27.7855Z"\n    fill="currentColor" />\n  <path\n    d="M83.0671 24.6613H81.6496L80.8348 29.5837H79.8191L80.6339 24.6613H79.2386L79.3949 23.8242H83.1899L83.0671 24.6613Z"\n    fill="currentColor" />\n  <path\n    d="M87.2415 26.1011C87.2509 26.2126 87.2509 26.3246 87.2415 26.436L87.141 27.0276C87.0182 27.6973 86.7727 27.9317 86.1476 27.9317H84.451V28.1661C84.4423 28.2775 84.4423 28.3895 84.451 28.5009C84.451 28.7576 84.585 28.8246 85.0314 28.8246H86.4155L86.1141 29.5836H84.7635C83.7813 29.5836 83.4353 29.338 83.4353 28.7241C83.42 28.5496 83.42 28.3741 83.4353 28.1995L83.7255 26.503C83.7632 26.1455 83.9206 25.8112 84.172 25.5542C84.5497 25.3026 85.0054 25.1956 85.4556 25.2529H85.969C86.8173 25.2529 87.2415 25.4649 87.2415 26.1011ZM86.2927 26.2462C86.2927 26.0565 86.1811 26.0118 85.8351 26.0118H85.2993C84.9533 26.0118 84.7859 26.0118 84.7077 26.503L84.585 27.195H85.8686C86.0806 27.195 86.1588 27.1169 86.1923 26.9159L86.2704 26.436C86.2875 26.3743 86.295 26.3103 86.2927 26.2462Z"\n    fill="currentColor" />\n  <path\n    d="M88.3909 28.5908C88.4042 28.3208 88.4377 28.0522 88.4913 27.7872L88.6699 26.805C88.6816 26.3676 88.8477 25.9485 89.1387 25.6218C89.5166 25.3608 89.9781 25.2494 90.4335 25.3093H91.8287L91.505 26.0683H90.3888C90.29 26.0539 90.1893 26.0604 90.0932 26.0873C89.9971 26.1142 89.9077 26.161 89.8307 26.2246C89.7107 26.3879 89.6374 26.5808 89.6187 26.7826L89.4401 27.7872C89.3893 27.9996 89.3594 28.2164 89.3508 28.4346C89.3508 28.7583 89.507 28.8252 90.0093 28.8252H91.3264L91.0027 29.5842H89.7638C88.7927 29.5842 88.3909 29.3164 88.3909 28.5908Z"\n    fill="currentColor" />\n  <path\n    d="M96.8742 26.0796C96.8577 26.3875 96.8167 26.6935 96.7514 26.9949L96.2938 29.5844H95.345L95.7915 27.0618C95.8419 26.8456 95.8718 26.6251 95.8808 26.4033C95.8808 26.1689 95.7692 26.0796 95.2557 26.0796H94.307L93.6931 29.5844H92.7778L93.827 23.5459H94.7646L94.4521 25.2871H95.5683C96.5393 25.3095 96.8742 25.5215 96.8742 26.0796Z"\n    fill="currentColor" />\n  <path\n    d="M102.287 26.0797C102.265 26.3871 102.224 26.6927 102.165 26.995L101.707 29.5845H100.769L101.216 27.062C101.266 26.8457 101.296 26.6252 101.305 26.4034C101.305 26.169 101.182 26.0797 100.68 26.0797H99.7425L99.1286 29.5845H98.191L98.9389 25.3096H100.993C101.953 25.3096 102.287 25.5216 102.287 26.0797Z"\n    fill="currentColor" />\n  <path\n    d="M104.341 25.3091H105.279L104.531 29.584H103.604L104.341 25.3091ZM104.62 23.646H105.591L105.39 24.6617H104.43L104.62 23.646Z"\n    fill="currentColor" />\n  <path\n    d="M106.506 28.5905C106.52 28.3205 106.553 28.0519 106.607 27.7869L106.774 26.8046C106.794 26.3669 106.963 25.9491 107.254 25.6215C107.628 25.3602 108.086 25.2486 108.538 25.309H109.933L109.62 26.068H108.504C108.406 26.0536 108.305 26.0601 108.209 26.087C108.113 26.1139 108.023 26.1606 107.946 26.2242C107.826 26.3876 107.753 26.5805 107.734 26.7823L107.556 27.7869C107.503 27.9992 107.469 28.2159 107.455 28.4343C107.455 28.7579 107.623 28.8249 108.125 28.8249H109.442L109.118 29.5839H107.879C106.919 29.5839 106.506 29.316 106.506 28.5905Z"\n    fill="currentColor" />\n  <path\n    d="M114.777 26.0782C114.765 26.3292 114.735 26.5791 114.688 26.8261L114.197 29.583H111.965C111.474 29.583 110.994 29.4379 110.994 28.8463C111.005 28.6063 111.035 28.3674 111.083 28.132V27.8753C111.195 27.2949 111.362 27.0605 111.73 26.96C112.017 26.9018 112.309 26.8793 112.601 26.893H113.717C113.759 26.7246 113.785 26.5527 113.795 26.3796C113.795 26.1564 113.661 26.0782 113.237 26.0782H111.719L111.596 25.3192H113.55C114.454 25.3081 114.777 25.5425 114.777 26.0782ZM113.427 28.824L113.639 27.6185H112.456C112.154 27.6185 112.054 27.7078 112.009 27.9869V28.1431C112.009 28.3887 111.942 28.5785 111.942 28.6454C111.942 28.7124 112.032 28.824 112.221 28.824H113.427Z"\n    fill="currentColor" />\n  <path\n    d="M116.195 28.7469C116.206 28.4245 116.244 28.1035 116.307 27.787L117.054 23.5679H117.992L117.244 27.787C117.193 28.0299 117.16 28.2761 117.144 28.5237C117.144 28.8139 117.333 28.825 117.825 28.825H118.26L117.936 29.584H117.4C116.552 29.584 116.195 29.3831 116.195 28.7469Z"\n    fill="currentColor" />\n  <path\n    d="M122.323 28.4565C122.329 28.1453 122.363 27.8353 122.423 27.53L122.814 25.2977C122.825 25.0599 122.885 24.827 122.991 24.6138C123.096 24.4005 123.245 24.2115 123.428 24.0587C123.766 23.8652 124.156 23.7832 124.544 23.8243H126.43L126.084 24.6615H124.667C124.064 24.6615 123.952 24.907 123.818 25.6549L123.55 27.1617C123.474 27.5111 123.422 27.8654 123.394 28.2221C123.394 28.635 123.662 28.702 124.287 28.702H125.693L125.336 29.5391H123.874C122.769 29.5838 122.323 29.2936 122.323 28.4565Z"\n    fill="currentColor" />\n  <path\n    d="M127.19 28.6465C127.197 28.3766 127.227 28.1078 127.279 27.8428L127.48 26.7267C127.499 26.2908 127.664 25.874 127.949 25.5435C128.331 25.2939 128.79 25.1872 129.243 25.2421H129.768C130.717 25.2421 131.119 25.51 131.119 26.2355C131.105 26.5056 131.072 26.7742 131.018 27.0392L130.828 28.1553C130.806 28.5892 130.637 29.0027 130.348 29.3273C129.975 29.5887 129.517 29.7002 129.065 29.6399H128.54C127.58 29.6399 127.19 29.372 127.19 28.6465ZM129.132 28.8697C129.388 28.8697 129.567 28.8697 129.679 28.7246C129.794 28.5545 129.867 28.3593 129.891 28.1553L130.092 27.0392C130.135 26.8258 130.161 26.6093 130.17 26.3918C130.17 26.0681 130.002 26.0011 129.511 26.0011H129.188C129.09 25.9872 128.99 25.9928 128.894 26.0177C128.798 26.0426 128.708 26.0863 128.629 26.1462C128.5 26.313 128.426 26.5159 128.417 26.7267L128.216 27.8428C128.171 28.0562 128.142 28.2726 128.127 28.4902C128.127 28.8139 128.295 28.8697 128.786 28.8697H129.132Z"\n    fill="currentColor" />\n  <path\n    d="M138.742 26.0797C138.725 26.3876 138.684 26.6937 138.619 26.995L138.161 29.5845H137.224L137.67 27.062C137.722 26.8457 137.756 26.6254 137.771 26.4034C137.771 26.169 137.637 26.0797 137.146 26.0797H136.286L135.672 29.5845H134.735L135.349 26.0797H133.897L133.295 29.5845H132.357L133.105 25.3096H137.458C138.418 25.3096 138.742 25.5216 138.742 26.0797Z"\n    fill="currentColor" />\n  <path\n    d="M146.443 26.0797C146.431 26.3874 146.394 26.6935 146.332 26.995L145.863 29.5845H144.936L145.383 27.062C145.427 26.8447 145.457 26.6247 145.472 26.4034C145.472 26.169 145.349 26.0797 144.847 26.0797H143.988L143.34 29.5845H142.403L143.005 26.0797H141.566L140.952 29.5845H140.014L140.762 25.3096H145.126C146.12 25.3096 146.443 25.5216 146.443 26.0797Z"\n    fill="currentColor" />\n  <path\n    d="M148.508 25.3091H149.446L148.698 29.584H147.805L148.508 25.3091ZM148.798 23.646H149.758L149.58 24.6059H148.62L148.798 23.646Z"\n    fill="currentColor" />\n  <path\n    d="M152.024 27.7855C151.965 28.0273 151.928 28.2738 151.913 28.5222C151.913 28.8124 152.102 28.8235 152.593 28.8235H153.107L152.783 29.5825H152.27C151.433 29.5825 151.008 29.3593 151.008 28.7008C151.026 28.393 151.067 28.0871 151.131 27.7855L151.433 26.0666H150.863L150.997 25.3076H151.567L151.79 24.0352H152.727L152.504 25.3076H153.698L153.553 26.0666H152.37L152.024 27.7855Z"\n    fill="currentColor" />\n  <path\n    d="M155.842 27.7855C155.791 28.0284 155.757 28.2745 155.741 28.5222C155.741 28.8124 155.92 28.8235 156.411 28.8235H156.924L156.601 29.5825H156.054C155.205 29.5825 154.781 29.3593 154.781 28.7008C154.799 28.393 154.84 28.0871 154.904 27.7855L155.205 26.0666H154.647L154.781 25.3076H155.339L155.574 24.0352H156.5L156.277 25.3076H157.482L157.337 26.0666H156.143L155.842 27.7855Z"\n    fill="currentColor" />\n  <path\n    d="M162.226 26.101C162.236 26.2124 162.236 26.3245 162.226 26.4359L162.114 27.0275C161.992 27.6972 161.746 27.9316 161.121 27.9316H159.458V28.166C159.448 28.2774 159.448 28.3894 159.458 28.5008C159.458 28.7575 159.592 28.8245 160.027 28.8245H161.545L161.233 29.5835H159.849C158.866 29.5835 158.52 29.3379 158.52 28.724C158.51 28.5493 158.51 28.3742 158.52 28.1994L158.822 26.5029C158.851 26.1453 159.005 25.8095 159.257 25.5541C159.639 25.3027 160.098 25.1958 160.552 25.2527H161.054C161.802 25.2527 162.226 25.4648 162.226 26.101ZM161.288 26.2461C161.288 26.0564 161.177 26.0117 160.831 26.0117H160.295C159.949 26.0117 159.782 26.0117 159.692 26.5029L159.569 27.1949H160.853C161.065 27.1949 161.154 27.1167 161.177 26.9158L161.266 26.4359C161.278 26.3732 161.285 26.3098 161.288 26.2461Z"\n    fill="currentColor" />\n  <path\n    d="M167.17 26.1012C167.18 26.2126 167.18 26.3246 167.17 26.436L167.07 27.0276C166.947 27.6973 166.691 27.9317 166.065 27.9317H164.414V28.1661C164.404 28.2775 164.404 28.3895 164.414 28.5009C164.414 28.7577 164.547 28.8246 164.983 28.8246H166.501L166.188 29.5836H164.804C163.822 29.5836 163.476 29.3381 163.476 28.7242C163.479 28.548 163.498 28.3725 163.532 28.1996L163.822 26.503C163.861 26.148 164.013 25.8151 164.257 25.5542C164.64 25.3046 165.098 25.1979 165.552 25.2529H166.065C166.78 25.2529 167.17 25.465 167.17 26.1012ZM166.222 26.2463C166.222 26.0565 166.11 26.0119 165.764 26.0119H165.228C164.882 26.0119 164.715 26.0119 164.637 26.503L164.514 27.195H165.798C166.01 27.195 166.088 27.1169 166.121 26.916L166.199 26.436C166.217 26.3743 166.224 26.3103 166.222 26.2463Z"\n    fill="currentColor" />\n  <path\n    d="M33.4438 13.8888C33.3843 13.5911 33.3248 13.2935 33.2553 12.9959L33.1958 12.7776C33.1363 12.5494 33.0767 12.3212 33.0073 12.093L32.9478 11.9045C32.8684 11.6664 32.799 11.4382 32.7097 11.2001L32.6501 11.0513C32.5729 10.8186 32.4835 10.5901 32.3823 10.3667L23.1256 20.4667H26.4592L26.3005 20.8238L26.2211 20.9826C26.0155 21.4666 25.7734 21.9342 25.4968 22.3815C25.4569 22.4388 25.4204 22.4984 25.3877 22.5601L25.1793 22.8875C23.8216 24.9861 21.9405 26.6947 19.7215 27.845C17.5024 28.9953 15.0219 29.5476 12.5245 29.4474C10.027 29.3473 7.59868 28.5982 5.47884 27.2739C3.359 25.9496 1.62077 24.0959 0.435425 21.8953C0.439521 21.9316 0.439521 21.9682 0.435425 22.0045C0.554481 22.4013 0.693381 22.7982 0.842201 23.1851V23.2546C0.991022 23.6514 1.16961 24.0384 1.35811 24.4253L1.45733 24.6237C1.63591 24.9908 1.83434 25.348 2.04269 25.7051L2.17167 25.9036C2.38994 26.2607 2.61813 26.608 2.86616 26.9453C2.88693 26.98 2.91014 27.0132 2.93561 27.0445C3.18365 27.3719 3.43168 27.6993 3.69956 28.0367L3.79877 28.1557C4.07657 28.4732 4.36429 28.7709 4.66193 29.0685C4.72146 29.128 4.78099 29.1776 4.83059 29.2372C5.13816 29.5249 5.44572 29.8027 5.7632 30.0706L5.93187 30.1995C6.26919 30.4773 6.62636 30.7452 6.98353 31.0032C10.6964 33.5576 15.2711 34.5346 19.7036 33.7199C24.136 32.9052 28.0643 30.3653 30.6262 26.6576C31.9221 24.824 32.8389 22.75 33.3228 20.5574C33.8066 18.3647 33.8478 16.0975 33.4438 13.8888Z"\n    fill="currentColor" />\n  <path\n    d="M30.5072 7.05256V6.99303C30.3385 6.76484 30.16 6.54657 29.9814 6.31838C29.8028 6.09019 29.8325 6.12987 29.7631 6.04058C28.6422 4.73506 27.3351 3.60178 25.8838 2.67723C22.2316 0.336465 17.8204 -0.513599 13.5599 0.302329C9.2993 1.11826 5.51428 3.53796 2.9853 7.06248C1.06626 9.93676 0.126718 13.3539 0.306526 16.8053C0.566232 19.9909 2.03246 22.9571 4.40566 25.0979C6.77886 27.2388 9.87993 28.3927 13.0753 28.324C14.9161 28.3233 16.7356 27.931 18.413 27.1731C17.8495 27.2714 17.2786 27.3212 16.7066 27.3219C15.3082 27.3161 13.9255 27.0274 12.6416 26.4732C11.3577 25.9191 10.1992 25.111 9.23577 24.0975C8.38807 23.2127 7.71487 22.176 7.25149 21.0417C6.64995 19.6188 6.37461 18.0793 6.44569 16.5362C6.51676 14.993 6.93244 13.4853 7.66222 12.1237C8.392 10.7622 9.41736 9.58129 10.6631 8.66772C11.9088 7.75414 13.3432 7.13107 14.8612 6.84421C16.7984 6.48705 18.7977 6.70076 20.6156 7.45934C20.6156 7.45934 21.3895 7.80658 21.7565 8.00501H21.826L22.2625 8.26297L22.461 8.40187L22.7487 8.6003L23.0265 8.80864C23.0969 8.85603 23.1632 8.90912 23.2249 8.96739L23.5424 9.23526C23.5933 9.27296 23.6399 9.31622 23.6813 9.36424L23.969 9.63212L24.0385 9.71149C24.1674 9.84047 24.2964 9.96945 24.4155 10.1083C24.5345 10.2472 24.5345 10.2373 24.5841 10.3068L24.7826 10.5449C25.4846 11.4426 26.0374 12.4477 26.4196 13.5213L31.291 8.21336C31.0628 7.84627 30.785 7.43949 30.5072 7.05256Z"\n    fill="currentColor" />\n</svg>';
var qrcodeIcon$1 = '<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"\n  xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g filter="url(#filter0_d_20061_58885)">\n    <rect x="8" width="144" height="144" rx="6" fill="white" />\n    <rect x="10" y="2" width="140" height="140" rx="4" stroke="url(#paint0_linear_20061_58885)" stroke-width="4" />\n  </g>\n  <rect x="20" y="12" width="120" height="120" fill="url(#pattern0)" />\n  <rect x="68" y="60" width="24" height="24" rx="3" fill="white" />\n  <path\n    d="M77.6496 80.214H74.3249C74.2698 80.214 74.2154 80.2021 74.1653 80.1792C74.1152 80.1564 74.0706 80.123 74.0344 80.0815C73.9983 80.0399 73.9715 79.9911 73.9559 79.9383C73.9402 79.8855 73.936 79.8299 73.9436 79.7754L74.5914 76.1187H78.6908L78.0226 79.9066C78.0048 79.9927 77.9582 80.0701 77.8903 80.1261C77.8224 80.182 77.7375 80.213 77.6496 80.214Z"\n    fill="#009BFF" />\n  <path\n    d="M87.0085 67.8868H76.0383L76.7598 63.7874H87.5824C87.6417 63.7817 87.7015 63.79 87.7569 63.8116C87.8124 63.8332 87.8621 63.8675 87.9019 63.9117C87.9418 63.9559 87.9707 64.0089 87.9864 64.0663C88.0021 64.1237 88.0042 64.1841 87.9924 64.2424L87.3857 67.5794C87.3692 67.6669 87.3223 67.7458 87.2533 67.8021C87.1843 67.8583 87.0975 67.8884 87.0085 67.8868Z"\n    fill="url(#paint1_linear_20061_58885)" />\n  <path\n    d="M76.0384 67.8861H72.3899C72.3341 67.8867 72.2788 67.8752 72.2279 67.8523C72.1769 67.8295 72.1316 67.7959 72.0949 67.7538C72.0583 67.7116 72.0312 67.6621 72.0156 67.6085C72 67.5549 71.9962 67.4985 72.0045 67.4433L72.599 64.1023C72.6152 64.014 72.6618 63.9341 72.7306 63.8765C72.7995 63.8188 72.8863 63.7871 72.9761 63.7866H76.7599L76.0384 67.8861Z"\n    fill="#0064FF" />\n  <path d="M78.6951 76.1062H74.5874L76.0386 67.895H80.1463L78.6951 76.1062Z" fill="url(#paint2_linear_20061_58885)" />\n  <defs>\n    <filter id="filter0_d_20061_58885" x="0" y="0" width="160" height="160" filterUnits="userSpaceOnUse"\n      color-interpolation-filters="sRGB">\n      <feFlood flood-opacity="0" result="BackgroundImageFix" />\n      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"\n        result="hardAlpha" />\n      <feOffset dy="8" />\n      <feGaussianBlur stdDeviation="4" />\n      <feComposite in2="hardAlpha" operator="out" />\n      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />\n      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_20061_58885" />\n      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_20061_58885" result="shape" />\n    </filter>\n    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">\n      <use xlink:href="#image0_20061_58885" transform="scale(0.00384615)" />\n    </pattern>\n    <linearGradient id="paint0_linear_20061_58885" x1="80" y1="-9" x2="80" y2="150" gradientUnits="userSpaceOnUse">\n      <stop stop-color="#4282EC" />\n      <stop offset="1" stop-color="#0052D9" />\n    </linearGradient>\n    <linearGradient id="paint1_linear_20061_58885" x1="76.3901" y1="65.8412" x2="87.3297" y2="67.8103"\n      gradientUnits="userSpaceOnUse">\n      <stop offset="0.03" stop-color="#E9FFFF" />\n      <stop offset="0.17" stop-color="#C4FAC9" />\n      <stop offset="0.33" stop-color="#A0F694" />\n      <stop offset="0.48" stop-color="#82F269" />\n      <stop offset="0.63" stop-color="#6AEF47" />\n      <stop offset="0.76" stop-color="#5AED2F" />\n      <stop offset="0.89" stop-color="#4FEB20" />\n      <stop offset="1" stop-color="#4CEB1B" />\n    </linearGradient>\n    <linearGradient id="paint2_linear_20061_58885" x1="78.0874" y1="67.5958" x2="78.1651" y2="75.3216"\n      gradientUnits="userSpaceOnUse">\n      <stop stop-color="#009BFF" />\n      <stop offset="0.35" stop-color="#0081FE" />\n      <stop offset="0.75" stop-color="#006AFD" />\n      <stop offset="1" stop-color="#0062FD" />\n    </linearGradient>\n    <image id="image0_20061_58885" width="260" height="260"\n      xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAEECAYAAADOCEoKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACK+SURBVHhe7dTRiiVJlizR/v+fnovSM819WBq0YuaeXkkIyNORreaRBfWv//nll19++V9+/4fwyy+//Iff/yH88ssv/+H3fwi//PLLf/j9H8Ivv/zyH/g/hH/961+fVahrNtQ2hbpbCnXNxmnbFOqiUHfLU7QZhbqv2OAvGviKQl2zobYp1N1SqGs2TtumUBeFulueos0o1H3FBn/RwFcU6poNtU2h7pZCXbNx2jaFuijU3fIUbUah7is2+IsGvqJQ12yobQp1txTqmo3TtinURaHulqdoMwp1X7HBXzTwFYW6ZkNtU6i7pVDXbJy2TaEuCnW3PEWbUaj7ig3+ooGvKNQ1G2qbQt0thbpm47RtCnVRqLvlKdqMQt1XbPAXDcQ30ftx4Yn7ZkNtPEWbcWG5f7NdfYrTt3Qf30TvxwZ/0UB8E70fF564bzbUxlO0GReW+zfb1ac4fUv38U30fmzwFw3EN9H7ceGJ+2ZDbTxFm3FhuX+zXX2K07d0H99E78cGf9FAfBO9HxeeuG821MZTtBkXlvs329WnOH1L9/FN9H5s8BcNxDfR+3HhiftmQ208RZtxYbl/s119itO3dB/fRO/HBn/RQBTqVoW6uLDcq20KdfEGy+7SLiy7apsLuo9CXbOxtEL3UahbFepig79oIAp1q0JdXFju1TaFuniDZXdpF5Zdtc0F3UehrtlYWqH7KNStCnWxwV80EIW6VaEuLiz3aptCXbzBsru0C8uu2uaC7qNQ12wsrdB9FOpWhbrY4C8aiELdqlAXF5Z7tU2hLt5g2V3ahWVXbXNB91GoazaWVug+CnWrQl1s8BcNRKFuVaiLC8u92qZQF2+w7C7twrKrtrmg+yjUNRtLK3QfhbpVoS42+IsGolC3KtTFheVebVOoizdYdpd2YdlV21zQfRTqmo2lFbqPQt2qUBcb/EUDUahbFeqiULe6oPsv21jahTd3o1DXbKhtCnVRqFsV6mKDv2ggCnWrQl0U6lYXdP9lG0u78OZuFOqaDbVNoS4KdatCXWzwFw1EoW5VqItC3eqC7r9sY2kX3tyNQl2zobYp1EWhblWoiw3+ooEo1K0KdVGoW13Q/ZdtLO3Cm7tRqGs21DaFuijUrQp1scFfNBCFulWhLgp1qwu6/7KNpV14czcKdc2G2qZQF4W6VaEuNviLBqJQtyrUxX8a+hviKdp826fQWz95ijZXhboo1K0KdbHBXzQQhbpVoS7+09DfEE/R5ts+hd76yVO0uSrURaFuVaiLDf6igSjUrQp18Z+G/oZ4ijbf9in01k+eos1VoS4KdatCXWzwFw1EoW5VqIv/NPQ3xFO0+bZPobd+8hRtrgp1UahbFepig79oIAp1q0Jd/KehvyGeos23fQq99ZOnaHNVqItC3apQFxv8RQNRqFsV6uI/Df0N8RRtvu1T6K2fPEWbq0JdFOpWhbrY4C8aiG+i9+NTnL6l+7ig+7hwet/Q7lcU6uKb6P34Jno/NviLBuKb6P34FKdv6T4u6D4unN43tPsVhbr4Jno/vonejw3+ooH4Jno/PsXpW7qPC7qPC6f3De1+RaEuvonej2+i92ODv2ggvonej09x+pbu44Lu48LpfUO7X1Goi2+i9+Ob6P3Y4C8aiG+i9+NTnL6l+7ig+7hwet/Q7lcU6uKb6P34Jno/NviLBr6iUBeFuijURaEuNn7bf3PaRqEuCnVRqItC3Vds8BcNfEWhLgp1UaiLQl1s/Lb/5rSNQl0U6qJQF4W6r9jgLxr4ikJdFOqiUBeFutj4bf/NaRuFuijURaEuCnVfscFfNPAVhboo1EWhLgp1sfHb/pvTNgp1UaiLQl0U6r5ig79o4CsKdVGoi0JdFOpi47f9N6dtFOqiUBeFuijUfcUGf9HAVxTqolAXhboo1MXGb/tvTtso1EWhLgp1Uaj7io3+y1+K/nG+4oLumzfQblOoazbUxlO0ufq38Pf8Jf8l+o/5FRd037yBdptCXbOhNp6izdW/hb/nL/kv0X/Mr7ig++YNtNsU6poNtfEUba7+Lfw9f8l/if5jfsUF3TdvoN2mUNdsqI2naHP1b+Hv+Uv+S/Qf8ysu6L55A+02hbpmQ208RZurfwvHf4n+caJQtyrU3XBB97GhtinUfdkF3ceG2sUF3TdvcLqr+9g4/mo9FoW6VaHuhgu6jw21TaHuyy7oPjbULi7ovnmD013dx8bxV+uxKNStCnU3XNB9bKhtCnVfdkH3saF2cUH3zRuc7uo+No6/Wo9FoW5VqLvhgu5jQ21TqPuyC7qPDbWLC7pv3uB0V/excfzVeiwKdatC3Q0XdB8baptC3Zdd0H1sqF1c0H3zBqe7uo+N46/WY1GoWxXqbrig+9hQ2xTqvuyC7mND7eKC7ps3ON3VfWwcf7Ueu+FT6K3mDbTbbCyt0P2qUHfDhtpm4822uaD75g2OV/RhN3wKvdW8gXabjaUVul8V6m7YUNtsvNk2F3TfvMHxij7shk+ht5o30G6zsbRC96tC3Q0bapuNN9vmgu6bNzhe0Yfd8Cn0VvMG2m02llboflWou2FDbbPxZttc0H3zBscr+rAbPoXeat5Au83G0grdrwp1N2yobTbebJsLum/egCt6LAp1TyrUNRtLu6DdKNStCnVxQfdNoS4+hd6Kp2izeQPtNm/AFT0WhbonFeqajaVd0G4U6laFurig+6ZQF59Cb8VTtNm8gXabN+CKHotC3ZMKdc3G0i5oNwp1q0JdXNB9U6iLT6G34inabN5Au80bcEWPRaHuSYW6ZmNpF7QbhbpVoS4u6L4p1MWn0FvxFG02b6Dd5g24oseiUPekQl2zsbQL2o1C3apQFxd03xTq4lPorXiKNps30G7zBlzRY1Goe1KhrtlY2gXtRqFuVaiLC7pvCnXxKfRWPEWbzRtot3kDruixGzaWdkG7TaEuvs3pN+g+Luh+cUH3P/kFlu86bZs34Ioeu2FjaRe02xTq4tucfoPu44LuFxd0/5NfYPmu07Z5A67osRs2lnZBu02hLr7N6TfoPi7ofnFB9z/5BZbvOm2bN+CKHrthY2kXtNsU6uLbnH6D7uOC7hcXdP+TX2D5rtO2eQOu6LEbNpZ2QbtNoS6+zek36D4u6H5xQfc/+QWW7zptmzfgih5rPoXeikLdDRtqm43T9oanaDMu6L65oPtmY2mF7uOX4dfpj2g+hd6KQt0NG2qbjdP2hqdoMy7ovrmg+2ZjaYXu45fh1+mPaD6F3opC3Q0bapuN0/aGp2gzLui+uaD7ZmNphe7jl+HX6Y9oPoXeikLdDRtqm43T9oanaDMu6L65oPtmY2mF7uOX4dfpj2g+hd6KQt0NG2qbjdP2hqdoMy7ovrmg+2ZjaYXu45fh1+mPaD6F3opC3Q0bapuN0/aGp2gzLui+uaD7ZmNphe7jl+HX6Y9oNtQuNtTecEH3zbc5/QbdR6FuVaiLjaVdeGp3Qd9wwwZ/0UCzoXaxofaGC7pvvs3pN+g+CnWrQl1sLO3CU7sL+oYbNviLBpoNtYsNtTdc0H3zbU6/QfdRqFsV6mJjaRee2l3QN9ywwV800GyoXWyoveGC7ptvc/oNuo9C3apQFxtLu/DU7oK+4YYN/qKBZkPtYkPtDRd033yb02/QfRTqVoW62Fjahad2F/QNN2xMf+EyLHQfhbpVoS4KdX9Coe5JhbonXdB9fIo//VYU6mJj+uplWOg+CnWrQl0U6v6EQt2TCnVPuqD7+BR/+q0o1MXG9NXLsNB9FOpWhboo1P0JhbonFeqedEH38Sn+9FtRqIuN6auXYaH7KNStCnVRqPsTCnVPKtQ96YLu41P86beiUBcb01cvw0L3UahbFeqiUPcnFOqeVKh70gXdx6f4029FoS42pq9ehoXuo1C3KtRFoe5PKNQ9qVD3pAu6j0/xp9+KQl1s8BcNRKEuPsXyltqmUPcnPEWbUahr3kC7zYbaxcabbfNt+KI+LAp18SmWt9Q2hbo/4SnajEJd8wbabTbULjbebJtvwxf1YVGoi0+xvKW2KdT9CU/RZhTqmjfQbrOhdrHxZtt8G76oD4tCXXyK5S21TaHuT3iKNqNQ17yBdpsNtYuNN9vm2/BFfVgU6uJTLG+pbQp1f8JTtBmFuuYNtNtsqF1svNk234Yv6sOiUBefYnlLbVOo+xOeos0o1DVvoN1mQ+1i4822+Tbvv/hfon+c5oLu48JyrzYKdc3GF9qF//t73nJhuVf7lI2lbdz5r/oA+uOaC7qPC8u92ijUNRtfaBe0+6QLy73ap2wsbePOf9UH0B/XXNB9XFju1Uahrtn4Qrug3SddWO7VPmVjaRt3/qs+gP645oLu48JyrzYKdc3GF9oF7T7pwnKv9ikbS9u481/1AfTHNRd0HxeWe7VRqGs2vtAuaPdJF5Z7tU/ZWNoGLzS8urDcq20KdasLuo9CXRTq4inajEJdXNB9s6F28Qvou6JQt9rgLxpYXVju1TaFutUF3UehLgp18RRtRqEuLui+2VC7+AX0XVGoW23wFw2sLiz3aptC3eqC7qNQF4W6eIo2o1AXF3TfbKhd/AL6rijUrTb4iwZWF5Z7tU2hbnVB91Goi0JdPEWbUaiLC7pvNtQufgF9VxTqVhv8RQOrC8u92qZQt7qg+yjURaEunqLNKNTFBd03G2oXv4C+Kwp1qw3+ooHVheVebVOoW13QfRTqolAXT9FmFOrigu6bDbWLX0DfFYW61cZj/xr6iKZQt3qKNpsNtatCXXNB9/EUbUahbrWxtAvL7mnbFOpi486/BtBHNIW61VO02WyoXRXqmgu6j6doMwp1q42lXVh2T9umUBcbd/41gD6iKdStnqLNZkPtqlDXXNB9PEWbUahbbSztwrJ72jaFuti4868B9BFNoW71FG02G2pXhbrmgu7jKdqMQt1qY2kXlt3TtinUxcadfw2gj2gKdaunaLPZULsq1DUXdB9P0WYU6lYbS7uw7J62TaEuNviLBpoLum8u6D4KdVGoazbURqEuLiz3aptCXXwKvbV6ijbjgu6bp2gzNviLBpoLum8u6D4KdVGoazbURqEuLiz3aptCXXwKvbV6ijbjgu6bp2gzNviLBpoLum8u6D4KdVGoazbURqEuLiz3aptCXXwKvbV6ijbjgu6bp2gzNviLBpoLum8u6D4KdVGoazbURqEuLiz3aptCXXwKvbV6ijbjgu6bp2gzNviLBpoLum8u6D4KdVGoazbURqEuLiz3aptCXXwKvbV6ijbjgu6bp2gzNviLBpoLum8u6D4KdVGoazbURqEuLiz3aptCXXwKvbV6ijbjgu6bp2gzNviLBpoLun/SN9H78Qba/Ztd0cYNhbonXTi9D7zQcHNB90/6Jno/3kC7f7Mr2rihUPekC6f3gRcabi7o/knfRO/HG2j3b3ZFGzcU6p504fQ+8ELDzQXdP+mb6P14A+3+za5o44ZC3ZMunN4HXmi4uaD7J30TvR9voN2/2RVt3FCoe9KF0/swXejBplAXT9Fms6G2eQPtPuUNlt0327jwxH08RZtRqFttTH+JhptCXTxFm82G2uYNtPuUN1h232zjwhP38RRtRqFutTH9JRpuCnXxFG02G2qbN9DuU95g2X2zjQtP3MdTtBmFutXG9JdouCnUxVO02Wyobd5Au095g2X3zTYuPHEfT9FmFOpWG9NfouGmUBdP0WazobZ5A+0+5Q2W3Tfbn3rxfzf/vwu6j6doMwp1q43pL9FwU6iLp2iz2VDbvIF2n/IGy+6bbVx44j6eos0o1K02pr9kGkbbFOqiUHfDhtpmQ21TqGs23mwXG2pXhboo1EWhLgp1zYbaZqP/AqZhtE2hLgp1N2yobTbUNoW6ZuPNdrGhdlWoi0JdFOqiUNdsqG02+i9gGkbbFOqiUHfDhtpmQ21TqGs23mwXG2pXhboo1EWhLgp1zYbaZqP/AqZhtE2hLgp1N2yobTbUNoW6ZuPNdrGhdlWoi0JdFOqiUNdsqG02+i9gGkbbFOqiUHfDhtpmQ21TqGs23mwXG2pXhboo1EWhLgp1zYbaZqP/ApZhoft4ijajUBeFungD7S42lnbhzd1m47S94SnajKdoMzamF5dhoft4ijajUBeFungD7S42lnbhzd1m47S94SnajKdoMzamF5dhoft4ijajUBeFungD7S42lnbhzd1m47S94SnajKdoMzamF5dhoft4ijajUBeFungD7S42lnbhzd1m47S94SnajKdoMzamF5dhoft4ijajUBeFungD7S42lnbhzd1m47S94SnajKdoMzamF5dhoft4ijajUBeFungD7S42lnbhzd1m47S94SnajKdoMzamFzX8T3NB93FB91Goiwu6f8qG2uZT6K1Voe5JT9FmbEwvavif5oLu44Luo1AXF3T/lA21zafQW6tC3ZOeos3YmF7U8D/NBd3HBd1HoS4u6P4pG2qbT6G3VoW6Jz1Fm7Exvajhf5oLuo8Luo9CXVzQ/VM21DafQm+tCnVPeoo2Y2N6UcP/NBd0Hxd0H4W6uKD7p2yobT6F3loV6p70FG3GBn/RQPNtlm9Q2xTqmg21N2yctk2hbnVB982G2ubC6f0NbnwDLzTcfJvlG9Q2hbpmQ+0NG6dtU6hbXdB9s6G2uXB6f4Mb38ALDTffZvkGtU2hrtlQe8PGadsU6lYXdN9sqG0unN7f4MY38ELDzbdZvkFtU6hrNtTesHHaNoW61QXdNxtqmwun9ze48Q280HDzbZZvUNsU6poNtTdsnLZNoW51QffNhtrmwun9DW58Ay803Hyb5RvUNoW6ZkPtDRunbVOoW13QfbOhtrlwen+DG9/ACw03F3T/pEJd/DJPfe+yq3ZxQfc/KdTdcEH3UahbFepig79ooLmg+ycV6uKXeep7l121iwu6/0mh7oYLuo9C3apQFxv8RQPNBd0/qVAXv8xT37vsql1c0P1PCnU3XNB9FOpWhbrY4C8aaC7o/kmFuvhlnvreZVft4oLuf1Kou+GC7qNQtyrUxQZ/0UBzQfdPKtTFL/PU9y67ahcXdP+TQt0NF3QfhbpVoS42+IsGmg21i42vtm/bUNsU6qJQF4W61YbaplDXXND9DRd0Hxv8RQPNhtrFxlfbt22obQp1UaiLQt1qQ21TqGsu6P6GC7qPDf6igWZD7WLjq+3bNtQ2hboo1EWhbrWhtinUNRd0f8MF3ccGf9FAs6F2sfHV9m0baptCXRTqolC32lDbFOqaC7q/4YLuY4O/aKDZULvY+Gr7tg21TaEuCnVRqFttqG0Kdc0F3d9wQfexwV800GyoXWx8tX3bhtqmUBeFuijUrTbUNoW65oLub7ig+9jgLxqIC7pvCnWrQl08RZtxQfdRqIsLy/1p2xTq4g2W3S+0QvdRqIsN/qKBuKD7plC3KtTFU7QZF3Qfhbq4sNyftk2hLt5g2f1CK3QfhbrY4C8aiAu6bwp1q0JdPEWbcUH3UaiLC8v9adsU6uINlt0vtEL3UaiLDf6igbig+6ZQtyrUxVO0GRd0H4W6uLDcn7ZNoS7eYNn9Qit0H4W62OAvGogLum8KdatCXTxFm3FB91GoiwvL/WnbFOriDZbdL7RC91Goi43pS5bhN9F3rQp1Uaj7yQXdN4W6KNTdsLG0b7N8m9rmwnK/tI3p4saDT6DvWhXqolD3kwu6bwp1Uai7YWNp32b5NrXNheV+aRvTxY0Hn0DftSrURaHuJxd03xTqolB3w8bSvs3ybWqbC8v90jamixsPPoG+a1Woi0LdTy7ovinURaHuho2lfZvl29Q2F5b7pW1MFzcefAJ916pQF4W6n1zQfVOoi0LdDRtL+zbLt6ltLiz3S9uYLm48+AT6rlWhLgp1P7mg+6ZQF4W6GzaW9m2Wb1PbXFjul7bBCw3fsKH2hgtP3P+kUNf8MvreJxXq4oLum0JdFOpWhbrY4C8auGFD7Q0Xnrj/SaGu+WX0vU8q1MUF3TeFuijUrQp1scFfNHDDhtobLjxx/5NCXfPL6HufVKiLC7pvCnVRqFsV6mKDv2jghg21N1x44v4nhbrml9H3PqlQFxd03xTqolC3KtTFBn/RwA0bam+48MT9Twp1zS+j731SoS4u6L4p1EWhblWoiw3+ooEbNtTecOGJ+58U6ppfRt/7pEJdXNB9U6iLQt2qUBcb27/QB9Afd8O3eeobtHvDBd03hbqfPEWbq0+htxZXnvtLHkJ/9A3f5qlv0O4NF3TfFOp+8hRtrj6F3lpcee4veQj90Td8m6e+Qbs3XNB9U6j7yVO0ufoUemtx5bm/5CH0R9/wbZ76Bu3ecEH3TaHuJ0/R5upT6K3Flef+kofQH33Dt3nqG7R7wwXdN4W6nzxFm6tPobcWV3ih4SjURaEuCnXxKfTWYkNtFOriU5y+pfsnXdB98yn01uqC7psN/qKBKNRFoS4KdfEp9NZiQ20U6uJTnL6l+ydd0H3zKfTW6oLumw3+ooEo1EWhLgp18Sn01mJDbRTq4lOcvqX7J13QffMp9Nbqgu6bDf6igSjURaEuCnXxKfTWYkNtFOriU5y+pfsnXdB98yn01uqC7psN/qKBKNRFoS4KdfEp9NZiQ20U6uJTnL6l+ydd0H3zKfTW6oLumw3+ooEo1EWhLgp18Sn01mJDbRTq4lOcvqX7J13QffMp9Nbqgu6bjenFZXjhzd3mwnKvdvUp9FZTqGs21N7wBqe7um/eQLvNxvQly/DCm7vNheVe7epT6K2mUNdsqL3hDU53dd+8gXabjelLluGFN3ebC8u92tWn0FtNoa7ZUHvDG5zu6r55A+02G9OXLMMLb+42F5Z7tatPobeaQl2zofaGNzjd1X3zBtptNqYvWYYX3txtLiz3alefQm81hbpmQ+0Nb3C6q/vmDbTbbNz5kv8SfVgU6laFurhweh+00RTqmjc43dV9FOpiQ21zQfdNoa65oPvVxvYlh+jDolC3KtTFhdP7oI2mUNe8wemu7qNQFxtqmwu6bwp1zQXdrza2LzlEHxaFulWhLi6c3gdtNIW65g1Od3UfhbrYUNtc0H1TqGsu6H61sX3JIfqwKNStCnVx4fQ+aKMp1DVvcLqr+yjUxYba5oLum0Jdc0H3q43tSw7Rh0WhblWoiwun90EbTaGueYPTXd1HoS421DYXdN8U6poLul9tbF9yiD4sCnWrQl1cOL0P2mgKdc0bnO7qPgp1saG2uaD7plDXXND9amP6Eg3f8BRtNr+Cvu0pG0u7sOwubUMbiwu6v+FT6K3YmL5Ewzc8RZvNr6Bve8rG0i4su0vb0Mbigu5v+BR6KzamL9HwDU/RZvMr6NuesrG0C8vu0ja0sbig+xs+hd6KjelLNHzDU7TZ/Ar6tqdsLO3Csru0DW0sLuj+hk+ht2Jj+hIN3/AUbTa/gr7tKRtLu7DsLm1DG4sLur/hU+it2OAvGogLum8KdVGoi19A3/W3eAPtrgp18RRtvm1jaRu80HBc0H1TqItCXfwC+q6/xRtod1Woi6do820bS9vghYbjgu6bQl0U6uIX0Hf9Ld5Au6tCXTxFm2/bWNoGLzQcF3TfFOqiUBe/gL7rb/EG2l0V6uIp2nzbxtI2eKHhuKD7plAXhbr4BfRdf4s30O6qUBdP0ebbNpa2wQsNxwXdN4W6KNTFL6Dv+lu8gXZXhbp4ijbftrG0jTv/Vf8w+odoPoXeWm081S6c7uo+CnU/+SZ6P56izWZDbbPx7r/mQ+gPbj6F3lptPNUunO7qPgp1P/kmej+eos1mQ22z8e6/5kPoD24+hd5abTzVLpzu6j4KdT/5Jno/nqLNZkNts/Huv+ZD6A9uPoXeWm081S6c7uo+CnU/+SZ6P56izWZDbbPx7r/mQ+gPbj6F3lptPNUunO7qPgp1P/kmej+eos1mQ22zwV808BUXlnu1iw21UaiLQl2zcdouNpZ2QbvxFG1GoS4Kdc2G2maDv2jgKy4s92oXG2qjUBeFumbjtF1sLO2CduMp2oxCXRTqmg21zQZ/0cBXXFju1S421EahLgp1zcZpu9hY2gXtxlO0GYW6KNQ1G2qbDf6iga+4sNyrXWyojUJdFOqajdN2sbG0C9qNp2gzCnVRqGs21DYb/EUDX3FhuVe72FAbhboo1DUbp+1iY2kXtBtP0WYU6qJQ12yobTb4iwa+4sJyr3axoTYKdVGoazZO28XG0i5oN56izSjURaGu2VDbbPAXDcQ30ftRqGu+jb4hCnVRqGveQLtNoS4KdU+6oPt4ijbjKdqMDf6igfgmej8Kdc230TdEoS4Kdc0baLcp1EWh7kkXdB9P0WY8RZuxwV80EN9E70ehrvk2+oYo1EWhrnkD7TaFuijUPemC7uMp2oynaDM2+IsG4pvo/SjUNd9G3xCFuijUNW+g3aZQF4W6J13QfTxFm/EUbcYGf9FAfBO9H4W65tvoG6JQF4W65g202xTqolD3pAu6j6doM56izdjgLxqIQt2qUBeFuuaC7uOC7puN0/YLPoneawp1Uah70rfhi/qwKNStCnVRqGsu6D4u6L7ZOG2/4JPovaZQF4W6J30bvqgPi0LdqlAXhbrmgu7jgu6bjdP2Cz6J3msKdVGoe9K34Yv6sCjUrQp1UahrLug+Lui+2Thtv+CT6L2mUBeFuid9G76oD4tC3apQF4W65oLu44Lum43T9gs+id5rCnVRqHvSt+GL+rAo1K0KdVGoay7oPi7ovtk4bb/gk+i9plAXhbonfRu+qA+LQt2qUBdP0eaqUPeTQl08RZvxFG3GU7QZG2oXG2oX30bf0GzwFw1EoW5VqIunaHNVqPtJoS6eos14ijbjKdqMDbWLDbWLb6NvaDb4iwaiULcq1MVTtLkq1P2kUBdP0WY8RZvxFG3GhtrFhtrFt9E3NBv8RQNRqFsV6uIp2lwV6n5SqIunaDOeos14ijZjQ+1iQ+3i2+gbmg3+ooEo1K0KdfEUba4KdT8p1MVTtBlP0WY8RZuxoXaxoXbxbfQNzQZ/0UAU6laFuijUNRd0v9pQ2zxFm/EplrfU3nBB91GoazaeaoXuY4O/aCAKdatCXRTqmgu6X22obZ6izfgUy1tqb7ig+yjUNRtPtUL3scFfNBCFulWhLgp1zQXdrzbUNk/RZnyK5S21N1zQfRTqmo2nWqH72OAvGohC3apQF4W65oLuVxtqm6doMz7F8pbaGy7oPgp1zcZTrdB9bPAXDUShblWoi0Jdc0H3qw21zVO0GZ9ieUvtDRd0H4W6ZuOpVug+NviLBqJQtyrURaGuuaD71Yba5inajE+xvKX2hgu6j0Jds/FUK3QfG/xFA/FN9H48RZs3bKhdXXjivtk4bZsNtYuNv7lt8ELD8U30fjxFmzdsqF1deOK+2Thtmw21i42/uW3wQsPxTfR+PEWbN2yoXV144r7ZOG2bDbWLjb+5bfBCw/FN9H48RZs3bKhdXXjivtk4bZsNtYuNv7lt8ELD8U30fjxFmzdsqF1deOK+2Thtmw21i42/uW3wQsNfcUH3T9lQG4W6KNQ1F3QfF5b70zYKdc2G2sUF3ccF3Tcb/EUDX3FB90/ZUBuFuijUNRd0HxeW+9M2CnXNhtrFBd3HBd03G/xFA19xQfdP2VAbhboo1DUXdB8XlvvTNgp1zYbaxQXdxwXdNxv8RQNfcUH3T9lQG4W6KNQ1F3QfF5b707b1//fbf2ND7eKC7uOC7psN/qKBr7ig+6dsqI1CXRTqmgu6jwvL/WkbhbpmQ+3igu7jgu6bDf6iga+4oPunbKiNQl0U6poLuo8Ly/1pG4W6ZkPt4oLu44Lum43txV9++eWv5vd/CL/88st/+P0fwi+//PIffv+H8Msvv/yH3/8h/PLLL//h938Iv/zyy//yP//z/wBvuQIOwkCgXwAAAABJRU5ErkJggg==" />\n  </defs>\n</svg>';
const footerLinks = getFooterConfig();
const locale = getLocale();
define$2({
  tag: "td-doc-footer",
  mobileBodyStyle,
  platform: "web",
  patchDom: {
    get: (_host, lastValue) => lastValue || false,
    set: (_host, value2) => value2,
    connect: patchShadowDomIntoDom
  },
  render: (host) => {
    const mobileBodyStyle2 = { ...host.mobileBodyStyle };
    return html`
      <div class="TDesign-doc-footer" style="${mobileBodyStyle2}">
        <div class="TDesign-doc-footer__inner">
          <div class="TDesign-doc-footer__content">
            <div class="TDesign-doc-footer__qrcode">
              <i innerHTML="${qrcodeIcon$1}"></i>
              <h4 class="TDesign-doc-footer__qrcode-title">${locale.footer.weComGroup}</h4>
              <p class="TDesign-doc-footer__qrcode-desc">${locale.footer.weComGroupDesc}</p>
            </div>

            ${footerLinks.map((item) => html`
              <div class="TDesign-doc-footer__content-block">
                <p class="title">${item.title}</p>
                ${item.links.map((link) => html`
                  <a class="link" href="${link.url}" target="${link.target}">
                    <span>${link.name}</span>
                  </a>
                `)}
              </div>
            `)}
          </div>
        </div>
      </div>
      <div class="TDesign-doc-footer__bottom" style="${mobileBodyStyle2}">
        <div class="TDesign-doc-footer__inner">
          <p class="copyright">Copyright &copy; 1998 - 2023 Tencent. All Rights Reserved. ${locale.footer.copyright}</p>
          <div class="TDesign-doc-footer__logos">
            <i class="logo" innerHTML="${committeeIcon}"></i>
            <a class="logo" href="https://cloud.tencent.com/" target="_blank" innerHTML="${tencentCloudIcon}"></a>
          </div>
        </div>
      </div>
    `.css`${style$f}`;
  }
});
var style$e = ".TDesign-doc-popup{flex-shrink:0;box-sizing:border-box}\n";
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style2 = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style2);
    Object.keys(attributes).forEach(function(name2) {
      var value2 = attributes[name2];
      if (value2 === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value2 === true ? "" : value2);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style2 = styleProperties.reduce(function(style3, property) {
        style3[property] = "";
        return style3;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style2);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle$1(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value2, max$1) {
  return max(min$1, min(value2, max$1));
}
function withinMaxClamp(min2, value2, max2) {
  var v = within(min2, value2, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value2, keys) {
  return keys.reduce(function(hashMap, key2) {
    hashMap[key2] = value2;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html2 = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html2.clientWidth;
  var height = html2.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html2 = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html2.scrollWidth, html2.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html2.scrollHeight, html2.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle$1(body || html2).direction === "rtl") {
    x += max(html2.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key2) {
      var multiply = [right, bottom].indexOf(key2) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key2) >= 0 ? "y" : "x";
      overflowOffsets[key2] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max$1 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve2) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve2(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key2) {
    return merged[key2];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve2) {
          instance.forceUpdate();
          resolve2(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
function handleMouseEvent(host, type) {
  if (host.triggerType !== "hover")
    return;
  if (type === "enter") {
    host.visible = true;
  } else {
    host.visible = false;
  }
  dispatch$1(host, "visible-change", { detail: { visible: host.visible } });
}
function handleClick(host, e) {
  if (host.triggerType !== "click")
    return;
  host.visible = !host.visible;
  dispatch$1(host, "visible-change", { detail: { visible: host.visible } });
}
define$2({
  tag: "td-doc-popup",
  reference: ({ render: render3 }) => render3().querySelector(".TDesign-doc-popup"),
  portalClass: "",
  portalStyle: "",
  placement: "bottom-end",
  triggerType: "hover",
  visible: {
    get: (host, lastValue) => lastValue || false,
    set: (host, value2) => value2,
    connect: (host) => {
      const { reference: reference2, placement } = host;
      requestAnimationFrame(() => {
        host.portals = document.getElementById("__td_portals__");
        if (!host.portals) {
          host.portals = document.createElement("div");
          host.portals.id = "__td_portals__";
          document.body.appendChild(host.portals);
        }
        const contentSlot = host.querySelector('[slot="content"]');
        const portalStyleStr = `<style>${host.portalStyle}</style>`;
        host.portal = document.createElement("td-portal");
        host.portal.className = host.portalClass;
        host.portal.innerHTML = portalStyleStr;
        host.portal.appendChild(contentSlot);
        host.portal.addEventListener("click", (e) => handleClick(host));
        host.portal.addEventListener("mouseenter", () => handleMouseEvent(host, "enter"));
        host.portal.addEventListener("mouseleave", () => handleMouseEvent(host, "leave"));
        host.portals.appendChild(host.portal);
        requestAnimationFrame(() => {
          const isVertical = ["top", "bottom"].some((p) => placement.includes(p));
          host.popper = createPopper(reference2, host.portal, {
            placement,
            modifiers: [
              { name: "offset", options: { offset: isVertical ? [0, 8] : [0, 16] } }
            ]
          });
          if (isVertical)
            host.popper.state.styles.popper.minWidth = `${reference2.offsetWidth}px`;
        });
      });
      function clickOutside(e) {
        var _a;
        const eventPath = ((_a = e.composedPath) == null ? void 0 : _a.call(e)) || e.path || [];
        if (!reference2 || host.contains(eventPath[0]))
          return;
        host.visible = false;
        dispatch$1(host, "visible-change", { detail: { visible: host.visible } });
      }
      document.addEventListener("click", clickOutside);
      return () => {
        var _a, _b;
        (_b = (_a = host.portals) == null ? void 0 : _a.removeChild) == null ? void 0 : _b.call(_a, host.portal);
        document.removeEventListener("click", clickOutside);
      };
    },
    observe: (host, value2) => {
      var _a, _b;
      if (!host.portal)
        return;
      host.portal.visible = value2;
      (_b = (_a = host.popper) == null ? void 0 : _a.update) == null ? void 0 : _b.call(_a);
    }
  },
  render: (host) => {
    const { placement } = host;
    return html`
      <div
        class="TDesign-doc-popup"
        data-placement="${placement}"
        onclick="${handleClick}"
        onmouseenter="${(host2) => handleMouseEvent(host2, "enter")}"
        onmouseleave="${(host2) => handleMouseEvent(host2, "leave")}"
      >
        <slot></slot>
      </div>
    `.css`${style$e}`;
  }
});
var style$d = ".TDesign-doc-badge{position:relative;z-index:500}\n";
function getColor(message) {
  const percentage = message && parseFloat(message);
  if (percentage >= 90) {
    return "brightgreen";
  }
  if (percentage >= 70) {
    return "yellow";
  }
  return "red";
}
define$2({
  tag: "td-doc-badge",
  label: "coverage",
  message: "0%",
  color: "",
  render: (host) => {
    const { label, message, color: defaultColor } = host;
    let color = defaultColor;
    if (!color)
      color = getColor(message);
    const badgeUrl = encodeURI(`https://img.shields.io/badge/${label}-${message}-${color}`);
    return html`
      <img class="TDesign-doc-badge" src="${badgeUrl}" />
    `.css`${style$d}`;
  }
});
var browser = {};
var canPromise$1 = function() {
  return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
};
var qrcode = {};
var utils$1 = {};
let toSJISFunction;
const CODEWORDS_COUNT = [
  0,
  26,
  44,
  70,
  100,
  134,
  172,
  196,
  242,
  292,
  346,
  404,
  466,
  532,
  581,
  655,
  733,
  815,
  901,
  991,
  1085,
  1156,
  1258,
  1364,
  1474,
  1588,
  1706,
  1828,
  1921,
  2051,
  2185,
  2323,
  2465,
  2611,
  2761,
  2876,
  3034,
  3196,
  3362,
  3532,
  3706
];
utils$1.getSymbolSize = function getSymbolSize(version2) {
  if (!version2)
    throw new Error('"version" cannot be null or undefined');
  if (version2 < 1 || version2 > 40)
    throw new Error('"version" should be in range from 1 to 40');
  return version2 * 4 + 17;
};
utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords(version2) {
  return CODEWORDS_COUNT[version2];
};
utils$1.getBCHDigit = function(data) {
  let digit = 0;
  while (data !== 0) {
    digit++;
    data >>>= 1;
  }
  return digit;
};
utils$1.setToSJISFunction = function setToSJISFunction(f) {
  if (typeof f !== "function") {
    throw new Error('"toSJISFunc" is not a valid function.');
  }
  toSJISFunction = f;
};
utils$1.isKanjiModeEnabled = function() {
  return typeof toSJISFunction !== "undefined";
};
utils$1.toSJIS = function toSJIS(kanji2) {
  return toSJISFunction(kanji2);
};
var errorCorrectionLevel = {};
(function(exports2) {
  exports2.L = { bit: 1 };
  exports2.M = { bit: 0 };
  exports2.Q = { bit: 3 };
  exports2.H = { bit: 2 };
  function fromString(string2) {
    if (typeof string2 !== "string") {
      throw new Error("Param is not a string");
    }
    const lcStr = string2.toLowerCase();
    switch (lcStr) {
      case "l":
      case "low":
        return exports2.L;
      case "m":
      case "medium":
        return exports2.M;
      case "q":
      case "quartile":
        return exports2.Q;
      case "h":
      case "high":
        return exports2.H;
      default:
        throw new Error("Unknown EC Level: " + string2);
    }
  }
  exports2.isValid = function isValid2(level) {
    return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
  };
  exports2.from = function from2(value2, defaultValue) {
    if (exports2.isValid(value2)) {
      return value2;
    }
    try {
      return fromString(value2);
    } catch (e) {
      return defaultValue;
    }
  };
})(errorCorrectionLevel);
function BitBuffer$1() {
  this.buffer = [];
  this.length = 0;
}
BitBuffer$1.prototype = {
  get: function(index) {
    const bufIndex = Math.floor(index / 8);
    return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
  },
  put: function(num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit((num >>> length - i - 1 & 1) === 1);
    }
  },
  getLengthInBits: function() {
    return this.length;
  },
  putBit: function(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 128 >>> this.length % 8;
    }
    this.length++;
  }
};
var bitBuffer = BitBuffer$1;
function BitMatrix$1(size) {
  if (!size || size < 1) {
    throw new Error("BitMatrix size must be defined and greater than 0");
  }
  this.size = size;
  this.data = new Uint8Array(size * size);
  this.reservedBit = new Uint8Array(size * size);
}
BitMatrix$1.prototype.set = function(row, col, value2, reserved) {
  const index = row * this.size + col;
  this.data[index] = value2;
  if (reserved)
    this.reservedBit[index] = true;
};
BitMatrix$1.prototype.get = function(row, col) {
  return this.data[row * this.size + col];
};
BitMatrix$1.prototype.xor = function(row, col, value2) {
  this.data[row * this.size + col] ^= value2;
};
BitMatrix$1.prototype.isReserved = function(row, col) {
  return this.reservedBit[row * this.size + col];
};
var bitMatrix = BitMatrix$1;
var alignmentPattern = {};
(function(exports2) {
  const getSymbolSize3 = utils$1.getSymbolSize;
  exports2.getRowColCoords = function getRowColCoords(version2) {
    if (version2 === 1)
      return [];
    const posCount = Math.floor(version2 / 7) + 2;
    const size = getSymbolSize3(version2);
    const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
    const positions = [size - 7];
    for (let i = 1; i < posCount - 1; i++) {
      positions[i] = positions[i - 1] - intervals;
    }
    positions.push(6);
    return positions.reverse();
  };
  exports2.getPositions = function getPositions2(version2) {
    const coords = [];
    const pos = exports2.getRowColCoords(version2);
    const posLength = pos.length;
    for (let i = 0; i < posLength; i++) {
      for (let j = 0; j < posLength; j++) {
        if (i === 0 && j === 0 || i === 0 && j === posLength - 1 || i === posLength - 1 && j === 0) {
          continue;
        }
        coords.push([pos[i], pos[j]]);
      }
    }
    return coords;
  };
})(alignmentPattern);
var finderPattern = {};
const getSymbolSize2 = utils$1.getSymbolSize;
const FINDER_PATTERN_SIZE = 7;
finderPattern.getPositions = function getPositions(version2) {
  const size = getSymbolSize2(version2);
  return [
    [0, 0],
    [size - FINDER_PATTERN_SIZE, 0],
    [0, size - FINDER_PATTERN_SIZE]
  ];
};
var maskPattern = {};
(function(exports2) {
  exports2.Patterns = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  const PenaltyScores = {
    N1: 3,
    N2: 3,
    N3: 40,
    N4: 10
  };
  exports2.isValid = function isValid2(mask) {
    return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
  };
  exports2.from = function from2(value2) {
    return exports2.isValid(value2) ? parseInt(value2, 10) : void 0;
  };
  exports2.getPenaltyN1 = function getPenaltyN1(data) {
    const size = data.size;
    let points = 0;
    let sameCountCol = 0;
    let sameCountRow = 0;
    let lastCol = null;
    let lastRow = null;
    for (let row = 0; row < size; row++) {
      sameCountCol = sameCountRow = 0;
      lastCol = lastRow = null;
      for (let col = 0; col < size; col++) {
        let module2 = data.get(row, col);
        if (module2 === lastCol) {
          sameCountCol++;
        } else {
          if (sameCountCol >= 5)
            points += PenaltyScores.N1 + (sameCountCol - 5);
          lastCol = module2;
          sameCountCol = 1;
        }
        module2 = data.get(col, row);
        if (module2 === lastRow) {
          sameCountRow++;
        } else {
          if (sameCountRow >= 5)
            points += PenaltyScores.N1 + (sameCountRow - 5);
          lastRow = module2;
          sameCountRow = 1;
        }
      }
      if (sameCountCol >= 5)
        points += PenaltyScores.N1 + (sameCountCol - 5);
      if (sameCountRow >= 5)
        points += PenaltyScores.N1 + (sameCountRow - 5);
    }
    return points;
  };
  exports2.getPenaltyN2 = function getPenaltyN2(data) {
    const size = data.size;
    let points = 0;
    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size - 1; col++) {
        const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
        if (last === 4 || last === 0)
          points++;
      }
    }
    return points * PenaltyScores.N2;
  };
  exports2.getPenaltyN3 = function getPenaltyN3(data) {
    const size = data.size;
    let points = 0;
    let bitsCol = 0;
    let bitsRow = 0;
    for (let row = 0; row < size; row++) {
      bitsCol = bitsRow = 0;
      for (let col = 0; col < size; col++) {
        bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
        if (col >= 10 && (bitsCol === 1488 || bitsCol === 93))
          points++;
        bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
        if (col >= 10 && (bitsRow === 1488 || bitsRow === 93))
          points++;
      }
    }
    return points * PenaltyScores.N3;
  };
  exports2.getPenaltyN4 = function getPenaltyN4(data) {
    let darkCount = 0;
    const modulesCount = data.data.length;
    for (let i = 0; i < modulesCount; i++)
      darkCount += data.data[i];
    const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
    return k * PenaltyScores.N4;
  };
  function getMaskAt(maskPattern2, i, j) {
    switch (maskPattern2) {
      case exports2.Patterns.PATTERN000:
        return (i + j) % 2 === 0;
      case exports2.Patterns.PATTERN001:
        return i % 2 === 0;
      case exports2.Patterns.PATTERN010:
        return j % 3 === 0;
      case exports2.Patterns.PATTERN011:
        return (i + j) % 3 === 0;
      case exports2.Patterns.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case exports2.Patterns.PATTERN101:
        return i * j % 2 + i * j % 3 === 0;
      case exports2.Patterns.PATTERN110:
        return (i * j % 2 + i * j % 3) % 2 === 0;
      case exports2.Patterns.PATTERN111:
        return (i * j % 3 + (i + j) % 2) % 2 === 0;
      default:
        throw new Error("bad maskPattern:" + maskPattern2);
    }
  }
  exports2.applyMask = function applyMask(pattern, data) {
    const size = data.size;
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size; row++) {
        if (data.isReserved(row, col))
          continue;
        data.xor(row, col, getMaskAt(pattern, row, col));
      }
    }
  };
  exports2.getBestMask = function getBestMask(data, setupFormatFunc) {
    const numPatterns = Object.keys(exports2.Patterns).length;
    let bestPattern = 0;
    let lowerPenalty = Infinity;
    for (let p = 0; p < numPatterns; p++) {
      setupFormatFunc(p);
      exports2.applyMask(p, data);
      const penalty = exports2.getPenaltyN1(data) + exports2.getPenaltyN2(data) + exports2.getPenaltyN3(data) + exports2.getPenaltyN4(data);
      exports2.applyMask(p, data);
      if (penalty < lowerPenalty) {
        lowerPenalty = penalty;
        bestPattern = p;
      }
    }
    return bestPattern;
  };
})(maskPattern);
var errorCorrectionCode = {};
const ECLevel$1 = errorCorrectionLevel;
const EC_BLOCKS_TABLE = [
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  1,
  2,
  2,
  4,
  1,
  2,
  4,
  4,
  2,
  4,
  4,
  4,
  2,
  4,
  6,
  5,
  2,
  4,
  6,
  6,
  2,
  5,
  8,
  8,
  4,
  5,
  8,
  8,
  4,
  5,
  8,
  11,
  4,
  8,
  10,
  11,
  4,
  9,
  12,
  16,
  4,
  9,
  16,
  16,
  6,
  10,
  12,
  18,
  6,
  10,
  17,
  16,
  6,
  11,
  16,
  19,
  6,
  13,
  18,
  21,
  7,
  14,
  21,
  25,
  8,
  16,
  20,
  25,
  8,
  17,
  23,
  25,
  9,
  17,
  23,
  34,
  9,
  18,
  25,
  30,
  10,
  20,
  27,
  32,
  12,
  21,
  29,
  35,
  12,
  23,
  34,
  37,
  12,
  25,
  34,
  40,
  13,
  26,
  35,
  42,
  14,
  28,
  38,
  45,
  15,
  29,
  40,
  48,
  16,
  31,
  43,
  51,
  17,
  33,
  45,
  54,
  18,
  35,
  48,
  57,
  19,
  37,
  51,
  60,
  19,
  38,
  53,
  63,
  20,
  40,
  56,
  66,
  21,
  43,
  59,
  70,
  22,
  45,
  62,
  74,
  24,
  47,
  65,
  77,
  25,
  49,
  68,
  81
];
const EC_CODEWORDS_TABLE = [
  7,
  10,
  13,
  17,
  10,
  16,
  22,
  28,
  15,
  26,
  36,
  44,
  20,
  36,
  52,
  64,
  26,
  48,
  72,
  88,
  36,
  64,
  96,
  112,
  40,
  72,
  108,
  130,
  48,
  88,
  132,
  156,
  60,
  110,
  160,
  192,
  72,
  130,
  192,
  224,
  80,
  150,
  224,
  264,
  96,
  176,
  260,
  308,
  104,
  198,
  288,
  352,
  120,
  216,
  320,
  384,
  132,
  240,
  360,
  432,
  144,
  280,
  408,
  480,
  168,
  308,
  448,
  532,
  180,
  338,
  504,
  588,
  196,
  364,
  546,
  650,
  224,
  416,
  600,
  700,
  224,
  442,
  644,
  750,
  252,
  476,
  690,
  816,
  270,
  504,
  750,
  900,
  300,
  560,
  810,
  960,
  312,
  588,
  870,
  1050,
  336,
  644,
  952,
  1110,
  360,
  700,
  1020,
  1200,
  390,
  728,
  1050,
  1260,
  420,
  784,
  1140,
  1350,
  450,
  812,
  1200,
  1440,
  480,
  868,
  1290,
  1530,
  510,
  924,
  1350,
  1620,
  540,
  980,
  1440,
  1710,
  570,
  1036,
  1530,
  1800,
  570,
  1064,
  1590,
  1890,
  600,
  1120,
  1680,
  1980,
  630,
  1204,
  1770,
  2100,
  660,
  1260,
  1860,
  2220,
  720,
  1316,
  1950,
  2310,
  750,
  1372,
  2040,
  2430
];
errorCorrectionCode.getBlocksCount = function getBlocksCount(version2, errorCorrectionLevel2) {
  switch (errorCorrectionLevel2) {
    case ECLevel$1.L:
      return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
    case ECLevel$1.M:
      return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
    case ECLevel$1.Q:
      return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
    case ECLevel$1.H:
      return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
    default:
      return void 0;
  }
};
errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount(version2, errorCorrectionLevel2) {
  switch (errorCorrectionLevel2) {
    case ECLevel$1.L:
      return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
    case ECLevel$1.M:
      return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
    case ECLevel$1.Q:
      return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
    case ECLevel$1.H:
      return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
    default:
      return void 0;
  }
};
var polynomial = {};
var galoisField = {};
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);
(function initTables() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 256) {
      x ^= 285;
    }
  }
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
})();
galoisField.log = function log(n) {
  if (n < 1)
    throw new Error("log(" + n + ")");
  return LOG_TABLE[n];
};
galoisField.exp = function exp(n) {
  return EXP_TABLE[n];
};
galoisField.mul = function mul(x, y) {
  if (x === 0 || y === 0)
    return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
};
(function(exports2) {
  const GF = galoisField;
  exports2.mul = function mul2(p1, p2) {
    const coeff = new Uint8Array(p1.length + p2.length - 1);
    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        coeff[i + j] ^= GF.mul(p1[i], p2[j]);
      }
    }
    return coeff;
  };
  exports2.mod = function mod(divident, divisor) {
    let result = new Uint8Array(divident);
    while (result.length - divisor.length >= 0) {
      const coeff = result[0];
      for (let i = 0; i < divisor.length; i++) {
        result[i] ^= GF.mul(divisor[i], coeff);
      }
      let offset2 = 0;
      while (offset2 < result.length && result[offset2] === 0)
        offset2++;
      result = result.slice(offset2);
    }
    return result;
  };
  exports2.generateECPolynomial = function generateECPolynomial(degree) {
    let poly = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
      poly = exports2.mul(poly, new Uint8Array([1, GF.exp(i)]));
    }
    return poly;
  };
})(polynomial);
const Polynomial = polynomial;
function ReedSolomonEncoder$1(degree) {
  this.genPoly = void 0;
  this.degree = degree;
  if (this.degree)
    this.initialize(this.degree);
}
ReedSolomonEncoder$1.prototype.initialize = function initialize(degree) {
  this.degree = degree;
  this.genPoly = Polynomial.generateECPolynomial(this.degree);
};
ReedSolomonEncoder$1.prototype.encode = function encode(data) {
  if (!this.genPoly) {
    throw new Error("Encoder not initialized");
  }
  const paddedData = new Uint8Array(data.length + this.degree);
  paddedData.set(data);
  const remainder = Polynomial.mod(paddedData, this.genPoly);
  const start2 = this.degree - remainder.length;
  if (start2 > 0) {
    const buff = new Uint8Array(this.degree);
    buff.set(remainder, start2);
    return buff;
  }
  return remainder;
};
var reedSolomonEncoder = ReedSolomonEncoder$1;
var version = {};
var mode = {};
var versionCheck = {};
versionCheck.isValid = function isValid(version2) {
  return !isNaN(version2) && version2 >= 1 && version2 <= 40;
};
var regex = {};
const numeric = "[0-9]+";
const alphanumeric = "[A-Z $%*+\\-./:]+";
let kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
kanji = kanji.replace(/u/g, "\\u");
const byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
regex.KANJI = new RegExp(kanji, "g");
regex.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
regex.BYTE = new RegExp(byte, "g");
regex.NUMERIC = new RegExp(numeric, "g");
regex.ALPHANUMERIC = new RegExp(alphanumeric, "g");
const TEST_KANJI = new RegExp("^" + kanji + "$");
const TEST_NUMERIC = new RegExp("^" + numeric + "$");
const TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
regex.testKanji = function testKanji(str) {
  return TEST_KANJI.test(str);
};
regex.testNumeric = function testNumeric(str) {
  return TEST_NUMERIC.test(str);
};
regex.testAlphanumeric = function testAlphanumeric(str) {
  return TEST_ALPHANUMERIC.test(str);
};
(function(exports2) {
  const VersionCheck = versionCheck;
  const Regex = regex;
  exports2.NUMERIC = {
    id: "Numeric",
    bit: 1 << 0,
    ccBits: [10, 12, 14]
  };
  exports2.ALPHANUMERIC = {
    id: "Alphanumeric",
    bit: 1 << 1,
    ccBits: [9, 11, 13]
  };
  exports2.BYTE = {
    id: "Byte",
    bit: 1 << 2,
    ccBits: [8, 16, 16]
  };
  exports2.KANJI = {
    id: "Kanji",
    bit: 1 << 3,
    ccBits: [8, 10, 12]
  };
  exports2.MIXED = {
    bit: -1
  };
  exports2.getCharCountIndicator = function getCharCountIndicator(mode2, version2) {
    if (!mode2.ccBits)
      throw new Error("Invalid mode: " + mode2);
    if (!VersionCheck.isValid(version2)) {
      throw new Error("Invalid version: " + version2);
    }
    if (version2 >= 1 && version2 < 10)
      return mode2.ccBits[0];
    else if (version2 < 27)
      return mode2.ccBits[1];
    return mode2.ccBits[2];
  };
  exports2.getBestModeForData = function getBestModeForData(dataStr) {
    if (Regex.testNumeric(dataStr))
      return exports2.NUMERIC;
    else if (Regex.testAlphanumeric(dataStr))
      return exports2.ALPHANUMERIC;
    else if (Regex.testKanji(dataStr))
      return exports2.KANJI;
    else
      return exports2.BYTE;
  };
  exports2.toString = function toString(mode2) {
    if (mode2 && mode2.id)
      return mode2.id;
    throw new Error("Invalid mode");
  };
  exports2.isValid = function isValid2(mode2) {
    return mode2 && mode2.bit && mode2.ccBits;
  };
  function fromString(string2) {
    if (typeof string2 !== "string") {
      throw new Error("Param is not a string");
    }
    const lcStr = string2.toLowerCase();
    switch (lcStr) {
      case "numeric":
        return exports2.NUMERIC;
      case "alphanumeric":
        return exports2.ALPHANUMERIC;
      case "kanji":
        return exports2.KANJI;
      case "byte":
        return exports2.BYTE;
      default:
        throw new Error("Unknown mode: " + string2);
    }
  }
  exports2.from = function from2(value2, defaultValue) {
    if (exports2.isValid(value2)) {
      return value2;
    }
    try {
      return fromString(value2);
    } catch (e) {
      return defaultValue;
    }
  };
})(mode);
(function(exports2) {
  const Utils2 = utils$1;
  const ECCode2 = errorCorrectionCode;
  const ECLevel2 = errorCorrectionLevel;
  const Mode2 = mode;
  const VersionCheck = versionCheck;
  const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  const G18_BCH = Utils2.getBCHDigit(G18);
  function getBestVersionForDataLength(mode2, length, errorCorrectionLevel2) {
    for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
      if (length <= exports2.getCapacity(currentVersion, errorCorrectionLevel2, mode2)) {
        return currentVersion;
      }
    }
    return void 0;
  }
  function getReservedBitsCount(mode2, version2) {
    return Mode2.getCharCountIndicator(mode2, version2) + 4;
  }
  function getTotalBitsFromDataArray(segments2, version2) {
    let totalBits = 0;
    segments2.forEach(function(data) {
      const reservedBits = getReservedBitsCount(data.mode, version2);
      totalBits += reservedBits + data.getBitsLength();
    });
    return totalBits;
  }
  function getBestVersionForMixedData(segments2, errorCorrectionLevel2) {
    for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
      const length = getTotalBitsFromDataArray(segments2, currentVersion);
      if (length <= exports2.getCapacity(currentVersion, errorCorrectionLevel2, Mode2.MIXED)) {
        return currentVersion;
      }
    }
    return void 0;
  }
  exports2.from = function from2(value2, defaultValue) {
    if (VersionCheck.isValid(value2)) {
      return parseInt(value2, 10);
    }
    return defaultValue;
  };
  exports2.getCapacity = function getCapacity(version2, errorCorrectionLevel2, mode2) {
    if (!VersionCheck.isValid(version2)) {
      throw new Error("Invalid QR Code version");
    }
    if (typeof mode2 === "undefined")
      mode2 = Mode2.BYTE;
    const totalCodewords = Utils2.getSymbolTotalCodewords(version2);
    const ecTotalCodewords = ECCode2.getTotalCodewordsCount(version2, errorCorrectionLevel2);
    const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
    if (mode2 === Mode2.MIXED)
      return dataTotalCodewordsBits;
    const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode2, version2);
    switch (mode2) {
      case Mode2.NUMERIC:
        return Math.floor(usableBits / 10 * 3);
      case Mode2.ALPHANUMERIC:
        return Math.floor(usableBits / 11 * 2);
      case Mode2.KANJI:
        return Math.floor(usableBits / 13);
      case Mode2.BYTE:
      default:
        return Math.floor(usableBits / 8);
    }
  };
  exports2.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel2) {
    let seg;
    const ecl = ECLevel2.from(errorCorrectionLevel2, ECLevel2.M);
    if (Array.isArray(data)) {
      if (data.length > 1) {
        return getBestVersionForMixedData(data, ecl);
      }
      if (data.length === 0) {
        return 1;
      }
      seg = data[0];
    } else {
      seg = data;
    }
    return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
  };
  exports2.getEncodedBits = function getEncodedBits2(version2) {
    if (!VersionCheck.isValid(version2) || version2 < 7) {
      throw new Error("Invalid QR Code version");
    }
    let d = version2 << 12;
    while (Utils2.getBCHDigit(d) - G18_BCH >= 0) {
      d ^= G18 << Utils2.getBCHDigit(d) - G18_BCH;
    }
    return version2 << 12 | d;
  };
})(version);
var formatInfo = {};
const Utils$3 = utils$1;
const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
const G15_BCH = Utils$3.getBCHDigit(G15);
formatInfo.getEncodedBits = function getEncodedBits(errorCorrectionLevel2, mask) {
  const data = errorCorrectionLevel2.bit << 3 | mask;
  let d = data << 10;
  while (Utils$3.getBCHDigit(d) - G15_BCH >= 0) {
    d ^= G15 << Utils$3.getBCHDigit(d) - G15_BCH;
  }
  return (data << 10 | d) ^ G15_MASK;
};
var segments = {};
const Mode$4 = mode;
function NumericData(data) {
  this.mode = Mode$4.NUMERIC;
  this.data = data.toString();
}
NumericData.getBitsLength = function getBitsLength(length) {
  return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
};
NumericData.prototype.getLength = function getLength() {
  return this.data.length;
};
NumericData.prototype.getBitsLength = function getBitsLength2() {
  return NumericData.getBitsLength(this.data.length);
};
NumericData.prototype.write = function write2(bitBuffer2) {
  let i, group, value2;
  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3);
    value2 = parseInt(group, 10);
    bitBuffer2.put(value2, 10);
  }
  const remainingNum = this.data.length - i;
  if (remainingNum > 0) {
    group = this.data.substr(i);
    value2 = parseInt(group, 10);
    bitBuffer2.put(value2, remainingNum * 3 + 1);
  }
};
var numericData = NumericData;
const Mode$3 = mode;
const ALPHA_NUM_CHARS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  " ",
  "$",
  "%",
  "*",
  "+",
  "-",
  ".",
  "/",
  ":"
];
function AlphanumericData(data) {
  this.mode = Mode$3.ALPHANUMERIC;
  this.data = data;
}
AlphanumericData.getBitsLength = function getBitsLength3(length) {
  return 11 * Math.floor(length / 2) + 6 * (length % 2);
};
AlphanumericData.prototype.getLength = function getLength2() {
  return this.data.length;
};
AlphanumericData.prototype.getBitsLength = function getBitsLength4() {
  return AlphanumericData.getBitsLength(this.data.length);
};
AlphanumericData.prototype.write = function write3(bitBuffer2) {
  let i;
  for (i = 0; i + 2 <= this.data.length; i += 2) {
    let value2 = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
    value2 += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
    bitBuffer2.put(value2, 11);
  }
  if (this.data.length % 2) {
    bitBuffer2.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
  }
};
var alphanumericData = AlphanumericData;
var encodeUtf8$1 = function encodeUtf8(input) {
  var result = [];
  var size = input.length;
  for (var index = 0; index < size; index++) {
    var point = input.charCodeAt(index);
    if (point >= 55296 && point <= 56319 && size > index + 1) {
      var second = input.charCodeAt(index + 1);
      if (second >= 56320 && second <= 57343) {
        point = (point - 55296) * 1024 + second - 56320 + 65536;
        index += 1;
      }
    }
    if (point < 128) {
      result.push(point);
      continue;
    }
    if (point < 2048) {
      result.push(point >> 6 | 192);
      result.push(point & 63 | 128);
      continue;
    }
    if (point < 55296 || point >= 57344 && point < 65536) {
      result.push(point >> 12 | 224);
      result.push(point >> 6 & 63 | 128);
      result.push(point & 63 | 128);
      continue;
    }
    if (point >= 65536 && point <= 1114111) {
      result.push(point >> 18 | 240);
      result.push(point >> 12 & 63 | 128);
      result.push(point >> 6 & 63 | 128);
      result.push(point & 63 | 128);
      continue;
    }
    result.push(239, 191, 189);
  }
  return new Uint8Array(result).buffer;
};
const encodeUtf82 = encodeUtf8$1;
const Mode$2 = mode;
function ByteData(data) {
  this.mode = Mode$2.BYTE;
  if (typeof data === "string") {
    data = encodeUtf82(data);
  }
  this.data = new Uint8Array(data);
}
ByteData.getBitsLength = function getBitsLength5(length) {
  return length * 8;
};
ByteData.prototype.getLength = function getLength3() {
  return this.data.length;
};
ByteData.prototype.getBitsLength = function getBitsLength6() {
  return ByteData.getBitsLength(this.data.length);
};
ByteData.prototype.write = function(bitBuffer2) {
  for (let i = 0, l = this.data.length; i < l; i++) {
    bitBuffer2.put(this.data[i], 8);
  }
};
var byteData = ByteData;
const Mode$1 = mode;
const Utils$2 = utils$1;
function KanjiData(data) {
  this.mode = Mode$1.KANJI;
  this.data = data;
}
KanjiData.getBitsLength = function getBitsLength7(length) {
  return length * 13;
};
KanjiData.prototype.getLength = function getLength4() {
  return this.data.length;
};
KanjiData.prototype.getBitsLength = function getBitsLength8() {
  return KanjiData.getBitsLength(this.data.length);
};
KanjiData.prototype.write = function(bitBuffer2) {
  let i;
  for (i = 0; i < this.data.length; i++) {
    let value2 = Utils$2.toSJIS(this.data[i]);
    if (value2 >= 33088 && value2 <= 40956) {
      value2 -= 33088;
    } else if (value2 >= 57408 && value2 <= 60351) {
      value2 -= 49472;
    } else {
      throw new Error(
        "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
      );
    }
    value2 = (value2 >>> 8 & 255) * 192 + (value2 & 255);
    bitBuffer2.put(value2, 13);
  }
};
var kanjiData = KanjiData;
var dijkstra = { exports: {} };
(function(module2) {
  var dijkstra2 = {
    single_source_shortest_paths: function(graph, s, d) {
      var predecessors = {};
      var costs = {};
      costs[s] = 0;
      var open = dijkstra2.PriorityQueue.make();
      open.push(s, 0);
      var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
      while (!open.empty()) {
        closest = open.pop();
        u = closest.value;
        cost_of_s_to_u = closest.cost;
        adjacent_nodes = graph[u] || {};
        for (v in adjacent_nodes) {
          if (adjacent_nodes.hasOwnProperty(v)) {
            cost_of_e = adjacent_nodes[v];
            cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
            cost_of_s_to_v = costs[v];
            first_visit = typeof costs[v] === "undefined";
            if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
              costs[v] = cost_of_s_to_u_plus_cost_of_e;
              open.push(v, cost_of_s_to_u_plus_cost_of_e);
              predecessors[v] = u;
            }
          }
        }
      }
      if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
        var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
        throw new Error(msg);
      }
      return predecessors;
    },
    extract_shortest_path_from_predecessor_list: function(predecessors, d) {
      var nodes = [];
      var u = d;
      while (u) {
        nodes.push(u);
        predecessors[u];
        u = predecessors[u];
      }
      nodes.reverse();
      return nodes;
    },
    find_path: function(graph, s, d) {
      var predecessors = dijkstra2.single_source_shortest_paths(graph, s, d);
      return dijkstra2.extract_shortest_path_from_predecessor_list(
        predecessors,
        d
      );
    },
    PriorityQueue: {
      make: function(opts) {
        var T = dijkstra2.PriorityQueue, t = {}, key2;
        opts = opts || {};
        for (key2 in T) {
          if (T.hasOwnProperty(key2)) {
            t[key2] = T[key2];
          }
        }
        t.queue = [];
        t.sorter = opts.sorter || T.default_sorter;
        return t;
      },
      default_sorter: function(a, b) {
        return a.cost - b.cost;
      },
      push: function(value2, cost) {
        var item = { value: value2, cost };
        this.queue.push(item);
        this.queue.sort(this.sorter);
      },
      pop: function() {
        return this.queue.shift();
      },
      empty: function() {
        return this.queue.length === 0;
      }
    }
  };
  {
    module2.exports = dijkstra2;
  }
})(dijkstra);
(function(exports2) {
  const Mode2 = mode;
  const NumericData2 = numericData;
  const AlphanumericData2 = alphanumericData;
  const ByteData2 = byteData;
  const KanjiData2 = kanjiData;
  const Regex = regex;
  const Utils2 = utils$1;
  const dijkstra$1 = dijkstra.exports;
  function getStringByteLength(str) {
    return unescape(encodeURIComponent(str)).length;
  }
  function getSegments(regex2, mode2, str) {
    const segments2 = [];
    let result;
    while ((result = regex2.exec(str)) !== null) {
      segments2.push({
        data: result[0],
        index: result.index,
        mode: mode2,
        length: result[0].length
      });
    }
    return segments2;
  }
  function getSegmentsFromString(dataStr) {
    const numSegs = getSegments(Regex.NUMERIC, Mode2.NUMERIC, dataStr);
    const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode2.ALPHANUMERIC, dataStr);
    let byteSegs;
    let kanjiSegs;
    if (Utils2.isKanjiModeEnabled()) {
      byteSegs = getSegments(Regex.BYTE, Mode2.BYTE, dataStr);
      kanjiSegs = getSegments(Regex.KANJI, Mode2.KANJI, dataStr);
    } else {
      byteSegs = getSegments(Regex.BYTE_KANJI, Mode2.BYTE, dataStr);
      kanjiSegs = [];
    }
    const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
    return segs.sort(function(s1, s2) {
      return s1.index - s2.index;
    }).map(function(obj) {
      return {
        data: obj.data,
        mode: obj.mode,
        length: obj.length
      };
    });
  }
  function getSegmentBitsLength(length, mode2) {
    switch (mode2) {
      case Mode2.NUMERIC:
        return NumericData2.getBitsLength(length);
      case Mode2.ALPHANUMERIC:
        return AlphanumericData2.getBitsLength(length);
      case Mode2.KANJI:
        return KanjiData2.getBitsLength(length);
      case Mode2.BYTE:
        return ByteData2.getBitsLength(length);
    }
  }
  function mergeSegments(segs) {
    return segs.reduce(function(acc, curr) {
      const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
      if (prevSeg && prevSeg.mode === curr.mode) {
        acc[acc.length - 1].data += curr.data;
        return acc;
      }
      acc.push(curr);
      return acc;
    }, []);
  }
  function buildNodes(segs) {
    const nodes = [];
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      switch (seg.mode) {
        case Mode2.NUMERIC:
          nodes.push([
            seg,
            { data: seg.data, mode: Mode2.ALPHANUMERIC, length: seg.length },
            { data: seg.data, mode: Mode2.BYTE, length: seg.length }
          ]);
          break;
        case Mode2.ALPHANUMERIC:
          nodes.push([
            seg,
            { data: seg.data, mode: Mode2.BYTE, length: seg.length }
          ]);
          break;
        case Mode2.KANJI:
          nodes.push([
            seg,
            { data: seg.data, mode: Mode2.BYTE, length: getStringByteLength(seg.data) }
          ]);
          break;
        case Mode2.BYTE:
          nodes.push([
            { data: seg.data, mode: Mode2.BYTE, length: getStringByteLength(seg.data) }
          ]);
      }
    }
    return nodes;
  }
  function buildGraph(nodes, version2) {
    const table = {};
    const graph = { start: {} };
    let prevNodeIds = ["start"];
    for (let i = 0; i < nodes.length; i++) {
      const nodeGroup = nodes[i];
      const currentNodeIds = [];
      for (let j = 0; j < nodeGroup.length; j++) {
        const node = nodeGroup[j];
        const key2 = "" + i + j;
        currentNodeIds.push(key2);
        table[key2] = { node, lastCount: 0 };
        graph[key2] = {};
        for (let n = 0; n < prevNodeIds.length; n++) {
          const prevNodeId = prevNodeIds[n];
          if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
            graph[prevNodeId][key2] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
            table[prevNodeId].lastCount += node.length;
          } else {
            if (table[prevNodeId])
              table[prevNodeId].lastCount = node.length;
            graph[prevNodeId][key2] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode2.getCharCountIndicator(node.mode, version2);
          }
        }
      }
      prevNodeIds = currentNodeIds;
    }
    for (let n = 0; n < prevNodeIds.length; n++) {
      graph[prevNodeIds[n]].end = 0;
    }
    return { map: graph, table };
  }
  function buildSingleSegment(data, modesHint) {
    let mode2;
    const bestMode = Mode2.getBestModeForData(data);
    mode2 = Mode2.from(modesHint, bestMode);
    if (mode2 !== Mode2.BYTE && mode2.bit < bestMode.bit) {
      throw new Error('"' + data + '" cannot be encoded with mode ' + Mode2.toString(mode2) + ".\n Suggested mode is: " + Mode2.toString(bestMode));
    }
    if (mode2 === Mode2.KANJI && !Utils2.isKanjiModeEnabled()) {
      mode2 = Mode2.BYTE;
    }
    switch (mode2) {
      case Mode2.NUMERIC:
        return new NumericData2(data);
      case Mode2.ALPHANUMERIC:
        return new AlphanumericData2(data);
      case Mode2.KANJI:
        return new KanjiData2(data);
      case Mode2.BYTE:
        return new ByteData2(data);
    }
  }
  exports2.fromArray = function fromArray(array) {
    return array.reduce(function(acc, seg) {
      if (typeof seg === "string") {
        acc.push(buildSingleSegment(seg, null));
      } else if (seg.data) {
        acc.push(buildSingleSegment(seg.data, seg.mode));
      }
      return acc;
    }, []);
  };
  exports2.fromString = function fromString(data, version2) {
    const segs = getSegmentsFromString(data, Utils2.isKanjiModeEnabled());
    const nodes = buildNodes(segs);
    const graph = buildGraph(nodes, version2);
    const path = dijkstra$1.find_path(graph.map, "start", "end");
    const optimizedSegs = [];
    for (let i = 1; i < path.length - 1; i++) {
      optimizedSegs.push(graph.table[path[i]].node);
    }
    return exports2.fromArray(mergeSegments(optimizedSegs));
  };
  exports2.rawSplit = function rawSplit(data) {
    return exports2.fromArray(
      getSegmentsFromString(data, Utils2.isKanjiModeEnabled())
    );
  };
})(segments);
const Utils$1 = utils$1;
const ECLevel = errorCorrectionLevel;
const BitBuffer = bitBuffer;
const BitMatrix = bitMatrix;
const AlignmentPattern = alignmentPattern;
const FinderPattern = finderPattern;
const MaskPattern = maskPattern;
const ECCode = errorCorrectionCode;
const ReedSolomonEncoder = reedSolomonEncoder;
const Version = version;
const FormatInfo = formatInfo;
const Mode = mode;
const Segments = segments;
function setupFinderPattern(matrix, version2) {
  const size = matrix.size;
  const pos = FinderPattern.getPositions(version2);
  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0];
    const col = pos[i][1];
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r)
        continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c)
          continue;
        if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          matrix.set(row + r, col + c, true, true);
        } else {
          matrix.set(row + r, col + c, false, true);
        }
      }
    }
  }
}
function setupTimingPattern(matrix) {
  const size = matrix.size;
  for (let r = 8; r < size - 8; r++) {
    const value2 = r % 2 === 0;
    matrix.set(r, 6, value2, true);
    matrix.set(6, r, value2, true);
  }
}
function setupAlignmentPattern(matrix, version2) {
  const pos = AlignmentPattern.getPositions(version2);
  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0];
    const col = pos[i][1];
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
          matrix.set(row + r, col + c, true, true);
        } else {
          matrix.set(row + r, col + c, false, true);
        }
      }
    }
  }
}
function setupVersionInfo(matrix, version2) {
  const size = matrix.size;
  const bits = Version.getEncodedBits(version2);
  let row, col, mod;
  for (let i = 0; i < 18; i++) {
    row = Math.floor(i / 3);
    col = i % 3 + size - 8 - 3;
    mod = (bits >> i & 1) === 1;
    matrix.set(row, col, mod, true);
    matrix.set(col, row, mod, true);
  }
}
function setupFormatInfo(matrix, errorCorrectionLevel2, maskPattern2) {
  const size = matrix.size;
  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel2, maskPattern2);
  let i, mod;
  for (i = 0; i < 15; i++) {
    mod = (bits >> i & 1) === 1;
    if (i < 6) {
      matrix.set(i, 8, mod, true);
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true);
    } else {
      matrix.set(size - 15 + i, 8, mod, true);
    }
    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true);
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true);
    } else {
      matrix.set(8, 15 - i - 1, mod, true);
    }
  }
  matrix.set(size - 8, 8, 1, true);
}
function setupData(matrix, data) {
  const size = matrix.size;
  let inc = -1;
  let row = size - 1;
  let bitIndex = 7;
  let byteIndex = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6)
      col--;
    while (true) {
      for (let c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          let dark = false;
          if (byteIndex < data.length) {
            dark = (data[byteIndex] >>> bitIndex & 1) === 1;
          }
          matrix.set(row, col - c, dark);
          bitIndex--;
          if (bitIndex === -1) {
            byteIndex++;
            bitIndex = 7;
          }
        }
      }
      row += inc;
      if (row < 0 || size <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
  }
}
function createData(version2, errorCorrectionLevel2, segments2) {
  const buffer = new BitBuffer();
  segments2.forEach(function(data) {
    buffer.put(data.mode.bit, 4);
    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
    data.write(buffer);
  });
  const totalCodewords = Utils$1.getSymbolTotalCodewords(version2);
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4);
  }
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0);
  }
  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
  for (let i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 17 : 236, 8);
  }
  return createCodewords(buffer, version2, errorCorrectionLevel2);
}
function createCodewords(bitBuffer2, version2, errorCorrectionLevel2) {
  const totalCodewords = Utils$1.getSymbolTotalCodewords(version2);
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
  const dataTotalCodewords = totalCodewords - ecTotalCodewords;
  const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel2);
  const blocksInGroup2 = totalCodewords % ecTotalBlocks;
  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
  const rs = new ReedSolomonEncoder(ecCount);
  let offset2 = 0;
  const dcData = new Array(ecTotalBlocks);
  const ecData = new Array(ecTotalBlocks);
  let maxDataSize = 0;
  const buffer = new Uint8Array(bitBuffer2.buffer);
  for (let b = 0; b < ecTotalBlocks; b++) {
    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
    dcData[b] = buffer.slice(offset2, offset2 + dataSize);
    ecData[b] = rs.encode(dcData[b]);
    offset2 += dataSize;
    maxDataSize = Math.max(maxDataSize, dataSize);
  }
  const data = new Uint8Array(totalCodewords);
  let index = 0;
  let i, r;
  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i];
      }
    }
  }
  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      data[index++] = ecData[r][i];
    }
  }
  return data;
}
function createSymbol(data, version2, errorCorrectionLevel2, maskPattern2) {
  let segments2;
  if (Array.isArray(data)) {
    segments2 = Segments.fromArray(data);
  } else if (typeof data === "string") {
    let estimatedVersion = version2;
    if (!estimatedVersion) {
      const rawSegments = Segments.rawSplit(data);
      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel2);
    }
    segments2 = Segments.fromString(data, estimatedVersion || 40);
  } else {
    throw new Error("Invalid data");
  }
  const bestVersion = Version.getBestVersionForData(segments2, errorCorrectionLevel2);
  if (!bestVersion) {
    throw new Error("The amount of data is too big to be stored in a QR Code");
  }
  if (!version2) {
    version2 = bestVersion;
  } else if (version2 < bestVersion) {
    throw new Error(
      "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
    );
  }
  const dataBits = createData(version2, errorCorrectionLevel2, segments2);
  const moduleCount = Utils$1.getSymbolSize(version2);
  const modules = new BitMatrix(moduleCount);
  setupFinderPattern(modules, version2);
  setupTimingPattern(modules);
  setupAlignmentPattern(modules, version2);
  setupFormatInfo(modules, errorCorrectionLevel2, 0);
  if (version2 >= 7) {
    setupVersionInfo(modules, version2);
  }
  setupData(modules, dataBits);
  if (isNaN(maskPattern2)) {
    maskPattern2 = MaskPattern.getBestMask(
      modules,
      setupFormatInfo.bind(null, modules, errorCorrectionLevel2)
    );
  }
  MaskPattern.applyMask(maskPattern2, modules);
  setupFormatInfo(modules, errorCorrectionLevel2, maskPattern2);
  return {
    modules,
    version: version2,
    errorCorrectionLevel: errorCorrectionLevel2,
    maskPattern: maskPattern2,
    segments: segments2
  };
}
qrcode.create = function create(data, options) {
  if (typeof data === "undefined" || data === "") {
    throw new Error("No input text");
  }
  let errorCorrectionLevel2 = ECLevel.M;
  let version2;
  let mask;
  if (typeof options !== "undefined") {
    errorCorrectionLevel2 = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
    version2 = Version.from(options.version);
    mask = MaskPattern.from(options.maskPattern);
    if (options.toSJISFunc) {
      Utils$1.setToSJISFunction(options.toSJISFunc);
    }
  }
  return createSymbol(data, version2, errorCorrectionLevel2, mask);
};
var canvas = {};
var utils = {};
(function(exports2) {
  function hex2rgba(hex) {
    if (typeof hex === "number") {
      hex = hex.toString();
    }
    if (typeof hex !== "string") {
      throw new Error("Color should be defined as hex string");
    }
    let hexCode = hex.slice().replace("#", "").split("");
    if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
      throw new Error("Invalid hex color: " + hex);
    }
    if (hexCode.length === 3 || hexCode.length === 4) {
      hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
        return [c, c];
      }));
    }
    if (hexCode.length === 6)
      hexCode.push("F", "F");
    const hexValue = parseInt(hexCode.join(""), 16);
    return {
      r: hexValue >> 24 & 255,
      g: hexValue >> 16 & 255,
      b: hexValue >> 8 & 255,
      a: hexValue & 255,
      hex: "#" + hexCode.slice(0, 6).join("")
    };
  }
  exports2.getOptions = function getOptions(options) {
    if (!options)
      options = {};
    if (!options.color)
      options.color = {};
    const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
    const width = options.width && options.width >= 21 ? options.width : void 0;
    const scale = options.scale || 4;
    return {
      width,
      scale: width ? 4 : scale,
      margin,
      color: {
        dark: hex2rgba(options.color.dark || "#000000ff"),
        light: hex2rgba(options.color.light || "#ffffffff")
      },
      type: options.type,
      rendererOpts: options.rendererOpts || {}
    };
  };
  exports2.getScale = function getScale(qrSize, opts) {
    return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
  };
  exports2.getImageWidth = function getImageWidth(qrSize, opts) {
    const scale = exports2.getScale(qrSize, opts);
    return Math.floor((qrSize + opts.margin * 2) * scale);
  };
  exports2.qrToImageData = function qrToImageData(imgData, qr, opts) {
    const size = qr.modules.size;
    const data = qr.modules.data;
    const scale = exports2.getScale(size, opts);
    const symbolSize = Math.floor((size + opts.margin * 2) * scale);
    const scaledMargin = opts.margin * scale;
    const palette = [opts.color.light, opts.color.dark];
    for (let i = 0; i < symbolSize; i++) {
      for (let j = 0; j < symbolSize; j++) {
        let posDst = (i * symbolSize + j) * 4;
        let pxColor = opts.color.light;
        if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
          const iSrc = Math.floor((i - scaledMargin) / scale);
          const jSrc = Math.floor((j - scaledMargin) / scale);
          pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
        }
        imgData[posDst++] = pxColor.r;
        imgData[posDst++] = pxColor.g;
        imgData[posDst++] = pxColor.b;
        imgData[posDst] = pxColor.a;
      }
    }
  };
})(utils);
(function(exports2) {
  const Utils2 = utils;
  function clearCanvas(ctx, canvas2, size) {
    ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    if (!canvas2.style)
      canvas2.style = {};
    canvas2.height = size;
    canvas2.width = size;
    canvas2.style.height = size + "px";
    canvas2.style.width = size + "px";
  }
  function getCanvasElement() {
    try {
      return document.createElement("canvas");
    } catch (e) {
      throw new Error("You need to specify a canvas element");
    }
  }
  exports2.render = function render3(qrData, canvas2, options) {
    let opts = options;
    let canvasEl = canvas2;
    if (typeof opts === "undefined" && (!canvas2 || !canvas2.getContext)) {
      opts = canvas2;
      canvas2 = void 0;
    }
    if (!canvas2) {
      canvasEl = getCanvasElement();
    }
    opts = Utils2.getOptions(opts);
    const size = Utils2.getImageWidth(qrData.modules.size, opts);
    const ctx = canvasEl.getContext("2d");
    const image = ctx.createImageData(size, size);
    Utils2.qrToImageData(image.data, qrData, opts);
    clearCanvas(ctx, canvasEl, size);
    ctx.putImageData(image, 0, 0);
    return canvasEl;
  };
  exports2.renderToDataURL = function renderToDataURL(qrData, canvas2, options) {
    let opts = options;
    if (typeof opts === "undefined" && (!canvas2 || !canvas2.getContext)) {
      opts = canvas2;
      canvas2 = void 0;
    }
    if (!opts)
      opts = {};
    const canvasEl = exports2.render(qrData, canvas2, opts);
    const type = opts.type || "image/png";
    const rendererOpts = opts.rendererOpts || {};
    return canvasEl.toDataURL(type, rendererOpts.quality);
  };
})(canvas);
var svgTag = {};
const Utils = utils;
function getColorAttrib(color, attrib) {
  const alpha = color.a / 255;
  const str = attrib + '="' + color.hex + '"';
  return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
}
function svgCmd(cmd, x, y) {
  let str = cmd + x;
  if (typeof y !== "undefined")
    str += " " + y;
  return str;
}
function qrToPath(data, size, margin) {
  let path = "";
  let moveBy = 0;
  let newRow = false;
  let lineLength = 0;
  for (let i = 0; i < data.length; i++) {
    const col = Math.floor(i % size);
    const row = Math.floor(i / size);
    if (!col && !newRow)
      newRow = true;
    if (data[i]) {
      lineLength++;
      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
        moveBy = 0;
        newRow = false;
      }
      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd("h", lineLength);
        lineLength = 0;
      }
    } else {
      moveBy++;
    }
  }
  return path;
}
svgTag.render = function render2(qrData, options, cb) {
  const opts = Utils.getOptions(options);
  const size = qrData.modules.size;
  const data = qrData.modules.data;
  const qrcodesize = size + opts.margin * 2;
  const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
  const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
  const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
  const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
  const svgTag2 = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
  if (typeof cb === "function") {
    cb(null, svgTag2);
  }
  return svgTag2;
};
const canPromise = canPromise$1;
const QRCode = qrcode;
const CanvasRenderer = canvas;
const SvgRenderer = svgTag;
function renderCanvas(renderFunc, canvas2, text, opts, cb) {
  const args = [].slice.call(arguments, 1);
  const argsNum = args.length;
  const isLastArgCb = typeof args[argsNum - 1] === "function";
  if (!isLastArgCb && !canPromise()) {
    throw new Error("Callback required as last argument");
  }
  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error("Too few arguments provided");
    }
    if (argsNum === 2) {
      cb = text;
      text = canvas2;
      canvas2 = opts = void 0;
    } else if (argsNum === 3) {
      if (canvas2.getContext && typeof cb === "undefined") {
        cb = opts;
        opts = void 0;
      } else {
        cb = opts;
        opts = text;
        text = canvas2;
        canvas2 = void 0;
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error("Too few arguments provided");
    }
    if (argsNum === 1) {
      text = canvas2;
      canvas2 = opts = void 0;
    } else if (argsNum === 2 && !canvas2.getContext) {
      opts = text;
      text = canvas2;
      canvas2 = void 0;
    }
    return new Promise(function(resolve2, reject) {
      try {
        const data = QRCode.create(text, opts);
        resolve2(renderFunc(data, canvas2, opts));
      } catch (e) {
        reject(e);
      }
    });
  }
  try {
    const data = QRCode.create(text, opts);
    cb(null, renderFunc(data, canvas2, opts));
  } catch (e) {
    cb(e);
  }
}
browser.create = QRCode.create;
browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
browser.toString = renderCanvas.bind(null, function(data, _, opts) {
  return SvgRenderer.render(data, opts);
});
var style$c = ':host{--phone-display: block;--phone-collapse-display: none;--phone-body-height: 520px}@media screen and (max-width: 960px){:host{--phone-display: none;--phone-collapse-display: flex}}.TDesign-doc-phone{width:375px;width:min(75vw,375px);border-radius:6px;border:1px solid var(--component-border);outline:9999px solid transparent;position:absolute;top:316px;right:24px;display:var(--phone-display)}.TDesign-doc-phone.hide{visibility:hidden;opacity:0}.TDesign-doc-phone.show{position:fixed;left:50%;top:50%!important;transform:translate3d(-50%,-50%,0);outline-color:var(--text-disabled);transition:transform .2s var(--anim-time-fn-easing),opacity .2s linear,visibility .2s linear;visibility:visible;opacity:1;z-index:800;display:block}.TDesign-doc-phone.show .TDesign-doc-phone__close{opacity:1;visibility:visible}.TDesign-doc-phone.show+.TDesign-doc-phone-mask{display:block}.TDesign-doc-phone__close{width:40px;height:40px;display:flex;justify-content:center;align-items:center;border:1px solid var(--component-border);border-radius:0 6px 6px 0;position:absolute;right:-42px;top:42px;background-color:var(--bg-color-container);visibility:hidden;opacity:0;transition:all .2s linear}.TDesign-doc-phone__close svg{color:var(--text-primary);width:24px;height:24px}.TDesign-doc-phone__header{height:48px;padding:8px;border-radius:6px 6px 0 0;box-sizing:border-box;background:var(--bg-color-demo)}.TDesign-doc-phone__header-icons{display:flex;height:100%}.TDesign-doc-phone__header-icons .icon{width:32px;height:32px;border-radius:var(--border-radius);transition:all .1s;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary)}.TDesign-doc-phone__header-icons .icon:hover{color:var(--text-primary);background-color:var(--bg-color-demo-hover)}.TDesign-doc-phone__header-icons .icon.active{color:var(--text-primary);background-color:var(--bg-color-demo-select)}.TDesign-doc-phone__header-icons .qrcode-wrapper{display:flex;justify-content:center;align-items:center;border-radius:3px;overflow:hidden;max-width:200px;max-height:200px}.TDesign-doc-phone__body{width:100%;height:var(--phone-body-height);border-radius:0 0 6px 6px;background-color:var(--bg-color-demo)}.TDesign-doc-phone-mask{content:"";position:fixed;left:0;top:0;width:100%;height:100%;z-index:300;display:none}.TDesign-doc-phone-collapse{position:fixed;right:0;top:400px;z-index:400;border-radius:3px 0 0 3px;box-shadow:2px 0 8px #00000042;width:40px;height:40px;align-items:center;justify-content:center;background-color:var(--bg-color-container);transition:all .2s var(--anim-time-fn-easing);display:var(--phone-collapse-display)}.TDesign-doc-phone-collapse .icon svg{width:24px;height:24px;color:var(--text-primary)}\n';
var qrcodeIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M8.75 5H5V8.75H8.75V5Z" fill="currentColor"/>\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.5C10.6904 2.5 11.25 3.05964 11.25 3.75V10C11.25 10.6904 10.6904 11.25 10 11.25H3.75C3.05964 11.25 2.5 10.6904 2.5 10V3.75C2.5 3.05964 3.05964 2.5 3.75 2.5H10ZM10 3.75H3.75V10H10V3.75Z" fill="currentColor"/>\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 3.75C17.5 3.05964 16.9404 2.5 16.25 2.5H13.75C13.0596 2.5 12.5 3.05964 12.5 3.75V6.25C12.5 6.94036 13.0596 7.5 13.75 7.5H16.25C16.9404 7.5 17.5 6.94036 17.5 6.25V3.75ZM13.75 3.75H16.25V6.25H13.75V3.75Z" fill="currentColor"/>\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 12.5C6.94036 12.5 7.5 13.0596 7.5 13.75V16.25C7.5 16.9404 6.94036 17.5 6.25 17.5H3.75C3.05964 17.5 2.5 16.9404 2.5 16.25V13.75C2.5 13.0596 3.05964 12.5 3.75 12.5H6.25ZM6.25 16.25V13.75H3.75V16.25H6.25Z" fill="currentColor"/>\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 13.75C17.5 13.0596 16.9404 12.5 16.25 12.5H13.75C13.0596 12.5 12.5 13.0596 12.5 13.75V16.25C12.5 16.9404 13.0596 17.5 13.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V13.75ZM13.75 16.25V13.75H16.25V16.25H13.75Z" fill="currentColor"/>\n  <path d="M12.5 9.35091H13.75V10.6009H12.5V9.35091Z" fill="currentColor"/>\n  <path d="M15 9.35091H17.5V10.6009H15V9.35091Z" fill="currentColor"/>\n  <path d="M10.6301 15.0165H9.38007V17.5165H10.6301V15.0165Z" fill="currentColor"/>\n  <path d="M9.38007 12.5H10.6301V13.75H9.38007V12.5Z" fill="currentColor"/>\n</svg>\n';
var mobileIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M13 26H19V24H13V26Z" fill="currentColor" />\n  <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.89543 7.89543 3 9 3H23C24.1046 3 25 3.89543 25 5V28C25 29.1046 24.1046 30 23 30H9C7.89543 30 7 29.1046 7 28V5ZM9 5H23V28H9L9 5Z" fill="currentColor" />\n</svg>';
function toggleCollapsePhone(host) {
  if (!host.shadowRoot)
    return;
  const aisdeClassList = host.shadowRoot.querySelector(".TDesign-doc-phone").classList;
  if (aisdeClassList.contains("hide")) {
    aisdeClassList.remove("hide");
    aisdeClassList.add("show");
  } else {
    aisdeClassList.remove("show");
    aisdeClassList.add("hide");
  }
}
define$2({
  tag: "td-doc-phone",
  headless: false,
  QRCode: () => browser,
  qrCanvas: ({ render: render3 }) => render3().querySelector("#qrcode"),
  qrcodeUrl: {
    get: (host, lastValue) => lastValue,
    set: (host, value2) => value2,
    connect: (host) => {
      requestAnimationFrame(() => {
        const qrcodeSlot = host.querySelector('[slot="qrcode"]');
        const contentSlot = host.shadowRoot.querySelector('[slot="content"]');
        if (!qrcodeSlot || !contentSlot)
          return;
        contentSlot.innerHTML = qrcodeSlot.outerHTML;
      });
    },
    observe: (host, value2) => {
      if (!host.qrCanvas)
        return;
      browser.toCanvas(host.qrCanvas, value2, { width: 96, height: 96 });
    }
  },
  fixedStyle: {
    get: (host, lastValue) => lastValue || {},
    set: (host, value2) => value2,
    connect: (host, key2) => {
      function handleScroll() {
        const isMobileResponse = window.innerWidth < 960;
        if (isMobileResponse)
          return;
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const FOOTER_HEIGHT = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--footer-height"));
        const PHONE_HEIGHT = parseFloat(getComputedStyle(host).getPropertyValue("--phone-body-height"));
        const TD_HEIGHT = 64;
        const maxPhonePos = scrollHeight - FOOTER_HEIGHT - PHONE_HEIGHT - TD_HEIGHT - 64;
        const canViewPhoneAndFooter = clientHeight <= FOOTER_HEIGHT + PHONE_HEIGHT + 64;
        if (scrollTop >= 228) {
          if (scrollTop + 88 >= maxPhonePos && canViewPhoneAndFooter) {
            Object.assign(host, {
              [key2]: {
                ...host.fixedStyle,
                position: "absolute",
                top: `${maxPhonePos}px`
              }
            });
          } else {
            Object.assign(host, {
              [key2]: {
                ...host.fixedStyle,
                position: "fixed",
                top: "152px"
              }
            });
          }
        } else {
          Object.assign(host, {
            [key2]: {
              ...host.fixedStyle,
              position: "absolute",
              top: "316px"
            }
          });
        }
      }
      function responsePhone() {
        if (!host.shadowRoot)
          return;
        const isMobileResponse = window.innerWidth < 960;
        const tdDocPhone = host.shadowRoot.querySelector(".TDesign-doc-phone");
        if (isMobileResponse) {
          tdDocPhone.classList.remove("show");
          tdDocPhone.classList.add("hide");
        } else {
          tdDocPhone.classList.remove("show");
          tdDocPhone.classList.remove("hide");
        }
      }
      document.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", responsePhone);
      window.addEventListener("load", responsePhone);
      return () => {
        document.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", responsePhone);
        window.removeEventListener("load", responsePhone);
      };
    }
  },
  render: ({ fixedStyle, headless }) => html`
    <div class="TDesign-doc-phone" style=${fixedStyle}>
      ${headless ? html`` : html`
        <div class="TDesign-doc-phone__header">
          <div class="TDesign-doc-phone__header-icons">
            <td-doc-popup placement="left-start">
              <span class="icon qrcode" innerHTML=${qrcodeIcon}></span>
              <div slot="content" class="qrcode-wrapper">
                <slot name="qrcode">
                  <canvas id="qrcode"></canvas>
                </slot>
              </div>
            </td-doc-popup>
          </div>
        </div>
      `}
      <div class="TDesign-doc-phone__body">
        <slot></slot>
      </div>
      <div class="TDesign-doc-phone__close" innerHTML="${closeIcon}" onclick="${toggleCollapsePhone}"></div>
    </div>
    <div class="TDesign-doc-phone-mask" onclick="${toggleCollapsePhone}"></div>
    <div class="TDesign-doc-phone-collapse" onclick="${toggleCollapsePhone}">
      <i class="icon" innerHTML="${mobileIcon}"></i>
    </div>
  `.css`${style$c}`
});
var style$b = ":host{--block-base-width: 16px;position:absolute;top:228px;z-index:1100}@media screen and (max-width: 960px){:host{--block-base-width: 14px}}.TDesign-doc-tabs{display:flex;align-items:center;justify-content:center;border-radius:6px;background:var(--bg-color-tab);height:calc(var(--block-base-width) * 3);box-sizing:border-box;cursor:pointer;border:1px solid var(--component-border)}.TDesign-doc-tabs__block{background-color:var(--bg-color-tab-select);box-shadow:0 2px 4px #00000026;position:absolute;height:calc(100% - 8px);left:4px;transition:all var(--anim-time-fn-easing) var(--anim-duration-moderate);border-radius:var(--border-radius)}.TDesign-doc-tabs .item+.item{margin-left:8px}.TDesign-doc-tabs .item{margin:4px;padding:8px calc(var(--block-base-width) * 1.5);font-size:var(--block-base-width);box-sizing:border-box;transition:all var(--anim-time-fn-easing) var(--anim-duration-moderate);border-radius:var(--border-radius);color:var(--text-secondary);position:relative;word-break:keep-all;white-space:nowrap}.TDesign-doc-tabs .item:hover,.TDesign-doc-tabs .item.active{color:var(--text-primary)}\n";
const lang = getLang();
function handleTabClick(host, e) {
  host.tabScrollMap[host.tab] = document.documentElement.scrollTop;
  const { tab: currentTab } = e.target.dataset;
  Object.assign(host, { tab: currentTab });
  dispatch$1(host, "change", { detail: currentTab });
  if (host.autoScroll) {
    requestAnimationFrame(() => {
      window.scrollTo({
        left: 0,
        top: host.tabScrollMap[currentTab],
        behavior: "smooth"
      });
    });
  }
}
const defaultTabs = [
  { tab: "demo", name: lang === "zh" ? "\u793A\u4F8B" : "Demo" },
  { tab: "api", name: "API" },
  { tab: "design", name: lang === "zh" ? "\u6307\u5357" : "Guide" }
];
define$2({
  tag: "td-doc-tabs",
  tab: "demo",
  autoScroll: true,
  tabScrollMap: {
    get: (host, lastValue) => {
      const tabMap = {};
      host.tabs.forEach(({ tab }) => {
        tabMap[tab] = 0;
      });
      return lastValue || tabMap;
    },
    set: (_host, value2) => value2
  },
  tabs: {
    get: (_host, lastValue) => lastValue || defaultTabs,
    set: (_host, value2) => value2
  },
  blockStyleMap: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2,
    connect: (host, key2) => {
      function handleResize() {
        if (!host.shadowRoot) {
          setTimeout(handleResize, 300);
          return;
        }
        const items = host.shadowRoot.querySelectorAll(".item");
        let styleMap2 = {};
        items.forEach((item) => {
          if (!item.offsetWidth) {
            styleMap2 = null;
          } else {
            const { tab } = item.dataset;
            styleMap2[tab] = {
              width: `${item.offsetWidth}px`,
              transform: `translate3d(${item.offsetLeft - 4}px, 0, 0)`
            };
          }
        });
        Object.assign(host, { [key2]: styleMap2 });
      }
      requestAnimationFrame(handleResize);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  },
  render: (host) => {
    const { tab, tabs, blockStyleMap } = host;
    const blockStyle = blockStyleMap ? blockStyleMap[tab] : {};
    if (!tabs.length)
      return html``;
    return html`
      <div class="TDesign-doc-tabs">
        <span class="TDesign-doc-tabs__block" style="${blockStyle}"></span>
        ${tabs.map(
      (item) => html`
            <div
              data-tab=${item.tab}
              onclick="${handleTabClick}"
              class="item ${item.tab === tab ? "active" : ""}"
            >
              ${item.name}
            </div>
          `
    )}
      </div>
    `.css`${style$b}`;
  }
});
var prism = { exports: {} };
(function(module2) {
  var _self = typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope ? self : {};
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var Prism2 = function(_self2) {
    var lang2 = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
    var uniqueId = 0;
    var plainTextGrammar = {};
    var _ = {
      manual: _self2.Prism && _self2.Prism.manual,
      disableWorkerMessageHandler: _self2.Prism && _self2.Prism.disableWorkerMessageHandler,
      util: {
        encode: function encode2(tokens) {
          if (tokens instanceof Token) {
            return new Token(tokens.type, encode2(tokens.content), tokens.alias);
          } else if (Array.isArray(tokens)) {
            return tokens.map(encode2);
          } else {
            return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          }
        },
        type: function(o) {
          return Object.prototype.toString.call(o).slice(8, -1);
        },
        objId: function(obj) {
          if (!obj["__id"]) {
            Object.defineProperty(obj, "__id", { value: ++uniqueId });
          }
          return obj["__id"];
        },
        clone: function deepClone(o, visited) {
          visited = visited || {};
          var clone;
          var id;
          switch (_.util.type(o)) {
            case "Object":
              id = _.util.objId(o);
              if (visited[id]) {
                return visited[id];
              }
              clone = {};
              visited[id] = clone;
              for (var key2 in o) {
                if (o.hasOwnProperty(key2)) {
                  clone[key2] = deepClone(o[key2], visited);
                }
              }
              return clone;
            case "Array":
              id = _.util.objId(o);
              if (visited[id]) {
                return visited[id];
              }
              clone = [];
              visited[id] = clone;
              o.forEach(function(v, i) {
                clone[i] = deepClone(v, visited);
              });
              return clone;
            default:
              return o;
          }
        },
        getLanguage: function(element) {
          while (element) {
            var m = lang2.exec(element.className);
            if (m) {
              return m[1].toLowerCase();
            }
            element = element.parentElement;
          }
          return "none";
        },
        setLanguage: function(element, language) {
          element.className = element.className.replace(RegExp(lang2, "gi"), "");
          element.classList.add("language-" + language);
        },
        currentScript: function() {
          if (typeof document === "undefined") {
            return null;
          }
          if ("currentScript" in document && 1 < 2) {
            return document.currentScript;
          }
          try {
            throw new Error();
          } catch (err) {
            var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
            if (src) {
              var scripts = document.getElementsByTagName("script");
              for (var i in scripts) {
                if (scripts[i].src == src) {
                  return scripts[i];
                }
              }
            }
            return null;
          }
        },
        isActive: function(element, className, defaultActivation) {
          var no = "no-" + className;
          while (element) {
            var classList = element.classList;
            if (classList.contains(className)) {
              return true;
            }
            if (classList.contains(no)) {
              return false;
            }
            element = element.parentElement;
          }
          return !!defaultActivation;
        }
      },
      languages: {
        plain: plainTextGrammar,
        plaintext: plainTextGrammar,
        text: plainTextGrammar,
        txt: plainTextGrammar,
        extend: function(id, redef) {
          var lang3 = _.util.clone(_.languages[id]);
          for (var key2 in redef) {
            lang3[key2] = redef[key2];
          }
          return lang3;
        },
        insertBefore: function(inside, before, insert, root) {
          root = root || _.languages;
          var grammar = root[inside];
          var ret = {};
          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              }
              if (!insert.hasOwnProperty(token)) {
                ret[token] = grammar[token];
              }
            }
          }
          var old = root[inside];
          root[inside] = ret;
          _.languages.DFS(_.languages, function(key2, value2) {
            if (value2 === old && key2 != inside) {
              this[key2] = ret;
            }
          });
          return ret;
        },
        DFS: function DFS(o, callback, type, visited) {
          visited = visited || {};
          var objId = _.util.objId;
          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);
              var property = o[i];
              var propertyType = _.util.type(property);
              if (propertyType === "Object" && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, null, visited);
              } else if (propertyType === "Array" && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, i, visited);
              }
            }
          }
        }
      },
      plugins: {},
      highlightAll: function(async, callback) {
        _.highlightAllUnder(document, async, callback);
      },
      highlightAllUnder: function(container, async, callback) {
        var env = {
          callback,
          container,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        _.hooks.run("before-highlightall", env);
        env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
        _.hooks.run("before-all-elements-highlight", env);
        for (var i = 0, element; element = env.elements[i++]; ) {
          _.highlightElement(element, async === true, env.callback);
        }
      },
      highlightElement: function(element, async, callback) {
        var language = _.util.getLanguage(element);
        var grammar = _.languages[language];
        _.util.setLanguage(element, language);
        var parent = element.parentElement;
        if (parent && parent.nodeName.toLowerCase() === "pre") {
          _.util.setLanguage(parent, language);
        }
        var code = element.textContent;
        var env = {
          element,
          language,
          grammar,
          code
        };
        function insertHighlightedCode(highlightedCode) {
          env.highlightedCode = highlightedCode;
          _.hooks.run("before-insert", env);
          env.element.innerHTML = env.highlightedCode;
          _.hooks.run("after-highlight", env);
          _.hooks.run("complete", env);
          callback && callback.call(env.element);
        }
        _.hooks.run("before-sanity-check", env);
        parent = env.element.parentElement;
        if (parent && parent.nodeName.toLowerCase() === "pre" && !parent.hasAttribute("tabindex")) {
          parent.setAttribute("tabindex", "0");
        }
        if (!env.code) {
          _.hooks.run("complete", env);
          callback && callback.call(env.element);
          return;
        }
        _.hooks.run("before-highlight", env);
        if (!env.grammar) {
          insertHighlightedCode(_.util.encode(env.code));
          return;
        }
        if (async && _self2.Worker) {
          var worker = new Worker(_.filename);
          worker.onmessage = function(evt) {
            insertHighlightedCode(evt.data);
          };
          worker.postMessage(JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true
          }));
        } else {
          insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
        }
      },
      highlight: function(text, grammar, language) {
        var env = {
          code: text,
          grammar,
          language
        };
        _.hooks.run("before-tokenize", env);
        if (!env.grammar) {
          throw new Error('The language "' + env.language + '" has no grammar.');
        }
        env.tokens = _.tokenize(env.code, env.grammar);
        _.hooks.run("after-tokenize", env);
        return Token.stringify(_.util.encode(env.tokens), env.language);
      },
      tokenize: function(text, grammar) {
        var rest = grammar.rest;
        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }
          delete grammar.rest;
        }
        var tokenList = new LinkedList();
        addAfter(tokenList, tokenList.head, text);
        matchGrammar(text, tokenList, grammar, tokenList.head, 0);
        return toArray(tokenList);
      },
      hooks: {
        all: {},
        add: function(name, callback) {
          var hooks = _.hooks.all;
          hooks[name] = hooks[name] || [];
          hooks[name].push(callback);
        },
        run: function(name, env) {
          var callbacks2 = _.hooks.all[name];
          if (!callbacks2 || !callbacks2.length) {
            return;
          }
          for (var i = 0, callback; callback = callbacks2[i++]; ) {
            callback(env);
          }
        }
      },
      Token
    };
    _self2.Prism = _;
    function Token(type, content, alias, matchedStr) {
      this.type = type;
      this.content = content;
      this.alias = alias;
      this.length = (matchedStr || "").length | 0;
    }
    Token.stringify = function stringify(o, language) {
      if (typeof o == "string") {
        return o;
      }
      if (Array.isArray(o)) {
        var s = "";
        o.forEach(function(e) {
          s += stringify(e, language);
        });
        return s;
      }
      var env = {
        type: o.type,
        content: stringify(o.content, language),
        tag: "span",
        classes: ["token", o.type],
        attributes: {},
        language
      };
      var aliases = o.alias;
      if (aliases) {
        if (Array.isArray(aliases)) {
          Array.prototype.push.apply(env.classes, aliases);
        } else {
          env.classes.push(aliases);
        }
      }
      _.hooks.run("wrap", env);
      var attributes = "";
      for (var name in env.attributes) {
        attributes += " " + name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
      }
      return "<" + env.tag + ' class="' + env.classes.join(" ") + '"' + attributes + ">" + env.content + "</" + env.tag + ">";
    };
    function matchPattern(pattern, pos, text, lookbehind) {
      pattern.lastIndex = pos;
      var match = pattern.exec(text);
      if (match && lookbehind && match[1]) {
        var lookbehindLength = match[1].length;
        match.index += lookbehindLength;
        match[0] = match[0].slice(lookbehindLength);
      }
      return match;
    }
    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }
        var patterns = grammar[token];
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        for (var j = 0; j < patterns.length; ++j) {
          if (rematch && rematch.cause == token + "," + j) {
            return;
          }
          var patternObj = patterns[j];
          var inside = patternObj.inside;
          var lookbehind = !!patternObj.lookbehind;
          var greedy = !!patternObj.greedy;
          var alias = patternObj.alias;
          if (greedy && !patternObj.pattern.global) {
            var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
            patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
          }
          var pattern = patternObj.pattern || patternObj;
          for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
            if (rematch && pos >= rematch.reach) {
              break;
            }
            var str = currentNode.value;
            if (tokenList.length > text.length) {
              return;
            }
            if (str instanceof Token) {
              continue;
            }
            var removeCount = 1;
            var match;
            if (greedy) {
              match = matchPattern(pattern, pos, text, lookbehind);
              if (!match || match.index >= text.length) {
                break;
              }
              var from2 = match.index;
              var to = match.index + match[0].length;
              var p = pos;
              p += currentNode.value.length;
              while (from2 >= p) {
                currentNode = currentNode.next;
                p += currentNode.value.length;
              }
              p -= currentNode.value.length;
              pos = p;
              if (currentNode.value instanceof Token) {
                continue;
              }
              for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === "string"); k = k.next) {
                removeCount++;
                p += k.value.length;
              }
              removeCount--;
              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              match = matchPattern(pattern, 0, str, lookbehind);
              if (!match) {
                continue;
              }
            }
            var from2 = match.index;
            var matchStr = match[0];
            var before = str.slice(0, from2);
            var after = str.slice(from2 + matchStr.length);
            var reach = pos + str.length;
            if (rematch && reach > rematch.reach) {
              rematch.reach = reach;
            }
            var removeFrom = currentNode.prev;
            if (before) {
              removeFrom = addAfter(tokenList, removeFrom, before);
              pos += before.length;
            }
            removeRange(tokenList, removeFrom, removeCount);
            var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
            currentNode = addAfter(tokenList, removeFrom, wrapped);
            if (after) {
              addAfter(tokenList, currentNode, after);
            }
            if (removeCount > 1) {
              var nestedRematch = {
                cause: token + "," + j,
                reach
              };
              matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);
              if (rematch && nestedRematch.reach > rematch.reach) {
                rematch.reach = nestedRematch.reach;
              }
            }
          }
        }
      }
    }
    function LinkedList() {
      var head = { value: null, prev: null, next: null };
      var tail = { value: null, prev: head, next: null };
      head.next = tail;
      this.head = head;
      this.tail = tail;
      this.length = 0;
    }
    function addAfter(list, node, value2) {
      var next = node.next;
      var newNode = { value: value2, prev: node, next };
      node.next = newNode;
      next.prev = newNode;
      list.length++;
      return newNode;
    }
    function removeRange(list, node, count) {
      var next = node.next;
      for (var i = 0; i < count && next !== list.tail; i++) {
        next = next.next;
      }
      node.next = next;
      next.prev = node;
      list.length -= i;
    }
    function toArray(list) {
      var array = [];
      var node = list.head.next;
      while (node !== list.tail) {
        array.push(node.value);
        node = node.next;
      }
      return array;
    }
    if (!_self2.document) {
      if (!_self2.addEventListener) {
        return _;
      }
      if (!_.disableWorkerMessageHandler) {
        _self2.addEventListener("message", function(evt) {
          var message = JSON.parse(evt.data);
          var lang3 = message.language;
          var code = message.code;
          var immediateClose = message.immediateClose;
          _self2.postMessage(_.highlight(code, _.languages[lang3], lang3));
          if (immediateClose) {
            _self2.close();
          }
        }, false);
      }
      return _;
    }
    var script = _.util.currentScript();
    if (script) {
      _.filename = script.src;
      if (script.hasAttribute("data-manual")) {
        _.manual = true;
      }
    }
    function highlightAutomaticallyCallback() {
      if (!_.manual) {
        _.highlightAll();
      }
    }
    if (!_.manual) {
      var readyState = document.readyState;
      if (readyState === "loading" || readyState === "interactive" && script && script.defer) {
        document.addEventListener("DOMContentLoaded", highlightAutomaticallyCallback);
      } else {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(highlightAutomaticallyCallback);
        } else {
          window.setTimeout(highlightAutomaticallyCallback, 16);
        }
      }
    }
    return _;
  }(_self);
  if (module2.exports) {
    module2.exports = Prism2;
  }
  if (typeof commonjsGlobal !== "undefined") {
    commonjsGlobal.Prism = Prism2;
  }
  Prism2.languages.markup = {
    "comment": {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: true
    },
    "prolog": {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: true
    },
    "doctype": {
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: true,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: true,
          greedy: true,
          inside: null
        },
        "string": {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true
        },
        "punctuation": /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        "name": /[^\s<>'"]+/
      }
    },
    "cdata": {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: true
    },
    "tag": {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: true,
      inside: {
        "tag": {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            "punctuation": /^<\/?/,
            "namespace": /^[^\s>\/:]+:/
          }
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            "punctuation": [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              {
                pattern: /^(\s*)["']|["']$/,
                lookbehind: true
              }
            ]
          }
        },
        "punctuation": /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            "namespace": /^[^\s>\/:]+:/
          }
        }
      }
    },
    "entity": [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
      },
      /&#x?[\da-f]{1,8};/i
    ]
  };
  Prism2.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism2.languages.markup["entity"];
  Prism2.languages.markup["doctype"].inside["internal-subset"].inside = Prism2.languages.markup;
  Prism2.hooks.add("wrap", function(env) {
    if (env.type === "entity") {
      env.attributes["title"] = env.content.replace(/&amp;/, "&");
    }
  });
  Object.defineProperty(Prism2.languages.markup.tag, "addInlined", {
    value: function addInlined2(tagName, lang2) {
      var includedCdataInside = {};
      includedCdataInside["language-" + lang2] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism2.languages[lang2]
      };
      includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
      var inside = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      };
      inside["language-" + lang2] = {
        pattern: /[\s\S]+/,
        inside: Prism2.languages[lang2]
      };
      var def = {};
      def[tagName] = {
        pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
          return tagName;
        }), "i"),
        lookbehind: true,
        greedy: true,
        inside
      };
      Prism2.languages.insertBefore("markup", "cdata", def);
    }
  });
  Object.defineProperty(Prism2.languages.markup.tag, "addAttribute", {
    value: function(attrName, lang2) {
      Prism2.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          "i"
        ),
        lookbehind: true,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              "value": {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: true,
                alias: [lang2, "language-" + lang2],
                inside: Prism2.languages[lang2]
              },
              "punctuation": [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                /"|'/
              ]
            }
          }
        }
      });
    }
  });
  Prism2.languages.html = Prism2.languages.markup;
  Prism2.languages.mathml = Prism2.languages.markup;
  Prism2.languages.svg = Prism2.languages.markup;
  Prism2.languages.xml = Prism2.languages.extend("markup", {});
  Prism2.languages.ssml = Prism2.languages.xml;
  Prism2.languages.atom = Prism2.languages.xml;
  Prism2.languages.rss = Prism2.languages.xml;
  (function(Prism3) {
    var string2 = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    Prism3.languages.css = {
      "comment": /\/\*[\s\S]*?\*\//,
      "atrule": {
        pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string2.source + ")*?" + /(?:;|(?=\s*\{))/.source),
        inside: {
          "rule": /^@[\w-]+/,
          "selector-function-argument": {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: true,
            alias: "selector"
          },
          "keyword": {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: true
          }
        }
      },
      "url": {
        pattern: RegExp("\\burl\\((?:" + string2.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
        greedy: true,
        inside: {
          "function": /^url/i,
          "punctuation": /^\(|\)$/,
          "string": {
            pattern: RegExp("^" + string2.source + "$"),
            alias: "url"
          }
        }
      },
      "selector": {
        pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string2.source + ")*(?=\\s*\\{)"),
        lookbehind: true
      },
      "string": {
        pattern: string2,
        greedy: true
      },
      "property": {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: true
      },
      "important": /!important\b/i,
      "function": {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: true
      },
      "punctuation": /[(){};:,]/
    };
    Prism3.languages.css["atrule"].inside.rest = Prism3.languages.css;
    var markup = Prism3.languages.markup;
    if (markup) {
      markup.tag.addInlined("style", "css");
      markup.tag.addAttribute("style", "css");
    }
  })(Prism2);
  Prism2.languages.clike = {
    "comment": [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }
    ],
    "string": {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: true,
      inside: {
        "punctuation": /[.\\]/
      }
    },
    "keyword": /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    "boolean": /\b(?:false|true)\b/,
    "function": /\b\w+(?=\()/,
    "number": /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    "operator": /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    "punctuation": /[{}[\];(),.:]/
  };
  Prism2.languages.javascript = Prism2.languages.extend("clike", {
    "class-name": [
      Prism2.languages.clike["class-name"],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: true
      }
    ],
    "keyword": [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: true
      },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true
      }
    ],
    "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    "number": {
      pattern: RegExp(
        /(^|[^\w$])/.source + "(?:" + (/NaN|Infinity/.source + "|" + /0[bB][01]+(?:_[01]+)*n?/.source + "|" + /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + /\d+(?:_\d+)*n/.source + "|" + /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
      ),
      lookbehind: true
    },
    "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  });
  Prism2.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
  Prism2.languages.insertBefore("javascript", "keyword", {
    "regex": {
      pattern: RegExp(
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: true,
          alias: "language-regex",
          inside: Prism2.languages.regex
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/
      }
    },
    "function-variable": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function"
    },
    "parameter": [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: true,
        inside: Prism2.languages.javascript
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: true,
        inside: Prism2.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: true,
        inside: Prism2.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: true,
        inside: Prism2.languages.javascript
      }
    ],
    "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });
  Prism2.languages.insertBefore("javascript", "string", {
    "hashbang": {
      pattern: /^#!.*/,
      greedy: true,
      alias: "comment"
    },
    "template-string": {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: true,
      inside: {
        "template-punctuation": {
          pattern: /^`|`$/,
          alias: "string"
        },
        "interpolation": {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: true,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            },
            rest: Prism2.languages.javascript
          }
        },
        "string": /[\s\S]+/
      }
    },
    "string-property": {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: true,
      greedy: true,
      alias: "property"
    }
  });
  Prism2.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: true,
      alias: "property"
    }
  });
  if (Prism2.languages.markup) {
    Prism2.languages.markup.tag.addInlined("script", "javascript");
    Prism2.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
      "javascript"
    );
  }
  Prism2.languages.js = Prism2.languages.javascript;
  (function() {
    if (typeof Prism2 === "undefined" || typeof document === "undefined") {
      return;
    }
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    var LOADING_MESSAGE = "Loading\u2026";
    var FAILURE_MESSAGE = function(status, message) {
      return "\u2716 Error " + status + " while fetching file: " + message;
    };
    var FAILURE_EMPTY_MESSAGE = "\u2716 Error: File does not exist or is empty";
    var EXTENSIONS = {
      "js": "javascript",
      "py": "python",
      "rb": "ruby",
      "ps1": "powershell",
      "psm1": "powershell",
      "sh": "bash",
      "bat": "batch",
      "h": "c",
      "tex": "latex"
    };
    var STATUS_ATTR = "data-src-status";
    var STATUS_LOADING = "loading";
    var STATUS_LOADED = "loaded";
    var STATUS_FAILED = "failed";
    var SELECTOR = "pre[data-src]:not([" + STATUS_ATTR + '="' + STATUS_LOADED + '"]):not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
    function loadFile(src, success, error) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", src, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status < 400 && xhr.responseText) {
            success(xhr.responseText);
          } else {
            if (xhr.status >= 400) {
              error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
            } else {
              error(FAILURE_EMPTY_MESSAGE);
            }
          }
        }
      };
      xhr.send(null);
    }
    function parseRange(range) {
      var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || "");
      if (m) {
        var start2 = Number(m[1]);
        var comma = m[2];
        var end2 = m[3];
        if (!comma) {
          return [start2, start2];
        }
        if (!end2) {
          return [start2, void 0];
        }
        return [start2, Number(end2)];
      }
      return void 0;
    }
    Prism2.hooks.add("before-highlightall", function(env) {
      env.selector += ", " + SELECTOR;
    });
    Prism2.hooks.add("before-sanity-check", function(env) {
      var pre = env.element;
      if (pre.matches(SELECTOR)) {
        env.code = "";
        pre.setAttribute(STATUS_ATTR, STATUS_LOADING);
        var code = pre.appendChild(document.createElement("CODE"));
        code.textContent = LOADING_MESSAGE;
        var src = pre.getAttribute("data-src");
        var language = env.language;
        if (language === "none") {
          var extension = (/\.(\w+)$/.exec(src) || [, "none"])[1];
          language = EXTENSIONS[extension] || extension;
        }
        Prism2.util.setLanguage(code, language);
        Prism2.util.setLanguage(pre, language);
        var autoloader = Prism2.plugins.autoloader;
        if (autoloader) {
          autoloader.loadLanguages(language);
        }
        loadFile(
          src,
          function(text) {
            pre.setAttribute(STATUS_ATTR, STATUS_LOADED);
            var range = parseRange(pre.getAttribute("data-range"));
            if (range) {
              var lines = text.split(/\r\n?|\n/g);
              var start2 = range[0];
              var end2 = range[1] == null ? lines.length : range[1];
              if (start2 < 0) {
                start2 += lines.length;
              }
              start2 = Math.max(0, Math.min(start2 - 1, lines.length));
              if (end2 < 0) {
                end2 += lines.length;
              }
              end2 = Math.max(0, Math.min(end2, lines.length));
              text = lines.slice(start2, end2).join("\n");
              if (!pre.hasAttribute("data-start")) {
                pre.setAttribute("data-start", String(start2 + 1));
              }
            }
            code.textContent = text;
            Prism2.highlightElement(code);
          },
          function(error) {
            pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
            code.textContent = error;
          }
        );
      }
    });
    Prism2.plugins.fileHighlight = {
      highlight: function highlight(container) {
        var elements = (container || document).querySelectorAll(SELECTOR);
        for (var i = 0, element; element = elements[i++]; ) {
          Prism2.highlightElement(element);
        }
      }
    };
    var logged = false;
    Prism2.fileHighlight = function() {
      if (!logged) {
        console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.");
        logged = true;
      }
      Prism2.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  })();
})(prism);
var Prism$1 = prism.exports;
var style$a = 'code[class*=language-],pre[class*=language-]{text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:1em;line-height:1.5em;tab-size:4;hyphens:none}code[class*=language-]::selection,pre[class*=language-]::selection,code[class*=language-] ::selection,pre[class*=language-] ::selection{background:#d6dbe3;color:#263238}:not(pre)>code[class*=language-]{white-space:normal;border-radius:.2em;padding:.1em}pre[class*=language-]{overflow:auto;position:relative}.language-css>code,.language-sass>code,.language-scss>code{color:#c24c08}[class*=language-] .namespace{opacity:.7}.token.atrule{color:#6d3bac}.token.attr-name{color:#007edf}.token.attr-value,.token.attribute{color:#d29c00}.token.boolean{color:#6d3bac}.token.builtin,.token.cdata,.token.char,.token.class{color:#007edf}.token.class-name{color:#003cbf}.token.comment{color:#97a3b7}.token.constant{color:#6d3bac}.token.deleted{color:#b01531}.token.doctype{color:#97a3b7}.token.entity{color:#b01531}.token.function{color:#6d3bac}.token.hexcode{color:#c24c08}.token.id,.token.important{color:#6d3bac;font-weight:700}.token.inserted{color:#007edf}.token.keyword{color:#6d3bac}.token.number{color:#c24c08}.token.operator{color:#007edf}.token.prolog{color:#97a3b7}.token.property{color:#007edf}.token.pseudo-class,.token.pseudo-element{color:#d29c00}.token.punctuation{color:#007edf}.token.regex{color:#003cbf}.token.selector{color:#b01531}.token.string{color:#d29c00}.token.symbol{color:#6d3bac}.token.tag{color:#b01531}.token.unit{color:#c24c08}.token.url,.token.variable{color:#b01531}:root[theme-mode=dark] code[class*=language-],:root[theme-mode=dark] pre[class*=language-]{text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:1em;line-height:1.5em;tab-size:4;hyphens:none}:root[theme-mode=dark] code[class*=language-]::selection,:root[theme-mode=dark] pre[class*=language-]::selection,:root[theme-mode=dark] code[class*=language-] ::selection,:root[theme-mode=dark] pre[class*=language-] ::selection{background:#d6dbe3;color:#263238}:root[theme-mode=dark] :not(pre)>code[class*=language-]{white-space:normal;border-radius:.2em;padding:.1em}:root[theme-mode=dark] pre[class*=language-]{overflow:auto;position:relative}:root[theme-mode=dark] .language-css>code,:root[theme-mode=dark] .language-sass>code,:root[theme-mode=dark] .language-scss>code{color:#f2995f}:root[theme-mode=dark] [class*=language-] .namespace{opacity:.7}:root[theme-mode=dark] .token.atrule{color:#ae78f0}:root[theme-mode=dark] .token.attr-name{color:#3280ff}:root[theme-mode=dark] .token.attr-value{color:#fbca25}:root[theme-mode=dark] .token.attribute{color:#fbca25}:root[theme-mode=dark] .token.boolean{color:#ae78f0}:root[theme-mode=dark] .token.builtin{color:#3280ff}:root[theme-mode=dark] .token.cdata{color:#3280ff}:root[theme-mode=dark] .token.char{color:#3280ff}:root[theme-mode=dark] .token.class{color:#3280ff}:root[theme-mode=dark] .token.class-name{color:#5cc5fc}:root[theme-mode=dark] .token.comment{color:#97a3b7}:root[theme-mode=dark] .token.constant{color:#ae78f0}:root[theme-mode=dark] .token.deleted{color:#48c79c}:root[theme-mode=dark] .token.doctype{color:#97a3b7}:root[theme-mode=dark] .token.entity{color:#48c79c}:root[theme-mode=dark] .token.function{color:#ae78f0}:root[theme-mode=dark] .token.hexcode{color:#f2995f}:root[theme-mode=dark] .token.id{color:#ae78f0;font-weight:700}:root[theme-mode=dark] .token.important{color:#f6c;font-weight:700}:root[theme-mode=dark] .token.inserted{color:#3280ff}:root[theme-mode=dark] .token.keyword{color:#f6c}:root[theme-mode=dark] .token.number{color:#f2995f}:root[theme-mode=dark] .token.operator{color:#3280ff}:root[theme-mode=dark] .token.prolog{color:#97a3b7}:root[theme-mode=dark] .token.property{color:#3280ff}:root[theme-mode=dark] .token.pseudo-class{color:#fbca25}:root[theme-mode=dark] .token.pseudo-element{color:#fbca25}:root[theme-mode=dark] .token.punctuation{color:#3280ff}:root[theme-mode=dark] .token.regex{color:#5cc5fc}:root[theme-mode=dark] .token.selector{color:#f36d78}:root[theme-mode=dark] .token.string{color:#fbca25}:root[theme-mode=dark] .token.symbol{color:#f6c}:root[theme-mode=dark] .token.tag{color:#48c79c}:root[theme-mode=dark] .token.unit{color:#f2995f}:root[theme-mode=dark] .token.url{color:#48c79c}:root[theme-mode=dark] .token.variable{color:#48c79c}.TDesign-doc-demo{margin:24px 0 48px;background-color:var(--bg-color-demo);color:var(--text-primary);border:1px solid var(--component-border);border-radius:6px}.TDesign-doc-demo.open{background:var(--bg-color-code)}.TDesign-doc-demo.open .TDesign-doc-demo__footer{border-radius:6px}.TDesign-doc-demo.open .TDesign-doc-demo__btns{position:relative}.TDesign-doc-demo.open .TDesign-doc-demo__btns:after{content:"";width:100%;height:20px;position:absolute;top:100%;left:0;z-index:1;background:var(--bg-color-code-linear)}.TDesign-doc-demo.open .TDesign-doc-demo__btns .action:hover{background-color:var(--bg-color-component-hover)}.TDesign-doc-demo__footer{border-radius:0 0 5px 5px}.TDesign-doc-demo__btns{height:48px;padding:8px;display:flex;justify-content:flex-end;column-gap:8px;align-items:center;box-sizing:border-box}.TDesign-doc-demo__btns .action{height:32px;width:32px;padding:8px;box-sizing:border-box;border-radius:var(--border-radius);cursor:pointer;user-select:none;transition:all .1s;display:inline-flex;color:var(--text-secondary)}.TDesign-doc-demo__btns .action:hover{color:var(--text-primary);background-color:var(--bg-color-demo-hover)}.TDesign-doc-demo__btns .action.active{color:var(--text-primary);background-color:var(--bg-color-demo-select)}.TDesign-doc-demo__code{border-radius:0 0 6px 6px;overflow:hidden;max-height:560px}.TDesign-doc-demo__code pre{margin:0;padding:20px 24px;max-height:560px;box-sizing:border-box;overflow:auto;background:var(--bg-color-code);color:var(--text-primary);border-top:1px solid var(--component-border)}.TDesign-doc-demo__code pre:hover::-webkit-scrollbar-thumb{background-color:var(--bg-color-scroll)}.TDesign-doc-demo__code pre::-webkit-scrollbar{width:12px;height:12px;background:transparent}.TDesign-doc-demo__code pre::-webkit-scrollbar-corner{width:0}.TDesign-doc-demo__code pre::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:transparent}\n';
var codeIcon = '<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" d="M10.3736 0.498413L11.581 0.821937L7.69869 15.3108L6.49128 14.9873L10.3736 0.498413Z" />\n  <path fill="currentColor" d="M13.687 2.66028L17.3046 6.79909C17.8786 7.45583 17.9195 8.41353 17.4255 9.11321L17.3115 9.25899L13.6894 13.4505L12.7436 12.6332C12.7436 12.6332 16.645 8.25979 16.5103 8.0325L12.7459 3.4829L13.687 2.66028Z" />\n  <path fill="currentColor" d="M0.667582 6.90809L3.84161 2.67255L4.8419 3.42215L1.51505 7.99998C1.41314 8.20784 4.8419 12.6428 4.8419 12.6428L3.84161 13.3924L0.667582 9.1569L0.5612 8.99891C0.171134 8.35104 0.206595 7.52325 0.667582 6.90809Z" />\n</svg>\n';
Prism.languages.markup = {
  "comment": {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: true
  },
  "prolog": {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: true
  },
  "doctype": {
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: true,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null
      },
      "string": {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true
      },
      "punctuation": /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      "name": /[^\s<>'"]+/
    }
  },
  "cdata": {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: true
  },
  "tag": {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      "tag": {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          "punctuation": /^<\/?/,
          "namespace": /^[^\s>\/:]+:/
        }
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          "punctuation": [
            {
              pattern: /^=/,
              alias: "attr-equals"
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }
          ]
        }
      },
      "punctuation": /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          "namespace": /^[^\s>\/:]+:/
        }
      }
    }
  },
  "entity": [
    {
      pattern: /&[\da-z]{1,8};/i,
      alias: "named-entity"
    },
    /&#x?[\da-f]{1,8};/i
  ]
};
Prism.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism.languages.markup["entity"];
Prism.languages.markup["doctype"].inside["internal-subset"].inside = Prism.languages.markup;
Prism.hooks.add("wrap", function(env) {
  if (env.type === "entity") {
    env.attributes["title"] = env.content.replace(/&amp;/, "&");
  }
});
Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  value: function addInlined(tagName, lang2) {
    var includedCdataInside = {};
    includedCdataInside["language-" + lang2] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang2]
    };
    includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
    var inside = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside
      }
    };
    inside["language-" + lang2] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang2]
    };
    var def = {};
    def[tagName] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
        return tagName;
      }), "i"),
      lookbehind: true,
      greedy: true,
      inside
    };
    Prism.languages.insertBefore("markup", "cdata", def);
  }
});
Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
  value: function(attrName, lang2) {
    Prism.languages.markup.tag.inside["special-attr"].push({
      pattern: RegExp(
        /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
        "i"
      ),
      lookbehind: true,
      inside: {
        "attr-name": /^[^\s=]+/,
        "attr-value": {
          pattern: /=[\s\S]+/,
          inside: {
            "value": {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: true,
              alias: [lang2, "language-" + lang2],
              inside: Prism.languages[lang2]
            },
            "punctuation": [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              /"|'/
            ]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend("markup", {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;
(function(Prism2) {
  var string2 = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  Prism2.languages.css = {
    "comment": /\/\*[\s\S]*?\*\//,
    "atrule": {
      pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string2.source + ")*?" + /(?:;|(?=\s*\{))/.source),
      inside: {
        "rule": /^@[\w-]+/,
        "selector-function-argument": {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: true,
          alias: "selector"
        },
        "keyword": {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true
        }
      }
    },
    "url": {
      pattern: RegExp("\\burl\\((?:" + string2.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
      greedy: true,
      inside: {
        "function": /^url/i,
        "punctuation": /^\(|\)$/,
        "string": {
          pattern: RegExp("^" + string2.source + "$"),
          alias: "url"
        }
      }
    },
    "selector": {
      pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string2.source + ")*(?=\\s*\\{)"),
      lookbehind: true
    },
    "string": {
      pattern: string2,
      greedy: true
    },
    "property": {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: true
    },
    "important": /!important\b/i,
    "function": {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: true
    },
    "punctuation": /[(){};:,]/
  };
  Prism2.languages.css["atrule"].inside.rest = Prism2.languages.css;
  var markup = Prism2.languages.markup;
  if (markup) {
    markup.tag.addInlined("style", "css");
    markup.tag.addAttribute("style", "css");
  }
})(Prism);
(function(Prism2) {
  var javascript = Prism2.util.clone(Prism2.languages.javascript);
  var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
  function re(source, flags) {
    source = source.replace(/<S>/g, function() {
      return space;
    }).replace(/<BRACES>/g, function() {
      return braces;
    }).replace(/<SPREAD>/g, function() {
      return spread;
    });
    return RegExp(source, flags);
  }
  spread = re(spread).source;
  Prism2.languages.jsx = Prism2.languages.extend("markup", javascript);
  Prism2.languages.jsx.tag.pattern = re(
    /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
  );
  Prism2.languages.jsx.tag.inside["tag"].pattern = /^<\/?[^\s>\/]*/;
  Prism2.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
  Prism2.languages.jsx.tag.inside["tag"].inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism2.languages.jsx.tag.inside["comment"] = javascript["comment"];
  Prism2.languages.insertBefore("inside", "attr-name", {
    "spread": {
      pattern: re(/<SPREAD>/.source),
      inside: Prism2.languages.jsx
    }
  }, Prism2.languages.jsx.tag);
  Prism2.languages.insertBefore("inside", "special-attr", {
    "script": {
      pattern: re(/=<BRACES>/.source),
      alias: "language-javascript",
      inside: {
        "script-punctuation": {
          pattern: /^=(?=\{)/,
          alias: "punctuation"
        },
        rest: Prism2.languages.jsx
      }
    }
  }, Prism2.languages.jsx.tag);
  var stringifyToken = function(token) {
    if (!token) {
      return "";
    }
    if (typeof token === "string") {
      return token;
    }
    if (typeof token.content === "string") {
      return token.content;
    }
    return token.content.map(stringifyToken).join("");
  };
  var walkTokens = function(tokens) {
    var openedTags = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var notTagNorBrace = false;
      if (typeof token !== "string") {
        if (token.type === "tag" && token.content[0] && token.content[0].type === "tag") {
          if (token.content[0].content[0].content === "</") {
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === "/>")
              ;
            else {
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === "punctuation" && token.content === "{") {
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === "punctuation" && token.content === "}") {
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === "string") {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          var plainText = stringifyToken(token);
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === "string" || tokens[i + 1].type === "plain-text")) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === "string" || tokens[i - 1].type === "plain-text")) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism2.Token("plain-text", plainText, null, plainText);
        }
      }
      if (token.content && typeof token.content !== "string") {
        walkTokens(token.content);
      }
    }
  };
  Prism2.hooks.add("after-tokenize", function(env) {
    if (env.language !== "jsx" && env.language !== "tsx") {
      return;
    }
    walkTokens(env.tokens);
  });
})(Prism);
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: true
    }
  ],
  "keyword": [
    {
      pattern: /((?:^|\})\s*)catch\b/,
      lookbehind: true
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }
  ],
  "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  "number": {
    pattern: RegExp(
      /(^|[^\w$])/.source + "(?:" + (/NaN|Infinity/.source + "|" + /0[bB][01]+(?:_[01]+)*n?/.source + "|" + /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + /\d+(?:_\d+)*n/.source + "|" + /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
    ),
    lookbehind: true
  },
  "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore("javascript", "keyword", {
  "regex": {
    pattern: RegExp(
      /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: true,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-delimiter": /^\/|\/$/,
      "regex-flags": /^[a-z]+$/
    }
  },
  "function-variable": {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function"
  },
  "parameter": [
    {
      pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }
  ],
  "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore("javascript", "string", {
  "hashbang": {
    pattern: /^#!.*/,
    greedy: true,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: true,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      "interpolation": {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: true,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      "string": /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: true,
    greedy: true,
    alias: "property"
  }
});
Prism.languages.insertBefore("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: true,
    alias: "property"
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined("script", "javascript");
  Prism.languages.markup.tag.addAttribute(
    /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
    "javascript"
  );
}
Prism.languages.js = Prism.languages.javascript;
(function(Prism2) {
  Prism2.languages.typescript = Prism2.languages.extend("javascript", {
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: true,
      greedy: true,
      inside: null
    },
    "builtin": /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
  });
  Prism2.languages.typescript.keyword.push(
    /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
    /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
    /\btype\b(?=\s*(?:[\{*]|$))/
  );
  delete Prism2.languages.typescript["parameter"];
  delete Prism2.languages.typescript["literal-property"];
  var typeInside = Prism2.languages.extend("typescript", {});
  delete typeInside["class-name"];
  Prism2.languages.typescript["class-name"].inside = typeInside;
  Prism2.languages.insertBefore("typescript", "function", {
    "decorator": {
      pattern: /@[$\w\xA0-\uFFFF]+/,
      inside: {
        "at": {
          pattern: /^@/,
          alias: "operator"
        },
        "function": /^[\s\S]+/
      }
    },
    "generic-function": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
      greedy: true,
      inside: {
        "function": /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
        "generic": {
          pattern: /<[\s\S]+/,
          alias: "class-name",
          inside: typeInside
        }
      }
    }
  });
  Prism2.languages.ts = Prism2.languages.typescript;
})(Prism);
define$2({
  tag: "td-doc-demo",
  code: "",
  language: "jsx",
  showCode: false,
  mode: "auto",
  theme: {
    get: (host, lastValue) => lastValue || sessionStorage.getItem("--tdesign-theme") || "light",
    set: (host, value2) => value2,
    connect(host, key2, invalidate2) {
      function themeChange() {
        const theme = sessionStorage.getItem("--tdesign-theme");
        Object.assign(host, { [key2]: theme });
        invalidate2();
      }
      window.addEventListener("storageChange", themeChange);
      return () => window.removeEventListener("storageChange", themeChange);
    }
  },
  render: (host) => {
    const {
      code,
      language,
      showCode,
      mode: mode2,
      theme
    } = host;
    const highlightCode = Prism$1.highlight(code, Prism$1.languages[language], language);
    const showCodeStyle = {
      transitionDuration: ".2s",
      maxHeight: showCode ? "560px" : 0,
      transitionTimingFunction: showCode ? "cubic-bezier(.82, 0, 1, .9)" : "ease"
    };
    return html`
      <div class="TDesign-doc-demo ${mode2}">
        <slot></slot>
        <div class="TDesign-doc-demo__footer">
          <div class="TDesign-doc-demo__btns">
            <slot name="action"></slot>
            <td-doc-copy code=${code} theme=${mode2 === "open" ? "dark" : "light"}></td-doc-copy>
            ${mode2 === "open" ? html`` : html`<span class="action code ${showCode ? "active" : ""}" onclick=${html.set("showCode", !showCode)} innerHTML=${codeIcon}></span>`}
          </div>
          <div class="TDesign-doc-demo__code ${theme}" style="${showCodeStyle}">
            <pre class="language-${language}"><code class="language-${language}" innerHTML="${highlightCode}"></code></pre>
          </div>
        </div>
      </div>
    `.css`${style$a}`;
  }
});
var style$9 = '.TDesign-doc-copy{height:32px;position:relative}.TDesign-doc-copy.dark .TDesign-doc-copy__inner:hover{background-color:var(--bg-color-component-hover)}.TDesign-doc-copy__inner{height:32px;width:32px;padding:8px;box-sizing:border-box;border-radius:var(--border-radius);cursor:pointer;user-select:none;transition:all .1s;display:inline-flex;color:var(--text-secondary)}.TDesign-doc-copy__inner:hover{color:var(--text-primary);background-color:var(--bg-color-demo-hover)}.TDesign-doc-copy__popup{position:absolute;top:-36px;left:-12px;color:var(--text-primary);border-radius:var(--border-radius);padding:4px 8px;word-break:keep-all;line-height:22px;visibility:hidden;opacity:0;transition:all .2s linear;background-color:var(--bg-color-container);box-shadow:0 3px 14px 2px #0000000d,0 8px 10px 1px #0000000f,0 5px 5px -3px #0000001a}.TDesign-doc-copy__popup:after{content:"";z-index:2;width:0;height:0;border-style:solid;border-width:6px;border-color:transparent;border-top-color:var(--bg-color-container);bottom:-12px;left:50%;position:absolute;margin-left:-6px;font-size:12px}.TDesign-doc-copy__popup.show{opacity:1;visibility:visible}\n';
var copyIcon = '<svg width="16" height="16" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4.24985 0.249871C3.55956 0.249951 3 0.809572 3 1.49987V14C3 14.6904 3.55964 15.25 4.25 15.25H14.25C14.9404 15.25 15.5 14.6904 15.5 14V5.2489C15.5 4.91698 15.368 4.59868 15.1331 4.36419L11.3763 0.61444C11.1419 0.380487 10.8243 0.249107 10.4931 0.249146L4.24985 0.249871ZM10.4933 1.49915L4.25 1.49987V14H14.25V6.50002L9.25 6.50001V1.50001L10.4933 1.49915ZM10.5 5.25002H14.25L10.5 1.50587V5.25002Z" />\n  <path fill="currentColor" d="M0.5 5.25001V16.5C0.5 17.1904 1.05964 17.75 1.75 17.75L14.25 17.75V16.5L1.88889 16.5V5.25001H0.5Z" />\n</svg>';
function handleCopy(host) {
  if ("clipboard" in navigator) {
    navigator.clipboard.writeText(host.code).then(() => {
      Object.assign(host, { showTip: true });
      setTimeout(() => Object.assign(host, { showTip: false }), 800);
      dispatch$1(host, "copy", { detail: host.code });
    });
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.textContent = host.code;
  textarea.style.width = 0;
  textarea.style.height = 0;
  document.body.appendChild(textarea);
  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
  document.body.removeChild(textarea);
  dispatch$1(host, "copy", { detail: host.code });
}
define$2({
  tag: "td-doc-copy",
  code: "",
  render: () => html`
    <td-tooltip duration="800">
      <div class="TDesign-doc-copy__inner" innerHTML=${copyIcon} onclick=${handleCopy}></div>
      <span slot="content">已复制</span>
    </td-tooltip>
  `.css`${style$9}`
});
var style$8 = ".TDesign-doc-empty .light{display:var(--theme-block-light-display)}.TDesign-doc-empty .dark{display:var(--theme-block-dark-display)}.TDesign-doc-empty__design{display:flex;justify-content:center;align-items:center;padding:48px;border:1px solid var(--component-border);border-radius:6px}.TDesign-doc-empty__design img{width:50%;height:auto;min-width:240px}\n";
function renderEmpty(type) {
  if (type === "design") {
    return html`
      <div class="TDesign-doc-empty__design">
        <img class="light" src="https://tdesign.gtimg.com/site/webcomponents/empty-light.png" />
        <img class="dark" src="https://tdesign.gtimg.com/site/webcomponents/empty-dark.png" />
      </div>
    `;
  }
}
define$2({
  tag: "td-doc-empty",
  type: "design",
  render: (host) => {
    const { type } = host;
    return html`
      <div class="TDesign-doc-empty">
        ${renderEmpty(type)}
      </div>
    `.css`${style$8}`;
  }
});
var style$7 = ":host{font-size:14px;line-height:24px}.TDesign-doc-history{padding:7px 12px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;color:var(--text-primary);background-color:var(--bg-color-code);border:1px solid var(--component-border)}.TDesign-doc-history .icon{margin-right:8px;display:inline-flex}.TDesign-doc-history .icon svg{color:var(--text-placeholder)}.TDesign-doc-history .text{margin-right:4px;color:var(--text-secondary)}\n";
var historyIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path\n    d="M7.90582 2.79363C10.8499 2.79364 13.2095 5.14029 13.2095 8.00195C13.2095 10.8636 10.8499 13.2103 7.90581 13.2103C5.44426 13.2103 3.39128 11.5698 2.78447 9.35939L1.75098 9.52803C2.44243 12.2422 4.93584 14.252 7.90581 14.252C11.4103 14.252 14.2512 11.4537 14.2512 8.00196C14.2512 4.55018 11.4103 1.75195 7.90582 1.75195C5.80622 1.75195 3.9448 2.75638 2.78981 4.304L2.78981 2.6451H1.75098V5.7916C1.75098 6.06774 1.97483 6.2916 2.25098 6.2916L5.37759 6.2916V5.24707H3.40454C4.33896 3.77709 5.99992 2.79363 7.90582 2.79363Z"\n    fill="currentColor" />\n  <path d="M6.99951 5.50024V8.38917L9.64596 11.0356L10.3531 10.3285L7.99951 7.97496V5.50024H6.99951Z" fill="currentColor" />\n</svg>';
function transformTime(time) {
  let text = time;
  if (/^\d+$/.test(time)) {
    text = new Date(parseFloat(time)).toLocaleString("en-US");
  }
  return text;
}
define$2({
  tag: "td-doc-history",
  time: "",
  content: "",
  render: ({ time, content }) => {
    return html`
      <div class="TDesign-doc-history">
        <i class="icon" innerHTML="${historyIcon}"></i>
        ${content ? content : html`
          <span class="text">Last Update: </span>
          ${transformTime(time)}
        `}
      </div>
    `.css`${style$7}`;
  }
});
var style$6 = "code[class*=language-],pre[class*=language-]{text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:1em;line-height:1.5em;tab-size:4;hyphens:none}code[class*=language-]::selection,pre[class*=language-]::selection,code[class*=language-] ::selection,pre[class*=language-] ::selection{background:#d6dbe3;color:#263238}:not(pre)>code[class*=language-]{white-space:normal;border-radius:.2em;padding:.1em}pre[class*=language-]{overflow:auto;position:relative}.language-css>code,.language-sass>code,.language-scss>code{color:#c24c08}[class*=language-] .namespace{opacity:.7}.token.atrule{color:#6d3bac}.token.attr-name{color:#007edf}.token.attr-value,.token.attribute{color:#d29c00}.token.boolean{color:#6d3bac}.token.builtin,.token.cdata,.token.char,.token.class{color:#007edf}.token.class-name{color:#003cbf}.token.comment{color:#97a3b7}.token.constant{color:#6d3bac}.token.deleted{color:#b01531}.token.doctype{color:#97a3b7}.token.entity{color:#b01531}.token.function{color:#6d3bac}.token.hexcode{color:#c24c08}.token.id,.token.important{color:#6d3bac;font-weight:700}.token.inserted{color:#007edf}.token.keyword{color:#6d3bac}.token.number{color:#c24c08}.token.operator{color:#007edf}.token.prolog{color:#97a3b7}.token.property{color:#007edf}.token.pseudo-class,.token.pseudo-element{color:#d29c00}.token.punctuation{color:#007edf}.token.regex{color:#003cbf}.token.selector{color:#b01531}.token.string{color:#d29c00}.token.symbol{color:#6d3bac}.token.tag{color:#b01531}.token.unit{color:#c24c08}.token.url,.token.variable{color:#b01531}:root[theme-mode=dark] code[class*=language-],:root[theme-mode=dark] pre[class*=language-]{text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:1em;line-height:1.5em;tab-size:4;hyphens:none}:root[theme-mode=dark] code[class*=language-]::selection,:root[theme-mode=dark] pre[class*=language-]::selection,:root[theme-mode=dark] code[class*=language-] ::selection,:root[theme-mode=dark] pre[class*=language-] ::selection{background:#d6dbe3;color:#263238}:root[theme-mode=dark] :not(pre)>code[class*=language-]{white-space:normal;border-radius:.2em;padding:.1em}:root[theme-mode=dark] pre[class*=language-]{overflow:auto;position:relative}:root[theme-mode=dark] .language-css>code,:root[theme-mode=dark] .language-sass>code,:root[theme-mode=dark] .language-scss>code{color:#f2995f}:root[theme-mode=dark] [class*=language-] .namespace{opacity:.7}:root[theme-mode=dark] .token.atrule{color:#ae78f0}:root[theme-mode=dark] .token.attr-name{color:#3280ff}:root[theme-mode=dark] .token.attr-value{color:#fbca25}:root[theme-mode=dark] .token.attribute{color:#fbca25}:root[theme-mode=dark] .token.boolean{color:#ae78f0}:root[theme-mode=dark] .token.builtin{color:#3280ff}:root[theme-mode=dark] .token.cdata{color:#3280ff}:root[theme-mode=dark] .token.char{color:#3280ff}:root[theme-mode=dark] .token.class{color:#3280ff}:root[theme-mode=dark] .token.class-name{color:#5cc5fc}:root[theme-mode=dark] .token.comment{color:#97a3b7}:root[theme-mode=dark] .token.constant{color:#ae78f0}:root[theme-mode=dark] .token.deleted{color:#48c79c}:root[theme-mode=dark] .token.doctype{color:#97a3b7}:root[theme-mode=dark] .token.entity{color:#48c79c}:root[theme-mode=dark] .token.function{color:#ae78f0}:root[theme-mode=dark] .token.hexcode{color:#f2995f}:root[theme-mode=dark] .token.id{color:#ae78f0;font-weight:700}:root[theme-mode=dark] .token.important{color:#f6c;font-weight:700}:root[theme-mode=dark] .token.inserted{color:#3280ff}:root[theme-mode=dark] .token.keyword{color:#f6c}:root[theme-mode=dark] .token.number{color:#f2995f}:root[theme-mode=dark] .token.operator{color:#3280ff}:root[theme-mode=dark] .token.prolog{color:#97a3b7}:root[theme-mode=dark] .token.property{color:#3280ff}:root[theme-mode=dark] .token.pseudo-class{color:#fbca25}:root[theme-mode=dark] .token.pseudo-element{color:#fbca25}:root[theme-mode=dark] .token.punctuation{color:#3280ff}:root[theme-mode=dark] .token.regex{color:#5cc5fc}:root[theme-mode=dark] .token.selector{color:#f36d78}:root[theme-mode=dark] .token.string{color:#fbca25}:root[theme-mode=dark] .token.symbol{color:#f6c}:root[theme-mode=dark] .token.tag{color:#48c79c}:root[theme-mode=dark] .token.unit{color:#f2995f}:root[theme-mode=dark] .token.url{color:#48c79c}:root[theme-mode=dark] .token.variable{color:#48c79c}:host{--context-max-height: 400px}:host td-select{--input-width: 120px}.TDesign-doc-usage{border-radius:6px;border:1px solid var(--component-border);overflow:auto}.TDesign-doc-usage__content{height:var(--context-max-height);background:var(--bg-color-demo);display:flex;justify-content:space-between}.TDesign-doc-usage__render{display:flex;flex:1;flex-direction:column;justify-content:space-between;max-width:calc(100% - 240px)}.TDesign-doc-usage__render-slot{overflow:auto;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;padding:16px;gap:8px;height:100%}.TDesign-doc-usage__render-slot::-webkit-scrollbar-corner{width:0}.TDesign-doc-usage__render-slot::-webkit-scrollbar{width:12px;height:12px;background:transparent}.TDesign-doc-usage__render-slot::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:var(--bg-color-scroll)}.TDesign-doc-usage__render-header{min-height:48px;display:flex;box-sizing:border-box;box-shadow:var(--header-box-shadow);overflow:auto hidden;position:relative}.TDesign-doc-usage__render-header .header-panel{padding:8px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.TDesign-doc-usage__render-header .header-panel:hover .panel-inner{background:var(--bg-color-container-hover)}.TDesign-doc-usage__render-header .header-panel .panel-inner{padding:8px;transition:all .2s linear;border-radius:3px}.TDesign-doc-usage__render-header .header-panel .panel-inner.active{color:var(--brand-main)}.TDesign-doc-usage__render-header .active-line{height:1px;position:absolute;left:0;bottom:0px;z-index:10;background:var(--brand-main);transition:all .2s var(--anim-time-fn-easing)}.TDesign-doc-usage__render-footer{height:48px;display:flex;padding:0 8px;flex-shrink:0;justify-content:flex-end;gap:8px;align-items:center;box-sizing:border-box}.TDesign-doc-usage__render-footer .action{height:32px;width:32px;padding:8px;box-sizing:border-box;border-radius:var(--border-radius);cursor:pointer;user-select:none;transition:all .1s;display:inline-flex;color:var(--text-secondary)}.TDesign-doc-usage__render-footer .action:hover{color:var(--text-primary);background-color:var(--bg-color-demo-hover)}.TDesign-doc-usage__render-footer .action.active{color:var(--text-primary);background-color:var(--bg-color-demo-select)}.TDesign-doc-usage__config{width:240px;box-sizing:border-box;flex-shrink:0;border-left:1px solid var(--component-stroke)}.TDesign-doc-usage__config-title{display:flex;height:48px;gap:4px;align-items:center;padding:12px 16px;box-sizing:border-box;border-bottom:1px solid var(--component-stroke)}.TDesign-doc-usage__config-title span{font-size:14px;line-height:24px;color:var(--text-primary)}.TDesign-doc-usage__config-title i{display:inline-flex}.TDesign-doc-usage__config-content{padding:16px;overflow:hidden auto;display:flex;flex-direction:column;gap:12px;max-height:352px;box-sizing:border-box}.TDesign-doc-usage__config-content::-webkit-scrollbar-corner{width:0}.TDesign-doc-usage__config-content::-webkit-scrollbar{width:12px;height:12px;background:transparent}.TDesign-doc-usage__config-content::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:var(--bg-color-scroll)}.TDesign-doc-usage__config-divider{width:100%;border-top:1px solid var(--component-stroke)}.TDesign-doc-usage__config-list{display:flex;flex-direction:column;gap:4px;list-style:none;margin:0;padding:0}.TDesign-doc-usage__config-list .item{display:inline-flex;align-items:center;height:32px;justify-content:space-between}.TDesign-doc-usage__config-list .item .name{width:90%;overflow:hidden;text-overflow:ellipsis;color:var(--text-secondary)}.TDesign-doc-usage__code{border-radius:0 0 6px 6px;overflow:hidden;max-height:240px}.TDesign-doc-usage__code pre{margin:0;padding:20px 24px;max-height:240px;box-sizing:border-box;overflow:auto;background:var(--bg-color-code);color:var(--text-primary)}.TDesign-doc-usage__code pre:hover::-webkit-scrollbar-thumb{background-color:var(--bg-color-scroll)}.TDesign-doc-usage__code pre::-webkit-scrollbar{width:12px;height:12px;background:transparent}.TDesign-doc-usage__code pre::-webkit-scrollbar-corner{width:0}.TDesign-doc-usage__code pre::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:transparent}\n";
var tipsIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M8 1C6.6247 1 5.36829 1.5546 4.46644 2.46644C3.5546 3.36829 3 4.6247 3 6C3 7.37457 3.554 8.63036 4.46498 9.53211C4.77388 9.84935 5.12363 10.1126 5.5 10.3289V12C5.5 12.5523 5.94772 13 6.5 13H9.5C10.0523 13 10.5 12.5523 10.5 12V10.3289C10.8764 10.1126 11.2261 9.84935 11.535 9.5321C12.446 8.63036 13 7.37456 13 6C13 3.23386 10.7661 1 8 1Z" fill="#FFBD2E"/>\n<path d="M6 14C5.72386 14 5.5 14.2239 5.5 14.5C5.5 14.7761 5.72386 15 6 15H10C10.2761 15 10.5 14.7761 10.5 14.5C10.5 14.2239 10.2761 14 10 14H6Z" fill="#FFBD2E"/>\n</svg>\n';
function getLineStyle$1(host) {
  const { panelList, panel } = host;
  const index = panelList.findIndex((p) => p.value === panel);
  if (index === -1 || !host.shadowRoot)
    return "";
  const panelEls = host.shadowRoot.querySelectorAll(".header-panel");
  const { offsetLeft, offsetWidth } = panelEls[index];
  return `width: ${offsetWidth}px; left: ${offsetLeft}px`;
}
function handleConfigChange(host, e, item) {
  const { detail } = e;
  dispatch$1(host, "ConfigChange", {
    detail: { value: detail.value, name: item.name, type: item.type }
  });
}
function renderConfig(configList = []) {
  const booleanList = [];
  const enumList = [];
  configList.forEach((item) => {
    if (/boolean/i.test(item.type))
      booleanList.push(item);
    if (/enum/i.test(item.type))
      enumList.push(item);
  });
  return html`
    ${booleanList.length ? html`
          <ul class="TDesign-doc-usage__config-list">
            ${booleanList.map(
    (item) => html`
                <li class="item">
                  <span class="name" title="${item.name}">${item.name}</span>
                  <td-switch
                    size="small"
                    value="${item.defaultValue}"
                    onchange="${(host, e) => handleConfigChange(host, e, item)}"
                  ></td-switch>
                </li>
              `
  )}
          </ul>
        ` : ""}
    ${enumList.length ? html`
          ${booleanList.length ? html`<div class="TDesign-doc-usage__config-divider"></div>` : ""}
          <ul class="TDesign-doc-usage__config-list">
            ${enumList.map(
    (item) => html`
                <li class="item">
                  <span class="name" title="${item.name}">${item.name}</span>
                  <td-select
                    borderless
                    value="${item.defaultValue}"
                    options="${item.options}"
                    onchange="${(host, e) => handleConfigChange(host, e, item)}"
                  ></td-select>
                </li>
              `
  )}
          </ul>
        ` : ""}
  `;
}
define$2({
  tag: "td-doc-usage",
  code: "",
  showCode: false,
  language: "markup",
  panel: {
    set: (host, value2, lastValue) => {
      if (value2 && lastValue !== value2) {
        dispatch$1(host, "PanelChange", { detail: { value: value2 } });
      }
      return value2;
    },
    get: (host, lastValue) => {
      var _a;
      return lastValue || ((_a = host.panelList[0]) == null ? void 0 : _a.value);
    },
    observe: (host) => {
      if (!host.shadowRoot)
        return;
      const lineEl = host.shadowRoot.querySelector(".active-line");
      lineEl.style = getLineStyle$1(host);
    }
  },
  panelList: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value2) => value2
  },
  configList: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value2) => value2
  },
  render: (host) => {
    const { code, language, showCode, configList, panelList, panel } = host;
    const highlightCode = Prism$1.highlight(
      code,
      Prism$1.languages[language],
      language
    );
    const showCodeStyle = {
      transitionDuration: ".2s",
      maxHeight: showCode ? "240px" : 0,
      transitionTimingFunction: showCode ? "cubic-bezier(.82, 0, 1, .9)" : "ease"
    };
    return html`
      <div class="TDesign-doc-usage">
        <div class="TDesign-doc-usage__content">
          <div class="TDesign-doc-usage__render">
            <div class="TDesign-doc-usage__render-header">
              ${panelList.map((item) => html`
                <div class="header-panel" onclick="${html.set("panel", item.value)}">
                  <span class="panel-inner ${panel === item.value ? "active" : ""}">${item.label}</span>
                </div>
              `)}

              <span class="active-line"></span>
            </div>

            <slot name="${panel}" class="TDesign-doc-usage__render-slot"></slot>

            <div class="TDesign-doc-usage__render-footer">
              <slot name="action"></slot>
              <td-doc-copy code=${code}></td-doc-copy>
              <span
                class="action code ${showCode ? "active" : ""}"
                onclick=${html.set("showCode", !showCode)}
                innerHTML=${codeIcon}
              ></span>
            </div>
          </div>

          <div class="TDesign-doc-usage__config">
            <div class="TDesign-doc-usage__config-title">
              <i innerHTML="${tipsIcon}"></i>
              <span>配置</span>
            </div>

            <div class="TDesign-doc-usage__config-content">
              ${renderConfig(configList)}
            </div>

          </div>
        </div>
        <div class="TDesign-doc-usage__code" style="${showCodeStyle}">
          <pre
            class="language-${language}"
          ><code class="language-${language}" innerHTML="${highlightCode}"></code></pre>
        </div>
      </div>
    `.css`${style$6}`;
  }
});
var style$5 = ":host{display:inline;line-height:calc(100% + 8px);font-size:12px;margin:0 2px;padding:2px 6px;border-radius:3px;color:var(--error-8);background:var(--error-1)}.TDesign-code{font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace}\n";
define$2({
  tag: "td-code",
  text: "",
  render: ({ text }) => html`
    <code class="TDesign-code">${text}</code>
  `.css`${style$5}`
});
var style$4 = "code[class*=language-],pre[class*=language-]{text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:1em;line-height:1.5em;tab-size:4;hyphens:none}code[class*=language-]::selection,pre[class*=language-]::selection,code[class*=language-] ::selection,pre[class*=language-] ::selection{background:#d6dbe3;color:#263238}:not(pre)>code[class*=language-]{white-space:normal;border-radius:.2em;padding:.1em}pre[class*=language-]{overflow:auto;position:relative}.language-css>code,.language-sass>code,.language-scss>code{color:#c24c08}[class*=language-] .namespace{opacity:.7}.token.atrule{color:#6d3bac}.token.attr-name{color:#007edf}.token.attr-value,.token.attribute{color:#d29c00}.token.boolean{color:#6d3bac}.token.builtin,.token.cdata,.token.char,.token.class{color:#007edf}.token.class-name{color:#003cbf}.token.comment{color:#97a3b7}.token.constant{color:#6d3bac}.token.deleted{color:#b01531}.token.doctype{color:#97a3b7}.token.entity{color:#b01531}.token.function{color:#6d3bac}.token.hexcode{color:#c24c08}.token.id,.token.important{color:#6d3bac;font-weight:700}.token.inserted{color:#007edf}.token.keyword{color:#6d3bac}.token.number{color:#c24c08}.token.operator{color:#007edf}.token.prolog{color:#97a3b7}.token.property{color:#007edf}.token.pseudo-class,.token.pseudo-element{color:#d29c00}.token.punctuation{color:#007edf}.token.regex{color:#003cbf}.token.selector{color:#b01531}.token.string{color:#d29c00}.token.symbol{color:#6d3bac}.token.tag{color:#b01531}.token.unit{color:#c24c08}.token.url,.token.variable{color:#b01531}:root[theme-mode=dark] code[class*=language-],:root[theme-mode=dark] pre[class*=language-]{text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:1em;line-height:1.5em;tab-size:4;hyphens:none}:root[theme-mode=dark] code[class*=language-]::selection,:root[theme-mode=dark] pre[class*=language-]::selection,:root[theme-mode=dark] code[class*=language-] ::selection,:root[theme-mode=dark] pre[class*=language-] ::selection{background:#d6dbe3;color:#263238}:root[theme-mode=dark] :not(pre)>code[class*=language-]{white-space:normal;border-radius:.2em;padding:.1em}:root[theme-mode=dark] pre[class*=language-]{overflow:auto;position:relative}:root[theme-mode=dark] .language-css>code,:root[theme-mode=dark] .language-sass>code,:root[theme-mode=dark] .language-scss>code{color:#f2995f}:root[theme-mode=dark] [class*=language-] .namespace{opacity:.7}:root[theme-mode=dark] .token.atrule{color:#ae78f0}:root[theme-mode=dark] .token.attr-name{color:#3280ff}:root[theme-mode=dark] .token.attr-value{color:#fbca25}:root[theme-mode=dark] .token.attribute{color:#fbca25}:root[theme-mode=dark] .token.boolean{color:#ae78f0}:root[theme-mode=dark] .token.builtin{color:#3280ff}:root[theme-mode=dark] .token.cdata{color:#3280ff}:root[theme-mode=dark] .token.char{color:#3280ff}:root[theme-mode=dark] .token.class{color:#3280ff}:root[theme-mode=dark] .token.class-name{color:#5cc5fc}:root[theme-mode=dark] .token.comment{color:#97a3b7}:root[theme-mode=dark] .token.constant{color:#ae78f0}:root[theme-mode=dark] .token.deleted{color:#48c79c}:root[theme-mode=dark] .token.doctype{color:#97a3b7}:root[theme-mode=dark] .token.entity{color:#48c79c}:root[theme-mode=dark] .token.function{color:#ae78f0}:root[theme-mode=dark] .token.hexcode{color:#f2995f}:root[theme-mode=dark] .token.id{color:#ae78f0;font-weight:700}:root[theme-mode=dark] .token.important{color:#f6c;font-weight:700}:root[theme-mode=dark] .token.inserted{color:#3280ff}:root[theme-mode=dark] .token.keyword{color:#f6c}:root[theme-mode=dark] .token.number{color:#f2995f}:root[theme-mode=dark] .token.operator{color:#3280ff}:root[theme-mode=dark] .token.prolog{color:#97a3b7}:root[theme-mode=dark] .token.property{color:#3280ff}:root[theme-mode=dark] .token.pseudo-class{color:#fbca25}:root[theme-mode=dark] .token.pseudo-element{color:#fbca25}:root[theme-mode=dark] .token.punctuation{color:#3280ff}:root[theme-mode=dark] .token.regex{color:#5cc5fc}:root[theme-mode=dark] .token.selector{color:#f36d78}:root[theme-mode=dark] .token.string{color:#fbca25}:root[theme-mode=dark] .token.symbol{color:#f6c}:root[theme-mode=dark] .token.tag{color:#48c79c}:root[theme-mode=dark] .token.unit{color:#f2995f}:root[theme-mode=dark] .token.url{color:#48c79c}:root[theme-mode=dark] .token.variable{color:#48c79c}:host{display:block}.TDesign-code-block{font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;border-radius:6px;border:1px solid var(--component-border);position:relative}.TDesign-code-block td-doc-copy{position:absolute;right:8px;top:8px;z-index:10}.TDesign-code-block__header{min-height:48px;display:flex;box-sizing:border-box;box-shadow:var(--header-box-shadow);overflow:auto hidden;position:relative}.TDesign-code-block__header .header-panel{padding:8px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.TDesign-code-block__header .header-panel:hover .panel-inner{background:var(--bg-color-container-hover)}.TDesign-code-block__header .header-panel .panel-inner{padding:8px;transition:all .2s linear;border-radius:3px}.TDesign-code-block__header .header-panel .panel-inner.active{color:var(--brand-main)}.TDesign-code-block__header .active-line{height:1px;position:absolute;left:0;bottom:0px;z-index:10;background:var(--brand-main);transition:all .2s var(--anim-time-fn-easing)}.TDesign-code-block__body{max-height:334px;box-sizing:border-box;background-color:var(--bg-color-code)}.TDesign-code-block__body pre{margin:0;padding:24px;max-height:334px;box-sizing:border-box;overflow:auto;background:var(--bg-color-code);color:var(--text-primary)}.TDesign-code-block__body pre:hover::-webkit-scrollbar-thumb{background-color:var(--bg-color-scroll)}.TDesign-code-block__body pre::-webkit-scrollbar{width:12px;height:12px;background:transparent}.TDesign-code-block__body pre::-webkit-scrollbar-corner{width:0}.TDesign-code-block__body pre::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:transparent}\n";
function getLineStyle(host) {
  const { slotsName, panel } = host;
  const index = (slotsName == null ? void 0 : slotsName.findIndex((s) => s === panel)) || 0;
  if (index === -1 || !host.shadowRoot)
    return "";
  const panelEls = host.shadowRoot.querySelectorAll(".header-panel");
  const { offsetLeft, offsetWidth } = panelEls[index];
  return `width: ${offsetWidth}px; left: ${offsetLeft}px`;
}
function extractSlots(host) {
  const slotsEl = Array.from(host.querySelectorAll("td-code-block > [slot]"));
  const slotsName = [];
  const slotsContentMap = {};
  slotsEl.forEach((s) => {
    slotsName.push(s.slot);
    slotsContentMap[s.slot] = {
      name: s.slot,
      lang: s.lang,
      content: decodeURIComponent(s.innerHTML)
    };
  });
  host.slotsName = slotsName;
  return {
    slotsEl,
    slotsName,
    slotsContentMap
  };
}
define$2({
  tag: "td-code-block",
  panel: {
    get: (host, lastValue) => lastValue || "",
    set: (host, value2) => value2,
    observe: (host) => {
      if (!host.shadowRoot)
        return;
      const lineEl = host.shadowRoot.querySelector(".active-line");
      lineEl.style = getLineStyle(host);
    }
  },
  render: (host) => {
    const { panel } = host;
    const { slotsName, slotsContentMap } = extractSlots(host);
    const slotObj = slotsContentMap[panel];
    const highlightCode = Prism$1.highlight(
      slotObj.content,
      Prism$1.languages[slotObj.lang],
      slotObj.lang
    );
    return html`
      <div class="TDesign-code-block">
        <td-doc-copy code="${slotObj.content}"></td-doc-copy>
        <div class="TDesign-code-block__header">
          ${slotsName.map((slotName) => html`
            <div class="header-panel" onclick="${html.set("panel", slotName)}">
              <span class="panel-inner ${panel === slotName ? "active" : ""}">${slotName}</span>
            </div>
          `)}

          <span class="active-line"></span>
        </div>

        <div class="TDesign-code-block__body">
          <pre class="language-${slotObj.lang}" innerHTML="${highlightCode}"></pre>
        </div>
      </div>
    `.css`${style$4}`;
  }
});
function initStats(statsId, scriptAttrs, statsCallback) {
  if (document.getElementById(statsId))
    return;
  const script = document.createElement("script");
  script.async = true;
  script.id = statsId;
  script.type = "text/javascript";
  Object.keys(scriptAttrs).forEach((key2) => {
    script.setAttribute(key2, scriptAttrs[key2]);
  });
  script.onload = () => {
    statsCallback && statsCallback();
  };
  document.head.appendChild(script);
}
define$2({
  tag: "td-stats",
  dataAccount: "tdesign",
  track: {
    get() {
      return () => {
        window._horizon && window._horizon.track();
        window.pgvMain && window.pgvMain({ repeatApplay: true, virtualURL: location.pathname });
      };
    }
  },
  stats: {
    get: (_host, lastValue) => lastValue || void 0,
    set: (_host, value2) => value2,
    connect: (host) => {
      function registerStats() {
        initStats("horizon-tracker", {
          "data-account": host.dataAccount,
          src: "https://horizon-assets.qq.com/analytics.js"
        });
        initStats("__td_tcss__", {
          src: "https://pingjs.qq.com/tcss.ping.https.js"
        }, () => {
          window.pgvMain && window.pgvMain();
        });
      }
      function handleRouterTrack() {
        requestAnimationFrame(() => {
          window._horizon && window._horizon.track();
          window.pgvMain && window.pgvMain({ repeatApplay: "true", virtualURL: location.pathname });
        });
      }
      window.addEventListener("load", registerStats);
      window.addEventListener("popstate", handleRouterTrack);
      return () => {
        window.removeEventListener("load", registerStats);
        window.removeEventListener("popstate", handleRouterTrack);
      };
    }
  },
  render: () => html`<style>:host { display: none; }</style>`
});
var InfoCircleFilled = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" view-box="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-info-circle-filled"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fill-opacity="0.9"></path></svg>';
var ErrorCircleFilled = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" view-box="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-error-circle-filled"><path fill="currentColor" d="M15 8A7 7 0 101 8a7 7 0 0014 0zM8.5 4v5.5h-1V4h1zm-1.1 7h1.2v1.2H7.4V11z" fill-opacity="0.9"></path></svg>';
var CheckCircleFilled = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" view-box="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-check-circle-filled"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM4.5 8.2l.7-.7L7 9.3l3.8-3.8.7.7L7 10.7 4.5 8.2z" fill-opacity="0.9"></path></svg>';
var HelpCircleFilled = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" view-box="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-help-circle-filled"><path fill="currentColor" d="M15 8A7 7 0 101 8a7 7 0 0014 0zM5.8 6.63a2.2 2.2 0 014.39 0c0 .97-.75 1.72-1.49 2.02a.34.34 0 00-.2.32v.8h-1v-.8c0-.56.33-1.04.82-1.24.5-.2.87-.66.87-1.1a1.2 1.2 0 00-2.39 0h-1zm1.67 4.54a.53.53 0 111.05 0 .53.53 0 01-1.05 0z" fill-opacity="0.9"></path></svg>';
var style$3 = ".TDesign-message .t-message{width:fit-content;font-size:14px;outline:0;border-radius:3px;background-color:var(--bg-color-container);box-shadow:var(--shadow-3),var(--shadow-inset-top),var(--shadow-inset-right),var(--shadow-inset-bottom),var(--shadow-inset-left);box-sizing:border-box;align-items:center;color:var(--text-primary);line-height:22px;padding:13px 16px;position:fixed;top:0;left:50%;display:flex;transform:translate(-50%);transition:top .2s}.TDesign-message .t-message.t-message-enter{top:32px}.TDesign-message .t-message.t-message-leave{top:-100px}.TDesign-message .t-message>.t-icon{color:var(--brand-main);margin-right:8px;font-size:16px}.TDesign-message .t-message.t-is-success>.t-icon{color:var(--success-main)}.TDesign-message .t-message.t-is-warning>.t-icon{color:var(--warning-main)}.TDesign-message .t-message.t-is-error>.t-icon{color:var(--error-main)}\n";
function renderIcon(theme) {
  if (theme === "info")
    return InfoCircleFilled;
  if (theme === "success")
    return CheckCircleFilled;
  if (["warning", "error"].includes(theme))
    return ErrorCircleFilled;
  if (theme === "question")
    return HelpCircleFilled;
}
define$2({
  tag: "td-message",
  theme: "info",
  duration: 3e3,
  zIndex: 5e3,
  content: "",
  showMessage: false,
  show: (host) => ({ content, theme, duration }) => {
    Object.assign(host, {
      showMessage: true,
      content,
      theme: theme || host.theme
    });
    setTimeout(() => {
      Object.assign(host, {
        showMessage: false
      });
    }, duration || host.duration);
  },
  render: (host) => {
    const { theme, zIndex, content, showMessage } = host;
    const icon = renderIcon(theme);
    const finalContent = `${icon}${content}`;
    const styles = {
      zIndex
    };
    const className = ["t-message", `t-is-${theme}`].concat(
      showMessage ? "t-message-enter" : "t-message-leave"
    );
    return html`
      <div class="TDesign-message">
        <div
          style=${styles}
          class="${className}"
          innerHTML=${finalContent}
        ></div>
      </div>
    `.css`${style$3}`;
  }
});
window.showTdMessage = function({ content, duration, theme }) {
  const instanceId = "__tdesign_message__";
  if (!document.getElementById(instanceId)) {
    const messageInstance = document.createElement("td-message");
    messageInstance.setAttribute("id", instanceId);
    document.body.appendChild(messageInstance);
  }
  setTimeout(() => {
    document.getElementById(instanceId).show({ content, duration, theme });
  });
};
var style$2 = ":host{--portal-border-radius: 9px;--portal-filter: blur(6px);--portal-background: var(--bg-color-container-transparent);position:absolute;z-index:3000;opacity:0;visibility:hidden;transition:clip-path .25s var(--anim-time-fn-easing),opacity .25s linear,visibility .25s linear;clip-path:polygon(-10% -10%,110% -10%,110% -10%,-10% -10%)}:host([visible]){opacity:1;visibility:visible;clip-path:polygon(-10% -10%,110% 0%,110% 110%,-10% 110%)}.TDesign-portal{padding:var(--portal-padding, 2px);box-shadow:var(--portal-box-shadow);border-radius:var(--portal-border-radius);background-color:var(--portal-background);backdrop-filter:var(--portal-filter);-webkit-backdrop-filter:var(--portal-filter);box-sizing:border-box;display:block}\n";
define$2({
  tag: "td-portal",
  visible: false,
  portalStyle: "",
  render: (host) => {
    return html`
      ${host.portalStyle ? html`<style>${host.portalStyle}</style>` : ""}
      <slot class="TDesign-portal" name="content"></slot>
    `.css`${style$2}`;
  }
});
var style$1 = ':host{--input-width: 210px}.TDesign-select-input{width:var(--input-width, 100%);display:inline-flex;align-items:center;gap:8px;border:1px solid var(--component-border);border-radius:3px;padding:0 8px;transition:all .2s linear;box-sizing:border-box;height:32px;line-height:32px}.TDesign-select-input:hover{border-color:var(--brand-main)}.TDesign-select-input.focus{border-color:var(--brand-main);box-shadow:0 0 0 2px var(--brand-main-focus)}.TDesign-select-input--borderless{border-color:transparent}.TDesign-select-input--borderless:hover{border-color:var(--component-border)}.TDesign-select-input--borderless.focus{border-color:var(--brand-main);box-shadow:0 0 0 2px var(--brand-main-focus)}.TDesign-select-input__inner{flex:1;border:none;outline:none;padding:0;max-width:100%;min-width:0;color:var(--text-primary);height:100%;background-color:transparent}.TDesign-select-input__inner:read-only{cursor:pointer}.TDesign-select-input .suffix-icon{display:inline-flex}.TDesign-select-input .suffix-icon svg path{transition:d .2s;stroke:currentColor}.TDesign-select-input .suffix-icon.up svg path{d:path("M3.75 10.2002L7.99274 5.7998L12.2361 10.0425")}\n';
var portalStyle = ".td-select-portal{--portal-padding: 0;--portal-filter: none;--portal-border-radius: 3px;--portal-box-shadow: none;--portal-background: var(--bg-color-container)}.TDesign-select-dropdown{width:var(--input-width, 100%);max-height:300px;box-shadow:var(--shadow-1);border-radius:3px;box-sizing:border-box;padding:6px;overflow:auto}.TDesign-select-dropdown::-webkit-scrollbar{width:12px;background:transparent}.TDesign-select-dropdown::-webkit-scrollbar-thumb{border-radius:6px;border:4px solid transparent;background-clip:content-box;background-color:var(--bg-color-scroll)}.TDesign-select-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}.TDesign-select-list__item{list-style:none;cursor:pointer;margin:0;padding:4px 8px;height:28px;line-height:20px;box-sizing:border-box;border-radius:3px;transition:all .2s var(--anim-time-fn-easing)}.TDesign-select-list__item:hover{background:var(--bg-color-container-hover)}.TDesign-select-list__item.is-active{color:var(--brand-main);background-color:var(--brand-main-light)}\n";
function renderOptions(host) {
  const { options = [] } = host;
  function handleItemClick(host2, item) {
    host2.value = item.value;
    requestAnimationFrame(() => {
      host2.visible = false;
    });
    dispatch$1(host2, "change", { detail: { value: host2.value } });
  }
  return html`
    <ul class="TDesign-select-list">
      ${options.map((item) => {
    const isActive2 = item.value == host.value;
    return html`
          <li
            onclick="${(host2) => handleItemClick(host2, item)}"
            class="TDesign-select-list__item ${isActive2 ? "is-active" : ""}"
          >
            ${item.label}
          </li>
        `;
  })}
    </ul>
  `;
}
define$2({
  tag: "td-select",
  borderless: false,
  value: "",
  visible: false,
  options: {
    get: (host, lastValue) => lastValue || [],
    set: (host, value2) => value2
  },
  render: (host) => {
    const { options, value: value2, visible, borderless } = host;
    const activeItem = options.find((item) => item.value == value2) || {};
    const inputValue = activeItem.label || "";
    const selectInputClass = {
      "focus": visible,
      "TDesign-select-input": true,
      "TDesign-select-input--borderless": borderless
    };
    return html`
      <td-doc-popup
        visible="${visible}"
        placement="bottom-start"
        trigger-type="click"
        portal-class="td-select-portal"
        portalStyle="${portalStyle}"
        onvisible-change="${(host2, e) => host2.visible = e.detail.visible}"
      >
        <div class="${selectInputClass}">
          <input
            class="TDesign-select-input__inner"
            readonly
            value="${inputValue}"
          />
          <i
            class="suffix-icon ${visible ? "up" : ""}"
            innerHTML="${fakeArrowIcon}"
          ></i>
        </div>
        <div slot="content" class="TDesign-select-dropdown">${renderOptions(host)}</div>
      </td-doc-popup>
    `.css`${style$1}`;
  }
});
var style = '.TDesign-switch{position:relative;display:inline-flex;vertical-align:middle;align-items:center;outline:none;border:0;padding:0;height:20px;border-radius:10px;min-width:36px;transition:all .2s var(--anim-time-fn-ease-out);background-color:var(--bg-color-thead);cursor:pointer;user-select:none}.TDesign-switch.size-small{min-width:28px;height:16px;line-height:16px;border-radius:8px}.TDesign-switch.size-small .TDesign-switch__handle{width:12px;height:12px}.TDesign-switch.size-large{min-width:44px;height:24px;line-height:24px;border-radius:12px}.TDesign-switch.size-large .TDesign-switch__handle{width:20px;height:20px}.TDesign-switch.is-checked{background-color:var(--brand-main)}.TDesign-switch.is-checked .TDesign-switch__handle{left:calc(100% - 2px);transform:translate(-100%)}.TDesign-switch__handle{position:absolute;display:flex;align-items:center;justify-content:center;top:2px;left:2px;width:16px;height:16px;border-radius:12px;transition:all .2s var(--anim-time-fn-easing)}.TDesign-switch__handle:before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:12px;background-color:var(--text-anti);transition:all .2s var(--anim-time-fn-easing)}.TDesign-switch:active:not(.is-disabled) .TDesign-switch__handle:before{left:0;right:-6px}.TDesign-switch:active:not(.is-disabled).is-checked .TDesign-switch__handle:before{right:0;left:-6px}.TDesign-switch:active:not(.is-disabled) .TDesign-switch__content{opacity:0}\n';
function handleChange(host) {
  host.value = !host.value;
  dispatch$1(host, "change", { detail: { value: host.value } });
}
define$2({
  tag: "td-switch",
  value: false,
  size: "medium",
  render: (host) => {
    const { value: value2, size } = host;
    const switchClass = {
      "TDesign-switch": true,
      "is-checked": value2,
      [`size-${size}`]: size
    };
    return html`
      <button
        type="button"
        class="${switchClass}"
        onclick="${handleChange}"
      >
        <span class="TDesign-switch__handle"></span>
      </button>
    `.css`${style}`;
  }
});
export { getLang, registerLocaleChange };
