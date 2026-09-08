Page({
  data: {
    current: 'B',
    indexList: [],
    list: [
      {
        index: 'A',
        children: ['阿坝', '阿拉善', '阿里', '安康', '安庆', '鞍山', '安顺', '安阳', '澳门'],
      },
      {
        index: 'B',
        children: [
          '北京',
          '白银',
          '保定',
          '宝鸡',
          '保山',
          '包头',
          '巴中',
          '北海',
          '蚌埠',
          '本溪',
          '毕节',
          '滨州',
          '百色',
          '亳州',
        ],
      },
      {
        index: 'C',
        children: [
          '重庆',
          '成都',
          '长沙',
          '长春',
          '沧州',
          '常德',
          '昌都',
          '长治',
          '常州',
          '巢湖',
          '潮州',
          '承德',
          '郴州',
          '赤峰',
          '池州',
          '崇左',
          '楚雄',
          '滁州',
          '朝阳',
        ],
      },
      {
        index: 'D',
        children: [
          '大连',
          '东莞',
          '大理',
          '丹东',
          '大庆',
          '大同',
          '大兴安岭',
          '德宏',
          '德阳',
          '德州',
          '定西',
          '迪庆',
          '东营',
        ],
      },
      {
        index: 'E',
        children: ['鄂尔多斯', '恩施', '鄂州'],
      },
      {
        index: 'F',
        children: ['福州', '防城港', '佛山', '抚顺', '抚州', '阜新', '阜阳'],
      },
      {
        index: 'G',
        children: ['广州', '桂林', '贵阳', '甘南', '赣州', '甘孜', '广安', '广元', '贵港', '果洛'],
      },
      {
        index: 'J',
        children: ['揭阳', '吉林', '晋江', '吉安', '胶州', '嘉兴', '济南', '鸡西', '荆州', '江门', '基隆'],
      },
      {
        index: 'K',
        children: ['昆明', '开封', '康定', '喀什'],
      },
    ],
    stickyOffset: 0,
  },

  onLoad() {
    this.getCustomNavbarHeight();
  },

  onReady() {
    this.setData({
      indexList: this.data.list.map((item) => item.index),
    });
  },

  onChange(e) {
    const { index } = e.detail;
    this.setData({
      current: index,
    });

  },

  onSelect(e) {
    const { index } = e.detail;

  },

  getCustomNavbarHeight() {
    const query = wx.createSelectorQuery();
    query.select('.custom-navbar').boundingClientRect();
    query.exec((res) => {
      const { height = 0 } = res[0] || {};
      this.setData({ stickyOffset: height });
    });
  },
});