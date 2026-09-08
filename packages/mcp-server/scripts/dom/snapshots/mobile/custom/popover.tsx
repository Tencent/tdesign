import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";
import { Popover, Button } from "tdesign-mobile-react";

function PopoverDemo() {
  return (
    <Popover
      placement="top"
      theme="dark"
      content="弹出气泡内容"
      triggerElement={
        <Button theme="primary" variant="outline" size="large">
          顶部中
        </Button>
      }
    />
  );
}

export default async () => {
  const { container } = render(<PopoverDemo />);
  expect(container).toMatchSnapshot();
};
