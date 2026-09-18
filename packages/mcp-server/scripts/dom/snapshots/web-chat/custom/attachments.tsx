import "tdesign-web-components/lib/attachments";

import { runWebComponentSnap } from "../../../utils/runWebComponentSnap";

export default async () => {
  const el = document.createElement("t-attachments") as any;

  el.items = [
    { name: "excel-file.xlsx", size: 111111 },
    { name: "image-file.png", size: 333333, url: "https://tdesign.gtimg.com/site/avatar.jpg" },
    { name: "pdf-file.pdf", size: 444444 }
  ];
  el.overflow = "wrap";

  await runWebComponentSnap(el);
};
