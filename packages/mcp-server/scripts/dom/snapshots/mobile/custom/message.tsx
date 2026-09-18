import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import MessageDemo from "@tdesign-mcp-server/docs-mobile-react/message/Demo";

export default async () => {
  const { container } = render(<MessageDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const message = document.querySelector(".t-message");
  expect(message).toMatchSnapshot();
};
