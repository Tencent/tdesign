import { computed, ref } from 'vue';

export default function usePageLoad() {
  const loaded = ref(false);
  const contentStyle = computed(() => ({
    visibility: loaded.value ? 'visible' : 'hidden',
  }));

  function contentLoaded(callback: () => void): void {
    requestAnimationFrame(() => {
      loaded.value = true;
      callback();
    });
  }

  return {
    loaded,
    contentStyle,
    contentLoaded,
  };
}
