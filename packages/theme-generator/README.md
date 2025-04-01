## TDesign Theme Generator Plugin

- TDesign theme generator plugin, which is available in any web application.

### 🏗️ Develop

- `npm run dev`

- `npm run build:watch` execute `npm link` as well to preview in application project

### ⚙️ Build

- `npm run build` build web-component

### 📦 Usage

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
