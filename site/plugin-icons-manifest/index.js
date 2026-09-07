import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { createRequire } from 'module';

/**
 * 从 tdesign-icons-view 打包产物中解析图标清单（manifest）。
 *
 * tdesign-icons-view 作为 Web Component 会把图标的分类清单（manifest）随产物一起打包，
 * 该清单以“明文”的 JS 对象形式内联在产物文件中（形如 `const XX = { filled: {...}, outline: {...} }`）。
 *
 * 说明：
 *  - 若未来 tdesign-icons-view 单独发布 manifest（如 dist/manifest.js），可优先从这里读取；
 *  - 当前版本未单独发布，故采用从打包产物中定位并求值 manifest 对象的方式获取。
 */
function extractManifest(pkgRoot) {
  const pkgPath = path.join(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const entryRel = pkg.main || 'index.js';
  const entryPath = path.join(pkgRoot, entryRel);
  if (!fs.existsSync(entryPath)) {
    throw new Error(`[plugin-icons-manifest] 未找到 tdesign-icons-view 入口文件: ${entryPath}`);
  }
  const source = fs.readFileSync(entryPath, 'utf8');

  // manifest 对象以 `const X = { filled: { Brand: ...` 形式明文内联在产物中
  const anchor = /const\s+\w+\s*=\s*\{\s*filled:\s*\{\s*Brand:/;
  const matched = source.match(anchor);
  if (!matched) {
    throw new Error('[plugin-icons-manifest] 未能在 tdesign-icons-view 产物中定位到 manifest 对象');
  }
  const objStart = matched.index + matched[0].indexOf('{');

  // 括号匹配，取出整个 manifest 对象字面量
  let depth = 0;
  let inString = false;
  let quote = '';
  let end = -1;
  for (let i = objStart; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (ch === '\\') {
        i += 1;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) {
    throw new Error('[plugin-icons-manifest] 解析 manifest 对象失败：未找到闭合括号');
  }

  const objectSource = source.slice(objStart, end);
  const sandbox = {};
  vm.createContext(sandbox);
  return vm.runInContext(`(${objectSource})`, sandbox);
}

/**
 * vite 插件：site 构建时从 tdesign-icons-view 提取图标清单，
 * 序列化为 icons_manifest.json 输出到构建产物目录。
 */
export default function iconsManifestPlugin() {
  let packageRoot;
  let outDir;
  return {
    name: 'tdesign-icons-manifest',
    enforce: 'pre',
    configResolved(config) {
      outDir = config.build && config.build.outDir;
      // 通过 createRequire 在 site 上下文解析 tdesign-icons-view 的真实安装位置
      const require = createRequire(path.resolve(config.root || process.cwd(), 'package.json'));
      try {
        packageRoot = path.dirname(require.resolve('tdesign-icons-view/package.json'));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          '[plugin-icons-manifest] 无法解析 tdesign-icons-view，跳过生成 icons_manifest.json',
          error && error.message,
        );
      }
    },
    async closeBundle() {
      if (!packageRoot || !outDir) return;
      try {
        const manifest = extractManifest(packageRoot);
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
