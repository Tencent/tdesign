import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import ActionSheetDemo from "@tdesign-mcp-server/docs-mobile-react/action-sheet/Demo";

export default async () => {
  const { container } = render(<ActionSheetDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const actionSheet = document.querySelector(".t-action-sheet");
  expect(actionSheet).toMatchSnapshot();
};
