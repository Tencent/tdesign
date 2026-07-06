import { describe, it, expect, afterEach } from 'vitest';
import { useLang } from '../index';
import enText from '../en-US';
import cnText from '../zh-CN';

describe('useLang', () => {
  const originalLocation = window.location;

  afterEach(() => {
    // 还原 window.location
    delete window.location;
    window.location = originalLocation;
  });

  function setPathname(pathname) {
    delete window.location;
    window.location = { ...originalLocation, pathname };
  }

  it('路径不以 -en 结尾时返回中文文案', () => {
    setPathname('/');
    const { lang, isEn } = useLang();
    expect(isEn).toBe(false);
    expect(lang).toBe(cnText);
  });

  it('路径以 -en 结尾时返回英文文案', () => {
    setPathname('/button-en');
    const { lang, isEn } = useLang();
    expect(isEn).toBe(true);
    expect(lang).toBe(enText);
  });

  it('路径仅以 en 结尾（无连字符）时返回中文文案', () => {
    // endsWith('en') 会误匹配 /scene、/open 等，因此用 -en 作为分隔
    setPathname('/en');
    const { isEn } = useLang();
    expect(isEn).toBe(false);
  });

  it('多次调用结果一致（语言在会话内固定）', () => {
    setPathname('/zh-CN');
    const a = useLang();
    const b = useLang();
    expect(a.isEn).toBe(b.isEn);
    expect(a.lang).toBe(b.lang);
  });
});
