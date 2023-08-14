---
title: Building the Framework for Mid-End and Back-End Systems
description: After clarifying the categories and structure of the system, firstly select appropriate page navigation and layout to establish a basic framework for the mid-end and back-end system.

isDesign: true
---

## What is Mid-end System and Back-end System

Mid-end system refers to a data processing system that responds to front-end and back-end businesses, achieves centralized management and value extraction on both ends, and supports business innovation and refined operation.

Back-end system refers to the system that manages front-end website information and data, primarily serving enterprise internal operation and management staff.

In web design, mid-end and back-end systems exhibit homogeneity, and they can be considered as the same type when thinking about design methods. Building a useful mid-end and back-end system quickly with TDesign components can usually be done in three steps:

1. choosing an appropriate page framework
2. designing the task flow between pages
3. using components reasonably.

## Choice of System Page Framework

Page Framework consists of page navigation and page layout. Meanwhile, TDesign provides common page templates, allowing users to choose the appropriate template directly as needed.

### Page Navigation

Page navigation guides users to find functions and understand information hierarchy within the page, which can be divided into two major categories - site-wide navigation and regional navigation

| Category             | Definition                                                                                                            | Components                                                                                                                                                                                                                                                |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site-wide Navigation | Guide users to the site's most significant modules within the entire website system, also known as global navigation. | [Menu](/vue/components/menu)                                                                                                                                                                                                                              |
| Region Navigation    | Guide and categorize pages within a single module, also known as situational navigation.                              | [Affix](/vue/components/affix) 、[Anchor](/vue/components/anchor)、[Breadcrumb](/vue/components/breadcrumb)、[Dropdown](/vue/components/dropdown)、[Pagination](/vue/components/pagination)、[Steps](/vue/components/steps)、[Tabs](/vue/components/tabs) |

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211215163954.png" />

### Page Layout

Page layout means thereasonable arrangement and distribution of navigation and information content on a page, which consists of 「[Grid](/vue/components/grid)」 and 「[Layout](/vue/components/layout)」

The choice of different layouts is usually based on:

1. The number of functional modules.
2. The correlation between different functions.

TDesign mainly provides 3 types of layout: top-bottom layout, left-right layout, and mixed layout.

#### Top-Bottom Layout

Top-Bottom Layout is the layout with navigation on top and information content below. Horizontal navigation space is limited, and left-right clicking efficiency is low.

When to use:

1. When the number of functional modules is small (generally less than 9).
2. When the correlation between modules is weak, clear distinction is needed, or frequent switching is not required.

#### Left-Right Layout

Left-Right Layout is the layout with navigation on the left and information content on the right. Vertical space has good scalability, and up-down clicking efficiency is high.

When to use:

1. When the number of functional modules is large.
2. When there is a certain correlation between the modules, or when frequent switching between modules is required.

#### Mixed Layout

Mixed Layout is a comprehensive layout that combines top-bottom and left-right elements. Both horizontal and vertical spaces complement each other, offering good scalability and inclusiveness in both display and operation.

When to use:

1. When the number of functional modules is large.
2. When there are parent-child or cross relationships between the modules, or when hierarchical display is required.

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211215164005.png" />

## Common Mid-end and Back-end Page Templates

TDesign offers a variety of standard page templates for mid-end and back-end systems, including typical layout styles for a wide range of high-frequency tasks.

| Page Templates                                                          | High-Frequency Tasks                                                                                                                                                                                                                                                                                                                                                                     |
| :---------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Dashboard](https://tdesign.tencent.com/starter/vue/#/dashboard/base)   | [Data Filtering and Querying](/design/offices-task#数据筛选与查询)、[Preview](/design/offices-task#效果预览)、[New User Guidance](/design/offices-task#新手指引)                                                                                                                                                                                                                         |
| [List Page](https://tdesign.tencent.com/starter/vue/#/list/base)        | [Data Filtering and Querying](/design/offices-task#数据筛选与查询)、[Table Batch Operation](/design/offices-task#表格批量操作)、[Data Import](/design/offices-task#数据导入)、[Preview](/design/offices-task#效果预览)、[Status Transitions](/design/offices-task#StatusTransition)、[Task Guidance](/design/offices-task#任务引导) 、[New User Guidance](/design/offices-task#新手指引) |
| [Form Page](https://tdesign.tencent.com/starter/vue/#/form/base)        | [Data Filtering and Querying](/design/offices-task#数据筛选与查询)、[Task Guidance](/design/offices-task#任务引导)、[Preview](/design/offices-task#效果预览)、[New User Guidance](/design/offices-task#新手指引)                                                                                                                                                                         |
| [Detail Page](https://tdesign.tencent.com/starter/vue/#/detail/base)    | [Data Filtering and Querying](/design/offices-task#数据筛选与查询)、[Status Transitions](/design/offices-task#StatusTransition)、[Data Import](/design/offices-task#数据导入)、[Preview](/design/offices-task#效果预览)                                                                                                                                                                  |
| [Result Page](https://tdesign.tencent.com/starter/vue/#/result/success) | [Status Transitions](/design/offices-task#StatusTransition)、[New User Guidance](/design/offices-task#新手指引)、[Task Guidance](/design/offices-task#任务引导)                                                                                                                                                                                                                          |
| [User Page](https://tdesign.tencent.com/starter/vue/#/user/index)       | [New User Guidance](/design/offices-task#新手指引)、[Preview](/design/offices-task#效果预览)                                                                                                                                                                                                                                                                                             |
| [Login Page](https://tdesign.tencent.com/starter/vue/#/login)           | [New User Guidance](/design/offices-task#新手指引)、[Task Guidance](/design/offices-task#任务引导)                                                                                                                                                                                                                                                                                       |
