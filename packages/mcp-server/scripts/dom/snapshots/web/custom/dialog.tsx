import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import DialogDemo from "@tdesign-mcp-server/docs-react/dialog/Demo";

export default async () => {
  const { container } = render(<DialogDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const dialog = document.querySelector(".t-dialog");
  expect(dialog).toMatchSnapshot();
};
