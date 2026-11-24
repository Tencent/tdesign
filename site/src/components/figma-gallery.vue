<template>
  <section class="gallery">
    <div v-if="loadStatus === 'loading'" class="gallery__placeholder">
      <t-loading size="small" :text="t('figmaGallery.loading')" />
    </div>
    <div v-else-if="loadStatus === 'error'" class="gallery__placeholder">
      <t-empty type="fail" :title="t('figmaGallery.loadFailed')" :description="errorMessage">
        <template #action>
          <t-button size="small" @click="loadManifest">{{ t('figmaGallery.retry') }}</t-button>
        </template>
      </t-empty>
    </div>
    <div v-else-if="!pages.length" class="gallery__placeholder">
      <t-empty :title="t('figmaGallery.emptyPages')" />
    </div>

    <div v-else class="gallery__body" :class="{ 'gallery__body--collapsed': sidebarCollapsed }">
      <!-- v-show：收起后保留树的展开状态和搜索词；Transition：收起 / 展开时从左上角的展开按钮处缩放 -->
      <Transition name="gallery-sidebar">
        <nav v-show="!sidebarCollapsed" class="gallery__sidebar" :aria-label="t('figmaGallery.pageList')">
          <t-input
            v-model="keyword"
            class="gallery__search"
            size="small"
            :placeholder="t('figmaGallery.searchPlaceholder')"
            clearable
          >
            <template #prefix-icon><SearchIcon /></template>
          </t-input>
          <div class="gallery__tree-head">
            <span>{{ t('figmaGallery.all') }}</span>
            <span class="gallery__count">{{
              searchText ? `${matchedPageCount} / ${pages.length}` : pages.length
            }}</span>
            <t-tooltip :content="t('figmaGallery.collapseSidebar')">
              <t-button
                class="gallery__fold"
                shape="square"
                variant="text"
                size="small"
                :aria-label="t('figmaGallery.collapseSidebar')"
                @click="sidebarCollapsed = true"
              >
                <template #icon><MenuFoldIcon /></template>
              </t-button>
            </t-tooltip>
          </div>

          <t-tree
            class="gallery__tree narrow-scrollbar"
            :data="treeData"
            :expanded="expandedKeys"
            :actived="highlightedKeys"
            activable
            hover
            :empty="t('figmaGallery.noMatchedPages')"
            @expand="onTreeExpand"
            @click="onTreeClick"
          >
            <template #label="{ node }">
              <span
                class="gallery__node"
                :class="{ 'gallery__node--current': isCurrentNode(node.data) }"
                :title="node.label"
              >
                <component :is="nodeIcon(node.data)" class="gallery__node-icon" />
                <span class="gallery__node-name">{{ node.label }}</span>
              </span>
            </template>
          </t-tree>
        </nav>
      </Transition>

      <div v-if="activePage" class="gallery__stage">
        <!-- 目录收起后悬浮在画布左上角，点击展开 -->
        <t-tooltip v-if="sidebarCollapsed" :content="t('figmaGallery.expandSidebar')" placement="right">
          <t-button class="gallery__unfold" variant="outline" size="small" @click="sidebarCollapsed = false">
            <template #icon><MenuUnfoldIcon /></template>
            <span class="gallery__unfold-name">{{ activePage.label }}</span>
          </t-button>
        </t-tooltip>
        <!-- narrow-scrollbar：TDesign 全局的细滚动条样式（tdesign-common _global.less） -->
        <div ref="canvasRef" class="gallery__canvas narrow-scrollbar">
          <div ref="artboardRef" class="gallery__artboard" :style="artboardStyle" @click="onPointerClick">
            <!-- 每个顶层图层一块，进入可视区才请求；SVG 插入真实 DOM -->
            <div
              v-for="part in parts"
              :key="part.id"
              v-observe-part="part.id"
              class="gallery__part"
              :style="rectStyle(part.box)"
            >
              <div v-if="svgOf(part)" v-mount-element="svgOf(part)" class="gallery__svg" />
              <!-- 缩略图：看整页时先用它；完整图下载完之前垫在下面，下载完再移除 -->
              <img
                v-if="!svgOf(part) && showThumb(part) && !fullRasterReady(part)"
                class="gallery__image"
                :src="part.thumbSrc"
                :alt="part.label"
                decoding="async"
                draggable="false"
                @load="onImageLoad(part.thumbSrc)"
                @error="onImageError(part, part.thumbSrc)"
              />
              <img
                v-if="!svgOf(part) && showFullRaster(part)"
                class="gallery__image gallery__image--full"
                :src="part.src"
                :alt="part.label"
                decoding="async"
                draggable="false"
                @load="onImageLoad(part.src)"
                @error="onImageError(part, part.src)"
              />
              <!-- 没有渲染图（或加载失败）时，用节点树画线框 -->
              <svg
                v-if="!svgOf(part) && needsWireframe(part) && treeOf(part)"
                class="gallery__wireframe"
                :viewBox="`${part.box.x} ${part.box.y} ${part.box.w} ${part.box.h}`"
                preserveAspectRatio="none"
              >
                <rect
                  v-for="node in wireNodes(treeOf(part))"
                  :key="node.id"
                  :x="node.x"
                  :y="node.y"
                  :width="node.w"
                  :height="node.h"
                  :class="`gallery__wire gallery__wire--${node.type === 'TEXT' ? 'text' : 'box'}`"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
              <!-- 还没进入可视区 / 要显示的内容还没下载完：骨架屏占位 -->
              <t-skeleton
                v-if="!partPainted(part)"
                class="gallery__skeleton"
                animation="gradient"
                :row-col="SKELETON_ROW_COL"
              />
            </div>
            <div v-if="selectedNode" class="gallery__box" :style="rectStyle(selectedNode)">
              <span class="gallery__box-label">{{ selectedNode.name }}</span>
              <span class="gallery__box-size"
                >{{ formatNumber(selectedNode.w) }} × {{ formatNumber(selectedNode.h) }}</span
              >
            </div>
          </div>
        </div>

        <aside
          v-if="inspectorKind"
          class="gallery__inspector narrow-scrollbar"
          :aria-label="t('figmaGallery.inspector.label')"
        >
          <div class="gallery__inspector-head">
            <span class="gallery__inspector-name" :title="componentName">{{ componentName }}</span>
            <t-tooltip :content="t('figmaGallery.inspector.deselect')">
              <t-button shape="square" variant="text" size="small" @click="selectedId = ''">
                <template #icon><CloseIcon /></template>
              </t-button>
            </t-tooltip>
          </div>

          <template v-for="group in inspectorGroups" :key="group.key">
            <div class="gallery__props-title">{{ group.title }}</div>
            <t-descriptions
              class="gallery__props"
              :column="1"
              size="small"
              :colon="false"
              :label-style="{ width: group.labelWidth }"
            >
              <t-descriptions-item v-for="row in group.rows" :key="row.key" :label="row.label">
                <span v-if="row.colors" class="gallery__colors">
                  <span v-for="(color, i) in row.colors" :key="i" class="gallery__color">
                    <i v-if="color.startsWith('#')" class="gallery__swatch" :style="{ background: color }" />{{ color }}
                  </span>
                </span>
                <span v-else>{{ row.value }}</span>
              </t-descriptions-item>
            </t-descriptions>
          </template>

          <div class="gallery__inspector-actions">
            <t-button
              v-if="inspectorKind === 'icon'"
              variant="text"
              theme="primary"
              size="small"
              @click="copyText(componentName, t('figmaGallery.copiedName'))"
            >
              <template #icon><CopyIcon /></template>
              {{ t('figmaGallery.copyName') }}
            </t-button>
            <t-button
              variant="text"
              theme="primary"
              size="small"
              @click="copyText(figmaNodeUrl(selectedNode.id), t('figmaGallery.copiedLink'))"
            >
              <template #icon><LinkIcon /></template>
              {{ t('figmaGallery.copyLink') }}
            </t-button>
            <t-link
              theme="primary"
              size="small"
              hover="color"
              :href="figmaNodeUrl(selectedNode.id)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Figma
              <template #suffix-icon><JumpIcon /></template>
            </t-link>
          </div>
        </aside>

        <!-- 缩放控件悬浮在画布右下角 -->
        <div class="gallery__zoom">
          <t-tooltip :content="t('figmaGallery.zoomOut')">
            <t-button shape="square" variant="text" size="small" @click="stepZoom(-1)">
              <template #icon><ZoomOutIcon /></template>
            </t-button>
          </t-tooltip>
          <span class="gallery__zoom-value">{{ zoomText }}</span>
          <t-tooltip :content="t('figmaGallery.zoomIn')">
            <t-button shape="square" variant="text" size="small" @click="stepZoom(1)">
              <template #icon><ZoomInIcon /></template>
            </t-button>
          </t-tooltip>
          <t-button variant="text" size="small" :disabled="zoom === 'fit'" @click="zoom = 'fit'">{{
            t('figmaGallery.fitCanvas')
          }}</t-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowReactive, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  CloseIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  JumpIcon,
  LinkIcon,
  MenuFoldIcon,
  MenuUnfoldIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'tdesign-icons-vue-next';

