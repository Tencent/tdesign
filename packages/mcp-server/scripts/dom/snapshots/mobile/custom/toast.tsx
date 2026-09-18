import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import ToastDemo from "@tdesign-mcp-server/docs-mobile-react/toast/Demo";

export default async () => {
  const { container } = render(<ToastDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const toast = document.querySelector(".t-toast");
  expect(toast).toMatchSnapshot();
};
