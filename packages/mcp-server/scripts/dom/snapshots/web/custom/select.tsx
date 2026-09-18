import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import SelectDemo from "@tdesign-mcp-server/docs-react/select/Demo";

export default async () => {
  const { container } = render(<SelectDemo />);
  const input = container.querySelector("input");
  if (input) {
    fireEvent.click(input);
  }

  const selectSelectors = [".t-select__wrap", ".t-select__dropdown"];
  const targetDomWrapper = document.createElement("div");
  const selectEls = Array.from(document.querySelectorAll(selectSelectors.join(",")));
  selectEls.forEach((guide) => {
    targetDomWrapper.innerHTML += guide.outerHTML;
  });
  expect(targetDomWrapper).toMatchSnapshot();
};
