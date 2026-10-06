import { describe, expect, it, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';

// Canvas decoration is unrelated to theme restoration. Keep the real color algorithm.
vi.mock('../common/utils/animation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../common/utils/animation')>()),
  colorAnimation: () => () => {},
}));

import { SegmentSelection } from '../common/components';

import Generator from '../generator.vue';
import ColorPanel from '../color-panel/index.vue';
import FontSizeAdjust from '../font-panel/components/font-size-adjust.vue';
import LineHeightAdjust from '../font-panel/components/line-height-adjust.vue';
import RadiusPanel from '../radius-panel/index.vue';
import ShadowPanel from '../shadow-panel/index.vue';
import { ShadowSelect, ShadowSelectType } from '../shadow-panel/built-in/shadow-map';
import {
  applyTokenToStyle,
  CUSTOM_OPTIONS_ID,
  CUSTOM_TOKEN_ID,
  getOptionFromLocal,
  modifyToken,
  restoreThemeOptions,
  themeStore,
  updateLocalOption,
} from '../common/themes';
import { getTokenValue } from '../common/utils';

interface PresetState {
  step: number;
}
interface LineHeightState {
  tokenType: 'plus' | 'time';
  lineHeightValue: number;
  handleChangeFontSize: (value: number) => void;
}
interface ColorState {
  grayMainColor: string;
  changeBrandColor: (hex: string) => void;
  changeNeutralColor: (related: boolean) => void;
}
function state<T>(wrapper: VueWrapper): T {
  return (wrapper.vm.$ as unknown as { setupState: T }).setupState;
}
function selectPreset(panel: VueWrapper, value: number): void {
  panel.findComponent(SegmentSelection).vm.$emit('update:modelValue', value);
}
const mountOptions = { global: { config: { warnHandler: () => {} } } };
const settle = async () => {
  await nextTick();
  await nextTick();
};
const snapshot = (names: string[]) => names.map((name) => getTokenValue(name).replace(/\s/g, ''));

function createGenerator(device = 'web') {
  const target = document.createElement('div');
  document.body.appendChild(target);
  return mount(Generator, { ...mountOptions, props: { device }, attachTo: target });
}

