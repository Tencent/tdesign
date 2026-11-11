import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLang, jumpLocation } from '../utils/locale';

describe('locale jumpLocation', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { pathname: '/react/components/button' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('leaves the url untouched on a Chinese page', () => {
    expect(jumpLocation('/source')).toBe('/source');
    expect(jumpLocation('https://tdesign.tencent.com/starter/')).toBe('https://tdesign.tencent.com/starter/');
  });

  it('appends the -en marker to a plain in-site path', () => {
    vi.stubGlobal('location', { pathname: '/react/components/button-en' });
    expect(jumpLocation('/source')).toBe('/source-en');
    expect(jumpLocation('/about/introduce')).toBe('/about/introduce-en');
    expect(jumpLocation('/vue-next/overview')).toBe('/vue-next/overview-en');
  });

  it('attaches the marker to the last segment when the url ends with a slash', () => {
    vi.stubGlobal('location', { pathname: '/source-en' });
    // the site's own English routes are /icons-en, /source-en (see site/src/pages/design/icon.vue),
    // so the marker must never become a path segment of its own
    expect(jumpLocation('https://tdesign.tencent.com/starter/')).toBe('https://tdesign.tencent.com/starter-en');
    expect(jumpLocation('/starter/')).toBe('/starter-en');
  });

  it('keeps the marker in the path when the url has a query or a hash', () => {
    vi.stubGlobal('location', { pathname: '/source-en' });
    expect(jumpLocation('/search?keyword=button')).toBe('/search-en?keyword=button');
    expect(jumpLocation('/about/introduce#team')).toBe('/about/introduce-en#team');
    expect(jumpLocation('/search?keyword=button#top')).toBe('/search-en?keyword=button#top');
  });

  it('does not invent a segment for a url whose path is only slashes', () => {
    vi.stubGlobal('location', { pathname: '/index-en' });
    expect(jumpLocation('/')).toBe('/');
    expect(jumpLocation('')).toBe('');
  });

  it('getLang agrees with the -en pathname convention', () => {
    expect(getLang()).toBe('zh');
    vi.stubGlobal('location', { pathname: '/icons-en' });
    expect(getLang()).toBe('en');
  });
});
