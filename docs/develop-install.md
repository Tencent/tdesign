# Development and Installation

## Directory Structure

In order to accommodate various installation scenarios, we have defined a standard for component build output. You can choose the installation method you need according to the following component output directory structure:

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

## Output Explanations

### dist

- Package all component code and styles, generating separate one JS file and one CSS file
- Ensure compatibility with modern browsers and support for server-side rendering
- Build JS files using the UMD (Universal Module Definition) standard
- JS/CSS files should support browser script/link tags and integration with mainstream build tools (Webpack, Rollup, etc.)
- JS files must generate corresponding `.min` and `.map` files for online resource loading and debugging
- `common/style/(web|mobile)/index.less` is the build entry point
- Generate an uncompressed `tdesign.css` and `tdesign.css.map` under the dist directory
  Compress `tdesign.css` to generate `tdesign.min.css`

### es

- Compile each component's TypeScript code separately, generating corresponding JS files and type declaration files
- Ensure compatibility with modern browsers and support for server-side rendering
- Use the ES Modules standard for component import/export, supporting tree-shaking; in `es/index.js`, export each component separately with content identical to `src/index.ts`
- Generate a style directory under the component folder to store the compiled CSS style files
- The component folder include type declaration files `\*.d.ts`
- Inject the Babel runtime helpers used in the compiled component code into each component
- Only compile component code, without compiling test files or documentation files, etc.

### esm

- Compile each component's TypeScript code separately, generating corresponding JS files and type declaration files
- Ensure compatibility with modern browsers and support for server-side rendering
- Component Import/Export method utilizes the ES Modules standard, supports tree-shaking, and separately exports individual components in esm/index.js. The contents are the same as those in `src/index.ts`
- Generate `style/index.js` within the component folder, linking to the uncompiled less style files
- The component folder include type declaration files `\*.d.ts`
- Inject the Babel runtime helpers used in the compiled component code into each component
- Only compile component code, without compiling test files or documentation files, etc.

### lib

- Compile each component's TS code separately, generating corresponding JS files and type declaration files
- Ensure compatibility with modern browsers and support for server-side rendering
- Use the CommonJs Modules standard for component import/export; in `lib/index.js`, export each component separately with content identical to `src/index.ts`
- The component folder must include type declaration files `\*.d.ts`
- Inject the Babel runtime helpers used in the compiled component code into each component
- Only compile component code, without compiling test files or documentation files, etc.

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
    ],
    "sideEffects": [
        "dist/*",
        "site/*",
        "examples/*",
        "es/**/style/**",
        "esm/**/style/**"
    ],                                  // for tree-shaking
    "main": "lib/index.js",             // default entry point
    "module": "es/index.js",            // entry point to ES modules
    "unpkg": "dist/tdesign.min.js",     // entry point to unpkg
    "jsdelivr": "dist/tdesign.min.js",  // entry point to jsdelivr
    "typings": "lib/index.d.ts",        // TypeScript declaration
}
```

## Installation

The default component package's main entry points to `lib/index.js`, and the ESM entry points to `es/index.js`.

We recommend using bundling tools that support tree-shaking, such as `Webpack` or `Rollup`, which will only bundle the code you actually use.

For more specific installation methods, please refer to the instructions in each component library's documentation.
