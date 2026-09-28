import fs from 'fs';
import path from 'path';
import { manifest } from 'tdesign-icons-view/manifest';

export default function iconsManifestPlugin() {
  let outDir;
  return {
    name: 'tdesign-icons-manifest',
    enforce: 'pre',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir || 'dist');
    },
    async closeBundle() {
      if (!outDir) return;
      try {
        const json = `${JSON.stringify(manifest)}\n`;
        fs.mkdirSync(outDir, { recursive: true });
        const target = path.join(outDir, 'icons-manifest.json');
        fs.writeFileSync(target, json, 'utf8');
        // eslint-disable-next-line no-console
        console.log(`[plugin-icons-manifest] 已生成 ${target}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`[plugin-icons-manifest] 生成 icons-manifest.json 失败：${message}`);
      }
    },
  };
}