import messages from '@/locales/components/figma-gallery';

const props = defineProps({
  /** manifest.json 地址；开发时由 Vite 从 client/public 映射 */
  manifestUrl: { type: String, default: '/figma-assets/web/manifest.json' },
  /** Figma 文件类型，用于拼接跳转 Figma 的链接 */
  fileType: { type: String, default: 'design' },
  /** 默认打开的页面：页面 id，或页面名（忽略大小写的包含匹配）；找不到时打开第一页 */
  defaultPage: { type: String, default: '' },
  /** 图标资源：点击时选中单个图标，并展示只有名称和操作的信息浮层 */
  iconMode: { type: Boolean, default: false },
});

const { t } = useI18n({ messages });

/** 缩放档位，100% = 设计稿 1:1 */
const ZOOM_STEPS = [0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2];
const MAX_WIREFRAME_NODES = 4000;
/** 图层块进入画布可视区前多少像素就开始加载 */
const PRELOAD_MARGIN = '200px';
/** 图层块骨架屏：一整块铺满 */
const SKELETON_ROW_COL = [{ type: 'rect', width: '100%', height: '100%' }];
/** 下载脚本按顶层图层拆分后的 manifest 版本 */
const MANIFEST_SCHEMA = 2;
/** manifest 加载失败时提示运行的下载命令 */
const DOWNLOAD_COMMAND = 'npm run download:figma -- --all-pages --format svg';

const loadStatus = ref('loading');
/** manifest 加载失败的原因：{ key, params } 为本地化文案，{ raw } 为原始错误信息；切换语言时提示跟着更新 */
const loadError = ref(null);
const errorMessage = computed(() => {
  const error = loadError.value;
  if (!error) return '';
  return t('figmaGallery.errors.hint', {
    reason: error.key ? t(error.key, error.params ?? {}) : error.raw,
    command: `${DOWNLOAD_COMMAND} <${t('figmaGallery.figmaLink')}>`,
  });
});
const manifest = ref(null);
const keyword = ref('');
/** 左侧目录收起：收起后只在画布左上角悬浮一个展开按钮；默认收起 */
const sidebarCollapsed = ref(true);
const activeId = ref('');

const canvasRef = ref(null);
const artboardRef = ref(null);
const viewport = ref({ width: 0, height: 0 });
const zoom = ref('fit');

const selectedId = ref('');

/**
 * 资源地址 → { status: 'loading' | 'ready' | 'error', value? }。
 * 只有进入可视区 / 被点开 / 被点击的图层块才会请求；切页再切回来直接复用。
 * shallowReactive：值本身（DOM、上万节点的树）不做深层响应式
 */
const assets = shallowReactive(new Map());
/** 资源地址 → Promise，合并重复请求 */
const assetRequests = new Map();
/** 当前页已经需要显示的图层块 id（进入过可视区或被点开） */
const wantedParts = ref(new Set());
/** 已请求完整渲染图的图层块 id（用于位图显示）；fullRequested 按地址去重，不参与响应式 */
const fullParts = ref(new Set());
const fullRequested = new Set();
/** 点在节点树还没加载的图层块上：先选中整块，加载完再按点击位置精确命中 */
const pendingPick = ref(null);

function cleanName(name) {
  return String(name ?? '').trim() || t('figmaGallery.untitled');
}

const manifestBase = computed(() => props.manifestUrl.slice(0, props.manifestUrl.lastIndexOf('/') + 1));

/** manifest 与资源在同一目录；配置了 CDN 时用完整地址 */
function assetUrl(file, url) {
  if (url) return url;
  return file ? `${manifestBase.value}${file}` : '';
}

