import { render } from "@testing-library/react";
import { expect } from "vitest";

import { Typography } from "tdesign-react";

const { Title, Text, Paragraph } = Typography;

export default async () => {
  const { container } = render(
    <>
      <Title>What is TDesign</Title>
      <Text mark>TDesign is an enterprise-level design system.</Text>
      <Paragraph>
        <Text strong>Consistent design language and visual style.</Text>
      </Paragraph>
      <Title level="h2">Comprehensive</Title>
      <Paragraph>
        TDesign supports <Text code>Vue 2</Text>, <Text code>Vue 3</Text>, <Text code>React</Text>.
      </Paragraph>
    </>
  );

  expect(container).toMatchSnapshot();
};
