import fs from "fs";
import path from "path";

import simulate from "miniprogram-simulate";

const DEMOS_DIR = path.resolve(__dirname, "../../../../docs/tdesign-miniprogram");
const CHAT_DEMOS_DIR = path.resolve(__dirname, "../../../../docs/tdesign-miniprogram-chat");
const CUSTOM_DIR = path.resolve(__dirname, "custom");

const EXCLUDE_COMPS = ["watermark", "config-provider"];

// 获取所有拥有 demo 目录的组件（合并默认目录、chat 目录与 custom 目录）
const defaultComps = fs.readdirSync(DEMOS_DIR).filter((name) => {
  const demoDir = path.join(DEMOS_DIR, name, "demo");
  return fs.existsSync(demoDir) && fs.statSync(path.join(DEMOS_DIR, name)).isDirectory();
});
const chatComps = fs.existsSync(CHAT_DEMOS_DIR)
  ? fs.readdirSync(CHAT_DEMOS_DIR).filter((name) => {
      const demoDir = path.join(CHAT_DEMOS_DIR, name, "demo");
      return fs.existsSync(demoDir) && fs.statSync(path.join(CHAT_DEMOS_DIR, name)).isDirectory();
    })
  : [];
const customComps = fs.existsSync(CUSTOM_DIR)
  ? fs.readdirSync(CUSTOM_DIR).filter((name) => {
      const demoDir = path.join(CUSTOM_DIR, name, "demo");
      return fs.existsSync(demoDir) && fs.statSync(path.join(CUSTOM_DIR, name)).isDirectory();
    })
  : [];
const compNames = [...new Set([...defaultComps, ...chatComps, ...customComps])].filter(
  (name) => !EXCLUDE_COMPS.includes(name)
);

// 静默 exparser 内部 safeCallback 输出的 RangeError（组件 relations 处理中的栈溢出，不影响快照生成）
// exparser 的 safeCallback 捕获异常后调用 console.error(e.stack)，传入的是栈信息字符串
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Maximum call stack size exceeded")) return;
    originalConsoleError.apply(console, args);
  };
});
afterAll(() => {
  console.error = originalConsoleError;
});

compNames.forEach((compName) => {
  describe(`${compName}`, () => {
    afterAll(() => jest.resetModules());

    it(`demo snapshot`, async () => {
      const customDemoDir = path.join(CUSTOM_DIR, compName, "demo");
      const chatDemoDir = path.join(CHAT_DEMOS_DIR, compName, "demo");
      let baseDir;
      if (fs.existsSync(customDemoDir)) {
        baseDir = CUSTOM_DIR;
      } else if (fs.existsSync(chatDemoDir)) {
        baseDir = CHAT_DEMOS_DIR;
      } else {
        baseDir = DEMOS_DIR;
      }
      const demoPath = path.join(baseDir, compName, "demo", "index");
      const id = load(demoPath, compName);
      const container = simulate.render(id);
      const wrapper = document.createElement("parent-wrapper");
      container.attach(wrapper);

      expect(container.toJSON()).toMatchSnapshot();
      container.detach();
    });
  });
});
