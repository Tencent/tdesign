import { promises as fs } from "fs";
import path from "path";

import { getDirname, isProduction } from "../../common";

const __dirname = getDirname(import.meta.url);

export async function getPackageVersion() {
  const packageJsonPath = isProduction
    ? path.join(__dirname, "../package.json")
    : path.join(__dirname, "../../package.json");
  const content = await fs.readFile(packageJsonPath, "utf-8");
  const { version } = JSON.parse(content);
  return version as string;
}

export const convert2PascalCase = (name: string) => {
  // 已经是帕斯卡命名的情况，直接返回
  if (/^[A-Z][a-zA-Z]*$/.test(name)) {
    return name;
  }

  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};
