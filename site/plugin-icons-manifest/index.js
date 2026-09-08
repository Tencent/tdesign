import fs from 'fs';
import path from 'path';
import { manifest } from 'tdesign-icons-view/manifest';

/**
 * vite 插件：构建结束时将图标分类清单序列化为
 * icons-manifest.json 写入构建产物目录。
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
        const json = `${JSON.stringify(manifest)}\n`;
        const dir = path.resolve(outDir);
        fs.mkdirSync(dir, { recursive: true });
        const target = path.join(dir, 'icons-manifest.json');
        fs.writeFileSync(target, json, 'utf8');
        // eslint-disable-next-line no-console
        console.log(`[plugin-icons-manifest] 已生成 ${target}`);
      } catch (error) {
        // 生成失败时抛出错误，中断构建报错
        throw new Error(`[plugin-icons-manifest] 生成 icons-manifest.json 失败：${error && error.message}`);
      }
    },
  };
}
