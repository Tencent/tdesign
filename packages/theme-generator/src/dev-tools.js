// dev-only 调试面板逻辑（不进入构建产物：build 走 lib 模式，入口为 wc-entry.js）。
// 作为独立 module 引入，让 `cssbeautify` 这类裸导入走 Vite 常规 JS 转译管线。
import cssbeautify from 'cssbeautify';

const DEV_DEVICE_KEY = 'td-dev-device';
const DEV_SHOW_SETTING_KEY = 'td-dev-show-setting';
const CUSTOM_THEME_ID = 'custom-theme';
const CUSTOM_DARK_ID = 'custom-theme-dark';
const CUSTOM_EXTRA_ID = 'custom-theme-extra';

const root = document.documentElement;
const deviceSelect = document.getElementById('dev-device');
const showSetting = document.getElementById('dev-show-setting');

/* 重新挂载生成器：device / showSetting 仅在 onMounted 读取，
   运行时改属性不重跑初始化，故需移除并重新创建元素。 */
async function mountGenerator() {
  const device = deviceSelect.value;
  const show = showSetting.checked;
  const mode = root.getAttribute('theme-mode');
  document.querySelector('td-theme-generator')?.remove();
  const el = document.createElement('td-theme-generator');
  if (device) el.setAttribute('device', device);
  if (show) el.setAttribute('show-setting', '');
  if (mode) el.setAttribute('theme-mode', mode);
  document.body.appendChild(el);
  // 非 web 设备不展示尺寸色阶（对应 extra.css 不含 --td-size-*）
  document.getElementById('dev-size-section')?.classList.toggle('dev-hidden', device !== 'web');
  refreshInspector();
}

/* ---------- 设备 / showSetting ---------- */
// 回填持久化的选择
deviceSelect.value = localStorage.getItem(DEV_DEVICE_KEY) || 'web';
showSetting.checked = localStorage.getItem(DEV_SHOW_SETTING_KEY) === 'true';

deviceSelect.addEventListener('change', async () => {
  localStorage.setItem(DEV_DEVICE_KEY, deviceSelect.value);
  await mountGenerator();
});
showSetting.addEventListener('change', async () => {
  localStorage.setItem(DEV_SHOW_SETTING_KEY, String(showSetting.checked));
  await mountGenerator();
});

/* ---------- 重置主题 ---------- */
document.getElementById('dev-reset').addEventListener('click', async () => {
  localStorage.removeItem('custom-theme-options');
  localStorage.removeItem('custom-theme-tokens');
  await mountGenerator();
});

