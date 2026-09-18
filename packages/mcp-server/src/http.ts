import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { createMcpServer } from "./init";

const PORT = 9000;

(async function main() {
  const { server, version } = await createMcpServer("http");

  const app = express();
  app.use(express.json());

  app.post("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    res.on("close", () => {
      transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app
    .listen(PORT, () => {
      console.error(
        `\x1b[36m%s\x1b[0m`,
        `🚀 TDesign MCP HTTP Server is running (v${version}) at http://localhost:${PORT}/mcp`
      );
    })
    .on("error", (error) => {
      console.error(error);
      process.exit(1);
    });
})();
