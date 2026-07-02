<template>
  <t-popup ref="popupRef" v-bind="$attrs" :visible="visible" @visible-change="handleVisibleChange">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </t-popup>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { Popup as TPopup } from 'tdesign-vue-next/lib';

defineOptions({ name: 'ShadowPopup', inheritAttrs: false });

const emit = defineEmits(['visible-change']);

// 自管理 visible：Shadow DOM 下 TDesign 的两处 outside/hover 检测会误关闭弹层，
// 这里在 visible-change 里否决这类关闭，对外行为与 uncontrolled t-popup 一致。
const popupRef = ref();
const visible = ref(false);

// overlay 外层 div（带 data-td-popup 属性）。getOverlay() 返回内层 content，
// 通过 .closest('[data-td-popup]') 拿到外层。仅在 visible 时存在（destroyOnClose）。
let overlayEl = null;
// overlay mouseleave 时光标正移向某个子弹层 → 置位，供随后的 hover 关闭否决
let vetoHoverHide = false;
let vetoTimer = null;
// mousedown 同步阶段记录：本次点击是否落在任意弹层 overlay 内（用于区分"点弹层内部"与"点其它触发器/外部"）
let lastClickInsidePopup = false;

function onDocumentMouseDown(ev) {
  // composedPath 可穿透 shadow 边界还原真实路径；TDesign 给每个弹层 overlay 打了 data-td-popup。
  // 必须在同步阶段记录 —— TDesign 的 hide() 用 setTimeout，回调时 composedPath() 已清空。
  const path = typeof ev.composedPath === 'function' ? ev.composedPath() : [];
  lastClickInsidePopup = path.some(
    (el) => el && el.nodeType === 1 && el.hasAttribute && el.hasAttribute('data-td-popup'),
  );
}

/**
 * 判断目标元素是否为本弹层的（直接或间接）子弹层。
 * 沿 data-td-popup-parent 链在 rootNode（shadowRoot）内上溯，命中本弹层 id 即为子孙。
 */
function isDescendantPopup(destEl) {
  if (!overlayEl || !destEl || !destEl.closest) return false;
  const dest = destEl.closest('[data-td-popup]');
  if (!dest || dest === overlayEl) return false;
  const myId = overlayEl.getAttribute('data-td-popup');
  const root = overlayEl.getRootNode();
  let cur = dest;
  let guard = 0;
  while (cur && guard++ < 20) {
    const pid = cur.getAttribute('data-td-popup-parent');
    if (!pid || pid === 'undefined' || pid === 'null') return false;
    if (pid === myId) return true;
    cur = root.querySelector(`[data-td-popup="${pid}"]`);
  }
  return false;
}

function onOverlayMouseLeave(ev) {
  // 光标正移向子弹层 → 否决 TDesign 即将触发的 hover 关闭
  if (isDescendantPopup(ev.relatedTarget)) {
    vetoHoverHide = true;
    clearTimeout(vetoTimer);
    // 标志存活时间需 > TDesign 的 hide delay（hover=150ms），留余量
    vetoTimer = setTimeout(() => {
      vetoHoverHide = false;
    }, 300);
  }
}

function attach() {
  const inner = popupRef.value?.getOverlay?.();
  const pop = inner?.closest?.('[data-td-popup]');
  if (pop && pop !== overlayEl) {
    overlayEl = pop;
    pop.addEventListener('mouseleave', onOverlayMouseLeave);
  }
}

function detach() {
  if (overlayEl) {
    overlayEl.removeEventListener('mouseleave', onOverlayMouseLeave);
  }
  overlayEl = null;
  clearTimeout(vetoTimer);
  vetoHoverHide = false;
}

watch(visible, (v) => {
  if (v) {
    nextTick(attach);
  } else {
    detach();
  }
});

// capture 阶段监听 document mousedown，与 TDesign 的 onDocumentMouseDown 同阶段。
// 在 onMounted 绑定（而非 attach 内）—— 点击否决逻辑只依赖 composedPath，不依赖 overlay ref，
// 且 onMounted 绑定可保证监听器在事件派发前就位。
onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown, true);
});

onBeforeUnmount(() => {
  detach();
  document.removeEventListener('mousedown', onDocumentMouseDown, true);
});

function handleVisibleChange(v, ctx) {
  // 1) 点击外部关闭：shadow DOM 下 event.target 被重定向到 shadow host → TDesign 的
  //    popperEl.contains(ev.target) 误判为外部点击。但"点击 shadowRoot 内部"有两种情况：
  //    (a) 点当前弹层 overlay 内部 → 应保留（否决）
  //    (b) 点另一个弹层的触发器 / shadowRoot 内其它区域 → 应关闭（不否决，让 TDesign 关，
  //        父组件 hoverIdx 等逻辑才能切换）
  //    用 mousedown 同步阶段记录的 lastClickInsidePopup 区分：落在任意 overlay 内才算内部。
  if (!v && ctx?.trigger === 'document' && ctx.e?.target?.localName === 'td-theme-generator' && lastClickInsidePopup) {
    return;
  }

  // 2) hover 关闭：shadow DOM 下 getPopperTree 用 document.querySelectorAll 不穿透 shadow 边界
  //    → 父弹层误判光标已离开子弹层 → 关闭。两类场景否决：
  if (!v && ctx?.trigger === 'trigger-element-hover') {
    // (a) 本弹层 overlay 的 mouseleave 时光标正移向子弹层 → 标志已置位
    if (vetoHoverHide) {
      vetoHoverHide = false;
      clearTimeout(vetoTimer);
      return;
    }
    // (b) 子弹层的 onMouseLeave 经 assertMouseLeave 转发到本弹层；
    //     其 ev.relatedTarget 指向本弹层 overlay 内 → 光标仍在父弹层上 → 否决
    const rt = ctx.e?.relatedTarget;
    if (rt && overlayEl && overlayEl.contains(rt)) return;
  }

  visible.value = v;
  emit('visible-change', v, ctx);
}
</script>