/* ---------- 导出 / 复制 CSS ---------- */
function collectCss() {
  const ids = [CUSTOM_THEME_ID, CUSTOM_DARK_ID, CUSTOM_EXTRA_ID];
  const raw = ids
    .map((id) => document.getElementById(id)?.textContent || '')
    .join('\n')
    .trim();
  return raw ? cssbeautify(raw) : '/* 暂无生成的主题样式 */';
}
document.getElementById('dev-export').addEventListener('click', () => {
  const blob = new Blob([collectCss()], { type: 'text/css' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'theme.css';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('dev-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(collectCss());
    // eslint-disable-next-line no-alert
    alert('已复制生成的 CSS 到剪贴板');
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('复制失败：' + e.message);
  }
});

/* ---------- Token 检视面板 ---------- */
const inspector = document.getElementById('dev-inspector');
const inspLight = document.getElementById('dev-insp-light');
const inspDark = document.getElementById('dev-insp-dark');
let inspObserver = null;

// 解析 hex / rgb() / rgba() 颜色为 {r,g,b}，失败返回 null
function parseColor(value) {
  const v = value.trim();
  if (v.startsWith('#')) {
    let hex = v.slice(1);
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    if (hex.length === 8) hex = hex.slice(0, 6); // 丢弃 alpha
    if (hex.length >= 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
    return null;
  }
  const m = v.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(',').map((s) => parseFloat(s));
    if (parts.length >= 3) return { r: parts[0], g: parts[1], b: parts[2] };
  }
  return null;
}
// 把 rgb()/hex 统一转成 #RRGGBB，便于展示
function rgbToHex(value) {
  const c = parseColor(value);
  if (!c) return value.trim();
  return (
    '#' +
    [c.r, c.g, c.b]
      .map((n) => Math.round(n).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}
// 相对亮度，决定色块上标注文字用黑还是白
function luminance(value) {
  const c = parseColor(value);
  if (!c) return 1;
  const f = (x) => {
    x /= 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}
// 品牌色阶实时标注当前计算值（调色时同步刷新）
function updateSwatchLabels() {
  document.querySelectorAll('#dev-preview .dev-swatch[data-var]').forEach((el) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(el.dataset.var).trim();
    if (!raw) return;
    el.textContent = rgbToHex(raw);
    const light = luminance(raw) > 0.5;
    el.style.color = light ? '#000' : '#fff';
    el.style.textShadow = light ? 'none' : '0 1px 2px rgba(0,0,0,.5)';
  });
}

// 间距/尺寸等非颜色 token 的实时数值标注
function updateVarLabels() {
  document.querySelectorAll('#dev-preview [data-var-value]').forEach((el) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(el.dataset.varValue).trim();
    el.textContent = raw || '—';
  });
}

// 顶部状态栏：设备 / 模式 / 当前品牌色
function updateStatus() {
  document.getElementById('dev-status-device').textContent = deviceSelect.value;
  const mode = root.getAttribute('theme-mode') || 'light';
  document.getElementById('dev-status-mode').textContent = mode;
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--td-brand-color-7').trim();
  const hex = rgbToHex(brand);
  document.getElementById('dev-status-brand').textContent = hex || '—';
  document.getElementById('dev-status-dot').style.background = hex || 'transparent';
}

// 集中刷新预览区与状态栏（色值/数值/状态）
function updatePreview() {
  updateSwatchLabels();
  updateVarLabels();
  updateStatus();
}

function refreshInspector() {
  const light = document.getElementById(CUSTOM_THEME_ID)?.textContent;
  const dark = document.getElementById(CUSTOM_DARK_ID)?.textContent;
  if (light || dark) {
    inspLight.value = light || '';
    inspDark.value = dark || '';
  }
  updatePreview();
  // 重新观察（重挂载后节点被替换）
  inspObserver?.disconnect();
  inspObserver = new MutationObserver(refreshInspector);
  // 三个样式表都要观察：颜色 token 在 custom-theme/dark，size/radius/font 在 extra
  [CUSTOM_THEME_ID, CUSTOM_DARK_ID, CUSTOM_EXTRA_ID].forEach((id) => {
    const node = document.getElementById(id);
    if (node) inspObserver.observe(node, { childList: true });
  });
}

document.getElementById('dev-insp-toggle').addEventListener('click', () => {
  inspector.classList.toggle('dev-open');
  if (inspector.classList.contains('dev-open')) refreshInspector();
});
document.getElementById('dev-insp-close').addEventListener('click', () => {
  inspector.classList.remove('dev-open');
});

/* ---------- 深浅色切换 ---------- */
const toggle = document.getElementById('dev-mode-toggle');
const renderToggle = () => {
  const isDark = root.getAttribute('theme-mode') === 'dark';
  toggle.textContent = isDark ? '☀️' : '🌙';
  toggle.classList.toggle('dev-dark', isDark);
};
toggle.addEventListener('click', () => {
  const isDark = root.getAttribute('theme-mode') === 'dark';
  root.setAttribute('theme-mode', isDark ? 'light' : 'dark');
});
// 跟随外部属性变化刷新按钮文案与预览（深浅色切换时样式表不变，但变量计算值改变，
// 需主动刷新色阶标注/对比文字/状态栏，否则深色块上仍是浅色态的黑字标注）
new MutationObserver(() => {
  renderToggle();
  updatePreview();
}).observe(root, { attributes: true, attributeFilter: ['theme-mode'] });
renderToggle();
updatePreview();

// 生成器挂载后首次填充检视面板：样式表在其 onMounted 中异步创建，
// 用 head childList 观察兜底，避免固定 setTimeout 在冷启动时早于挂载完成。
function waitForStylesheetsThenInit() {
  if (document.getElementById(CUSTOM_THEME_ID)) {
    refreshInspector();
    return;
  }
  const obs = new MutationObserver(() => {
    if (document.getElementById(CUSTOM_THEME_ID)) {
      obs.disconnect();
      refreshInspector();
    }
  });
  obs.observe(document.head, { childList: true });
  // 兜底：最长等 2s，超时也刷新一次（读取此时已有内容）
  window.setTimeout(() => {
    obs.disconnect();
    refreshInspector();
  }, 2000);
}
/* ---------- 多框架组件预览 Tab（纯 HTML，框架无关） ---------- */
const fwTabs = document.getElementById('dev-fw-tabs');
const fwPanels = document.querySelectorAll('#dev-preview .dev-code[data-fw]');
fwTabs?.addEventListener('click', (e) => {
  const btn = e.target.closest('.dev-fw-tab');
  if (!btn) return;
  const fw = btn.dataset.fw;
  fwTabs.querySelectorAll('.dev-fw-tab').forEach((t) => t.classList.toggle('is-active', t === btn));
  fwPanels.forEach((p) => {
    p.hidden = p.dataset.fw !== fw;
  });
});

waitForStylesheetsThenInit();
