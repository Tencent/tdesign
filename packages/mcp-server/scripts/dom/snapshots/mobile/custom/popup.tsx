import { render } from "@testing-library/react";
import { expect } from "vitest";
import { Popup } from "tdesign-mobile-react";

function PopupDemo() {
  return (
    <Popup visible={true} placement="bottom">
      <div style={{ padding: "16px" }}>弹出层内容</div>
    </Popup>
  );
}

export default async () => {
  render(<PopupDemo />);

  const popupSelectors = [".t-overlay", ".t-popup"];
  const targetDomWrapper = document.createElement("div");
  const popupEls = Array.from(document.querySelectorAll(popupSelectors.join(",")));
  popupEls.forEach((el) => {
    targetDomWrapper.innerHTML += el.outerHTML;
  });
  expect(targetDomWrapper).toMatchSnapshot();
};
