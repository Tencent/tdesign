import { getPlatformByFramework, isChatFramework, type Framework } from "@tdesign-mcp-server/common";

import { loadFileContent } from "./cache";
import { convert2PascalCase } from "./format";

export const checkCompsExistence = async (names: string[], fw: Framework) => {
  const platform = isChatFramework(fw) ? "chat" : getPlatformByFramework(fw);
  const mapUrl = `${platform}-components.json`;

  const mapData = await loadFileContent(mapUrl);

  const aliasMap = mapData?.alias;
  const originalMap = mapData?.components;

  // 相当于返回报错信息
  if (!originalMap) return mapData;

  // 存储父组件与原始组件的映射关系
  const exist: Record<string, string> = {};
  // 存储不存在的组件结果
  const nonExist: Record<string, string> = {};

  const findParentComponent = (name: string) => {
    const found = Object.entries(originalMap).find(([_, values]) => Array.isArray(values) && values.includes(name));
    if (found) return found[0];
  };

  for (const name of names) {
    const normalizedName = aliasMap?.[name] || convert2PascalCase(name);
    const parentComponent = findParentComponent(normalizedName);
    if (!parentComponent) {
      nonExist[name] = "组件不存在";
    } else {
      // "输入的组件名": "父组件名"
      exist[name] = parentComponent;
    }
  }
  return { exist, nonExist };
};
