import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

const tokenState = vi.hoisted(() => ({ value: '16px' }));

vi.mock('tvision-color', () => ({ Color: {} }));

vi.mock('@/common/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils')>();
  return {
    ...actual,
    getTokenValue: () => tokenState.value,
  };
});

import { themeStore } from '@/common/themes';
import SizeAdjust from '../size-adjust.vue';

describe('SizeAdjust', () => {
  it('尺寸 Token 变化后刷新当前分组的展示值', async () => {
    const wrapper = mount(SizeAdjust, {
      props: {
        type: 'comp-size',
        tokenList: [{ name: 'comp-size-xxxs', from: 'size-6' }],
      },
      global: {
        stubs: {
          TList: { template: '<div><slot /></div>' },
          TListItem: { template: '<div><slot /></div>' },
          TPopup: { template: '<div><slot /><slot name="content" /></div>' },
          SizeSlider: true,
          SizeAdjustSvg: true,
        },
      },
    });

    expect(wrapper.text()).toContain('size-6 : 16px');

    tokenState.value = '20px';
    themeStore.incrementSizeRefresh('comp-size');
    await nextTick();

    expect(wrapper.text()).toContain('size-6 : 20px');
  });
});
