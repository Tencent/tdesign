import { render } from "@testing-library/react";
import { expect } from "vitest";

import { Layout } from "tdesign-react";

const { Header, Content, Footer, Aside } = Layout;

export default async () => {
  const { container } = render(
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Aside>Aside</Aside>
        <Layout>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </Layout>
  );

  expect(container).toMatchSnapshot();
};
