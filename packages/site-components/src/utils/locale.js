import { getLang, isEn } from '../utils';

const callbacks = [];

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

function registerLocaleChange(cb = defaultChangeCallBack) {
  if (callbacks.includes(cb)) return;
  callbacks.push(cb);
  document.addEventListener('tdesign_site_lang', cb);
}

function jumpLocation(url) {
  return isEn() ? `${url}-en` : url;
}

export { getLang, jumpLocation, registerLocaleChange };