function isSvgSrc(src) {
  return /\.svg(?:[?#]|$)/i.test(src);
}

const pages = computed(() =>
  (manifest.value?.pages ?? []).map((page) => ({
    ...page,
    label: cleanName(page.name),
    groupName: page.group ? cleanName(page.group) : '',
    frames: (Array.isArray(page.frames) ? page.frames : []).map((frame) => {
      const src = assetUrl(frame.file, frame.url);
      return {
        ...frame,
        label: cleanName(frame.name),
        src,
        thumbSrc: assetUrl(frame.thumb, frame.thumbUrl),
        treeSrc: assetUrl(frame.tree, frame.treeUrl),
        isSvg: isSvgSrc(src),
      };
    }),
  })),
);

const activePage = computed(() => pages.value.find((page) => page.id === activeId.value) ?? pages.value[0]);

/** 当前页的图层块（顶层画板 / 组件），各自有渲染图和节点树，坐标都相对整个 page */
const parts = computed(() => activePage.value?.frames ?? []);

/** 画板尺寸（page 坐标）：始终展示整页，图层块坐标都相对 page 左上角 */
const pageSize = computed(() => {
  const bounds = activePage.value?.bounds;
  return bounds?.width && bounds?.height ? { w: bounds.width, h: bounds.height } : null;
});

// ---------- 侧栏目录（t-tree）：分组 → 页面，只到组件页面这一级 ----------

const groupKey = (group) => `g:${group}`;
const pageKey = (pageId) => `p:${pageId}`;

/** 展开的分组 value，t-tree 受控 */
const expandedKeys = ref([]);

/** 按 Figma 原有顺序分段：无分组的页面单独成段，同名分组合并 */
const pageSections = computed(() => {
  const sections = [];
  const byGroup = new Map();
  for (const page of pages.value) {
    if (!page.groupName) {
      sections.push({ group: '', pages: [page] });
      continue;
    }
    let section = byGroup.get(page.groupName);
    if (!section) {
      section = { group: page.groupName, pages: [] };
      byGroup.set(page.groupName, section);
      sections.push(section);
    }
    section.pages.push(page);
  }
  return sections;
});

const searchText = computed(() => keyword.value.trim().toLowerCase());

/** 搜索命中的页面 id（按页面名 / id / 分组名匹配）；未搜索时为 null */
const searchResult = computed(() => {
  const text = searchText.value;
  if (!text) return null;
  const result = new Set();
  for (const page of pages.value) {
    if (`${page.label} ${page.id} ${page.groupName}`.toLowerCase().includes(text)) result.add(page.id);
  }
  return result;
});

const matchedPageCount = computed(() => searchResult.value?.size ?? pages.value.length);

/** t-tree 数据；只随 manifest 和搜索变化，点击 / 展开不会重建 */
const treeData = computed(() => {
  const search = searchResult.value;
  const nodes = [];
  for (const section of pageSections.value) {
    const children = section.pages
      .filter((page) => !search || search.has(page.id))
      .map((page) => ({ value: pageKey(page.id), label: page.label, kind: 'page', pageId: page.id }));
    if (!section.group) {
      nodes.push(...children);
      continue;
    }
    if (!children.length) continue;
    nodes.push({
      value: groupKey(section.group),
      label: section.group,
      kind: 'group',
      pageIds: children.map((child) => child.pageId),
      children,
    });
  }
  return nodes;
});

const activeKey = computed(() => (activePage.value ? pageKey(activePage.value.id) : ''));

/**
 * 高亮的节点。t-tree 点击时会先改内部状态（再次点击会取消高亮、点分组也会高亮分组），
 * 所以每次点击后都重新赋一个新数组，让它按当前页面同步回来
 */
const highlightedKeys = ref([]);
function syncHighlighted() {
  highlightedKeys.value = activeKey.value ? [activeKey.value] : [];
}
watch(activeKey, syncHighlighted, { immediate: true });

function setExpanded(key, expanded) {
  const has = expandedKeys.value.includes(key);
  if (expanded && !has) expandedKeys.value = [...expandedKeys.value, key];
  else if (!expanded && has) expandedKeys.value = expandedKeys.value.filter((item) => item !== key);
}

function onTreeExpand(keys) {
  expandedKeys.value = keys;
}

/** 点分组：展开 / 收起；点页面：切换到该页面（页面内的图层块进入可视区才加载） */
function onTreeClick({ node }) {
  const { data } = node;
  if (data.kind === 'group') {
    setExpanded(data.value, !expandedKeys.value.includes(data.value));
  } else {
    activeId.value = data.pageId;
    selectedId.value = '';
  }
  syncHighlighted();
}

/** 当前页加粗；收起的分组里有当前页时，分组也加粗提示 */
function isCurrentNode(data) {
  const id = activePage.value?.id;
  if (data.kind === 'page') return data.pageId === id;
  return !expandedKeys.value.includes(data.value) && data.pageIds.includes(id);
}

function nodeIcon(data) {
  if (data.kind === 'page') return FileIcon;
  return expandedKeys.value.includes(data.value) ? FolderOpenIcon : FolderIcon;
}

/** 搜索时自动展开命中的分组；清空搜索后恢复原来的展开状态 */
let expandedBeforeSearch = null;
watch(searchResult, (result) => {
  if (!result) {
    if (expandedBeforeSearch) {
      expandedKeys.value = expandedBeforeSearch;
      expandedBeforeSearch = null;
    }
    revealActivePage();
    return;
  }
  expandedBeforeSearch ??= [...expandedKeys.value];
  const keys = new Set();
  for (const page of pages.value) {
    if (result.has(page.id) && page.groupName) keys.add(groupKey(page.groupName));
  }
  expandedKeys.value = [...keys];
});

/** 当前页所在分组保持展开 */
function revealActivePage() {
  const page = activePage.value;
  if (!page || searchResult.value) return;
  if (page.groupName) setExpanded(groupKey(page.groupName), true);
}

function figmaNodeUrl(nodeId) {
  const fileKey = manifest.value?.fileKey;
  if (!fileKey) return 'https://www.figma.com';
  return `https://www.figma.com/${props.fileType}/${fileKey}?node-id=${encodeURIComponent(
    nodeId.replaceAll(':', '-'),
  )}`;
}

function formatNumber(value) {
  return typeof value === 'number' ? Math.round(value * 100) / 100 : '-';
}

// ---------- 按需加载图层块 ----------

function requestAsset(src, parse) {
  if (!src) return Promise.resolve(null);
  if (!assetRequests.has(src)) {
    assets.set(src, { status: 'loading' });
    const request = fetch(src)
      .then(async (response) => {
        if (!response.ok) throw new Error(t('figmaGallery.errors.http', { status: response.status }));
        return parse(response);
      })
      .then(
        (value) => {
          assets.set(src, { status: 'ready', value });
          return value;
        },
        () => {
          assets.set(src, { status: 'error' });
          return null;
        },
      );
    assetRequests.set(src, request);
  }
  return assetRequests.get(src);
}

function assetStatus(src) {
  return src ? assets.get(src)?.status ?? 'none' : 'none';
}

function loadPartTree(part) {
  return requestAsset(part.treeSrc, async (response) => indexTree(await response.json()));
}

function svgOf(part) {
  const state = part.isSvg ? assets.get(part.src) : null;
  return state?.status === 'ready' ? state.value : null;
}

function treeOf(part) {
  const state = assets.get(part.treeSrc);
  return state?.status === 'ready' ? state.value : null;
}

/** 完整渲染图和缩略图都没有（或都加载失败）时，用节点树画线框 */
function needsWireframe(part) {
  const fullMissing = !part.src || assetStatus(part.src) === 'error';
  const thumbMissing = !part.thumbSrc || assetStatus(part.thumbSrc) === 'error';
  return fullMissing && thumbMissing;
}

function showFullRaster(part) {
  return !part.isSvg && Boolean(part.src) && fullParts.value.has(part.id) && assetStatus(part.src) !== 'error';
}

function showThumb(part) {
  return Boolean(part.thumbSrc) && wantedParts.value.has(part.id) && assetStatus(part.thumbSrc) !== 'error';
}

/** 完整位图已下载完（img 触发了 load），可以移除垫在下面的缩略图 */
function fullRasterReady(part) {
  return showFullRaster(part) && assetStatus(part.src) === 'ready';
}

/** 图层块上已有下载完的内容可看；否则显示骨架屏 */
function partPainted(part) {
  if (svgOf(part) || fullRasterReady(part)) return true;
  if (showThumb(part) && assetStatus(part.thumbSrc) === 'ready') return true;
  return Boolean(needsWireframe(part) && treeOf(part));
}

/** 图层块进入了可视区：先显示缩略图；完整图是否加载由 needsFull 决定 */
function wantPart(part) {
  if (!part || wantedParts.value.has(part.id)) return;
  wantedParts.value.add(part.id);
  if (needsWireframe(part)) loadPartTree(part);
}

/** 请求完整渲染图（SVG / 位图）；同一地址只请求一次 */
function requestFull(part) {
  if (!part.src || fullRequested.has(part.src)) return;
  fullRequested.add(part.src);
  fullParts.value.add(part.id);
  if (part.isSvg) {
    requestAsset(part.src, async (response) => parseSvg(await response.text())).then((svg) => {
      if (!svg && needsWireframe(part)) loadPartTree(part);
    });
  }
}

function onImageLoad(src) {
  assets.set(src, { status: 'ready' });
}

function onImageError(part, src) {
  assets.set(src, { status: 'error' });
  if (needsWireframe(part)) loadPartTree(part);
}

/** 图层块进入画布可视区（含预加载边距）才加载；以画布为 root，画布重建时跟着换 */
let partObserver = null;

function observerFor(element) {
  if (typeof IntersectionObserver === 'undefined') return null;
  const root = element.closest('.gallery__canvas');
  if (partObserver?.root !== root) {
    partObserver?.disconnect();
    partObserver = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue;
          wantPart(parts.value.find((part) => part.id === record.target.dataset.partId));
        }
      },
      { root, rootMargin: PRELOAD_MARGIN },
    );
  }
  return partObserver;
}

