export type Device = 'web' | 'mobile' | 'mini-program' | 'uni-app';
export type DeviceType = 'web' | 'mobile';
export type ThemeMode = 'light' | 'dark';
export type Trigger = 'init' | 'update';

export interface ThemeCss {
  light: string;
  dark: string;
  extra: string;
}

export interface ThemeMeta {
  name: string;
  enName: string;
  subtitle: string;
  subtitleText: string;
  value: string;
}

export interface Theme extends ThemeMeta {
  css: ThemeCss;
}

export interface ThemeCategory {
  title: string;
  enTitle: string;
  options: Theme[];
}

export interface TokenIndex {
  name: string;
  idx: number;
}

export interface TokenMapItem {
  name: string;
  from?: string;
  value?: string;
}

export interface OptionItem<T = number> {
  label: string;
  enLabel: string;
  value: T;
  disabled?: boolean;
}

export interface Palette {
  lightPalette: string[];
  darkPalette: string[];
}

export interface BrandPalette extends Palette {
  lightBrandIdx: number;
  darkBrandIdx: number;
}
