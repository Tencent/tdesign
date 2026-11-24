import type { TdTagProps } from 'tdesign-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { HOME_API_ENDPOINTS } from '../../services/api';

export type DeveloperUserType = 'contributor' | 'community' | 'enterprise';

interface DeveloperStory {
  content: string;
  nickname: string;
  position: string;
  avatar: string;
  scene: string;
  userType: DeveloperUserType;
}

export interface BusinessCase extends DeveloperStory {
  theme: TdTagProps['theme'];
  variant: TdTagProps['variant'];
  spreadX: number;
  spreadY: number;
  rotation: number;
}

type BusinessCaseLayout = Pick<BusinessCase, 'theme' | 'variant' | 'spreadX' | 'spreadY' | 'rotation'>;

export const userTypeLabels: Record<DeveloperUserType, string> = {
  contributor: '贡献者',
  community: '社区用户',
  enterprise: '企业用户',
};

const caseLayouts: BusinessCaseLayout[] = [
  { theme: 'default', variant: 'light-outline', spreadX: 488, spreadY: 141, rotation: -7 },
  { theme: 'primary', variant: 'light', spreadX: 527, spreadY: -172, rotation: -5 },
  { theme: 'warning', variant: 'light', spreadX: -505, spreadY: -151, rotation: 6 },
  { theme: 'primary', variant: 'light', spreadX: -486, spreadY: 137, rotation: 6 },
  { theme: 'default', variant: 'light-outline', spreadX: 21, spreadY: -319, rotation: -4 },
];

function isDeveloperStory(value: unknown): value is DeveloperStory {
  if (!value || typeof value !== 'object') return false;

  const story = value as Record<string, unknown>;
  const hasRequiredText = ['content', 'nickname', 'position', 'avatar', 'scene'].every(
    (key) => typeof story[key] === 'string',
  );
  return hasRequiredText && ['contributor', 'community', 'enterprise'].includes(story.userType as string);
}

export function createBusinessCasesData() {
  const cases = ref<BusinessCase[]>([]);
  const controller = new AbortController();

  async function loadDeveloperStories(): Promise<void> {
    try {
      const response = await fetch(HOME_API_ENDPOINTS.developerStories, { signal: controller.signal });
      if (!response.ok) return;

      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !Array.isArray((result as { data?: unknown }).data)) return;

      cases.value = (result as { data: unknown[] }).data
        .filter(isDeveloperStory)
        .slice(0, caseLayouts.length)
        .map((story, index) => ({ ...story, ...caseLayouts[index] }));
    } catch {
      if (!controller.signal.aborted) cases.value = [];
    }
  }

  onMounted(loadDeveloperStories);
  onBeforeUnmount(() => controller.abort());

  return { cases };
}
