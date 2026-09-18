import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  addTdPrefix,
  Framework,
  getPlatformByFramework,
  isChatFramework,
  isMiniProgram,
  isUniapp
} from "../../common";

import { checkCompsExistence, loadFileContent } from "../helpers";
import { ComponentsSchema } from "../prompts";

export default function getCompDom(server: McpServer) {
  server.registerTool(
    "get-component-dom",
    {
      description: "获取 TDesign 组件的 DOM 结构，适用场景：转换用户自定义的 CSS 样式, 支持多个组件同时查询",
      inputSchema: ComponentsSchema.shape
    },
    async ({ names, framework }) => {
      const compDom = await loadCompDom(names, framework);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(compDom)
          }
        ]
      };
    }
  );
}

/** 获取组件 DOM 的目录前缀 */
function getDomPrefix(fw: Framework) {
  if (isMiniProgram(fw) || isUniapp(fw)) {
    return `${fw}-dom`;
  }
  if (isChatFramework(fw)) {
    return `${getPlatformByFramework(fw)}-chat-dom`;
  }
  return `${getPlatformByFramework(fw)}-dom`;
}

async function loadCompDom(names: string[], framework: Framework) {
  const { exist, nonExist } = await checkCompsExistence(names, framework);
  const existResults: Record<string, any> = {};

  const domUrl = addTdPrefix(getDomPrefix(framework));

  for (const name of Object.keys(exist)) {
    const parentComponent = exist[name];
    const domFileUrl = `${domUrl}/${parentComponent}.html`;

    const domContent = await loadFileContent(domFileUrl);

    existResults[name] = domContent;
  }

  return { ...nonExist, ...existResults };
}
