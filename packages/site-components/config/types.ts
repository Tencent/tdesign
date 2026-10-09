export type Language = 'en' | 'zh';

export interface HeaderItem {
  name: string;
  path?: string;
  type: 'base' | 'main';
  target: '_blank' | '_self';
}

export interface ComponentLink {
  name: string;
  icon: string;
  path: string;
  npm: string;
  status: 0 | 1 | 2 | 3 | 4;
}

export interface ComponentLinkGroup {
  name: string;
  links: ComponentLink[];
}

export interface HeaderConfig {
  headerList: HeaderItem[];
  baseComponentsLinks: {
    web: ComponentLinkGroup;
    mobile: ComponentLinkGroup;
  };
  baseComponentPrefix: string[];
}

export interface FooterLink {
  name: string;
  url: string;
  target: '_blank' | '_self';
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
  desktopOnly?: boolean;
}

export interface SiteLocale {
  changelog: {
    title: string;
    emptyInfo: string;
  };
  footer: {
    copyright: string;
    weComGroup: string;
    weComGroupDesc: string;
  };
}
