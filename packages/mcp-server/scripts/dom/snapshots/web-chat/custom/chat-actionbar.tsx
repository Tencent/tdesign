import "tdesign-web-components/lib/chat-action";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-chat-action") as any;

  // 设置操作项
  el.operations = [
    { name: "copy", icon: "file-copy" },
    { name: "redo", icon: "refresh" },
    { name: "like", icon: "thumb-up" },
    { name: "dislike", icon: "thumb-down" }
  ];

  await runWebComponentSnap(el);
};
