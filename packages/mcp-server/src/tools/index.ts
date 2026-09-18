import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import getCompChangelog from "./changelog";
import getCompDocs from "./docs";
import getCompDom from "./dom";
import searchIcons from "./icon";
import getCompList from "./list";

const allTools = [getCompList, getCompDocs, getCompDom, getCompChangelog, searchIcons];

export default function registryTools(server: McpServer) {
  allTools.forEach((register) => {
    register(server);
  });
}
