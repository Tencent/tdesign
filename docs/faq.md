---
title: 常见问题
---

### Version Release

Currently, TDesign releases new version weekly.
If you have an urgent online issue to resolve, please leave a message in the issue requesting a pre-release version, which is not subject to iteration requirements and can be published at any time.

### Customizing Theme

Refer to [Customizing Theme](<(https://github.com/Tencent/tdesign-common/blob/develop/theme.md)>), it is recommend to custom theme by modifying global and component-specific style variables. Only consider rewriting default styles using same-named classes if existing variables cannot meet your customization needs. This reduces the difficulty of upgrading with the component library.

### Controlled and Uncontrolled Usage

For component properties that may need to be updated during use, such as `value` (corresponding update event `onChange`), components implement both controlled and uncontrolled usage. The following uses `value/onChange` as an example:

- `Controlled usage`: Passing in the `value` property signifies controlled usage. The component's state is completely controlled by the property value and has no internal state. To update the state, a new property value must be passed. When users trigger the update event `onChange` through interaction, developers need to update the value and pass it to the component for the component's state to update.
- `Uncontrolled usage`: This is the initial value usage. Please do not pass in the `value` attribute; instead, use the corresponding initial value attribute `defaultValue` to set the component's initial state. The component will maintain this state internally. After the user triggers the update event `onChange` through interaction, the component will directly update the component's state.

### Use TDesign in Sketch

TDesign provides two ways to use TDesign in Sketch.

- Use the Sketch source files provided by TDesign, which include desktop and mobile versions.
- Alternatively, you can also use the Sketch plugin provided by TDesign. For specific usage, please refer to the [documentation](https://doc.weixin.qq.com/doc/w3_m_OkshgETGpoGB?scode=AJEAIQdfAAoYvGqGCUAL8AZgbdAFw)).
