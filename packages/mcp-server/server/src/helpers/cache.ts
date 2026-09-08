import { promises as fs } from "fs";
import path from "path";

import { DOCS_SOURCE_MODE, getDirname, isLocalMode, isProduction } from "@tdesign-mcp-server/common";

const __dirname = getDirname(import.meta.url);

const DOCS_ONLINE_URL = "https://tdesign.gtimg.com/mcp/";

const docsDir = isProduction && isLocalMode ? "../../docs/" : "../../../docs/";
const DOCS_LOCAL_PATH = path.join(__dirname, docsDir);

class MemoryCache {
  private ttl: number;
  private cache: Map<string, { value: any; timestamp: number }> = new Map();

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  get(url: string) {
    const cacheEntry = this.cache.get(url);
    if (!cacheEntry) return null;

    const isExpired = Date.now() - cacheEntry.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(url);
      return null;
    }
    return cacheEntry.value;
  }

  set(url: string, value: any) {
    this.cache.set(url, { value, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new MemoryCache(1 * 60 * 60 * 1000); // 1 小时

/**
 * 获取文档内容
 * @param path 文件路径，使用斜杠分隔，内部会自动转换为完整的 URL 或本地地址；如果 HTTP 开头，则直接请求对应文件
 */
export const loadFileContent = async (path: string) => {
  const cachedContent = cache.get(path);
  if (cachedContent) return cachedContent;

  try {
    if (path.startsWith("http")) {
      return await fetchRemoteContent(path);
    }

    if (DOCS_SOURCE_MODE === "local") {
      return await readLocalContent(path);
    }

    return await fetchRemoteContent(`${DOCS_ONLINE_URL}${path}`);
  } catch (error) {
    if (error instanceof Error && error.message) {
      return error.message;
    } else {
      return error;
    }
  }
};

const fetchRemoteContent = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("数据不存在，请更新 TDesign MCP 的版本");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  let content;
  if (contentType?.includes("application/json")) {
    content = await response.json();
  } else {
    content = await response.text();
  }

  cache.set(url, content);
  return content;
};

const readLocalContent = async (filePath: string) => {
  const docsPath = path.join(DOCS_LOCAL_PATH, filePath);
  const content = await fs.readFile(docsPath, "utf8");
  let result = content;
  if (filePath.endsWith(".json")) {
    result = JSON.parse(content);
  }
  cache.set(filePath, result);
  return result;
};
