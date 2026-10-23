// 官网静态数据接口基础地址。
const SITE_INFO_BASE_URL = 'https://tdesign.gtimg.com/site/info';
// GitHub 贡献者及版本发布数据接口基础地址。
const COMMUNITY_RELEASE_BASE_URL =
  'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors';
// 首页云函数接口基础地址。
const CLOUD_FUNCTION_BASE_URL = 'https://1257786608-faj515jw5t-hk.scf.tencentcs.com';
// 用已有的内网图片服务探测当前网络是否可访问 WOA。
const WOA_REACHABILITY_URL = 'https://dayu.woa.com/avatars/tdesign/profile.jpg';

export async function canAccessWoa(timeout = 1500): Promise<boolean> {
  if (location.hostname === 'woa.com' || location.hostname.endsWith('.woa.com')) return true;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);

  try {
    await fetch(`${WOA_REACHABILITY_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      mode: 'no-cors',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const HOME_API_ENDPOINTS = {
  // 首页新闻列表。
  news: `${CLOUD_FUNCTION_BASE_URL}/news`,
  // 共建社区的实时动态及统计数据。
  communityActivity: `${CLOUD_FUNCTION_BASE_URL}/github/tdesign-activity`,
  // 共建社区的贡献者名单。
  contributors: `${COMMUNITY_RELEASE_BASE_URL}/list`,
  // 各技术栈组件库的最新发布时间。
  releases: `${COMMUNITY_RELEASE_BASE_URL}/release`,
  // 行业案例展示的品牌名单。
  brandList: `${SITE_INFO_BASE_URL}/brand-list.json`,
  // 业务案例中的开发者故事。
  developerStories: `${SITE_INFO_BASE_URL}/developer-stories.json`,
  // 下载量、项目数等首页使用数据。
  usageData: `${SITE_INFO_BASE_URL}/usage-data.json`,
} as const;
