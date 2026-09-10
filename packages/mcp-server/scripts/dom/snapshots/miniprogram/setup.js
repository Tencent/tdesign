import simulate from "miniprogram-simulate";
import similateApi from "miniprogram-simulate/src/api";
import { mockAsyncAndPromise, mockSync } from "miniprogram-simulate/src/api/utils";
import simulateCompile from "miniprogram-simulate/src/compile";
import simulateUtils from "miniprogram-simulate/src/utils";
import Path from "path";

// 防止组件 JS 中的 Promise rejection / 异步异常导致进程崩溃
process.on("unhandledRejection", () => {});
process.on("uncaughtException", () => {});

const PACKAGES_ROOT = Path.resolve(__dirname, "../../../../../../../tdesign-miniprogram/packages");
const COMPONENTS_ROOT = Path.join(PACKAGES_ROOT, "components");
const PRO_COMPONENTS_ROOT = Path.join(PACKAGES_ROOT, "pro-components/chat");
const DEMOS_DIR = Path.resolve(__dirname, "../../../../docs/tdesign-miniprogram");
const CHAT_DEMOS_DIR = Path.resolve(__dirname, "../../../../docs/tdesign-miniprogram-chat");
const CUSTOM_DIR = Path.resolve(__dirname, "custom");

/** chat 系列组件（含 attachments）位于 pro-components/chat/ 下 */
const isChatComponent = (name) => name.startsWith("chat-") || name === "attachments";

/**
 * 将 npm 包路径 (tdesign-miniprogram/xxx) 解析为组件源码的绝对路径
 * chat 系列组件从 PRO_COMPONENTS_ROOT 解析，其余从 COMPONENTS_ROOT 解析
 */
function resolveComponentPath(npmPath) {
  const compPath = npmPath.replace("tdesign-miniprogram/", "");
  const compName = compPath.split("/")[0];
  const root = isChatComponent(compName) ? PRO_COMPONENTS_ROOT : COMPONENTS_ROOT;
  return Path.resolve(root, compPath);
}

/**
 * 拦截 miniprogram-simulate 的 readJson，将 usingComponents 中的
 * npm 包路径 (tdesign-miniprogram/xxx) 替换为相对于组件所在目录的相对路径
 */
const originalReadJson = simulateUtils.readJson;
simulateUtils.readJson = function (filePath) {
  const json = originalReadJson.call(this, filePath);
  if (json && json.usingComponents) {
    const componentDir = Path.dirname(filePath);
    const usingComponents = json.usingComponents;
    for (const [key, value] of Object.entries(usingComponents)) {
      if (typeof value === "string" && value.startsWith("tdesign-miniprogram/")) {
        const absolutePath = resolveComponentPath(value);
        usingComponents[key] = Path.relative(componentDir, absolutePath);
      }
    }
  }
  return json;
};

/**
 * 拦截 simulateCompile.getWxml：
 * - demo wxml 结构简单，使用 simulate 纯 JS 编译器（直接读取文件内容）
 * - 组件源码可能含 WXS\template 等复杂语法糖，simulate 编译器会报 "invalid template"，改用 official 编译器
 */
const originalGetWxml = simulateCompile.getWxml;
simulateCompile.getWxml = function (componentPath, config) {
  if (
    componentPath.startsWith(DEMOS_DIR) ||
    componentPath.startsWith(CUSTOM_DIR) ||
    componentPath.startsWith(CHAT_DEMOS_DIR)
  ) {
    return simulateUtils.readFile(`${componentPath}.wxml`);
  }
  return originalGetWxml.call(this, componentPath, config);
};

global.getApp = () => null;
global.Page = (options) => Component(options);
global.getCurrentPages = jest.fn(() => {
  return [
    {
      pageScroller: [jest.fn()]
    }
  ];
});
/**
 * 加载小程序组件
 * @param {string} componentPath - 组件路径（不含扩展名）
 * @param {string} [tagName] - 标签名
 */
global.load = (componentPath, tagName) => {
  const rootPath = isChatComponent(tagName) ? PACKAGES_ROOT : COMPONENTS_ROOT;
  return simulate.load(componentPath, tagName, {
    compiler: "official",
    less: false,
    rootPath,
    compilerOptions: {
      maxBuffer: 1024 * 1024 * 64
    }
  });
};

// 测试环境配置：iPhone 6/7/8 机型
const systemInfo = {
  SDKVersion: "2.19.1",
  batteryLevel: 100,
  benchmarkLevel: 1,
  brand: "devtools",
  fontSizeSetting: 16,
  language: "zh_CN",
  model: "iPhone 6/7/8",
  pixelRatio: 2,
  platform: "devtools",
  screenHeight: 667,
  screenTop: 0,
  screenWidth: 375,
  statusBarHeight: 20,
  system: "iOS 10.0.1",
  theme: "light",
  version: "8.0.5",
  windowHeight: 667,
  windowWidth: 375
};

const menuButtonBoundingClientRect = {
  bottom: 56,
  height: 32,
  left: 281,
  right: 368,
  top: 24,
  width: 87
};

const appBaseInfo = {
  SDKVersion: "2.19.1",
  version: "8.0.5"
};

const windowInfo = {
  pixelRatio: 2,
  screenWidth: 375,
  screenHeight: 667,
  windowWidth: 375,
  windowHeight: 667,
  statusBarHeight: 20,
  screenTop: 0
};

global.wx = {
  ...similateApi,
  getSystemInfo: mockAsyncAndPromise("getSystemInfo", systemInfo),
  getSystemInfoSync: mockSync(systemInfo),
  getMenuButtonBoundingClientRect: mockSync(menuButtonBoundingClientRect),
  getAppBaseInfo: mockSync(appBaseInfo),
  getWindowInfo: mockSync(windowInfo)
};
