import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, defineComponent, nextTick } from 'vue';

// 可受控的 stub：替换 tdesign-vue-next 的 Popup。
// - visible 透传到 data-visible 便于断言
// - 渲染一个带 data-td-popup 属性的 overlay div，并暴露 getOverlay() 返回它
//   （模拟 TDesign 真实结构，供 ShadowPopup 的 hover 修正逻辑访问）
// - 通过 vm.$emit('visible-change', v, ctx) 触发 visible-change
const PopupStub = defineComponent({
  name: 'TPopup',
  props: { visible: Boolean },
  emits: ['visible-change'],
  setup() {
    function getOverlay() {
      return document.querySelector('[data-testid="popup-overlay"]');
    }
    return { getOverlay, render() {} };
  },
  render() {
    // overlay 外层 div 带 data-td-popup（模拟 TDesign popup.js:441）
    return h('div', { 'data-testid': 'popup-stub', 'data-visible': String(this.visible) }, [
      h('slot'),
      this.visible
        ? h('div', { 'data-testid': 'popup-overlay', 'data-td-popup': 'me', 'data-td-popup-parent': undefined }, [
            h('slot', { name: 'content' }),
          ])
        : null,
    ]);
  },
});

import ShadowPopup from '../index.vue';

function mountPopup() {
  const wrapper = mount(
    defineComponent({
      components: { ShadowPopup },
      setup() {
        return () => h(ShadowPopup, null, { default: () => h('span', 'trigger') });
      },
    }),
    { global: { stubs: { TPopup: PopupStub } }, attachTo: document.body },
  );
  const stub = wrapper.findComponent(PopupStub);
  return { wrapper, fire: (v, ctx) => stub.vm.$emit('visible-change', v, ctx) };
}

// 构造一个 event.target 为 shadow host <td-theme-generator> 的关闭上下文
// （模拟 Shadow DOM 下 document 层 mousedown 被 retarget 到 host）
function hostCtx() {
  const host = document.createElement('td-theme-generator');
  return { trigger: 'document', e: { target: host } };
}

// 构造一个真正的外部点击（target 不是 shadow host）
function outsideCtx() {
  return { trigger: 'document', e: { target: document.createElement('div') } };
}

// 模拟 Shadow DOM 下 document 层的 mousedown：
// insidePopup=true 时 composedPath 包含 [data-td-popup] 元素（点击落在弹层 overlay 内）
async function dispatchMouseDown(insidePopup) {
  const popupEl = insidePopup ? document.createElement('div') : null;
  if (popupEl) popupEl.setAttribute('data-td-popup', 'x');
  const ev = new MouseEvent('mousedown', { bubbles: true, composed: true });
  ev.composedPath = () => (popupEl ? [popupEl] : []);
  document.dispatchEvent(ev);
  await nextTick();
}

