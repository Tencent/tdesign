Component({
  data: {
    value: 'option_1',
    options: [
      { label: '选项一', value: 'option_1', disabled: false },
      { label: '选项二', value: 'option_2', disabled: false },
      { label: '选项三', value: 'option_3', disabled: false },
    ],
  },
  lifetimes: {
    ready() {
      // 直接设置 dropdown-item 的展开状态
      // 在 miniprogram-simulate 中 getRect 无法正常工作，所以绕过 show observer 的异步链
      const $item = this.selectComponent('#dropdown-item');
      if ($item) {
        $item.setData({
          wrapperVisible: true,
          show: true,
          top: 0,
          maskHeight: 0,
        });
      }
    },
  },
});
