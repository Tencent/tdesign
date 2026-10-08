import type { RouteMeta } from 'vue-router';

import type { SiteDocMeta } from '../site.config';

export type ThemeMode = 'light' | 'dark';

export interface MessageApi {
  success: (message: string) => void;
}

export interface PaletteColor {
  topTitle?: string;
  leftTxt: string;
  rightTxt: string;
}

export interface AsideRoute {
  name?: string;
  title: string;
  path?: string;
  meta?: SiteDocMeta;
  children?: AsideRoute[];
}

export type DocAsideElement = HTMLElement & {
  routerList: AsideRoute[];
};

export interface DocHeaderElement extends HTMLElement {
  docInfo: RouteMeta;
}
