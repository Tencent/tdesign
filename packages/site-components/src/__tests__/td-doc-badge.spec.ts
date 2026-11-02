import { afterEach, describe, expect, it } from 'vitest';

import '../components/td-doc-badge';

async function waitForRender(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve));
}

describe('td-doc-badge', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reads attributes set after element creation', async () => {
    const badge = document.createElement('td-doc-badge');
    badge.setAttribute('label', 'statements');
    badge.setAttribute('message', '87.5%');
    document.body.appendChild(badge);

    await waitForRender();

    expect(badge.shadowRoot?.querySelector('img')?.getAttribute('src')).toBe(
      'https://img.shields.io/badge/statements-87.5%25-yellow',
    );
  });

  it('updates when an attribute changes', async () => {
    const badge = document.createElement('td-doc-badge');
    document.body.appendChild(badge);
    await waitForRender();

    badge.setAttribute('message', '95%');
    await waitForRender();

    expect(badge.shadowRoot?.querySelector('img')?.getAttribute('src')).toBe(
      'https://img.shields.io/badge/coverage-95%25-brightgreen',
    );
  });

  it('preserves properties set before connection', async () => {
    const badge = document.createElement('td-doc-badge') as HTMLElement & { message: string };
    badge.message = '72%';
    document.body.appendChild(badge);

    await waitForRender();

    expect(badge.shadowRoot?.querySelector('img')?.getAttribute('src')).toBe(
      'https://img.shields.io/badge/coverage-72%25-yellow',
    );
  });
});
