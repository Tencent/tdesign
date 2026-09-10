import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import TreeDemo from "@tdesign-mcp-server/docs-react/tree/Demo";

export default async () => {
  const { container } = render(<TreeDemo />);
  await new Promise((resolve) => setTimeout(resolve, 0));
  const firstTreeIcon = container.querySelector(".t-tree__icon");
  if (firstTreeIcon) {
    fireEvent.click(firstTreeIcon);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  expect(container).toMatchSnapshot();
};
