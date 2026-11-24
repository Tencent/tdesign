import { onBeforeUnmount, watch, type Ref } from 'vue';

import type { ThemeMode } from '@/pages/types';
import aiResourceDarkSprite from '../../assets/ai-resource/sprite-dark.webp';
import aiResourceSprite from '../../assets/ai-resource/sprite.webp';
import desktopResourceDarkSprite from '../../assets/desktop-resource/sprite-dark.webp';
import desktopResourceSprite from '../../assets/desktop-resource/sprite.webp';
import iconResourceDarkSprite from '../../assets/icon-resource/sprite-dark.webp';
import iconResourceSprite from '../../assets/icon-resource/sprite.webp';
import mobileResourceDarkSprite from '../../assets/mobile-resource/sprite-dark.webp';
import mobileResourceSprite from '../../assets/mobile-resource/sprite.webp';
import type { ResourceCardType } from './cards';

const RESOURCE_FRAME_RATE = 24;
const RESOURCE_FRAME_COUNT = 27;
const RESOURCE_SPRITE_COLUMNS = 9;
const RESOURCE_SPRITE_ROWS = 3;

export const resourceTypes: ResourceCardType[] = ['web', 'mobile', 'aigc', 'icons'];

const resourceSprites: Record<ThemeMode, Record<ResourceCardType, string>> = {
  light: {
    web: desktopResourceSprite,
    mobile: mobileResourceSprite,
    aigc: aiResourceSprite,
    icons: iconResourceSprite,
  },
  dark: {
    web: desktopResourceDarkSprite,
    mobile: mobileResourceDarkSprite,
    aigc: aiResourceDarkSprite,
    icons: iconResourceDarkSprite,
  },
};

export function createResourceSprite(themeMode: Ref<ThemeMode>) {
  const frameIndexes: Record<ResourceCardType, number> = {
    web: 0,
    mobile: 0,
    aigc: 0,
    icons: 0,
  };
  const animationTokens: Record<ResourceCardType, number> = {
    web: 0,
    mobile: 0,
    aigc: 0,
    icons: 0,
  };
  const resourceSpriteElements = {} as Record<ResourceCardType, HTMLElement>;
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hoveredIllustrationType: ResourceCardType | undefined;

  function drawResourceFrame(type: ResourceCardType) {
    const element = resourceSpriteElements[type];
    if (!element) return;
    const frame = frameIndexes[type];
    const column = frame % RESOURCE_SPRITE_COLUMNS;
    const row = Math.floor(frame / RESOURCE_SPRITE_COLUMNS);
    const x = RESOURCE_SPRITE_COLUMNS > 1 ? (column / (RESOURCE_SPRITE_COLUMNS - 1)) * 100 : 0;
    const y = RESOURCE_SPRITE_ROWS > 1 ? (row / (RESOURCE_SPRITE_ROWS - 1)) * 100 : 0;
    element.style.backgroundImage = `url("${resourceSprites[themeMode.value][type]}")`;
    element.style.backgroundPosition = `${x}% ${y}%`;
  }

  function drawResourceFrames() {
    resourceTypes.forEach(drawResourceFrame);
  }

  function setResourceSprite(type: ResourceCardType, element: unknown) {
    if (!(element instanceof HTMLElement)) return;
    resourceSpriteElements[type] = element;
    if (window.innerWidth >= 1200) drawResourceFrame(type);
  }

  function waitForNextFrame(delay: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, Math.max(0, delay)));
  }

  async function startResourceAnimation(type: ResourceCardType, targetFrame: number) {
    const token = ++animationTokens[type];
    const frameDuration = 1000 / RESOURCE_FRAME_RATE;
    let nextFrameAt = performance.now();

    while (frameIndexes[type] !== targetFrame && token === animationTokens[type]) {
      const direction = targetFrame > frameIndexes[type] ? 1 : -1;
      nextFrameAt += frameDuration;
      await waitForNextFrame(nextFrameAt - performance.now());
      if (token !== animationTokens[type]) return;
      frameIndexes[type] += direction;
      drawResourceFrame(type);
    }
  }

  function playResourceIllustration(type: ResourceCardType) {
    if (!prefersReducedMotion) {
      startResourceAnimation(type, RESOURCE_FRAME_COUNT - 1);
    }
  }

  function reverseResourceIllustration(type: ResourceCardType) {
    if (!prefersReducedMotion) {
      startResourceAnimation(type, 0);
    }
  }

  function updateResourceIllustrationHover(type: ResourceCardType, event: MouseEvent) {
    const card = event.currentTarget;
    if (!(card instanceof HTMLElement)) return;

    const illustration = card.querySelector<HTMLElement>('.resource-card__illustration');
    if (!illustration) return;

    const rect = illustration.getBoundingClientRect();
    const isInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (isInside && hoveredIllustrationType !== type) {
      hoveredIllustrationType = type;
      playResourceIllustration(type);
    } else if (!isInside && hoveredIllustrationType === type) {
      hoveredIllustrationType = undefined;
      reverseResourceIllustration(type);
    }
  }

  function leaveResourceCard(type: ResourceCardType) {
    if (hoveredIllustrationType !== type) return;
    hoveredIllustrationType = undefined;
    reverseResourceIllustration(type);
  }

  watch(themeMode, drawResourceFrames);

  onBeforeUnmount(() => {
    resourceTypes.forEach((type) => {
      animationTokens[type] += 1;
    });
  });

  return {
    drawResourceFrames,
    setResourceSprite,
    updateResourceIllustrationHover,
    leaveResourceCard,
  };
}
