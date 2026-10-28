import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerHotkeys } from '../components/td-doc-search/hotkeys';

function pressKey(target: EventTarget, key: string, options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    composed: true,
    cancelable: true,
    ...options,
  });
  target.dispatchEvent(event);
  return event;
}

function mountShadowEditor(tag: 'input' | 'textarea' | 'select' = 'input') {
  const host = document.createElement('div');
  const root = host.attachShadow({ mode: 'open' });
  const editor = document.createElement(tag);
  root.appendChild(editor);
  document.body.appendChild(host);
  editor.focus();
  return { host, root, editor };
}

describe('td-doc-search hotkeys', () => {
  let onOpen: ReturnType<typeof vi.fn<() => void>>;
  let onClose: ReturnType<typeof vi.fn<() => void>>;
  let unregister: () => void;

  beforeEach(() => {
    onOpen = vi.fn();
    onClose = vi.fn();
    unregister = registerHotkeys({ onOpen, onClose });
  });

  afterEach(() => {
    unregister();
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it.each(['input', 'textarea', 'select'] as const)('preserves slash input in a shadow-root %s', (tag) => {
    const { host, root, editor } = mountShadowEditor(tag);
    expect(document.activeElement).toBe(host);
    expect(root.activeElement).toBe(editor);

    const event = pressKey(editor, '/');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('preserves slash input through nested shadow roots', () => {
    const { host, root, editor } = mountShadowEditor();
    const outerHost = document.createElement('div');
    const outerRoot = outerHost.attachShadow({ mode: 'open' });
    outerRoot.appendChild(host);
    document.body.appendChild(outerHost);
    editor.focus();
    expect(document.activeElement).toBe(outerHost);
    expect(outerRoot.activeElement).toBe(host);
    expect(root.activeElement).toBe(editor);

    const event = pressKey(editor, '/');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('preserves slash input from a child of a shadow-root contenteditable element', () => {
    const { root, editor: input } = mountShadowEditor();
    input.remove();
    const editor = document.createElement('div');
    editor.contentEditable = 'true';
    const child = document.createElement('span');
    editor.appendChild(child);
    root.appendChild(editor);
    // happy-dom does not calculate inherited contenteditable state.
    vi.spyOn(editor, 'isContentEditable', 'get').mockReturnValue(true);

    const event = pressKey(child, '/');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it.each(['input', 'textarea', 'select'] as const)('keeps slash input in a light-DOM %s', (tag) => {
    const editor = document.createElement(tag);
    document.body.appendChild(editor);
    editor.focus();

    const event = pressKey(editor, '/');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('opens search for slash outside an editor', () => {
    const event = pressKey(document.body, '/');

    expect(event.defaultPrevented).toBe(true);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('opens search for slash from a non-editable shadow-root element', () => {
    const { root, editor } = mountShadowEditor();
    editor.remove();
    const button = document.createElement('button');
    root.appendChild(button);
    button.focus();

    const event = pressKey(button, '/');

    expect(event.defaultPrevented).toBe(true);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it.each([{ ctrlKey: true }, { metaKey: true }])('keeps the explicit search shortcut in an editor: %j', (modifier) => {
    const { editor } = mountShadowEditor();

    const event = pressKey(editor, 'k', modifier);

    expect(event.defaultPrevented).toBe(true);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('keeps Escape closing search from a shadow-root editor', () => {
    const { editor } = mountShadowEditor();

    pressKey(editor, 'Escape');

    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('leaves unrelated keys untouched', () => {
    const { editor } = mountShadowEditor();

    const event = pressKey(editor, 'a');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('retains the active-element guard for window-dispatched events', () => {
    const editor = document.createElement('input');
    document.body.appendChild(editor);
    editor.focus();

    const event = pressKey(window, '/');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('removes the global listener when unregistered', () => {
    unregister();

    const event = pressKey(document.body, '/');

    expect(event.defaultPrevented).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
