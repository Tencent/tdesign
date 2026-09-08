import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  addTdPrefix,
  getSuffixByFramework,
  isMiniProgram,
  MINIPROGRAM_DEMO_EXTS,
  type Framework
} from "@tdesign-mcp-server/common";

import { checkCompsExistence, loadFileContent } from "../helpers";
import { ComponentsSchema } from "../prompts";

export default function getCompDocs(server: McpServer) {
  server.registerTool(
    "get-component-docs",
    {
      description: "获取 TDesign 组件的文档，适用场景：代码生成和代码转换，支持多个组件同时查询",
      inputSchema: ComponentsSchema.shape
    },
    async ({ names, framework }) => {
      const compDocs = await loadCompDocs(names, framework);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(compDocs)
          }
        ]
      };
    }
  );
}

async function loadCompDocs(names: string[], framework: Framework) {
  const { exist, nonExist } = await checkCompsExistence(names, framework);
  const docsUrl = `${addTdPrefix(framework)}`;
  const existResults: Record<string, any> = {};

  for (const name of Object.keys(exist)) {
    const parentComponent = exist[name];
    const apiUrl = `${docsUrl}/${parentComponent}/api.md`;
    const apiContent = await loadFileContent(apiUrl);

    let demo: Record<string, string> | string;

    if (isMiniProgram(framework)) {
      const demoDir = `${docsUrl}/${parentComponent}/demo`;
      const demoFiles: Record<string, string> = {};
      for (const ext of MINIPROGRAM_DEMO_EXTS) {
        const fileName = `index${ext}`;
        const content = await loadFileContent(`${demoDir}/${fileName}`);
        demoFiles[fileName] =
          typeof content === "string" ? content.replace(/\s*\n\s*/g, "").replace(/"/g, "'") : JSON.stringify(content);
      }
      demo = demoFiles;
    } else {
      const demoUrl = `${docsUrl}/${parentComponent}/Demo.${getSuffixByFramework(framework)}`;
      const demoContent = await loadFileContent(demoUrl);
      demo = demoContent.replace(/\s*\n\s*/g, "").replace(/"/g, "'");
    }

    existResults[name] = {
      api: apiContent,
      demo
    };
  }

  return { ...nonExist, ...existResults };
}
