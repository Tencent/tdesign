import { render } from "@testing-library/react";
import { expect } from "vitest";

import { DatePickerPanel } from "tdesign-react";

export default async () => {
  const { container } = render(<DatePickerPanel />);
  expect(container).toMatchSnapshot();
};
