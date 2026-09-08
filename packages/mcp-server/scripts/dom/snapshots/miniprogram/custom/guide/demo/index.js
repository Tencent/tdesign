Component({
  data: {
    current: 0,
    steps: [
      {
        element: () => Promise.resolve({ top: 0, left: 0, right: 375, width: 375, height: 80 }),
        title: '用户引导标题',
        body: '用户引导的说明文案',
        placement: 'center',
      },
      {
        element: () => Promise.resolve({ top: 100, left: 0, right: 375, width: 375, height: 56 }),
        title: '用户引导标题',
        body: '用户引导的说明文案',
        placement: 'bottom',
        highlightPadding: 0,
      },
      {
        element: () => Promise.resolve({ top: 200, left: 0, right: 375, width: 375, height: 48 }),
        title: '用户引导标题',
        placement: 'bottom-right',
      },
    ],
  },
  lifetimes: {
    ready() {
      const $guide = this.selectComponent('#t-guide');
      if ($guide) {
        // 直接设置 guide 组件的内部渲染数据，绕过 element() 的异步 createSelectorQuery 调用
        $guide.setData({
          visible: true,
          modeType: 'popover',
          nonOverlay: false,
          title: '用户引导标题',
          body: '用户引导的说明文案',
          referenceStyle: 'top:0px;right:0px;left:0px;width:375px;height:80px;',
          popoverStyle: 'position:absolute;top:96px;left:1px;',
          buttonProps: {
            skipButton: {
              theme: 'light',
              content: '跳过',
              size: 'extra-small',
              tClass: 't-class-skip t-guide__button',
              type: 'skip',
            },
            nextButton: {
              theme: 'primary',
              content: '下一步 (1/3)',
              size: 'extra-small',
              tClass: 't-class-next t-guide__button',
              type: 'next',
            },
            backButton: {
              theme: 'light',
              content: '返回',
              size: 'extra-small',
              tClass: 't-class-back t-guide__button',
              type: 'back',
            },
            finishButton: {
              theme: 'primary',
              content: '完成 (1/3)',
              size: 'extra-small',
              tClass: 't-class-finish t-guide__button',
              type: 'finish',
            },
          },
        });
      }
    },
  },
  methods: {
    close() {
      this.triggerEvent('close');
    },
  },
});