const vObservePart = {
  mounted(element, { value }) {
    element.dataset.partId = value;
    const observer = observerFor(element);
    if (observer) observer.observe(element);
    else wantPart(parts.value.find((part) => part.id === value));
  },
  unmounted(element) {
    partObserver?.unobserve(element);
  },
};

/** 把已解析的 SVG 元素挂进容器；同一个元素只能有一个父节点，切页再回来会被移回新容器 */
const vMountElement = {
  mounted(element, { value }) {
    if (value) element.replaceChildren(value);
  },
  updated(element, { value, oldValue }) {
    if (value !== oldValue) element.replaceChildren(...(value ? [value] : []));
  },
};

// ---------- 节点树与选中 ----------

function indexTree(data) {
  const nodeMap = new Map();
  const parentMap = new Map();
  const stack = [data.root];
  while (stack.length) {
    const node = stack.pop();
    nodeMap.set(node.id, node);
    for (const child of node.children ?? []) {
      parentMap.set(child.id, node);
      stack.push(child);
    }
  }
  return { root: data.root, nodeMap, parentMap, wire: null };
}

/** 线框只画前 MAX_WIREFRAME_NODES 个节点（按层级广度优先），超大图层也能流畅渲染 */
function wireNodes(tree) {
  if (!tree) return [];
  if (!tree.wire) {
    const result = [];
    const queue = [tree.root];
    for (let i = 0; i < queue.length && result.length < MAX_WIREFRAME_NODES; i++) {
      const node = queue[i];
      if (node.w > 0 && node.h > 0) result.push(node);
      if (node.children) queue.push(...node.children);
    }
    tree.wire = result;
  }
  return tree.wire;
}

/** 找到节点所在的图层块；节点树还没加载时，图层块本身用 manifest 里的信息顶上 */
function locateNode(id) {
  for (const part of parts.value) {
    const tree = treeOf(part);
    const node = tree?.nodeMap.get(id);
    if (node) return { part, tree, node };
  }
  const part = parts.value.find((item) => item.id === id);
  if (!part) return null;
  const { name, type, x, y, w, h } = part;
  return { part, tree: null, node: { id, name, type, x, y, w, h } };
}

const selected = computed(() => (selectedId.value ? locateNode(selectedId.value) : null));
const selectedNode = computed(() => selected.value?.node ?? null);

/** 检查器标题：组件名。变体（COMPONENT）的名字是变体属性串，取所在组件集的名字（如「Button 按钮」） */
const componentName = computed(() => {
  const node = selectedNode.value;
  if (!node) return '';
  const parent = selected.value?.tree?.parentMap.get(node.id);
  return node.type === 'COMPONENT' && parent?.type === 'COMPONENT_SET' ? parent.name : node.name;
});

/** 「variant 类型=base 基础, size 尺寸=medium 中尺寸」→ [[key, value], …]；不是变体时返回空数组 */
function parseVariant(text) {
  if (!text?.includes('=')) return [];
  return text
    .split(/,\s*/)
    .map((pair) => pair.split('='))
    .filter((pair) => pair.length === 2 && pair[0].trim())
    .map(([key, value]) => [key.trim(), value.trim()]);
}

