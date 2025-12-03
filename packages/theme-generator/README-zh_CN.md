<h1 style="text-align: center"><em><img alt="TDesign Logo" width="40" src="https://tdesign.tencent.com/favicon.ico"> TDesign Theme Generator</em></h1>

[English](./README.md) | 简体中文

TDesign 主题生成器挂件，专为组件库的文档站点量身打造，用于实时预览配色和样式的调整。

## 🔨 基础使用

1. `npm i tdesign-theme-generator`

2. `import 'tdesign-theme-generator';`

3. 在应用的代码中加入 `<td-theme-generator />`

- 对于移动端和小程序端，需要添加 device 参数，`mobile` 或 `mini-program`，例如 `<td-theme-generator device="mobile" />`

- 如果遇到参数无法正常传递的情况，可以尝试以下类似方式引入组件：

  ```js
    const generator = document.createElement('td-theme-generator');
    generator.setAttribute('device', 'mobile');
    document.body.appendChild(generator);
  ```

## 🏗️ 快速开发

```bash
npm link
npm run build:watch # 进入组件库站点热更新预览
```