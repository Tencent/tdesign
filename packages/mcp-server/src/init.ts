import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getPackageVersion } from "./helpers";
import registryPrompts from "./prompts";
import registryTools from "./tools";

export const createMcpServer = async (type: "http" | "stdio") => {
  const version = await getPackageVersion();
  const server = new McpServer({
    name: `TDesign MCP [${type}]`,
    version
  });
  registryPrompts(server);
  registryTools(server);
  return { server, version };
};
