import { createI18n } from 'vue-i18n';

export const DEFAULT_LOCALE = 'zh-CN';
export const EN_LOCALE = 'en-US';
export type Locale = typeof DEFAULT_LOCALE | typeof EN_LOCALE;

export function getLocaleFromPath(pathname = window.location.pathname): Locale {
  return /-en\/?$/.test(pathname) ? EN_LOCALE : DEFAULT_LOCALE;
}

export const i18n = createI18n({
  legacy: false,
  locale: getLocaleFromPath(),
  fallbackLocale: DEFAULT_LOCALE,
  missingWarn: false,
  fallbackWarn: false,
});

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
}
