import path from "path";
import { fileURLToPath } from "url";

/**
 * 获取当前文件的绝对路径
 * - 调用格式：`getDirname(import.meta.url)`
 */
export const getDirname = (importMetaUrl: string) => {
  return path.dirname(fileURLToPath(importMetaUrl));
};

export const compareVersion = (a: string, b: string) => {
  const aArr = a.split(".");
  const bArr = b.split(".");
  for (let i = 0; i < Math.max(aArr.length, bArr.length); i++) {
    const aNum = Number(aArr[i] || 0);
    const bNum = Number(bArr[i] || 0);
    if (aNum > bNum) return 1;
    if (aNum < bNum) return -1;
  }
  return 0;
};
