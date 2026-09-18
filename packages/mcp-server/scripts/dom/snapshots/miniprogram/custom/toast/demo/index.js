Component({
  lifetimes: {
    ready() {
      const $toast = this.selectComponent('#t-toast');
      if ($toast) {
        $toast.show({ message: '轻提示文字内容', duration: 0 });
      }
    },
  },
});
