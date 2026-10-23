import { onBeforeUnmount, onMounted, ref } from 'vue';

import type { ThemeMode } from '@/pages/types';

export function createHomeTheme() {
  const themeMode = ref<ThemeMode>('light');
  let observer: MutationObserver | null = null;

  function syncThemeMode(): void {
    themeMode.value = document.documentElement.getAttribute('theme-mode') === 'dark' ? 'dark' : 'light';
  }

  onMounted(() => {
    syncThemeMode();
    observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.attributeName === 'theme-mode')) syncThemeMode();
    });
    observer.observe(document.documentElement, { attributes: true });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { themeMode };
}
