import { createRequire } from "module";
import path from "path";
import { getDirname } from "./toolkit";

const __dirname = getDirname(import.meta.url);

export const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // 避免打包时把 dotenv 也打入产物
  const require = createRequire(import.meta.url); // 兼容 cjs
  const dotenv = require("dotenv");
  dotenv.config({ path: path.join(__dirname, "../../.env"), quiet: true });
}

export const DOCS_SOURCE_MODE = process.env.DOCS_SOURCE_MODE as "online" | "local";

export const isLocalMode = DOCS_SOURCE_MODE === "local";
