---
title: Design Methods for High-Frequency Tasks in Mid-End and Back-End Systems
description: After clarifying the overall framework and page layout, design the related task flows for specific business scenarios. Here are some design method guidelines for high-frequency tasks in mid-end and back-end systems

isDesign: true
---

Although products serve different businesses, they have very homogeneous high-frequency tasks. Mastering the design methods of these tasks can effectively improve the interaction experience of mid-to-back-end products.

## Data Filtering and Querying

Select the required data items or query data results according to the required conditions or types, which is often applied to [Dashboard](https://tdesign.tencent.com/starter/vue/#/dashboard/base) and [List Page](https://tdesign.tencent.com/starter/vue/#/list/base).

### A Post-query Activation

When the user has a specific targeted scope for data query and needs to filter a series of data, the query tool can be used for one-time submission and effectiveness.

Core process: Select conditions - Trigger query - Get result data - Clear conditions Effective immediately.

Components：[Time Picker](/vue/components/timepicker) 、[Date Picker](/vue/components/datepicker) 、[Input](/vue/components/input) 、[Select](/vue/components/select) 、[Button](/vue/components/button) 、[Table](/vue/components/table)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200643.png" />

### B Immediate Activation

When the scope of data querying is relatively random and users need to modify the conditions repeatedly and frequently, showing the filtering results in real-time can improve query efficiency.

Core process: Select Condition - Obtain Result - Condition Modify Condition - Obtain Result

Components: [Time Picker](/vue/components/timepicker) 、[Date Picker](/vue/components/datepicker) 、[Input](/vue/components/input) 、[Select](/vue/components/select) 、[Button](/vue/components/button) and [Table](/vue/components/table)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200654.png" />

### Other scenario: Saving and calling condition templates

When there are too many filtering options, displaying them all at once will increase the cognitive load for users. It is better to only show high-frequency options and fold the others. Users can customize them to expand when needed.

Core process: Expand Condition - Select Condition - Obtain Result

Components: [Time Picker](/vue/components/timepicker) 、[Date Picker](/vue/components/datepicker) 、[Input](/vue/components/input) 、[Select](/vue/components/select) 、[Button](/vue/components/button) and [Table](/vue/components/table)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200706.png" />
<em> example of hiding the fixed options for conditions </em>

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200721.png" />
<em> example of hiding the fixed options for conditions </em>

### Other scenario: Saving and calling condition templates

When users have personalized filtering requirements and need to use filtering options according to their own needs, a customizable filter that can be saved and called should be provided.

Core process: Select Condition - Save as Template - Call Template

Components: [Time Picker](/vue/components/timepicker) 、[Date Picker](/vue/components/datepicker) 、[Input](/vue/components/input) 、[Select](/vue/components/select) 、[Button](/vue/components/button) and [Table](/vue/components/table)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200730.png" />

<hr>

## Table Batch Operation

The task of uniformly operating multiple data in reports, which is often applied to [List Page](https://tdesign.tencent.com/starter/vue/#/list/base).

### A WYSIWYG

When the batch operation button is the primary or high-frequency operation, regardless of whether data has been selected, the expected operation is immediately visible to the user on the page.

Core process: Select the operated content - Perform the Operation - Display the Operation result

Components: [Table](/vue/components/table)、[Button](/vue/components/button)、[Checkbox](/vue/components/checkbox)、[Dropdown](/vue/components/dropdown)、[Meesage](/vue/components/message)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216192234.png" />

### B Triggered by selection

When the page already has a primary button, and batch operation is a secondary or non-high-frequency operation, the operation area can be displayed after selecting the data.

Core process: Select the operated content - Perform the Operation - Display the Operation result

Components: [Dropdown](/vue/components/dropdown) 、[Checkbox](/vue/components/checkbox) 、[Input](/vue/components/input) 、[Select](/vue/components/select) 、[Button](/vue/components/button) and [Table](/vue/components/table)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216192246.png" />

<hr>

## Preview

The task of allowing users to preview the effect of editing or changes before they take effect, which is often applied to[Dashboard](https://tdesign.tencent.com/starter/vue/#/dashboard/base) 、[Result Page](https://tdesign.tencent.com/starter/vue/#/result/success) and [Detail Page](https://tdesign.tencent.com/starter/vue/#/detail/base).

### A Asynchronously triggered

When there are many elements that need to be configured or adjusted, or when there is a delay in real-time refreshing of effects, it is necessary to concentrate on previewing the effect. This often appears as a full-page preview on the page.

Core process: Fill Form/Configuration - Click Preview Button - Preview

Component: [Form](/vue/components/form)、[Button](/vue/components/button)、[Input](/vue/components/input)、[Upload](/vue/components/upload)、[Dropdown](/vue/components/dropdown)、[Radio](/vue/components/radio)、[Checkbox](/vue/components/checkbox) and [Select](/vue/components/select)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195654.png" />

### B Synchronously Preview

When configuring settings or information elements, it is necessary to pay attention to the final effect in real-time, or observe changes in the configuration options. This is often used in partial previews on the page.

Core process: Fill Form/Configuration - Preview

Components: [Form](/vue/components/form)、[Button](/vue/components/button)、[Input](/vue/components/input)、[Upload](/vue/components/upload)、[Dropdown](/vue/components/dropdown)、[Radio](/vue/components/radio)、[Checkbox](/vue/components/checkbox)、[Select](/vue/components/select)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/effect.png" />

<hr>

## New User Guidance

A guidance task that provides introductions or instructions on how to use functions for new users. This is a basic task that frequently occurs on any page.

### A Disruptive Guidance

When users need to read important information or when it is not recommended for users to perform other operations during the guidance process, they should focus on the guidance content.

Core process: Trigger Guide -
View guidance Step-by-step - End guidance

Components: [Dialog](/vue/components/dialog)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195257.png" />

### B Non-disruptive Guidance

When the guidance content is for secondary explanation or when it is necessary to view the guidance while using the operation interface, users should be given the option to use the guidance.

Core process: Trigger Guide -
View guidance Step-by-step - End guidance

Components: [Popconfirm](/vue/components/popconfirm)、[Popup](/vue/components/popup) and [Tooltip](/vue/components/tooltip)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195307.png" />

### Other scenario: Active trigger guidance

When there is a lot of guidance content or when users need to view it repeatedly, an entry point that can be triggered by the user should be provided.

Core process: Trigger Guide - Select Task - Enter guidance - View guidance Step-by-step - End guidance

Components: [Popconfirm](/vue/components/popconfirm)、[Popup](/vue/components/popup)、[Tooltip](/vue/components/tooltip)、[Dialog](/vue/components/dialog)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216195317.png" />

<hr>

## Date Import

Task of importing local data into the mid-to-back-end system, which is applied to [List Page](https://tdesign.tencent.com/starter/vue/#/list/base).

### A Import File One by One

When there is a need to import data quickly and display results, or when the data to be imported is in a concentrated format, the one by one fast import method can be used to make the process lightweight and fast.

Core process: Trigger Import - Choose a File to Import - Begin importing - Receive Import Result

Components: [Button](/vue/components/button)、[Upload](/vue/components/upload)、[Message](/vue/components/message)、[Table](/vue/components/table)、[List](/vue/components/list)、[Tooltip](/vue/components/tooltip)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216200005.png" />

### B Batch Import Files

When the data to be imported is complex or when there are multiple data files, they can be uploaded in bulk and then the required data can be imported.

Core process: Trigger Import - Select way to upload files - Batch Import Files - Confirm Result - Import Files

Components: [Button](/vue/components/button)、[Upload](/vue/components/upload)、[Message](/vue/components/message)、[Table](/vue/components/table)、[List](/vue/components/list) and [Dialog](/vue/components/dialog)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Data%20import%20c.png" />

<hr>

## Status Transition

The task of adjusting or changing the status of a certain data item during the usage process, which is often applied to [List Page](https://tdesign.tencent.com/starter/vue/#/list/base) 、 [Detail Page](https://tdesign.tencent.com/starter/vue/#/detail/base) and [Result Page](https://tdesign.tencent.com/starter/vue/#/result/success).

### A Performing Status Transition via Detail Page

When a single piece of information contains a lot of details or is more complex, users need to view the information details and clearly understand the content before making a decision on the status transition.

Core process: - View Data Detail - Choose Status Transition - Confirm Transition - Display Result

Components: [Steps](/vue/components/steps)、[Table](/vue/components/table)、[Form](/vue/components/form)、[Dropdown](/vue/components/dropdown) and [Button](/vue/components/button)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201658.png" />

### B Performing Status Transition via Summary on the List

When a single piece of information contains few details that can be understood from the title or summary, or when a decision on the status transition can be made without verifying the details.

Core process: Select Data Items in a List - Choose Transition Status - Display Result

Components: [List](/vue/components/list)、[Table](/vue/components/table)、[Dropdown](/vue/components/dropdown)、[Button](/vue/components/button)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201707.png" />

<hr>

## Task Guidance

When users need to complete a task or use a certain feature, necessary guidance or explanations should be provided to ensure successful completion。which is often applied to [Detail Page](https://tdesign.tencent.com/starter/vue/#/detail/base) and [Result Page](https://tdesign.tencent.com/starter/vue/#/result/success).

### A Guidance Before Task

When tasks are complex or require preparation before execution, users should be provided with relevant guidance or prompts.

Core process: View Guidance Content - Execute Task

Components: [Tooltip](/vue/components/tooltip)、[Dialog](/vue/components/dialog)、[Steps](/vue/components/steps)、[Card](/vue/components/card)、[Button](/vue/components/button).

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201213.png" />

### B Guidance After Task

When a task is completed and its result is related to another task, or when data generated from it triggers other operations, users should be provided with guidance or prompts for their next steps.

Core process: Execute Task - View Task Guidance - Choose Next Task Based on the Guidance

Components: [Tooltip](/vue/components/tooltip)、[Dialog](/vue/components/dialog)、[Steps](/vue/components/steps)、[Card](/vue/components/card)、[Button](/vue/components/button)

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201224.png" />

<hr>

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211216201237.png" />
