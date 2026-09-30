import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SizeSlider from '../SizeSlider/index.vue';

describe('SizeSlider', () => {
  it('挂载时不派发 changeSize（忽略子组件初始化事件）', async () => {
    const w = mount(SizeSlider, { props: { sizeValue: '12px' } });
    await nextTick();
    await nextTick();
    expect(w.emitted('changeSize')).toBeFalsy();
  });

  it('用户交互后正常派发 changeSize', async () => {
    const w = mount(SizeSlider, { props: { sizeValue: '12px' } });
    await nextTick();
    await nextTick();
    const slider = w.findComponent({ name: 'TSlider' });
    await slider.vm.$emit('change', 16);
    await nextTick();
    expect(w.emitted('changeSize')![0]).toEqual([16]);
  });

  it('外部 sizeValue 变化时更新显示值', async () => {
    const w = mount(SizeSlider, { props: { sizeValue: '12px' } });
    await nextTick();
    await w.setProps({ sizeValue: '20px' });
    await nextTick();
    expect((w.vm as unknown as { size: number }).size).toBe(20);
  });
});
