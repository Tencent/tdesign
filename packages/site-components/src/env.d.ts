/// <reference types="vite/client" />

interface WebChatSdkInstance {
  sendMessage(message: { prompt: string }): void;
  onChatEnd(callback: (payload: { content: string }) => void): void;
}

interface WebChatSdkConstructor {
  new (options: {
    logo: string;
    logoLarge: string;
    style: { background: string };
    knowledgeBase: string;
    keywords: string;
  }): WebChatSdkInstance;
}

interface Window {
  WebChatSdk?: WebChatSdkConstructor;
  webChatSdk?: WebChatSdkInstance;
  NProgress?: typeof import('nprogress');
  _horizon?: { track(): void };
  aegis?: unknown;
  pgvMain?: () => void;
  showTdMessage?: (options: { content: string; duration?: number; theme?: string }) => void;
  platforms?: Array<{ name: string; url: string }>;
  routerList?: unknown[];
  docInfo?: { title: string; desc: string[] };
  contributors?: Array<{ username: string }>;
  code?: string;
  tsCode?: string;
  compositionCode?: string;
  usageConfig?: unknown[];
  usagePanelList?: Array<{ label: string; value: string }>;
}

interface WindowEventMap {
  pushState: Event;
  replaceState: Event;
  storageChange: Event;
}

interface AegisConstructor {
  new (options: {
    id: string;
    uin?: string;
    reportApiSpeed: boolean;
    reportAssetSpeed: boolean;
    spa: boolean;
    hostUrl?: string;
  }): unknown;
}

declare const Aegis: AegisConstructor;
