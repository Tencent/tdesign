export const addTdPrefix = (suffix: string) => `tdesign-${suffix}`;

export const PLATFORMS = {
  web: "web",
  mobile: "mobile"
} as const;
export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];

export const WEB_FRAMEWORKS = ["react", "react-chat", "vue", "vue-next", "vue-next-chat"] as const;

export const MOBILE_FRAMEWORKS = [
  "mobile-react",
  "mobile-vue",
  "miniprogram",
  "miniprogram-chat",
  "uniapp",
  "uniapp-chat"
] as const;

export const FRAMEWORKS = [...WEB_FRAMEWORKS, ...MOBILE_FRAMEWORKS] as const;
export type Framework = (typeof FRAMEWORKS)[number];

// wxss 内容置空，聚焦组件本身
export const MINIPROGRAM_DEMO_EXTS = [".wxml", ".js", ".json"] as const;

/* 组件库是否为大仓结构 */
const MONOREPO: Framework[] = ["react", "vue-next", "miniprogram"] as const;
export const isMonorepo = (fw: Framework) => MONOREPO.includes(fw);

export const isMiniProgram = (fw: Framework) => ["miniprogram", "miniprogram-chat"].includes(fw);

export const isUniapp = (fw: Framework) => ["uniapp", "uniapp-chat"].includes(fw);

export const isChatFramework = (fw: Framework) => fw.includes("chat") || fw === "uniapp-chat";

const SPECIAL_CHAT_COMPONENTS = ["attachments"];
export const isChatComponent = (name: string) => name.startsWith("chat-") || SPECIAL_CHAT_COMPONENTS.includes(name);

export const getSuffixByFramework = (fw: Framework) => (fw.includes("react") ? "tsx" : "vue");

/** uniapp 相关框架的源仓库映射 */
export const getUniappSourceFramework = (fw: Framework): Framework => (fw === "uniapp-chat" ? "uniapp" : "uniapp");

export const getPlatformByFramework = (fw: Framework): Platform => {
  if ((MOBILE_FRAMEWORKS as readonly Framework[]).includes(fw)) {
    return PLATFORMS.mobile;
  }

  return PLATFORMS.web;
};
