import { createApp, createTextVNode, defineComponent } from 'vue';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';

import 'tdesign-vue-next/es/style/index.css';

const app = createApp(App)

app.component('VNode', defineComponent({
  props: ['render'],
  render() {
    const { render } = this
    if (typeof render === 'function') {
      return render()
    } else if (typeof render === 'string') {
      return createTextVNode(render)
    } else if (typeof render === 'number') {
      return createTextVNode(String(render))
    } else {
      return null
    }
  },
}),)
app.use(TDesign);
app.mount('#app');
