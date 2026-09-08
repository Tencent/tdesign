import { cleanup } from "@testing-library/react";
import { expect } from "vitest";

import { serializeWithShadowDom } from "./serializeShadowDom";

export interface RunSnapshotOptions {
  delay?: number;
}

export async function runWebComponentSnap(el: HTMLElement, options: RunSnapshotOptions = {}) {
  const { delay } = options;

  const container = document.createElement("div");
  document.body.appendChild(container);
  container.appendChild(el);

  if (delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const html = serializeWithShadowDom(container, {
    ignoreAttributes: [],
    includeShadowRootMarker: true
  });
  expect(html).toMatchSnapshot();

  document.body.removeChild(container);
  cleanup();
}
