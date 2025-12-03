<h1 style="text-align: center"><em><img alt="TDesign Logo" width="40" src="https://tdesign.tencent.com/favicon.ico"> TDesign Theme Generator</em></h1>

English | [简体中文](./README_zh-CN.md)

TDesign theme generator plugin, which is tailored for the component library documentation site. It is used for real-time preview of color and style adjustments.

## 🔨 Usage

1. `npm i tdesign-theme-generator`

2. `import 'tdesign-theme-generator'`;

3. add `<td-theme-generator />` in the application code

- For mobile and mini-program platforms, you need to add the `device` parameter, such as `<td-theme-generator device="mobile" />`.

- If you encounter issues where parameters cannot be passed correctly, you can try the following method to introduce the component:

  ```js
    const generator = document.createElement('td-theme-generator');
    generator.setAttribute('device', 'mobile');
    document.body.appendChild(generator);
  ```

## 🏗️ Develop

```bash
npm link
npm run build:watch # open the component library site with hot-reload preview
```
