import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import DrawerDemo from "@tdesign-mcp-server/docs-react/drawer/Demo";

export default async () => {
  const { container } = render(<DrawerDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const drawer = document.querySelector(".t-drawer");
  expect(drawer).toMatchSnapshot();
};
