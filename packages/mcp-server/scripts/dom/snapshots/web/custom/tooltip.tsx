import { render, waitFor } from "@testing-library/react";
import { expect } from "vitest";

import { Button, Tooltip } from "tdesign-react";

function TooltipDemo() {
  return (
    <Tooltip
      showArrow
      visible={true}
      content="这是 Tooltip 内容"
    >
      <Button>Hover me</Button>
    </Tooltip>
  );
}

export default async () => {
  render(<TooltipDemo />);

  await waitFor(() => {
    expect(document.querySelector(".t-popup")).toBeTruthy();
  });

  const tooltipSelectors = [".t-popup", ".t-tooltip"];
  const targetDomWrapper = document.createElement("div");
  const tooltipEls = Array.from(document.querySelectorAll(tooltipSelectors.join(",")));
  tooltipEls.forEach((el) => {
    targetDomWrapper.innerHTML += el.outerHTML;
  });
  expect(targetDomWrapper).toMatchSnapshot();
};
