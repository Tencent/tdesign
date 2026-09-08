import { readdirSync } from "fs";
import path from "path";

import { cleanup, render } from "@testing-library/react";
import React from "react";
import { expect, test, vi } from "vitest";

import { getDirname } from "../../../../common";
import { getDocsOutputDir } from "../../../utils/path";

// jsdom 不支持 canvas，mock getContext 避免报错
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as any;

const __dirname = getDirname(import.meta.url);
const CUSTOM_TEST_DIR = path.join(__dirname, "./custom");

const EXCLUDE_COMPS = ["config-provider", "watermark"];

console.log(`--------(mobile)--------`);

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
const mobileReactDocs = await getDocsOutputDir("mobile-react");
const compDirs = readdirSync(mobileReactDocs).filter(
  (file) => !file.startsWith(".") && !file.endsWith(".json") && !EXCLUDE_COMPS.includes(file)
);
const compsWithDefaultTest = compDirs.filter((compName) => {
  return !compsWithCustomTest.includes(compName);
});

for (const compName of compsWithDefaultTest) {
  const demoPath = path.join(mobileReactDocs, compName, "Demo.tsx");
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