describe('theme restoration', () => {
  for (const mode of ['light', 'dark']) {
    for (const device of ['web', 'mobile']) {
      it(`${device}/${mode}: restores presets before panels read CSS`, async () => {
        document.documentElement.setAttribute('theme-mode', mode);
        const first = createGenerator(device);
        await settle();
        const color = state<ColorState>(first.findComponent(ColorPanel));
        expect(color.grayMainColor).toMatch(/^#[\da-f]{3,8}$/i);
        expect(() => color.changeBrandColor('#f3b814')).not.toThrow();
        selectPreset(first.findComponent(FontSizeAdjust), 4);
        selectPreset(first.findComponent(RadiusPanel), 5);
        selectPreset(first.findComponent(ShadowPanel), 4);
        await settle();
        if (device === 'web') state<LineHeightState>(first.findComponent(LineHeightAdjust)).handleChangeFontSize(14);
        await settle();
        expect(getTokenValue('--td-font-size-body-large')).toBe('17px');
        expect(getTokenValue('--td-radius-default')).toBe('6px');
        if (device === 'web') expect(getTokenValue('--td-line-height-body-large')).toBe('31px');
        expect(getTokenValue('--td-radius-circle')).toBe('50%');
        const names = [
          '--td-font-size-body-large',
          '--td-radius-default',
          '--td-shadow-3',
          '--td-line-height-body-large',
          '--td-brand-color',
        ];
        const expected = snapshot(names);
        const saved = localStorage.getItem(CUSTOM_OPTIONS_ID);
        first.unmount();
        document.querySelectorAll('style').forEach((style) => style.remove());
        const second = createGenerator(device);
        await settle();
        expect(snapshot(names)).toEqual(expected);
        expect(localStorage.getItem(CUSTOM_OPTIONS_ID)).toBe(saved);
        expect(state<PresetState>(second.findComponent(FontSizeAdjust)).step).toBe(4);
        expect(state<PresetState>(second.findComponent(RadiusPanel)).step).toBe(5);
        expect(state<PresetState>(second.findComponent(ShadowPanel)).step).toBe(4);
        if (device === 'web')
          expect(state<LineHeightState>(second.findComponent(LineHeightAdjust)).lineHeightValue).toBe(14);
        expect(state<ColorState>(second.findComponent(ColorPanel)).grayMainColor).not.toBe('');
        second.unmount();
      });
      it(`${device}/${mode}: individual overrides win and determine derived line height`, async () => {
        document.documentElement.setAttribute('theme-mode', mode);
        localStorage.setItem(
          CUSTOM_OPTIONS_ID,
          JSON.stringify({ font: 4, radius: 5, shadow: 4, 'line-height': 'time_1.5' }),
        );
        const overrides = {
          '--td-font-size-body-large': '19px',
          '--td-radius-default': '9px',
          '--td-line-height-body-small': '37px',
        };
        localStorage.setItem(CUSTOM_TOKEN_ID, JSON.stringify(overrides));
        const savedOptions = localStorage.getItem(CUSTOM_OPTIONS_ID);
        const savedTokens = localStorage.getItem(CUSTOM_TOKEN_ID);
        const generator = createGenerator(device);
        await settle();
        expect(getTokenValue('--td-font-size-body-large')).toBe('19px');
        if (device === 'web') {
          expect(getTokenValue('--td-line-height-body-large')).toBe('28.5px');
          expect(getTokenValue('--td-line-height-body-small')).toBe('37px');
        }
        expect(getTokenValue('--td-radius-default')).toBe('9px');
        expect(localStorage.getItem(CUSTOM_OPTIONS_ID)).toBe(savedOptions);
        expect(localStorage.getItem(CUSTOM_TOKEN_ID)).toBe(savedTokens);
        generator.unmount();
      });
    }
    it(`${mode}: active line height follows later font preset and individual edits`, async () => {
      document.documentElement.setAttribute('theme-mode', mode);
      localStorage.setItem(CUSTOM_OPTIONS_ID, JSON.stringify({ 'line-height': 'time_1.5' }));
      const generator = createGenerator();
      await settle();
      const fontPanel = generator.findComponent(FontSizeAdjust);
      selectPreset(fontPanel, 2);
      await settle();
      expect(getTokenValue('--td-line-height-body-large')).toBe('22.5px');
      const editable = state<{
        handleChangeFontSize: (value: number, type: string, token: string, index: number) => void;
      }>(fontPanel);
      editable.handleChangeFontSize(19, 'token', '--td-font-size-body-large', 7);
      await settle();
      expect(getTokenValue('--td-line-height-body-large')).toBe('28.5px');
      expect(getOptionFromLocal('line-height')).toBe('time_1.5');
      generator.unmount();
    });
    it(`${mode}: changing line height mode after a custom value survives reload`, async () => {
      document.documentElement.setAttribute('theme-mode', mode);
      const first = createGenerator();
      await settle();
      const lineHeight = state<LineHeightState>(first.findComponent(LineHeightAdjust));
      lineHeight.handleChangeFontSize(14);
      await settle();
      lineHeight.tokenType = 'time';
      await settle();
      expect(getOptionFromLocal('line-height')).toBe('time_1.5');
      expect(getTokenValue('--td-line-height-body-large')).toBe('24px');
      first.unmount();
      const second = createGenerator();
      await settle();
      const restored = state<LineHeightState>(second.findComponent(LineHeightAdjust));
      expect(restored.tokenType).toBe('time');
      expect(restored.lineHeightValue).toBe(1.5);
      expect(getTokenValue('--td-line-height-body-large')).toBe('24px');
      restored.tokenType = 'plus';
      await settle();
      expect(getOptionFromLocal('line-height')).toBe('plus_8');
      expect(state<PresetState>(second.findComponent(LineHeightAdjust)).step).toBe(3);
      second.unmount();
    });
    it(`${mode}: reselecting the base preset clears individual overrides`, async () => {
      document.documentElement.setAttribute('theme-mode', mode);
      localStorage.setItem(CUSTOM_OPTIONS_ID, JSON.stringify({ font: 4, radius: 5 }));
      localStorage.setItem(
        CUSTOM_TOKEN_ID,
        JSON.stringify({ '--td-font-size-body-large': '19px', '--td-radius-default': '9px' }),
      );
      const generator = createGenerator();
      await settle();
      selectPreset(generator.findComponent(FontSizeAdjust), 4);
      selectPreset(generator.findComponent(RadiusPanel), 5);
      await settle();
      expect(getTokenValue('--td-font-size-body-large')).toBe('17px');
      expect(getTokenValue('--td-radius-default')).toBe('6px');
      expect(localStorage.getItem(CUSTOM_TOKEN_ID)).toBeNull();
      generator.unmount();
    });
    it(`${mode}: individual shadow edits keep the underlying preset on reload`, async () => {
      document.documentElement.setAttribute('theme-mode', mode);
      const first = createGenerator();
      await settle();
      const shadows = first.findComponent(ShadowPanel);
      selectPreset(shadows, 4);
      await settle();
      const presetFirstShadow = getTokenValue('--td-shadow-1').replace(/\s/g, '');
      state<{ change: (value: string[], index: number) => void }>(shadows).change(['0 0 2px rgba(0, 0, 0, 0.5)'], 2);
      await settle();
      expect(getOptionFromLocal('shadow')).toBe(4);
      first.unmount();
      const second = createGenerator();
      await settle();
      expect(getTokenValue('--td-shadow-1').replace(/\s/g, '')).toBe(presetFirstShadow);
      expect(getTokenValue('--td-shadow-3')).toBe('0 0 2px rgba(0, 0, 0, 0.5)');
      selectPreset(second.findComponent(ShadowPanel), 4);
      await settle();
      expect(getTokenValue('--td-shadow-3')).not.toBe('0 0 2px rgba(0, 0, 0, 0.5)');
      second.unmount();
    });
    it(`${mode}: saves and restores the zero-valued ultralight shadow preset`, async () => {
      document.documentElement.setAttribute('theme-mode', mode);
      const first = createGenerator();
      await settle();
      selectPreset(first.findComponent(ShadowPanel), 0);
      await settle();
      expect(getOptionFromLocal('shadow')).toBe(0);
      const expected = snapshot(['--td-shadow-3']);
      first.unmount();
      const second = createGenerator();
      await settle();
      expect(state<PresetState>(second.findComponent(ShadowPanel)).step).toBe(0);
      expect(snapshot(['--td-shadow-3'])).toEqual(expected);
      second.unmount();
    });
  }
  it('shows custom selection on mount without replacing the saved base preset', () => {
    const selector = shallowMount(SegmentSelection, {
      ...mountOptions,
      props: { selectOptions: ShadowSelect, modelValue: 4, disabled: true },
    });
    expect(state<PresetState>(selector).step).toBe(ShadowSelectType.Self_Defined);
    expect(selector.emitted('update:modelValue')).toBeUndefined();
    selector.unmount();
  });
  it('writing CSS during restoration preserves individual token storage', () => {
    themeStore.updateDevice('web');
    modifyToken('--td-radius-default', '9px');
    const saved = localStorage.getItem(CUSTOM_TOKEN_ID);
    applyTokenToStyle('--td-radius-default', '6px');
    expect(localStorage.getItem(CUSTOM_TOKEN_ID)).toBe(saved);
    restoreThemeOptions();
    expect(getTokenValue('--td-radius-default')).toBe('9px');
  });
  it('does not pass an unavailable neutral color to the algorithm', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const panel = shallowMount(ColorPanel, mountOptions);
    expect(() => state<ColorState>(panel).changeNeutralColor(false)).not.toThrow();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('valid HEX'));
    themeStore.updateDevice('web');
    await settle();
    expect(() => state<ColorState>(panel).changeNeutralColor(false)).not.toThrow();
    expect(state<ColorState>(panel).grayMainColor).toBe('#ddd');
    panel.unmount();
    warning.mockRestore();
  });
  it('ignores invalid saved presets without changing localStorage', () => {
    const options = JSON.stringify({ font: 99, radius: -1, shadow: 'bad', 'line-height': 'time_NaN' });
    localStorage.setItem(CUSTOM_OPTIONS_ID, options);
    themeStore.updateDevice('web');
    const before = snapshot([
      '--td-font-size-body-large',
      '--td-radius-default',
      '--td-shadow-3',
      '--td-line-height-body-large',
    ]);
    restoreThemeOptions();
    expect(
      snapshot(['--td-font-size-body-large', '--td-radius-default', '--td-shadow-3', '--td-line-height-body-large']),
    ).toEqual(before);
    expect(localStorage.getItem(CUSTOM_OPTIONS_ID)).toBe(options);
  });
  it('zero remains a valid option while null removes the option', () => {
    updateLocalOption('shadow', 0);
    expect(getOptionFromLocal('shadow')).toBe(0);
    updateLocalOption('shadow', null);
    expect(getOptionFromLocal('shadow')).toBeUndefined();
  });
});
