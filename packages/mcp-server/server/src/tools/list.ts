import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { addTdPrefix, type Framework } from "@tdesign-mcp-server/common";

import { loadFileContent } from "../helpers";
import { FrameworkSchema } from "../prompts";

export default function getCompList(server: McpServer) {
  server.registerTool(
    "get-component-list",
    {
      description: "获取 TDesign 所有可用的组件列表，适用场景：选择合适组件进行组合实现不存在的功能",
      inputSchema: FrameworkSchema.shape
    },
    async ({ framework }) => {
      const compList = await loadCompList(framework);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(compList)
          }
        ]
      };
    }
  );
}

async function loadCompList(framework: Framework) {
  const listUrl = `${addTdPrefix(framework)}/index.json`;
  return await loadFileContent(listUrl);
}
