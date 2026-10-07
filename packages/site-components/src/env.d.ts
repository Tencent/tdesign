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
  [key: string]: any;
  WebChatSdk?: WebChatSdkConstructor;
  webChatSdk?: WebChatSdkInstance;
}

interface Element {
  [key: string]: any;
}

interface HTMLElement {
  [key: string]: any;
}

interface EventTarget {
  [key: string]: any;
}

declare const Aegis: any;
