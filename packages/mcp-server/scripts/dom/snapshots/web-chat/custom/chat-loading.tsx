import "tdesign-web-components/lib/chat-loading";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-chat-loading") as any;

  el.text = "AI 正在思考中...";
  el.animation = "moving";

  await runWebComponentSnap(el);
};
