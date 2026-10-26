import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextTick } from 'vue';

// color-panel 挂载时调用 colorAnimation()，依赖 canvas 2d context + requestAnimationFrame，
// happy-dom 不支持。该动画是装饰性的，测试中置空。
vi.mock('../common/utils/animation', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../common/utils/animation')>();
  return { ...mod, colorAnimation: () => {} };
});

// 导入 wc-entry 会触发 customElements.define('td-theme-generator', ...)
import '../wc-entry';
import { themeStore } from '../common/themes';

async function mountWC(attrs: Record<string, unknown> = {}) {
  const el = document.createElement('td-theme-generator');
  for (const [k, v] of Object.entries(attrs)) {
    if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, String(v));
  }
  document.body.appendChild(el);
  // 自定义元素的 connectedCallback + Vue 挂载在微任务/下一帧完成
  await nextTick();
  await nextTick();
  return el;
}

describe('Web Component: <td-theme-generator>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.localStorage.clear();
    document.documentElement.removeAttribute('theme-mode');
    document.documentElement.style.cssText = '';
    document.querySelectorAll('style').forEach((el) => el.remove());
  });

  it('已在 customElements 注册', () => {
    expect(customElements.get('td-theme-generator')).toBeDefined();
  });

  it('createElement + 挂载后渲染出 .theme-generator 根节点', async () => {
    const el = await mountWC();
    // shadowRoot: true —— 样式注入 shadowRoot，与宿主页隔离。
    // .theme-generator 根节点在 shadowRoot 内。
    expect(el.shadowRoot).not.toBeNull();
    const root = el.shadowRoot?.querySelector('.theme-generator');
    expect(root).toBeTruthy();
  });

  it('设置 device attribute 后 themeStore.device 同步更新', async () => {
    const el = await mountWC({ device: 'mobile' });
    await nextTick();
    expect(themeStore.device).toBe('mobile');
    el.remove();
  });

  it('卸载元素后不抛错（disconnectedCallback）', async () => {
    const el = await mountWC();
    expect(() => el.remove()).not.toThrow();
  });

  it('同一页面可多次创建/销毁实例', async () => {
    const a = await mountWC();
    const b = await mountWC();
    expect(a.shadowRoot?.querySelector('.theme-generator')).toBeTruthy();
    expect(b.shadowRoot?.querySelector('.theme-generator')).toBeTruthy();
    a.remove();
    b.remove();
  });
});
