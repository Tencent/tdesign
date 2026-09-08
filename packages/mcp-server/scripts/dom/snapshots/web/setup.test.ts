import { readdirSync } from "fs";
import path from "path";

import { cleanup, render } from "@testing-library/react";
import React from "react";
import { expect, test } from "vitest";

import { getDirname, isChatComponent } from "@tdesign-mcp-server/common";
import { getDocsOutputDir } from "../../../utils/path";

const __dirname = getDirname(import.meta.url);
const CUSTOM_TEST_DIR = path.join(__dirname, "./custom");

const EXCLUDE_COMPS = ["config-provider", "watermark"];

console.log(`--------(web)--------`);

function getCompsWithCustomTest() {
  const testFiles = readdirSync(CUSTOM_TEST_DIR).filter((file) => file.endsWith(".tsx"));
  const compNames = testFiles.map((file) => file.replace(".tsx", ""));
  return compNames;
}

const compsWithCustomTest = getCompsWithCustomTest();
for (const compName of compsWithCustomTest) {
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

// 使用默认测试的组件
const reactDocs = await getDocsOutputDir("react");
const compDirs = readdirSync(reactDocs).filter(
  (file) =>
    !file.startsWith(".") && !file.endsWith(".json") && !EXCLUDE_COMPS.includes(file) && !isChatComponent(file)
);
const compsWithDefaultTest = compDirs.filter((compName) => {
  return !compsWithCustomTest.includes(compName);
});

for (const compName of compsWithDefaultTest) {
  const demoPath = path.join(reactDocs, compName, "Demo.tsx");
  test(`Default Test [${compName}]`, async () => {
    const module = await import(demoPath);
    const Component = module?.default;
    if (!Component) {
      console.error(`Component not found in ${demoPath}`);
      return;
    }
    defaultTest(Component);
  });
}

function defaultTest(Component: React.ElementType) {
  // @ts-ignore
  const { container } = render(React.createElement(Component));
  expect(container).toMatchSnapshot();
  cleanup();
}
