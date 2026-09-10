import { existsSync, promises as fs } from "fs";
import path from "path";

import { TD_DOCS_OUTPUT_DIR, TD_REPOS_ROOT } from "../utils/path";

const TD_ICONS_SVG_DIR = path.join(TD_REPOS_ROOT, "tdesign-icons", "svg");

const ICON_OUTPUT_PATH = path.join(TD_DOCS_OUTPUT_DIR, "icons.json");

(async function main() {
  await extractIcons();
})();

async function extractIcons() {
  if (!existsSync(TD_ICONS_SVG_DIR)) {
    console.warn(`✗ Icon SVG dir not found: ${TD_ICONS_SVG_DIR}`);
    return;
  }

  const entries = await fs.readdir(TD_ICONS_SVG_DIR, { withFileTypes: true });
  const icons = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
    .map((entry) => entry.name.replace(/\.svg$/, ""))
    .sort();

  await fs.mkdir(TD_DOCS_OUTPUT_DIR, { recursive: true });
  await fs.writeFile(ICON_OUTPUT_PATH, JSON.stringify(icons, null, 2), "utf-8");

  console.log(`✓ Extract ${icons.length} icons successfully`);
}
