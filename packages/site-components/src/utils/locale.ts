import { getLang, isEn } from '../utils';

const callbacks: EventListener[] = [];

function defaultChangeCallBack() {
  if (isEn()) {
    const zhPathname = location.pathname.slice(0, -3);
    location.pathname = zhPathname;
  } else {
    if (location.pathname === '/') {
      location.pathname = 'index-en';
    } else {
      location.pathname = `${location.pathname}-en`;
    }
  }
}

function registerLocaleChange(cb: EventListener = defaultChangeCallBack) {
  if (callbacks.includes(cb)) return;
  callbacks.push(cb);
  document.addEventListener('tdesign_site_lang', cb);
}

function jumpLocation(url: string) {
  if (!isEn()) return url;
  // 英文路由的约定是把 -en 贴在最后一段路径上（/icons-en、/source-en），所以标记要加在 path
  // 末尾而不是整个 URL 末尾：直接拼接会让 /starter/ 变成 /starter/-en，还会把 query/hash 一起改写。
  const [path, ...rest] = url.split(/([?#])/);
  const base = path.replace(/\/+$/, '');
  if (!base) return url;
  return `${base}-en${rest.join('')}`;
}

export { getLang, jumpLocation, registerLocaleChange };
