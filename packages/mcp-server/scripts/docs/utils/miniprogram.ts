import { existsSync, promises as fs, readdirSync } from "fs";
import path from "path";

import {
  cleanText,
  DEMO_RULE_MAP,
  MINIPROGRAM_DEMO_EXTS,
  MOBILE_DEMO_RULE_MAP,
  type Framework
} from "../../../common";

import { getComponentDir, getDocsOutputDir, TD_REPOS_ROOT } from "../../utils/path";

/** 匹配 JS/WXML/Vue 中的相对路径引用（../ 和 ./） */
const REF_PATTERNS = [
  /import\s+.+?\s+from\s+['"](\.\.?\/.+?)['"]/g, // JS import
  /require\s*\(\s*['"](\.\.?\/.+?)['"]\s*\)/g, // JS require
  /src\s*=\s*["'](\.\.?\/.+?)["']/g // WXML src
];

/** 尝试解析的文件扩展名 */
const TRY_EXTS = [".js", ".ts", ".wxs", ".json"];

/**
 * 匹配 utils 相关的 import 语句，兼容两种写法：
 * 1. default import：`import getNavigationBarHeight from '../utils';`
 * 2. named import： `import { getNavigationBarHeight } from '../utils';`
 */
const UTILS_IMPORT_PATTERN =
  /import\s+(?:getNavigationBarHeight|\{[^}]*getNavigationBarHeight[^}]*\})\s+from\s*['"][^'"]*utils[^'"]*['"];?\n?/g;

/** 微信小程序获取导航栏高度函数 */
const MINIPROGRAM_GET_NAV_HEIGHT_FN = `
const getNavigationBarHeight = () => {
  try {
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    if (menuButtonInfo) {
      return menuButtonInfo.bottom + (menuButtonInfo.top - statusBarHeight);
    }
    return statusBarHeight + 44;
  } catch (error) {
    console.error('获取导航栏高度失败:', error);
    return 44;
  }
};\n
`.trim();

/** UniApp 获取导航栏高度函数 */
const UNIAPP_GET_NAV_HEIGHT_FN = `
const getNavigationBarHeight = () => {
  try {
    const systemInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.();
    if (menuButtonInfo) {
      return menuButtonInfo.bottom + (menuButtonInfo.top - statusBarHeight);
    }
    return statusBarHeight + 44;
  } catch (error) {
    console.error('获取导航栏高度失败:', error);
    return 44;
  }
};
`.trim();

/**
 * 解析源文件路径，找到则返回绝对路径，否则返回 null
 */
function resolveSourceFile(baseDir: string, relPath: string): string | null {
  const absPath = path.join(baseDir, relPath);
  if (existsSync(absPath)) return absPath;
  for (const ext of TRY_EXTS) {
    if (existsSync(absPath + ext)) return absPath + ext;
  }
  return null;
}

/**
 * 内联 getNavigationBarHeight 函数：移除 utils import 语句，将函数定义内联到文件中
 * @param content 文件内容
 * @param isUniapp 是否为 uniapp 框架
 * @returns 处理后的内容
 */
export function inlineNavigationBarHeightFn(content: string, isUniapp: boolean): string {
  // 重置正则 lastIndex，避免 g flag 在多次调用间残留状态
  UTILS_IMPORT_PATTERN.lastIndex = 0;
  // 检查是否有 utils import
  if (!UTILS_IMPORT_PATTERN.test(content)) return content;

  // 重置正则的 lastIndex
  UTILS_IMPORT_PATTERN.lastIndex = 0;

  // 移除 import 语句
  let updatedContent = content.replace(UTILS_IMPORT_PATTERN, "");

  // 选择对应平台的函数实现
  const fnImpl = isUniapp ? UNIAPP_GET_NAV_HEIGHT_FN : MINIPROGRAM_GET_NAV_HEIGHT_FN;

  // 在文件适当位置插入函数定义
  // 对于 JS 文件：在第一个非 import 语句之前插入
  // 对于 Vue 文件：在 <script> 标签后的 import 语句之后插入
  if (isUniapp) {
    // Vue SFC：在最后一个 import 语句后插入
    const lastImportMatch = [...updatedContent.matchAll(/^import\s+.+?;?\s*$/gm)].pop();
    if (lastImportMatch && lastImportMatch.index !== undefined) {
      const insertPos = lastImportMatch.index + lastImportMatch[0].length;
      updatedContent = updatedContent.slice(0, insertPos) + "\n" + fnImpl + "\n" + updatedContent.slice(insertPos);
    }
  } else {
    // 小程序 JS：在第一个非 import 行之前插入
    const lines = updatedContent.split("\n");
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith("import ") && !line.startsWith("//")) {
        insertIndex = i;
        break;
      }
      if (line.startsWith("import ")) {
        insertIndex = i + 1;
      }
    }
    // 移除插入点之前的连续空行，然后统一添加一个空行
    while (insertIndex > 0 && lines[insertIndex - 1].trim() === "") {
      lines.splice(insertIndex - 1, 1);
      insertIndex--;
    }
    lines.splice(insertIndex, 0, "", fnImpl, "");
    updatedContent = lines.join("\n");
  }

  return updatedContent;
}

/**
 * 扫描文件内容中通过相对路径引用的外部文件，将其复制到输出目录，并修正引用路径（跳过 utils 相关）
 */
export async function resolveDemoRefs(content: string, demoSourceDir: string, outputDir: string): Promise<string> {
  const repoExampleDir = path.join(TD_REPOS_ROOT, "tdesign-miniprogram", "_example");
  let updatedContent = content;

  for (const pattern of REF_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const refPath = match[1];
      if (refPath.includes("utils")) continue;

      const sourceFile =
        resolveSourceFile(demoSourceDir, refPath) ||
        resolveSourceFile(repoExampleDir, refPath.replace(/^(\.\.\/)+/, ""));

      if (!sourceFile) continue;

      const targetFileName = path.basename(sourceFile);
      await fs.copyFile(sourceFile, path.join(outputDir, targetFileName));
      const hasExt = path.extname(refPath) !== "";
      const newRef = hasExt ? targetFileName : path.basename(sourceFile, path.extname(sourceFile));
      updatedContent = updatedContent.replace(refPath, "./" + newRef);
    }
  }

  return updatedContent;
}

