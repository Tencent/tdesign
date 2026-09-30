/// <reference types="vite/client" />

// 以下三方包未提供类型声明，这里按实际用到的 API 做最小声明。

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

// 宿主站点注入的埋点 API
interface Window {
  _horizon?: {
    send(event: string, action: string): void;
  };
}
