import { render } from "@testing-library/react";
import { expect } from "vitest";

import { Upload } from "tdesign-react";

export default async () => {
  const { container } = render(
    <>
      <Upload files={[{ name: "example.png", status: "success", size: 1000 }]} />
    </>
  );

  expect(container).toMatchSnapshot();
};
