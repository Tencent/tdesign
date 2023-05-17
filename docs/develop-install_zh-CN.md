# 开发安装

## 目录结构

为了满足各种安装场景，我们规定了组件的构建输出规范，你可以依照下面的组件输出目录结构选择需要的安装方式。

```bash
├─ dist                        ## umd
│   ├─ tdesign.js
│   ├─ tdesign.js.map
│   ├─ tdesign.min.js
│   ├─ tdesign.min.js.map
│   ├─ tdesign.css
│   ├─ tdesign.css.map
│   └─ tdesign.min.css
├─ esm                                ## esm
│   ├─ button
│        ├─ style
│             └─  index.js
│        ├─ button.js
│        ├─ button.d.ts
│        ├─ index.js
│        └─ index.d.ts
│   ├─ index.js
│   └─ index.d.ts
│
├─ es                                ## es
│   ├─ button
│        ├─ style
│             ├─ css.js
│             ├─ index.css
│             └─ index.js
│        ├─ button.js
│        ├─ button.d.ts
│        ├─ index.js
│        └─ index.d.ts
│   ├─ index.js
│   └─ index.d.ts
│
├─ lib                            ## cjs
│   ├─ button
│        ├─ button.js
│        ├─ button.d.ts
│        ├─ index.js
│        └─ index.d.ts
│   ├─ index.js
│   └─ index.d.ts
│
├─ LICENSE
├─ CHANGELOG.md
├─ README.md
└─ package.json
```

## 产物说明

### dist

- 打包所有组件代码和样式，分别生成一个 js 与 css 文件
- 兼容现代浏览器，支持服务端渲染
- JS 文件采用 UMD 模块标准 构建
- JS / CSS 文件支持浏览器 script / link 标签 与 主流构建工具(webpack，rollup 等)引入使用
- JS 文件必须生成对应 `.min` 和 `.map` 文件，以便线上资源加载和 debug
- 以 common/style/(web|mobile)/index.less 为入口构建
- 在 dist 下生成一份未压缩的 `tdesgin.css` 和 `tdesign.css.map`
- 压缩 `tdesgin.css` 生成 `tdesgin.min.css`

### es

- 分别编译每个组件的 TS 代码，生成对应的 JS 文件和类型声明文件
- 兼容现代浏览器，支持服务端渲染
- 组件导入/导出方式采用 ES Modules 标准，支持 tree-shaking，es/index.js 中单独导出每个组件，内容同 src/index.ts
- 组件文件夹下生成 style 目录，存放编译后的 CSS 样式文件
- 组件文件夹下必须包含类型声明文件 `\*.d.ts`
- 组件编译后代码用到的 babel runtime helpers 注入到每个组件
- 只编译组件代码，不用编译测试文件和文档文件等

### esm

- 分别编译每个组件的 TS 代码，生成对应的 JS 文件和类型声明文件
- 兼容现代浏览器，支持服务端渲染
- 组件导入/导出方式采用 ES Modules 标准，支持 tree-shaking，esm/index.js 中单独导出每个组件，内容同 src/index.ts
- 组件文件夹下生成 `style/index.js`，链接未编译的 `less` 样式文件
- 组件文件夹下必须包含类型声明文件 `\*.d.ts`
- 组件编译后代码用到的 babel runtime helpers 注入到每个组件
- 只编译组件代码，不用编译测试文件和文档文件等

### lib

- 分别编译每个组件的 TS 代码，生成对应的 JS 文件和类型声明文件
- 兼容现代浏览器，支持服务端渲染
- 组件导入/导出方式采用 CommonJs Modules 标准，`lib/index.js` 中单独导出每个组件，内容同 `src/index.ts`
- 组件文件夹下必须包含类型声明文件 `\*.d.ts`
- 组件编译后代码用到的 babel runtime helpers 注入到每个组件
- 只编译组件代码，不用编译测试文件和文档文件等

### (esm|es)/componentName/style

- 遍历 common/style/(web|mobile)/componentName/index.less 入口构建每个组件的样式
- 每个组件生成一份 `index.less` 和 `index.css` 放置到 lib/componentName/style/ 下
- component-name/style/ 下生成 index.js，写入 import './index.less';
- component-name/style/ 下生成 css.js，写入 import './index.css';

### package.json

```javascript
{
    ...
    "files": [
        "es",
        "esm",
        "lib",
        "dist",
        "LICENSE",
        "README.md",
        "CHANGELOG.md"
    ],                                  // 指定上传到 NPM 上的文件
    "sideEffects": [
        "dist/*",
        "site/*",
        "examples/*",
        "es/**/style/**",
        "esm/**/style/**"
    ],                                  // 指定有副作用的文件，可用于 tree-shaking
    "main": "lib/index.js",             // 指定通用的NPM包入口
    "module": "es/index.js",            // 指定支持ES Modules构建的NPM包入口
    "unpkg": "dist/tdesign.min.js",     // 指定 unpkg 入口
    "jsdelivr": "dist/tdesign.min.js",  // 指定 jsdelivr 入口
    "typings": "lib/index.d.ts",        // TS 声明
}
```

## 安装

默认组件包的 main 入口指向 lib/index.js，esm 入口指向 es/index.js

我们推荐使用如 webpack 或 rollup 等支持 tree-shaking 的构建工具，默认只打包你实际使用到的代码

更具体的安装方式需要参考各组件库文档里的说明。
