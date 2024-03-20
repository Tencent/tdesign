---
title: About TDesign
---

## What is TDesign

TDesign is an enterprise-level design system accumulated by Tencent's various business teams.

TDesign features a unified [design values](https://tdesign.tencent.com/design/values), consistent design language, and visual style, helping users form continuous and coherent perceptions of the experience. Based on this, TDesign offers out-of-the-box [UI component libraries](https://tdesign.tencent.com/vue/), [design guidelines](https://tdesign.tencent.com/vue/components/button?tab=design), and [design assets](https://tdesign.tencent.com/source), elegantly and efficiently freeing design and development from repetitive tasks. Simultaneously, it facilitates easy extension on top of TDesign, enabling a better alignment with business requirements.

## Why TDesign

Before 2019, there were many internal design system and component library projects within Tencent, centered around product-focused "decentralized" rapid iterations.

In 2019, Tencent established the [Open Source Collaboration Committee](<(https://m.thepaper.cn/yidian_promDetail.jsp?contid=4653692&from=tdesign)>). Through internal open-source collaboration, it organized different teams working on similar technology products to collaborate.

TDesign is the collaborative outcome of frontend and design under Tencent's open-source collaboration, with the aim to jointly build a comprehensive and versatile design system and component library.

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/introduce-oteam.png" alt="components" style="border: 1px solid var(--component-border); border-radius: 6px;">

## Development of TDesign

TDesign was founded with the principles of open-source collaboration from the beginning. The [collaboration scheme discussion](https://github.com/Tencent/tdesign/wiki), [component design](https://github.com/Tencent/tdesign/wiki), and [API design](https://github.com/Tencent/tdesign/wiki), including source code, are fully open within the company, garnering widespread attention from internal developers and designers. TDesign follows an equal, open, and strict policy, regardless of the participants' roles.

Many participants started by trying out the component library in their personal projects, advancing to submit their first Issue, then their first Feature MR, and gradually becoming involved in Code Review and solution-formulating tasks, eventually turning into core contributors. In the past year, TDesign has closed 1k+ issues and conducted 5k+ Code Reviews to maintained a [weekly iterative release](<(https://tdesign.tencent.com/vue/components/changelog)>) of new versions.

TDesign currently supports [multiple platforms and mainstream front-end UI framework](#仓库). Desktop versions for Vue2, Vue3, and React, as well as mobile versions for WeChat Mini Programs, have been launched as stable versions. Mobile React and QQ Mini Program versions have been released the `Alpha` versions for internal testing.

## Repositories

### Repositories for Desktop Components

| Repository                                                      | Description                           | Status        |
| --------------------------------------------------------------- | ------------------------------------- | ------------- |
| [tdesign-vue](https://github.com/Tencent/tdesign-vue)           | Vue.js UI components lib for TDesign  | `1.0 LTS`     |
| [tdesign-vue-next](https://github.com/Tencent/tdesign-vue-next) | Vue3.x UI components lib for TDesign  | `1.0 LTS`     |
| [tdesign-react](https://github.com/Tencent/tdesign-react)       | React UI components lib for TDesign   | `1.0 LTS`     |

### Repositories for Mobile Components

| Repository                                                              | Description                                      | Status        |
| ----------------------------------------------------------------------- | ------------------------------------------------ | ------------- |
| [tdesign-miniprogram](https://github.com/Tencent/tdesign-miniprogram)   | Wechat MiniProgram UI components lib for TDesign | `1.0 LTS`     |
| [tdesign-mobile-vue](https://github.com/Tencent/tdesign-mobile-vue)     | Vue3.x Mobile UI components lib for TDesign      | `1.0 LTS`     |
| [tdesign-mobile-react](https://github.com/Tencent/tdesign-mobile-react) | React Mobile UI components lib for TDesign       | `Alpha`       |
| tdesign-flutter                                                         | Flutter UI components lib for TDesign            | `Alpha`       |

### Repositories for Common

| Repository                                                  | Description                               |
| ----------------------------------------------------------- | ----------------------------------------- |
| [tdesign](https://github.com/Tencent/tdesign)               | TDesign main repository and documentation |
| [tdesign-icons](https://github.com/Tencent/tdesign-icons)   | A mono repo for TDesign Icons             |
| [tdesign-common](https://github.com/Tencent/tdesign-common) | TDesign Common Style and Utils            |

### Repositories for out-of-box Starter-kit

| Repository                                                                                          | Description                                              |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [tdesign-starter-cli](https://github.com/Tencent/tdesign-starter-cli)                               | CLI tool for TDesign Starter kit                         |
| [tdesign-vue-starter](https://github.com/Tencent/tdesign-vue-starter)                               | starter-kit for TDesign Vue UI components                |
| [tdesign-vue-next-starter](https://github.com/Tencent/tdesign-vue-next-starter)                     | starter-kit for TDesign Vue Next UI components           |
| [tdesign-react-starter](https://github.com/Tencent/tdesign-react-starter)                           | starter-kit for TDesign React UI components              |
| [tdesign-miniprogram-starter-retail](https://github.com/Tencent/tdesign-miniprogram-starter-retail) | starter-kit for TDesign Wechat Miniprogram UI components |

For TDesign's subsequent development plan, please refer to the [TDesign upcoming plans](/about/roadmap).

## Features

### Comprehensive

TDesign Support [Vue 2](https://tdesign.tencent.com/vue/)、[Vue 3](https://tdesign.tencent.com/vue-next/)、[React](https://tdesign.tencent.com/react/) components for Desktop Application and [Vue 3](https://tdesign.tencent.com/vue-mobile/)、[Wechat MiniProgram](https://tdesign.tencent.com/miniprogram/) components for Mobile Application.

To improve collaboration efficiency between developers and designers, TDesign provides a wide variety of reusable design components such as [color systems](https://tdesign.tencent.com/design/color), [font system](https://tdesign.tencent.com/design/fonts), [motion design](https://tdesign.tencent.com/design/motion), [icons](https://tdesign.tencent.com/design/icon), and [layout](https://tdesign.tencent.com/design/layout). These components are compatible with popular design software like [Axure, Sketch, Figma, and Adobe XD](https://tdesign.tencent.com/source).

In addition to regular design resources, TDesign also provides auxiliary design tools such as [Sketch plugins](https://tdesign.tencent.com/source) and supports the use of TDesign design materials in other design tools like [即时设计、Pixso、墨刀 ](https://tdesign.tencent.com/source).

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/introduce-resources.png" alt="components" style="border: 1px solid var(--component-border); border-radius: 6px;">

### Consistency

TDesign distills Tencent's years of design experience into professional design guideline, providing universal design solutions that assist product managers, designers, developers, and other roles in efficiently completing the design and development of enterprise-level products, while maintaining consistent design language and style to meet user experience requirements.

Based on TDesign's design system standards, TDesign has launched both desktop and mobile versions of the component library, offering multiple tech stack implementations. A series of collaborative workflows and auxiliary tools ensure consistency among the [component APIs](https://tdesign.tencent.com/apis) and implementation outcomes of components across various tech stacks. With these capabilities, even if a project uses different technology architectures or tech stacks, developers can leverage TDesign's universal design component library for development, significantly reduce learning costs, and gain a competitive edge when building unified, cross-platform, and cross-tech stack applications.

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/introduce-components.png" alt="components" style="border: 1px solid var(--component-border); border-radius: 6px;">

### Usability

TDesign has distilled design experiences from various businesses and scenarios during the formation of the TDesign design system, providing universal [design guidelines](https://tdesign.tencent.com/design/offices) to lower the barriers to entry. For the brand customization needs of different enterprise products, TDesign allows users to extend design styles. Currently, design styles have been organized and summarized as [Design Tokens](https://tdesign.tencent.com/design/color#header-21), forming a set of semantically-based design standards within the enterprise, facilitating unified management and upcoming expansion.

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/introduce-easy.png" alt="components" style="border: 1px solid var(--component-border); border-radius: 6px;">

In terms of component theme configuration, TDesign offers bright mode and [dark mode](https://tdesign.tencent.com/design/dark), supporting one-click switching to enhance the user experience. In the future, TDesign will also introduce industry-specific components for various vertical domains, covering a broader range of business areas. Product teams can configure corresponding requirements and start business development using the built-in industry themes.

TDesign also provides an out-of-box template called [TDesign Starter Kit](https://tdesign.tencent.com/starter). Developers can experience the functionality of components with it, or use it as a base scaffolding project for product development and launch.

## Join TDesign

By open sourcing to the public, TDesign aims to expand its services to the entire community. At the same time, open source marks a new beginning for TDesign. With the power of the community, TDesign hopes to create opportunities for exchanges and learning with others in the field, establishing an active community to continuously refine and improve the component library and related products.

If you are interested in participating in the open-source co-construction of TDesign, please read [Contributing](/about/contributing) first. We look forward to your involvement!

❤️ Thanks for all TDesign contributors:
</br>

<iframe src="https://tdesign.tencent.com/contributor.html" width="100%" height="1000" frameborder="0" scrolling="no" />
