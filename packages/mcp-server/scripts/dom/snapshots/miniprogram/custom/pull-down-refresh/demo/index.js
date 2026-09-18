Component({
  data: {
    enable: false,
    rowCol1: [{ width: '100%', height: '342rpx', borderRadius: '24rpx' }],
    rowCol2: [[{ width: '327rpx' }], [{ width: '200rpx' }], [{ size: '327rpx', borderRadius: '24rpx' }]],
  },

  ready() {
    this.setData({ enable: true });
    setTimeout(() => {
      this.setData({ enable: false });
    }, 1000);
  },

  methods: {
    onRefresh() {
      this.setData({ enable: true });
      setTimeout(() => {
        this.setData({ enable: false });
      }, 1500);
    },
  },
});