const USAGE_DATA_URL = 'https://tdesign.gtimg.com/site/info/usage-data.json';

export interface UsageData {
  downloadPerMonth: string;
  figmaReferenceCount: string;
  projectsCount: string;
  enterpriseCustomersCount: string;
}

export const fallbackUsageData: UsageData = {
  downloadPerMonth: '100',
  figmaReferenceCount: '2500',
  projectsCount: '8,000',
  enterpriseCustomersCount: '100',
};

let usageDataRequest: Promise<UsageData> | undefined;

function isUsageData(value: unknown): value is UsageData {
  if (!value || typeof value !== 'object') return false;

  const data = value as Record<keyof UsageData, unknown>;
  return (
    typeof data.downloadPerMonth === 'string' &&
    typeof data.figmaReferenceCount === 'string' &&
    typeof data.projectsCount === 'string' &&
    typeof data.enterpriseCustomersCount === 'string'
  );
}

export function getUsageData(): Promise<UsageData> {
  if (!usageDataRequest) {
    usageDataRequest = fetch(USAGE_DATA_URL)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Failed to load usage data: ${response.status}`);

        const result: unknown = await response.json();
        if (!result || typeof result !== 'object' || !isUsageData((result as { data?: unknown }).data)) {
          throw new Error('Invalid usage data');
        }

        return (result as { data: UsageData }).data;
      })
      .catch(() => fallbackUsageData);
  }

  return usageDataRequest;
}
