import { ecosystemConfigCdn, ecosystemConfigWoaCdn } from '@config';
import { isIntranet } from './index';

export type EcosystemLinkTarget = '_blank' | '_self';

export interface EcosystemItem {
  logoSrc: string;
  name: string;
  description: string;
  url: string;
}

export interface EcosystemCategory {
  categoryTitle: string;
  categoryUrl?: string | null;
  items: EcosystemItem[];
}

export function getEcosystemLinkTarget(url: string): EcosystemLinkTarget {
  return url.includes('tdesign') ? '_self' : '_blank';
}

export async function fetchEcosystemConfig(): Promise<EcosystemCategory[]> {
  const endpoint = isIntranet() ? ecosystemConfigWoaCdn : ecosystemConfigCdn;
  const response = await fetch(endpoint);

  if (!response.ok) throw new Error(`Failed to fetch ecosystem config: ${response.status}`);
  return response.json();
}
