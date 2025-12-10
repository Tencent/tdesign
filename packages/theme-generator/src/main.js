import Vue from 'vue';

import Generator from './Generator.vue';

Vue.config.productionTip = false;

// 封装参数获取逻辑，提高复用性
const getInitProps = () => {
  const appEl = document.getElementById('app');

  // 1. 获取 device 参数
  const device =
    [
      appEl?.getAttribute('device'),
      new URLSearchParams(window.location.search).get('device'),
      'web', // 默认值
    ].find(Boolean) || 'web';

  // 2. 获取 showSetting 参数（兼容短横线/驼峰属性）
  const searchParams = new URLSearchParams(window.location.search);
  const showSettingAttr = [
    appEl?.getAttribute('show-setting'),
    appEl?.getAttribute('showSetting'),
    searchParams.get('showSetting'),
  ].find((val) => val !== null && val !== undefined);

  // 处理布尔值转换（可选，根据实际需求）
  const parseBoolean = (val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  };

  return {
    device,
    showSetting: showSettingAttr === null ? undefined : parseBoolean(showSettingAttr),
  };
};

new Vue({
  render: (h) => h(Generator, { props: getInitProps() }),
}).$mount('#app');
