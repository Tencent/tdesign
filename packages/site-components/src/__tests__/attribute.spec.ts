import { describe, expect, it, vi } from 'vitest';

import { attribute, parseBoolean } from '../utils';

interface AttributeHost extends HTMLElement {
  enabled: boolean;
}

type ConnectedHost = AttributeHost & { __property_key__: boolean };

describe('attribute descriptor', () => {
  it('reads attributes added after element creation and observes updates', async () => {
    const host = document.createElement('div') as unknown as ConnectedHost;
    host.enabled = false;
    host.setAttribute('enabled', '');

    const descriptor = attribute(false, (value) => parseBoolean(value, false));
    const cleanup = descriptor.connect?.(host, 'enabled' as '__property_key__', vi.fn());

    expect(host.enabled).toBe(true);

    host.setAttribute('enabled', 'false');
    await new Promise((resolve) => setTimeout(resolve));
    expect(host.enabled).toBe(false);

    cleanup?.();
  });

  it('preserves properties when the attribute is absent', () => {
    const host = document.createElement('div') as unknown as ConnectedHost;
    host.enabled = true;

    const descriptor = attribute(false, (value) => parseBoolean(value, false));
    const cleanup = descriptor.connect?.(host, 'enabled' as '__property_key__', vi.fn());

    expect(host.enabled).toBe(true);

    cleanup?.();
  });

  it('composes an existing connect lifecycle', () => {
    const host = document.createElement('div') as unknown as ConnectedHost;
    host.enabled = false;
    const lifecycleCleanup = vi.fn();
    const connect = vi.fn(() => lifecycleCleanup);

    const descriptor = attribute<boolean, AttributeHost>(false, undefined, { connect });
    const cleanup = descriptor.connect?.(host, 'enabled' as '__property_key__', vi.fn());

    expect(connect).toHaveBeenCalledOnce();

    cleanup?.();
    expect(lifecycleCleanup).toHaveBeenCalledOnce();
  });
});
