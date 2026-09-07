import fs from 'fs';
import path from 'path';

// 从 tdesign-icons-view/manifest 子路径导入图标分类清单
import { manifest } from 'tdesign-icons-view/manifest';

/**
 * vite 插件：构建结束时将图标分类清单序列化为
 * icons_manifest.json 写入构建产物目录。
 */
export default function iconsManifestPlugin() {
  let outDir;
  return {
    name: 'tdesign-icons-manifest',
    enforce: 'pre',
    configResolved(config) {
      outDir = config.build && config.build.outDir;
    },
    async closeBundle() {
      if (!outDir) return;
      try {
        const json = `${JSON.stringify(manifest, null, 2)}\n`;
        const dir = path.resolve(outDir);
        fs.mkdirSync(dir, { recursive: true });
        const target = path.join(dir, 'icons_manifest.json');
        fs.writeFileSync(target, json, 'utf8');
        // eslint-disable-next-line no-console
        console.log(`[plugin-icons-manifest] 已生成 ${target}`);
      } catch (error) {
        // 构建不应因图标清单生成失败而中断，仅告警
        // eslint-disable-next-line no-console
        console.warn('[plugin-icons-manifest] 生成 icons_manifest.json 失败：', error && error.message);
      }
    },
  };
}
