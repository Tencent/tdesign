import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  CHANGELOG_RULE_MAP,
  cleanText,
  compareVersion,
  type Framework
} from "../../common";

import { checkCompsExistence, loadFileContent } from "../helpers";
import { ChangelogsSchema } from "../prompts";

export default function getCompChangelog(server: McpServer) {
  server.registerTool(
    "get-component-changelog",
    {
      description: "获取 TDesign 组件的变更日志，适用场景：组件库版本升级，支持多个组件同时查询",
      inputSchema: ChangelogsSchema.shape
    },
    async ({ names, framework, version }) => {
      const compChangelog = await loadCompChangelog(names, framework as Framework, version);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(compChangelog)
          }
        ]
      };
    }
  );
}

async function loadCompChangelog(names: string[], framework: Framework, version?: string) {
  const changelogUrl = `https://static.tdesign.tencent.com/${framework}/changelog.json`;
  const changelog = await loadFileContent(changelogUrl);

  const { exist, nonExist } = await checkCompsExistence(names, framework);
  const existResults: Record<string, any> = {};

  const normalizeKey = (str: string) => str.replace(/-/g, "").toLowerCase();

  const normalizedMap: Record<string, string> = {};
  for (const key of Object.keys(changelog)) {
    normalizedMap[normalizeKey(key)] = key;
  }

  for (const name of Object.keys(exist)) {
    const parentComponent = exist[name];
    const normalizedName = normalizeKey(parentComponent);
    const matchedKey = normalizedMap[normalizedName];

    const logs = changelog[matchedKey]
      ?.filter((item: any) => !version || compareVersion(item.version, version) >= 0)
      .map((item: any) => {
        const cleanedLog: any = {};
        for (const key in item) {
          if (Array.isArray(item[key])) {
            const typeWithoutEmoji = key.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "").trim();
            cleanedLog[typeWithoutEmoji] = item[key].map((str: string) => cleanText(str, CHANGELOG_RULE_MAP).trim());
          } else if (key === "version") {
            cleanedLog[key] = item[key];
          }
        }
        return cleanedLog;
      });

    existResults[name] = logs.length > 0 ? logs : "日志不存在";
  }

  return { ...nonExist, ...existResults };
}
