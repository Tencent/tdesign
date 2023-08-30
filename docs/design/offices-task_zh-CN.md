---
title: 中后台高频任务设计方法
description: 明确整体框架和页面布局后，根据业务场景，对相关任务流程进行设计。
isDesign: true
---

中后台产品虽服务不同业务，但存在非常同质化的高频任务，掌握这些任务的设计方法，可有效提高中后台的交互体验。

## 数据筛选与查询

按所需条件或类型选择需要的数据项、或查询数据结果的任务。常应用于「[仪表盘](https://tdesign.tencent.com/starter/vue/#/dashboard/base) 」「[列表页](https://tdesign.tencent.com/starter/vue/#/list/base)」。

### A 查询后生效

何时使用：当用户对数据查询范围有明确针对性，需要对数据进行一系列筛选过滤的使用场景时，可使用查询器进行一次性提交生效。

核心流程：选择条件 - 触发查询 - 获得结果数据 - 清空条件

相关组件：[时间选择器](/vue/components/timepicker) 、[日期选择器](/vue/components/datepicker) 、[输入框](/vue/components/input) 、[选择器](/vue/components/select) 、[按钮](/vue/components/button) 、[表格](/vue/components/table) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200643.png" />

### B 立即生效

何时使用：当数据查询范围较为随机，用户需要反复、多次修改条件时，可实时显示筛选结果，来提高查询效率。

核心流程：条件选择 - 获得结果数据 -条件修改 - 获得结果数据

相关组件：[时间选择器](/vue/components/timepicker) 、[日期选择器](/vue/components/datepicker) 、[输入框](/vue/components/input) 、[选择器](/vue/components/select) 、[按钮](/vue/components/button) 、[表格](/vue/components/table) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200654.png" />

### 其他场景：折叠条件

何时使用：当筛选项过多，全部显示会增加用户信息识别效率，可只显示高频选项，其他选项折叠，需要时自定义展开。

核心流程：展开条件 - 条件选择 - 获得结果数据

相关组件：[时间选择器](/vue/components/timepicker) 、[日期选择器](/vue/components/datepicker) 、[输入框](/vue/components/input) 、[选择器](/vue/components/select) 、[按钮](/vue/components/button) 、[表格](/vue/components/table) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200706.png" />
<em> 图示：隐藏固定选项的条件 </em>

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200721.png" />
<em> 图示：隐藏固定选项的条件 </em>

### 其他场景：条件模版保存与调用

何时使用：当用户的筛选需求个性化较强，需要根据自身需要使用筛选项时，提供可自定义保存的筛选器。

核心流程：条件选择 - 保存为模版 -模版调用

相关组件：[时间选择器](/vue/components/timepicker) 、[日期选择器](/vue/components/datepicker) 、[输入框](/vue/components/input) 、[选择器](/vue/components/select) 、[按钮](/vue/components/button) 、[表格](/vue/components/table) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200730.png" />

<hr>

## 表格批量操作

对报表中的多项数据进行统一操作的任务。常应用于「[列表页](https://tdesign.tencent.com/starter/vue/#/list/base)」。

### A 所见即所得

何时使用：当批量操作按钮为主要或高频操作时，无论是否已选择数据，均在页面给用户见即所得的操作预期。

核心流程：选择要操作的内容 - 进行操作 - 显示操作结果

相关组件：[表格](/vue/components/table)、[按钮](/vue/components/button)、[多选框](/vue/components/checkbox)、[下拉菜单](/vue/components/dropdown)、[全局提示](/vue/components/message) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216192234.png" />

### B 选择后触发

何时使用：当页面已有主要按钮，批量操作为次级或非高频操作时，可在选择数据后显示操作区。

核心流程：选择要操作的内容 - 进行操作 - 显示操作结果

相关组件：[下拉框](/vue/components/dropdown) 、[多选框](/vue/components/checkbox) 、[输入框](/vue/components/input) 、[选择器](/vue/components/select) 、[按钮](/vue/components/button) 、[表格](/vue/components/table) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216192246.png" />

<hr>

## 效果预览

当编辑或改变的数据未最终生效时，提前用户了解编辑或改变的数据效果的任务。常用于「[仪表盘](https://tdesign.tencent.com/starter/vue/#/dashboard/base) 」「 [结果页](https://tdesign.tencent.com/starter/vue/#/result/success) 」「 [详情页](https://tdesign.tencent.com/starter/vue/#/detail/base) 」 。

### A 异步触发

何时使用：当需要配置或调整的元素较多、或实时刷新效果有延迟，需要集中预览效果时。常在页面整体出现预览。

核心流程：填写表单/或配置项-点击预览-进行预览

相关组件：[表单](/vue/components/form)、[按钮](/vue/components/button)、[输入框](/vue/components/input)、[上传](/vue/components/upload)、[下拉菜单](/vue/components/dropdown)、[单选框](/vue/components/radio)、[多选框](/vue/components/checkbox)、[选择器](/vue/components/select) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195654.png" />

### B 同步预览

何时使用：在配置设置项或信息元素过程中，需要实时关注最终效果、或观察配置项变化时。常用在页面局部出现预览。

核心流程：填写表单/设置项-进行预览

相关组件：[表单](/vue/components/form)、[按钮](/vue/components/button)、[输入框](/vue/components/input)、[上传](/vue/components/upload)、[下拉菜单](/vue/components/dropdown)、[单选框](/vue/components/radio)、[多选框](/vue/components/checkbox)、[选择器](/vue/components/select) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/effect.png" />

<hr>

## 新手指引

为新用户提供功能介绍或使用说明等信息的指引性任务。是在任意页面都会经常出现的基础任务。

### A 阻断式指引

何时使用：当需要用户必读、或在指引过程中不建议用户做其他操作时，让用户聚焦关注指引内容。

核心流程：触发引导 - 逐步查看引导 - 结束引导

相关组件：[对话框](/vue/components/dialog)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195257.png" />

### B 非阻断式引导

何时使用：当指引内容为辅助说明、或需要在操作界面的同时查看指引时，让用户可选择的使用指引。

核心流程：触发引导 - 逐步查看引导 或 忽视引导继续操作界面 - 结束引导

相关组件：[气泡确认框](/vue/components/popconfirm)、[弹出层](/vue/components/popup)、[文字提示](/vue/components/tooltip)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195307.png" />

### 其他场景：主动触发引导

何时使用：当指引内容较多、或用户需要反复查看时，可提供用户可主动触发的入口。

核心流程：触发引导 - 选择任务 - 进入引导 - 逐步查看引导 - 结束引导

相关组件：[气泡确认框](/vue/components/popconfirm)、[弹出层](/vue/components/popup)、[文字提示](/vue/components/tooltip)、[对话框](/vue/components/dialog) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195317.png" />

<hr>

## 数据导入

将本地数据导入到中后台系统中的任务。常应用于[列表页](https://tdesign.tencent.com/starter/vue/#/list/base) 。

### A 逐个文件导入

何时使用：当需要轻量快速导入数据并显示结果、或待导入的数据格式较集中时，可逐个快速导入。

核心流程：触发导入 - 选择要导入的一个文件 - 开始导入 - 收到导入结果

相关组件：[按钮](/vue/components/button)、[上传](/vue/components/upload)、[全局提示](/vue/components/message)、[表格](/vue/components/table)、[列表](/vue/components/list)、[文字提示](/vue/components/tooltip) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200005.png" />

### B 批量文件导入

何时使用：当待导入的数据较复杂、或数据文件有多个，可批量上传后，再导入需要的数据。

核心流程：触发导入 - 选择上传文件的方式 - 批量上传文件 - 确认批量文件的上传结果 - 导入文件

相关组件：[按钮](/vue/components/button)、[上传](/vue/components/upload)、[全局提示](/vue/components/message)、[表格](/vue/components/table)、[列表](/vue/components/list)、[对话框](/vue/components/dialog) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Data%20import%20c.png" />

<hr>

## 状态流转

在使用某条数据项的过程中，对该项数据的状态进行调整或变化的任务。常应用于「[列表页](https://tdesign.tencent.com/starter/vue/#/list/base) 」「 [详情页](https://tdesign.tencent.com/starter/vue/#/detail/base) 」「[结果页](https://tdesign.tencent.com/starter/vue/#/result/success) 」。

### A 通过详情进行状态流转

何时使用：当单条信息内容较多或较复杂时，需要用户查看信息详情、明确详情内容内容后，再进行状态流转决策。

核心流程：在列表中选定数据项 - 查看数据详情 - 选择要流转的状态 - 确定流转 - 显示流转结果

相关组件：[步骤条](/vue/components/steps)、[表格](/vue/components/table)、[表单](/vue/components/form)、[下拉菜单](/vue/components/dropdown)、[按钮](/vue/components/button) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201658.png" />

### B 通过列表摘要进行状态流转

何时使用：当单条信息内容较少，在标题或摘要中即可了解，或无需校验详情内容即可进行状态流转决策时。

核心流程：在列表中选定数据项 - 选择要流转的状态 - 显示流转结果

相关组件：[列表](/vue/components/list)、[表格](/vue/components/table)、[下拉菜单](/vue/components/dropdown)、[按钮](/vue/components/button) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201707.png" />

<hr>

## 任务引导

当用户需要完成某个任务或使用某项功能时，为用户提供必要的指导或说明的任务。常应用于「[详情页](https://tdesign.tencent.com/starter/vue/#/detail/base) 」「[结果页](https://tdesign.tencent.com/starter/vue/#/result/success)」。

### A 任务开始前的引导

何时使用：当任务较复杂、或任务执行前需做必要准备时，给用户相关引导或提示。

核心流程：查看引导内容 - 按引导执行任务

相关组件：[文字提示](/vue/components/tooltip)、[对话框](/vue/components/dialog)、[步骤条](/vue/components/steps)、[卡片](/vue/components/card)、[按钮](/vue/components/button) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201213.png" />

### B 任务结束后的引导

何时使用：当任务结束后，其结果与另一任务相关、或任务完成后的数据会触发其他操作时，给用户后续操作的引导或提示。

核心流程：执行任务 - 查看任务结果引导 - 选择是否根据引导执行下一任务

相关组件：[文字提示](/vue/components/tooltip)、[对话框](/vue/components/dialog)、[步骤条](/vue/components/steps)、[卡片](/vue/components/card)、[按钮](/vue/components/button) 等

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201224.png" />

<hr>

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201237.png" />
