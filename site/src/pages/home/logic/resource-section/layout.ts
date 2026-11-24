import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

export function createResourceLayout(drawResourceFrames: () => void) {
  const resourceSectionRef = ref<HTMLElement>();
  const resourceLayoutRef = ref<HTMLElement>();
  const mobileSectionHeight = ref('auto');
  const tabletLayoutScale = ref('1');
  const tabletSectionHeight = ref('auto');
  let layoutObserver: ResizeObserver | undefined;

  const updateScaledLayout = () => {
    if (!resourceLayoutRef.value) return;

    if (window.innerWidth >= 1200) {
      drawResourceFrames();
    }

    if (window.innerWidth < 700) {
      mobileSectionHeight.value = `${resourceLayoutRef.value.offsetHeight}px`;
    } else {
      mobileSectionHeight.value = 'auto';
    }

    if (window.innerWidth >= 960 && window.innerWidth < 1200) {
      const scale = window.innerWidth / 960;
      tabletLayoutScale.value = scale.toFixed(4);
      tabletSectionHeight.value = `${resourceLayoutRef.value.offsetHeight * scale}px`;
    } else {
      tabletSectionHeight.value = 'auto';
    }
  };

  onMounted(() => {
    nextTick(updateScaledLayout);
    window.addEventListener('resize', updateScaledLayout);
    layoutObserver = new ResizeObserver(updateScaledLayout);
    if (resourceLayoutRef.value) layoutObserver.observe(resourceLayoutRef.value);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScaledLayout);
    layoutObserver?.disconnect();
  });

  return {
    resourceSectionRef,
    resourceLayoutRef,
    mobileSectionHeight,
    tabletLayoutScale,
    tabletSectionHeight,
  };
}
