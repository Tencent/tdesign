import { expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';

import ColorPanel from '../color-panel/index.vue';
import { themeStore } from '../common/themes';

const { getColorGradations } = vi.hoisted(() => ({
  getColorGradations: vi.fn(({ colors: [hex], step }: { colors: string[]; step: number }) => {
    if (!hex) throw new Error('unexpected hex');
    return [{ colors: Array(step).fill(hex), primary: 6 }];
  }),
}));

vi.mock('tvision-color', () => ({
  Color: {
    colorTransform: () => [0, 0, 0],
    getColorGradations,
  },
}));

vi.mock('../common/utils/animation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../common/utils/animation')>()),
  colorAnimation: () => () => {},
}));

it('uses the gray CSS token when the first brand color change follows CSS initialization', async () => {
  const panel = shallowMount(ColorPanel);
  const { setupState: state } = panel.vm.$ as unknown as {
    setupState: {
      grayMainColor: string;
      changeBrandColor: (hex: string) => void;
    };
  };

  expect(state.grayMainColor).toBe('');
  themeStore.updateDevice('web');
  document.documentElement.style.setProperty('--td-gray-color-4', '#ddd');

  expect(() => state.changeBrandColor('#f3b814')).not.toThrow();
  expect(getColorGradations).toHaveBeenCalledWith({ colors: ['#ddd'], step: 14 });
  expect(state.grayMainColor).toBe('#ddd');
  await nextTick();
  panel.unmount();
});
