import "tdesign-web-components/lib/chat-message/content/markdown-content";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-chat-md-content") as any;

  // 设置 markdown 内容
  el.text = `# 标题

这是一段 **Markdown** 内容。

- 列表项 1
- 列表项 2

\`\`\`javascript
console.log('Hello World');
\`\`\`
`;

  await runWebComponentSnap(el, { delay: 500 });
};
