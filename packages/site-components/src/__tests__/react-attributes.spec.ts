import { afterEach, describe, expect, it } from 'vitest';

import '../components/td-code';
import '../components/td-doc-copy';
import '../components/td-doc-demo';

async function waitForRender(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve));
}

describe('React attribute integration', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders td-code created through innerHTML', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<td-code text="Button"></td-code>';
    document.body.appendChild(container);

    await waitForRender();

    const code = container.querySelector('td-code');
    expect(code?.shadowRoot?.textContent).toContain('Button');
  });

  it('renders td-doc-demo code from React-style data attributes', async () => {
    const demo = document.createElement('td-doc-demo');
    demo.setAttribute('languages', 'TypeScript,JavaScript');
    demo.setAttribute('data-TypeScript', 'const value: string = "TS";');
    demo.setAttribute('data-JavaScript', 'const value = "JS";');
    document.body.appendChild(demo);

    await waitForRender();

    const tabs = Array.from(demo.shadowRoot?.querySelectorAll('.TDesign-doc-demo-tabs__item') ?? []);
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['TypeScript', 'JavaScript']);
    expect(demo.shadowRoot?.querySelector('code')?.textContent).toContain('const value: string = "TS";');

    demo.setAttribute('data-TypeScript', 'const updated: string = "TS";');
    await waitForRender();

    expect(demo.shadowRoot?.querySelector('code')?.textContent).toContain('const updated: string = "TS";');
  });
});
