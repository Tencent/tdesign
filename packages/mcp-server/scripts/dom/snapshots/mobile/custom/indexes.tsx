import { Fragment } from "react";
import { render } from "@testing-library/react";
import { expect } from "vitest";
import { Indexes, IndexesAnchor, CellGroup, Cell } from "tdesign-mobile-react";

const list = [
  { index: "A", children: ["阿坝", "阿拉善", "安康"] },
  { index: "B", children: ["北京", "白银", "保定"] },
  { index: "C", children: ["重庆", "成都", "长沙"] },
];

function IndexesDemo() {
  const indexList = list.map((item) => item.index);
  return (
    <Indexes indexList={indexList}>
      {list.map((item) => (
        <Fragment key={item.index}>
          <IndexesAnchor index={item.index} />
          <CellGroup>
            {item.children.map((val, i) => (
              <Cell key={i} title={val} />
            ))}
          </CellGroup>
        </Fragment>
      ))}
    </Indexes>
  );
}

export default async () => {
	render(<IndexesDemo />);
  const indexes = document.querySelector(".t-indexes");
  expect(indexes).toMatchSnapshot();

};