/** 组件内所有文字图层用到的颜色（去重） */
function textColors(node) {
  const colors = new Set();
  const stack = [...(node.children ?? [])];
  while (stack.length) {
    const child = stack.pop();
    if (child.type === 'TEXT') child.fills?.forEach((color) => colors.add(color));
    if (child.children) stack.push(...child.children);
  }
  return [...colors];
}

/** 检查器的样式属性：尺寸、填充、文字颜色、圆角；colors 行渲染色块 */
const styleRows = computed(() => {
  const node = selectedNode.value;
  if (!node) return [];
  const rows = [
    {
      key: 'size',
      label: t('figmaGallery.inspector.size'),
      value: `${formatNumber(node.w)} × ${formatNumber(node.h)}`,
    },
  ];
  if (node.fills?.length) rows.push({ key: 'fills', label: t('figmaGallery.inspector.fills'), colors: node.fills });
  const texts = textColors(node);
  if (texts.length) rows.push({ key: 'text-color', label: t('figmaGallery.inspector.textColor'), colors: texts });
  if (node.radius !== undefined) {
    rows.push({
      key: 'radius',
      label: t('figmaGallery.inspector.radius'),
      value: Array.isArray(node.radius) ? node.radius.join(' / ') : String(node.radius),
    });
  }
  return rows;
});

/** 检查器的变体属性（variant、size …）：实例取所用变体，变体取自身名字 */
const variantRows = computed(() => {
  const node = selectedNode.value;
  if (!node) return [];
  const source = node.type === 'INSTANCE' ? node.component : node.name;
  return parseVariant(source).map(([key, value]) => ({
    key: `variant-${key}`,
    // Figma 用「⬑」标记依赖上一个属性的子属性，展示时去掉
    label: key.replace(/^⬑\s*/, ''),
    value,
  }));
});

/** 检查器分组；没有变体属性时不显示该分组；单个图标只展示名称和操作 */
const inspectorGroups = computed(() => {
  if (inspectorKind.value === 'icon') return [];
  const groups = [
    { key: 'style', title: t('figmaGallery.inspector.style'), rows: styleRows.value, labelWidth: '64px' },
    { key: 'variant', title: t('figmaGallery.inspector.variant'), rows: variantRows.value, labelWidth: '128px' },
  ];
  return groups.filter((group) => group.rows.length);
});

/** 取点击位置最上层、最深的节点；clip 的容器外部不可命中其子节点 */
function hitTest(node, x, y) {
  const inside = node.w !== undefined && x >= node.x && x <= node.x + node.w && y >= node.y && y <= node.y + node.h;
  if (node.clip && !inside) return null;
  const children = node.children;
  if (children) {
    for (let i = children.length - 1; i >= 0; i--) {
      const hit = hitTest(children[i], x, y);
      if (hit) return hit;
    }
  }
  return inside ? node : null;
}

/** 只有组件（COMPONENT）和组件实例（INSTANCE）出现信息浮层；其他节点只显示选中框 */
function isComponentNode(node) {
  return node?.type === 'INSTANCE' || node?.type === 'COMPONENT';
}

const ICON_CONTAINER_TYPES = new Set(['FRAME', 'COMPONENT', 'INSTANCE', 'GROUP']);
const ICON_SHAPE_TYPES = new Set([
  'VECTOR',
  'BOOLEAN_OPERATION',
  'ELLIPSE',
  'RECTANGLE',
  'LINE',
  'STAR',
  'REGULAR_POLYGON',
  'GROUP',
]);
/** 图标最大边长；图标资源里的图标都是 24 × 24 */
const ICON_MAX_SIZE = 64;

/** 单个图标：尺寸不大、内部只有矢量图形的容器（图标资源里每个图标是一个 24 × 24 的 FRAME） */
function isIconNode(node) {
  if (!node || !ICON_CONTAINER_TYPES.has(node.type) || !node.children?.length) return false;
  if (node.w > ICON_MAX_SIZE || node.h > ICON_MAX_SIZE) return false;
  const stack = [...node.children];
  while (stack.length) {
    const child = stack.pop();
    if (!ICON_SHAPE_TYPES.has(child.type)) return false;
    if (child.children) stack.push(...child.children);
  }
  return true;
}

/** 信息浮层类型：'icon'（图标资源里的单个图标）、'component'，或不显示 */
const inspectorKind = computed(() => {
  const node = selectedNode.value;
  if (props.iconMode && isIconNode(node)) return 'icon';
  return isComponentNode(node) ? 'component' : '';
});

/**
 * 点击命中的节点：图标资源里点到图标内部时取整个图标；
 * 在组件 / 实例内部时取最外层的组件（点到按钮里的文字、图标，也选中整个按钮）；
 * 否则取最深的节点。没点到这个图层块返回 null
 */
function pickNode(tree, x, y) {
  const hit = hitTest(tree.root, x, y);
  let icon = null;
  let found = hit;
  for (let node = hit; node; node = tree.parentMap.get(node.id)) {
    if (props.iconMode && isIconNode(node)) icon = node;
    if (isComponentNode(node)) found = node;
  }
  return icon ?? found;
}

/** 点击位置换算成 page 坐标 */
function pointFromEvent(event) {
  const board = artboardRef.value;
  const size = pageSize.value;
  if (!board || !size) return null;
  const rect = board.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: ((event.clientX - rect.left) / rect.width) * size.w,
    y: ((event.clientY - rect.top) / rect.height) * size.h,
  };
}

function onPointerClick(event) {
  const point = pointFromEvent(event);
  if (!point) return;
  pendingPick.value = null;
  // 从最上层的图层块往下找
  for (let i = parts.value.length - 1; i >= 0; i--) {
    const part = parts.value[i];
    const tree = treeOf(part);
    if (tree) {
      const hit = pickNode(tree, point.x, point.y);
      if (!hit) continue;
      selectedId.value = hit.id;
      return;
    }
    const inside = point.x >= part.x && point.x <= part.x + part.w && point.y >= part.y && point.y <= part.y + part.h;
    if (!inside) continue;
    // 节点树第一次用到才请求
    selectedId.value = part.id;
    wantPart(part);
    if (assetStatus(part.treeSrc) !== 'error') {
      pendingPick.value = { partId: part.id, ...point };
      loadPartTree(part).then(() => resolvePendingPick(part.id));
    }
    return;
  }
  selectedId.value = '';
}

function resolvePendingPick(partId) {
  const pick = pendingPick.value;
  if (pick?.partId !== partId) return;
  pendingPick.value = null;
  const part = parts.value.find((item) => item.id === partId);
  const tree = part && treeOf(part);
  // 等待期间用户换了选中，就不再覆盖
  if (!tree || selectedId.value !== partId) return;
  selectedId.value = pickNode(tree, pick.x, pick.y)?.id ?? partId;
}

