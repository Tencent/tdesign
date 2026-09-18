import "tdesign-web-components/lib/chat-message/content/thinking-content";
import "tdesign-web-components/lib/collapse";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-chat-thinking-content") as any;

  el.text = "这是 AI 的思考内容，正在分析问题...";
  el.title = "思考过程";
  el.status = "complete";
  el.collapsed = false;
  el.layout = "block";

  await runWebComponentSnap(el, { delay: 500 });
};
