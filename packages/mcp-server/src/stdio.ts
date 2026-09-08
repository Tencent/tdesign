import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./init";

(async function main() {
  try {
    const { server, version } = await createMcpServer("stdio");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // https://modelcontextprotocol.io/docs/develop/build-server#quick-examples
    console.error(`\x1b[36m%s\x1b[0m`, `🚀 TDesign MCP Stdio Server is running (v${version})`);
  } catch (e) {
    console.error(e);
  }
})();
