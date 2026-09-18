import "tdesign-web-components/lib/chat-sender";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-chat-sender") as any;

  // 设置属性
  el.placeholder = "请输入消息...";
  el.value = "";

  await runWebComponentSnap(el);
};
