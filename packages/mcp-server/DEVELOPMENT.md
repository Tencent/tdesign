# <img src="https://tdesign.tencent.com/favicon.ico" height="45"/> 开发指南

## 🏠 项目架构

```bash
# 安装依赖
npm install

#（可选）更新文档
npm run build:docs+dom
```

- 由于该项目在提取文档时，如果找不到本地仓库的话，会自动启动 clone 其它组件库的流程。
- 如果你本地已经有 TDesign 的其它组件库项目，可以把该仓库 clone 到相同的目录下；如果没有，建议新建一个额外的空目录，再把该仓库 clone 进去。

```bash
📄 .env # 环境变量（仅用于本地调试）
📁 packages/mcp-server
├── 📁 common # 通用工具函数
├── 📁 docs # 已整理的文档（脚本生成，不入库）
├── 📁 scripts # 自动化脚本
└── 📁 server # 核心业务逻辑
    ├── 📁 tools
    └── 📁 prompts
```

### ⚠️ Apple Silicon 环境说明

如果你使用 Apple Silicon（M系列）Mac，需要额外安装 Rosetta 才能运行小程序快照构建脚本（`build:snap:mini`）。

- 因为底层依赖的 `miniprogram-simulate` → `miniprogram-compiler` 仅提供了 `x86_64` 架构的二进制文件，需要进行转译。

```bash
softwareupdate --install-rosetta --agree-to-license
```

## 🕹️ 本地启动

| 环境变量 | 说明 | 可选值 | 默认值 |
|:---|:---|:---|:---|
| `DOCS_SOURCE_MODE` | 文档数据来源 | `online`（CDN）<br>`local`（docs 文件夹） | `online` |

### Stdio

```bash
npm run build:mcp-stdio
```

```json
{
  "mcpServers": { 
    "tdesign-mcp-server": {
      "command": "node",
      "args": ["your_path_to/tdesign/packages/mcp-server/server/dist/stdio.js"],
      "env": {
        "DOCS_SOURCE_MODE": "local"
      }
    }
  }
}
```
### StreamableHttp

```bash
npm run build:mcp-http
npm run start:mcp-http
```

```json
{
  "mcpServers": { 
    "tdesign-mcp-server": {
      "url": "localhost:9000/mcp",
      "env": {
        "DOCS_SOURCE_MODE": "local"
      }
    }
  }
}
```
