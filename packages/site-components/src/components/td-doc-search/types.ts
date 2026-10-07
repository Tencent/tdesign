export const HIERARCHY_LEVELS = ['lvl0', 'lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'] as const;

export type HierarchyLevel = (typeof HIERARCHY_LEVELS)[number];

export type Hierarchy = Partial<Record<HierarchyLevel, string>>;

export interface AlgoliaMatch {
  value?: string;
}

export interface AlgoliaHighlightResult {
  hierarchy?: Partial<Record<HierarchyLevel, AlgoliaMatch>>;
  content?: AlgoliaMatch;
}

export interface FormattedHit {
  title: string;
  subtitle: string;
  breadcrumb: string;
  snippet: string;
  url: string;
  type?: string;
}

export interface AlgoliaHit {
  hierarchy?: Hierarchy;
  content?: string;
  anchor?: string;
  url?: string;
  type?: string;
  _highlightResult?: AlgoliaHighlightResult;
  _snippetResult?: AlgoliaHighlightResult;
  __formatted?: FormattedHit;
}

export interface AlgoliaSearchResponse {
  hits?: AlgoliaHit[];
}

export interface HitGroup {
  key: string;
  title: string;
  items: AlgoliaHit[];
}

export interface DisplayHit {
  url: string;
  title: string;
  subtitle?: string;
  breadcrumb: string;
}

export interface RecentItem {
  query: string;
  url: string;
  title: string;
  breadcrumb: string;
  ts: number;
}

export interface RecentInput {
  query: string;
  url: string;
  title: string;
  breadcrumb: string;
}

export interface SearchOptions {
  query?: string;
  signal?: AbortSignal;
  appId?: string;
  apiKey?: string;
  indexName?: string;
  urlFilter?: string;
  hitsPerPage?: number;
}

export interface ViewState {
  query: string;
  loading: boolean;
  groups: HitGroup[];
  recent: RecentItem[];
}

export interface Props {
  appId: string;
  apiKey: string;
  indexName: string;
  urlFilter: string;
  hitsPerPage: number;
  placeholder: string;
  recentTitle: string;
  emptyTitle: string;
  emptyDesc: string;
  noResultTitle: string;
  noResultDesc: string;
  loadingTitle: string;
  loadingDesc: string;
  removeLabel: string;
  dialogLabel: string;
  categoryLabel: string;
  resultLabel: string;
  _query: string;
  _loading: boolean;
  _groups: HitGroup[];
  _activeKey: string | null;
  _flatHits: DisplayHit[];
  _currentIndex: number;
  _recent: RecentItem[];
  _debounceTimer: ReturnType<typeof setTimeout> | null;
  _abort: AbortController | null;
  open: boolean;
}

export type DocSearchHost = Props & HTMLElement;

export type SearchInputEvent = InputEvent & { target: HTMLInputElement };

export interface ViewHandlers {
  onTriggerFocus(host: DocSearchHost): void;
  onTriggerInput(host: DocSearchHost, event: SearchInputEvent): void;
  onTriggerKeyDown(host: DocSearchHost, event: KeyboardEvent): void;
  onHitClick(host: DocSearchHost, hit: DisplayHit, event: MouseEvent): void;
  onCategoryClick(host: DocSearchHost, key: string, event: MouseEvent): void;
  onRemoveRecent(host: DocSearchHost, url: string, event: MouseEvent): void;
}

export interface HitRenderOptions {
  showRemove?: boolean;
  highlight?: boolean;
}
