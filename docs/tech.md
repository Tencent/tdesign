---
title: Overall
---

Please refer to [《TDesign Component Library Construction》](https://mp.weixin.qq.com/s?__biz=Mzg3MjYwODA1OA==&mid=2247515208&idx=1&sn=166d4a5313cadbb80d2a401edf46b455)

## Repository Structure

Each repository corresponds to a component library implemented using a specific tech stack, containing both the implementation code for that tech stack and a [tdesign-common](https://github.com/Tencent/tdesign-common) submodule. The submodule serves as a shared library and includes:

- Shared utils and functions for components
- UI for components，including both HTML structure and CSS stylesheet

### Initialize Submodule

- After cloning the source code, please initialize the submodules: `git submodule init && git submodule update`
- After executing `git submodule update`, the submodule does not point to any branch, but a detached state pointing to a specific commit.

### Development of Submodule

Checkout a new branch such as `feature/button` from `develop` branch, first enter the submodule to complete the commit for submodule, then return to the main repository to complete the commit.

### About UI Development

UI development is shared among multiple implementation frameworks such as React, Vue, etc. Components implementation of each framework should reuse the HTML structure from the UI development, and reference the component CSS and demo CSS (which have been imported at the entry point of the repository). UI development can be carried out by a dedicated UI developer or one of the framework component developers.

- If the UI development for a specific component is already available before the component development starts, use it directly in the main repository.
- If it is not available, and you are also responsible for UI development, follow the UI development guidelines to complete the UI development content and then develop the component in the main repository.
- If it is not available, and another teammate is responsible for or has claimed the UI development task, you can develop the component functionality in the main repository first and align it with the UI development output later.
- If the UI content and styles (developed by other team members) have not been completed yet, and you need to write some styles while developing the component functionality, you can create a temporary less file directly in the component folder and import it in the JavaScript file, like this:

```
├── button.less
├── button.tsx
```

```js
// button.tsx

import "./button.less";
```

## Guidelines

### Naming Rules

[https://github.com/Tencent/tdesign-common/blob/develop/naming.md](https://github.com/Tencent/tdesign-common/blob/develop/naming.md)

### Git Commit Guidelines

Follow angular commit guidelines

<https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits>

Commits of features and bug fixes will be used for generation of CHANGELOG

- `feat`: new feature
- `fix`: bug fix
- `docs`: modification for documentation
- `style`: modification for UI
- `refactor`: refactor
- `test`: add test
- `chore`：change for bundles, develop tools and workflow

### TS Rules

- Pascal Case naming is required when exporting variables in the component library.
- Eslint configuration in project and the Airbnb style guide is required to adhere.

### Style Guidelines

- Use the BEM naming convention is required for [class naming](https://github.com/Tencent/tdesign-common/blob/develop/css-naming.md).

- Maintain a separate folder for each component style for reuse and development of theme customization tools.

### API Design Guidelines

To ensure a consistent user experience across various tech stack implementations of the component library, TDesign follows a unified set of standards for component API naming. Please read [API naming](https://github.com/Tencent/tdesign-common/blob/develop/api.md) for more detail.

## Technology Selection

| Category         | Selection                               | References                                                                                           |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Develop Language | TypeScript                              | [http://www.typescriptlang.org/](http://www.typescriptlang.org/)                                     |
| Style Language   | less                                    | [http://lesscss.org/](http://lesscss.org/)                                                           |
| Build            | Vite for develop <br> Rollup for bundle | [https://vitejs.dev/](https://vitejs.dev/)<br>[https://www.rollupjs.com/](https://www.rollupjs.com/) |
| Test             | jest <br> cypress e2e test              | [https://jestjs.io/](https://jestjs.io/)<br>[https://www.cypress.io/](https://www.cypress.io/)       |
| web-vue          | Vue@2.x                                 | [https://github.com/vuejs/vue](https://github.com/vuejs/vue)                                         |
| web-vue-next     | Vue@3.x                                 | [https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)                               |
| mobile-vue       | Vue@3.x                                 | [https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)                               |
| react            | React@16.x                              | [https://github.com/facebook/react](https://github.com/facebook/react)                               |
