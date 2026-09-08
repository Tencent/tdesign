import fs from 'fs';
import path from 'path';

/**
 * vite 插件：构建结束时将图标分类清单序列化为
 * icons-manifest.json 写入构建产物目录。
 *
 * 图标清单在 closeBundle 内通过运行时动态 import 从
 * tdesign-icons-view/manifest 获取。若不放到 try/catch 内，
 * 顶层静态导入 manifest 一旦失败会直接在插件加载期中断整个构建，
 * 达不到"仅告警不中断"的效果。
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
        // 动态导入图标分类清单，失败时由下方 catch 捕获，仅告警、不中断构建
        const { manifest } = await import('tdesign-icons-view/manifest');
        const json = `${JSON.stringify(manifest)}\n`;
        const dir = path.resolve(outDir);
        fs.mkdirSync(dir, { recursive: true });
        const target = path.join(dir, 'icons-manifest.json');
        fs.writeFileSync(target, json, 'utf8');
        // eslint-disable-next-line no-console
        console.log(`[plugin-icons-manifest] 已生成 ${target}`);
      } catch (error) {
        // 构建不应因图标清单生成失败而中断，仅告警
        // eslint-disable-next-line no-console
        console.warn('[plugin-icons-manifest] 生成 icons-manifest.json 失败：', error && error.message);
      }
    },
  };
}
