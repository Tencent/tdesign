import { readdirSync } from "fs";
import path from "path";

import { cleanup } from "@testing-library/react";
import { test } from "vitest";

import { getDirname } from "@tdesign-mcp-server/common";

const __dirname = getDirname(import.meta.url);
const CUSTOM_TEST_DIR = path.join(__dirname, "./custom");

// 排除不需要测试的组件
const EXCLUDE_COMPS = ["chatbot", "chat-engine", "chat-markdown"];

console.log(`--------(web-chat)--------`);

function getCompsWithCustomTest() {
  try {
    const testFiles = readdirSync(CUSTOM_TEST_DIR).filter((file) => file.endsWith(".tsx"));
    const compNames = testFiles.map((file) => file.replace(".tsx", ""));
    return compNames;
  } catch {
    return [];
  }
}

const compsWithCustomTest = getCompsWithCustomTest();
const filtered = compsWithCustomTest.filter((compName) => !EXCLUDE_COMPS.includes(compName));

for (const compName of filtered) {
  const demoPath = path.join(CUSTOM_TEST_DIR, `${compName}.tsx`);
  test(
    `Custom Test [${compName}]`,
    async () => {
      const module = await import(demoPath);
      await module.default();
      cleanup();
    },
    30000
  );
}
