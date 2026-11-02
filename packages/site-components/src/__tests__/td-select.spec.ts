import { afterEach, describe, expect, it } from 'vitest';

import '../components/td-select';

interface SelectElement extends HTMLElement {
  borderless: boolean;
  value: string | number;
  options: Array<{ label: string; value: string | number }>;
}

async function waitForRender(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve));
}

describe('td-select', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reads attributes set after element creation', async () => {
    const select = document.createElement('td-select') as SelectElement;
    select.options = [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ];
    select.setAttribute('value', '2');
    select.setAttribute('borderless', '');
    document.body.appendChild(select);

    await waitForRender();

    expect(select.shadowRoot?.querySelector('input')?.value).toBe('Two');
    expect(select.shadowRoot?.querySelector('.TDesign-select-input')?.classList).toContain(
      'TDesign-select-input--borderless',
    );
  });

  it('updates when the value attribute changes', async () => {
    const select = document.createElement('td-select') as SelectElement;
    select.options = [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ];
    document.body.appendChild(select);
    await waitForRender();

    select.setAttribute('value', '1');
    await waitForRender();

    expect(select.shadowRoot?.querySelector('input')?.value).toBe('One');
  });

  it('preserves properties set before connection', async () => {
    const select = document.createElement('td-select') as SelectElement;
    select.options = [{ label: 'Two', value: 2 }];
    select.value = 2;
    document.body.appendChild(select);

    await waitForRender();

    expect(select.value).toBe(2);
    expect(select.shadowRoot?.querySelector('input')?.value).toBe('Two');
  });
});