/**
 * 生成微信小程序 Demo
 * - 小程序的 demo 采用多文件格式（.js, .wxml, .wxss, .json）
 * - 目录结构为 _example/base/index.*
 */
export async function generateMiniProgramDemo(framework: Framework, compName: string): Promise<void> {
  const exampleDir = path.join(getComponentDir(framework, compName), "_example");
  if (!existsSync(exampleDir)) return;

  // 优先取 base 目录，否则取第一个子目录；跳过 skyline 目录
  const entries = readdirSync(exampleDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory() && e.name !== "skyline");
  let targetDir = dirs.find((d) => d.name === "base");
  if (!targetDir && dirs.length > 0) targetDir = dirs[0];
  if (!targetDir) return;

  const demoSourceDir = path.join(exampleDir, targetDir.name);
  const outputDir = await getDocsOutputDir(framework, compName, "demo");

  for (const ext of MINIPROGRAM_DEMO_EXTS) {
    const filePath = path.join(demoSourceDir, `index${ext}`);
    if (!existsSync(filePath)) continue;

    let content = await fs.readFile(filePath, "utf-8");
    content = cleanText(content, DEMO_RULE_MAP);

    // 处理父级目录引用：复制外部依赖文件并修正路径
    if (ext === ".js" || ext === ".wxml") {
      content = await resolveDemoRefs(content, demoSourceDir, outputDir);
    }

    if (ext === ".js") {
      content = inlineNavigationBarHeightFn(content, false);
    }

    await fs.writeFile(path.join(outputDir, `index${ext}`), content, "utf-8");
  }
}

/**
 * 生成 UniApp Demo
 * - uniapp 的 demo 采用 Vue SFC 格式
 * - 目录结构为 _example/base/index.vue
 * - 提取 base（或第一个子目录）中的 index.vue 作为 Demo.vue 输出
 */
export async function generateUniappDemo(framework: Framework, compName: string): Promise<void> {
  const exampleDir = path.join(getComponentDir(framework, compName), "_example");
  if (!existsSync(exampleDir)) return;

  // 优先取 base 目录，否则取第一个子目录
  const entries = readdirSync(exampleDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());
  let targetDir = dirs.find((d) => d.name === "base");
  if (!targetDir && dirs.length > 0) targetDir = dirs[0];
  if (!targetDir) return;

  const demoSourceDir = path.join(exampleDir, targetDir.name);
  const demoFilePath = path.join(demoSourceDir, "index.vue");
  if (!existsSync(demoFilePath)) return;

  let demoContent = await fs.readFile(demoFilePath, "utf-8");
  demoContent = cleanText(demoContent, DEMO_RULE_MAP);
  demoContent = cleanText(demoContent, MOBILE_DEMO_RULE_MAP);

  // 内联 getNavigationBarHeight 函数
  demoContent = inlineNavigationBarHeightFn(demoContent, true);

  const outputDir = await getDocsOutputDir(framework, compName);
  await fs.writeFile(path.join(outputDir, "Demo.vue"), demoContent, "utf-8");
}