/** page 坐标的矩形 → 相对画板的百分比定位 */
function rectStyle(rect) {
  const size = pageSize.value;
  if (!size) return null;
  const percent = (value, total) => `${(value / total) * 100}%`;
  return {
    left: percent(rect.x, size.w),
    top: percent(rect.y, size.h),
    width: percent(rect.w, size.w),
    height: percent(rect.h, size.h),
  };
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    MessagePlugin.success(successMessage);
  } catch {
    MessagePlugin.error(t('figmaGallery.copyFailed'));
  }
}

// ---------- SVG 渲染 ----------

/** 外链 / CDN 上的 SVG 不一定可信：去掉脚本、事件属性和非图片 / 锚点 / http(s) 的链接 */
const BLOCKED_SVG_TAGS = 'script, iframe, object, embed, link, meta, audio, video';
const SAFE_HREF = /^(#|data:image\/(png|jpe?g|gif|webp);|https?:)/i;

function sanitizeSvg(root) {
  root.querySelectorAll(BLOCKED_SVG_TAGS).forEach((element) => element.remove());
  for (const element of [root, ...root.querySelectorAll('*')]) {
    for (const { name, value } of [...element.attributes]) {
      const lower = name.toLowerCase();
      if (lower.startsWith('on')) element.removeAttribute(name);
      else if ((lower === 'href' || lower === 'xlink:href') && !SAFE_HREF.test(value.trim()))
        element.removeAttribute(name);
    }
  }
}

function parseSvg(source) {
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  const parsed = doc.documentElement;
  if (parsed.localName !== 'svg' || doc.querySelector('parsererror'))
    throw new Error(t('figmaGallery.errors.svgParse'));
  const svg = document.adoptNode(parsed);
  sanitizeSvg(svg);

  // 尺寸交给外层图层块控制；事件由画板统一按节点树命中
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.display = 'block';
  svg.style.pointerEvents = 'none';

  return svg;
}

// ---------- 缩放 ----------

/** 按设计稿尺寸计算（100% = 1:1） */
const displayScale = computed(() => {
  if (zoom.value !== 'fit') return zoom.value;
  const size = pageSize.value;
  const { width, height } = viewport.value;
  if (!size || !width || !height) return null;
  return Math.min(width / size.w, height / size.h, 1);
});

const artboardStyle = computed(() => {
  const size = pageSize.value;
  const scale = displayScale.value;
  if (!size || !scale) return null;
  return { width: `${size.w * scale}px`, height: `${size.h * scale}px` };
});

const zoomText = computed(() => (displayScale.value ? `${Math.round(displayScale.value * 1000) / 10}%` : '-'));

/**
 * 缩略图够不够清晰：屏幕上的显示倍率（含设备像素比）一超过缩略图倍率，缩略图就要被拉伸、会发糊，
 * 这时进入可视区的图层块改用完整图
 */
const THUMB_UPSCALE_LIMIT = 1;
const detailZoom = computed(() => {
  const thumbScale = Number(manifest.value?.thumbScale) || 0;
  const scale = displayScale.value ?? 0;
  return !thumbScale || scale * (window.devicePixelRatio || 1) > thumbScale * THUMB_UPSCALE_LIMIT;
});

/** 需要完整图的图层块：选中节点所在的、或在可视区且缩略图不够清晰 / 没有缩略图 */
function needsFull(part) {
  if (selected.value?.part === part) return true;
  return wantedParts.value.has(part.id) && (detailZoom.value || !part.thumbSrc);
}

watchEffect(() => {
  for (const part of parts.value) {
    if (needsFull(part)) requestFull(part);
  }
});

function stepZoom(direction) {
  const current = displayScale.value ?? 1;
  const next =
    direction > 0
      ? ZOOM_STEPS.find((step) => step > current + 1e-6) ?? ZOOM_STEPS.at(-1)
      : ZOOM_STEPS.findLast((step) => step < current - 1e-6) ?? ZOOM_STEPS[0];
  const rect = canvasRef.value?.getBoundingClientRect();
  // 按钮缩放以画布可视区中心为锚点
  zoomAt(next, rect ? rect.left + rect.width / 2 : 0, rect ? rect.top + rect.height / 2 : 0);
}

const MIN_ZOOM = ZOOM_STEPS[0];
const MAX_ZOOM = ZOOM_STEPS.at(-1);

function clampZoom(scale) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

/** 缩放到 scale，并保持屏幕坐标 (clientX, clientY) 下的设计稿内容不动 */
async function zoomAt(scale, clientX, clientY) {
  const canvas = canvasRef.value;
  const board = artboardRef.value;
  const next = clampZoom(scale);
  if (!canvas || !board) {
    zoom.value = next;
    return;
  }
  const before = board.getBoundingClientRect();
  const fx = before.width ? (clientX - before.left) / before.width : 0.5;
  const fy = before.height ? (clientY - before.top) / before.height : 0.5;
  zoom.value = next;
  await nextTick();
  const after = board.getBoundingClientRect();
  canvas.scrollLeft += after.left + fx * after.width - clientX;
  canvas.scrollTop += after.top + fy * after.height - clientY;
}

/**
 * 触控板双指捏合 / Ctrl(⌘) + 滚轮：只缩放画布内容，拦截浏览器的整页缩放。
 * 一帧内的多次滚轮事件合并处理，避免布局还没更新就按旧位置计算锚点
 */
let pendingWheelZoom = null;

function onCanvasWheel(event) {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  // deltaMode 1 为按行滚动（Firefox 鼠标滚轮）；单次幅度限制在 ±50，鼠标滚轮一格约缩放 1.6 倍
  const delta = Math.max(-50, Math.min(50, event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY));
  const base = pendingWheelZoom?.scale ?? displayScale.value ?? 1;
  if (!pendingWheelZoom) requestAnimationFrame(flushWheelZoom);
  pendingWheelZoom = {
    scale: clampZoom(base * Math.exp(-delta * 0.01)),
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

function flushWheelZoom() {
  const pending = pendingWheelZoom;
  pendingWheelZoom = null;
  if (pending) zoomAt(pending.scale, pending.clientX, pending.clientY);
}

/** Safari 的触控板捏合走 gesture 事件，不会触发 ctrlKey 滚轮 */
let gestureBaseScale = 1;

function onGestureStart(event) {
  event.preventDefault();
  gestureBaseScale = displayScale.value ?? 1;
}

function onGestureChange(event) {
  event.preventDefault();
  zoomAt(gestureBaseScale * event.scale, event.clientX, event.clientY);
}

const CANVAS_LISTENERS = [
  ['wheel', onCanvasWheel],
  ['gesturestart', onGestureStart],
  ['gesturechange', onGestureChange],
];

function updateViewport() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  // 内边距随侧栏展开 / 收起变化，按实际值扣除
  const style = getComputedStyle(canvas);
  const paddingX = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
  const paddingY = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);
  viewport.value = {
    width: Math.max(0, canvas.clientWidth - paddingX),
    height: Math.max(0, canvas.clientHeight - paddingY),
  };
}

const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateViewport);

