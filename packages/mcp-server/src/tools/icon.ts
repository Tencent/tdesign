import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { loadFileContent } from "../helpers";
import { IconSchema } from "../prompts";

const ICONS_MANIFEST_URL = "https://static.tdesign.tencent.com/icons-manifest.json";

interface ManifestIcon {
  name: string;
  keywords?: string[];
}

interface ManifestCategory {
  labelCN?: string;
  labelEn?: string;
  icons?: ManifestIcon[];
}

type Manifest = Record<string, Record<string, ManifestCategory>>;

interface IconItem {
  name: string;
  style: string;
  category: string;
  categoryCN: string;
  keywords: string[];
}

export default function searchIcon(server: McpServer) {
  server.registerTool(
    "search-icon",
    {
      description:
        "根据中英文关键词查询 TDesign 图标库的完整图标名。" +
        "支持一次传入多个关键词：优先返回同时命中所有关键词的图标（AND），" +
        "若无结果则降级为命中任一关键词（OR），并按命中数量评分排序。" +
        "匹配范围包含图标名、中文关键词与分类。适用场景：图标查找与名称确认",
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

function flattenManifest(manifest: Manifest): IconItem[] {
  const items: IconItem[] = [];

  Object.entries(manifest || {}).forEach(([style, categories]) => {
    Object.entries(categories || {}).forEach(([category, node]) => {
      (node?.icons || []).forEach((icon) => {
        if (!icon?.name) return;
        items.push({
          name: icon.name,
          style,
          category,
          categoryCN: node?.labelCN || "",
          keywords: icon.keywords || []
        });
      });
    });
  });

  return items;
}

function buildSearchText(item: IconItem) {
  return [item.name, ...item.keywords, item.category, item.categoryCN].join(" ").toLowerCase();
}

async function findMatchingIcons(keywords: string[], limit = 20) {
  const manifest = (await loadFileContent(ICONS_MANIFEST_URL)) as Manifest;
  const icons = flattenManifest(manifest);

  const queryTokens = keywords.map((s) => s.toLowerCase()).filter(Boolean);
  if (queryTokens.length === 0) return [];

  // 计算命中的关键词数量
  const scored = icons
    .map((item) => {
      const text = buildSearchText(item);
      const score = queryTokens.reduce((acc, kw) => (text.includes(kw) ? acc + 1 : acc), 0);
      return { item, score };
    })
    .filter((entry) => entry.score > 0);

  // 优先 AND 匹配：命中全部关键词的图标
  const andMatched = scored.filter((entry) => entry.score === queryTokens.length);
  if (andMatched.length > 0) {
    return rankMatches(andMatched, limit);
  }

  // 降级 OR 匹配：命中任一关键词
  return rankMatches(scored, limit);
}

function rankMatches(list: { item: IconItem; score: number }[], limit: number) {
  return list
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.item.name.length !== b.item.name.length) return a.item.name.length - b.item.name.length;
      return a.item.name.localeCompare(b.item.name);
    })
    .slice(0, limit)
    .map((entry) => entry.item);
}
