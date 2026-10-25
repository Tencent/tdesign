import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import message from '../components/td-message';

const { mockDefine } = vi.hoisted(() => ({ mockDefine: vi.fn((definition: unknown) => definition) }));

vi.mock('hybrids', () => ({ define: mockDefine, html: vi.fn() }));

type MessageHost = {
  content: string;
  duration: number;
  theme: string;
  showMessage: boolean;
};

const showProp = message.show as unknown as (
  host: MessageHost,
) => (options: { content: string; duration?: number; theme?: string }) => void;
const showMessageProp = message.showMessage as unknown as {
  connect: (host: MessageHost) => () => void;
};

function createHost(): MessageHost {
  return { content: '', duration: 3000, theme: 'info', showMessage: false };
}

describe('td-message timer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('uses the host duration when an option is absent or zero', () => {
    const host = createHost();
    const show = showProp(host);
    show({ content: 'first' });
    vi.advanceTimersByTime(2999);
    expect(host.showMessage).toBe(true);
    vi.advanceTimersByTime(1);
    expect(host.showMessage).toBe(false);

    show({ content: 'second', duration: 0 });
    vi.advanceTimersByTime(2999);
    expect(host.showMessage).toBe(true);
    vi.advanceTimersByTime(1);
    expect(host.showMessage).toBe(false);
  });

  it('uses a custom duration and inherits the previous theme when omitted', () => {
    const host = createHost();
    const show = showProp(host);
    show({ content: 'first', theme: 'success', duration: 500 });
    vi.advanceTimersByTime(500);
    expect(host.showMessage).toBe(false);

    show({ content: 'second', duration: 1200 });
    expect(host.theme).toBe('success');
    expect(host.content).toBe('second');
    vi.advanceTimersByTime(1199);
    expect(host.showMessage).toBe(true);
    vi.advanceTimersByTime(1);
    expect(host.showMessage).toBe(false);
  });

  it('does not let an old default timer close a newer custom message', () => {
    const host = createHost();
    const show = showProp(host);
    show({ content: 'A', duration: 0 });
    vi.advanceTimersByTime(2000);
    show({ content: 'B', duration: 2000 });
    vi.advanceTimersByTime(1000);
    expect(host.content).toBe('B');
    expect(host.showMessage).toBe(true);
    vi.advanceTimersByTime(999);
    expect(host.showMessage).toBe(true);
    vi.advanceTimersByTime(1);
    expect(host.showMessage).toBe(false);
  });

  it('keeps timers independent across instances', () => {
    const first = createHost();
    const second = createHost();
    showProp(first)({ content: 'first', duration: 1000 });
    showProp(second)({ content: 'second', duration: 2000 });
    vi.advanceTimersByTime(1000);
    expect(first.showMessage).toBe(false);
    expect(second.showMessage).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(second.showMessage).toBe(false);
  });

  it('clears the timer and hides the message on disconnect without a late write', () => {
    const host = createHost();
    const cleanup = showMessageProp.connect(host);
    showProp(host)({ content: 'first' });
    cleanup();
    expect(host.showMessage).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    const snapshot = host.showMessage;
    vi.advanceTimersByTime(3000);
    expect(host.showMessage).toBe(snapshot);
  });

  it('shows a new message after reconnecting the same instance', () => {
    const host = createHost();
    showMessageProp.connect(host)();
    showMessageProp.connect(host);
    showProp(host)({ content: 'new', duration: 500 });
    expect(host.showMessage).toBe(true);
    vi.advanceTimersByTime(500);
    expect(host.showMessage).toBe(false);
  });
});
