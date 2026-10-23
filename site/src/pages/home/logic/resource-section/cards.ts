import { computed, type ComputedRef } from 'vue';
import { jumpLocation } from '@tdesign/site-components';

import figmaLogo from '@/assets/figma-logo.svg';
import flutterLogo from '@/assets/flutter-logo.svg';
import miniprogramLogo from '@/assets/miniprogram-logo.svg';
import reactLogo from '@/assets/react-logo.svg';
import uniappLogo from '@/assets/uniapp-logo.svg';
import vueLogo from '@/assets/vue-logo.svg';
import iconLibrary from '../../assets/icon-library.svg';

export type ResourceCardType = 'web' | 'mobile' | 'aigc' | 'icons';

interface ResourceItem {
  name: string;
  logo: string;
  href: string;
  releaseKey: string;
}

export interface ResourceCard {
  type: ResourceCardType;
  label: string;
  title: string;
  description: string;
  items: ResourceItem[];
}

type Translate = (key: string) => string;

export function createResourceCards(t: Translate): ComputedRef<ResourceCard[]> {
  return computed(() => [
    {
      type: 'web',
      label: 'Web Components',
      title: t('home.resources.cards.web.title'),
      description: t('home.resources.cards.web.description'),
      items: [
        { name: 'Vue Next', logo: vueLogo, href: jumpLocation('/vue-next'), releaseKey: 'vue-next' },
        { name: 'React', logo: reactLogo, href: jumpLocation('/react'), releaseKey: 'react-web' },
        { name: 'Vue', logo: vueLogo, href: jumpLocation('/vue'), releaseKey: 'vue2' },
        {
          name: t('home.resources.items.designResources'),
          logo: figmaLogo,
          href: 'https://www.figma.com/community/file/1053279236128724321/tdesign-for-web',
          releaseKey: 'design-web',
        },
      ],
    },
    {
      type: 'mobile',
      label: 'Mobile Components',
      title: t('home.resources.cards.mobile.title'),
      description: t('home.resources.cards.mobile.description'),
      items: [
        {
          name: t('home.resources.items.miniprogram'),
          logo: miniprogramLogo,
          href: jumpLocation('/miniprogram'),
          releaseKey: 'miniprogram',
        },
        {
          name: 'Vue Next',
          logo: vueLogo,
          href: jumpLocation('/mobile-vue'),
          releaseKey: 'vue-mobile',
        },
        {
          name: 'React',
          logo: reactLogo,
          href: jumpLocation('/mobile-react'),
          releaseKey: 'react-mobile',
        },
        { name: 'Uniapp', logo: uniappLogo, href: jumpLocation('/uniapp'), releaseKey: 'uniapp-mobile' },
        { name: 'Flutter', logo: flutterLogo, href: jumpLocation('/flutter'), releaseKey: 'flutter' },
        {
          name: t('home.resources.items.designResources'),
          logo: figmaLogo,
          href: 'https://www.figma.com/community/file/1053279585699097956/tdesign-for-mobile',
          releaseKey: 'design-mobile',
        },
      ],
    },
    {
      type: 'aigc',
      label: 'AIGC Components',
      title: t('home.resources.cards.aigc.title'),
      description: t('home.resources.cards.aigc.description'),
      items: [
        {
          name: 'Vue Next',
          logo: vueLogo,
          href: jumpLocation('/vue-next-chat'),
          releaseKey: 'vue-chat',
        },
        {
          name: 'React',
          logo: reactLogo,
          href: jumpLocation('/react-chat'),
          releaseKey: 'react-chat',
        },
        {
          name: t('home.resources.items.miniprogram'),
          logo: miniprogramLogo,
          href: jumpLocation('/miniprogram-chat'),
          releaseKey: 'miniprogram-chat',
        },
        {
          name: t('home.resources.items.designResources'),
          logo: figmaLogo,
          href: 'https://www.figma.com/community/file/1053279236128724321/tdesign-for-web',
          releaseKey: 'design-aigc',
        },
      ],
    },
    {
      type: 'icons',
      label: 'Icon Library',
      title: t('home.resources.cards.icons.title'),
      description: t('home.resources.cards.icons.description'),
      items: [
        {
          name: t('home.resources.items.iconLibrary'),
          logo: iconLibrary,
          href: jumpLocation('/icons'),
          releaseKey: 'icons',
        },
        {
          name: t('home.resources.items.designResources'),
          logo: figmaLogo,
          href: 'https://www.figma.com/community/file/1543189085651776104/tdesign-icon-svg-file',
          releaseKey: 'design-icons',
        },
      ],
    },
  ]);
}
