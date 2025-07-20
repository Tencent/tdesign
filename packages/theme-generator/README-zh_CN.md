# TDesign Theme Generator Plugin

- TDesign 主题配置生成器挂件，支持任意框架使用。

## 🏗️ Develop

- `npm run dev`

- `npm run build:watch` 配合 npm link 进入站点热更新预览

- `npm run build` 构建 web component

## 📦 Usage

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


## 架构图