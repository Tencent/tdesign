import { existsSync, promises as fs, readdirSync } from "fs";
import path from "path";

import {
  addTdPrefix,
  API_RULE_MAP,
  cleanText,
  DEMO_RULE_MAP,
  FRAMEWORKS,
  getSuffixByFramework,
  isMiniProgram,
  isUniapp,
  MOBILE_DEMO_RULE_MAP,
  MOBILE_FRAMEWORKS,
  type Framework
} from "../../common";

import {
  getComponentDir,
  getDemoTemplateDir,
  getDocsOutputDir,
  getMiniprogramOutputDirName,
  getUniappOutputDirName,
  TD_COMP_MAP_PATH,
  TD_DOCS_OUTPUT_DIR
} from "../utils/path";

import { generateMiniProgramDemo, generateUniappDemo } from "./utils/miniprogram";

(async function main() {
  await extractCompMap();
  await extractAllDocs();
})();

async function extractCompMap() {
  const { NON_PASCAL_CASE_NAMES, WEB_COMPONENT_MAP, MOBILE_COMPONENT_MAP, CHAT_COMPONENT_MAP } = await import(
    TD_COMP_MAP_PATH
  );

  await fs.mkdir(TD_DOCS_OUTPUT_DIR, { recursive: true });

  const compMaps = [
    { name: "web-components.json", components: WEB_COMPONENT_MAP, alias: NON_PASCAL_CASE_NAMES },
    { name: "mobile-components.json", components: MOBILE_COMPONENT_MAP, alias: NON_PASCAL_CASE_NAMES },
    { name: "chat-components.json", components: CHAT_COMPONENT_MAP }
  ];

  for (const { name, components, alias } of compMaps) {
    const outputPath = path.join(TD_DOCS_OUTPUT_DIR, name);
    const data = {
      ...(alias && { alias }),
      components
    };
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf-8");
  }

  console.log("✓ Extract map successfully");
}

async function extractAllDocs() {
  for (const framework of FRAMEWORKS) {
    console.log(`--------(${framework})--------`);
    await extractDocs(framework);
    console.log(`✓ Extract docs successfully`);
  }
}

async function extractDocs(framework: Framework) {
  const demoTemplateDir = await fs.readdir(getDemoTemplateDir(framework));
  const mdFiles = demoTemplateDir.filter((file) => file.endsWith(".md") && !file.includes("en-US"));

  for (const file of mdFiles) {
    const compName = file.split(".")[0];
    const compDir = getComponentDir(framework, compName);

    if (!existsSync(compDir)) {
      // console.warn(`✗ Component not found: [${framework}] ${compName}`);
      continue;
    }

    await generateApi(framework, compName);
    await generateDemo(framework, compName);
    await generateCompList(framework, compName);
  }
}

/* ---------------------------------------- */

async function generateApi(framework: Framework, compName: string) {
  const componentPath = getComponentDir(framework, compName);

  // miniprogram 和 uniapp 使用 README.md 作为 API 文档
  const apiDocsName = isMiniProgram(framework) || isUniapp(framework) ? "README" : compName;
  const apiPath = `${componentPath}/${apiDocsName}.md`;

  let apiContent = await fs.readFile(apiPath, "utf-8");
  apiContent = cleanText(apiContent, API_RULE_MAP);

  const outputDir = await getDocsOutputDir(framework, compName);
  await fs.writeFile(path.join(outputDir, "api.md"), apiContent, "utf-8");
}

async function generateDemo(framework: Framework, compName: string) {
  if (isMiniProgram(framework)) {
    return generateMiniProgramDemo(framework, compName);
  }
  if (isUniapp(framework)) {
    return generateUniappDemo(framework, compName);
  }

  const exampleDirName = framework === "mobile-vue" ? "demos" : "_example";
  const exampleDir = path.join(getComponentDir(framework, compName), exampleDirName);
  // 取基础 Demo 即可
  const baseFileName = "base";

  if (!existsSync(exampleDir)) return null;

  const MOBILE_SKIP_FILES = ["mobile", "index", "customized"];
  const allEntries = readdirSync(exampleDir, { withFileTypes: true });

  // 只保留文件
  let allFiles = allEntries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  const isMobile = (MOBILE_FRAMEWORKS as readonly string[]).includes(framework);
  const files = isMobile ? allFiles.filter((file) => !MOBILE_SKIP_FILES.includes(file.split(".")[0])) : allFiles;

  const baseDemo = files.find((file) => file.split(".")[0] === baseFileName) || files[0];

  let demoContent = await fs.readFile(path.join(exampleDir, baseDemo), "utf-8");
  demoContent = cleanText(demoContent, DEMO_RULE_MAP);
  if (isMobile) {
    demoContent = cleanText(demoContent, MOBILE_DEMO_RULE_MAP);
  }

  const suffix = getSuffixByFramework(framework);
  const outputDir = await getDocsOutputDir(framework, compName);
  await fs.writeFile(path.join(outputDir, `Demo.${suffix}`), demoContent, "utf-8");
}

async function generateCompList(framework: Framework, compName: string) {
  const componentDir = getComponentDir(framework, compName);
  if (!existsSync(componentDir)) return; // 避免某些库没有实现对应的组件

  const demoTemplatePath = `${getDemoTemplateDir(framework)}/${compName}.md`;
  const demoTemplateContent = await fs.readFile(demoTemplatePath, "utf-8");

  const metaReg = DEMO_RULE_MAP.meta[0];
  const metaMatch = demoTemplateContent.match(metaReg);
  const meta = metaMatch ? metaMatch[1] : "";
  const metaObj = Object.fromEntries(
    meta.split("\n").map((line) => {
      const [key, value] = line.split(": ");
      return [key.trim(), value.trim()];
    })
  );

  if (metaObj.isComponent !== 'true') return;

  const splineType = metaObj.spline;
  const compMeta = {
    [compName]: metaObj.description
  };

  // miniprogram 的 AI 组件列表输出到 tdesign-miniprogram-chat/index.json
  // uniapp 的 AI 组件列表输出到 tdesign-uniapp-chat/index.json
  let compListDirName: string;
  if (isMiniProgram(framework)) {
    compListDirName = addTdPrefix(getMiniprogramOutputDirName(compName));
  } else if (isUniapp(framework)) {
    compListDirName = addTdPrefix(getUniappOutputDirName(compName));
  } else {
    compListDirName = addTdPrefix(framework);
  }
  const compListDir = path.join(TD_DOCS_OUTPUT_DIR, compListDirName);
  if (!existsSync(compListDir)) {
    await fs.mkdir(compListDir, { recursive: true });
  }
  let compListPath = path.join(compListDir, "index.json");
  if (!existsSync(compListPath)) {
    await fs.writeFile(compListPath, JSON.stringify({}, null, 2), "utf-8");
  }

  let compListContent = JSON.parse(await fs.readFile(compListPath, "utf-8"));

  compListContent[splineType] = {
    ...(compListContent[splineType] || {}),
    ...compMeta
  };

  await fs.writeFile(compListPath, JSON.stringify(compListContent, null, 2), "utf-8");
}
