window.platforms = [
  {
    name: "PC组件库 Vue",
    url: "/vue",
  },
  {
    name: "PC组件库 React",
    url: "/react",
  },
];

window.routerList = [
  {
    title: "开始",
    name: "start",
    type: "doc", // 组件文档
    children: [
      {
        title: "说明",
        name: "install",
        path: "/react/install",
      },
      {
        title: "更新日志",
        name: "changelog",
        path: "/react/changelog",
      },
    ],
  },
  {
    title: "基础",
    name: "base",
    type: "component", // 组件文档
    children: [
      {
        title: "Button 按钮",
        name: "button",
        path: "/react/components/button",
      },
      {
        title: "Divider 分割线",
        name: "divider",
        path: "/react/components/divider",
      },
      {
        title: "Icon 图标",
        name: "icon",
        path: "/react/components/icon",
      },
    ],
  },
  {
    title: "布局",
    name: "layouts",
    type: "component", // 组件文档
    children: [
      {
        title: "Grid 姗格",
        name: "grid",
        path: "/react/components/grid",
      },
      {
        title: "Layout 布局",
        name: "layout",
        path: "/react/components/layout",
      },
    ],
  },
  {
    title: "导航",
    name: "navigation",
    type: "component", // 组件文档
    children: [
      {
        title: "Anchor 锚点",
        name: "anchor",
        path: "/react/components/anchor",
      },
      {
        title: "Menu 导航",
        name: "menu",
        path: "/react/components/menu",
      },
      {
        title: "Pagination 分页",
        name: "pagination",
        path: "/react/components/pagination",
      },
      {
        title: "Steps 步骤条",
        name: "steps",
        path: "/react/components/steps",
      },
      {
        title: "Tabs 选项卡",
        name: "tabs",
        path: "/react/components/tabs",
      },
    ],
  },
  {
    title: "表单",
    name: "Forms",
    type: "component", // 组件文档
    children: [
      {
        title: "Checkbox 多选框",
        name: "checkbox",
        path: "/react/components/checkbox",
      },
      {
        title: "Form 表单",
        name: "form",
        path: "/react/components/form",
      },
      {
        title: "Input 输入框",
        name: "input",
        path: "/react/components/input",
      },
      {
        title: "InputNumber 数字输入",
        name: "input-number",
        path: "/react/components/input-number",
      },
      {
        title: "Radio 单选框",
        name: "radio",
        path: "/react/components/radio",
      },
      {
        title: "Select 选择器",
        name: "select",
        path: "/react/components/select",
      },
      {
        title: "Swtch 开关",
        name: "switch",
        path: "/react/components/switch",
      },
    ],
  },
  {
    title: "数据展示",
    name: "Data",
    type: "component", // 组件文档
    children: [
      {
        title: "Badge 徽标数",
        name: "badge",
        path: "/react/components/badge",
      },
      {
        title: "Calendar 日历",
        name: "calendar",
        path: "/react/components/calendar",
      },
      {
        title: "List 列表",
        name: "list",
        path: "/react/components/list",
      },
      {
        title: "Progress 进度条",
        name: "progress",
        path: "/react/components/progress",
      },
      {
        title: "Table 表格",
        name: "table",
        path: "/react/components/table",
      },
      {
        title: "Tag 标签",
        name: "tag",
        path: "/react/components/tag",
      },
      {
        title: "Tooltip 文字提示",
        name: "tooltip",
        path: "/react/components/tooltip",
      },
    ],
  },
  {
    title: "消息提醒",
    name: "Notifications",
    type: "component", // 组件文档
    children: [
      {
        title: "Alert 警告提醒",
        name: "alert",
        path: "/react/components/alert",
      },
      {
        title: "Dialog 对话框",
        name: "dialog",
        path: "/react/components/dialog",
      },
      {
        title: "Drawer 模态抽屉",
        name: "drawer",
        path: "/react/components/drawer",
      },
      {
        title: "Loading 加载",
        name: "loading",
        path: "/react/components/loading",
      },
      {
        title: "Message 全局提醒",
        name: "message",
        path: "/react/components/message",
      },
      {
        title: "Notification 消息通知",
        name: "notification",
        path: "/react/components/notification",
      },
      {
        title: "Popconfirm 气泡确认框",
        name: "popconfirm",
        path: "/react/components/popconfirm",
      },
      {
        title: "Popup 弹出层",
        name: "popup",
        path: "/react/components/popup",
      },
    ],
  },
];

window.docInfo = {
  title: "Button 按钮",
  desc: ["按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。"],
};

window.contributors = [
  {
    username: "chazzhou",
  },
  {
    username: "chazzhou",
  },
  {
    username: "chazzhou",
  },
  {
    username: "chazzhou",
  },
  {
    username: "chazzhou",
  },
  {
    username: "chazzhou",
  },
  {
    username: "chazzhou",
  },
];

window.code = `<template>
<div class="tdesign-demo-shape">
  <div class="tdesign-demo-block">
    <div class="item"><t-button shape="square" variant="base">主按钮</t-button></div>
    <div class="item"><t-button shape="round" variant="base">主按钮</t-button></div>
    <div class="item"><t-button shape="circle" variant="base"><t-icon-calendar slot="icon"/></t-button></div>
  </div>
  <div class="tdesign-demo-block">
    <div class="item"><t-button shape="square" variant="outline">次要按钮</t-button></div>
    <div class="item"><t-button shape="round" variant="outline">次要按钮</t-button></div>
    <div class="item"><t-button shape="circle" variant="outline"><t-icon-calendar slot="icon"/></t-button></div>
  </div>
  <div class="tdesign-demo-block">
    <div class="item"><t-button shape="square" variant="dashed">虚框按钮</t-button></div>
    <div class="item"><t-button shape="round" variant="dashed">虚框按钮</t-button></div>
    <div class="item"><t-button shape="circle" variant="dashed"><t-icon-calendar slot="icon"/></t-button></div>
  </div>
  <div class="tdesign-demo-block">
    <div class="item"><t-button shape="square" variant="text">文字按钮</t-button></div>
    <div class="item"><t-button shape="round" variant="text">文字按钮</t-button></div>
    <div class="item"><t-button shape="circle" variant="text"><t-icon-calendar slot="icon"/></t-button></div>
  </div>
</div>
</template>
<script>
import TIconCalendar from 'tdesign-vue/lib/icon/calendar';

export default {
components: {
  TIconCalendar,
},
};
</script>
<style lang="less" scoped>
.tdesign-demo-shape {
.t-button + .t-button {
  margin-left: 32px;
}
.tdesign-demo-block {
  margin-top: 16px;
  display: flex;
  .item {
    width: 150px;
  }
}
}
</style>
`;

window.usageConfig = [
  { name: "disabled", defaultValue: false, type: "boolean" },
  { name: "disabled2", defaultValue: false, type: "boolean" },
  { name: "disabled3", defaultValue: false, type: "boolean" },
  {
    name: "select",
    type: "enum",
    defaultValue: "value1",
    options: [
      { label: "value1", value: "value1" },
      { label: "value 1", value: "value 1" },
    ],
  },
  {
    name: "select2",
    type: "enum",
    defaultValue: "value2",
    options: [
      { label: "value2", value: "value2" },
      { label: "value 2", value: "value 2" },
    ],
  },
];

window.usagePanelList = [
  { label: "baseTable", value: "baseTable" },
  { label: "primaryTable", value: "primaryTable" },
];
