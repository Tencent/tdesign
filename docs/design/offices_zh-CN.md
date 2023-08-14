---
title: 中后台整体框架搭建
description: 在明确系统功能分类和结构后，先选择合适的页面导航和布局，建立基础的中后台框架。
isDesign: true
---

## 什么是中后台系统

中台系统主要指：响应前后台业务，实现双端的集中管理和价值提取，支持业务创新和精细化运营的数据处理系统。

后台系统主要指：对前端网站信息和数据进行管理的系统，主要面向企业内部的运营和管理人员。

在 Web 前端设计当中，中台与后台具有同质性，可看作同一类型来思考设计方法。通过 TDesign 提供的组件能力快速搭建好用的中后台系统，通常可以分三步：选择合适的页面框架-设计页面间的任务流程-合理使用组件。


## 中后台页面框架的选择

页面框架由「页面导航」与「页面布局」两部分组成。同时，TDesign 提供常见的页面模版，可根据需要直接选择合适的模版。


### 页面导航

导航是指：在页面中引导用户找到功能和理解信息层级，可分为整站导航与区域导航两大类。


| 导航分类     | 定义                                                     |相关组件                                                     |
| :--------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 整站导航 | 对整个网站系统的最大颗粒度模块的引导，也称为全局导航或总导航。| [导航菜单](/vue/components/menu) 
| 区域导航 | 对某一模块下的页面，进行引导和分类的导航，也称为情景导航。  | [固钉](/vue/components/affix)  、[锚点](/vue/components/anchor)、[面包屑](/vue/components/breadcrumb)、[下拉菜单](/vue/components/dropdown)、[分页](/vue/components/pagination)、[步骤条](/vue/components/steps)、[选项卡](/vue/components/tabs)


<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211215163954.png" />


### 页面布局

页面布局是指：将导航和信息内容在页面中进行合理安排和分布，由「[栅格](/vue/components/grid)」和「[布局](/vue/components/layout)」组成。



不同布局的选择依据，通常为：1 功能模块的数量。2 功能与功能之间的相关性。

TDesign主要提供3种布局方式：上下布局、左右布局、混合布局。


#### 上下结构的布局

主要特征：导航在上信息内容在下的布局。横向导航空间有限，左右点击效率低。

何时使用：1 功能模块数量较少时（一般小于 9 个）。2 各模块间关联较弱、需要做明确区分或无需频繁切换时。


#### 左右结构的布局

主要特征：导航在左信息内容在右的布局。纵向空间具有较好延展性，上下点击效率高。

何时使用：1 功能模块数量较多时。2 各模块间有一定相关性、或需要在模块间频繁切换时。


#### 混合结构的布局

主要特征：将上下、左右相结合的综合布局。横纵空间优势互补，在展示和操作上都具有较好的延展性和包容性。

何时使用：1 功能模块数量较多时。2 各模块间有父子或交叉关系、 需要按层级展示时。


<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211215164005.png" />




## 常见的中后台页面

TDesign提供了中后台系统常见的页面模板，涵盖多种高频任务在页面中的典型布局方式。

| 典型页面模板     | 相关高频任务                                                     |
| :--------- | :----------------------------------------------------------- |
| [仪表盘](https://tdesign.tencent.com/starter/vue/#/dashboard/base)  | [数据筛选与查询](/design/offices-task#数据筛选与查询)、[效果预览](/design/offices-task#效果预览)、[新手指引](/design/offices-task#新手指引) |
| [列表页](https://tdesign.tencent.com/starter/vue/#/list/base) | [数据筛选与查询](/design/offices-task#数据筛选与查询)、[表格批量操作](/design/offices-task#表格批量操作)、[数据导入](/design/offices-task#数据导入)、[效果预览](/design/offices-task#效果预览)、[状态流转](/design/offices-task#状态流转)、[任务引导](/design/offices-task#任务引导) 、[新手指引](/design/offices-task#新手指引)  |
| [表单页](https://tdesign.tencent.com/starter/vue/#/form/base)     | [数据筛选与查询](/design/offices-task#数据筛选与查询)、[任务引导](/design/offices-task#任务引导)、[效果预览](/design/offices-task#效果预览)、[新手指引](/design/offices-task#新手指引)                    |
| [详情页](https://tdesign.tencent.com/starter/vue/#/detail/base)      | [数据筛选与查询](/design/offices-task#数据筛选与查询)、[状态流转](/design/offices-task#状态流转)、[数据导入](/design/offices-task#数据导入)、[效果预览](/design/offices-task#效果预览)                     |
| [结果页](https://tdesign.tencent.com/starter/vue/#/result/success)  | [状态流转](/design/offices-task#状态流转)、[新手指引](/design/offices-task#新手指引)、[任务引导](/design/offices-task#任务引导)              |
| [个人页](https://tdesign.tencent.com/starter/vue/#/user/index)   | [新手指引](/design/offices-task#新手指引)、[效果预览](/design/offices-task#效果预览)                  |
| [登录页](https://tdesign.tencent.com/starter/vue/#/login)    | [新手指引](/design/offices-task#新手指引)、[任务引导](/design/offices-task#任务引导)                     |



