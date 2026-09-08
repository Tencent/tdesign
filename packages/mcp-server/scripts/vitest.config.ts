import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Vitest 暂时不支持加载外部（common）的 TS 文件，所以重复维护一份 getDirName 写法
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: false,
    alias: {
      "@tdesign-mcp-server/docs-react": path.resolve(__dirname, "../docs/tdesign-react"),
      "@tdesign-mcp-server/docs-react-chat": path.resolve(__dirname, "../docs/tdesign-react-chat"),
      "@tdesign-mcp-server/docs-mobile-react": path.resolve(__dirname, "../docs/tdesign-mobile-react"),
      // 省得 Docs 目录下也安装依赖
      "lodash-es": path.resolve(__dirname, "./node_modules/lodash-es"),
      "tdesign-mobile-react": path.resolve(__dirname, "./node_modules/tdesign-mobile-react"),
      "tdesign-react": path.resolve(__dirname, "./node_modules/tdesign-react"),
      "tdesign-icons-react": path.resolve(__dirname, "./node_modules/tdesign-icons-react"),
      "tdesign-web-components": path.resolve(__dirname, "./node_modules/tdesign-web-components"),
      "tdesign-web-components/lib": path.resolve(__dirname, "./node_modules/tdesign-web-components/lib")
    }
  },
  test: {
    environment: "happy-dom",
    exclude: ["**/dom/snapshots/miniprogram/**", "**/node_modules/**"],
    testTimeout: 10000,
    server: {
      deps: {
        // 将 CJS 模块转换为 ESM，解决 named export 问题
        inline: ["tdesign-web-components"]
      }
    },
    snapshotFormat: {
      printBasicPrototype: false,
      maxDepth: 10
    }
  }
});
