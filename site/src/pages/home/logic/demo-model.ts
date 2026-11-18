import { computed, reactive, ref } from 'vue';

export type CodeFramework = 'vue-next' | 'react' | 'flutter' | 'miniprogram' | 'uniapp';

export interface CodeItem {
  type: string;
  code?: string;
  codeKey?: string;
}

const codeFrameworkOptions: { label: string; value: CodeFramework }[] = [
  { label: 'vue-next.ts', value: 'vue-next' },
  { label: 'react.tsx', value: 'react' },
  { label: 'flutter.dart', value: 'flutter' },
  { label: 'mini-program.js', value: 'miniprogram' },
  { label: 'uniapp.js', value: 'uniapp' },
];

const codeList: Record<CodeFramework, CodeItem[]> = {
  'vue-next': [
    { type: 'bash', code: 'npm i tdesign-vue-next' },
    { type: 'javascript', code: "import { createApp } from 'vue';" },
    { type: 'javascript', code: "import TDesign from 'tdesign-vue-next';" },
    { type: 'javascript', code: 'createApp(App).use(TDesign);' },
  ],
  react: [
    { type: 'bash', code: 'npm i tdesign-react' },
    { type: 'javascript', code: "import React from 'react';" },
    { type: 'javascript', code: "import { Button } from 'tdesign-react';" },
    { type: 'javascript', code: 'export default () => <Button>TDesign</Button>;' },
  ],
  flutter: [
    {
      type: 'dart',
      code: `import 'package:tdesign_flutter/tdesign_flutter.dart';

void main() => runApp(
  const MaterialApp(
    home: TButton(child: Text('按钮')),
  ),
);`,
    },
  ],
  miniprogram: [
    { type: 'bash', code: 'npm i tdesign-miniprogram' },
    { type: 'javascript', code: '{ "usingComponents": { "t-tag": "tdesign-miniprogram/tag/tag" } }' },
    { type: 'javascript', codeKey: 'home.code.importantTag' },
    { type: 'javascript', code: 'Page({})' },
  ],
  uniapp: [
    { type: 'bash', code: 'npm i @tdesign/uniapp' },
    { type: 'javascript', code: "import TButton from '@tdesign/uniapp/button/button.vue';" },
    { type: 'markup', code: '<t-button size="large"> 按钮 </t-button>' },
  ],
};

export function createHomeDemoModel(t: (key: string) => string) {
  const codeFramework = ref<CodeFramework>('vue-next');
  const componentModel = reactive({
    selectValue: ['1'],
    menuExpanded: ['dashboard'],
    sliderValue: 60,
    colorList1: [
      '#ecf2fe',
      '#d4e3fc',
      '#bbd3fb',
      '#96bbf8',
      '#699ef5',
      '#4787f0',
      '#266fe8',
      '#0052d9',
      '#0034b5',
      '#001f97',
    ],
    colorList2: [
      '#ebedf1',
      '#e3e6eB',
      '#d6dbe3',
      '#bcc4d0',
      '#97a3b7',
      '#7787a2',
      '#5f7292',
      '#4b5b76',
      '#3c485c',
      '#2c3645',
    ],
  });

  const componentSelectOptions = computed(() => [
    { label: t('home.componentDemo.departments.marketing'), value: '1' },
    { label: t('home.componentDemo.departments.finance'), value: '2' },
    { label: t('home.componentDemo.departments.development'), value: '3' },
  ]);
  const componentTreeData = computed(() => [
    {
      value: '1',
      label: t('home.componentDemo.regions.headquarters'),
    },
    {
      value: '2',
      label: t('home.componentDemo.regions.eastChina'),
      children: [
        {
          value: '2.1',
          label: t('home.componentDemo.departments.marketing'),
        },
        {
          value: '2.2',
          label: t('home.componentDemo.departments.finance'),
        },
      ],
    },
    {
      value: '3',
      label: t('home.componentDemo.regions.southChina'),
      children: [
        {
          value: '3.1',
          label: t('home.componentDemo.departments.marketing'),
        },
        {
          value: '3.2',
          label: t('home.componentDemo.departments.finance'),
        },
      ],
    },
  ]);

  function displayCode(item: CodeItem): string {
    return item.codeKey ? String(t(item.codeKey)) : (item.code ?? '');
  }

  return {
    codeFramework,
    codeFrameworkOptions,
    codeList,
    componentModel,
    componentSelectOptions,
    componentTreeData,
    displayCode,
  };
}
