import fs from 'fs';
import path from 'path';

// tdesign-icons-view 提供独立的 manifest 产物子路径，
// 可直接导入图标分类清单（filled / outline）。
import { manifest } from 'tdesign-icons-view/manifest';

/**
 * vite 插件：site 构建时从 tdesign-icons-view 提取图标清单，
 * 序列化为 icons_manifest.json 输出到构建产物目录。
 *
 * tdesign-icons-view 作为 Web Component 会单独发布 manifest 产物
 * （`tdesign-icons-view/manifest`），构建时直接引入即可，
 * 无需再从打包产物中以正则解析 manifest。
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