watch(canvasRef, (element, previous) => {
  if (previous) {
    resizeObserver?.unobserve(previous);
    for (const [type, listener] of CANVAS_LISTENERS) previous.removeEventListener(type, listener);
  }
  if (element) {
    resizeObserver?.observe(element);
    // passive: false 才能 preventDefault 拦下浏览器缩放
    for (const [type, listener] of CANVAS_LISTENERS) element.addEventListener(type, listener, { passive: false });
    updateViewport();
  }
});

// ---------- manifest ----------

function findDefaultPage() {
  const target = props.defaultPage.trim().toLowerCase();
  return (
    (target &&
      pages.value.find((page) => page.id === props.defaultPage || page.label.toLowerCase().includes(target))) ||
    pages.value[0]
  );
}

/** 每次加载递增；manifestUrl 连续切换时只采用最后一次请求的结果 */
let manifestRequestId = 0;

/** 带文案 key 的错误，展示时再按当前语言翻译 */
function localizedError(key, params) {
  return Object.assign(new Error(key), { i18n: { key, params } });
}

async function loadManifest() {
  const requestId = ++manifestRequestId;
  loadStatus.value = 'loading';
  loadError.value = null;
  try {
    const response = await fetch(props.manifestUrl, { cache: 'no-cache' });
    if (!response.ok) throw localizedError('figmaGallery.errors.http', { status: response.status });
    const payload = await response.json();
    if (requestId !== manifestRequestId) return;
    if (!Array.isArray(payload.pages)) throw localizedError('figmaGallery.errors.missingPages');
    if (payload.schema !== MANIFEST_SCHEMA) throw localizedError('figmaGallery.errors.legacySchema');
    assets.clear();
    assetRequests.clear();
    fullRequested.clear();
    fullParts.value = new Set();
    manifest.value = payload;
    if (!pages.value.some((page) => page.id === activeId.value)) {
      activeId.value = findDefaultPage()?.id ?? '';
    }
    loadStatus.value = 'ready';
  } catch (error) {
    if (requestId !== manifestRequestId) return;
    loadError.value = error.i18n ?? { raw: error.message };
    loadStatus.value = 'error';
  }
}

// 切换了 manifest（如设计资源页切换 Web / Mobile / Chart）：清掉上一份的页面、搜索和目录状态后重新加载
watch(
  () => props.manifestUrl,
  () => {
    manifest.value = null;
    activeId.value = '';
    keyword.value = '';
    expandedKeys.value = [];
    expandedBeforeSearch = null;
    loadManifest();
  },
);

// 切换页面或刷新 manifest：清空选中和「已显示」记录
watch(
  () => [activePage.value?.id, manifest.value],
  () => {
    selectedId.value = '';
    wantedParts.value = new Set();
    revealActivePage();
  },
);

// 换了页面：缩放回到适应画布，画布滚回左上角
watch(
  () => activePage.value?.id,
  () => {
    zoom.value = 'fit';
    pendingPick.value = null;
    canvasRef.value?.scrollTo(0, 0);
  },
);

function onKeydown(event) {
  if (event.key !== 'Escape') return;
  if (selectedId.value) selectedId.value = '';
}

onMounted(() => {
  loadManifest();
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', updateViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', updateViewport);
  resizeObserver?.disconnect();
  partObserver?.disconnect();
});
</script>

