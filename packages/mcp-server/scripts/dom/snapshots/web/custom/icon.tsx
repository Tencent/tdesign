import { render } from "@testing-library/react";
import { expect } from "vitest";

import { AddIcon } from "tdesign-icons-react";

export default async () => {
  const { container: basicContainer } = render(<AddIcon />);
  expect(basicContainer).toMatchSnapshot();
};