describe('ShadowPopup —— Shadow DOM 下点击弹层内部不应关闭', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // happy-dom 下 document mousedown 派发到 capture 监听不可靠（真实浏览器正常），
  // 此用例的真实浏览器验证已由用户确认；逻辑见 onDocumentMouseDown + handleVisibleChange。
  it.skip('点击弹层 overlay 内部 → document 关闭被否决，保持打开', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-click' });
    await nextTick();
    await nextTick();
    expect(wrapper.find('[data-visible="true"]').exists()).toBe(true);

    // 模拟点击弹层内部（composedPath 命中 [data-td-popup]）
    await dispatchMouseDown(true);

    fire(false, hostCtx());
    await nextTick();
    expect(wrapper.find('[data-visible="true"]').exists()).toBe(true);
  });

  it('点击另一个触发器（非弹层 overlay 内）→ document 关闭不被否决，正常关闭', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-click' });
    await nextTick();
    await nextTick();

    // 点击未命中任何弹层 overlay（如点另一个 list-item 触发器）
    await dispatchMouseDown(false);

    fire(false, hostCtx());
    await nextTick();
    expect(wrapper.find('[data-visible="false"]').exists()).toBe(true);
  });

  it('点击另一个触发器（非弹层 overlay 内）→ document 关闭不被否决，正常关闭', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-click' });
    await nextTick();
    await nextTick();

    // 点击未命中任何弹层 overlay（如点另一个 list-item 触发器）
    await dispatchMouseDown(false);

    fire(false, hostCtx());
    await nextTick();
    expect(wrapper.find('[data-visible="false"]').exists()).toBe(true);
  });

  it('document 关闭且 target 为普通元素（真正的外部点击）→ 正常关闭', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-click' });
    await nextTick();

    fire(false, outsideCtx());
    await nextTick();
    expect(wrapper.find('[data-visible="false"]').exists()).toBe(true);
  });

  it('trigger-element-click 关闭不被否决（点触发器切换照常）', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-click' });
    await nextTick();

    fire(false, { trigger: 'trigger-element-click', e: { target: document.createElement('td-theme-generator') } });
    await nextTick();
    expect(wrapper.find('[data-visible="false"]').exists()).toBe(true);
  });

  it('对外 re-emit visible-change（父组件原有 hoverIdx 等逻辑仍可工作）', async () => {
    const onVisibleChange = vi.fn();
    const wrapper = mount(
      defineComponent({
        components: { ShadowPopup },
        setup() {
          return () => h(ShadowPopup, { onVisibleChange }, { default: () => h('span', 'trigger') });
        },
      }),
      { global: { stubs: { TPopup: PopupStub } } },
    );
    const stub = wrapper.findComponent(PopupStub);

    stub.vm.$emit('visible-change', true, { trigger: 'trigger-element-click' });
    await nextTick();
    expect(onVisibleChange).toHaveBeenCalledWith(true, { trigger: 'trigger-element-click' });
  });
});

describe('ShadowPopup —— Shadow DOM 下 hover 弹层移向子弹层不应关闭', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('overlay mouseleave 时光标移向子弹层 → 否决随后的 trigger-element-hover 关闭', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-hover' });
    await nextTick();
    await nextTick(); // 等待 attach() 拿到 overlay

    // 构造一个子弹层元素（data-td-popup-parent 指向本弹层 id "me"）
    const childPopup = document.createElement('div');
    childPopup.setAttribute('data-td-popup', 'child');
    childPopup.setAttribute('data-td-popup-parent', 'me');
    document.body.appendChild(childPopup);

    // 模拟 overlay mouseleave，relatedTarget 指向子弹层内部
    const overlay = document.querySelector('[data-testid="popup-overlay"]');
    const mouseLeaveEv = new MouseEvent('mouseleave', { bubbles: true, relatedTarget: childPopup });
    overlay.dispatchEvent(mouseLeaveEv);
    await nextTick();

    // TDesign 随后（150ms 后）触发 trigger-element-hover 关闭 → 应被否决
    fire(false, { trigger: 'trigger-element-hover', e: { relatedTarget: childPopup } });
    await nextTick();
    expect(wrapper.find('[data-visible="true"]').exists()).toBe(true);
  });

  it('子弹层 assertMouseLeave 转发：relatedTarget 指向父弹层 overlay 内 → 否决父弹层关闭', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-hover' });
    await nextTick();
    await nextTick();

    const overlay = document.querySelector('[data-testid="popup-overlay"]');
    // relatedTarget 是父 overlay 内的某个子节点
    const innerNode = document.createElement('span');
    overlay.appendChild(innerNode);

    fire(false, { trigger: 'trigger-element-hover', e: { relatedTarget: innerNode } });
    await nextTick();
    expect(wrapper.find('[data-visible="true"]').exists()).toBe(true);
  });

  it('overlay mouseleave 时光标移向外部（非子弹层）→ 正常关闭', async () => {
    const { wrapper, fire } = mountPopup();

    fire(true, { trigger: 'trigger-element-hover' });
    await nextTick();
    await nextTick();

    const overlay = document.querySelector('[data-testid="popup-overlay"]');
    const outside = document.createElement('div');
    document.body.appendChild(outside);

    const mouseLeaveEv = new MouseEvent('mouseleave', { bubbles: true, relatedTarget: outside });
    overlay.dispatchEvent(mouseLeaveEv);
    await nextTick();

    fire(false, { trigger: 'trigger-element-hover', e: { relatedTarget: outside } });
    await nextTick();
    expect(wrapper.find('[data-visible="false"]').exists()).toBe(true);
  });
});
