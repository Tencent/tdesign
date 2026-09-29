/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.md' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '@tdesign/site-components' {
  export function registerLocaleChange(callback?: EventListener): void;
}

declare module 'markdown-it-link-attributes' {
  import type MarkdownIt from 'markdown-it';

  const plugin: (markdown: MarkdownIt, options: { attrs?: Record<string, string> }) => void;
  export default plugin;
}

declare module '*.glb' {
  const url: string;
  export default url;
}

declare module '*.hdr' {
  const url: string;
  export default url;
}

interface Performance {
  readonly memory?: {
    readonly usedJSHeapSize: number;
    readonly jsHeapSizeLimit: number;
  };
}

interface Window {
  NProgress?: {
    start?: () => void;
    done?: () => void;
  };
}

interface HTMLElement {
  track?: () => void;
}
