import { render, waitFor } from "@testing-library/react";
import { expect } from "vitest";

import { ChevronDownIcon } from "tdesign-icons-react";
import { Button, Dropdown } from "tdesign-react";

const options = [
  { content: "操作一", value: 1 },
  { content: "操作二", value: 2 },
  { content: "操作三", value: 3 },
  { content: "操作四", value: 4 }
];

function DropdownDemo() {
  return (
    <Dropdown
      options={options}
      popupProps={{ visible: true }}
    >
      <Button
        variant="text"
        suffix={<ChevronDownIcon size="16" />}
      >
        更多
      </Button>
    </Dropdown>
  );
}

export default async () => {
  render(<DropdownDemo />);

  await waitFor(() => {
    expect(document.querySelector(".t-dropdown")).toBeTruthy();
  });

  const dropdownSelectors = [".t-dropdown"];
  const targetDomWrapper = document.createElement("div");
  const dropdownEls = Array.from(document.querySelectorAll(dropdownSelectors.join(",")));
  dropdownEls.forEach((el) => {
    targetDomWrapper.innerHTML += el.outerHTML;
  });
  expect(targetDomWrapper).toMatchSnapshot();
};
