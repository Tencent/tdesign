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

// 导出一个可复用的工厂方法，供外部程序创建/挂载/销毁该组件
export function createGenerator({ el = '#app', props = {} } = {}) {
  const initProps = { ...getInitProps(), ...props };

  const vm = new Vue({
    render: (h) => h(Generator, { props: initProps }),
  }).$mount();

  const target = typeof el === 'string' ? document.querySelector(el) : el;

  if (target) {
    // 用生成的根节点替换目标节点
    target.replaceWith(vm.$el);
  } else {
    // 若未提供目标节点则追加到 body
    document.body.appendChild(vm.$el);
  }

  return {
    vm,
    destroy() {
      vm.$destroy();
      if (vm.$el && vm.$el.parentNode) vm.$el.parentNode.removeChild(vm.$el);
    },
  };
}

// 另导出一个 Vue 组件构造器，方便在其他 Vue 应用中直接注册/使用
export const GeneratorComponent = Vue.extend({
  name: 'GeneratorWrapper',
  render(h) {
    return h(Generator, { props: getInitProps() });
  },
});
