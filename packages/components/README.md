## TDesign Site Web Component

### 🏗️ Develop

```bash
# 安装
npm install

# 启动
npm dev
```

### ⚙️ Build

```bash
npm build
```

### 📦 Usage

```javascript
// import tdesign-site-components es module and style
import "tdesign-site-components";
import "tdesign-site-components/lib/styles/style.css";

// splice webcomponents into pages
<td-doc-layout>
  <td-header slot="header"></td-header>
  <td-doc-aside slot="doc-aside" title="Vue for Web"></td-doc-aside>

  <td-doc-content slot="doc-content">
    <td-doc-header slot="doc-header">
      <img slot="badge" src="" />
    </td-doc-header>

    <td-doc-tabs></td-doc-tabs>

    <div name="DEMO">Docs Content</div>

    <td-doc-demo></td-doc-demo>

    <td-doc-footer slot="doc-footer"></td-doc-footer>
  </td-doc-content>
</td-doc-layout>;
```
