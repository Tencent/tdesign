import { HOME_API_ENDPOINTS } from './api';

export interface MonthlyDownload {
  month: string;
  totalDownloads: number;
}

export interface UsageData {
  downloadPerMonth: string;
  figmaReferenceCount: string;
  projectsCount: string;
  enterpriseCustomersCount: string;
  downloadsPerMonth: MonthlyDownload[];
}

export const fallbackUsageData: UsageData = {
  downloadPerMonth: '100',
  figmaReferenceCount: '2500',
  projectsCount: '8,000',
  enterpriseCustomersCount: '100',
  downloadsPerMonth: [],
};

let usageDataRequest: Promise<UsageData> | undefined;

function isUsageData(value: unknown): value is UsageData {
  if (!value || typeof value !== 'object') return false;

  const data = value as Record<keyof UsageData, unknown>;
  const hasValidDownloads =
    Array.isArray(data.downloadsPerMonth) &&
    data.downloadsPerMonth.every((item) => {
      if (!item || typeof item !== 'object') return false;
      const download = item as Record<string, unknown>;
      return typeof download.month === 'string' && typeof download.totalDownloads === 'number';
    });

  return (
    typeof data.downloadPerMonth === 'string' &&
    typeof data.figmaReferenceCount === 'string' &&
    typeof data.projectsCount === 'string' &&
    typeof data.enterpriseCustomersCount === 'string' &&
    hasValidDownloads
  );
}

export function getUsageData(): Promise<UsageData> {
  if (!usageDataRequest) {
    usageDataRequest = fetch(HOME_API_ENDPOINTS.usageData)
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
