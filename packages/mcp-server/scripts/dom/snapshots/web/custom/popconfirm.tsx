import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";

import PopconfirmDemo from "@tdesign-mcp-server/docs-react/popconfirm/Demo";

export default async () => {
  const { container } = render(<PopconfirmDemo />);
  const button = container.querySelector(".t-button");
  if (button) {
    fireEvent.click(button);
  }
  const popconfirm = document.querySelector(".t-popconfirm");
  expect(popconfirm).toMatchSnapshot();
};
