/**
 * 全局快捷键注册
 *  - Cmd/Ctrl + K -> open
 *  - "/"（非输入框焦点时）-> open
 *  - Esc -> close
 */

interface HotkeyHandlers {
  onOpen: () => void;
  onClose: () => void;
}

function isEditable(el: Element | null): boolean {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (el instanceof HTMLElement && el.isContentEditable) return true;
  return false;
}

/**
 * 注册全局快捷键
 * @param {{ onOpen: () => void, onClose: () => void }} handlers
 * @returns {() => void} 注销函数
 */
export function registerHotkeys({ onOpen, onClose }: HotkeyHandlers): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: KeyboardEvent): void => {
    // Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (onOpen) onOpen();
      return;
    }
    // "/"：不在输入态下触发
    if (e.key === '/' && !isEditable(document.activeElement)) {
      e.preventDefault();
      if (onOpen) onOpen();
      return;
    }
    // ESC：无论焦点在何处，都关闭 popover
    if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
