const image = 'https://tdesign.gtimg.com/mobile/demos/example2.png';
const items = new Array(12).fill().map((_, index) => ({
  label: index % 3 === 2 ? '最多六个文字' : '标题文字',
  image: image,
}));

Page({
  offsetTopList: [],
  lastScrollTop: 0,
  data: {
    sideBarIndex: 1,
    scrollTop: 0,
    categories: [
      {
        label: '选项一',
        title: '标题一',
        badgeProps: {},
        items,
      },
      {
        label: '选项二',
        title: '标题二',
        badgeProps: {
          dot: true,
        },
        items: items.slice(0, 9),
      },
      {
        label: '选项三',
        title: '标题三',
        badgeProps: {},
        items: items.slice(0, 9),
      },
      {
        label: '选项四',
        title: '标题四',
        badgeProps: {
          count: 6,
        },
        items: items.slice(0, 6),
      },
      {
        label: '选项五',
        title: '标题五',
        badgeProps: {},
        items: items.slice(0, 3),
      },
    ],
    navbarHeight: 0,
  },
  onLoad() {
    const query = wx.createSelectorQuery().in(this);
    const { sideBarIndex } = this.data;
    query.selectAll('.title').boundingClientRect();
    query.select('.custom-navbar').boundingClientRect();
    query.exec((res) => {
      const [rects, { height: navbarHeight }] = res;
      this.offsetTopList = rects.map((item) => item.top - navbarHeight);
      this.setData({ navbarHeight, scrollTop: this.offsetTopList[sideBarIndex] });
    });
  },

  onSideBarChange(e) {
    const { value } = e.detail;

    this.setData({ sideBarIndex: value, scrollTop: this.offsetTopList[value] });
  },
  onScroll(e) {
    const { scrollTop } = e.detail;
    const threshold = 50; // 下一个标题与顶部的距离
    const direction = scrollTop > this.lastScrollTop ? 'down' : 'up';
    this.lastScrollTop = scrollTop;

    // 动态调整阈值：向下滚动时增大阈值，向上时减小
    const dynamicThreshold = direction === 'down' ? threshold * 1.5 : threshold * 0.8;

    // 使用二分查找优化查找效率
    const findNearestIndex = (arr, target) => {
      let left = 0;
      let right = arr.length - 1;
      let result = 0;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] <= target + dynamicThreshold) {
          result = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      return result;
    };

    const newIndex = findNearestIndex(this.offsetTopList, scrollTop);

    if (newIndex !== this.data.sideBarIndex) {
      this.setData({ sideBarIndex: newIndex });
    }
  },
});