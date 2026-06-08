import enText from './en-US';
import cnText from './zh-CN';

export function useLang() {
  const isEn = window.location.pathname.endsWith('en');
  const lang = isEn ? enText : cnText;
  return { lang, isEn };
}
