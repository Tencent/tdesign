import "tdesign-web-components/lib/chat-message";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-chat-item") as any;

  el.role = "assistant";
  el.content = [
    {
      type: "text",
      data: "这是一条 AI 回复消息，测试文本内容。"
    }
  ];
  el.status = "complete";

  await runWebComponentSnap(el);
};
