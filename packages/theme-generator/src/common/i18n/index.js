import enText from './en-US';
import cnText from './zh-CN';

/**
 * 根据当前页面 URL 推断语言（路径以 `en` 结尾则为英文）。
 * 语言在组件生命周期内固定不变，因此返回普通值即可。
 */
export function useLang() {
  const isEn = window.location.pathname.endsWith('en');
  const lang = isEn ? enText : cnText;
  return { lang, isEn };
}
