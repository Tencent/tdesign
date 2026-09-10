import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import GuideDemo from "@tdesign-mcp-server/docs-react/guide/Demo";

export default async () => {
  const { container } = render(<GuideDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const guideSelectors = [".t-guide__overlay", ".t-guide__highlight", ".t-guide__reference", ".t-guide__popup"];
  const targetDomWrapper = document.createElement("div");
  const guideEls = Array.from(document.querySelectorAll(guideSelectors.join(",")));
  guideEls.forEach((guide) => {
    targetDomWrapper.innerHTML += guide.outerHTML;
  });
  expect(targetDomWrapper).toMatchSnapshot();
};