<style scoped>
.gallery {
  border: 1px solid var(--td-component-stroke, #e7e7e7);
  border-radius: var(--td-radius-large, 9px);
  overflow: hidden;
  background: var(--td-bg-color-container, #fff);
}

.gallery__body {
  --gallery-anim-duration: var(--td-anim-duration-base, 0.2s);
  --gallery-anim-easing: var(--td-anim-time-fn-easing, cubic-bezier(0.38, 0, 0.24, 1));

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 420px;
}

/* ---------- 侧栏 ---------- */

/* 悬浮在画布左上角，与左、上边缘保持 16px 间距 */
.gallery__sidebar {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 570px;
  /* 画布较矮时不超出底部 */
  max-height: calc(100% - 32px);
  overflow: hidden;
  background: var(--td-bg-color-container, #fff);
  border: 1px solid var(--td-component-stroke, #e7e7e7);
  border-radius: var(--td-radius-medium, 6px);
  box-shadow: var(--td-shadow-2, 0 3px 14px 2px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.06));
}

/*
 * 收起 / 展开动画：用 clip-path 把侧栏裁到左上角展开按钮的大小，宽高一起收缩，内容不重排。
 * 展开态用负的 inset，避免过渡期间裁掉阴影
 */
.gallery-sidebar-enter-active,
.gallery-sidebar-leave-active {
  clip-path: inset(-24px round var(--td-radius-medium, 6px));
  transition: clip-path var(--gallery-anim-duration) var(--gallery-anim-easing),
    opacity var(--gallery-anim-duration) var(--gallery-anim-easing);
}

.gallery-sidebar-enter-from,
.gallery-sidebar-leave-to {
  clip-path: inset(0 calc(100% - 104px) calc(100% - 30px) 0 round var(--td-radius-default, 3px));
  opacity: 0;
}

.gallery__search {
  flex: none;
  width: auto;
  margin: 12px 12px 8px;
}

.gallery__tree-head {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 6px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--td-text-color-primary, rgba(0, 0, 0, 0.9));
}

.gallery__tree {
  flex: 1;
  min-height: 0;
  padding: 0 6px 8px;
  overflow-y: auto;
  /* 覆盖 t-tree 默认的 body-medium（14px） */
  font-size: 12px;
}

.gallery__tree :deep(.t-tree__label) {
  flex: 1;
  min-width: 0;
}

.gallery__node {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.gallery__node--current {
  font-weight: 600;
}

.gallery__node-icon {
  flex: none;
  font-size: 16px;
  color: var(--td-text-color-secondary, rgba(0, 0, 0, 0.6));
}

.gallery__node-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery__count {
  flex: none;
  margin-right: auto;
  margin-left: 4px;
  font-weight: 400;
  color: var(--td-text-color-placeholder, rgba(0, 0, 0, 0.4));
  font-variant-numeric: tabular-nums;
}

/* ---------- 画布 ---------- */

.gallery__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--td-bg-color-secondarycontainer, #f3f3f3);
}

.gallery__fold {
  flex: none;
  color: var(--td-text-color-secondary, rgba(0, 0, 0, 0.6));
}

/* 目录收起后的悬浮入口：固定在画布左上角，不随画布滚动 */
.gallery__unfold {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  max-width: min(240px, calc(100% - 32px));
  /* t-button 小号固定 24px 高，改成由内边距撑开 */
  height: auto;
  padding: 4px 8px;
  background: var(--td-bg-color-container, #fff);
  box-shadow: var(--td-shadow-1, 0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.08));
  /* 等侧栏基本收到按钮大小后再淡入，衔接收起动画 */
  animation: gallery-fade-in var(--gallery-anim-duration) var(--gallery-anim-easing)
    calc(var(--gallery-anim-duration) * 0.6) both;
}

@keyframes gallery-fade-in {
  from {
    opacity: 0;
  }
}

.gallery__unfold-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery__canvas {
  display: flex;
  /* 固定高度：缩放只改变内部画板大小，超出部分在画布内滚动（flex: none，避免 flex 基准值覆盖 height、被内容撑高） */
  flex: none;
  box-sizing: border-box;
  height: calc(70vh + 32px);
  padding: 16px;
  overflow: auto;
  /* 让位的内边距跟着侧栏动画变化；「适应画布」比例随画布尺寸逐帧跟上 */
  transition: padding-left var(--gallery-anim-duration) var(--gallery-anim-easing);
}

/* 目录展开时给悬浮侧栏让出位置（16 + 260 + 16），「适应画布」缩放不会被侧栏挡住 */
.gallery__body:not(.gallery__body--collapsed) .gallery__canvas {
  padding-left: 292px;
}

.gallery__artboard {
  position: relative;
  flex: none;
  /* auto margin：内容小于画布时居中，超出时可正常滚动到左/上边缘 */
  margin: auto;
  user-select: none;
}

.gallery__part {
  position: absolute;
  overflow: hidden;
}

/* 还没进入可视区 / 内容没下载完的图层块：骨架屏铺满整块 */
.gallery__skeleton,
.gallery__skeleton :deep(.t-skeleton__row) {
  height: 100%;
}

.gallery__skeleton {
  position: absolute;
  inset: 0;
}

.gallery__skeleton :deep(.t-skeleton__row) {
  margin: 0;
}

.gallery__skeleton :deep(.t-skeleton__col) {
  border-radius: 0;
}

.gallery__svg {
  width: 100%;
  height: 100%;
}

.gallery__image,
.gallery__wireframe {
  display: block;
  width: 100%;
  height: 100%;
}

/* 完整图盖在缩略图上，下载完之前还能看到缩略图 */
.gallery__image--full {
  position: absolute;
  inset: 0;
}

.gallery__wireframe {
  background: var(--td-bg-color-container, #fff);
}

.gallery__wire {
  fill: none;
  stroke: var(--td-component-border, #dcdcdc);
  stroke-width: 1;
}

.gallery__wire--text {
  fill: var(--td-bg-color-component, #e7e7e7);
  stroke: none;
}

/* 选中框：和 Figma 一样用 1px 细线，画在节点外侧（box-shadow 不占内容区），小节点也不会被框线盖住 */
.gallery__box {
  position: absolute;
  pointer-events: none;
  box-shadow: 0 0 0 1px var(--td-brand-color, #0052d9);
}

.gallery__box-label,
.gallery__box-size {
  position: absolute;
  max-width: 240px;
  padding: 1px 4px;
  overflow: hidden;
  font-size: 11px;
  line-height: 16px;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--td-brand-color, #0052d9);
  border-radius: 2px;
}

.gallery__box-label {
  bottom: 100%;
  left: -1px;
  margin-bottom: 3px;
}

.gallery__box-size {
  top: 100%;
  left: 50%;
  margin-top: 4px;
  transform: translateX(-50%);
}

/* ---------- 检查器 ---------- */

.gallery__inspector {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  width: min(300px, calc(100% - 24px));
  max-height: calc(100% - 64px);
  padding: 12px;
  overflow-y: auto;
  font-size: 12px;
  color: var(--td-text-color-primary, rgba(0, 0, 0, 0.9));
  background: var(--td-bg-color-container, #fff);
  border: 1px solid var(--td-component-stroke, #e7e7e7);
  border-radius: var(--td-radius-medium, 6px);
  box-shadow: var(--td-shadow-2, 0 3px 14px 2px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.06));
}

.gallery__inspector-head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gallery__inspector-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery__props-title {
  margin-top: 12px;
  margin-bottom: 4px;
  font-weight: 600;
  color: var(--td-text-color-primary, rgba(0, 0, 0, 0.9));
}

/* 检查器很窄：压缩 t-descriptions 的行距和字号 */
.gallery__props :deep(.t-descriptions__label),
.gallery__props :deep(.t-descriptions__content) {
  padding: 3px 8px 3px 0;
  font-size: 12px;
  line-height: 18px;
  vertical-align: top;
  overflow-wrap: anywhere;
}

.gallery__props :deep(.t-descriptions__label) {
  color: var(--td-text-color-secondary, rgba(0, 0, 0, 0.6));
}

.gallery__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
}

.gallery__color {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--td-font-family-medium, monospace);
}

.gallery__swatch {
  width: 12px;
  height: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.gallery__inspector-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--td-component-stroke, #e7e7e7);
}

/* ---------- 缩放（悬浮在画布右下角） ---------- */

.gallery__zoom {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--td-text-color-secondary, rgba(0, 0, 0, 0.6));
  background: var(--td-bg-color-container, #fff);
  border: 1px solid var(--td-component-stroke, #e7e7e7);
  border-radius: var(--td-radius-medium, 6px);
  box-shadow: var(--td-shadow-1, 0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.08));
}

.gallery__zoom-value {
  min-width: 44px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.gallery__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px;
}

@media (max-width: 720px) {
  /* 窄屏不悬浮，目录放在画布上方 */
  .gallery__sidebar {
    position: static;
    width: auto;
    height: auto;
    max-height: 320px;
    border-width: 0 0 1px;
    border-radius: 0;
    box-shadow: none;
  }

  .gallery__body:not(.gallery__body--collapsed) .gallery__canvas {
    padding-left: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery__body {
    --gallery-anim-duration: 0s;
  }
}
</style>
