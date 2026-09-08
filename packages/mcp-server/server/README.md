# <img src="https://tdesign.tencent.com/favicon.ico" height="45"/> TDesign MCP Server

## 🎉 功能介绍

### 🔨 支持框架
- 桌面端：`react` / `vue-next` / `vue`
- 移动端：`mobile-react` / `mobile-vue` / `miniprogram` / `uniapp`
- AI 对话：`react-chat` / `vue-next-chat` / `miniprogram-chat` / `uniapp-chat`

### 🔨 支持工具
- [x] `search-icons`：搜索可用的图标列表，适用场景：图标查找与名称确认
- [x] `get-component-docs`：获取组件的文档，适用场景：代码生成和代码转换
- [x] `get-component-dom`：获取组件的 DOM 结构，适用场景：转换自定义的 CSS 样式
- [x] `get-component-list`：获取所有可用的组件列表，适用场景：选择合适组件进行组合实现不存在的功能
- [x] `get-component-changelog`：获取组件的变更日志，适用场景：组件库版本升级

## 📦 使用说明
```json
{
  "mcpServers": { // 或 servers（根据不同的 MCP 客户端决定）
    "tdesign-mcp-server": {
      "command": "npx",
      "args": ["-y", "tdesign-mcp-server@latest"]
    }
  }
}
```

> 💡 如果在 MCP 客户端中连接失败，可以在终端手动输入 `npx tdesign-mcp-server`，并反馈对应的报错信息在 issue。
