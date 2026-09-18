import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import OverlayDemo from "@tdesign-mcp-server/docs-mobile-react/overlay/Demo";

export default async () => {
  const { container } = render(<OverlayDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const overlay = document.querySelector(".t-overlay");
  expect(overlay).toMatchSnapshot();
};
