import { existsSync, promises as fs } from "fs";
import path from "path";

import {
  addTdPrefix,
  cleanText,
  DOM_RULE_MAP,
  getDirname,
  isChatComponent,
  keepOnlyAttrs,
  MINIPROGRAM_DOM_RULE_MAP,
  UNIAPP_DOM_RULE_MAP,
  type RuleMap
} from "@tdesign-mcp-server/common";
import { TD_DOCS_OUTPUT_DIR } from "../utils/path";

const __dirname = getDirname(import.meta.url);

interface DomConfig {
  /** 平台标识，用于日志输出 */
  platform: string;
  /** 快照文件路径 */
  snapshotPath: string;
  /** 从快照中提取组件名和 DOM 的正则，需包含两个捕获组 */
  regex: RegExp;
  /** DOM 清洗规则 */
  ruleMap: RuleMap;
  /** 输出目录前缀，可以是字符串或根据组件名动态计算的函数 */
  outputPrefix: string | ((compName: string) => string);
  /** 清洗前的预处理 */
  preprocess?: (dom: string) => string;
  /** 只保留指定属性，默认不过滤 */
  keepAttrs?: string[];
}

const configs: DomConfig[] = [
  {
    platform: "web",
    snapshotPath: path.join(__dirname, "./snapshots/web/__snapshots__/setup.test.ts.snap"),
    regex: /exports\[`[^`]+ \[([^\]]+)\] [^\]]+`] = `([\s\S]+?)`;/g,
    ruleMap: DOM_RULE_MAP,
    outputPrefix: "web-dom"
  },
  {
    platform: "web-chat",
    snapshotPath: path.join(__dirname, "./snapshots/web-chat/__snapshots__/setup.test.ts.snap"),
    regex: /exports\[`[^`]+ \[([^\]]+)\] [^\]]+`] = `([\s\S]+?)`;/g,
    ruleMap: DOM_RULE_MAP,
    outputPrefix: "web-chat-dom",
    preprocess: (dom) => {
      let result = dom.trim();
      // 去掉外层引号
      if (result.startsWith('"') && result.endsWith('"')) {
        result = result.slice(1, -1);
      }
      // 去掉外层 <div> 包裹
      result = result.replace(/^\s*<div>\s*([\s\S]*?)\s*<\/div>\s*$/, "$1");
      return result;
    }
  },
  {
    platform: "mobile",
    snapshotPath: path.join(__dirname, "./snapshots/mobile/__snapshots__/setup.test.ts.snap"),
    regex: /exports\[`[^`]+ \[([^\]]+)\] [^\]]+`] = `([\s\S]+?)`;/g,
    ruleMap: DOM_RULE_MAP,
    outputPrefix: "mobile-dom"
  },
  {
    platform: "miniprogram",
    snapshotPath: path.join(__dirname, "./snapshots/miniprogram/__snapshots__/index.test.js.snap"),
    regex: /exports\[`(\S+) demo snapshot 1`] = `([\s\S]+?)`;/g,
    ruleMap: MINIPROGRAM_DOM_RULE_MAP,
    outputPrefix: (compName) => (isChatComponent(compName) ? "miniprogram-chat-dom" : "miniprogram-dom"),
    // 去除最外一层标签
    preprocess: (dom) => dom.replace(/^\s*<[^>]+>\s*([\s\S]*?)\s*<\/[^>]+>\s*$/, "$1")
  },
  {
    platform: "uniapp",
    // 复用小程序的快照文件，通过标签替换和属性清洗生成 uniapp H5 DOM
    snapshotPath: path.join(__dirname, "./snapshots/miniprogram/__snapshots__/index.test.js.snap"),
    regex: /exports\[`(\S+) demo snapshot 1`] = `([\s\S]+?)`;/g,
    ruleMap: UNIAPP_DOM_RULE_MAP,
    outputPrefix: (compName) => (isChatComponent(compName) ? "uniapp-chat-dom" : "uniapp-dom"),
    // 去除最外一层标签（与小程序一致）
    preprocess: (dom) => dom.replace(/^\s*<[^>]+>\s*([\s\S]*?)\s*<\/[^>]+>\s*$/, "$1")
  }
];

(async function main() {
  for (const config of configs) {
    console.log(`--------(${config.platform})--------`);
    if (!existsSync(config.snapshotPath)) {
      console.warn(`✗ Snapshot file not found.`);
      continue;
    }
    await extractAllDom(config);
    console.log(`✓ Extract DOM successfully`);
  }
})();

async function extractAllDom(config: DomConfig) {
  const snapshotContent = await fs.readFile(config.snapshotPath, "utf-8");
  const { regex, ruleMap, outputPrefix, preprocess, keepAttrs } = config;

  let match;
  while ((match = regex.exec(snapshotContent)) !== null) {
    const compName = match[1];
    let compDom = match[2];
    if (preprocess) {
      compDom = preprocess(compDom);
    }
    compDom = cleanText(compDom, ruleMap);
    compDom = keepOnlyAttrs(compDom, ["class", "tClass"]);

    const prefix = typeof outputPrefix === "function" ? outputPrefix(compName) : outputPrefix;
    const compDomPath = path.join(TD_DOCS_OUTPUT_DIR, addTdPrefix(prefix), `${compName}.html`);
    if (!existsSync(compDomPath)) {
      await fs.mkdir(path.dirname(compDomPath), { recursive: true });
    }
    await fs.writeFile(compDomPath, compDom);
  }
}
