import Vue from 'vue';

import Generator from './Generator.vue';

Vue.config.productionTip = false;

// 封装参数获取逻辑，提高复用性
const getInitProps = () => {
  const appEl = document.getElementById('app');

  // 1. 获取 device：仅从 DOM 属性读取，默认值 'web'
  const device = appEl?.getAttribute('device') || 'web';

  // 2. 获取 showSetting：仅从 DOM 属性读取（兼容短横线/驼峰命名）
  const showSettingAttr = appEl?.getAttribute('show-setting') || appEl?.getAttribute('showSetting');
  // 若未获取到值则设为 undefined，避免传递空值
  const showSetting = showSettingAttr === null || showSettingAttr === undefined ? undefined : showSettingAttr;

  return {
    device,
    showSetting,
  };
};

new Vue({
  render: (h) => h(Generator, { props: getInitProps() }),
}).$mount('#app');
