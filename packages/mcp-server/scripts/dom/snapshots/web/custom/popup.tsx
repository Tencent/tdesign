import { render, waitFor } from "@testing-library/react";
import { expect } from "vitest";

import { Button, Popup } from "tdesign-react";

function PopupDemo() {
  return (
    <Popup
      showArrow
      visible={true}
      content="这是 Popup 内容"
    >
      <Button>Hover me</Button>
    </Popup>
  );
}

export default async () => {
  render(<PopupDemo />);

  // 等待 Popup 渲染完成（Portal 组件是异步挂载的）
  await waitFor(() => {
    expect(document.querySelector(".t-popup")).toBeTruthy();
  });

  const popupSelectors = [".t-popup"];
  const targetDomWrapper = document.createElement("div");
  const popupEls = Array.from(document.querySelectorAll(popupSelectors.join(",")));
  popupEls.forEach((el) => {
    targetDomWrapper.innerHTML += el.outerHTML;
  });
  expect(targetDomWrapper).toMatchSnapshot();
};
