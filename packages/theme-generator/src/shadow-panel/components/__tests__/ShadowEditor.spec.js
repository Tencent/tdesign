import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ShadowEditor from '../ShadowEditor.vue';

describe('ShadowEditor', () => {
  it('挂载不报错（smoke）', () => {
    const wrapper = mount(ShadowEditor, {
      props: { name: 'shadow-1', value: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)' },
    });
    expect(wrapper.find('.shadow-layer__card').exists()).toBe(true);
  });

  it('修改 shadow 数组索引后触发 change 事件（deep watch 回归保护）', async () => {
    const wrapper = mount(ShadowEditor, {
      props: { name: 'shadow-1', value: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)' },
    });

    // hasInit 初始 false：先改 color 让 color watch 触发并置 hasInit=true（首次不 emit）
    const inputs = wrapper.findAll('input');
    // 最后一个 input 是 color 绑定（t-input v-model="color"）
    const colorInput = inputs[inputs.length - 1];
    await colorInput.setValue('#ff0000');
    // 此时 hasInit 已为 true

    // 清空已捕获的 emit，便于断言后续 shadow 变化
    wrapper.emitted('change');

    // 通过 InputNumber 触发 shadow 数组索引变化（v-model="shadow[0]"）
    // Vue 3 v-model 走 update:modelValue 事件
    const inputNumbers = wrapper.findAllComponents({ name: 'TInputNumber' });
    expect(inputNumbers.length).toBeGreaterThan(0);
    await inputNumbers[0].vm.$emit('update:modelValue', 10);
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('change');
    // deep watch 生效时，shadow 索引变化会触发 change 事件
    expect(emitted).toBeTruthy();
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit).toContain('10px');
  });
});
