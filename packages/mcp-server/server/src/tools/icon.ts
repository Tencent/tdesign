import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { loadFileContent } from "../helpers";
import { IconSchema } from "../prompts";

export default function searchIcon(server: McpServer) {
  server.registerTool(
    "search-icon",
    {
      description:
        "根据英文关键词查询 TDesign 图标库的完整图标名。" +
        "支持一次传入多个关键词：优先返回同时命中所有关键词的图标（AND），" +
        "若无结果则降级为命中任一关键词（OR），并按命中数量评分排序。" +
        "适用场景：图标查找与名称确认",
      inputSchema: IconSchema.shape
    },
    async ({ keywords, limit }) => {
      const icons = await findMatchingIcons(keywords, limit);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(icons)
          }
        ]
      };
    }
  );
}

async function findMatchingIcons(keywords: string[], limit = 20) {
  const icons = (await loadFileContent("icons.json")) as string[];

  const queryTokens = keywords.map((s) => s.toLowerCase()).filter(Boolean);
  if (queryTokens.length === 0) return [];

  // 计算命中的关键词数量
  const scored = icons
    .map((name) => {
      const lower = name.toLowerCase();
      const score = queryTokens.reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0);
      return { name, score };
    })
    .filter((item) => item.score > 0);

  // 优先 AND 匹配：命中全部关键词的图标
  const andMatched = scored.filter((item) => item.score === queryTokens.length);
  if (andMatched.length > 0) {
    return rankMatches(andMatched, limit);
  }

  // 降级 OR 匹配：命中任一关键词
  return rankMatches(scored, limit);
}

function rankMatches(list: { name: string; score: number }[], limit: number) {
  return list
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.name.length !== b.name.length) return a.name.length - b.name.length;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map((item) => item.name);
}
