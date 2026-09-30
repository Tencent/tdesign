/// <reference types="vite/client" />

declare module '*.css?raw' {
  const content: string;
  export default content;
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module 'tvision-color' {
  export interface ColorGradation {
    colors: string[];
    primary?: number;
  }
  export const Color: {
    colorTransform(color: string, from: string, to: string): (number | string)[];
    getColorGradations(options: { colors: string[]; step: number; remainInput?: boolean }): ColorGradation[];
    getNeutralColor(color: string): string[];
  };
}

declare module 'cssbeautify' {
  function cssbeautify(css: string, options?: Record<string, unknown>): string;
  export default cssbeautify;
}

declare module 'tdesign-icons-vue-next' {
  import type { DefineComponent } from 'vue';
  const Icon: DefineComponent<Record<string, unknown>>;
  export const Edit1Icon: typeof Icon;
  export const FileCopyIcon: typeof Icon;
  export const HelpCircleIcon: typeof Icon;
  export const ErrorCircleIcon: typeof Icon;
  export const LinkUnlinkIcon: typeof Icon;
  export const RemoveIcon: typeof Icon;
  export const AddIcon: typeof Icon;
}

interface Window {
  _horizon?: {
    send(event: string, action: string): void;
  };
}
