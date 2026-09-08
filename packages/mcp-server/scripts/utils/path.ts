import { existsSync, promises as fs } from "fs";
import path from "path";

import {
  addTdPrefix,
  FRAMEWORKS,
  getDirname,
  getPlatformByFramework,
  isChatComponent,
  isChatFramework,
  isMiniProgram,
  isMonorepo,
  isUniapp,
  type Framework
} from "@tdesign-mcp-server/common";

const __dirname = getDirname(import.meta.url);

/* 所有 tdesign-* 系列仓库的公共父目录（默认各端框架与当前项目在同一目录） */
export const TD_REPOS_ROOT = path.join(__dirname, "../../../../../");

export const TD_DOCS_OUTPUT_DIR = path.join(__dirname, "../../docs");

const joinTdDir = (...args: string[]) => path.join(TD_REPOS_ROOT, ...args);

export const TD_COMMON_DIR = joinTdDir(addTdPrefix("common"));

export const TD_COMP_MAP_PATH = `${TD_COMMON_DIR}/js/components.ts`;

/** 获取 miniprogram 框架的输出目录名：AI 组件使用 miniprogram-chat，基础组件使用 miniprogram */
export const getMiniprogramOutputDirName = (compName?: string) =>
  compName && isChatComponent(compName) ? "miniprogram-chat" : "miniprogram";

/** 获取 uniapp 框架的输出目录名：AI 组件使用 uniapp-chat，基础组件使用 uniapp */
export const getUniappOutputDirName = (compName?: string) =>
  compName && isChatComponent(compName) ? "uniapp-chat" : "uniapp";

export const getDocsOutputDir = async (framework: Framework, compName?: string, subDir?: string) => {
  // miniprogram 的 AI 组件输出到 tdesign-miniprogram-chat
  // uniapp 的 AI 组件输出到 tdesign-uniapp-chat
  let dirName: string;
  if (isMiniProgram(framework)) {
    dirName = addTdPrefix(getMiniprogramOutputDirName(compName));
  } else if (isUniapp(framework)) {
    dirName = addTdPrefix(getUniappOutputDirName(compName));
  } else {
    dirName = addTdPrefix(framework);
  }
  const parts = [TD_DOCS_OUTPUT_DIR, dirName];
  if (compName) parts.push(compName);
  if (subDir) parts.push(subDir);
  const outputDir = path.join(...parts);
  if (!existsSync(outputDir)) {
    await fs.mkdir(outputDir, { recursive: true });
  }
  return outputDir;
};

export const getDemoTemplateDir = (framework: Framework) => {
  const platform = getPlatformByFramework(framework);
  return `${TD_COMMON_DIR}/docs/${platform}/api`;
};

const generateDirMap = (subPathCallback: (fw: Framework) => string[]) => {
  return Object.fromEntries(FRAMEWORKS.map((fw) => [fw, joinTdDir(addTdPrefix(fw), ...subPathCallback(fw))]));
};

const COMPONENT_DIR_PATH = generateDirMap((fw) => (isMonorepo(fw) ? ["packages", "components"] : ["src"]));

const CHAT_COMPONENT_DIR_PATH = Object.fromEntries(
  FRAMEWORKS.map((fw) => {
    // chat 框架的 pro-components 在对应的基础框架仓库中
    const repoFramework = isChatFramework(fw) ? fw.replace(/-chat$/, "") : fw;
    return [fw, joinTdDir(addTdPrefix(repoFramework), "packages", "pro-components", "chat")];
  })
);

/** uniapp 组件路径映射（组件源码在 tdesign-miniprogram 大仓中） */
const UNIAPP_COMPONENT_DIR = joinTdDir(addTdPrefix("miniprogram"), "packages", "uniapp-components");
const UNIAPP_CHAT_COMPONENT_DIR = joinTdDir(addTdPrefix("miniprogram"), "packages", "uniapp-pro-components", "chat");

/** 组件名 → [基础路径映射, ...子路径段] 的特殊映射（miniprogram 专用） */
const MINIPROGRAM_COMP_ALIAS: Record<string, [basePath: Record<string, string>, ...subPaths: string[]]> = {
  layout: [COMPONENT_DIR_PATH, "col"]
};

export const getComponentDir = (framework: Framework, componentName: string) => {
  if (isMiniProgram(framework)) {
    if (isChatComponent(componentName)) {
      return path.join(CHAT_COMPONENT_DIR_PATH[framework], componentName);
    }
    const alias = MINIPROGRAM_COMP_ALIAS[componentName];
    if (alias) {
      const [basePath, ...subPaths] = alias;
      return path.join(basePath[framework], ...subPaths);
    }
  }
  if (isUniapp(framework)) {
    if (isChatComponent(componentName)) {
      return path.join(UNIAPP_CHAT_COMPONENT_DIR, componentName);
    }
    return path.join(UNIAPP_COMPONENT_DIR, componentName);
  }

  if (isChatFramework(framework)) {
    return path.join(CHAT_COMPONENT_DIR_PATH[framework], componentName);
  }
  return path.join(COMPONENT_DIR_PATH[framework], componentName);
};

const PACKAGE_JSON_PATH = generateDirMap((fw) =>
  isMonorepo(fw) ? ["packages", addTdPrefix(fw), "package.json"] : ["package.json"]
);

export const getPackageJsonPath = (framework: Framework) => {
  return path.join(PACKAGE_JSON_PATH[framework]);
};
